/**
 * lib/firebaseMessaging.ts — lazy FCM messaging singleton. Returns null
 * instead of throwing when push isn't supported (SSR, Safari quirks) so
 * callers can degrade gracefully rather than crash.
 */

import type { Messaging } from "firebase/messaging";
import { loadMessagingSdk } from "@/features/push/pushEvents";
import { app } from "./firebase";

let messagingInstance: Messaging | null = null;

export async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  const { getMessaging, isSupported } = await loadMessagingSdk();
  if (!(await isSupported())) return null;
  if (!messagingInstance) messagingInstance = getMessaging(app);
  return messagingInstance;
}
