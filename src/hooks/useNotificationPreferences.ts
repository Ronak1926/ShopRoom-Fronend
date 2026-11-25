"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_PREFERENCES,
  PreferencesSchema,
  type NotificationPreferences,
} from "@/features/notifications/preferences";
import { fetchPreferences, savePreferencesRemote } from "@/features/notifications/preferencesApi";
import { getCookie } from "@/utils/cookieUtils";

const STORAGE_KEY = "shoproom:notification-preferences";

/**
 * Notification preferences. The server is the source of truth (they follow the
 * account, and quiet hours, weekends and expiry are enforced there); localStorage
 * is only a copy so screens have values on their very first paint.
 *
 * Modelled as an external store rather than state seeded in an effect, because
 * that is what it is. useSyncExternalStore also gets SSR right — the server
 * snapshot is the defaults, so the first client render matches — and picks up
 * changes made in another tab through the `storage` event.
 */

let cache: NotificationPreferences = DEFAULT_PREFERENCES;
let cacheRaw: string | null = null;
/** Whether the server's copy has been read for the signed-in shopkeeper. */
let hydrated = false;
let hydratedFor: string | null = null;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

function parseStored(raw: string): NotificationPreferences {
  try {
    // Merged over the defaults first, so a blob written by an older build that
    // is missing newer keys still loads instead of being thrown away whole.
    const parsed = PreferencesSchema.safeParse({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) });
    return parsed.success ? parsed.data : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function read(): NotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return cache;
  }
  // getSnapshot must return a stable reference while nothing has changed, or
  // React re-renders forever — so parse only when the stored string differs.
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  cache = raw ? parseStored(raw) : DEFAULT_PREFERENCES;
  return cache;
}

function remember(next: NotificationPreferences): void {
  cache = next;
  cacheRaw = JSON.stringify(next);
  try {
    localStorage.setItem(STORAGE_KEY, cacheRaw);
  } catch {
    // Storage full or blocked: the in-memory copy still serves this session.
  }
  notify();
}

/** Reads the server's copy once per sign-in. On a failure the local copy keeps serving. */
async function hydrate(): Promise<void> {
  const owner = getCookie("shopkeeper_token");
  if (!owner || hydratedFor === owner) return;
  hydratedFor = owner;
  hydrated = false;
  notify();
  try {
    const remote = await fetchPreferences();
    if (remote) {
      const parsed = PreferencesSchema.safeParse({ ...DEFAULT_PREFERENCES, ...remote });
      if (parsed.success) remember(parsed.data);
    } else {
      // Nothing saved on the server yet: adopt what this browser has, so what the
      // shopkeeper sees is also what gets enforced.
      void savePreferencesRemote(read()).catch(() => undefined);
    }
  } catch {
    hydratedFor = null;
  } finally {
    hydrated = true;
    notify();
  }
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
const hydratedSnapshot = () => hydrated;
const hydratedServerSnapshot = () => false;

export function useNotificationPreferences() {
  const values = useSyncExternalStore(subscribe, read, serverSnapshot);
  // The stored values cannot be known during SSR or before the server has answered,
  // so the form waits for this rather than mounting on stale values and snapping.
  const loaded = useSyncExternalStore(subscribe, hydratedSnapshot, hydratedServerSnapshot);

  useEffect(() => {
    void hydrate();
  }, []);

  /** Rejects when the server could not store them, so the caller can say so. */
  const save = useCallback(async (next: NotificationPreferences): Promise<void> => {
    await savePreferencesRemote(next);
    remember(next);
  }, []);

  return { values, loaded, save };
}
