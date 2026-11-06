/**
 * features/account/mfaApi.ts — Two-step verification (authenticator app) for customers and shopkeepers.
 * Changing the setting proves identity again, with the password or (Google-only customers) a fresh Google sign-in.
 */

import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";

export type MfaRole = "customer" | "shopkeeper";
export type MfaProof = { password: string } | { idToken: string };

const ROLES = {
  customer: { base: "/api/customers", cookie: "token" },
  shopkeeper: { base: "/api/shopkeeper", cookie: "shopkeeper_token" },
} as const;

export interface MfaStatus {
  enabled: boolean;
  recoveryCodesLeft: number;
}

/** What the second step of signing in returns (shopkeepers also get their shop). */
export interface MfaLoginResult {
  token: string;
  shopkeeperId?: string;
  shopName?: string;
}

export interface MfaSetup {
  secret: string;
  otpauthUrl: string;
}

const authHeader = (role: MfaRole) => ({ headers: { Authorization: `Bearer ${getCookie(ROLES[role].cookie)}` } });
const url = (role: MfaRole, path: string) => `${ROLES[role].base}/me/mfa${path}`;

export async function fetchMfaStatus(role: MfaRole): Promise<MfaStatus> {
  const { data } = await apiClient.get<{ data: MfaStatus }>(url(role, ""), authHeader(role));
  return data.data;
}

export async function startMfaSetup(role: MfaRole, proof: MfaProof): Promise<MfaSetup> {
  const { data } = await apiClient.post<{ data: MfaSetup }>(url(role, "/setup"), proof, authHeader(role));
  return data.data;
}

/** Returns the recovery codes, which are shown once. */
export async function confirmMfaSetup(role: MfaRole, code: string): Promise<string[]> {
  const { data } = await apiClient.post<{ data: { recoveryCodes: string[] } }>(url(role, "/enable"), { code }, authHeader(role));
  return data.data.recoveryCodes;
}

export async function turnOffMfa(role: MfaRole, proof: MfaProof, code: string): Promise<void> {
  await apiClient.post(url(role, "/disable"), { ...proof, code }, authHeader(role));
}

export async function replaceRecoveryCodes(role: MfaRole, proof: MfaProof, code: string): Promise<string[]> {
  const { data } = await apiClient.post<{ data: { recoveryCodes: string[] } }>(url(role, "/recovery-codes"), { ...proof, code }, authHeader(role));
  return data.data.recoveryCodes;
}

/** Second step of signing in. The token comes from the password step. */
export async function completeMfaLogin(role: MfaRole, mfaToken: string, code: string): Promise<MfaLoginResult> {
  const { data } = await apiClient.post<MfaLoginResult>(`${ROLES[role].base}/login/mfa`, { mfaToken, code });
  return data;
}
