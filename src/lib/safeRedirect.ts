/**
 * Where to send someone after they sign in or sign up. A `?next=` parameter lets
 * an invite link survive the login detour, but an unchecked one is an open
 * redirect, so only a short list of in-app paths is ever honoured.
 */

export const DEFAULT_AFTER_AUTH = "/customer/home";

const ALLOWED: RegExp[] = [
  /^\/join\/[A-Za-z0-9]{4,20}$/,
  /^\/customer\/(home|myrooms|map|profile|settings)$/,
  /^\/customer\/room\/[A-Za-z0-9_-]{8,40}$/,
];

export function safeNextPath(value: string | null | undefined, fallback = DEFAULT_AFTER_AUTH): string {
  return value && ALLOWED.some((pattern) => pattern.test(value)) ? value : fallback;
}

/** The page to go to after authenticating, read from the current URL's `?next=`. */
export function nextAfterAuth(): string {
  return safeNextPath(new URLSearchParams(window.location.search).get("next"));
}

/** `path` carrying the current `?next=` along, for hopping between the login and sign-up pages. */
export function withNext(path: string): string {
  const next = nextAfterAuth();
  return next === DEFAULT_AFTER_AUTH ? path : `${path}?next=${encodeURIComponent(next)}`;
}
