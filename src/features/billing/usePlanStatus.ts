"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchBilling, type Billing } from "./api";

const FRESH_MS = 60_000;
let cache: { at: number; billing: Billing } | null = null;
const listeners = new Set<(b: Billing) => void>();

/** Call after a renewal so every mounted banner and page shows the new plan at once. */
export function publishBilling(billing: Billing): void {
  cache = { at: Date.now(), billing };
  listeners.forEach((listener) => listener(billing));
}

/**
 * The shopkeeper's plan, shared by everything on the page that needs it.
 * `null` until it has loaded (or if it could not be loaded).
 */
export function usePlanStatus(): { billing: Billing | null; reload: () => Promise<void> } {
  const [billing, setBilling] = useState<Billing | null>(cache?.billing ?? null);

  const reload = useCallback(async () => {
    try {
      publishBilling(await fetchBilling());
    } catch {
      // The banner is an extra: a failed lookup just leaves it out.
    }
  }, []);

  useEffect(() => {
    listeners.add(setBilling);
    if (!cache || Date.now() - cache.at > FRESH_MS) void reload();
    return () => {
      listeners.delete(setBilling);
    };
  }, [reload]);

  return { billing, reload };
}
