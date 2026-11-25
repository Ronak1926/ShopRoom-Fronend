"use client";

/**
 * hooks/usePushNotifications.ts — permission + FCM token lifecycle for the
 * customer-facing "enable push notifications" toggle.
 */

import { useCallback, useEffect, useState } from "react";
import { getMessagingIfSupported } from "@/lib/firebaseMessaging";
import { registerDevice, unregisterDevice } from "@/features/push/pushApi";
import { loadMessagingSdk, PUSH_ENABLED_EVENT } from "@/features/push/pushEvents";

export type PushPermissionState = "checking" | "unsupported" | "default" | "denied" | "granted";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export function usePushNotifications() {
  const [permission, setPermission] = useState<PushPermissionState>("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission as PushPermissionState);
  }, []);

  const enable = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window === "undefined" || !("Notification" in window)) {
        setPermission("unsupported");
        return;
      }
      const result = await Notification.requestPermission();
      setPermission(result as PushPermissionState);
      if (result !== "granted") return;

      await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      // register() resolves as soon as the registration is accepted, while the
      // worker may still be installing — PushManager.subscribe() (inside
      // getToken()) needs an ACTIVE worker, so wait for it before proceeding.
      const registration = await navigator.serviceWorker.ready;
      const messaging = await getMessagingIfSupported();
      if (!messaging) {
        setPermission("unsupported");
        return;
      }

      const { getToken } = await loadMessagingSdk();
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      if (!token) throw new Error("Could not get a push token");

      await registerDevice(token);
      // The page that listens for pushes while it is open skipped loading the SDK until now.
      window.dispatchEvent(new Event(PUSH_ENABLED_EVENT));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not enable notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const messaging = await getMessagingIfSupported();
      if (!messaging) return;

      const { getToken, deleteToken } = await loadMessagingSdk();
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        await unregisterDevice(token);
        await deleteToken(messaging);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not disable notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  return { permission, loading, error, enable, disable };
}
