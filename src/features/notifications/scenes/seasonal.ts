/**
 * features/notifications/scenes/seasonal.ts — Scenes tied to a time of year, so
 * a shop can match the banner to whatever it's actually selling that month.
 */

import type { Scene } from "./types";
import { atmosphere, deco, duo, grad, halo, platform, rad, scatter, sparkles, spread, stage, vignette } from "./helpers";

export const SEASONAL_SCENES: Scene[] = [
  {
    id: "cherry-blossom",
    name: "Cherry Blossom",
    category: "Seasonal",
    accent: "#DB2777",
    // Pink drifting into lilac, not the flat rose of Spring Garden — the two
    // are the closest pair in the catalog and the palette is what parts them.
    background: grad("#F5DCE9", "#E8E3F8", "#FBF9FE"),
    elements: [
      ...atmosphere("#BE185D", "#C4B5FD"),
      deco("Branch Top", "branch", 214, -40, 130, 116, { color: "#9D174D", opacity: 0.24, z: 8, rotation: 14 }),
      deco("Sprig Left", "leaf-sprig", -30, -22, 100, 106, { color: "#9D174D", opacity: 0.2, z: 8, rotation: -18 }),
      deco("Petal Drift", "mist", 92, 96, 220, 52, { color: "#FBCFE8", opacity: 0.5, z: 12 }),
      ...scatter(
        "Petal",
        "flower",
        [[36, 60, 32], [96, 118, 26], [246, 42, 30], [352, 104, 34], [300, 150, 24]],
        { color: "#F472B6", opacity: 0.6, z: 20 },
      ),
      ...stage("#DB2777"),
      ...sparkles("#F9A8D4"),
      vignette(0.24),
    ],
  },
  {
    id: "summer-splash",
    name: "Summer Splash",
    category: "Seasonal",
    accent: "#0284C7",
    background: grad("#BFE9F5", "#DFF4FA", "#F6FCFE"),
    elements: [
      ...atmosphere("#0284C7", "#7DD3FC"),
      deco("Sun", "gradient-orb", 314, -30, 100, 100, { color: "#FBBF24", opacity: 0.6, z: 6 }),
      ...spread("Wave", "wave", [[-30, 128, 240, 48], [176, 154, 250, 46]], {
        color: "#0284C7",
        opacity: 0.24,
        z: 14,
      }),
      deco("Palm", "palm", -40, 26, 126, 112, { color: "#0F766E", opacity: 0.26, z: 10, rotation: -16 }),
      deco("Beach Ball", "bubble", 206, 132, 56, 56, { color: "#F97316", opacity: 0.45, z: 18 }),
      ...platform("#0284C7"),
      ...sparkles("#38BDF8"),
      vignette(0.24),
    ],
  },
  {
    id: "autumn-harvest",
    name: "Autumn Harvest",
    category: "Seasonal",
    accent: "#C2410C",
    background: grad("#F7DCC0", "#FBEDDC", "#FFFAF4"),
    elements: [
      ...atmosphere("#C2410C", "#FDBA74"),
      ...scatter(
        "Falling Leaf",
        "leaf",
        [[28, 34, 44], [104, 96, 36], [214, 22, 40], [352, 70, 46], [286, 142, 34]],
        { color: "#C2410C", opacity: 0.4, z: 16, rotation: 22 },
      ),
      deco("Branch Bare", "branch", 320, -34, 96, 118, { color: "#7C2D12", opacity: 0.22, z: 8, rotation: 12 }),
      deco("Field", "hill", -26, 132, 300, 80, { color: "#B45309", opacity: 0.16, z: 10 }),
      ...stage("#C2410C"),
      ...sparkles("#F97316"),
      vignette(0.28),
    ],
  },
  {
    id: "winter-frost",
    name: "Winter Frost",
    category: "Seasonal",
    accent: "#0EA5E9",
    background: duo("#D8E9F5", "#FAFDFF", 168),
    elements: [
      ...halo("#0EA5E9", 0.26),
      ...scatter(
        "Snowflake",
        "sparkle",
        [[34, 34, 24], [110, 96, 18], [198, 40, 20], [252, 138, 16], [356, 62, 22], [318, 160, 14]],
        { color: "#FFFFFF", opacity: 0.9, z: 100 },
      ),
      deco("Drift Left", "cloud-soft", -44, 132, 190, 76, { color: "#FFFFFF", opacity: 0.75, z: 12, blur: 2 }),
      deco("Drift Right", "cloud-soft", 250, 148, 178, 68, { color: "#FFFFFF", opacity: 0.65, z: 12, blur: 2 }),
      deco("Frost Ring", "ring", 244, 26, 118, 118, { color: "#0EA5E9", opacity: 0.16, z: 10 }),
      ...platform("#0EA5E9"),
      vignette(0.22),
    ],
  },
  {
    id: "monsoon-green",
    name: "Monsoon Green",
    category: "Seasonal",
    accent: "#15803D",
    background: grad("#D2EBD8", "#E9F6ED", "#F9FDFA"),
    elements: [
      ...atmosphere("#15803D", "#86EFAC"),
      deco("Rain Cloud", "cloud", 224, -28, 176, 84, { color: "#166534", opacity: 0.22, z: 8 }),
      ...scatter("Rain Drop", "teardrop", [[248, 74, 15], [292, 112, 12], [340, 88, 14], [366, 130, 11]], {
        color: "#0891B2",
        opacity: 0.45,
        z: 18,
      }),
      deco("Wet Leaves", "monstera", -40, 74, 118, 118, { color: "#15803D", opacity: 0.3, z: 14, rotation: -14 }),
      deco("Puddle", "ring", 178, 156, 130, 48, { color: "#0891B2", opacity: 0.2, z: 22 }),
      ...stage("#15803D"),
      ...sparkles("#22C55E"),
      vignette(0.28),
    ],
  },
  {
    id: "festival-lights",
    name: "Festival Lights",
    category: "Seasonal",
    accent: "#D97706",
    background: rad("#FBE3B6", "#FEF7EA"),
    elements: [
      ...halo("#D97706", 0.4),
      ...scatter(
        "Lamp",
        "teardrop",
        [[24, 18, 34], [92, 26, 28], [162, 16, 32], [312, 20, 34], [376, 30, 26]],
        { color: "#F59E0B", opacity: 0.7, z: 20, rotation: 180 },
      ),
      deco("Garland", "dashed-line", 4, 12, 392, 8, { color: "#B45309", opacity: 0.3, z: 16 }),
      deco("Rangoli", "dots", 232, 130, 68, 68, { color: "#D97706", opacity: 0.3, z: 18 }),
      ...stage("#D97706"),
      ...sparkles("#FBBF24"),
      vignette(0.3),
    ],
  },
];
