/**
 * features/notifications/scenes/geometric.ts — Hard-edged shape composition.
 * Each scene commits to one shape language (rings, polygons, chevrons…) rather
 * than mixing them, so they stay distinguishable from one another at thumbnail
 * size.
 */

import type { Scene } from "./types";
import { deco, duo, grad, halo, platform, rad, scatter, sparkles, spread, stage, vignette } from "./helpers";

export const GEOMETRIC_SCENES: Scene[] = [
  {
    id: "orbit-rings",
    name: "Orbit Rings",
    category: "Geometric",
    accent: "#6D28D9",
    background: rad("#E5DEFB", "#F9F7FF"),
    elements: [
      ...halo("#6D28D9", 0.34),
      ...spread(
        "Orbit",
        "ring",
        [[212, 2, 188, 188], [238, 28, 136, 136], [264, 54, 84, 84]],
        { color: "#6D28D9", opacity: 0.2, z: 10 },
      ),
      deco("Ring Offset", "ring", -42, 62, 118, 118, { color: "#8B5CF6", opacity: 0.16, z: 10 }),
      ...stage("#6D28D9"),
      ...sparkles("#8B5CF6"),
      vignette(0.3),
    ],
  },
  {
    id: "hex-grid",
    name: "Hex Grid",
    category: "Geometric",
    accent: "#0369A1",
    background: duo("#DCEAF6", "#F8FBFE", 150),
    elements: [
      ...scatter(
        "Hex",
        "hexagon",
        [[-24, 8, 76], [22, 74, 60], [-18, 130, 68], [312, -14, 82], [352, 60, 64], [326, 132, 74]],
        { color: "#0369A1", opacity: 0.16, z: 10 },
      ),
      deco("Hex Accent", "hexagon", 208, 140, 54, 54, { color: "#0EA5E9", opacity: 0.3, z: 14 }),
      ...platform("#0369A1"),
      ...sparkles("#0EA5E9"),
      vignette(0.24),
    ],
  },
  {
    id: "chevron-drive",
    name: "Chevron Drive",
    category: "Geometric",
    accent: "#EA580C",
    background: grad("#FCE3D4", "#FDF1E9", "#FFFBF8"),
    elements: [
      ...spread(
        "Chevron",
        "chevron",
        [[-26, 46, 96, 108], [34, 46, 96, 108], [94, 46, 96, 108]],
        { color: "#EA580C", opacity: 0.14, z: 8 },
      ),
      deco("Arrow Lead", "arrow-block", 214, 74, 92, 52, { color: "#F97316", opacity: 0.28, z: 14 }),
      deco("Zigzag Base", "zigzag", 156, 156, 220, 40, { color: "#EA580C", opacity: 0.2, z: 16 }),
      ...stage("#EA580C"),
      ...sparkles("#FB923C"),
      vignette(0.26),
    ],
  },
  {
    id: "polygon-play",
    name: "Polygon Play",
    category: "Geometric",
    accent: "#7C3AED",
    background: grad("#E7E3F8", "#F3F1FC", "#FBFAFE"),
    elements: [
      deco("Pentagon", "pentagon", -30, 22, 96, 96, { color: "#7C3AED", opacity: 0.18, z: 10, rotation: -12 }),
      deco("Octagon", "octagon", 20, 116, 80, 80, { color: "#A855F7", opacity: 0.16, z: 10 }),
      deco("Trapezoid", "trapezoid", 336, -10, 92, 76, { color: "#7C3AED", opacity: 0.18, z: 10, rotation: 8 }),
      deco("Parallelogram", "parallelogram", 320, 132, 100, 62, { color: "#A855F7", opacity: 0.16, z: 10, rotation: -6 }),
      deco("Triangle Accent", "triangle", 198, 14, 62, 58, { color: "#C084FC", opacity: 0.3, z: 14, rotation: 16 }),
      ...stage("#7C3AED"),
      ...sparkles("#A855F7"),
      vignette(0.28),
    ],
  },
  {
    id: "diamond-cut",
    name: "Diamond Cut",
    category: "Geometric",
    accent: "#0F766E",
    background: rad("#DCF0F2", "#F7FCFD"),
    elements: [
      ...halo("#0F766E", 0.3),
      ...scatter("Facet", "diamond", [[-28, 54, 92], [40, 8, 62], [30, 132, 68], [338, 24, 80], [352, 118, 62]], {
        color: "#0D9488",
        opacity: 0.2,
        z: 10,
        rotation: 12,
      }),
      deco("Frame Edge", "frame", 218, 20, 176, 160, { color: "#0F766E", opacity: 0.16, z: 12 }),
      ...platform("#0F766E"),
      ...sparkles("#14B8A6"),
      vignette(0.26),
    ],
  },
  {
    id: "square-stack",
    name: "Square Stack",
    category: "Geometric",
    accent: "#57534E",
    // Warm graphite on sand, so it isn't the same cool grey as Monochrome Luxe.
    background: duo("#EDE8E0", "#FCFBF9", 145),
    elements: [
      ...spread(
        "Squircle",
        "squircle",
        [[-32, 26, 104, 104], [-6, 108, 78, 78], [318, 6, 96, 96], [336, 112, 76, 76]],
        { color: "#57534E", opacity: 0.14, z: 10 },
      ),
      deco("Wedge", "triangle", 202, 20, 52, 50, { color: "#78716C", opacity: 0.26, z: 14, rotation: 14 }),
      deco("Rule", "dashed-line", 24, 172, 170, 8, { color: "#57534E", opacity: 0.2, z: 16 }),
      ...stage("#57534E"),
      ...sparkles("#A8A29E"),
      vignette(0.24),
    ],
  },
];
