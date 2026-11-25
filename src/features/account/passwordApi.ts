/**
 * features/account/passwordApi.ts — Forgot, reset and change password, for
 * customers and shopkeepers. The role picks which API the request goes to.
 */

import { apiClient } from "@/utils/apiClient";

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

/** Changing the password signs every other device out; the API replaces this browser's session cookie so it carries on. */
export async function changePassword(role: AccountRole, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const { data } = await apiClient.patch<{ message: string }>(`${BASE[role]}/me/password`, { currentPassword, newPassword });
  return data;
}
