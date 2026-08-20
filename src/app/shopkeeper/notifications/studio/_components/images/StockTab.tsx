"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import { searchStockImages, type StockImageResult } from "@/features/notifications/api";
import ImageGrid, { type ImageTile } from "./ImageGrid";

// "Products" pre-fills the search query rather than hitting a separate data
// source — ShopRoom has no product catalog to browse (see conversation).
const CATEGORIES = [
  "All", "Products", "Nature", "Fashion", "Food", "Technology",
  "Business", "People", "Travel", "Abstract",
] as const;

interface Props {
  replacing: boolean;
  onAdd: (tile: ImageTile) => void;
}

export default function StockTab({ replacing, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [results, setResults] = useState<StockImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  // null = not known yet; [] = no provider key configured on the backend.
  const [configured, setConfigured] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);
  // Guards against a second fetch firing while one is already in flight — the
  // observer can re-trigger on any scroll jitter before state has settled.
  const inFlight = useRef(false);
  const [nearEndEl, setNearEndEl] = useState<HTMLDivElement | null>(null);

  const runSearch = useCallback(
    async (q: string, cat: string, pageToFetch: number, append: boolean) => {
      if (inFlight.current) return;
      inFlight.current = true;
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const res = await searchStockImages({
          query: q,
          category: cat === "All" ? undefined : cat,
          page: pageToFetch,
        });
        setResults((prev) => {
          if (!append) return res.items;
          // Providers can repeat a photo across pages — dedupe so React keys
          // stay unique and the grid doesn't show doubles.
          const seen = new Set(prev.map((r) => `${r.provider}-${r.id}`));
          return [...prev, ...res.items.filter((r) => !seen.has(`${r.provider}-${r.id}`))];
        });
        setConfigured(res.configured ?? []);
        setHasMore(res.hasMore);
        setPage(pageToFetch);
        setFailed(false);
      } catch {
        if (!append) setResults([]);
        setHasMore(false);
        setFailed(true);
      } finally {
        inFlight.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // New search / category: reset to page 1 (debounced).
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearched(false);
      setHasMore(false);
      setPage(1);
      return;
    }
    const timer = setTimeout(() => {
      setSearched(true);
      setPage(1);
      setHasMore(false);
      runSearch(q, category, 1, false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, category, runSearch]);

  // Infinite scroll: the grid tags the tile ~70% of the way through the current
  // results; once it scrolls into view the next page is fetched and appended.
  useEffect(() => {
    if (!nearEndEl || !hasMore || loading || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          runSearch(query.trim(), category, page + 1, true);
        }
      },
      // Start a little before it's actually on screen so the next page is
      // usually there by the time the user reaches the bottom.
      { rootMargin: "300px" },
    );
    observer.observe(nearEndEl);
    return () => observer.disconnect();
  }, [nearEndEl, hasMore, loading, loadingMore, page, query, category, runSearch]);

  const notConfigured = configured !== null && configured.length === 0;

  const tiles: ImageTile[] = results.map((r) => ({
    key: `${r.provider}-${r.id}`,
    thumbUrl: r.thumbUrl,
    fullUrl: r.fullUrl,
    width: r.width,
    height: r.height,
    credit: r.photographer,
    attribution: { photographer: r.photographer, photographerUrl: r.photographerUrl, provider: r.provider },
  }));

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[13px] font-bold text-(--color-text-primary)">Stock Images</h3>

      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-page) focus-within:border-(--color-brand-primary) transition-colors">
        <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stock images..."
          className="w-full bg-transparent border-0 outline-none text-[12px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c);
              if (!query.trim() && c !== "All") setQuery(c.toLowerCase());
            }}
            className={`h-7 px-2.5 rounded-full border text-[11px] font-medium transition-colors cursor-pointer ${
              category === c
                ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {notConfigured && (
        <div className="flex flex-col items-start gap-1.5 rounded-xl border border-(--color-border-default) bg-(--color-bg-page) p-3">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-(--color-text-primary)">
            <KeyOutlinedIcon sx={{ fontSize: 15, color: "var(--color-brand-alert)" }} />
            Stock search needs an API key
          </p>
          <p className="text-[11px] leading-relaxed text-(--color-text-secondary)">
            Add <code className="font-mono text-(--color-brand-primary)">PEXELS_API_KEY</code> or{" "}
            <code className="font-mono text-(--color-brand-primary)">UNSPLASH_ACCESS_KEY</code> to{" "}
            <code className="font-mono">ShopRoom-Backend/.env</code>, then restart the backend. Uploads and Recent work
            without one.
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-(--color-bg-surface-hover) animate-pulse" />
          ))}
        </div>
      ) : failed ? (
        <p className="text-[12px] text-(--color-danger) py-10 text-center">
          Couldn&apos;t reach the stock image service. Check that the backend is running.
        </p>
      ) : notConfigured ? null : searched ? (
        <>
          <ImageGrid
            tiles={tiles}
            replacing={replacing}
            onAdd={onAdd}
            emptyLabel="No stock photos matched that search. Try different keywords."
            observeRef={setNearEndEl}
            observeIndex={tiles.length ? Math.max(0, Math.floor(tiles.length * 0.7) - 1) : undefined}
          />
          {loadingMore && (
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              {[0, 1].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-(--color-bg-surface-hover) animate-pulse" />
              ))}
            </div>
          )}
          {!loadingMore && !hasMore && tiles.length > 0 && (
            <p className="text-[11px] text-(--color-text-hint) py-4 text-center">
              That&apos;s all {tiles.length} results.
            </p>
          )}
        </>
      ) : (
        <p className="text-[12px] text-(--color-text-hint) py-10 text-center">
          Search or pick a category to browse stock photos.
        </p>
      )}
    </div>
  );
}
