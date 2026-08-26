/**
 * features/notifications/scenes/nature.ts — Foliage, terrain and daylight.
 * Motifs hug the left and right edges so the copy column stays legible.
 */

import type { Scene } from "./types";
import { atmosphere, deco, grad, halo, platform, scatter, sparkles, stage, vignette } from "./helpers";

export const NATURE_SCENES: Scene[] = [
  {
    id: "forest-canopy",
    name: "Forest Canopy",
    category: "Nature",
    accent: "#166534",
    background: grad("#CFE8D5", "#E7F5EB", "#F7FCF8"),
    elements: [
      ...atmosphere("#166534", "#4ADE80"),
      deco("Light Shaft", "light-ray", 236, -46, 140, 190, { color: "#FFFFFF", opacity: 0.35, z: 6 }),
      deco("Monstera Overhead", "monstera", -30, -40, 120, 118, { color: "#166534", opacity: 0.3, z: 8, rotation: -24 }),
      deco("Palm Overhead", "palm", 300, -34, 124, 108, { color: "#166534", opacity: 0.26, z: 8, rotation: 18 }),
      deco("Fern Left", "fern", -30, 92, 78, 116, { color: "#15803D", opacity: 0.3, z: 20, rotation: -12 }),
      deco("Leaf Cluster Right", "leaf-cluster", 322, 88, 90, 108, { color: "#15803D", opacity: 0.28, z: 20, rotation: 14 }),
      deco("Undergrowth", "grass", 96, 152, 130, 60, { color: "#166534", opacity: 0.26, z: 24 }),
      ...stage("#166534"),
      ...sparkles("#4ADE80"),
      vignette(0.3),
    ],
  },
  {
    id: "desert-bloom",
    name: "Desert Bloom",
    category: "Nature",
    accent: "#D97706",
    background: grad("#FBE7C6", "#FDF2DE", "#FFFCF6"),
    elements: [
      ...atmosphere("#D97706", "#FCD34D"),
      deco("Sun", "gradient-orb", 316, -28, 104, 104, { color: "#FBBF24", opacity: 0.55, z: 6 }),
      deco("Dune Far", "hill", -30, 108, 300, 84, { color: "#D97706", opacity: 0.18, z: 10 }),
      deco("Dune Near", "hill", 150, 128, 280, 80, { color: "#B45309", opacity: 0.16, z: 12 }),
      deco("Succulent", "plant", -34, 96, 104, 108, { color: "#A16207", opacity: 0.26, z: 20, rotation: -8 }),
      deco("Bloom", "flower", 352, 122, 44, 44, { color: "#F59E0B", opacity: 0.7, z: 26 }),
      ...stage("#D97706"),
      deco("Heat Haze", "mist", 180, 150, 200, 50, { color: "#FFFFFF", opacity: 0.4, z: 28 }),
      ...sparkles("#F59E0B"),
      vignette(0.26),
    ],
  },
  {
    id: "wildflower-meadow",
    name: "Wildflower Meadow",
    category: "Nature",
    accent: "#65A30D",
    background: grad("#E4F0D0", "#F2F8E7", "#FBFDF6"),
    elements: [
      ...atmosphere("#65A30D", "#BEF264"),
      deco("Sky Cloud", "cloud-soft", -34, -18, 168, 70, { color: "#FFFFFF", opacity: 0.7, z: 8 }),
      deco("Grass Left", "grass", -34, 138, 130, 66, { color: "#4D7C0F", opacity: 0.3, z: 20 }),
      deco("Grass Right", "grass", 288, 142, 128, 62, { color: "#4D7C0F", opacity: 0.26, z: 20 }),
      ...scatter(
        "Wildflower",
        "flower",
        [[14, 132, 34], [66, 150, 28], [344, 116, 36], [372, 146, 26]],
        { color: "#EC4899", opacity: 0.62, z: 26 },
      ),
      ...stage("#65A30D"),
      ...sparkles("#84CC16"),
      vignette(0.24),
    ],
  },
  {
    id: "bamboo-calm",
    name: "Bamboo Calm",
    category: "Nature",
    accent: "#0D9488",
    background: grad("#D8EDE4", "#EDF7F3", "#FAFDFC"),
    elements: [
      ...halo("#0D9488", 0.35),
      deco("Stalk Left", "branch", -14, -20, 70, 200, { color: "#0F766E", opacity: 0.22, z: 10, rotation: 4 }),
      deco("Stalk Mid", "branch", 40, 10, 60, 190, { color: "#0F766E", opacity: 0.16, z: 10, rotation: -6 }),
      deco("Stalk Right", "branch", 336, -24, 68, 200, { color: "#0F766E", opacity: 0.2, z: 10, rotation: -4 }),
      deco("Leaf Sprig", "leaf-sprig", 214, -18, 70, 92, { color: "#14B8A6", opacity: 0.22, z: 14, rotation: 18 }),
      ...platform("#0D9488"),
      deco("Zen Line", "dashed-line", 20, 176, 160, 8, { color: "#0F766E", opacity: 0.2, z: 24 }),
      ...sparkles("#14B8A6"),
      vignette(0.22),
    ],
  },
  {
    id: "mountain-air",
    name: "Mountain Air",
    category: "Nature",
    accent: "#0369A1",
    // Deliberately colder and greyer than the Clouds scenes, which sit in pale
    // lavender-blue; altitude should feel like thinner air, not more sky.
    background: grad("#BFD2E2", "#DAE6F0", "#F2F7FB"),
    elements: [
      ...atmosphere("#0369A1", "#7DD3FC"),
      deco("Peak Left", "mountain", -40, 76, 160, 100, { color: "#0C4A6E", opacity: 0.14, z: 8 }),
      deco("Peak Far", "mountain", 150, 48, 210, 120, { color: "#0C4A6E", opacity: 0.16, z: 8 }),
      deco("Peak Near", "mountain", 232, 68, 180, 108, { color: "#075985", opacity: 0.22, z: 10 }),
      deco("Cloud Band", "cloud-soft", -26, 18, 180, 68, { color: "#FFFFFF", opacity: 0.65, z: 12 }),
      deco("Valley Mist", "mist", 120, 150, 220, 54, { color: "#FFFFFF", opacity: 0.5, z: 16 }),
      ...stage("#0369A1"),
      ...sparkles("#38BDF8"),
      vignette(0.28),
    ],
  },
  {
    id: "citrus-grove",
    name: "Citrus Grove",
    category: "Nature",
    accent: "#EA580C",
    background: grad("#FDEBC8", "#FEF6E2", "#FFFDF8"),
    elements: [
      ...atmosphere("#EA580C", "#FDBA74"),
      deco("Branch Right", "branch", 322, -16, 82, 120, { color: "#166534", opacity: 0.22, z: 6, rotation: 12 }),
      deco("Canopy Right", "leaf-cluster", 236, -34, 110, 104, { color: "#15803D", opacity: 0.3, z: 8, rotation: 16 }),
      deco("Canopy Left", "leaf-cluster", -36, 4, 100, 96, { color: "#15803D", opacity: 0.24, z: 8, rotation: -18 }),
      ...scatter("Citrus", "bubble", [[330, 52, 44], [366, 102, 34], [290, 26, 30]], {
        color: "#F97316",
        opacity: 0.7,
        z: 16,
      }),
      ...stage("#EA580C"),
      ...sparkles("#F97316"),
      vignette(0.26),
    ],
  },
];
