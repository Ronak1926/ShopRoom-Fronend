"use client";

import { useMemo, useState } from "react";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  BADGE_PRESETS,
  LABEL_PRESETS,
  BADGE_CATEGORIES,
  LABEL_CATEGORIES,
  type BadgeLabelKind,
  type BadgeLabelPreset,
} from "@/features/notifications/badgeLabelPresets";
import BadgeLabelThumb from "./BadgeLabelThumb";

const TABS: { id: BadgeLabelKind; label: string }[] = [
  { id: "BADGE", label: "Badges" },
  { id: "LABEL", label: "Labels" },
];

/** "Basic Badges" -> "Basic", "Simple Outline Labels" -> "Simple Outline" — compact filter-chip text. */
function shortCategory(category: string): string {
  return category.replace(/ (Badges|Labels)$/, "");
}

interface Props {
  width: number;
  kind: BadgeLabelKind;
  onKindChange: (kind: BadgeLabelKind) => void;
  onBack: () => void;
  onPick: (preset: BadgeLabelPreset) => void;
  /** Set while replacing an existing element's preset via the inspector's "Change" button. */
  changeMode?: boolean;
}

export default function BadgesLabelsPanel({ width, kind, onKindChange, onBack, onPick, changeMode }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const presets = kind === "BADGE" ? BADGE_PRESETS : LABEL_PRESETS;
  const categories = kind === "BADGE" ? BADGE_CATEGORIES : LABEL_CATEGORIES;

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      presets.filter((p) => {
        if (category !== "All" && p.category !== category) return false;
        if (!q) return true;
        return p.label.toLowerCase().includes(q) || p.text.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }),
    [presets, category, q],
  );

  const grouped = useMemo(() => {
    const byCategory = new Map<string, BadgeLabelPreset[]>();
    for (const p of filtered) {
      const list = byCategory.get(p.category);
      if (list) list.push(p);
      else byCategory.set(p.category, [p]);
    }
    return Array.from(byCategory.entries());
  }, [filtered]);

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      <div className="px-4 pt-4 pb-2 flex items-center gap-1 text-[12px]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-0.5 font-semibold text-(--color-brand-primary) hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ChevronLeftOutlinedIcon sx={{ fontSize: 16 }} />
          Add Elements
        </button>
        <ChevronRightOutlinedIcon sx={{ fontSize: 14, color: "var(--color-text-hint)" }} />
        <span className="font-semibold text-(--color-text-primary)">Badges &amp; Labels</span>
      </div>

      <div className="px-4 pb-3">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">Badges &amp; Labels</h2>
        <p className="text-[12px] text-(--color-text-hint) mt-0.5">Add decorative badges and labels</p>
      </div>

      {changeMode && (
        <div className="mx-4 mb-3 flex items-start gap-2 p-2.5 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary-text)">
          <InfoOutlinedIcon sx={{ fontSize: 14 }} className="mt-0.5 shrink-0" />
          <p className="text-[11px] leading-snug">Choose a style to replace your selected {kind === "BADGE" ? "badge" : "label"}.</p>
        </div>
      )}

      <div className="px-4 flex items-center gap-4 border-b border-(--color-border-default)">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              onKindChange(t.id);
              setCategory("All");
            }}
            className={`pb-2.5 text-[12.5px] font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
              kind === t.id
                ? "border-(--color-brand-primary) text-(--color-brand-primary)"
                : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-3 flex flex-col gap-3">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-page) focus-within:border-(--color-brand-primary) transition-colors">
          <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${kind === "BADGE" ? "badges" : "labels"}...`}
            className="w-full bg-transparent border-0 outline-none text-[12px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`h-6 px-2.5 rounded-full border text-[10.5px] font-medium transition-colors cursor-pointer ${
                category === c
                  ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                  : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
              }`}
            >
              {c === "All" ? "All" : shortCategory(c)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 pt-3 flex flex-col gap-5">
        {grouped.map(([cat, items]) => (
          <section key={cat}>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">{cat}</p>
            <div className="grid grid-cols-4 gap-2.5">
              {items.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  title={preset.label}
                  onClick={() => onPick(preset)}
                  className="flex items-center justify-center h-16 rounded-xl border border-(--color-border-default) bg-(--color-bg-page) shadow-(--shadow-sm) hover:-translate-y-0.5 hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) hover:shadow-(--shadow-md) transition-all duration-150 cursor-pointer overflow-hidden px-1.5 active:scale-95 active:translate-y-0"
                >
                  <BadgeLabelThumb preset={preset} maxSize={56} />
                </button>
              ))}
            </div>
          </section>
        ))}
        {!grouped.length && <p className="text-[12px] text-(--color-text-hint) py-6 text-center">No matches.</p>}
      </div>
    </aside>
  );
}
