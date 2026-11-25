/**
 * utils/session.ts — Signed-in state in the browser.
 *
 * The real session lives in an HttpOnly cookie that only the API can set, read or clear, so no script
 * on the page can steal it. These readable cookies (`token`, `shopkeeper_token`) are just a flag, "this
 * browser is signed in as account X", so pages can decide what to show (and which messages are the
 * viewer's own) without a round trip. An account id is not a secret. If the flag is wrong or stale, the
 * next API call answers 401 and the page signs the person out.
 */

import { apiClient } from "./apiClient";
import { deleteCookie, getCookie, setCookie } from "./cookieUtils";

export type SessionRole = "customer" | "shopkeeper";

const FLAG: Record<SessionRole, string> = { customer: "token", shopkeeper: "shopkeeper_token" };
const LOGOUT_PATH: Record<SessionRole, string> = { customer: "/api/customers/logout", shopkeeper: "/api/shopkeeper/logout" };

/** Remembers that this browser is signed in as the account the API just named. */
export function markSignedIn(role: SessionRole, accountId: string): void {
  if (!accountId) throw new Error("The sign-in response did not say who signed in");
  setCookie(FLAG[role], accountId);
}

/** Who this browser is signed in as, or null. Changes when a different account signs in. */
export function signedInAccountId(role: SessionRole): string | null {
  return getCookie(FLAG[role]) || null;
}

export function isSignedIn(role: SessionRole): boolean {
  return Boolean(getCookie(FLAG[role]));
}

/** Forgets the flag only: for when the API has already said the session is over. */
export function markSignedOut(role: SessionRole): void {
  deleteCookie(FLAG[role]);
}

/** Ends the session: asks the API to clear its HttpOnly cookie, then forgets the flag (even if the request fails). */
export async function signOut(role: SessionRole): Promise<void> {
  try {
    await apiClient.post(LOGOUT_PATH[role]);
  } finally {
    markSignedOut(role);
  }
}
