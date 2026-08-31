"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "shoproom:favourite-templates";

/**
 * Favourited template ids, kept in localStorage.
 *
 * Deliberately not server state: there is no column for it, and a favourite is
 * a per-device convenience rather than something worth a migration.
 *
 * Modelled as an external store rather than state seeded in an effect, because
 * that is what it is — localStorage lives outside React. useSyncExternalStore
 * also gets SSR right (the server snapshot is empty, so the first client render
 * matches) and picks up writes from other tabs via the `storage` event.
 */

const EMPTY: string[] = [];
let cache: string[] = EMPTY;
let cacheRaw: string | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  // getSnapshot must return a stable reference while nothing has changed, or
  // React re-renders forever. Parse only when the stored string differs.
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : EMPTY;
  } catch {
    cache = EMPTY;
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

function write(next: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked. Keep the in-memory value so the UI still moves.
    cacheRaw = null;
    cache = next;
  }
  for (const l of listeners) l();
}

export function useFavouriteTemplates() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((id: string) => {
    const current = read();
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, has, toggle };
}
