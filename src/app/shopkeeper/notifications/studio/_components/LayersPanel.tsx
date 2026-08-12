"use client";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { LAYERS } from "../_data/studioData";
import { STUDIO_ICONS } from "./studioIcons";

export default function LayersPanel({ width }: { width: number }) {
  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) border-t border-(--color-border-default) overflow-hidden"
    >
      <div className="px-4 pt-3 pb-2">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint)">
          Layers
        </p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 flex flex-col gap-0.5">
        {LAYERS.map(({ id, label, iconKey }, i) => {
          const Icon = STUDIO_ICONS[iconKey];
          const isActive = i === 0;
          return (
            <div
              key={id}
              className={`group flex items-center gap-2 h-8 shrink-0 px-2 rounded-lg cursor-pointer transition-colors ${
                isActive
                  ? "bg-(--color-brand-primary-light)"
                  : "hover:bg-(--color-bg-surface-hover)"
              }`}
            >
              <Icon
                sx={{
                  fontSize: 15,
                  color: isActive
                    ? "var(--color-brand-primary)"
                    : "var(--color-text-secondary)",
                }}
              />
              <span
                className={`text-[12px] truncate ${
                  isActive
                    ? "font-semibold text-(--color-brand-primary)"
                    : "text-(--color-text-secondary)"
                }`}
              >
                {label}
              </span>
              <DragIndicatorIcon
                sx={{ fontSize: 15, color: "var(--color-text-hint)" }}
                className="ml-auto"
              />
              <VisibilityOutlinedIcon
                sx={{ fontSize: 15, color: "var(--color-text-hint)" }}
              />
            </div>
          );
        })}
      </div>
    </aside>
  );
}
