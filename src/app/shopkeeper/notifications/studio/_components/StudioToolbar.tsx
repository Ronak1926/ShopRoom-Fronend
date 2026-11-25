"use client";

import { TOOLBAR_ITEMS } from "../_data/studioData";
import { STUDIO_ICONS } from "./studioIcons";

interface Props {
  active: string;
  onChange: (id: string) => void;
  /** A side rail on desktop; a scrolling row under the canvas on phones. */
  orientation?: "vertical" | "horizontal";
}

export default function StudioToolbar({ active, onChange, orientation = "vertical" }: Props) {
  const horizontal = orientation === "horizontal";
  return (
    <aside
      className={
        horizontal
          ? "shrink-0 flex items-stretch gap-0.5 px-2 py-1.5 bg-(--color-bg-surface) border-b border-(--color-border-default) overflow-x-auto"
          : "w-20 shrink-0 flex flex-col items-center gap-0.5 py-3 bg-(--color-bg-surface) border-r border-(--color-border-default) overflow-y-auto"
      }
    >
      {TOOLBAR_ITEMS.map(({ id, label, iconKey }) => {
        const Icon = STUDIO_ICONS[iconKey];
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            title={label}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 py-1.5 cursor-pointer group ${horizontal ? "shrink-0 w-16" : "w-full"}`}
          >
            <span
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? "bg-(--color-brand-primary) text-(--color-text-on-brand) shadow-(--shadow-brand-glow)"
                  : "text-(--color-text-secondary) group-hover:bg-(--color-bg-surface-hover) group-hover:text-(--color-text-primary)"
              }`}
            >
              <Icon sx={{ fontSize: 20 }} />
            </span>
            <span
              className={`text-[10px] font-medium leading-none ${
                isActive
                  ? "text-(--color-brand-primary)"
                  : "text-(--color-text-secondary)"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
