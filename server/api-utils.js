const requestTimesByIp = new Map();
const rateLimitWindowMs = 60 * 60 * 1000;
const maxRequestsPerHour = 12;

function setCommonHeaders(response, cacheControl = "no-store") {
  response.setHeader("Cache-Control", cacheControl);
  response.setHeader("X-Content-Type-Options", "nosniff");
}

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

function isSameOrigin(request, allowMissingOrigin = false) {
  const origin = request.headers.origin;
  const forwardedHost = request.headers["x-forwarded-host"];
  const hostHeader = forwardedHost || request.headers.host;

  if (!origin) {
    return allowMissingOrigin && request.headers["sec-fetch-site"] !== "cross-site";
  }
  if (!hostHeader) return false;

  const host = String(hostHeader).split(",")[0].trim().toLowerCase();
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch (error) {
    return false;
  }
}

function getClientIp(request) {
  if (typeof request.ip === "string" && request.ip) return request.ip;
  const forwardedFor = request.headers["x-forwarded-for"];
  return typeof forwardedFor === "string"
    ? forwardedFor.split(",")[0].trim()
    : "";
}

function isRateLimited(ip, now = Date.now()) {
  const recentRequests = (requestTimesByIp.get(ip) || [])
    .filter((timestamp) => now - timestamp < rateLimitWindowMs);
  if (recentRequests.length >= maxRequestsPerHour) {
    requestTimesByIp.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestTimesByIp.set(ip, recentRequests);
  if (requestTimesByIp.size > 2000) {
    for (const [key, timestamps] of requestTimesByIp) {
      if (timestamps.every((timestamp) => now - timestamp >= rateLimitWindowMs)) {
        requestTimesByIp.delete(key);
      }
    }
    while (requestTimesByIp.size > 2000) {
      requestTimesByIp.delete(requestTimesByIp.keys().next().value);
    }
  }
  return false;
}

module.exports = {
  getClientIp,
  isRateLimited,
  isSameOrigin,
  sendJson,
  setCommonHeaders,
};
