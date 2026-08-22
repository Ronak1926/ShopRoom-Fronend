"use client";

import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CenterFocusStrongOutlinedIcon from "@mui/icons-material/CenterFocusStrongOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import {
  ANIM_DEFAULTS, EASINGS, EASING_LABELS, FILL_MODES, LOOP_OPTIONS,
  compactStep, presetFor, presetsFor, type AnimSlot,
} from "@/features/notifications/animationPresets";
import type { AnimStep, CompositionNode } from "@/features/notifications/types";
import { Row, Section, Slider } from "./fields";
import { ANIM_ICONS } from "../animationIcons";

const SLOTS: { id: AnimSlot; label: string }[] = [
  { id: "entry", label: "Entrance" },
  { id: "attention", label: "Emphasis" },
  { id: "exit", label: "Exit" },
];

const DIRECTIONS: { value: "up" | "down" | "left" | "right" | "center"; icon: typeof ArrowUpwardOutlinedIcon; label: string }[] = [
  { value: "up", icon: ArrowUpwardOutlinedIcon, label: "From bottom" },
  { value: "down", icon: ArrowDownwardOutlinedIcon, label: "From top" },
  { value: "left", icon: ArrowBackOutlinedIcon, label: "From right" },
  { value: "right", icon: ArrowForwardOutlinedIcon, label: "From left" },
  { value: "center", icon: CenterFocusStrongOutlinedIcon, label: "From centre" },
];

interface Props {
  node: CompositionNode;
  update: (patch: (n: CompositionNode) => CompositionNode) => void;
  /** Plays this element's animation on the canvas, on its own. */
  onPreview?: (id: string) => void;
}

/**
 * Shared animation controls for every inspector. Writes through compactStep so
 * only non-default fields reach the design JSON.
 */
export default function AnimationSection({ node, update, onPreview }: Props) {
  const setStep = (slot: AnimSlot, patch: Partial<AnimStep> | null) =>
    update((n) => {
      const existing = n.animation?.[slot] ?? undefined;
      const next = patch === null ? undefined : compactStep({ ...existing, ...patch } as AnimStep);
      return { ...n, animation: { ...n.animation, [slot]: next } };
    });

  return (
    <>
      {SLOTS.map(({ id: slot, label }) => {
        const step = node.animation?.[slot] ?? undefined;
        const type = step?.type ?? "NONE";
        const preset = presetFor(slot, type);
        const options = presetsFor(slot);
        const Icon = ANIM_ICONS[preset?.icon ?? "none"] ?? ANIM_ICONS.none;
        const duration = step?.durationMs ?? ANIM_DEFAULTS.durationMs;
        const delay = step?.delayMs ?? ANIM_DEFAULTS.delayMs;

        return (
          <Section key={slot} title={label}>
            <div className="flex flex-col gap-2.5">
              {/* Animation type */}
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-(--color-brand-primary-light) text-(--color-brand-primary)">
                  <Icon sx={{ fontSize: 17 }} />
                </span>
                <select
                  value={type}
                  onChange={(e) => (e.target.value === "NONE" ? setStep(slot, null) : setStep(slot, { type: e.target.value }))}
                  className="flex-1 min-w-0 h-9 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer"
                >
                  {options.map((o) => (
                    <option key={o.type} value={o.type}>{o.label}</option>
                  ))}
                </select>
              </div>

              {step && (
                <>
                  <Row label="Duration">
                    <div className="flex items-center gap-2">
                      <Slider value={duration} min={100} max={4000} step={50} onChange={(v) => setStep(slot, { durationMs: v })} />
                      <span className="w-9 text-right text-[11px] font-medium text-(--color-text-primary)">
                        {(duration / 1000).toFixed(1)}s
                      </span>
                    </div>
                  </Row>
                  <Row label="Delay">
                    <div className="flex items-center gap-2">
                      <Slider value={delay} min={0} max={5000} step={50} onChange={(v) => setStep(slot, { delayMs: v })} />
                      <span className="w-9 text-right text-[11px] font-medium text-(--color-text-primary)">
                        {(delay / 1000).toFixed(1)}s
                      </span>
                    </div>
                  </Row>
                  <Row label="Easing">
                    <select
                      value={step.easing ?? ANIM_DEFAULTS.easing}
                      onChange={(e) => setStep(slot, { easing: e.target.value })}
                      className="h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer"
                    >
                      {EASINGS.map((e) => (
                        <option key={e} value={e}>{EASING_LABELS[e]}</option>
                      ))}
                    </select>
                  </Row>

                  {preset?.directional && (
                    <div>
                      <p className="text-[11px] text-(--color-text-hint) mb-1.5">Direction</p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {DIRECTIONS.map(({ value, icon: DIcon, label: dLabel }) => {
                          const active = step.direction === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              title={dLabel}
                              onClick={() => setStep(slot, { direction: active ? undefined : value })}
                              className={`h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                                active
                                  ? "border-(--color-brand-primary) bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                                  : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
                              }`}
                            >
                              <DIcon sx={{ fontSize: 14 }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Row label="Loop">
                    <select
                      value={String(step.repeat ?? ANIM_DEFAULTS.repeat)}
                      onChange={(e) =>
                        setStep(slot, { repeat: e.target.value === "infinite" ? "infinite" : Number(e.target.value) })
                      }
                      className="h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer"
                    >
                      {LOOP_OPTIONS.map((o) => (
                        <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
                      ))}
                    </select>
                  </Row>

                  <Row label="Fill mode">
                    <select
                      value={step.fillMode ?? ANIM_DEFAULTS.fillMode}
                      onChange={(e) => setStep(slot, { fillMode: e.target.value as AnimStep["fillMode"] })}
                      className="h-8 px-2 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) text-[12px] font-medium text-(--color-text-primary) cursor-pointer capitalize"
                    >
                      {FILL_MODES.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </Row>
                </>
              )}
            </div>
          </Section>
        );
      })}

      {onPreview && (
        <Section title="Preview Animation">
          <button
            type="button"
            onClick={() => onPreview(node.id)}
            className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-(--color-brand-primary) text-[12px] font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            <PlayArrowOutlinedIcon sx={{ fontSize: 17 }} />
            Play this element
          </button>
          <p className="mt-1.5 text-[10px] leading-relaxed text-(--color-text-hint)">
            Plays only this element. Use Play in the Timeline to preview the whole notification.
          </p>
        </Section>
      )}
    </>
  );
}
