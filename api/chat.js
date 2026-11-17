
const portfolioContext = require("../server/portfolio-context");

const {
  getClientIp,
  isRateLimited,
  isSameOrigin,
  sendJson,
  setCommonHeaders,
} = require("../server/api-utils");

const maxMessageLength = 1000;

// Nouveau modèle par défaut
const model =
  process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

const blockedFinishReasons = new Set([
  "SAFETY",
  "RECITATION",
  "BLOCKLIST",
  "PROHIBITED_CONTENT",
]);

module.exports = async function handler(request, response) {
  setCommonHeaders(response);

  if (!isSameOrigin(request)) {
    sendJson(response, 403, { code: "origin_not_allowed" });
    return;
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, { code: "method_not_allowed" });
    return;
  }

  let body = request.body;

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      sendJson(response, 400, { code: "invalid_json" });
      return;
    }
  }

  const message =
    typeof body?.message === "string"
      ? body.message.trim()
      : "";

  if (!message) {
    sendJson(response, 400, { code: "message_required" });
    return;
  }

  if (message.length > maxMessageLength) {
    sendJson(response, 400, { code: "message_too_long" });
    return;
  }

  const ip = getClientIp(request);

  if (!ip || isRateLimited(ip)) {
    sendJson(response, 429, { code: "rate_limited" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    sendJson(response, 503, { code: "server_not_configured" });
    return;
  }

  const locale = body.locale === "en" ? "English" : "French";

  try {
    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const providerResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: `${portfolioContext}\nRespond in ${locale}.`,
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 700,
          temperature: 0.4,
        },
      }),
      signal: AbortSignal.timeout(15000),
    });

    // Lire la réponse Google pour récupérer les erreurs détaillées
    const responseText = await providerResponse.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      result = {};
    }

    if (!providerResponse.ok) {
      console.error("[portfolioChat] Gemini request failed", {
        status: providerResponse.status,
        model,
        googleError:
          result.error?.message || "Unknown Gemini error",
        googleStatus:
          result.error?.status || "Unknown",
        googleCode:
          result.error?.code || providerResponse.status,
      });

      sendJson(response, 503, {
        code: "provider_unavailable",
      });

      return;
    }

    const candidate = result.candidates?.[0];

    const answer = candidate?.content?.parts
      ?.map((part) =>
        typeof part.text === "string" ? part.text : ""
      )
      .join("")
      .trim();

    if (
      !answer ||
      blockedFinishReasons.has(candidate?.finishReason)
    ) {
      console.warn("[portfolioChat] Gemini returned no usable answer", {
        model,
        finishReason: candidate?.finishReason || "UNKNOWN",
      });

      sendJson(response, 422, {
        code: "response_blocked",
      });

      return;
    }

    sendJson(response, 200, {
      response: answer,
    });

  } catch (error) {
    console.error("[portfolioChat] Gemini request failed", {
      model,
      errorType:
        error instanceof Error
          ? error.name
          : "UnknownError",
      errorMessage:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    sendJson(response, 503, {
      code: "provider_unavailable",
    });
  }
};
