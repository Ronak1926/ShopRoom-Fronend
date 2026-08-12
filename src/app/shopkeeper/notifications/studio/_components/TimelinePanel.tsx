"use client";

import { useState } from "react";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { TIMELINE_TRACKS, RULER_MARKS } from "../_data/studioData";

const TABS = [
  { id: "timeline", label: "Timeline", icon: TimelineOutlinedIcon },
  { id: "states", label: "States", icon: LayersOutlinedIcon },
] as const;

// Token-backed fill/text per track tone.
const TONE: Record<string, string> = {
  blue: "bg-(--color-badge-blue-bg) text-(--color-badge-blue-text)",
  purple: "bg-(--color-brand-primary-light) text-(--color-brand-primary)",
  green: "bg-(--color-success-light) text-(--color-success)",
  yellow: "bg-(--color-brand-alert-light) text-(--color-brand-alert)",
  pink: "bg-(--color-avatar-pink-bg) text-(--color-avatar-pink-dark)",
};

export default function TimelinePanel() {
  const [tab, setTab] = useState<"timeline" | "states">("timeline");

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-(--color-bg-surface) border-t border-(--color-border-default)">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-(--color-border-default)">
        <div className="flex items-center gap-1">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                    : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                }`}
              >
                <Icon sx={{ fontSize: 15 }} />
                {label}
              </button>
            );
          })}
          <button
            type="button"
            title="Play"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            <PlayArrowOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-[12px] text-(--color-text-secondary)">
            Duration: <span className="font-semibold text-(--color-text-primary)">4s</span>
          </span>
          <button
            type="button"
            className="h-8 px-3 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary) text-[12px] font-semibold cursor-pointer"
          >
            Preview
          </button>
        </div>
      </div>

      {/* Track area */}
      <div className="flex-1 min-h-0 overflow-auto px-4 py-3">
        {/* Ruler */}
        <div className="relative h-4 mb-2">
          {RULER_MARKS.map((mark, i) => (
            <span
              key={mark}
              className="absolute -translate-x-1/2 text-[10px] text-(--color-text-hint)"
              style={{ left: `${(i / (RULER_MARKS.length - 1)) * 100}%` }}
            >
              {mark}
            </span>
          ))}
        </div>

        {/* Tracks */}
        <div className="flex flex-col gap-1.5">
          {TIMELINE_TRACKS.map(({ id, label, tone, offset, width }) => (
            <div key={id} className="relative h-7">
              {/* lane line */}
              <div className="absolute inset-0 rounded-md bg-(--color-bg-page)" />
              <div
                className={`absolute top-0 h-7 flex items-center px-2.5 rounded-md text-[11px] font-medium ${TONE[tone]}`}
                style={{ left: `${offset}%`, width: `${width}%` }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
