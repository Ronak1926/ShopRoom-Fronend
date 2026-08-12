"use client";

import { useState } from "react";
import { TOOLBAR_ITEMS } from "../_data/studioData";
import { STUDIO_ICONS } from "./studioIcons";

export default function StudioToolbar() {
  const [active, setActive] = useState("add");

  return (
    <aside className="w-20 shrink-0 flex flex-col items-center gap-0.5 py-3 bg-(--color-bg-surface) border-r border-(--color-border-default) overflow-y-auto">
      {TOOLBAR_ITEMS.map(({ id, label, iconKey }) => {
        const Icon = STUDIO_ICONS[iconKey];
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            title={label}
            onClick={() => setActive(id)}
            className="w-full flex flex-col items-center gap-1 py-1.5 cursor-pointer group"
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
