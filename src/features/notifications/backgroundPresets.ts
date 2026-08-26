/**
 * features/notifications/backgroundPresets.ts — Ready-made canvas backgrounds
 * (data, not React). One catalog shared by the Background tab and the
 * Background Builder, so the two never drift apart.
 *
 * Each preset is a plain Background, exactly what the canvas already stores —
 * picking one is a normal background change, fully editable afterwards in the
 * Builder and undoable like any other edit.
 *
 * Groups run light → dark on purpose. Every shipped template lays dark ink on
 * the banner, so everything above Midnight is drop-in safe; Midnight is kept
 * separate because its members need the copy recoloured to read at all.
 *
 * Presets are audited to be visually distinct from one another — no two sample
 * to a near-identical colour ramp, so nothing in the picker is a near-duplicate
 * of something else in it.
 */

import type { Background } from "./types";

export const BACKGROUND_GROUPS = [
  "Soft", "Vivid", "Duotone", "Sunset", "Cool", "Earthy", "Glow", "Neutral", "Midnight",
] as const;
export type BackgroundGroup = (typeof BACKGROUND_GROUPS)[number];

export interface BackgroundPreset {
  id: string;
  label: string;
  group: BackgroundGroup;
  background: Background;
  /** True when the artwork needs light text on top of it. */
  dark?: boolean;
}

// ── builders ─────────────────────────────────────────────────────────────────

/** Evenly spaces the colours across the gradient. */
function stops(colors: string[]) {
  return colors.map((color, i) => ({
    offset: colors.length === 1 ? 0 : Math.round((i / (colors.length - 1)) * 100) / 100,
    color,
  }));
}

const linear = (angle: number, ...colors: string[]): Background => ({
  type: "GRADIENT",
  gradient: { type: "LINEAR", angle, stops: stops(colors) },
});

const radial = (...colors: string[]): Background => ({
  type: "GRADIENT",
  gradient: { type: "RADIAL", stops: stops(colors) },
});

const solid = (color: string): Background => ({ type: "SOLID", color });

