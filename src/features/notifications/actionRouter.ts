import type { ElementAction } from "./types";

/** Where tapping a banner element takes the customer. */
export type ActionRoute =
  | { kind: "internal"; path: string }
  | { kind: "external"; url: string };

/** Room ids are cuids / uuids — anything else in a design's target is ignored. */
const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

function roomPath(roomId: string): string {
  return `/customer/room/${encodeURIComponent(roomId)}`;
}

function safeExternalUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Resolves a design element's `interaction.onClick` into a destination, or
 * null when the element does nothing. `roomId` is the room the push came from.
 *
 * The app has no product or collection pages yet, so those actions open the
 * shop's room, where the shop's offers live.
 */
export function resolveActionRoute(action: ElementAction, roomId: string): ActionRoute | null {
  switch (action.type) {
    case "OPEN_ROOM":
    case "OPEN_CHAT": {
      const target = action.target && ID_PATTERN.test(action.target) ? action.target : roomId;
      return { kind: "internal", path: roomPath(target) };
    }
    case "OPEN_PRODUCT":
    case "OPEN_COLLECTION":
      return { kind: "internal", path: roomPath(roomId) };
    case "JOIN_ROOM":
      return { kind: "internal", path: "/customer/home" };
    case "OPEN_URL": {
      const url = safeExternalUrl(action.url);
      return url ? { kind: "external", url } : null;
    }
    default:
      return null;
  }
}

/** The destination a tap on the banner itself (no element action) leads to. */
export function defaultRoute(roomId: string): ActionRoute {
  return { kind: "internal", path: roomPath(roomId) };
}
