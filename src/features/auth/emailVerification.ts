/**
 * features/auth/emailVerification.ts — Remembering the verification token between the page that asked for the
 * emailed code (sign-up, or a login that was refused) and the page where the code is entered.
 *
 * The token proves the person knows the account's password; the code proves they own the mailbox. Only both
 * together start a session, so the token alone is worth nothing. It lives in sessionStorage: it survives a
 * reload of the verify page but not closing the tab, and is never sent anywhere except with the code.
 */

const KEY = "cc_email_verification";

interface Stored {
  email: string;
  token: string;
}

const normalise = (email: string) => email.trim().toLowerCase();

function store(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

export function saveVerification(email: string, token: string): void {
  try {
    store()?.setItem(KEY, JSON.stringify({ email: normalise(email), token } satisfies Stored));
  } catch {
    // Storage blocked: the person confirms by code alone and signs in afterwards.
  }
}

/** The token saved for this address, or null (including when it was saved for a different address). */
export function readVerification(email: string): string | null {
  try {
    const raw = store()?.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    return parsed.email === normalise(email) && typeof parsed.token === "string" ? parsed.token : null;
  } catch {
    return null;
  }
}

export function clearVerification(): void {
  try {
    store()?.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
