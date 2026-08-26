/**
 * features/notifications/animationPresets.ts — Single source of truth for the
 * animation catalog. The Animation panel, every inspector's Animation section
 * and the renderer (AnimatedNode) all read from here, so a type can never be
 * offered in the UI without the renderer knowing how to play it.
 *
 * The design JSON stores only the compact AnimStep (type + non-default
 * overrides) — never any of this presentational metadata.
 */

export type AnimSlot = "entry" | "attention" | "exit";
export type AnimTier = "basic" | "advanced";
export type AnimDirection = "up" | "down" | "left" | "right" | "center";

export interface AnimationPreset {
  /** Persisted in AnimStep.type. */
  type: string;
  label: string;
  slot: AnimSlot;
  tier: AnimTier;
  /** Icon key resolved by the panel (MUI icon, UI-only — not stored). */
  icon: string;
  /** Whether the Direction control applies to this animation. */
  directional?: boolean;
}

/** Defaults — anything equal to these is omitted when saving (see compactStep). */
export const ANIM_DEFAULTS = {
  durationMs: 500,
  delayMs: 0,
  easing: "easeOut",
  fillMode: "forwards",
  repeat: 1,
} as const;

export const EASINGS = ["easeOut", "easeIn", "easeInOut", "linear"] as const;
export const EASING_LABELS: Record<string, string> = {
  easeOut: "Ease Out",
  easeIn: "Ease In",
  easeInOut: "Ease In Out",
  linear: "Linear",
};

export const FILL_MODES = ["forwards", "backwards", "both", "none"] as const;

/** Loop options — value is what lands in AnimStep.repeat. */
export const LOOP_OPTIONS: { value: number | "infinite"; label: string }[] = [
  { value: 1, label: "1 Time" },
  { value: 2, label: "2 Times" },
  { value: 3, label: "3 Times" },
  { value: 5, label: "5 Times" },
  { value: "infinite", label: "Loop Forever" },
];

