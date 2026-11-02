/**
 * features/push/pushApi.ts — Typed client for push-notification device
 * registration and resolving a received push's design. Uses the plain
 * apiClient (not a manual cookie-read authConfig()) since these calls only
 * ever fire from already-hydrated customer pages where setAuthToken already ran.
 */

import { apiClient } from "@/utils/apiClient";
import type { NotificationDesign, RenderContext } from "@/features/notifications/types";

interface Envelope<T> {
  data: T;
  message?: string;
}

/**
 * `authToken` is for callers that run before the page has put the customer's
 * session on apiClient (the layout's background sync, the sign-out screen).
 */
function bearer(authToken: string | undefined) {
  return authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
}

export async function registerDevice(
  fcmToken: string,
  authToken?: string,
  platform: "WEB" = "WEB",
): Promise<void> {
  await apiClient.post("/api/customers/me/devices", { fcmToken, platform }, bearer(authToken));
}

export async function unregisterDevice(fcmToken: string, authToken?: string): Promise<void> {
  await apiClient.delete("/api/customers/me/devices", { data: { fcmToken }, ...bearer(authToken) });
}

/** Stores the customer's current position for radius-based notifications. */
export async function reportLocation(
  position: { latitude: number; longitude: number },
  authToken: string,
): Promise<void> {
  await apiClient.put("/api/customers/me/location", position, bearer(authToken));
}

export interface SendDesignResponse {
  designJson: NotificationDesign;
  message: string | null;
  roomId: string;
  context: RenderContext;
}

export async function getSendDesign(sendId: string, authToken?: string): Promise<SendDesignResponse> {
  const { data } = await apiClient.get<Envelope<SendDesignResponse>>(
    `/api/notifications/sends/${sendId}/design`,
    bearer(authToken),
  );
  return data.data;
}

export type ReceiptEvent = "DELIVERED" | "OPENED" | "CLICKED";

/**
 * Tells the server what this device did with a push. Fire-and-forget by
 * design: analytics must never delay or break showing the notification, so a
 * failed report is dropped rather than surfaced.
 */
export function reportReceipt(receiptToken: string | undefined, event: ReceiptEvent): void {
  if (!receiptToken) return;
  apiClient.post("/api/notifications/receipts", { token: receiptToken, event }).catch(() => {});
}
