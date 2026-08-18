"use client";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { backgroundCss, gradientCss } from "@/components/notifications/nodeStyle";
import type { Background, GradientStop } from "@/features/notifications/types";

type Mode = "SOLID" | "LINEAR" | "RADIAL";

const PRESETS: { label: string; stops: [string, string] }[] = [
  { label: "Violet", stops: ["#E4DCFB", "#F7F4FF"] },
  { label: "Sky", stops: ["#CFE2FD", "#F8FBFF"] },
  { label: "Mint", stops: ["#CDEEDD", "#F8FDFB"] },
  { label: "Blush", stops: ["#FBD8E4", "#FFF9FB"] },
  { label: "Amber", stops: ["#FDECC8", "#FFFBF2"] },
  { label: "Slate", stops: ["#E2E8F0", "#F8FAFC"] },
];

interface Props {
  width: number;
  background: Background;
  onSet: (bg: Background) => void;
  onClose: () => void;
}

/**
 * A dedicated workspace for the canvas background — solid colour or a fully
 * editable multi-stop gradient (any number of stops, any offsets, linear or
 * radial) — mirroring the Scene Builder's focused, split-panel pattern.
 */
export default function BackgroundBuilderPanel({ width, background, onSet, onClose }: Props) {
  const mode: Mode = background.type === "SOLID" ? "SOLID" : background.gradient?.type === "RADIAL" ? "RADIAL" : "LINEAR";
  const stops: GradientStop[] =
    background.gradient?.stops && background.gradient.stops.length >= 2
      ? background.gradient.stops
      : [{ offset: 0, color: "#5B47D4" }, { offset: 1, color: "#F5F2FF" }];
  const angle = background.gradient?.angle ?? 160;
  const solidColor = background.color ?? "#F5F2FF";

  const setMode = (m: Mode) => {
    if (m === "SOLID") onSet({ type: "SOLID", color: solidColor });
    else onSet({ type: "GRADIENT", gradient: { type: m, angle, stops } });
  };

  const setStops = (next: GradientStop[]) => {
    onSet({ type: "GRADIENT", gradient: { type: mode === "RADIAL" ? "RADIAL" : "LINEAR", angle, stops: sortStops(next) } });
  };
  const setAngle = (a: number) => onSet({ type: "GRADIENT", gradient: { type: "LINEAR", angle: a, stops } });

  const updateStop = (i: number, patch: Partial<GradientStop>) =>
    setStops(stops.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addStop = () => {
    const last = stops[stops.length - 1];
    const prev = stops[stops.length - 2];
    const mid = prev ? (prev.offset + last.offset) / 2 : Math.min(1, last.offset + 0.1);
    setStops([...stops, { offset: Math.round(mid * 100) / 100, color: "#8B76F0" }]);
  };
  const removeStop = (i: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, idx) => idx !== i));
  };

  const previewBg: Background = mode === "SOLID" ? { type: "SOLID", color: solidColor } : { type: "GRADIENT", gradient: { type: mode, angle, stops } };

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col overflow-hidden bg-(--color-bg-surface)"
    >
      <div className="flex items-center justify-between px-4 h-11 shrink-0 border-b border-(--color-border-default)">
        <span className="text-[13px] font-bold text-(--color-text-primary)">Background Builder</span>
        <button
          type="button"
          onClick={onClose}
          title="Close Background Builder"
          className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) cursor-pointer"
        >
          <CloseOutlinedIcon sx={{ fontSize: 15 }} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Live preview */}
        <div
          style={{ background: backgroundCss(previewBg) }}
          className="w-full aspect-16/10 rounded-xl border border-(--color-border-default) shadow-(--shadow-sm)"
        />

        {/* Mode */}
        <div className="grid grid-cols-3 gap-1.5">
          {(["SOLID", "LINEAR", "RADIAL"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`h-8 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                mode === m
                  ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                  : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
              }`}
            >
              {m === "SOLID" ? "Solid" : m === "LINEAR" ? "Linear" : "Radial"}
            </button>
          ))}
        </div>

        {mode === "SOLID" ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-(--color-text-secondary)">Color</span>
            <input
              type="color"
              value={solidColor}
              onChange={(e) => onSet({ type: "SOLID", color: e.target.value })}
              className="w-10 h-8 rounded-md border border-(--color-border-default) bg-transparent cursor-pointer"
            />
          </div>
        ) : (
          <>
            {mode === "LINEAR" && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] text-(--color-text-secondary)">
                  Angle <span className="text-(--color-text-hint)">({angle}°)</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-32 accent-(--color-brand-primary)"
                />
              </div>
            )}

            {/* Gradient bar preview */}
            <div
              style={{ background: gradientCss({ type: mode === "RADIAL" ? "RADIAL" : "LINEAR", angle: 90, stops }) }}
              className="w-full h-6 rounded-lg border border-(--color-border-default)"
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint)">
                  Stops
                </p>
                <button
                  type="button"
                  onClick={addStop}
                  className="flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
                >
                  <AddOutlinedIcon sx={{ fontSize: 13 }} />
                  Add stop
                </button>
              </div>
              {stops.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) => updateStop(i, { color: e.target.value })}
                    className="w-8 h-8 shrink-0 rounded-md border border-(--color-border-default) bg-transparent cursor-pointer"
                  />
                  <label className="flex items-center gap-1 h-8 px-2 flex-1 rounded-lg border border-(--color-border-default) bg-(--color-bg-input)">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={Math.round(s.offset * 100)}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!Number.isNaN(v)) updateStop(i, { offset: Math.min(100, Math.max(0, v)) / 100 });
                      }}
                      className="w-full min-w-0 bg-transparent border-0 outline-none text-[12px] text-(--color-text-primary)"
                    />
                    <span className="text-[10px] text-(--color-text-hint)">%</span>
                  </label>
                  <button
                    type="button"
                    title="Remove stop"
                    disabled={stops.length <= 2}
                    onClick={() => removeStop(i)}
                    className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-(--color-text-hint) hover:bg-(--color-danger-light) hover:text-(--color-danger) disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint)">Presets</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                title={p.label}
                onClick={() => onSet({ type: "GRADIENT", gradient: { type: "LINEAR", angle, stops: [{ offset: 0, color: p.stops[0] }, { offset: 1, color: p.stops[1] }] } })}
                className="h-12 rounded-lg border border-(--color-border-default) hover:border-(--color-brand-primary) transition-colors cursor-pointer"
                style={{ background: `linear-gradient(160deg, ${p.stops[0]}, ${p.stops[1]})` }}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function sortStops(stops: GradientStop[]): GradientStop[] {
  return [...stops].sort((a, b) => a.offset - b.offset);
}
