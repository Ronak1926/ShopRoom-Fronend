/**
 * features/notifications/scenes/abstract.ts — Colour-field and fluid-form
 * compositions with no literal subject.
 */

import type { Scene } from "./types";
import { deco, duo, grad, halo, platform, rad, scatter, sparkles, spread, stage, vignette } from "./helpers";

export const ABSTRACT_SCENES: Scene[] = [
  {
    id: "liquid-marble",
    name: "Liquid Marble",
    category: "Abstract",
    accent: "#0F766E",
    // Mint-into-lilac stone rather than Aurora Bloom's violet-pink; both are
    // blob compositions, so the palette has to carry the difference.
    background: grad("#DDEBE8", "#EAE4F4", "#FBFAFD"),
    elements: [
      deco("Blob Large", "blob", 220, 8, 170, 170, { color: "#0F766E", opacity: 0.2, z: 8, rotation: 22 }),
      deco("Blob Mid", "blob", -44, 44, 140, 140, { color: "#6366F1", opacity: 0.18, z: 8, rotation: -18 }),
      deco("Blob Small", "blob", 96, 118, 110, 110, { color: "#0EA5E9", opacity: 0.14, z: 8, rotation: 10 }),
      deco("Swirl", "arc", 148, 44, 210, 92, { color: "#FFFFFF", opacity: 0.45, z: 14 }),
      deco("Bead", "teardrop", 202, 148, 40, 40, { color: "#14B8A6", opacity: 0.35, z: 16 }),
      ...stage("#0F766E"),
      ...sparkles("#2DD4BF"),
      vignette(0.3),
    ],
  },
  {
    id: "gradient-mesh",
    name: "Gradient Mesh",
    category: "Abstract",
    accent: "#4F46E5",
    background: rad("#DCE7FB", "#F8FAFE"),
    elements: [
      ...spread(
        "Mesh Orb",
        "gradient-orb",
        [[-46, -40, 150, 150], [244, -46, 160, 160], [80, 92, 140, 140], [292, 96, 148, 148]],
        { opacity: 0.42, z: 6 },
      ),
      deco("Mesh Tint", "glow", 118, 20, 180, 180, { color: "#8B5CF6", opacity: 0.3, z: 4 }),
      ...platform("#4F46E5"),
      ...sparkles("#818CF8"),
      vignette(0.26),
    ],
  },
  {
    id: "ripple-field",
    name: "Ripple Field",
    category: "Abstract",
    accent: "#1D4ED8",
    // Blue, not teal: Aura Ring already owns the green-teal concentric look.
    background: duo("#D6E4F5", "#F8FBFE", 158),
    elements: [
      ...halo("#1D4ED8", 0.3),
      ...spread(
        "Ripple",
        "ring",
        [[186, -34, 240, 240], [216, -4, 180, 180], [246, 26, 120, 120]],
        { color: "#1D4ED8", opacity: 0.16, z: 10 },
      ),
      deco("Ripple Left", "ring", -56, 58, 140, 140, { color: "#3B82F6", opacity: 0.14, z: 10 }),
      deco("Current", "wave", -22, 148, 230, 46, { color: "#1D4ED8", opacity: 0.2, z: 14 }),
      ...stage("#1D4ED8"),
      ...sparkles("#60A5FA"),
      vignette(0.26),
    ],
  },
  {
    id: "paper-cut",
    name: "Paper Cut",
    category: "Abstract",
    accent: "#EA580C",
    background: grad("#FBE6D8", "#FDF2EA", "#FFFBF8"),
    elements: [
      ...spread(
        "Layer",
        "semicircle",
        [[-60, 40, 200, 200], [-30, 70, 160, 160], [-4, 100, 120, 120]],
        { color: "#EA580C", opacity: 0.14, z: 8 },
      ),
      deco("Arch Right", "arc", 246, 18, 150, 100, { color: "#F97316", opacity: 0.2, z: 10 }),
      deco("Quarter", "quarter-circle", 336, 118, 84, 84, { color: "#EA580C", opacity: 0.18, z: 10, rotation: 180 }),
      ...stage("#EA580C"),
      ...sparkles("#FB923C"),
      vignette(0.26),
    ],
  },
  {
    id: "prism-split",
    name: "Prism Split",
    category: "Abstract",
    accent: "#8B5CF6",
    background: duo("#EDE7FB", "#FBFAFE", 140),
    elements: [
      ...spread(
        "Prism",
        "triangle",
        [[196, -18, 110, 110], [252, 34, 130, 130], [318, -8, 96, 96]],
        { color: "#8B5CF6", opacity: 0.18, z: 10, rotation: 12 },
      ),
      deco("Beam", "light-ray", 214, -40, 150, 200, { color: "#FFFFFF", opacity: 0.4, z: 6 }),
      deco("Spectrum Line", "zigzag", -26, 132, 210, 44, { color: "#A855F7", opacity: 0.2, z: 14 }),
      ...platform("#8B5CF6"),
      ...sparkles("#C084FC"),
      vignette(0.28),
    ],
  },
  {
    id: "noise-drift",
    name: "Noise Drift",
    category: "Abstract",
    accent: "#6366F1",
    background: grad("#E8E6EE", "#F4F3F8", "#FCFCFE"),
    elements: [
      ...halo("#6366F1", 0.26),
      ...scatter("Particle Field", "particles", [[-20, -18, 180], [212, 22, 190], [96, 96, 170]], {
        color: "#6366F1",
        opacity: 0.3,
        z: 10,
      }),
      deco("Drift Line", "dashed-line", 26, 168, 176, 8, { color: "#4F46E5", opacity: 0.2, z: 16 }),
      ...stage("#6366F1"),
      ...sparkles("#818CF8"),
      vignette(0.24),
    ],
  },
];
