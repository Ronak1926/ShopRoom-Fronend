/**
 * features/account/passwordApi.ts — Forgot, reset and change password, for
 * customers and shopkeepers. The role picks which API the request goes to.
 */

import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

export type AccountRole = "customer" | "shopkeeper";

const BASE: Record<AccountRole, string> = {
  customer: "/api/customers",
  shopkeeper: "/api/shopkeeper",
};

export function isAccountRole(value: unknown): value is AccountRole {
  return value === "customer" || value === "shopkeeper";
}

export function apiMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? fallback;
}

/** Always succeeds from the caller's point of view: the server never says whether the address has an account. */
export async function requestPasswordReset(role: AccountRole, email: string): Promise<string> {
  const { data } = await apiClient.post<{ message: string }>(`${BASE[role]}/forgot-password`, { email });
  return data.message;
}

export async function resetPassword(role: AccountRole, token: string, password: string): Promise<string> {
  const { data } = await apiClient.post<{ message: string }>(`${BASE[role]}/reset-password`, { token, password });
  return data.message;
}

/** Resolves with a fresh session token: changing the password signs every other device out. */
export async function changePassword(role: AccountRole, currentPassword: string, newPassword: string): Promise<{ message: string; token: string }> {
  const cookie = role === "customer" ? "token" : "shopkeeper_token";
  const { data } = await apiClient.patch<{ message: string; token: string }>(
    `${BASE[role]}/me/password`,
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${getCookie(cookie)}` } },
  );
  return data;
}
