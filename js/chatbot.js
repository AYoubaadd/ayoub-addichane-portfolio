import { ApiError, GoogleGenAI } from "@google/genai";
import { getTranslations } from "next-intl/server";
import { myContext } from "@/data/my_context";
import { readChatQuota, reserveChatQuestion } from "@/lib/chat-session";

export const maxDuration = 60;

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";
const DEFAULT_FALLBACKS = "gemini-3.8-flash,gemini-3.1-flash-lite";
const REQUEST_BUDGET_MS = 45_000;
const MODEL_TIMEOUT_MS = 20_000;
const MAX_MESSAGE_LENGTH = 1000;
const BLOCKED_FINISH_REASONS = new Set(["SAFETY", "RECITATION", "BLOCKLIST", "PROHIBITED_CONTENT", "SPII"]);

type ChatFailure = {
  status: number;
  code: string;
  error: string;
  next: "credential" | "model" | "none";
};

function geminiCredentials() {
  const configured = [
    { label: "primary", apiKey: process.env.GEMINI_API_KEY?.trim() },
    { label: "fallback", apiKey: process.env.GEMINI_API_KEY_FALLBACK?.trim() },
  ];
  const seen = new Set<string>();
  return configured.flatMap(({ label, apiKey }) => {
    if (!apiKey || seen.has(apiKey)) return [];
    seen.add(apiKey);
    return [{ label, client: new GoogleGenAI({
      apiKey, vertexai: false,
      // This endpoint owns retries so key fallback happens immediately on 429.
      httpOptions: { retryOptions: { attempts: 1 } },
    }) }];
  });
}

function geminiModelCandidates(): string[] {
  const primary = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const fallbacks = (process.env.GEMINI_MODEL_FALLBACKS ?? DEFAULT_FALLBACKS)
    .split(",").map((model) => model.trim()).filter(Boolean);
  return [...new Set([primary, ...fallbacks])].slice(0, 3);
}

function classifyGeminiError(error: unknown): ChatFailure {
  const status = error instanceof ApiError ? error.status : undefined;
  const message = error instanceof Error ? error.message : "";

  if (status === 401 || status === 403 || /API_KEY_INVALID|API_KEY_EXPIRED|API key (?:not valid|expired)|reported as leaked|PERMISSION_DENIED/i.test(message)) {
    return {
      status: 503, code: "provider_auth_error", next: "credential",
      error: "Uni is temporarily unavailable. Please try again later.",
    };
  }
  if (status === 429) {
    return {
      status: 429, code: "provider_rate_limit", next: "credential",
      error: "Uni has reached its usage limit. Please try again later.",
    };
  }
  if (status === 404) {
    return {
      status: 503, code: "model_unavailable", next: "model",
      error: "Uni is temporarily unavailable. Please try again later.",
    };
  }
  if (status === 408 || status === 504 || /abort|timed? ?out|deadline/i.test(message)) {
    return {
      status: 504, code: "provider_timeout", next: "model",
      error: "Uni took too long to respond. Please try again.",
    };
  }
  return {
    status: 503, code: "provider_unavailable",
    next: status === undefined || status >= 500 ? "model" : "none",
    error: "Uni couldn't connect to its AI service. Please try again later.",
  };
}

function providerReasons(error: unknown): string[] {
  if (!(error instanceof ApiError)) return [];
  try {
    const payload: unknown = JSON.parse(error.message);
    if (!payload || typeof payload !== "object") return [];
    const detail = "error" in payload ? payload.error : payload;
    if (!detail || typeof detail !== "object" || !("details" in detail) || !Array.isArray(detail.details)) return [];
    return detail.details.flatMap((entry: unknown) => entry && typeof entry === "object"
      && "reason" in entry && typeof entry.reason === "string" ? [entry.reason] : []);
  } catch {
    return [];
  }
}

function chatError(failure: ChatFailure, requestId: string) {
  return Response.json({ error: failure.error, code: failure.code, requestId }, {
    status: failure.status,
    headers: { "Cache-Control": "no-store", "X-Request-ID": requestId },
  });
}

