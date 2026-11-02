import { API_BASE_URL } from "@/constants/api";

export type ClientErrorKind = "error" | "unhandledrejection" | "boundary";

const MAX_REPORTS_PER_PAGE_LOAD = 5;
const MAX_MESSAGE = 300;
const MAX_STACK = 2000;
/** Browser noise that says nothing about our code. */
const IGNORED = /ResizeObserver loop|^Script error\.?$/i;

const seen = new Set<string>();

/**
 * Tells the API about an error caught in the browser. Sends only the message,
 * a truncated stack and the page *path* (no query string, no fragment), never
 * user input or tokens. Capped per page load and de-duplicated; failures are
 * ignored because reporting an error must never cause one.
 */
export function reportClientError(kind: ClientErrorKind, error: unknown): void {
  if (typeof window === "undefined" || seen.size >= MAX_REPORTS_PER_PAGE_LOAD) return;

  const message = error instanceof Error ? error.message : String(error);
  if (IGNORED.test(message) || seen.has(message)) return;
  seen.add(message);

  const body = JSON.stringify({
    kind,
    message: message.slice(0, MAX_MESSAGE),
    stack: error instanceof Error ? error.stack?.slice(0, MAX_STACK) : undefined,
    path: window.location.pathname.slice(0, 200),
  });

  void fetch(`${API_BASE_URL}/api/client-errors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "omit",
  }).catch(() => undefined);
}
