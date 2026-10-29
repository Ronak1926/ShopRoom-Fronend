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

export async function registerDevice(fcmToken: string, platform: "WEB" = "WEB"): Promise<void> {
  await apiClient.post("/api/customers/me/devices", { fcmToken, platform });
}

export async function unregisterDevice(fcmToken: string): Promise<void> {
  await apiClient.delete("/api/customers/me/devices", { data: { fcmToken } });
}

export interface SendDesignResponse {
  designJson: NotificationDesign;
  message: string | null;
  roomId: string;
  context: RenderContext;
}

export async function getSendDesign(sendId: string): Promise<SendDesignResponse> {
  const { data } = await apiClient.get<Envelope<SendDesignResponse>>(
    `/api/notifications/sends/${sendId}/design`,
  );
  return data.data;
}
