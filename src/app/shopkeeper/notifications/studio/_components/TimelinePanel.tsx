"use client";

import { useMemo, useState } from "react";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { flattenNodes, nodeLabel } from "@/features/notifications/tree";
import { prettyLabel } from "./properties/fields";
import type { NotificationDesign } from "@/features/notifications/types";

const TABS = [
  { id: "timeline", label: "Timeline", icon: TimelineOutlinedIcon },
  { id: "states", label: "States", icon: LayersOutlinedIcon },
] as const;

const SLOT_TONE: Record<string, string> = {
  entry: "bg-(--color-badge-blue-bg) text-(--color-badge-blue-text)",
  attention: "bg-(--color-brand-primary-light) text-(--color-brand-primary)",
  exit: "bg-(--color-avatar-pink-bg) text-(--color-avatar-pink-dark)",
};

interface Bar {
  id: string;
  label: string;
  slot: "entry" | "attention" | "exit";
  offsetPct: number;
  widthPct: number;
  loops?: boolean;
}
interface TrackRow {
  nodeId: string;
  label: string;
  bars: Bar[];
}

interface Props {
  design: NotificationDesign | null;
  playbackTime: number;
  isPlaying: boolean;
  onPlay: () => void;
}

export default function TimelinePanel({ design, playbackTime, isPlaying, onPlay }: Props) {
  const [tab, setTab] = useState<"timeline" | "states">("timeline");
  const durationMs = design?.timeline?.durationMs ?? 4000;

  const tracks = useMemo<TrackRow[]>(() => {
    if (!design) return [];
    const pct = (ms: number) => Math.min(100, Math.max(0, (ms / durationMs) * 100));
    const rows: TrackRow[] = [];
    for (const { node } of flattenNodes(design.elements)) {
      const anim = node.animation;
      if (!anim?.entry && !anim?.attention && !anim?.exit) continue;
      const bars: Bar[] = [];
      if (anim.entry) {
        const start = anim.entry.delayMs ?? 0;
        const dur = anim.entry.durationMs ?? 500;
        bars.push({ id: `${node.id}-entry`, label: prettyLabel(anim.entry.type), slot: "entry", offsetPct: pct(start), widthPct: pct(dur) || 2 });
      }
      if (anim.attention) {
        const start = anim.entry ? (anim.entry.delayMs ?? 0) + (anim.entry.durationMs ?? 500) : anim.attention.delayMs ?? 0;
        bars.push({ id: `${node.id}-attention`, label: prettyLabel(anim.attention.type), slot: "attention", offsetPct: pct(start), widthPct: 100 - pct(start), loops: true });
      }
      if (anim.exit) {
        const start = anim.exit.delayMs ?? 0;
        const dur = anim.exit.durationMs ?? 400;
        bars.push({ id: `${node.id}-exit`, label: prettyLabel(anim.exit.type), slot: "exit", offsetPct: pct(start), widthPct: pct(dur) || 2 });
      }
      rows.push({ nodeId: node.id, label: nodeLabel(node), bars });
    }
    return rows;
  }, [design, durationMs]);

  const rulerMarks = useMemo(
    () => Array.from({ length: 5 }, (_, i) => `${(((i / 4) * durationMs) / 1000).toFixed(1)}s`),
    [durationMs],
  );
  const playheadPct = Math.min(100, (playbackTime / durationMs) * 100);

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
            onClick={onPlay}
            disabled={!tracks.length}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isPlaying
                ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            <PlayArrowOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-[12px] text-(--color-text-secondary)">
            Duration: <span className="font-semibold text-(--color-text-primary)">{(durationMs / 1000).toFixed(1)}s</span>
          </span>
          <button
            type="button"
            onClick={onPlay}
            className="h-8 px-3 rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary) text-[12px] font-semibold cursor-pointer"
          >
            Preview
          </button>
        </div>
      </div>

      {/* Track area */}
      <div className="flex-1 min-h-0 overflow-auto px-4 py-3">
        <div className="relative">
          {/* Ruler — offset by the label column so it lines up with the bars */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-24 shrink-0" />
            <div className="relative h-4 flex-1">
              {rulerMarks.map((mark, i) => (
                <span
                  key={mark + i}
                  className="absolute -translate-x-1/2 text-[10px] text-(--color-text-hint)"
                  style={{ left: `${(i / (rulerMarks.length - 1)) * 100}%` }}
                >
                  {mark}
                </span>
              ))}
            </div>
          </div>

          {/* Tracks */}
          <div className="flex flex-col gap-1.5">
            {tracks.map((row) => (
              <div key={row.nodeId} className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-[10px] text-(--color-text-hint) truncate">{row.label}</span>
                <div className="relative h-7 flex-1">
                  <div className="absolute inset-0 rounded-md bg-(--color-bg-page)" />
                  {row.bars.map((bar) => (
                    <div
                      key={bar.id}
                      className={`absolute top-0 h-7 flex items-center px-2.5 rounded-md text-[11px] font-medium ${SLOT_TONE[bar.slot]} ${bar.loops ? "opacity-70 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.06)_4px,rgba(0,0,0,0.06)_8px)]" : ""}`}
                      style={{ left: `${bar.offsetPct}%`, width: `${bar.widthPct}%` }}
                    >
                      {bar.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {!tracks.length && (
              <p className="text-[12px] text-(--color-text-hint) py-6 text-center">
                No animated elements yet — set an Entry/Attention/Exit animation from an element&apos;s inspector.
              </p>
            )}
          </div>

          {/* Playhead lives in the same label-offset column as the bars, so its
              percentage is measured against the track width, not the panel. */}
          {isPlaying && tracks.length > 0 && (
            <div className="absolute inset-0 flex gap-2 pointer-events-none">
              <span className="w-24 shrink-0" />
              <div className="relative flex-1">
                <div
                  className="absolute top-0 bottom-0 w-px bg-(--color-danger)"
                  style={{ left: `${playheadPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
