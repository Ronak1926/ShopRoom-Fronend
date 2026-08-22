"use client";

import { useMemo, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SHAPE_GROUPS, type LibraryItem } from "@/features/notifications/sceneLibrary";
import { AssetThumb } from "./LibraryGrid";

/** Items shown per group before "View all" expands it (3-col grid). */
const PREVIEW_LIMIT = 6;

interface Props {
  width: number;
  onInsert: (item: LibraryItem) => void;
}

/**
 * Dedicated Shapes library — grouped, searchable, category-filtered. Clicking a
 * tile inserts a real DECORATION element via the same createDecoration path the
 * other asset libraries use, so shapes are editable, layerable and animatable
 * like any other element.
 */
export default function ShapesPanel({ width, onInsert }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const q = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      SHAPE_GROUPS.filter((group) => category === "all" || group.id === category)
        .map((group) => ({
          ...group,
          items: q ? group.items.filter((i) => i.name.toLowerCase().includes(q)) : group.items,
        }))
        .filter((group) => group.items.length > 0),
    [q, category],
  );

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">Shapes</h2>
        <p className="text-[12px] text-(--color-text-hint) mt-0.5">Build layouts with simple forms</p>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-page) focus-within:border-(--color-brand-primary) transition-colors">
          <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shapes..."
            className="w-full bg-transparent border-0 outline-none text-[12px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[{ id: "all", label: "All" }, ...SHAPE_GROUPS.map((g) => ({ id: g.id, label: g.label }))].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`h-7 px-2.5 rounded-full border text-[11px] font-medium transition-colors cursor-pointer ${
                category === c.id
                  ? "border-(--color-brand-primary) bg-(--color-brand-primary) text-white"
                  : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {groups.map((group) => {
          const isExpanded = !!expanded[group.id] || !!q || category !== "all";
          const visible = isExpanded ? group.items : group.items.slice(0, PREVIEW_LIMIT);
          const hasMore = group.items.length > PREVIEW_LIMIT;

          return (
            <section key={group.id}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint)">
                  {group.label}
                </p>
                {hasMore && !q && category === "all" && (
                  <button
                    type="button"
                    onClick={() => setExpanded((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
                    className="text-[11px] font-semibold text-(--color-brand-primary) hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {isExpanded ? "Show less" : "View all"}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {visible.map((item) => (
                  <button
                    key={group.id + item.assetId}
                    type="button"
                    onClick={() => onInsert(item)}
                    title={`Add ${item.name}`}
                    className="flex flex-col items-center justify-center gap-1.5 aspect-square rounded-xl border border-(--color-border-default) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer overflow-hidden px-1"
                  >
                    <AssetThumb item={item} />
                    <span className="block w-full truncate text-center text-[10px] font-medium leading-tight text-(--color-text-secondary)">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}

        {!total && <p className="text-[12px] text-(--color-text-hint) py-6 text-center">No shapes match.</p>}

        <div className="flex items-start gap-2 p-3 rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary-text)">
          <InfoOutlinedIcon sx={{ fontSize: 15 }} className="mt-0.5 shrink-0" />
          <p className="text-[11px] leading-snug">
            Shapes insert as editable elements — set colour, opacity, radius and animation in the right panel.
          </p>
        </div>
      </div>
    </aside>
  );
}
