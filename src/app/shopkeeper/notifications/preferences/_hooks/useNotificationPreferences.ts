"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_PREFERENCES,
  PreferencesSchema,
  type NotificationPreferences,
} from "../_schemas/preferences";

const STORAGE_KEY = "shoproom:notification-preferences";

/**
 * Notification preferences, backed by localStorage.
 *
 * Modelled as an external store rather than state seeded in an effect, because
 * that is what it is. useSyncExternalStore also gets SSR right — the server
 * snapshot is the defaults, so the first client render matches — and picks up
 * changes made in another tab through the `storage` event.
 */

let cache: NotificationPreferences = DEFAULT_PREFERENCES;
let cacheRaw: string | null = null;
const listeners = new Set<() => void>();

function read(): NotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return DEFAULT_PREFERENCES;
  }
  // getSnapshot must return a stable reference while nothing has changed, or
  // React re-renders forever — so parse only when the stored string differs.
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  if (!raw) {
    cache = DEFAULT_PREFERENCES;
    return cache;
  }
  try {
    // Merged over the defaults first, so a blob written by an older build that
    // is missing newer keys still loads instead of being thrown away whole.
    const parsed = PreferencesSchema.safeParse({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) });
    cache = parsed.success ? parsed.data : DEFAULT_PREFERENCES;
  } catch {
    cache = DEFAULT_PREFERENCES;
  }
  return cache;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const serverSnapshot = () => DEFAULT_PREFERENCES;

/** Tiny companion store: false while server-rendering, true once mounted. */
const noopSubscribe = () => () => {};

export function useNotificationPreferences() {
  const values = useSyncExternalStore(subscribe, read, serverSnapshot);
  // The stored values cannot be known during SSR, so the form waits for this
  // rather than mounting on the defaults and snapping to the real ones.
  const loaded = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const save = useCallback((next: NotificationPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full or blocked — keep it in memory so the session still works.
      cacheRaw = null;
      cache = next;
    }
    for (const l of listeners) l();
  }, []);

  return { values, loaded, save };
}
