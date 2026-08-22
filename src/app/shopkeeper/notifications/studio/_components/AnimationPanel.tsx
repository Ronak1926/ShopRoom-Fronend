"use client";

import { useState } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import { findNode, nodeLabel } from "@/features/notifications/tree";
import { presetsFor, type AnimSlot } from "@/features/notifications/animationPresets";
import type { NotificationDesign } from "@/features/notifications/types";
import { ANIM_ICONS } from "./animationIcons";

const TABS: { id: AnimSlot; label: string }[] = [
  { id: "entry", label: "Entrance" },
  { id: "attention", label: "Emphasis" },
  { id: "exit", label: "Exit" },
];

interface Props {
  width: number;
  design: NotificationDesign | null;
  selectedId: string | null;
  /** Applies a preset to the selected element's given slot. */
  onApply: (slot: AnimSlot, type: string) => void;
}

export default function AnimationPanel({ width, design, selectedId, onApply }: Props) {
  const [tab, setTab] = useState<AnimSlot>("entry");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const node = design && selectedId ? findNode(design.elements, selectedId) : null;
  const current = node?.animation?.[tab]?.type ?? "NONE";

  const basic = presetsFor(tab, "basic");
  const advanced = presetsFor(tab, "advanced");

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">Animation</h2>
        <p className="text-[12px] text-(--color-text-hint) mt-0.5">Add animations to bring your design to life</p>
      </div>

      <div className="px-4 flex items-center gap-4 border-b border-(--color-border-default)">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`pb-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
              tab === t.id
                ? "border-(--color-brand-primary) text-(--color-brand-primary)"
                : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!node && (
        <div className="mx-4 mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary-text)">
          <TouchAppOutlinedIcon sx={{ fontSize: 14 }} className="mt-0.5 shrink-0" />
          <p className="text-[11px] leading-snug">
            Select an element on the canvas first — animations apply to the selected element.
          </p>
        </div>
      )}
      {node && (
        <div className="mx-4 mt-3 px-2.5 py-2 rounded-lg bg-(--color-bg-page)">
          <p className="text-[10px] uppercase tracking-wide text-(--color-text-hint)">Applying to</p>
          <p className="text-[12px] font-semibold text-(--color-text-primary) truncate">{nodeLabel(node)}</p>
        </div>
      )}

      <div className="px-4 py-3 flex flex-col gap-4">
        <PresetGrid
          title="Basic"
          presets={basic}
          current={current}
          disabled={!node}
          onApply={(type) => onApply(tab, type)}
        />

        {showAdvanced && advanced.length > 0 && (
          <PresetGrid
            title="Advanced"
            presets={advanced}
            current={current}
            disabled={!node}
            onApply={(type) => onApply(tab, type)}
          />
        )}

        {advanced.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl border border-(--color-border-default) text-[12px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
          >
            {showAdvanced ? "Show Less" : "View More Animations"}
            <ExpandMoreOutlinedIcon
              sx={{ fontSize: 16, transform: showAdvanced ? "rotate(180deg)" : undefined, transition: "transform .15s" }}
            />
          </button>
        )}
      </div>
    </aside>
  );
}

function PresetGrid({
  title,
  presets,
  current,
  disabled,
  onApply,
}: {
  title: string;
  presets: ReturnType<typeof presetsFor>;
  current: string;
  disabled: boolean;
  onApply: (type: string) => void;
}) {
  return (
    <section>
      <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2">{title}</p>
      <div className="grid grid-cols-3 gap-2">
        {presets.map((p) => {
          const Icon = ANIM_ICONS[p.icon] ?? ANIM_ICONS.none;
          const active = current === p.type;
          return (
            <button
              key={p.slot + p.type}
              type="button"
              disabled={disabled}
              onClick={() => onApply(p.type)}
              title={disabled ? "Select an element first" : p.label}
              className={`flex flex-col items-center justify-center gap-1.5 py-3.5 px-1 rounded-xl border transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                active
                  ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary) ring-1 ring-(--color-brand-primary)"
                  : "border-(--color-border-default) text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light)"
              }`}
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  active ? "bg-(--color-bg-surface)" : "bg-(--color-bg-page)"
                }`}
              >
                <Icon sx={{ fontSize: 17 }} />
              </span>
              <span className="block w-full truncate text-center text-[10.5px] font-medium leading-tight">
                {p.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
