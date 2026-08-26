"use client";

import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { backgroundCss } from "@/components/notifications/nodeStyle";
import {
  BACKGROUND_GROUPS,
  backgroundsIn,
  isSameBackground,
  type BackgroundGroup,
} from "@/features/notifications/backgroundPresets";
import type { Background } from "@/features/notifications/types";

interface Props {
  /** The canvas background, so the matching swatch reads as selected. */
  current?: Background;
  onSet: (bg: Background) => void;
}

/**
 * The ready-made background picker. Swatches render through the same
 * backgroundCss the canvas uses, so what's in the grid is exactly what lands on
 * the banner — no hand-written preview gradients to fall out of sync.
 */
export default function BackgroundPresetGrid({ current, onSet }: Props) {
  const [group, setGroup] = useState<BackgroundGroup>("Soft");
  const presets = backgroundsIn(group);

  return (
    <section className="flex flex-col gap-2">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint)">
        Preset backgrounds
      </p>

      <div className="flex flex-wrap gap-1.5">
        {BACKGROUND_GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={`h-7 px-2.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
              group === g
                ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {presets.map((p) => {
          const active = isSameBackground(current, p.background);
          return (
            <button
              key={p.id}
              type="button"
              title={p.label}
              onClick={() => onSet(p.background)}
              className={`relative rounded-lg border overflow-hidden transition-colors cursor-pointer ${
                active
                  ? "border-(--color-brand-primary) ring-1 ring-(--color-brand-primary)"
                  : "border-(--color-border-default) hover:border-(--color-brand-primary)"
              }`}
            >
              <span
                // the swatch fill is data-driven, so it must be an inline style
                style={{ background: backgroundCss(p.background) }}
                className="block w-full aspect-2/1"
              />
              {active && (
                <CheckCircleIcon
                  sx={{ fontSize: 15, color: "var(--color-brand-primary)" }}
                  className="absolute top-1 right-1"
                />
              )}
              <span className="block px-1.5 py-1 text-[10px] font-medium text-(--color-text-secondary) truncate text-left">
                {p.label}
              </span>
            </button>
          );
        })}
      </div>

      {group === "Midnight" && (
        <p className="text-[10.5px] leading-relaxed text-(--color-text-hint)">
          Dark backgrounds need light text — recolour your headline and body copy after applying one.
        </p>
      )}
    </section>
  );
}
