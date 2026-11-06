/**
 * features/push/pushDevice.ts — this browser's push registration, kept in step
 * with whichever customer is signed in. Nothing here ever shows a permission
 * prompt: it only acts when the customer has already allowed notifications.
 */

import { getMessagingIfSupported } from "@/lib/firebaseMessaging";
import { registerDevice, unregisterDevice } from "./pushApi";
import { loadMessagingSdk } from "./pushEvents";

export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const WORKER_URL = "/firebase-messaging-sw.js";

/** This browser's FCM token, or null when notifications aren't allowed or supported. */
async function currentToken(): Promise<string | null> {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return null;
  const messaging = await getMessagingIfSupported();
  if (!messaging) return null;

  const registration =
    (await navigator.serviceWorker.getRegistration(WORKER_URL)) ??
    (await navigator.serviceWorker.register(WORKER_URL));
  await navigator.serviceWorker.ready;

  const { getToken } = await loadMessagingSdk();
  const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
  return token || null;
}

/**
 * Points this browser's push token at the signed-in customer. A browser shared
 * between accounts therefore only ever notifies whoever is signed in now, and a
 * rotated token is picked up without the customer doing anything.
 */
export async function syncDeviceRegistration(): Promise<void> {
  const token = await currentToken();
  if (token) await registerDevice(token);
}

/**
 * Stops notifications for the signed-in customer on this browser. The browser
 * keeps its token, so signing back in re-registers without another prompt.
 */
export async function unregisterCurrentDevice(): Promise<void> {
  const token = await currentToken();
  if (token) await unregisterDevice(token);
}
