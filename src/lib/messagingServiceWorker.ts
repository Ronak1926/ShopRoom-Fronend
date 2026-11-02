/**
 * lib/messagingServiceWorker.ts — The source of /firebase-messaging-sw.js.
 *
 * Kept as a plain function (no framework imports) so tests can run the generated
 * script against stand-ins for the browser's service-worker environment. The route
 * at app/firebase-messaging-sw.js/route.ts only serves what this returns.
 */

export interface FirebaseWebConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
}

export function buildServiceWorkerSource(config: FirebaseWebConfig, apiBaseUrl: string): string {
  return `
importScripts("https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js");

firebase.initializeApp(${JSON.stringify(config)});

const API_BASE_URL = ${JSON.stringify(apiBaseUrl)};
const messaging = firebase.messaging();

const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const RECEIPT_TOKEN_PATTERN = /^[0-9a-fA-F-]{36}$/;

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

// Where tapping the notification goes. The "#push=" fragment tells the page which
// push to replay as the animated banner (the OS notification itself cannot animate).
// It is a fragment, not a query, so the receipt token never reaches a server log.
// Same format as features/push/tapLink.ts.
function tapTarget(data) {
  const roomId = data.roomId;
  if (!roomId) return "/customer/home";
  let target = "/customer/room/" + encodeURIComponent(roomId);
  if (data.sendId && ID_PATTERN.test(data.sendId)) {
    target += "#push=" + data.sendId;
    if (data.rt && RECEIPT_TOKEN_PATTERN.test(data.rt)) target += ":" + data.rt;
  }
  return target;
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
  const data = event.notification.data ?? {};
  const target = tapTarget(data);

  event.waitUntil(
    (async () => {
      await report(data.rt, "OPENED");
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
}
