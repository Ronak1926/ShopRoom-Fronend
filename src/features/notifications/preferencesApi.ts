/**
 * features/notifications/preferencesApi.ts — The shopkeeper's notification
 * preferences, kept on the server so they follow the account to every device
 * (and so quiet hours, weekends and expiry can be enforced there).
 */

import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import type { NotificationPreferences } from "./preferences";

function authConfig() {
  return { headers: { Authorization: `Bearer ${getCookie("shopkeeper_token")}` } };
}

/** `null` until the shopkeeper has saved preferences for the first time. */
export async function fetchPreferences(): Promise<Record<string, unknown> | null> {
  const { data } = await apiClient.get<{ data: Record<string, unknown> | null }>("/api/notifications/preferences", authConfig());
  return data.data;
}

export async function savePreferencesRemote(values: NotificationPreferences): Promise<void> {
  await apiClient.put("/api/notifications/preferences", values, authConfig());
}
