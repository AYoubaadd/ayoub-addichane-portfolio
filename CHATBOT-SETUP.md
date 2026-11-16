# Chatbot setup

> The Vercel deployment uses [VERCEL-SETUP.md](./VERCEL-SETUP.md). The Firebase instructions below are for the legacy Firebase Functions deployment only.

The portfolio chatbot uses a Firebase HTTPS Function and the Gemini API. The Gemini key is stored as a Firebase secret and is never sent to the browser.

## Deploy to your own Firebase project

1. Use a Firebase project you own, with Firebase Hosting and Cloud Functions enabled. The repository's default Firebase project is shared by Freefolio; do not deploy this portfolio backend to it.
2. Install the Firebase CLI and authenticate with an account that can deploy to your project.
3. Map the `production` Hosting target in this checkout to your own Hosting site:

   ```sh
   firebase target:apply hosting production YOUR_FIREBASE_HOSTING_SITE_ID --project YOUR_FIREBASE_PROJECT_ID
   ```

4. Set the Gemini key as a secret:

   ```sh
   firebase functions:secrets:set GEMINI_API_KEY --project YOUR_FIREBASE_PROJECT_ID
   ```

5. Deploy the function and Hosting rewrite:

   ```sh
   firebase deploy --only functions:portfolioChat,hosting --project YOUR_FIREBASE_PROJECT_ID
   ```

The site calls `/api/chat`, which Firebase Hosting rewrites to `portfolioChat`. The function accepts same-origin POST requests only, limits messages to 1,000 characters, and applies an in-memory per-IP rate limit. Configure billing and usage limits for the Gemini API and Firebase project before publishing.
