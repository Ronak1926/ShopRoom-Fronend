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

/** Atmosphere shared by every scene: two soft glows for depth. */
function atmosphere(a: string, b: string): CompositionNode[] {
  return [
    deco("Glow Top", "glow", -30, -40, 260, 260, { color: a, opacity: 0.55, z: 2 }),
    deco("Glow Bottom", "glow", 130, 300, 260, 260, { color: b, opacity: 0.4, z: 2 }),
  ];
}

/** Product environment: soft light, contact shadow and a 3D podium. */
function stage(color: string, cx = 160, baseY = 272): CompositionNode[] {
  return [
    deco("Product Glow", "product-glow", cx - 80, baseY - 132, 160, 160, { color, opacity: 0.45, z: 30 }),
    deco("Product Shadow", "product-shadow", cx - 48, baseY - 4, 96, 20, { z: 32, opacity: 0.5 }),
    deco("Pedestal", "pedestal", cx - 66, baseY - 16, 132, 46, { color, opacity: 0.92, z: 34 }),
  ];
}

const sparkles = (color: string): CompositionNode[] => [
  deco("Sparkle 1", "sparkle", 44, 128, 20, 20, { color: "#FFFFFF", opacity: 0.95, z: 110 }),
  deco("Sparkle 2", "sparkle", 274, 196, 15, 15, { color, opacity: 0.85, z: 110 }),
  deco("Sparkle 3", "sparkle", 250, 92, 11, 11, { color: "#FFFFFF", opacity: 0.75, z: 110 }),
];

// ── ShopRoom scenes ──────────────────────────────────────────────────────────

