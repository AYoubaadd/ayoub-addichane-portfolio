
const portfolioContext = require("../server/portfolio-context");

const {
  getClientIp,
  isRateLimited,
  isSameOrigin,
  sendJson,
  setCommonHeaders,
} = require("../server/api-utils");

const maxMessageLength = 1000;

// Modèle principal et modèle de secours
const primaryModel =
  process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

const fallbackModel =
  process.env.GEMINI_FALLBACK_MODEL?.trim() ||
  "gemini-3.5-flash-lite";

// Temps maximum par tentative.
// Deux tentatives de 4 secondes permettent de limiter
// le risque de dépasser la durée d'exécution Vercel.
const requestTimeoutMs = 15000;

const blockedFinishReasons = new Set([
  "SAFETY",
  "RECITATION",
  "BLOCKLIST",
  "PROHIBITED_CONTENT",
]);

// Erreurs temporaires pour lesquelles on peut essayer
// le modèle de secours.
const retryableStatuses = new Set([
  408,
  429,
  500,
  502,
  503,
  504,
]);

/**
 * Appelle un modèle Gemini et retourne sa réponse textuelle.
 */
async function callGeminiModel(apiKey, modelName, message, locale) {
  const geminiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent`;

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
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 700,
        temperature: 0.4,
      },
    }),
    signal: AbortSignal.timeout(requestTimeoutMs),
  });

  const responseText = await providerResponse.text();

  let result;

  try {
    result = JSON.parse(responseText);
  } catch {
    result = {};
  }

  if (!providerResponse.ok) {
    const error = new Error(
      result.error?.message || "Gemini request failed"
    );

    error.status = providerResponse.status;
    error.googleStatus = result.error?.status;
    error.model = modelName;

    console.error("[portfolioChat] Gemini provider error", {
      status: error.status,
      model: modelName,
      googleError: error.message,
      googleStatus: error.googleStatus || "Unknown",
    });

    throw error;
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
    const error = new Error("gemini_response_blocked");
    error.code = "response_blocked";

    throw error;
  }

  return answer;
}

/**
 * Essaie le modèle principal puis le modèle de secours
 * en cas d'erreur temporaire ou de timeout.
 */
async function generateWithFallback(apiKey, message, locale) {
  const models = [...new Set([
    primaryModel,
    fallbackModel,
  ])];

  let lastError;

  for (const modelName of models) {
    try {
      console.log("[portfolioChat] Trying Gemini model", {
        model: modelName,
      });

      const answer = await callGeminiModel(
        apiKey,
        modelName,
        message,
        locale
      );

      console.log("[portfolioChat] Response generated", {
        model: modelName,
      });

      return answer;

    } catch (error) {
      lastError = error;

      const isTimeout = error.name === "TimeoutError";
      const isTemporary =
        error.status && retryableStatuses.has(error.status);

      // Les erreurs temporaires permettent de passer
      // au modèle suivant.
      if (isTimeout || isTemporary) {
        console.warn("[portfolioChat] Switching model", {
          failedModel: modelName,
          errorType: isTimeout ? "TimeoutError" : "ProviderError",
          status: error.status || null,
        });

        continue;
      }

      // Une erreur définitive ne doit pas déclencher
      // inutilement une autre requête.
      throw error;
    }
  }

  throw lastError || new Error("all_gemini_models_unavailable");
}

module.exports = async function handler(request, response) {
  setCommonHeaders(response);

  // Vérification de l'origine
  if (!isSameOrigin(request)) {
    sendJson(response, 403, {
      code: "origin_not_allowed",
    });
    return;
  }

  // Vérification de la méthode HTTP
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    sendJson(response, 405, {
      code: "method_not_allowed",
    });
    return;
  }

  // Lecture du corps de la requête
  let body = request.body;

  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      sendJson(response, 400, {
        code: "invalid_json",
      });
      return;
    }
  }

  // Validation du message
  const message =
    typeof body?.message === "string"
      ? body.message.trim()
      : "";

  if (!message) {
    sendJson(response, 400, {
      code: "message_required",
    });
    return;
  }

  if (message.length > maxMessageLength) {
    sendJson(response, 400, {
      code: "message_too_long",
    });
    return;
  }

  // Limitation des requêtes
  const ip = getClientIp(request);

  if (!ip || isRateLimited(ip)) {
    sendJson(response, 429, {
      code: "rate_limited",
    });
    return;
  }

  // Vérification de la clé API
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    sendJson(response, 503, {
      code: "server_not_configured",
    });
    return;
  }

  // Langue de réponse
  const locale =
    body.locale === "en" ? "English" : "French";

  try {
    const answer = await generateWithFallback(
      apiKey,
      message,
      locale
    );

    sendJson(response, 200, {
      response: answer,
    });

  } catch (error) {
    console.error("[portfolioChat] All Gemini attempts failed", {
      errorType: error.name || "UnknownError",
      errorMessage: error.message || "Unknown error",
      status: error.status || null,
    });

    sendJson(response, 503, {
      code: error.code === "response_blocked"
        ? "response_blocked"
        : "provider_unavailable",
    });
  }
};
