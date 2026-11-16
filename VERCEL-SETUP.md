# Vercel backend setup

The static portfolio uses two Vercel Functions:

- `api/chat.js` handles `POST /api/chat`.
- `api/analytics/visitors.js` handles `GET /api/analytics/visitors`.

Vercel deploys files under `api/` as serverless functions. The older `functions/` directory contains Firebase Functions and is not used by this Vercel setup.

## Project settings

In the Vercel project, set the project root to this repository's root directory and use Node.js 22. Add these environment variables under **Settings → Environment Variables** for each environment you deploy:

| Name | Value |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API key; keep secret |
| `GA_MEASUREMENT_ID` | GA4 web-stream measurement ID (`G-...`) |
| `GA_PROPERTY_ID` | Numeric GA4 property ID |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Full Google service-account JSON; keep secret |

Enable the Google Analytics Data API in the service account's Google Cloud project, then grant that service account **Viewer** access to the GA4 property. Do not commit the service-account JSON or paste private keys into source files.

After adding or changing environment variables, redeploy the project. Test the routes on the deployed domain:

- `https://your-domain.example/api/analytics/visitors`
- Send a same-origin JSON `POST` to `https://your-domain.example/api/chat` with `{"message":"What projects has Ayoub worked on?","locale":"en"}`.

The visitor-count endpoint caches successful results for 15 minutes. Its Google service-account credentials are exchanged for a short-lived access token at runtime; only the measurement ID and count are returned to the browser.

The chat rate limit is held in each warm serverless instance and is therefore best-effort, not a global per-IP limit. Set provider usage limits and billing alerts in the Gemini/Google Cloud consoles.
