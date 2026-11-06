import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

export type SecurityEventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET"
  | "SESSIONS_REVOKED"
  | "DATA_EXPORTED"
  | "REAUTH_FAILED"
  | "MFA_ENABLED"
  | "MFA_DISABLED"
  | "MFA_FAILED"
  | "MFA_RECOVERY_USED";

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  at: string;
  ip: string | null;
  device: string;
  detail: { method?: string; action?: string } | null;
}

export async function fetchSecurityEvents(endpoint: string, cookieName: "token" | "shopkeeper_token"): Promise<SecurityEvent[]> {
  const { data } = await apiClient.get<{ data: SecurityEvent[] }>(endpoint, { headers: { Authorization: `Bearer ${getCookie(cookieName)}` } });
  return data.data;
}
