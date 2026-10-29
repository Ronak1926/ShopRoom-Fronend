/**
 * app/firebase-messaging-sw.js/route.ts — serves the FCM background handler
 * at the literal root path /firebase-messaging-sw.js (required for service
 * worker scope). A route handler rather than a public/ static file so the
 * Firebase config is read from real env vars at request time instead of
 * being baked in as placeholder text.
 */

import { API_BASE_URL } from "@/constants/api";

export async function GET() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const body = `
importScripts("https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js");

firebase.initializeApp(${JSON.stringify(config)});

const API_BASE_URL = ${JSON.stringify(API_BASE_URL)};
const messaging = firebase.messaging();

// Tells the server what this device did with a push. The receipt token in the
// payload is the only credential (a service worker has no login); failures are
// dropped because analytics must never get in the way of showing the message.
function report(token, event) {
  if (!token) return Promise.resolve();
  return fetch(API_BASE_URL + "/api/notifications/receipts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, event }),
    keepalive: true,
  }).catch(() => {});
}

// The backend sends a data-only FCM payload (no top-level "notification"
// field) specifically so Firebase's SDK never auto-displays a notification
// itself — that auto-display only uses title/body/image and would otherwise
// fire before this handler runs, risking a duplicate. This handler has sole,
// explicit control over what's shown, including the large hero image.
messaging.onBackgroundMessage((payload) => {
  const data = payload.data ?? {};
  const title = data.title || "ShopRoom";
  return Promise.all([
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/ShopRoomIcon.svg",
      badge: "/ShopRoomIcon.svg",
      image: data.imageUrl || undefined,
      data,
    }),
    report(data.rt, "DELIVERED"),
  ]);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const { roomId, rt } = event.notification.data ?? {};
  const target = roomId ? "/customer/room/" + encodeURIComponent(roomId) : "/customer/home";

  event.waitUntil(
    (async () => {
      await report(rt, "OPENED");
      const open = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = open.find((client) => new URL(client.url).origin === self.location.origin);
      if (existing) {
        await existing.focus();
        if ("navigate" in existing) await existing.navigate(target);
        return;
      }
      await self.clients.openWindow(target);
    })(),
  );
});
`.trim();

  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-cache",
    },
  });
}