export const SCENES: Scene[] = [
  {
    id: "botanical-soft",
    name: "Botanical Soft",
    category: "Nature",
    background: grad("#E5DCFC", "#F1EBFF", "#FBF9FF"),
    elements: [
      ...atmosphere("#8B76F0", "#C4B5FD"),
      deco("Cloud Far", "cloud-soft", -50, 30, 200, 84, { color: "#FFFFFF", opacity: 0.55, z: 8, blur: 2 }),
      deco("Cloud Near", "cloud", -26, 52, 156, 78, { color: "#FFFFFF", opacity: 0.9, z: 12 }),
      deco("Plant Far Left", "fern", -56, 150, 92, 142, { color: "#7C63E8", opacity: 0.22, z: 14, rotation: -14 }),
      deco("Plant Left", "plant", -74, 186, 148, 152, { color: "#6D55DE", opacity: 0.34, z: 20, rotation: -8 }),
      deco("Leaf Left", "leaf-sprig", -40, 264, 88, 124, { color: "#5B47D4", opacity: 0.26, z: 24, rotation: 14 }),
      deco("Plant Right", "plant", 246, 178, 148, 156, { color: "#6D55DE", opacity: 0.34, z: 20, rotation: 8 }),
      deco("Leaf Right", "leaf-sprig", 262, 96, 88, 130, { color: "#7C63E8", opacity: 0.28, z: 16, rotation: 22 }),
      deco("Fern Right", "fern", 276, 258, 82, 128, { color: "#5B47D4", opacity: 0.24, z: 24, rotation: 14 }),
      ...stage("#5B47D4"),
      deco("Dots", "dots", 272, 214, 48, 48, { color: "#FFFFFF", opacity: 0.4, z: 100 }),
      ...sparkles("#5B47D4"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.35, z: 120 }),
    ],
  },
  {
    id: "cloudy-breeze",
    name: "Cloudy Breeze",
    category: "Clouds",
    background: grad("#CFE2FD", "#E8F1FE", "#F8FBFF"),
    elements: [
      ...atmosphere("#3B82F6", "#93C5FD"),
      deco("Cloud Far", "cloud-soft", -60, 24, 220, 92, { color: "#FFFFFF", opacity: 0.6, z: 8, blur: 3 }),
      deco("Cloud Left", "cloud", -34, 60, 170, 84, { color: "#FFFFFF", opacity: 0.95, z: 12 }),
      deco("Cloud Right", "cloud", 196, 130, 168, 82, { color: "#FFFFFF", opacity: 0.85, z: 12 }),
      deco("Cloud Low", "cloud-soft", 150, 372, 200, 86, { color: "#FFFFFF", opacity: 0.7, z: 14 }),
      deco("Mist", "mist", -20, 430, 220, 64, { color: "#FFFFFF", opacity: 0.55, z: 16 }),
      ...stage("#2563EB"),
      deco("Particles", "particles", 20, 120, 150, 150, { color: "#2563EB", opacity: 0.4, z: 100 }),
      ...sparkles("#2563EB"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.28, z: 120 }),
    ],
  },
  {
    id: "leafy-fresh",
    name: "Leafy Fresh",
    category: "Nature",
    background: grad("#CDEEDD", "#E8F8F0", "#F8FDFB"),
    elements: [
      ...atmosphere("#0F9D6B", "#6EE7B7"),
      deco("Cloud", "cloud-soft", -40, 34, 190, 80, { color: "#FFFFFF", opacity: 0.65, z: 8 }),
      deco("Monstera Left", "monstera", -62, 158, 146, 146, { color: "#0B8A5D", opacity: 0.3, z: 14, rotation: -14 }),
      deco("Plant Left", "plant", -76, 190, 150, 156, { color: "#0F9D6B", opacity: 0.34, z: 20, rotation: -7 }),
      deco("Palm Right", "palm", 248, 138, 146, 130, { color: "#0B8A5D", opacity: 0.28, z: 14, rotation: 12 }),
      deco("Plant Right", "plant", 248, 184, 150, 158, { color: "#0F9D6B", opacity: 0.34, z: 20, rotation: 7 }),
      deco("Grass", "grass", -34, 470, 130, 74, { color: "#0B8A5D", opacity: 0.3, z: 26 }),
      ...stage("#0F9D6B"),
      deco("Particles", "particles", 180, 96, 130, 130, { color: "#0F9D6B", opacity: 0.35, z: 100 }),
      ...sparkles("#0F9D6B"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.3, z: 120 }),
    ],
  },
  {
    id: "spring-garden",
    name: "Spring Garden",
    category: "Nature",
    background: grad("#FBD8E4", "#FDECF2", "#FFF9FB"),
    elements: [
      ...atmosphere("#EC4899", "#F9A8D4"),
      deco("Cloud", "cloud-soft", -40, 28, 190, 80, { color: "#FFFFFF", opacity: 0.7, z: 8 }),
      deco("Branch Left", "branch", -24, 226, 110, 150, { color: "#DB2777", opacity: 0.3, z: 14, rotation: -14 }),
      deco("Plant Left", "plant", -72, 192, 144, 150, { color: "#EC4899", opacity: 0.3, z: 20, rotation: -8 }),
      deco("Flower Left", "flower", -10, 252, 56, 56, { color: "#F472B6", opacity: 0.75, z: 26 }),
      deco("Branch Right", "branch", 240, 150, 104, 144, { color: "#DB2777", opacity: 0.3, z: 14, rotation: 16 }),
      deco("Plant Right", "plant", 250, 186, 144, 154, { color: "#EC4899", opacity: 0.3, z: 20, rotation: 8 }),
      deco("Flower Right", "flower", 282, 244, 50, 50, { color: "#F472B6", opacity: 0.7, z: 26 }),
      ...stage("#EC4899"),
      ...sparkles("#EC4899"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.28, z: 120 }),
    ],
  },
  {
    id: "premium-glow",
    name: "Premium Glow",
    category: "Premium",
    background: grad("#DFD0FB", "#EFE6FE", "#FAF6FF"),
    elements: [
      ...atmosphere("#7C3AED", "#C4B5FD"),
      deco("Light Rays", "light-ray", 76, -30, 170, 240, { color: "#FFFFFF", opacity: 0.4, z: 6 }),
      deco("Ring Large", "ring", -54, 96, 150, 150, { color: "#7C3AED", opacity: 0.22, z: 12 }),
      deco("Ring Small", "ring", 244, 236, 104, 104, { color: "#7C3AED", opacity: 0.2, z: 12 }),
      deco("Orb", "gradient-orb", 232, 74, 110, 110, { color: "#A855F7", opacity: 0.5, z: 10 }),
      deco("Spotlight", "spotlight", 40, 172, 240, 240, { color: "#FFFFFF", opacity: 0.45, z: 28 }),
      ...stage("#7C3AED"),
      deco("Dots", "dots", 22, 424, 60, 60, { color: "#7C3AED", opacity: 0.28, z: 100 }),
      ...sparkles("#A855F7"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.4, z: 120 }),
    ],
  },
  {
    id: "soft-clouds",
    name: "Soft Clouds",
    category: "Clouds",
    background: grad("#E3E9FE", "#F0F3FF", "#FBFCFF"),
    elements: [
      ...atmosphere("#6366F1", "#C7D2FE"),
      deco("Cloud Far", "cloud-soft", -70, 20, 230, 96, { color: "#FFFFFF", opacity: 0.55, z: 8, blur: 4 }),
      deco("Cloud Top", "cloud", -30, 54, 180, 90, { color: "#FFFFFF", opacity: 0.95, z: 12 }),
      deco("Cloud Mid", "cloud", 200, 158, 164, 80, { color: "#FFFFFF", opacity: 0.8, z: 12 }),
      deco("Cloud Base", "cloud", 30, 402, 200, 96, { color: "#FFFFFF", opacity: 0.75, z: 26 }),
      deco("Mist", "mist", 120, 470, 220, 60, { color: "#FFFFFF", opacity: 0.5, z: 28 }),
      ...stage("#6366F1"),
      ...sparkles("#6366F1"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.24, z: 120 }),
    ],
  },
  {
    id: "sale-energy",
    name: "Sale Energy",
    category: "Sale",
    background: grad("#FBD0CB", "#FEE6E2", "#FFF7F5"),
    elements: [
      ...atmosphere("#DC2626", "#FCA5A5"),
      deco("Burst", "sale-burst", 234, 44, 96, 96, { color: "#DC2626", opacity: 0.2, z: 8 }),
      deco("Lightning", "lightning", 256, 152, 44, 76, { color: "#F59E0B", opacity: 0.9, z: 26, rotation: 12 }),
      deco("Ribbon", "ribbon", -30, 214, 130, 62, { color: "#DC2626", opacity: 0.28, z: 12, rotation: -12 }),
      deco("Ring", "ring", -40, 320, 118, 118, { color: "#DC2626", opacity: 0.22, z: 12 }),
      deco("Confetti Top", "confetti", 168, 18, 150, 150, { opacity: 0.95, z: 100 }),
      deco("Confetti Low", "confetti", -24, 388, 140, 140, { opacity: 0.8, z: 100 }),
      ...stage("#DC2626"),
      ...sparkles("#F59E0B"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.3, z: 120 }),
    ],
  },
  {
    id: "elegant-minimal",
    name: "Elegant Minimal",
    category: "Minimal",
    background: grad("#ECEDF4", "#F6F7FB", "#FDFDFF"),
    elements: [
      deco("Glow", "glow", 30, 60, 260, 260, { color: "#5B47D4", opacity: 0.22, z: 2 }),
      deco("Arc", "arc", 60, 96, 200, 110, { color: "#5B47D4", opacity: 0.16, z: 10 }),
      deco("Ring", "ring", 236, 60, 100, 100, { color: "#5B47D4", opacity: 0.16, z: 12 }),
      deco("Wave", "wave", -20, 448, 240, 50, { color: "#5B47D4", opacity: 0.18, z: 14 }),
      deco("Dots", "dots", 20, 388, 56, 56, { color: "#5B47D4", opacity: 0.16, z: 14 }),
      ...stage("#5B47D4"),
      deco("Sparkle 1", "sparkle", 250, 150, 14, 14, { color: "#5B47D4", opacity: 0.6, z: 110 }),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.2, z: 120 }),
    ],
  },
  {
    id: "aurora-bloom",
    name: "Aurora Bloom",
    category: "Abstract",
    background: grad("#E4D6FB", "#F6E4F2", "#FEF6FB"),
    elements: [
      deco("Aurora Violet", "glow", -60, -30, 280, 280, { color: "#7C3AED", opacity: 0.5, z: 2 }),
      deco("Aurora Pink", "glow", 120, 210, 280, 280, { color: "#EC4899", opacity: 0.45, z: 2 }),
      deco("Aurora Teal", "glow", -40, 380, 240, 240, { color: "#14B8A6", opacity: 0.3, z: 2 }),
      deco("Orb Large", "gradient-orb", 214, 84, 130, 130, { color: "#A855F7", opacity: 0.5, z: 10 }),
      deco("Orb Small", "gradient-orb", -30, 268, 96, 96, { color: "#EC4899", opacity: 0.45, z: 10 }),
      deco("Blob", "blob", 214, 380, 150, 150, { color: "#7C3AED", opacity: 0.18, z: 12, rotation: 18 }),
      deco("Wave", "wave", -20, 214, 240, 50, { color: "#FFFFFF", opacity: 0.35, z: 14 }),
      ...stage("#7C3AED"),
      ...sparkles("#EC4899"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.35, z: 120 }),
    ],
  },
  {
    id: "fresh-morning",
    name: "Fresh Morning",
    category: "Nature",
    background: grad("#DCF2E4", "#EFF9F2", "#FBFEFC"),
    elements: [
      ...atmosphere("#F59E0B", "#6EE7B7"),
      deco("Light Rays", "light-ray", 60, -40, 200, 250, { color: "#FDE68A", opacity: 0.5, z: 6 }),
      deco("Cloud", "cloud", -30, 44, 168, 82, { color: "#FFFFFF", opacity: 0.9, z: 12 }),
      deco("Hill", "hill", -20, 386, 360, 110, { color: "#0F9D6B", opacity: 0.22, z: 14 }),
      deco("Grass Left", "grass", -46, 468, 140, 76, { color: "#0F9D6B", opacity: 0.32, z: 24 }),
      deco("Grass Right", "grass", 224, 470, 142, 74, { color: "#0F9D6B", opacity: 0.28, z: 24 }),
      deco("Flower", "flower", 278, 424, 52, 52, { color: "#FBBF24", opacity: 0.7, z: 26 }),
      ...stage("#0F9D6B"),
      ...sparkles("#F59E0B"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.26, z: 120 }),
    ],
  },
  {
    id: "celebration",
    name: "Celebration",
    category: "Abstract",
    background: grad("#E6DEFC", "#F6E6F5", "#FEF7FC"),
    elements: [
      ...atmosphere("#7C3AED", "#F472B6"),
      deco("Light Rays", "light-ray", 70, -34, 180, 240, { color: "#FFFFFF", opacity: 0.42, z: 6 }),
      deco("Ribbon Left", "ribbon", -34, 190, 136, 64, { color: "#A855F7", opacity: 0.35, z: 12, rotation: -14 }),
      deco("Ribbon Right", "ribbon", 224, 254, 130, 62, { color: "#EC4899", opacity: 0.32, z: 12, rotation: 16 }),
      deco("Confetti Top", "confetti", 160, 16, 156, 156, { opacity: 0.95, z: 100 }),
      deco("Confetti Left", "confetti", -30, 130, 140, 140, { opacity: 0.75, z: 100 }),
      deco("Confetti Low", "confetti", 30, 396, 150, 150, { opacity: 0.8, z: 100 }),
      ...stage("#7C3AED"),
      deco("Star", "star", 250, 116, 22, 22, { color: "#FBBF24", opacity: 0.95, z: 110 }),
      ...sparkles("#EC4899"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.3, z: 120 }),
    ],
  },
  {
    id: "product-stage",
    name: "Product Stage",
    category: "Premium",
    background: grad("#E2DCF8", "#F1EDFC", "#FBFAFF"),
    elements: [
      deco("Glow", "glow", 20, 60, 280, 280, { color: "#5B47D4", opacity: 0.45, z: 2 }),
      deco("Spotlight", "spotlight", 30, 40, 260, 300, { color: "#FFFFFF", opacity: 0.6, z: 6 }),
      deco("Light Rays", "light-ray", 84, -30, 152, 230, { color: "#FFFFFF", opacity: 0.35, z: 8 }),
      deco("Ring Back", "ring", 62, 148, 196, 196, { color: "#5B47D4", opacity: 0.16, z: 12 }),
      deco("Platform Wide", "platform", 30, 322, 260, 74, { color: "#7C63E8", opacity: 0.4, z: 26 }),
      ...stage("#5B47D4"),
      deco("Dots", "dots", 254, 250, 56, 56, { color: "#5B47D4", opacity: 0.3, z: 100 }),
      ...sparkles("#5B47D4"),
      deco("Vignette", "vignette", 0, 0, 320, 560, { opacity: 0.42, z: 120 }),
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
