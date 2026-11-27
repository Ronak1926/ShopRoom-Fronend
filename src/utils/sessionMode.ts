/**
 * utils/sessionMode.ts — Keeping the session in the browser's storage instead of an HttpOnly cookie.
 *
 * The normal (and safer) way is the HttpOnly cookie in utils/session.ts. It only works when the web app
 * and the API are on the same site. While they are on different hosts (a *.vercel.app page calling a
 * *.onrender.com API) browsers that block third-party cookies drop it, and Safari always does.
 *
 * Setting NEXT_PUBLIC_SESSION_MODE=token switches the web app to "token mode" until both run on one
 * domain: the API's sign-in answer carries the token, it is kept here, and each request sends it as a
 * Bearer header. Unlike an HttpOnly cookie a script on the page can read it, so switch back (remove the
 * setting) as soon as a shared domain is in place.
 */

import type { SessionRole } from "./session";

export const TOKEN_MODE = process.env.NEXT_PUBLIC_SESSION_MODE === "token";

const STORAGE_KEY: Record<SessionRole, string> = { customer: "cc_session_customer", shopkeeper: "cc_session_shopkeeper" };

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function storeSessionToken(role: SessionRole, token: string): void {
  try {
    storage()?.setItem(STORAGE_KEY[role], token);
  } catch {
    // Storage full or blocked: the next request answers 401 and the person signs in again.
  }
}

export function readSessionToken(role: SessionRole): string | null {
  try {
    return storage()?.getItem(STORAGE_KEY[role]) || null;
  } catch {
    return null;
  }
}

export function clearSessionToken(role: SessionRole): void {
  try {
    storage()?.removeItem(STORAGE_KEY[role]);
  } catch {
    // Nothing stored that we could remove.
  }
}

/** Which account an area of the site belongs to, from its path. Shared pages (help, join…) belong to neither. */
export function roleForPath(pathname: string): SessionRole | null {
  if (pathname === "/shopkeeper" || pathname.startsWith("/shopkeeper/")) return "shopkeeper";
  if (pathname === "/customer" || pathname.startsWith("/customer/")) return "customer";
  return null;
}

/** The token a request should carry: the one for the area the person is in, else whichever exists. */
export function tokenForRequest(pathname: string, read: (role: SessionRole) => string | null = readSessionToken): string | null {
  const role = roleForPath(pathname);
  if (role) return read(role);
  return read("customer") ?? read("shopkeeper");
}

/**
 * The session a response hands over, if it is a sign-in. Only the API's own sign-in answers carry `token`
 * next to the account's id (or, for a password change, come from the password route); any other `token`
 * in a response (a share link, say) is not a session and is ignored.
 */
export function sessionFromResponse(url: string | undefined, data: unknown): { role: SessionRole; token: string } | null {
  if (!data || typeof data !== "object") return null;
  const body = data as Record<string, unknown>;
  if (typeof body.token !== "string" || body.token.length === 0) return null;
  // A new customer is not signed in until they confirm their email and log in.
  if ((url ?? "").split("?")[0] === "/api/customers/register") return null;
  if (typeof body.customerId === "string") return { role: "customer", token: body.token };
  if (typeof body.shopkeeperId === "string") return { role: "shopkeeper", token: body.token };
  const path = (url ?? "").split("?")[0];
  if (path.endsWith("/password")) {
    if (path.startsWith("/api/customers/")) return { role: "customer", token: body.token };
    if (path.startsWith("/api/shopkeeper/")) return { role: "shopkeeper", token: body.token };
  }
  return null;
}
