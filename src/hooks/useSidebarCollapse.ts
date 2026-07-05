"use client";

import { useCallback, useEffect, useState } from "react";

/** Persists sidebar collapsed state per role so each of the customer and
 * shopkeeper shells remember their own preference across page loads. */
export function useSidebarCollapse(role: "customer" | "shopkeeper") {
  const storageKey = `sidebar_collapsed_${role}`;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(storageKey, next ? "1" : "0");
      return next;
    });
  }, [storageKey]);

  return { collapsed, toggle };
}
