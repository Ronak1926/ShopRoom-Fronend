/**
 * features/notifications/scenes/glow.ts — Light as the subject: haloes, beams
 * and lens-style bloom. Bright centre, soft falloff, product-first.
 */

import type { Scene } from "./types";
import { deco, duo, grad, halo, platform, rad, scatter, sparkles, spread, stage, vignette } from "./helpers";

export const GLOW_SCENES: Scene[] = [
  {
    id: "spotlight-beam",
    name: "Spotlight Beam",
    category: "Glow",
    accent: "#7C3AED",
    background: rad("#E6DFF9", "#F8F5FE"),
    elements: [
      deco("Beam", "light-ray", 232, -56, 148, 220, { color: "#FFFFFF", opacity: 0.55, z: 6 }),
      deco("Stage Pool", "spotlight", 216, 30, 180, 170, { color: "#FFFFFF", opacity: 0.5, z: 8 }),
      deco("Rim Glow", "glow", 210, -6, 192, 192, { color: "#7C3AED", opacity: 0.4, z: 4 }),
      ...stage("#7C3AED"),
      ...sparkles("#A855F7"),
      vignette(0.42),
    ],
  },
  {
    id: "neon-edge",
    name: "Neon Edge",
    category: "Glow",
    accent: "#2563EB",
    background: duo("#DCE9FA", "#F7FBFF", 150),
    elements: [
      ...halo("#2563EB", 0.4),
      deco("Neon Ring", "ring", 236, 12, 140, 140, { color: "#22D3EE", opacity: 0.42, z: 12 }),
      deco("Neon Ring Inner", "ring", 262, 38, 88, 88, { color: "#3B82F6", opacity: 0.34, z: 12 }),
      deco("Streak", "dashed-line", 20, 60, 176, 8, { color: "#22D3EE", opacity: 0.35, z: 14 }),
      deco("Streak Low", "dashed-line", 20, 148, 130, 8, { color: "#3B82F6", opacity: 0.28, z: 14 }),
      ...platform("#2563EB"),
      ...sparkles("#22D3EE"),
      vignette(0.3),
    ],
  },
  {
    id: "lens-bloom",
    name: "Lens Bloom",
    category: "Glow",
    accent: "#EA580C",
    background: rad("#FBE9D6", "#FFFAF4"),
    elements: [
      ...scatter(
        "Flare",
        "gradient-orb",
        [[214, 12, 96], [268, 54, 68], [318, 96, 50], [356, 132, 36]],
        { color: "#FB923C", opacity: 0.5, z: 10 },
      ),
      deco("Bloom", "glow", 200, -10, 200, 200, { color: "#F59E0B", opacity: 0.45, z: 4 }),
      deco("Streak", "light-ray", 96, -48, 160, 200, { color: "#FFFFFF", opacity: 0.3, z: 6, rotation: 24 }),
      ...stage("#EA580C"),
      ...sparkles("#FBBF24"),
      vignette(0.3),
    ],
  },
  {
    id: "aura-ring",
    name: "Aura Ring",
    category: "Glow",
    accent: "#10B981",
    background: rad("#DCF4EF", "#F7FDFC"),
    elements: [
      ...halo("#10B981", 0.42),
      ...spread(
        "Aura",
        "ring",
        [[204, -18, 204, 204], [236, 14, 140, 140]],
        { color: "#10B981", opacity: 0.22, z: 10 },
      ),
      deco("Aura Left", "gradient-orb", -40, 62, 116, 116, { color: "#34D399", opacity: 0.45, z: 8 }),
      ...stage("#10B981"),
      ...sparkles("#34D399"),
      vignette(0.28),
    ],
  },
  {
    id: "candle-warm",
    name: "Candle Warm",
    category: "Glow",
    accent: "#D97706",
    background: grad("#F7E3C8", "#FBF1E2", "#FFFCF7"),
    elements: [
      ...halo("#D97706", 0.45, 306, 88),
      ...scatter("Flame", "teardrop", [[288, 26, 34], [246, 58, 24], [346, 62, 26]], {
        color: "#F59E0B",
        opacity: 0.75,
        z: 20,
      }),
      deco("Warm Pool", "spotlight", 228, 46, 156, 150, { color: "#FDE68A", opacity: 0.5, z: 10 }),
      deco("Soft Left", "glow", -46, 66, 140, 140, { color: "#F59E0B", opacity: 0.3, z: 4 }),
      ...platform("#D97706"),
      ...sparkles("#FBBF24"),
      vignette(0.34),
    ],
  },
  {
    id: "prism-glow",
    name: "Prism Glow",
    category: "Glow",
    accent: "#9333EA",
    background: duo("#F0E4FA", "#FCF9FE", 145),
    elements: [
      ...spread(
        "Colour Wash",
        "glow",
        [[-50, -34, 170, 170], [126, 26, 170, 170], [268, -20, 180, 180]],
        { opacity: 0.4, z: 4 },
      ),
      deco("Prism", "diamond", 254, 42, 104, 104, { color: "#C084FC", opacity: 0.35, z: 14, rotation: 12 }),
      deco("Refraction", "zigzag", 176, 148, 220, 44, { color: "#A855F7", opacity: 0.22, z: 16 }),
      ...stage("#9333EA"),
      ...sparkles("#D8B4FE"),
      vignette(0.3),
    ],
  },
];
