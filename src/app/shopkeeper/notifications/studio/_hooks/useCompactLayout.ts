"use client";

import { useSyncExternalStore } from "react";

/** Below Tailwind's `lg` breakpoint the Studio stacks instead of using side panels. */
const QUERY = "(max-width: 1023.98px)";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  window.addEventListener("resize", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("resize", onChange);
  };
}

const compactNow = (): boolean | null => window.matchMedia(QUERY).matches;
const widthNow = (): number => document.documentElement.clientWidth;

/**
 * Whether the Studio should use its stacked phone/tablet layout, and how wide the screen is (panels
 * take a pixel width). `ready` is false until the browser has reported its size, which is on the
 * server and during hydration: the caller shows a skeleton then, so a phone never mounts (and then
 * throws away) the desktop layout's heavy side panels.
 */
export function useCompactLayout(): { ready: boolean; compact: boolean; width: number } {
  const compact = useSyncExternalStore<boolean | null>(subscribe, compactNow, () => null);
  const width = useSyncExternalStore(subscribe, widthNow, () => 0);
  return { ready: compact !== null, compact: compact === true, width };
}