export const ANIMATION_PRESETS: AnimationPreset[] = [
  // ── Entrance · basic ───────────────────────────────────────────────────────
  { type: "NONE", label: "None", slot: "entry", tier: "basic", icon: "none" },
  { type: "FADE_IN", label: "Fade In", slot: "entry", tier: "basic", icon: "fade" },
  { type: "ZOOM_IN", label: "Zoom In", slot: "entry", tier: "basic", icon: "zoomIn" },
  { type: "SLIDE_UP", label: "Slide Up", slot: "entry", tier: "basic", icon: "up", directional: true },
  { type: "SLIDE_DOWN", label: "Slide Down", slot: "entry", tier: "basic", icon: "down", directional: true },
  { type: "SLIDE_LEFT", label: "Slide Left", slot: "entry", tier: "basic", icon: "left", directional: true },
  { type: "SLIDE_RIGHT", label: "Slide Right", slot: "entry", tier: "basic", icon: "right", directional: true },
  { type: "POP", label: "Pop", slot: "entry", tier: "basic", icon: "pop" },
  { type: "FLOAT_IN", label: "Float In", slot: "entry", tier: "basic", icon: "float", directional: true },
  { type: "DROP_IN", label: "Drop In", slot: "entry", tier: "basic", icon: "drop" },
  // ── Entrance · advanced ────────────────────────────────────────────────────
  { type: "ROTATE_IN", label: "Rotate In", slot: "entry", tier: "advanced", icon: "rotate" },
  { type: "FLIP_IN_Y", label: "Flip In Y", slot: "entry", tier: "advanced", icon: "flipY" },
  { type: "FLIP_IN_X", label: "Flip In X", slot: "entry", tier: "advanced", icon: "flipX" },
  { type: "TILT_IN", label: "Tilt In", slot: "entry", tier: "advanced", icon: "tilt" },
  { type: "BOUNCE_IN", label: "Bounce In", slot: "entry", tier: "advanced", icon: "bounce" },
  { type: "ELASTIC_IN", label: "Elastic In", slot: "entry", tier: "advanced", icon: "elastic" },
  { type: "SWING_IN", label: "Swing In", slot: "entry", tier: "advanced", icon: "swing" },
  { type: "ROLL_IN", label: "Roll In", slot: "entry", tier: "advanced", icon: "roll" },
  { type: "BACK_IN", label: "Back In", slot: "entry", tier: "advanced", icon: "back" },
  { type: "SKEW_IN", label: "Skew In", slot: "entry", tier: "advanced", icon: "skew" },
  { type: "UNFOLD_IN", label: "Unfold", slot: "entry", tier: "advanced", icon: "unfold" },
  { type: "SPLIT_IN", label: "Split Open", slot: "entry", tier: "advanced", icon: "split" },
  { type: "CIRCLE_IN", label: "Circle Reveal", slot: "entry", tier: "advanced", icon: "circle" },
  { type: "BLUR_IN", label: "Blur In", slot: "entry", tier: "advanced", icon: "blur" },
  { type: "ZOOM_OUT_IN", label: "Zoom Out In", slot: "entry", tier: "advanced", icon: "zoomOut" },

  // ── Emphasis ───────────────────────────────────────────────────────────────
  { type: "NONE", label: "None", slot: "attention", tier: "basic", icon: "none" },
  { type: "PULSE", label: "Pulse", slot: "attention", tier: "basic", icon: "pop" },
  { type: "FLOAT", label: "Float", slot: "attention", tier: "basic", icon: "float" },
  { type: "GLOW", label: "Glow", slot: "attention", tier: "basic", icon: "fade" },
  { type: "FLASH", label: "Flash", slot: "attention", tier: "basic", icon: "flash" },
  { type: "SHAKE", label: "Shake", slot: "attention", tier: "basic", icon: "elastic" },
  { type: "WIGGLE", label: "Wiggle", slot: "attention", tier: "basic", icon: "swing" },
  { type: "HEARTBEAT", label: "Heartbeat", slot: "attention", tier: "advanced", icon: "heart" },
  { type: "SPIN", label: "Spin", slot: "attention", tier: "advanced", icon: "spin" },
  { type: "SPIN_Y", label: "Coin Flip", slot: "attention", tier: "advanced", icon: "spinY" },
  { type: "BOUNCE", label: "Bounce", slot: "attention", tier: "advanced", icon: "bounce" },
  { type: "TADA", label: "Tada", slot: "attention", tier: "advanced", icon: "pop" },
  { type: "SWING", label: "Swing", slot: "attention", tier: "advanced", icon: "swing" },
  { type: "RUBBER_BAND", label: "Rubber Band", slot: "attention", tier: "advanced", icon: "rubber" },
  { type: "JELLO", label: "Jello", slot: "attention", tier: "advanced", icon: "jello" },
  { type: "WOBBLE", label: "Wobble", slot: "attention", tier: "advanced", icon: "wobble" },

  // ── Exit ───────────────────────────────────────────────────────────────────
  { type: "NONE", label: "None", slot: "exit", tier: "basic", icon: "none" },
  { type: "FADE_OUT", label: "Fade Out", slot: "exit", tier: "basic", icon: "fadeOut" },
  { type: "ZOOM_OUT", label: "Zoom Out", slot: "exit", tier: "basic", icon: "zoomOut" },
  { type: "SLIDE_OUT_UP", label: "Slide Out Up", slot: "exit", tier: "basic", icon: "up", directional: true },
  { type: "SLIDE_OUT_DOWN", label: "Slide Out Down", slot: "exit", tier: "basic", icon: "down", directional: true },
  { type: "SLIDE_OUT_LEFT", label: "Slide Out Left", slot: "exit", tier: "basic", icon: "left", directional: true },
  { type: "SLIDE_OUT_RIGHT", label: "Slide Out Right", slot: "exit", tier: "basic", icon: "right", directional: true },
  { type: "DROP_OUT", label: "Drop Out", slot: "exit", tier: "basic", icon: "drop" },
  { type: "POP_OUT", label: "Pop Out", slot: "exit", tier: "advanced", icon: "pop" },
  { type: "BOUNCE_OUT", label: "Bounce Out", slot: "exit", tier: "advanced", icon: "bounce" },
  { type: "FLIP_OUT", label: "Flip Out Y", slot: "exit", tier: "advanced", icon: "flipY" },
  { type: "FLIP_OUT_X", label: "Flip Out X", slot: "exit", tier: "advanced", icon: "flipX" },
  { type: "ROLL_OUT", label: "Roll Out", slot: "exit", tier: "advanced", icon: "roll" },
  { type: "SKEW_OUT", label: "Skew Out", slot: "exit", tier: "advanced", icon: "skew" },
  { type: "FOLD_OUT", label: "Fold Away", slot: "exit", tier: "advanced", icon: "fold" },
  { type: "CIRCLE_OUT", label: "Circle Close", slot: "exit", tier: "advanced", icon: "circle" },
  { type: "BLUR_OUT", label: "Blur Out", slot: "exit", tier: "advanced", icon: "blur" },
];

