/**
 * features/notifications/preferencesApi.ts — The shopkeeper's notification
 * preferences, kept on the server so they follow the account to every device
 * (and so quiet hours, weekends and expiry can be enforced there).
 */

import { apiClient } from "@/utils/apiClient";
import type { NotificationPreferences } from "./preferences";

/** `null` until the shopkeeper has saved preferences for the first time. */
export async function fetchPreferences(): Promise<Record<string, unknown> | null> {
  const { data } = await apiClient.get<{ data: Record<string, unknown> | null }>("/api/notifications/preferences");
  return data.data;
}

export async function savePreferencesRemote(values: NotificationPreferences): Promise<void> {
  await apiClient.put("/api/notifications/preferences", values);
}
