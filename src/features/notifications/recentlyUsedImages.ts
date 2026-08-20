/**
 * features/notifications/recentlyUsedImages.ts — "Recently Used" images in the
 * Images panel's Recent tab. Client-side/localStorage, same precedent as
 * useNotificationDesign's STORAGE_KEY — this is per-browser editor
 * convenience, not durable business data, so it doesn't warrant a DB table.
 */

import type { AssetRef } from "./types";

const KEY = "studio_recent_images";
const MAX_ITEMS = 24;

export interface RecentImage {
  url: string;
  name?: string;
  attribution?: AssetRef["attribution"];
  usedAt: string;
}

export function getRecentlyUsedImages(): RecentImage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RecentImage[]) : [];
  } catch {
    return [];
  }
}

/** Records a use, deduped and moved to the front. */
export function pushRecentlyUsedImage(entry: Omit<RecentImage, "usedAt">): void {
  if (typeof window === "undefined") return;
  const existing = getRecentlyUsedImages().filter((i) => i.url !== entry.url);
  const next = [{ ...entry, usedAt: new Date().toISOString() }, ...existing].slice(0, MAX_ITEMS);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}
