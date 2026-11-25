/**
 * app/firebase-messaging-sw.js/route.ts — serves the FCM background handler
 * at the literal root path /firebase-messaging-sw.js (required for service
 * worker scope). A route handler rather than a public/ static file so the
 * Firebase config is read from real env vars at request time instead of
 * being baked in as placeholder text. The script itself is built in
 * lib/messagingServiceWorker.ts, where it is tested.
 */

import { API_BASE_URL } from "@/constants/api";
import { buildServiceWorkerSource } from "@/lib/messagingServiceWorker";

export async function GET() {
  const body = buildServiceWorkerSource(
    {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    },
    API_BASE_URL,
  );

  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-cache",
    },
  });
}
