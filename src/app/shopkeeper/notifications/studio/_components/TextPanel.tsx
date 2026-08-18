"use client";

import { useMemo, useState, type ReactNode } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { findNode } from "@/features/notifications/tree";
import {
  TEXT_CONTENT_PRESETS,
  TEXT_STYLE_PRESETS,
  type TextStylePreset,
} from "@/features/notifications/textPresets";
import { resolveFontFamily } from "@/features/notifications/fonts";
import type { NotificationDesign } from "@/features/notifications/types";

/**
 * Themed hover tooltip — CSS-only (group-hover), no portal/library. Used on
 * preset cards whose label/description are truncated at the panel's default
 * width, so the full detail is still a hover away.
 */
function PresetTooltip({ title, detail, children }: { title: string; detail?: string; children: ReactNode }) {
  return (
    <span className="relative flex group/tip">
      {children}
      <span className="pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 w-max max-w-44 -translate-x-1/2 origin-bottom scale-95 opacity-0 transition-[opacity,transform] duration-150 group-hover/tip:scale-100 group-hover/tip:opacity-100 group-focus-within/tip:scale-100 group-focus-within/tip:opacity-100">
        <span className="block rounded-lg bg-(--color-gray-900) px-2.5 py-1.5 shadow-(--shadow-lg)">
          <span className="block text-[11px] font-semibold text-(--color-text-on-sidebar) leading-tight">{title}</span>
          {detail && <span className="mt-0.5 block text-[10px] text-(--color-text-sidebar-muted) leading-tight">{detail}</span>}
        </span>
        <span className="absolute left-1/2 top-full -mt-px h-2 w-2 -translate-x-1/2 rotate-45 bg-(--color-gray-900)" />
      </span>
    </span>
  );
}

const QUICK_ADD_IDS = ["heading", "subheading", "body", "caption"];
const PRESET_PREVIEW_COUNT = 6;

interface Props {
  width: number;
  design: NotificationDesign | null;
  selectedId: string | null;
  onAddPreset: (presetId: string) => void;
  onApplyStyle: (preset: TextStylePreset) => void;
}

export default function TextPanel({ width, design, selectedId, onAddPreset, onApplyStyle }: Props) {
  const [query, setQuery] = useState("");
  const [showAllPresets, setShowAllPresets] = useState(false);

  const selectedNode = design && selectedId ? findNode(design.elements, selectedId) : null;
  const selectedIsText = selectedNode?.type === "TEXT";

  const q = query.trim().toLowerCase();
  const filteredContent = useMemo(
    () =>
      q
        ? TEXT_CONTENT_PRESETS.filter((p) => p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        : TEXT_CONTENT_PRESETS,
    [q],
  );
  const filteredStyles = useMemo(
    () => (q ? TEXT_STYLE_PRESETS.filter((p) => p.label.toLowerCase().includes(q)) : TEXT_STYLE_PRESETS),
    [q],
  );

  const visibleContent = q || showAllPresets ? filteredContent : filteredContent.slice(0, PRESET_PREVIEW_COUNT);
  const quickAdd = TEXT_CONTENT_PRESETS.filter((p) => QUICK_ADD_IDS.includes(p.id));

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">TEXT</h2>
        <p className="text-[12px] text-(--color-text-hint) mt-0.5">Add and style text</p>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-5">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-(--color-border-default) bg-(--color-bg-page) focus-within:border-(--color-brand-primary) transition-colors">
          <SearchOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search text styles..."
            className="w-full bg-transparent border-0 outline-none text-[12px] text-(--color-text-primary) placeholder:text-(--color-text-hint)"
          />
        </div>

        <section>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint)">
              Text Presets
            </p>
            {!q && filteredContent.length > PRESET_PREVIEW_COUNT && (
              <button
                type="button"
                onClick={() => setShowAllPresets((v) => !v)}
                className="text-[11px] font-semibold text-(--color-brand-primary) hover:opacity-80 transition-opacity cursor-pointer"
              >
                {showAllPresets ? "Show less" : "View all"}
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {visibleContent.map((preset) => (
              <PresetTooltip key={preset.id} title={preset.label} detail={preset.description}>
                <button
                  type="button"
                  onClick={() => onAddPreset(preset.id)}
                  className="flex w-full min-w-0 flex-col items-start gap-1 p-2.5 rounded-xl border border-(--color-border-default) text-left hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
                >
                  <span className="text-[15px] font-bold text-(--color-text-primary)">Aa</span>
                  <span className="block w-full truncate text-[11px] font-semibold text-(--color-text-primary) leading-tight">
                    {preset.label}
                  </span>
                  <span className="block w-full truncate text-[10px] text-(--color-text-hint) leading-tight">
                    {preset.description}
                  </span>
                </button>
              </PresetTooltip>
            ))}
            {!visibleContent.length && (
              <p className="col-span-3 text-[12px] text-(--color-text-hint) py-4 text-center">No matches.</p>
            )}
          </div>
        </section>

        {!q && (
          <section>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2.5">
              Add Text
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickAdd.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onAddPreset(preset.id)}
                  className="flex items-center justify-center gap-1 min-h-9 px-2 py-1.5 rounded-lg border border-(--color-border-default) text-[11px] font-medium leading-tight text-center text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
                >
                  <AddOutlinedIcon sx={{ fontSize: 13 }} className="shrink-0" />
                  <span>{preset.label === "Body" ? "Body Text" : preset.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2.5">
            Text Style Presets
          </p>
          <div className="grid grid-cols-3 gap-2">
            {filteredStyles.map((preset) => (
              <PresetTooltip
                key={preset.id}
                title={preset.label}
                detail={`${preset.style.fontFamily} · ${preset.style.fontSize}px · ${preset.style.fontWeight}`}
              >
                <button
                  type="button"
                  onClick={() => onApplyStyle(preset)}
                  className="flex w-full min-w-0 flex-col items-center justify-center gap-1 py-3 rounded-xl border border-(--color-border-default) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
                >
                  <span
                    className="text-[16px] font-bold text-(--color-text-primary)"
                    style={{ fontFamily: resolveFontFamily(preset.style.fontFamily), color: preset.style.color }}
                  >
                    Ag
                  </span>
                  <span className="block w-full truncate text-center text-[10px] font-medium text-(--color-text-secondary)">
                    {preset.label}
                  </span>
                </button>
              </PresetTooltip>
            ))}
            {!filteredStyles.length && (
              <p className="col-span-3 text-[12px] text-(--color-text-hint) py-4 text-center">No matches.</p>
            )}
          </div>
        </section>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-(--color-brand-primary-light) text-(--color-brand-primary-text)">
          <InfoOutlinedIcon sx={{ fontSize: 15 }} className="mt-0.5 shrink-0" />
          <p className="text-[11px] leading-snug">
            {selectedIsText
              ? "Click a style to apply it to your selected text."
              : "Click a style to add new text with that look, or select a text element first to restyle it."}
          </p>
        </div>
      </div>
    </aside>
  );
}
