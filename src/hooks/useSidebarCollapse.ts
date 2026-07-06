"use client";

import { useCallback, useState } from "react";

function readStored(storageKey: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(storageKey) === "1";
}

/**
 * Persists sidebar collapsed state per role so each of the customer and
 * shopkeeper shells remember their own preference across page loads.
 *
 * Reads localStorage synchronously in the initial state (not in a
 * useEffect) — every page renders its own <Sidebar>, so client-side
 * navigation between pages fully remounts it. An effect-based read would
 * flash the sidebar open on every navigation before snapping back to
 * collapsed a tick later.
 */
export function useSidebarCollapse(role: "customer" | "shopkeeper") {
  const storageKey = `sidebar_collapsed_${role}`;
  const [collapsed, setCollapsed] = useState(() => readStored(storageKey));

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(storageKey, next ? "1" : "0");
      return next;
    });
  }, [storageKey]);

  return { collapsed, toggle };
}
