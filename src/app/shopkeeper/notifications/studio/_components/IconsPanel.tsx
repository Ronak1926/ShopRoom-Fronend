"use client";

import { useMemo, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getIcon } from "@/features/notifications/icons";
import { ICON_CATEGORIES, ICON_GROUPS } from "@/features/notifications/iconLibrary";
import { findNode } from "@/features/notifications/tree";
import type { NotificationDesign } from "@/features/notifications/types";

/** Rows shown per group before "View all" expands it (4-col grid). */
const PREVIEW_ROWS = 3;
const COLS = 4;

interface Props {
  width: number;
  design: NotificationDesign | null;
  selectedId: string | null;
  onPick: (iconName: string) => void;
  /** True while the inspector's "Change Icon" is swapping an existing icon. */
  changeMode: boolean;
}

export default function IconsPanel({ width, design, selectedId, onPick, changeMode }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // Icon glyphs alone are ambiguous at 4-up; this reveals each icon's name.
  const [showLabels, setShowLabels] = useState(false);

  const selectedNode = design && selectedId ? findNode(design.elements, selectedId) : null;
  const selectedIsIcon = selectedNode?.type === "ICON";

  const q = query.trim().toLowerCase();

  const groups = useMemo(() => {
    return ICON_GROUPS
      .filter((group) => category === "all" || group.id === category)
      .map((group) => ({
        ...group,
        icons: q
          ? group.icons.filter((i) => i.label.toLowerCase().includes(q) || i.name.toLowerCase().includes(q))
          : group.icons,
      }))
      .filter((group) => group.icons.length > 0);
  }, [q, category]);

  const total = groups.reduce((sum, group) => sum + group.icons.length, 0);

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">Icons</h2>
        <p className="text-[12px] text-(--color-text-hint) mt-0.5">Add beautiful icons to your design</p>
      </div>

      {changeMode && (
        <div className="mx-4 mb-3 flex items-start gap-2 p-2.5 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary-text)">
          <InfoOutlinedIcon sx={{ fontSize: 14 }} className="mt-0.5 shrink-0" />
          <p className="text-[11px] leading-snug">Choose an icon to replace your selected one.</p>
        </div>
      )}

      <div className="px-4 pb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 flex items-center gap-2 h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-page) focus-within:border-(--color-brand-primary) transition-colors">
            <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons..."
              className="w-full bg-transparent border-0 outline-none text-[12px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
            />
          </div>
          <button
            type="button"
            title={showLabels ? "Hide icon names" : "Show icon names"}
            onClick={() => setShowLabels((v) => !v)}
            className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              showLabels
                ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            <FilterListOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">
            Categories
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[{ id: "all", label: "All" }, ...ICON_CATEGORIES].map((c) => (
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
        </div>

        {groups.map((group) => {
          const isExpanded = !!expanded[group.id] || !!q || category !== "all";
          const limit = PREVIEW_ROWS * COLS;
          const visible = isExpanded ? group.icons : group.icons.slice(0, limit);
          const hasMore = group.icons.length > limit;

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
              <div className="grid grid-cols-4 gap-2">
                {visible.map((item) => {
                  const Icon = getIcon(item.name);
                  if (!Icon) return null;
                  return (
                    <button
                      key={group.id + item.name}
                      type="button"
                      onClick={() => onPick(item.name)}
                      title={changeMode ? `Use ${item.label}` : `Add ${item.label}`}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) hover:text-(--color-brand-primary) transition-colors cursor-pointer overflow-hidden ${
                        showLabels ? "py-2.5 px-1" : "aspect-square"
                      }`}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                      {showLabels && (
                        <span className="block w-full truncate text-center text-[9px] font-medium leading-tight">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {!total && <p className="text-[12px] text-(--color-text-hint) py-6 text-center">No icons match.</p>}

        <div className="flex items-start gap-2 p-3 rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary-text)">
          <InfoOutlinedIcon sx={{ fontSize: 15 }} className="mt-0.5 shrink-0" />
          <p className="text-[11px] leading-snug">
            {selectedIsIcon
              ? "Click an icon to swap your selected one."
              : "Click an icon to add it, then set its colour and size in the right panel."}
          </p>
        </div>
      </div>
    </aside>
  );
}