// 160° matches the angle the seeded templates are designed against, so a preset
// swapped onto a stock template keeps the same light direction. Duotones use a
// flatter 135° because a bold two-hue blend reads better across the diagonal.
const A = 160;
const D = 135;

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // ── Soft — light washes, safe under the templates' dark ink ────────────────
  // Each carries real tint rather than a hint of one: at near-white these all
  // collapse into the same pale wash and the group stops being a choice. Hues
  // are spaced around the wheel so no two read as the same colour.
  { id: "lavender-mist", label: "Lavender Mist", group: "Soft", background: linear(A, "#D2C6F8", "#F7F3FF") },
  { id: "sky-wash", label: "Sky Wash", group: "Soft", background: linear(A, "#C7DEFB", "#F2F8FF") },
  { id: "seafoam", label: "Seafoam", group: "Soft", background: linear(A, "#BFEDE8", "#F0FCFA") },
  { id: "mint-cream", label: "Mint Cream", group: "Soft", background: linear(A, "#C2EDCB", "#F1FCF4") },
  { id: "sage", label: "Sage", group: "Soft", background: linear(A, "#DFE9BC", "#F9FBEE") },
  { id: "butter", label: "Butter", group: "Soft", background: linear(A, "#FCE5A4", "#FFFAEA") },
  { id: "peach-silk", label: "Peach Silk", group: "Soft", background: linear(A, "#FBD9C2", "#FFF6EF") },
  { id: "blush", label: "Blush", group: "Soft", background: linear(A, "#FAC2D0", "#FFF1F4") },
  { id: "petal", label: "Petal", group: "Soft", background: linear(A, "#F3C9EE", "#FEF3FD") },

  // ── Vivid — saturated, still light enough for dark copy ────────────────────
  { id: "grape-soda", label: "Grape Soda", group: "Vivid", background: linear(A, "#A78BFA", "#EDE4FF") },
  { id: "electric-blue", label: "Electric Blue", group: "Vivid", background: linear(A, "#60A5FA", "#DDEBFE") },
  { id: "emerald", label: "Emerald", group: "Vivid", background: linear(A, "#34D399", "#D6FAE8") },
  { id: "coral", label: "Coral", group: "Vivid", background: linear(A, "#FB7185", "#FFE0E3") },
  { id: "tangerine", label: "Tangerine", group: "Vivid", background: linear(A, "#FBBF24", "#FEF3C7") },
  { id: "cyan-pop", label: "Cyan Pop", group: "Vivid", background: linear(A, "#22D3EE", "#D5FAFE") },
  { id: "magenta", label: "Magenta", group: "Vivid", background: linear(A, "#E879F9", "#FBE9FE") },
  { id: "lime", label: "Lime", group: "Vivid", background: linear(A, "#A3E635", "#EDFCCE") },

  // ── Duotone — bold two-hue blends across the diagonal ──────────────────────
  { id: "ultraviolet", label: "Ultraviolet", group: "Duotone", background: linear(D, "#7C3AED", "#EC4899") },
  { id: "aurora", label: "Aurora", group: "Duotone", background: linear(D, "#06B6D4", "#8B5CF6") },
  { id: "citrus", label: "Citrus", group: "Duotone", background: linear(D, "#F59E0B", "#EF4444") },
  { id: "meadow", label: "Meadow", group: "Duotone", background: linear(D, "#22C55E", "#0EA5E9") },
  { id: "bubblegum", label: "Bubblegum", group: "Duotone", background: linear(D, "#F472B6", "#818CF8") },
  { id: "reef", label: "Reef", group: "Duotone", background: linear(D, "#14B8A6", "#3B82F6") },
  { id: "sorbet", label: "Sorbet", group: "Duotone", background: linear(D, "#FB7185", "#FBBF24") },
  { id: "neon-lime", label: "Neon Lime", group: "Duotone", background: linear(D, "#84CC16", "#06B6D4") },

  // ── Sunset — three-stop warms ──────────────────────────────────────────────
  { id: "golden-hour", label: "Golden Hour", group: "Sunset", background: linear(A, "#FDE68A", "#FBA36B", "#F472B6") },
  { id: "mango", label: "Mango", group: "Sunset", background: linear(A, "#FEF3C7", "#FDBA74", "#FB7185") },
  { id: "ember", label: "Ember", group: "Sunset", background: linear(A, "#FFD9A0", "#FF9A76", "#E8637B") },
  { id: "desert", label: "Desert", group: "Sunset", background: linear(A, "#FCD9A8", "#F5A97F", "#D97757") },
  { id: "rose-gold", label: "Rose Gold", group: "Sunset", background: linear(A, "#FDE2E4", "#F5B7B1", "#D98880") },
  { id: "papaya", label: "Papaya", group: "Sunset", background: linear(A, "#FFE9C7", "#FFC48A", "#FF8FA3") },
  { id: "dusk", label: "Dusk", group: "Sunset", background: linear(A, "#FCD5CE", "#C89EC4", "#7D6BAF") },

  // ── Cool — three-stop blues, teals and greens ──────────────────────────────
  { id: "ocean", label: "Ocean", group: "Cool", background: linear(A, "#CFFAFE", "#7DD3FC", "#38BDF8") },
  { id: "arctic", label: "Arctic", group: "Cool", background: linear(A, "#F0F9FF", "#BAE6FD", "#7DD3FC") },
  { id: "lagoon", label: "Lagoon", group: "Cool", background: linear(A, "#CCFBF1", "#5EEAD4", "#2DD4BF") },
  { id: "forest", label: "Forest", group: "Cool", background: linear(A, "#DCFCE7", "#86EFAC", "#4ADE80") },
  { id: "twilight", label: "Twilight", group: "Cool", background: linear(A, "#E0E7FF", "#A5B4FC", "#818CF8") },
  { id: "glacier", label: "Glacier", group: "Cool", background: linear(A, "#ECFEFF", "#A5F3FC", "#67E8F9") },
  { id: "steel", label: "Steel", group: "Cool", background: linear(A, "#F1F5F9", "#CBD5E1", "#94A3B8") },

  // ── Earthy — muted naturals, three stops so each keeps its own range ───────
  { id: "sand", label: "Sand", group: "Earthy", background: linear(A, "#FAF0DC", "#EBD8B7", "#D9BE8E") },
  { id: "terracotta", label: "Terracotta", group: "Earthy", background: linear(A, "#F7DDD2", "#E5A98F", "#C97B5A") },
  { id: "olive", label: "Olive", group: "Earthy", background: linear(A, "#EDEFD9", "#CFD6A8", "#A8B378") },
  { id: "mocha", label: "Mocha", group: "Earthy", background: linear(A, "#EFE4DA", "#D3BCA8", "#A98B72") },
  { id: "driftwood", label: "Driftwood", group: "Earthy", background: linear(A, "#F2F0EB", "#D6D1C6", "#ABA598") },
  { id: "moss", label: "Moss", group: "Earthy", background: linear(A, "#E3EEDC", "#B8D3AC", "#86AE79") },

  // ── Glow — radial, brightest at the centre where the product sits ──────────
  // Pitched deeper than the Soft washes so the centre actually glows, and off
  // the Vivid hues so a radial isn't just a linear preset in disguise.
  { id: "violet-glow", label: "Violet Glow", group: "Glow", background: radial("#9B7BF5", "#F3EFFE") },
  { id: "amber-glow", label: "Amber Glow", group: "Glow", background: radial("#F7B34A", "#FEF6E4") },
  { id: "rose-glow", label: "Rose Glow", group: "Glow", background: radial("#F58BC0", "#FEF0F7") },
  { id: "aqua-glow", label: "Aqua Glow", group: "Glow", background: radial("#6FD9E8", "#EAFBFE") },
  { id: "lime-glow", label: "Lime Glow", group: "Glow", background: radial("#9BDE72", "#F1FCEA") },
  { id: "spotlight", label: "Spotlight", group: "Glow", background: radial("#FFFFFF", "#E3E0F0", "#C6C1DF") },

  // ── Neutral — flat tones, white through to mid grey ────────────────────────
  { id: "white", label: "White", group: "Neutral", background: solid("#FFFFFF") },
  { id: "porcelain", label: "Porcelain", group: "Neutral", background: solid("#F1F5F9") },
  { id: "linen", label: "Linen", group: "Neutral", background: solid("#F3EDE3") },
  { id: "haze", label: "Haze", group: "Neutral", background: solid("#EAE4F5") },
  { id: "stone", label: "Stone", group: "Neutral", background: solid("#E2DED6") },
  { id: "slate-tint", label: "Slate Tint", group: "Neutral", background: solid("#D8DEE6") },

  // ── Midnight — needs light text on top ─────────────────────────────────────
  { id: "midnight", label: "Midnight", group: "Midnight", dark: true, background: linear(A, "#1E1B4B", "#312E81") },
  { id: "deep-plum", label: "Deep Plum", group: "Midnight", dark: true, background: linear(A, "#2E1065", "#5B21B6") },
  { id: "navy", label: "Navy", group: "Midnight", dark: true, background: linear(A, "#0F172A", "#1E3A8A") },
  { id: "ink-teal", label: "Ink Teal", group: "Midnight", dark: true, background: linear(A, "#042F2E", "#115E59") },
  { id: "wine", label: "Wine", group: "Midnight", dark: true, background: linear(A, "#4C0519", "#881337") },
  { id: "charcoal", label: "Charcoal", group: "Midnight", dark: true, background: linear(A, "#1F2937", "#374151") },
  { id: "espresso", label: "Espresso", group: "Midnight", dark: true, background: linear(A, "#2A2320", "#4A3F38") },
  { id: "nebula", label: "Nebula", group: "Midnight", dark: true, background: radial("#4C1D95", "#130B2E") },
];

export function backgroundsIn(group: BackgroundGroup): BackgroundPreset[] {
  return BACKGROUND_PRESETS.filter((p) => p.group === group);
}

/**
 * Whether a preset is the background currently on the canvas. Compares the
 * resolved shape rather than object identity, so a preset still reads as
 * selected after the design has been saved and reloaded.
 */
export function isSameBackground(a: Background | undefined, b: Background): boolean {
  if (!a || a.type !== b.type) return false;
  if (b.type === "SOLID") return a.color?.toUpperCase() === b.color?.toUpperCase();
  const ga = a.gradient;
  const gb = b.gradient;
  if (!ga || !gb) return false;
  if ((ga.type ?? "LINEAR") !== (gb.type ?? "LINEAR")) return false;
  if (gb.type !== "RADIAL" && (ga.angle ?? 160) !== (gb.angle ?? 160)) return false;
  if (ga.stops.length !== gb.stops.length) return false;
  return ga.stops.every(
    (s, i) => s.color.toUpperCase() === gb.stops[i].color.toUpperCase() && Math.abs(s.offset - gb.stops[i].offset) < 0.01,
  );
}
