/**
 * features/notifications/sceneLibrary.ts — Catalog of insertable scene assets,
 * grouped for the Decorations / Shapes / Effects panels. Each entry describes a
 * DECORATION node's asset id plus a sensible default size and tint, so clicking
 * an item inserts a real, editable element.
 */

export interface LibraryItem {
  assetId: string;
  name: string;
  width: number;
  height: number;
  /** Default tint; omitted items inherit the brand colour. */
  color?: string;
  opacity?: number;
}

export interface LibraryGroup {
  id: string;
  label: string;
  items: LibraryItem[];
}

const BRAND = "#5B47D4";

export const DECORATION_GROUPS: LibraryGroup[] = [
  {
    id: "nature",
    label: "Nature",
    items: [
      { assetId: "leaf", name: "Leaf", width: 60, height: 100, color: BRAND, opacity: 0.45 },
      { assetId: "leaf-cluster", name: "Leaf Cluster", width: 110, height: 130, color: BRAND, opacity: 0.42 },
      { assetId: "plant", name: "Plant", width: 92, height: 120, color: BRAND, opacity: 0.42 },
      { assetId: "flower", name: "Flower", width: 70, height: 70, color: "#EC4899", opacity: 0.8 },
      { assetId: "branch", name: "Branch", width: 80, height: 110, color: BRAND, opacity: 0.4 },
      { assetId: "grass", name: "Grass", width: 110, height: 70, color: "#0F9D6B", opacity: 0.5 },
    ],
  },
  {
    id: "landscape",
    label: "Landscape",
    items: [
      { assetId: "mountain", name: "Mountain", width: 150, height: 95, color: BRAND, opacity: 0.35 },
      { assetId: "hill", name: "Hill", width: 200, height: 80, color: BRAND, opacity: 0.3 },
    ],
  },
  {
    id: "atmosphere",
    label: "Atmosphere",
    items: [
      { assetId: "cloud", name: "Cloud", width: 150, height: 78, color: "#FFFFFF", opacity: 0.75 },
      { assetId: "mist", name: "Mist", width: 180, height: 55, color: "#FFFFFF", opacity: 0.6 },
      { assetId: "light-ray", name: "Light Rays", width: 120, height: 170, color: "#FFFFFF", opacity: 0.35 },
    ],
  },
  {
    id: "particles",
    label: "Particles",
    items: [
      { assetId: "sparkle", name: "Sparkle", width: 18, height: 18, color: "#FFFFFF", opacity: 0.9 },
      { assetId: "star", name: "Star", width: 20, height: 20, color: "#FBBF24", opacity: 0.9 },
      { assetId: "dots", name: "Dots", width: 60, height: 60, color: BRAND, opacity: 0.3 },
      { assetId: "particles", name: "Particles", width: 140, height: 140, color: BRAND, opacity: 0.4 },
      { assetId: "confetti", name: "Confetti", width: 130, height: 130, opacity: 0.95 },
    ],
  },
  {
    id: "sale",
    label: "Sale",
    items: [
      { assetId: "sale-burst", name: "Sale Burst", width: 90, height: 90, color: "#E11D48", opacity: 0.9 },
      { assetId: "lightning", name: "Lightning", width: 44, height: 74, color: "#F59E0B", opacity: 0.95 },
      { assetId: "price-tag", name: "Price Tag", width: 70, height: 70, color: "#E11D48", opacity: 0.9 },
      { assetId: "ribbon", name: "Ribbon", width: 130, height: 60, color: "#E11D48", opacity: 0.9 },
    ],
  },
  {
    id: "product",
    label: "Product environment",
    items: [
      { assetId: "pedestal", name: "Pedestal", width: 144, height: 30, color: BRAND, opacity: 0.85 },
      { assetId: "platform", name: "Platform", width: 170, height: 34, color: BRAND, opacity: 0.7 },
      { assetId: "product-shadow", name: "Product Shadow", width: 116, height: 26 },
      { assetId: "product-glow", name: "Product Glow", width: 150, height: 145, color: BRAND, opacity: 0.55 },
      { assetId: "spotlight", name: "Spotlight", width: 180, height: 180, color: "#FFFFFF", opacity: 0.5 },
    ],
  },
];

export const SHAPE_GROUPS: LibraryGroup[] = [
  {
    id: "basic",
    label: "Basic",
    items: [
      { assetId: "shape-rect", name: "Rectangle", width: 120, height: 80, color: BRAND, opacity: 0.9 },
      { assetId: "shape-rounded", name: "Rounded", width: 120, height: 80, color: BRAND, opacity: 0.9 },
      { assetId: "shape-circle", name: "Circle", width: 90, height: 90, color: BRAND, opacity: 0.9 },
      { assetId: "shape-ellipse", name: "Ellipse", width: 130, height: 80, color: BRAND, opacity: 0.9 },
      { assetId: "shape-line", name: "Line", width: 160, height: 4, color: BRAND, opacity: 0.9 },
    ],
  },
  {
    id: "vector",
    label: "Vector",
    items: [
      { assetId: "ring", name: "Ring", width: 100, height: 100, color: BRAND, opacity: 0.35 },
      { assetId: "wave", name: "Wave", width: 180, height: 40, color: BRAND, opacity: 0.35 },
      { assetId: "blob", name: "Blob", width: 130, height: 130, color: BRAND, opacity: 0.35 },
      { assetId: "triangle", name: "Triangle", width: 90, height: 90, color: BRAND, opacity: 0.5 },
      { assetId: "arc", name: "Arc", width: 110, height: 60, color: BRAND, opacity: 0.5 },
      { assetId: "bubble", name: "Bubble", width: 80, height: 80, color: BRAND, opacity: 0.6 },
    ],
  },
];

export const EFFECT_GROUPS: LibraryGroup[] = [
  {
    id: "light",
    label: "Light",
    items: [
      { assetId: "glow", name: "Glow", width: 200, height: 200, color: BRAND, opacity: 0.5 },
      { assetId: "gradient-orb", name: "Gradient Orb", width: 160, height: 160, color: "#EC4899", opacity: 0.55 },
      { assetId: "spotlight", name: "Spotlight", width: 200, height: 200, color: "#FFFFFF", opacity: 0.5 },
      { assetId: "light-ray", name: "Light Ray", width: 120, height: 180, color: "#FFFFFF", opacity: 0.3 },
    ],
  },
  {
    id: "depth",
    label: "Depth",
    items: [
      { assetId: "soft-shadow", name: "Soft Shadow", width: 140, height: 40 },
      { assetId: "vignette", name: "Vignette", width: 320, height: 560, opacity: 0.55 },
    ],
  },
];

/** Every insertable library item, keyed by assetId (first match wins). */
export const LIBRARY_INDEX: Record<string, LibraryItem> = Object.fromEntries(
  [...DECORATION_GROUPS, ...SHAPE_GROUPS, ...EFFECT_GROUPS]
    .flatMap((g) => g.items)
    .map((i) => [i.assetId, i]),
);
