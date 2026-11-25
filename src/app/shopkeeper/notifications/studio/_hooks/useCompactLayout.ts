"use client";

import { useEffect, useState } from "react";

/** Below Tailwind's `lg` breakpoint the Studio stacks instead of using side panels. */
const QUERY = "(max-width: 1023.98px)";

/**
 * Whether the Studio should use its stacked phone/tablet layout, and how wide
 * the screen is (panels take a pixel width). Starts as the desktop layout so the
 * server render and first client render agree, then switches on mount.
 */
export function useCompactLayout(): { compact: boolean; width: number } {
  const [state, setState] = useState({ compact: false, width: 1280 });
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const update = () => setState({ compact: media.matches, width: document.documentElement.clientWidth });
    update();
    media.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return state;
}
