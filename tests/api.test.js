const assert = require("node:assert/strict");
const { generateKeyPairSync } = require("node:crypto");
const test = require("node:test");
const chatHandler = require("../api/chat");
const analyticsHandler = require("../api/analytics/visitors");

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

function createRequest({ method = "POST", body, headers = {}, ip = "192.0.2.1" } = {}) {
  return {
    method,
    body,
    headers: { host: "portfolio.example", ...headers },
    ip,
  };
}

async function withEnvironment(values, callback) {
  const previous = {};
  for (const [key, value] of Object.entries(values)) {
    previous[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }

  try {
    await callback();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("chat rejects requests from a different origin", async () => {
  const response = createResponse();
  await withEnvironment({ GEMINI_API_KEY: "test-key" }, () => chatHandler(
    createRequest({
      body: { message: "Hello" },
      headers: { origin: "https://other.example" },
    }),
    response
  ));

  assert.equal(response.statusCode, 403);
  assert.deepEqual(response.payload, { code: "origin_not_allowed" });
});

test("chat returns a Gemini response for a same-origin request", async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      candidates: [{
        finishReason: "STOP",
        content: { parts: [{ text: "Bonjour !" }] },
      }],
    }),
  });

  try {
    const response = createResponse();
    await withEnvironment({ GEMINI_API_KEY: "test-key" }, () => chatHandler(
      createRequest({
        body: { message: "Bonjour", locale: "fr" },
        headers: { origin: "https://portfolio.example" },
      }),
      response
    ));

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.payload, { response: "Bonjour !" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("analytics permits a same-origin GET without an Origin header", async () => {
  const originalFetch = global.fetch;
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  });
  const credentials = JSON.stringify({
    type: "service_account",
    client_email: "analytics@example.iam.gserviceaccount.com",
    private_key: privateKey,
  });
  let requests = 0;
  global.fetch = async (url) => {
    requests += 1;
    if (String(url).startsWith("https://oauth2.googleapis.com/token")) {
      return { ok: true, json: async () => ({ access_token: "test-token", expires_in: 3600 }) };
    }
    return {
      ok: true,
      json: async () => ({ rows: [{ metricValues: [{ value: "42" }] }] }),
    };
  };

  try {
    const response = createResponse();
    await withEnvironment({
      GA_MEASUREMENT_ID: "G-TEST123",
      GA_PROPERTY_ID: "123456789",
      GOOGLE_APPLICATION_CREDENTIALS_JSON: credentials,
    }, () => analyticsHandler(createRequest({ method: "GET" }), response));

    assert.equal(response.statusCode, 200);
    assert.equal(response.payload.visitors, 42);
    assert.equal(response.payload.measurementId, "G-TEST123");
    assert.equal(requests, 2);
  } finally {
    global.fetch = originalFetch;
  }
});

test("analytics returns the public measurement ID when visitor reporting is not configured", async () => {
  const response = createResponse();
  await withEnvironment({
    GA_MEASUREMENT_ID: "G-PUBLIC123",
    GA_PROPERTY_ID: "123456789",
    GOOGLE_APPLICATION_CREDENTIALS_JSON: undefined,
  }, () => analyticsHandler(createRequest({ method: "GET" }), response));

  assert.equal(response.statusCode, 503);
  assert.deepEqual(response.payload, {
    code: "analytics_not_configured",
    measurementId: "G-PUBLIC123",
  });
  assert.equal(response.headers["Cache-Control"], "no-store");
});