export async function GET() {
  try {
    return Response.json(await readChatQuota(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("[Uni chat] Session quota unavailable");
    return Response.json({ error: "Uni is temporarily unavailable.", code: "session_unavailable" }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const credentials = geminiCredentials();
  if (credentials.length === 0) {
    console.error("[Uni chat] Missing Gemini credentials", { requestId });
    return chatError({
      status: 503, code: "not_configured", next: "none",
      error: "Uni is temporarily unavailable. Please try again later.",
    }, requestId);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = typeof body === "object" && body !== null
    && "message" in body && typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return Response.json({ error: "Message is required." }, { status: 400 });
  if (message.length > MAX_MESSAGE_LENGTH) {
    return Response.json({ error: "Message is too long. Please keep it under 1000 characters." }, { status: 400 });
  }

  const locale = typeof body === "object" && body !== null && "locale" in body && body.locale === "fr" ? "fr" : "en";
  let reservation: Awaited<ReturnType<typeof reserveChatQuestion>>;
  try {
    reservation = await reserveChatQuestion();
  } catch {
    console.error("[Uni chat] Could not reserve session question", { requestId });
    return chatError({
      status: 503, code: "session_unavailable", next: "none",
      error: "Uni is temporarily unavailable. Please try again later.",
    }, requestId);
  }
  if (!reservation.allowed) {
    const t = await getTranslations({ locale, namespace: "chatbot" });
    const contactUrl = `/${locale}#contact`;
    return Response.json({
      code: "session_limit", ...reservation.quota, requestId, contactUrl,
      response: `${t("contactInvite")}\n\n[${t("contactMohamed")}](${contactUrl})`,
    }, { status: 429, headers: { "Cache-Control": "no-store", "X-Request-ID": requestId } });
  }
  let answered = false;
  try {
    const candidates = geminiModelCandidates();
    const deadline = Date.now() + REQUEST_BUDGET_MS;
    let credentialIndex = 0;
    let modelIndex = 0;
    let failure: ChatFailure = {
      status: 503, code: "provider_unavailable", next: "model",
      error: "Uni is temporarily unavailable. Please try again later.",
    };

    while (modelIndex < candidates.length) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      const modelId = candidates[modelIndex];
      const credential = credentials[credentialIndex];
      try {
        const timeout = Math.min(MODEL_TIMEOUT_MS, remaining);
        const result = await credential.client.models.generateContent({
          model: modelId,
          contents: message,
          config: {
            systemInstruction: `${myContext}\nSite locale: ${locale}. Prefix internal paths with /${locale}.`,
            maxOutputTokens: 2048,
            abortSignal: AbortSignal.any([req.signal, AbortSignal.timeout(timeout)]),
            httpOptions: { timeout },
          },
        });
        const finishReason = result.candidates?.[0]?.finishReason;
        const blockReason = result.promptFeedback?.blockReason;
        if ((blockReason && blockReason !== "BLOCKED_REASON_UNSPECIFIED") || BLOCKED_FINISH_REASONS.has(finishReason ?? "")) {
          console.warn("[Uni chat] Gemini response blocked", {
            requestId, model: modelId, credential: credential.label, blockReason, finishReason,
          });
          return chatError({
            status: 422, code: "response_blocked", next: "none",
            error: "Uni couldn't answer that question. Please rephrase it and try again.",
          }, requestId);
        }
        const response = result.text?.trim();
        if (!response) {
          failure = {
            status: 502, code: "empty_response", next: "model",
            error: "Uni couldn't generate an answer. Please try again.",
          };
          console.warn("[Uni chat] Empty Gemini response", {
            requestId, model: modelId, credential: credential.label, finishReason,
          });
          modelIndex++;
          continue;
        }
        answered = true;
        return Response.json({ response, ...reservation.quota }, {
          headers: { "Cache-Control": "no-store", "X-Request-ID": requestId },
        });
      } catch (error) {
        failure = classifyGeminiError(error);
        // Never log the key, prompt, generated answer, or a raw SDK error object.
        // ErrorInfo.reason identifies key/quota issues without exposing request data.
        console.error("[Uni chat] Gemini request failed", {
          requestId, model: modelId, credential: credential.label, code: failure.code,
          providerStatus: error instanceof ApiError ? error.status : undefined,
          reasons: providerReasons(error),
          errorType: error instanceof Error ? error.name : "UnknownError",
        });
        if (req.signal.aborted) break;
        if (failure.next === "credential" && credentialIndex + 1 < credentials.length) {
          credentialIndex++;
          continue;
        }
        if (failure.next === "none" || failure.code === "provider_auth_error") break;
        // Once switched, keep using the fallback credential for this request.
        modelIndex++;
      }
    }

    return chatError(failure, requestId);
  } finally {
    if (!answered) {
      try {
        await reservation.refund();
      } catch {
        console.error("[Uni chat] Could not refund failed session question", { requestId });
      }
    }
  }
}