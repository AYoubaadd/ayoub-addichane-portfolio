# Google Analytics setup

The portfolio uses the GA4 Data API from a Firebase Function to show the lifetime count of unique users. The browser only receives the public GA4 Measurement ID and visitor total; no service-account key is stored in the site or `.env.local`.

## 1. Create a GA4 property

1. In Google Analytics, create a property and a Web data stream for your portfolio's public domain.
2. Copy the stream's Measurement ID (`G-...`) and the property's numeric ID.
3. Keep the stream domain aligned with your Firebase Hosting custom domain so the same-origin visitor endpoint works.

## 2. Configure local environment

Edit `ingolfur/.env.local`:

```dotenv
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_PROPERTY_ID=123456789
```

These are identifiers, not credentials. The file is ignored by Git and Firebase Hosting. The build-preparation script copies them to `ingolfur/functions/.env` for Firebase Functions:

```sh
node ingolfur/scripts/sync-analytics-env.js
```

## 3. Allow the function to read GA4 reports

1. Enable the Google Analytics Data API in the Google Cloud project used by your Firebase project.
2. Deploy `analyticsVisitors` once to your own Firebase project, then find its runtime service account in the Firebase/Google Cloud function details.
3. In Google Analytics, open the property's Access Management page and add that service-account email with the **Viewer** role. Do not create or upload a service-account JSON key.
4. Deploy the analytics function and Hosting rewrite:

   ```sh
   firebase target:apply hosting production YOUR_FIREBASE_HOSTING_SITE_ID --project YOUR_FIREBASE_PROJECT_ID
   firebase deploy --only functions:analyticsVisitors,hosting --project YOUR_FIREBASE_PROJECT_ID
   ```

The counter reports GA4 `totalUsers` from 2000-01-01 through today, cached for 15 minutes. It displays “indisponible” until the property IDs, API, service-account access, and a real deployed origin are configured. The shared Freefolio default Firebase project is not your personal deployment target.
