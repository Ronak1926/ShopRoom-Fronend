"use client";

import { useState } from "react";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import NotificationPreview from "./NotificationPreview";

const VIEWS = [
  { id: "mobile", label: "Mobile Preview", icon: SmartphoneOutlinedIcon },
  { id: "desktop", label: "Desktop Preview", icon: DesktopWindowsOutlinedIcon },
] as const;

export default function StudioCanvas() {
  const [view, setView] = useState<"mobile" | "desktop">("mobile");

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-(--color-bg-page)">
      {/* Canvas top controls */}
      <div className="shrink-0 flex items-center justify-center gap-4 px-6 py-3 relative">
        {/* View switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-(--color-bg-surface) border border-(--color-border-default)">
          {VIEWS.map(({ id, label, icon: Icon }) => {
            const isActive = view === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                    : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                }`}
              >
                <Icon sx={{ fontSize: 16 }} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Zoom control */}
        <div className="absolute right-6 flex items-center gap-1 h-8 px-1 rounded-lg bg-(--color-bg-surface) border border-(--color-border-default)">
          <button
            type="button"
            title="Zoom out"
            className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            <RemoveOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
          <span className="text-[12px] font-medium text-(--color-text-primary) w-10 text-center">
            100%
          </span>
          <button
            type="button"
            title="Zoom in"
            className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            <AddOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>

      {/* Scrollable canvas stage */}
      <div className="flex-1 min-h-0 overflow-auto flex items-start justify-center py-8 px-6">
        {/* Phone frame */}
        <div className="w-[320px] shrink-0 rounded-[38px] border-8 border-(--color-gray-900) bg-(--color-bg-surface) shadow-(--shadow-lg) p-3">
          <NotificationPreview />
        </div>
      </div>
    </div>
  );
}
