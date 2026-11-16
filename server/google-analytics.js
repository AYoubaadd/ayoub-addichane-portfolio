
const crypto = require("node:crypto");

const tokenUrl = "https://oauth2.googleapis.com/token";
const analyticsScope =
  "https://www.googleapis.com/auth/analytics.readonly";

let cachedAccessToken;
let cachedAccessTokenExpiresAt = 0;

function parseServiceAccount(value) {
  if (!value) return null;

  try {
    const credentials = JSON.parse(value);

    if (
      credentials?.type !== "service_account" ||
      typeof credentials.client_email !== "string" ||
      typeof credentials.private_key !== "string"
    ) {
      return null;
    }

    return {
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key.replace(/\\n/g, "\n"),
      projectId: credentials.project_id || null,
    };
  } catch {
    return null;
  }
}

function encodeBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken(credentials) {
  if (
    cachedAccessToken &&
    cachedAccessTokenExpiresAt > Date.now() + 60000
  ) {
    return cachedAccessToken;
  }

  const issuedAt = Math.floor(Date.now() / 1000);

  const header = encodeBase64Url(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  );

  const payload = encodeBase64Url(
    JSON.stringify({
      iss: credentials.clientEmail,
      scope: analyticsScope,
      aud: tokenUrl,
      iat: issuedAt,
      exp: issuedAt + 3600,
    })
  );

  const unsignedAssertion = `${header}.${payload}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedAssertion);
  signer.end();

  const signature = signer.sign(
    credentials.privateKey,
    "base64url"
  );

  const assertion = `${unsignedAssertion}.${signature}`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type:
        "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(10000),
  });

  const tokenResponse = await response.json();

  if (!response.ok) {
    console.error("[analyticsVisitors] Authentication failed", {
      status: response.status,
      error: tokenResponse.error,
      description: tokenResponse.error_description,
    });

    throw new Error("google_auth_failed");
  }

  if (
    typeof tokenResponse.access_token !== "string" ||
    !tokenResponse.access_token
  ) {
    throw new Error("google_auth_invalid_response");
  }

  cachedAccessToken = tokenResponse.access_token;

  cachedAccessTokenExpiresAt =
    Date.now() +
    Number(tokenResponse.expires_in || 3600) * 1000;

  return cachedAccessToken;
}

async function getTotalUsers(credentials, propertyId) {
  const accessToken = await getAccessToken(credentials);

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [
          {
            startDate: "2000-01-01",
            endDate: "today",
          },
        ],
        metrics: [
          {
            name: "totalUsers",
          },
        ],
      }),
      signal: AbortSignal.timeout(10000),
    }
  );

  const responseText = await response.text();

  let report;

  try {
    report = JSON.parse(responseText);
  } catch {
    report = {};
  }

  if (!response.ok) {
    console.error(
      "[analyticsVisitors] Google Analytics report failed",
      {
        status: response.status,
        googleError: report.error?.message || "Unknown Google API error",
        googleStatus: report.error?.status || null,
        googleReasons:
          report.error?.details?.map(
            (detail) => detail.reason || detail.metadata?.reason
          ).filter(Boolean) || [],
        projectId: credentials.projectId,
        propertyId,
      }
    );

    throw new Error("analytics_report_failed");
  }

  const visitors = Number(
    report.rows?.[0]?.metricValues?.[0]?.value ?? 0
  );

  if (!Number.isSafeInteger(visitors) || visitors < 0) {
    throw new Error("analytics_invalid_visitor_count");
  }

  return visitors;
}

module.exports = {
  getTotalUsers,
  parseServiceAccount,
};
