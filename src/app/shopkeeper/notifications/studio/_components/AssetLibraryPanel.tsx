"use client";

import { useMemo, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { SVG_ASSETS } from "@/features/notifications/assets";
import type { LibraryGroup, LibraryItem } from "@/features/notifications/sceneLibrary";

interface Props {
  width: number;
  title: string;
  groups: LibraryGroup[];
  onInsert: (item: LibraryItem) => void;
}

/**
 * Generic library browser used by Shapes / Decorations / Effects. Clicking a
 * tile inserts a real DECORATION element into the document (not a mockup).
 */
export default function AssetLibraryPanel({ width, title, groups, onInsert }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, items: g.items.filter((i) => i.name.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length);
  }, [groups, query]);

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">{title}</h2>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-page) focus-within:border-(--color-brand-primary) transition-colors">
          <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full bg-transparent border-0 outline-none text-[12px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
          />
        </div>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-4">
        {filtered.map((group) => (
          <section key={group.id}>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
              {group.label}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {group.items.map((item) => (
                <button
                  key={item.assetId + item.name}
                  type="button"
                  onClick={() => onInsert(item)}
                  title={`Add ${item.name}`}
                  className="flex flex-col items-center justify-center gap-1 aspect-square rounded-xl border border-(--color-border-default) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer overflow-hidden px-1"
                >
                  <AssetThumb item={item} />
                  <span className="text-[10px] font-medium leading-tight text-center text-(--color-text-secondary) truncate w-full">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
        {!filtered.length && (
          <p className="text-[12px] text-(--color-text-hint) py-6 text-center">No matches.</p>
        )}
      </div>
    </aside>
  );
}

/** Small preview of the asset — real SVG art, or a CSS swatch for effects. */
function AssetThumb({ item }: { item: LibraryItem }) {
  const svg = SVG_ASSETS[item.assetId];
  const color = item.color ?? "var(--color-brand-primary)";

  if (svg) {
    return (
      <span
        className="w-7 h-7 flex items-center justify-center"
        // tint is data-driven per asset
        style={{ color }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  const id = item.assetId;
  const swatch: React.CSSProperties =
    id === "glow" || id === "product-glow" || id === "spotlight"
      ? { background: `radial-gradient(circle, ${color}99 0%, ${color}00 70%)` }
      : id === "gradient-orb"
        ? { background: `radial-gradient(circle at 35% 30%, ${color}CC, ${color}22)`, borderRadius: "50%" }
        : id === "vignette"
          ? { background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(15,23,42,0.45) 100%)" }
          : id === "product-shadow" || id === "soft-shadow"
            ? { background: "rgba(15,23,42,0.25)", borderRadius: "50%", filter: "blur(3px)" }
            : id === "shape-circle" || id === "shape-ellipse"
              ? { background: color, borderRadius: "50%" }
              : id === "shape-rounded"
                ? { background: color, borderRadius: 6 }
                : id === "shape-line"
                  ? { background: color, borderRadius: 999, height: 4 }
                  : { background: color };

  return <span className="w-7 h-7 shrink-0" style={swatch} />;
}
