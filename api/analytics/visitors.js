const {
  isSameOrigin,
  sendJson,
  setCommonHeaders,
} = require("../../server/api-utils");
const { getTotalUsers, parseServiceAccount } = require("../../server/google-analytics");

const cacheDurationMs = 15 * 60 * 1000;
const cacheHeaders = "public, max-age=900, s-maxage=900";
let cachedVisitorCount;
let cachedVisitorCountExpiresAt = 0;

module.exports = async function handler(request, response) {
  setCommonHeaders(response);

  if (!isSameOrigin(request, request.method === "GET")) {
    sendJson(response, 403, { code: "origin_not_allowed" });
    return;
  }
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    sendJson(response, 405, { code: "method_not_allowed" });
    return;
  }

  const measurementId = process.env.GA_MEASUREMENT_ID?.trim();
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  const credentials = parseServiceAccount(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
    sendJson(response, 503, { code: "analytics_not_configured" });
    return;
  }
  if (!propertyId || !/^\d+$/.test(propertyId) || !credentials) {
    sendJson(response, 503, { code: "analytics_not_configured", measurementId });
    return;
  }

  if (cachedVisitorCount && cachedVisitorCountExpiresAt > Date.now()) {
    response.setHeader("Cache-Control", cacheHeaders);
    sendJson(response, 200, { ...cachedVisitorCount, measurementId });
    return;
  }

  try {
    const visitors = await getTotalUsers(credentials, propertyId);
    cachedVisitorCount = { visitors, updatedAt: new Date().toISOString() };
    cachedVisitorCountExpiresAt = Date.now() + cacheDurationMs;
    response.setHeader("Cache-Control", cacheHeaders);
    sendJson(response, 200, { ...cachedVisitorCount, measurementId });
  } catch (error) {
    console.error("[analyticsVisitors] Google Analytics request failed", {
      errorType: error instanceof Error ? error.message : "UnknownError",
    });
    sendJson(response, 503, { code: "analytics_unavailable", measurementId });
  }
};
