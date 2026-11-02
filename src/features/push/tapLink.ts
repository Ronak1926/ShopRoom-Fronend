/**
 * features/push/tapLink.ts — How a tapped notification tells the page which push
 * it came from, so the page can replay the animated design.
 *
 * The OS draws the notification itself and cannot run the design's animation, so
 * tapping it opens the room with `#push=<sendId>:<receiptToken>`. The reference
 * travels in the URL *fragment* on purpose: browsers never send a fragment to a
 * server or in a Referer header, so the per-device receipt token stays out of
 * server logs and analytics. The page removes it from the address bar as soon as
 * it has read it, so a refresh or a shared link does not replay anything.
 *
 * The service worker (lib/messagingServiceWorker.ts) builds the same format as
 * text; tapLink.test.ts keeps the two in step.
 */

const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const RECEIPT_TOKEN_PATTERN = /^[0-9a-fA-F-]{36}$/;
const PREFIX = "#push=";

export interface TapReference {
  sendId: string;
  /** Identifies this device's copy of the push for delivery analytics; absent for pushes without one. */
  receiptToken: string | undefined;
}

export function buildTapHash(sendId: string, receiptToken?: string): string {
  if (!ID_PATTERN.test(sendId)) return "";
  const token = receiptToken && RECEIPT_TOKEN_PATTERN.test(receiptToken) ? receiptToken : "";
  return `${PREFIX}${sendId}${token ? `:${token}` : ""}`;
}

/** Reads a tap reference from `location.hash`; anything malformed is ignored. */
export function parseTapHash(hash: string): TapReference | null {
  if (!hash.startsWith(PREFIX)) return null;
  const [sendId, receiptToken, ...extra] = hash.slice(PREFIX.length).split(":");
  if (extra.length > 0 || !ID_PATTERN.test(sendId)) return null;
  if (receiptToken !== undefined && !RECEIPT_TOKEN_PATTERN.test(receiptToken)) return null;
  return { sendId, receiptToken };
}
