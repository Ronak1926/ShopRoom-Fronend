"use client";

import { useMemo, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { findNode } from "@/features/notifications/tree";
import { BUTTON_CATEGORIES, BUTTON_PRESETS, type ButtonPreset } from "@/features/notifications/buttonPresets";
import type { NotificationDesign } from "@/features/notifications/types";
import ButtonThumb from "./ButtonThumb";

interface Props {
  width: number;
  design: NotificationDesign | null;
  selectedId: string | null;
  onPick: (preset: ButtonPreset) => void;
  /** True while the inspector's "Change style" is restyling an existing button. */
  changeMode: boolean;
}

export default function ButtonsPanel({ width, design, selectedId, onPick, changeMode }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const selectedNode = design && selectedId ? findNode(design.elements, selectedId) : null;
  const selectedIsButton = selectedNode?.type === "BUTTON";

  const presets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUTTON_PRESETS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return p.label.toLowerCase().includes(q) || p.text.toLowerCase().includes(q);
    });
  }, [query, category]);

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">Buttons</h2>
        <p className="text-[12px] text-(--color-text-hint) mt-0.5">Add a call-to-action</p>
      </div>

      {changeMode && (
        <div className="mx-4 mb-3 flex items-start gap-2 p-2.5 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary-text)">
          <InfoOutlinedIcon sx={{ fontSize: 14 }} className="mt-0.5 shrink-0" />
          <p className="text-[11px] leading-snug">Choose a style to restyle your selected button.</p>
        </div>
      )}

      <div className="px-4 pb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-page) focus-within:border-(--color-brand-primary) transition-colors">
          <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buttons..."
            className="w-full bg-transparent border-0 outline-none text-[12px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["All", ...BUTTON_CATEGORIES].map((c) => (
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
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPick(preset)}
              title={changeMode ? `Restyle as ${preset.label}` : `Add ${preset.label}`}
              className="group flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-(--color-border-default) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer overflow-hidden"
            >
              <ButtonThumb preset={preset} />
              <span className="block w-full truncate text-[10px] font-medium text-(--color-text-hint) group-hover:text-(--color-brand-primary)">
                {preset.label}
              </span>
            </button>
          ))}
          {!presets.length && (
            <p className="text-[12px] text-(--color-text-hint) py-6 text-center">No buttons match.</p>
          )}
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary-text)">
          <InfoOutlinedIcon sx={{ fontSize: 15 }} className="mt-0.5 shrink-0" />
          <p className="text-[11px] leading-snug">
            {selectedIsButton
              ? "Click a style to restyle your selected button — its label and position are kept."
              : "Click a button to add it, then set its label and tap action in the right panel."}
          </p>
        </div>
      </div>
    </aside>
  );
}