export function presetsFor(slot: AnimSlot, tier?: AnimTier): AnimationPreset[] {
  return ANIMATION_PRESETS.filter((p) => p.slot === slot && (!tier || p.tier === tier));
}

export function presetFor(slot: AnimSlot, type?: string): AnimationPreset | undefined {
  if (!type) return undefined;
  return ANIMATION_PRESETS.find((p) => p.slot === slot && p.type === type);
}

export function animLabel(slot: AnimSlot, type?: string): string {
  return presetFor(slot, type)?.label ?? (type ? type.replace(/_/g, " ") : "None");
}

/** Every type the renderer must handle, for the validation mirror + tests. */
export const ANIMATION_TYPES = Array.from(new Set(ANIMATION_PRESETS.map((p) => p.type)));

/**
 * Strips every field that equals its default, so the saved design JSON carries
 * only what the shopkeeper actually changed. A default Fade In persists as
 * `{ "type": "FADE_IN" }` rather than six redundant keys — across dozens of
 * animated elements that's a meaningfully smaller document to store and ship.
 * The renderer re-applies the same defaults on read, so nothing is lost.
 */
export function compactStep(step: AnimStepLike | undefined): AnimStepLike | undefined {
  if (!step || step.type === "NONE") return undefined;
  const out: AnimStepLike = { type: step.type };
  if (step.durationMs != null && step.durationMs !== ANIM_DEFAULTS.durationMs) out.durationMs = step.durationMs;
  if (step.delayMs != null && step.delayMs !== ANIM_DEFAULTS.delayMs) out.delayMs = step.delayMs;
  if (step.easing && step.easing !== ANIM_DEFAULTS.easing) out.easing = step.easing;
  if (step.fillMode && step.fillMode !== ANIM_DEFAULTS.fillMode) out.fillMode = step.fillMode;
  if (step.repeat != null && step.repeat !== ANIM_DEFAULTS.repeat) out.repeat = step.repeat;
  if (step.direction) out.direction = step.direction;
  if (step.intensity != null) out.intensity = step.intensity;
  return out;
}

/**
 * How long an element's animation runs, in ms — used to end a single-element
 * preview and return it to rest. A looping emphasis is measured as one cycle,
 * which is enough to show what it does without running forever.
 */
export function animationLengthMs(animation?: {
  entry?: AnimStepLike | null;
  attention?: AnimStepLike | null;
  exit?: AnimStepLike | null;
}): number {
  if (!animation) return 0;
  const end = (s?: AnimStepLike | null) =>
    s ? (s.delayMs ?? ANIM_DEFAULTS.delayMs) + (s.durationMs ?? ANIM_DEFAULTS.durationMs) : 0;

  const entryEnd = end(animation.entry);
  const emphasis = animation.attention;
  const emphasisStart = animation.entry ? entryEnd : (emphasis?.delayMs ?? ANIM_DEFAULTS.delayMs);
  const emphasisEnd = emphasis ? emphasisStart + (emphasis.durationMs ?? 1200) : 0;

  return Math.max(entryEnd, emphasisEnd, end(animation.exit));
}

interface AnimStepLike {
  type: string;
  durationMs?: number;
  delayMs?: number;
  easing?: string;
  intensity?: number;
  repeat?: number | "infinite";
  direction?: AnimDirection;
  fillMode?: "forwards" | "backwards" | "both" | "none";
}
