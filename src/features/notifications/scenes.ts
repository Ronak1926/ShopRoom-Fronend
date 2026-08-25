/**
 * features/notifications/scenes.ts — ShopRoom scene catalog (data, not React).
 *
 * A "scene" is the editable background composition of a notification: a canvas
 * background plus layered DECORATION nodes. Each scene is composed in depth
 * bands — atmosphere (z0–9) → far foliage (z10–19) → near foliage (z20–29) →
 * product environment (z30–49) → foreground sparkle/vignette (z100+) — so the
 * result reads like an illustration, not a flat tint. Applying a scene inserts
 * these as normal composition nodes, so every object stays editable.
 */

import type { Background, CompositionNode } from "./types";

export const SCENE_CATEGORIES = [
  "All", "Nature", "Clouds", "Abstract", "Sale", "Minimal", "Glow", "Premium",
] as const;
export type SceneCategory = (typeof SCENE_CATEGORIES)[number];

export interface Scene {
  id: string;
  name: string;
  category: Exclude<SceneCategory, "All">;
  background: Background;
  elements: CompositionNode[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

interface DecoOpts { color?: string; opacity?: number; z?: number; rotation?: number; blur?: number }
/** `name` doubles as the Layers label (e.g. "Leaf Left"). */
function deco(
  name: string,
  assetId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  o: DecoOpts = {},
): CompositionNode {
  return {
    id: `scn-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    type: "DECORATION",
    name,
    asset: { type: "SVG", assetId },
    frame: { x, y, width: w, height: h, rotation: o.rotation ?? 0, zIndex: o.z ?? 10 },
    style: {
      ...(o.color ? { color: o.color } : {}),
      ...(o.opacity != null ? { opacity: o.opacity } : {}),
      ...(o.blur != null ? { blur: o.blur } : {}),
    },
    visible: true,
    locked: false,
  };
}

function grad(from: string, mid: string, to: string, angle = 172): Background {
  return {
    type: "GRADIENT",
    gradient: {
      type: "LINEAR",
      angle,
      stops: [{ offset: 0, color: from }, { offset: 0.55, color: mid }, { offset: 1, color: to }],
    },
  };
}

/** The notification banner scenes are composed for — Android's 2:1 big picture. */
const CANVAS_W = 400;
const CANVAS_H = 200;

/**
 * Centre of the right-hand product zone every ShopRoom template leaves free.
 * Scene artwork frames the product and the left-hand text column; it never
 * takes them over.
 */
const VISUAL_CX = 306;

/**
 * Atmosphere shared by every scene: two soft glows for depth.
 *
 * Every decoration in this file is placed so its CENTRE lands inside the
 * canvas. Art may bleed past an edge — that bleed is what makes it read as a
 * frame — but a layer whose centre falls outside can't be seen or grabbed on
 * the banner while still being listed in Layers, so clicking its row put the
 * selection handles out in empty space next to the artboard.
 */
function atmosphere(a: string, b: string): CompositionNode[] {
  return [
    deco("Glow Top", "glow", -58, -74, 210, 210, { color: a, opacity: 0.55, z: 2 }),
    deco("Glow Bottom", "glow", 232, 62, 210, 210, { color: b, opacity: 0.4, z: 2 }),
  ];
}

/**
 * Product environment: soft light, contact shadow and a 3D podium. `baseY` is
 * tuned so the podium's top edge meets the bottom of the template's product
 * image slot (which ends at y=144) — the product stands on it rather than
 * floating above it.
 */
function stage(color: string, cx = VISUAL_CX, baseY = 164): CompositionNode[] {
  return [
    deco("Product Glow", "product-glow", cx - 62, baseY - 104, 124, 124, { color, opacity: 0.45, z: 30 }),
    deco("Product Shadow", "product-shadow", cx - 38, baseY - 4, 76, 16, { z: 32, opacity: 0.5 }),
    deco("Pedestal", "pedestal", cx - 52, baseY - 14, 104, 32, { color, opacity: 0.92, z: 34 }),
  ];
}

const sparkles = (color: string): CompositionNode[] => [
  deco("Sparkle 1", "sparkle", 232, 26, 16, 16, { color: "#FFFFFF", opacity: 0.95, z: 110 }),
  deco("Sparkle 2", "sparkle", 366, 142, 13, 13, { color, opacity: 0.85, z: 110 }),
  deco("Sparkle 3", "sparkle", 356, 40, 10, 10, { color: "#FFFFFF", opacity: 0.75, z: 110 }),
];

/**
 * Full-canvas edge darkening. It MUST cover the canvas exactly — a vignette
 * narrower than the canvas darkens only part of it and leaves a hard vertical
 * seam where it stops, which reads as a shadow across one side of the banner.
 */
const vignette = (opacity: number): CompositionNode =>
  deco("Vignette", "vignette", 0, 0, CANVAS_W, CANVAS_H, { opacity, z: 120 });

// ── ShopRoom scenes ──────────────────────────────────────────────────────────

export const SCENES: Scene[] = [
  {
    id: "botanical-soft",
    name: "Botanical Soft",
    category: "Nature",
    background: grad("#E5DCFC", "#F1EBFF", "#FBF9FF"),
    elements: [
      ...atmosphere("#8B76F0", "#C4B5FD"),
      deco("Cloud Far", "cloud-soft", -46, -16, 176, 74, { color: "#FFFFFF", opacity: 0.55, z: 8, blur: 2 }),
      deco("Cloud Near", "cloud", -22, 6, 140, 62, { color: "#FFFFFF", opacity: 0.9, z: 12 }),
      deco("Plant Far Left", "fern", -36, 48, 82, 126, { color: "#7C63E8", opacity: 0.22, z: 14, rotation: -14 }),
      deco("Plant Left", "plant", -48, 76, 124, 126, { color: "#6D55DE", opacity: 0.34, z: 20, rotation: -8 }),
      deco("Leaf Left", "leaf-sprig", -20, 120, 74, 92, { color: "#5B47D4", opacity: 0.26, z: 24, rotation: 14 }),
      deco("Plant Right", "plant", 316, 74, 126, 130, { color: "#6D55DE", opacity: 0.34, z: 20, rotation: 8 }),
      deco("Leaf Right", "leaf-sprig", 330, 6, 76, 100, { color: "#7C63E8", opacity: 0.28, z: 16, rotation: 22 }),
      deco("Fern Right", "fern", 344, 92, 72, 106, { color: "#5B47D4", opacity: 0.24, z: 24, rotation: 14 }),
      ...stage("#5B47D4"),
      deco("Dots", "dots", 214, 152, 40, 40, { color: "#FFFFFF", opacity: 0.4, z: 100 }),
      ...sparkles("#5B47D4"),
      vignette(0.35),
    ],
  },
  {
    id: "cloudy-breeze",
    name: "Cloudy Breeze",
    category: "Clouds",
    background: grad("#CFE2FD", "#E8F1FE", "#F8FBFF"),
    elements: [
      ...atmosphere("#3B82F6", "#93C5FD"),
      deco("Cloud Far", "cloud-soft", -54, -18, 200, 82, { color: "#FFFFFF", opacity: 0.6, z: 8, blur: 3 }),
      deco("Cloud Left", "cloud", -30, 8, 154, 74, { color: "#FFFFFF", opacity: 0.95, z: 12 }),
      deco("Cloud Right", "cloud", 268, 26, 150, 72, { color: "#FFFFFF", opacity: 0.85, z: 12 }),
      deco("Cloud Low", "cloud-soft", 196, 132, 180, 76, { color: "#FFFFFF", opacity: 0.7, z: 14 }),
      deco("Mist", "mist", -18, 152, 200, 56, { color: "#FFFFFF", opacity: 0.55, z: 16 }),
      ...stage("#2563EB"),
      deco("Particles", "particles", 232, 24, 140, 140, { color: "#2563EB", opacity: 0.4, z: 100 }),
      ...sparkles("#2563EB"),
      vignette(0.28),
    ],
  },
  {
    id: "leafy-fresh",
    name: "Leafy Fresh",
    category: "Nature",
    background: grad("#CDEEDD", "#E8F8F0", "#F8FDFB"),
    elements: [
      ...atmosphere("#0F9D6B", "#6EE7B7"),
      deco("Cloud", "cloud-soft", -36, -14, 172, 72, { color: "#FFFFFF", opacity: 0.65, z: 8 }),
      deco("Monstera Left", "monstera", -46, 46, 124, 122, { color: "#0B8A5D", opacity: 0.3, z: 14, rotation: -14 }),
      deco("Plant Left", "plant", -52, 76, 126, 128, { color: "#0F9D6B", opacity: 0.34, z: 20, rotation: -7 }),
      deco("Palm Right", "palm", 306, 30, 124, 110, { color: "#0B8A5D", opacity: 0.28, z: 14, rotation: 12 }),
      deco("Plant Right", "plant", 314, 74, 126, 130, { color: "#0F9D6B", opacity: 0.34, z: 20, rotation: 7 }),
      deco("Grass", "grass", -28, 146, 116, 64, { color: "#0B8A5D", opacity: 0.3, z: 26 }),
      ...stage("#0F9D6B"),
      deco("Particles", "particles", 214, 30, 120, 120, { color: "#0F9D6B", opacity: 0.35, z: 100 }),
      ...sparkles("#0F9D6B"),
      vignette(0.3),
    ],
  },
  {
    id: "spring-garden",
    name: "Spring Garden",
    category: "Nature",
    background: grad("#FBD8E4", "#FDECF2", "#FFF9FB"),
    elements: [
      ...atmosphere("#EC4899", "#F9A8D4"),
      deco("Cloud", "cloud-soft", -36, -16, 172, 72, { color: "#FFFFFF", opacity: 0.7, z: 8 }),
      deco("Branch Left", "branch", -20, 78, 96, 122, { color: "#DB2777", opacity: 0.3, z: 14, rotation: -14 }),
      deco("Plant Left", "plant", -50, 80, 122, 124, { color: "#EC4899", opacity: 0.3, z: 20, rotation: -8 }),
      deco("Flower Left", "flower", -6, 142, 48, 48, { color: "#F472B6", opacity: 0.75, z: 26 }),
      deco("Branch Right", "branch", 300, 34, 92, 118, { color: "#DB2777", opacity: 0.3, z: 14, rotation: 16 }),
      deco("Plant Right", "plant", 318, 78, 122, 126, { color: "#EC4899", opacity: 0.3, z: 20, rotation: 8 }),
      deco("Flower Right", "flower", 352, 138, 44, 44, { color: "#F472B6", opacity: 0.7, z: 26 }),
      ...stage("#EC4899"),
      ...sparkles("#EC4899"),
      vignette(0.28),
    ],
  },
  {
    id: "premium-glow",
    name: "Premium Glow",
    category: "Premium",
    background: grad("#DFD0FB", "#EFE6FE", "#FAF6FF"),
    elements: [
      ...atmosphere("#7C3AED", "#C4B5FD"),
      deco("Light Rays", "light-ray", 226, -46, 160, 200, { color: "#FFFFFF", opacity: 0.4, z: 6 }),
      deco("Ring Large", "ring", -46, 40, 132, 132, { color: "#7C3AED", opacity: 0.22, z: 12 }),
      deco("Ring Small", "ring", 210, 118, 84, 84, { color: "#7C3AED", opacity: 0.2, z: 12 }),
      deco("Orb", "gradient-orb", 318, 8, 96, 96, { color: "#A855F7", opacity: 0.5, z: 10 }),
      deco("Spotlight", "spotlight", 216, 6, 190, 190, { color: "#FFFFFF", opacity: 0.45, z: 28 }),
      ...stage("#7C3AED"),
      deco("Dots", "dots", 196, 24, 52, 52, { color: "#7C3AED", opacity: 0.28, z: 100 }),
      ...sparkles("#A855F7"),
      vignette(0.4),
    ],
  },
  {
    id: "soft-clouds",
    name: "Soft Clouds",
    category: "Clouds",
    background: grad("#E3E9FE", "#F0F3FF", "#FBFCFF"),
    elements: [
      ...atmosphere("#6366F1", "#C7D2FE"),
      deco("Cloud Far", "cloud-soft", -60, -22, 208, 86, { color: "#FFFFFF", opacity: 0.55, z: 8, blur: 4 }),
      deco("Cloud Top", "cloud", -26, 6, 162, 80, { color: "#FFFFFF", opacity: 0.95, z: 12 }),
      deco("Cloud Mid", "cloud", 272, 20, 148, 72, { color: "#FFFFFF", opacity: 0.8, z: 12 }),
      deco("Cloud Base", "cloud", 202, 130, 178, 84, { color: "#FFFFFF", opacity: 0.75, z: 26 }),
      deco("Mist", "mist", -20, 156, 200, 54, { color: "#FFFFFF", opacity: 0.5, z: 28 }),
      ...stage("#6366F1"),
      ...sparkles("#6366F1"),
      vignette(0.24),
    ],
  },
  {
    id: "sale-energy",
    name: "Sale Energy",
    category: "Sale",
    background: grad("#FBD0CB", "#FEE6E2", "#FFF7F5"),
    elements: [
      ...atmosphere("#DC2626", "#FCA5A5"),
      deco("Burst", "sale-burst", 258, 10, 92, 92, { color: "#DC2626", opacity: 0.2, z: 8 }),
      deco("Lightning", "lightning", 344, 42, 40, 68, { color: "#F59E0B", opacity: 0.9, z: 26, rotation: 12 }),
      deco("Ribbon", "ribbon", -26, 68, 118, 56, { color: "#DC2626", opacity: 0.28, z: 12, rotation: -12 }),
      deco("Ring", "ring", -34, 118, 100, 100, { color: "#DC2626", opacity: 0.22, z: 12 }),
      deco("Confetti Top", "confetti", 222, -8, 140, 140, { opacity: 0.95, z: 100 }),
      deco("Confetti Low", "confetti", -30, 118, 124, 124, { opacity: 0.8, z: 100 }),
      ...stage("#DC2626"),
      ...sparkles("#F59E0B"),
      vignette(0.3),
    ],
  },
  {
    id: "elegant-minimal",
    name: "Elegant Minimal",
    category: "Minimal",
    background: grad("#ECEDF4", "#F6F7FB", "#FDFDFF"),
    elements: [
      deco("Glow", "glow", 96, -20, 210, 210, { color: "#5B47D4", opacity: 0.22, z: 2 }),
      deco("Arc", "arc", 118, 18, 170, 92, { color: "#5B47D4", opacity: 0.16, z: 10 }),
      deco("Ring", "ring", 300, 12, 84, 84, { color: "#5B47D4", opacity: 0.16, z: 12 }),
      deco("Wave", "wave", -18, 156, 200, 44, { color: "#5B47D4", opacity: 0.18, z: 14 }),
      deco("Dots", "dots", 18, 148, 48, 48, { color: "#5B47D4", opacity: 0.16, z: 14 }),
      ...stage("#5B47D4"),
      deco("Sparkle 1", "sparkle", 236, 34, 13, 13, { color: "#5B47D4", opacity: 0.6, z: 110 }),
      vignette(0.2),
    ],
  },
  {
    id: "aurora-bloom",
    name: "Aurora Bloom",
    category: "Abstract",
    background: grad("#E4D6FB", "#F6E4F2", "#FEF6FB"),
    elements: [
      deco("Aurora Violet", "glow", -66, -66, 230, 230, { color: "#7C3AED", opacity: 0.5, z: 2 }),
      deco("Aurora Pink", "glow", 216, 40, 230, 230, { color: "#EC4899", opacity: 0.45, z: 2 }),
      deco("Aurora Teal", "glow", 44, 84, 200, 200, { color: "#14B8A6", opacity: 0.3, z: 2 }),
      deco("Orb Large", "gradient-orb", 288, 14, 110, 110, { color: "#A855F7", opacity: 0.5, z: 10 }),
      deco("Orb Small", "gradient-orb", -26, 118, 84, 84, { color: "#EC4899", opacity: 0.45, z: 10 }),
      deco("Blob", "blob", 236, 96, 130, 130, { color: "#7C3AED", opacity: 0.18, z: 12, rotation: 18 }),
      deco("Wave", "wave", -18, 76, 200, 44, { color: "#FFFFFF", opacity: 0.35, z: 14 }),
      ...stage("#7C3AED"),
      ...sparkles("#EC4899"),
      vignette(0.35),
    ],
  },
  {
    id: "fresh-morning",
    name: "Fresh Morning",
    category: "Nature",
    background: grad("#DCF2E4", "#EFF9F2", "#FBFEFC"),
    elements: [
      ...atmosphere("#F59E0B", "#6EE7B7"),
      deco("Light Rays", "light-ray", 214, -50, 180, 210, { color: "#FDE68A", opacity: 0.5, z: 6 }),
      deco("Cloud", "cloud", -26, 0, 150, 72, { color: "#FFFFFF", opacity: 0.9, z: 12 }),
      deco("Hill", "hill", -20, 122, 330, 90, { color: "#0F9D6B", opacity: 0.22, z: 14 }),
      deco("Grass Left", "grass", -40, 148, 124, 66, { color: "#0F9D6B", opacity: 0.32, z: 24 }),
      deco("Grass Right", "grass", 292, 150, 126, 64, { color: "#0F9D6B", opacity: 0.28, z: 24 }),
      deco("Flower", "flower", 356, 130, 44, 44, { color: "#FBBF24", opacity: 0.7, z: 26 }),
      ...stage("#0F9D6B"),
      ...sparkles("#F59E0B"),
      vignette(0.26),
    ],
  },
  {
    id: "celebration",
    name: "Celebration",
    category: "Abstract",
    background: grad("#E6DEFC", "#F6E6F5", "#FEF7FC"),
    elements: [
      ...atmosphere("#7C3AED", "#F472B6"),
      deco("Light Rays", "light-ray", 222, -48, 168, 206, { color: "#FFFFFF", opacity: 0.42, z: 6 }),
      deco("Ribbon Left", "ribbon", -30, 72, 122, 58, { color: "#A855F7", opacity: 0.35, z: 12, rotation: -14 }),
      deco("Ribbon Right", "ribbon", 288, 116, 116, 56, { color: "#EC4899", opacity: 0.32, z: 12, rotation: 16 }),
      deco("Confetti Top", "confetti", 214, -12, 146, 146, { opacity: 0.95, z: 100 }),
      deco("Confetti Left", "confetti", -34, -10, 128, 128, { opacity: 0.75, z: 100 }),
      deco("Confetti Low", "confetti", 108, 92, 140, 140, { opacity: 0.8, z: 100 }),
      ...stage("#7C3AED"),
      deco("Star", "star", 246, 22, 20, 20, { color: "#FBBF24", opacity: 0.95, z: 110 }),
      ...sparkles("#EC4899"),
      vignette(0.3),
    ],
  },
  {
    id: "product-stage",
    name: "Product Stage",
    category: "Premium",
    background: grad("#E2DCF8", "#F1EDFC", "#FBFAFF"),
    elements: [
      deco("Glow", "glow", 208, 0, 210, 210, { color: "#5B47D4", opacity: 0.45, z: 2 }),
      deco("Spotlight", "spotlight", 208, -14, 196, 210, { color: "#FFFFFF", opacity: 0.6, z: 6 }),
      deco("Light Rays", "light-ray", 236, -34, 140, 190, { color: "#FFFFFF", opacity: 0.35, z: 8 }),
      deco("Ring Back", "ring", 232, 30, 148, 148, { color: "#5B47D4", opacity: 0.16, z: 12 }),
      deco("Platform Wide", "platform", 232, 146, 148, 50, { color: "#7C63E8", opacity: 0.4, z: 26 }),
      ...stage("#5B47D4"),
      deco("Dots", "dots", 196, 30, 48, 48, { color: "#5B47D4", opacity: 0.3, z: 100 }),
      ...sparkles("#5B47D4"),
      vignette(0.42),
    ],
  },
];

export function scenesByCategory(cat: SceneCategory): Scene[] {
  return cat === "All" ? SCENES : SCENES.filter((s) => s.category === cat);
}

/** Category + free-text filter used by the Scenes library. */
export function filterScenes(cat: SceneCategory, query: string): Scene[] {
  const q = query.trim().toLowerCase();
  return scenesByCategory(cat).filter(
    (s) => !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
  );
}

/** A blank scene — the starting point for "New Blank Scene". */
export function blankScene(): Scene {
  return {
    id: "custom-scene",
    name: "My Scene",
    category: "Minimal",
    background: { type: "SOLID", color: "#FFFFFF" },
    elements: [],
  };
}
