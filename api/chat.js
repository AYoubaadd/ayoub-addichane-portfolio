const portfolioContext = require("../server/portfolio-context");
const {
  getClientIp,
  isRateLimited,
  isSameOrigin,
  sendJson,
  setCommonHeaders,
} = require("../server/api-utils");

const maxMessageLength = 1000;
const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
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
    } catch (error) {
      sendJson(response, 400, { code: "invalid_json" });
      return;
    }
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
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
    const providerResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: `${portfolioContext}\nRespond in ${locale}.` }],
          },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 700,
            temperature: 0.4,
          },
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!providerResponse.ok) {
      console.error("[portfolioChat] Gemini request failed", {
        status: providerResponse.status,
      });
      sendJson(response, 503, { code: "provider_unavailable" });
      return;
    }

    const result = await providerResponse.json();
    const candidate = result.candidates?.[0];
    const answer = candidate?.content?.parts
      ?.map((part) => typeof part.text === "string" ? part.text : "")
      .join("")
      .trim();

    if (!answer || blockedFinishReasons.has(candidate.finishReason)) {
      sendJson(response, 422, { code: "response_blocked" });
      return;
    }

    sendJson(response, 200, { response: answer });
  } catch (error) {
    console.error("[portfolioChat] Gemini request failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    sendJson(response, 503, { code: "provider_unavailable" });
  }
};
