"use client";

import { useState, type ReactNode } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import type { NodeStyle } from "@/features/notifications/types";
import { ColorField, NumberField, Row, Slider, Toggle } from "./fields";

/** Splits a stored color (hex or rgba) into a hex swatch value + 0-1 alpha for effect opacity sliders. */
function parseColorAlpha(c: string | undefined, fallbackHex: string, fallbackAlpha: number): { hex: string; alpha: number } {
  if (!c) return { hex: fallbackHex, alpha: fallbackAlpha };
  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(c);
  if (rgba) {
    const r = Number(rgba[1]).toString(16).padStart(2, "0");
    const g = Number(rgba[2]).toString(16).padStart(2, "0");
    const b = Number(rgba[3]).toString(16).padStart(2, "0");
    return { hex: `#${r}${g}${b}`, alpha: rgba[4] !== undefined ? Number(rgba[4]) : 1 };
  }
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return { hex: c, alpha: 1 };
  return { hex: fallbackHex, alpha: fallbackAlpha };
}

function colorWithAlpha(hex: string, alpha: number): string {
  const h = /^#([0-9a-fA-F]{6})$/.exec(hex)?.[1] ?? "0f172a";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function EffectRow({ label, enabled, onToggle, children }: { label: string; enabled: boolean; onToggle: (v: boolean) => void; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-(--color-border-default) overflow-hidden">
      <div className="flex items-center gap-2 h-9 px-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 flex-1 text-[12px] font-medium text-(--color-text-secondary) hover:text-(--color-text-primary) cursor-pointer"
        >
          <ExpandMoreOutlinedIcon sx={{ fontSize: 16 }} style={{ transform: open ? undefined : "rotate(-90deg)", transition: "transform 0.15s" }} />
          {label}
        </button>
        <Toggle checked={enabled} onChange={onToggle} title={`${enabled ? "Disable" : "Enable"} ${label.toLowerCase()}`} />
      </div>
      {open && <div className="px-2.5 pb-2.5 pt-1 flex flex-col gap-2.5 border-t border-(--color-border-default)">{children}</div>}
    </div>
  );
}

interface Props {
  style: NodeStyle;
  setStyle: (patch: Partial<NodeStyle>) => void;
}

/** Effects: Opacity (always on), then optional Shadow / Glow / Outline / Blur — each toggled independently. */
export default function TextEffectsSection({ style, setStyle }: Props) {
  const shadow = parseColorAlpha(style.textShadow?.color, "#0f172a", 0.35);
  const glow = parseColorAlpha(style.glow?.color, "#7c6ae8", 0.6);

  return (
    <div className="flex flex-col gap-2.5">
      <Row label="Opacity">
        <Slider value={style.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v) => setStyle({ opacity: v })} />
      </Row>

      <EffectRow
        label="Shadow"
        enabled={!!style.textShadow?.enabled}
        onToggle={(v) =>
          setStyle({
            textShadow: v
              ? { enabled: true, x: style.textShadow?.x ?? 0, y: style.textShadow?.y ?? 4, blur: style.textShadow?.blur ?? 8, spread: style.textShadow?.spread ?? 0, color: style.textShadow?.color ?? "rgba(15,23,42,0.35)" }
              : { ...style.textShadow, enabled: false },
          })
        }
      >
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="X" value={style.textShadow?.x ?? 0} onChange={(v) => setStyle({ textShadow: { ...style.textShadow, enabled: true, x: v } })} />
          <NumberField label="Y" value={style.textShadow?.y ?? 4} onChange={(v) => setStyle({ textShadow: { ...style.textShadow, enabled: true, y: v } })} />
          <NumberField label="Blur" value={style.textShadow?.blur ?? 8} onChange={(v) => setStyle({ textShadow: { ...style.textShadow, enabled: true, blur: v } })} />
          <NumberField label="Spread" value={style.textShadow?.spread ?? 0} onChange={(v) => setStyle({ textShadow: { ...style.textShadow, enabled: true, spread: v } })} />
        </div>
        <Row label="Color">
          <ColorField value={shadow.hex} onChange={(v) => setStyle({ textShadow: { ...style.textShadow, enabled: true, color: colorWithAlpha(v, shadow.alpha) } })} />
        </Row>
        <Row label="Opacity">
          <Slider value={shadow.alpha} min={0} max={1} step={0.05} onChange={(v) => setStyle({ textShadow: { ...style.textShadow, enabled: true, color: colorWithAlpha(shadow.hex, v) } })} />
        </Row>
      </EffectRow>

      <EffectRow
        label="Glow"
        enabled={!!style.glow?.enabled}
        onToggle={(v) =>
          setStyle({
            glow: v
              ? { enabled: true, color: style.glow?.color ?? "#7C6AE8", blur: style.glow?.blur ?? 16, opacity: style.glow?.opacity ?? 0.6 }
              : { ...style.glow, enabled: false },
          })
        }
      >
        <Row label="Color">
          <ColorField value={glow.hex} onChange={(v) => setStyle({ glow: { ...style.glow, enabled: true, color: v } })} />
        </Row>
        <Row label="Blur">
          <Slider value={style.glow?.blur ?? 16} min={0} max={80} step={1} onChange={(v) => setStyle({ glow: { ...style.glow, enabled: true, blur: v } })} />
        </Row>
        <Row label="Opacity">
          <Slider value={style.glow?.opacity ?? 0.6} min={0} max={1} step={0.05} onChange={(v) => setStyle({ glow: { ...style.glow, enabled: true, opacity: v } })} />
        </Row>
      </EffectRow>

      <EffectRow
        label="Outline"
        enabled={!!style.border}
        onToggle={(v) => setStyle({ border: v ? { width: style.border?.width ?? 1, color: style.border?.color ?? "#0F172A" } : undefined })}
      >
        <Row label="Width">
          <NumberField label="" value={style.border?.width ?? 1} suffix="px" onChange={(v) => setStyle({ border: { ...style.border, width: v } })} />
        </Row>
        <Row label="Color">
          <ColorField value={style.border?.color} onChange={(v) => setStyle({ border: { ...style.border, color: v } })} />
        </Row>
      </EffectRow>

      <EffectRow label="Blur" enabled={(style.blur ?? 0) > 0} onToggle={(v) => setStyle({ blur: v ? style.blur || 6 : 0 })}>
        <Row label="Amount">
          <Slider value={style.blur ?? 0} min={0} max={40} step={1} onChange={(v) => setStyle({ blur: v })} />
        </Row>
      </EffectRow>
    </div>
  );
}
