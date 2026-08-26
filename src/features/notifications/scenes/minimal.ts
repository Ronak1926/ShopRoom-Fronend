/**
 * features/notifications/scenes/minimal.ts — Restraint. Few elements, low
 * opacity, lots of air; these are the ones to reach for when the copy is doing
 * the work.
 */

import type { Scene } from "./types";
import { deco, duo, grad, halo, platform, rad, scatter, spread, stage, vignette } from "./helpers";

export const MINIMAL_SCENES: Scene[] = [
  {
    id: "single-arc",
    name: "Single Arc",
    category: "Minimal",
    accent: "#5B47D4",
    background: duo("#F3F1F7", "#FDFDFF", 165),
    elements: [
      deco("Arc", "arc", 218, 10, 180, 120, { color: "#5B47D4", opacity: 0.14, z: 10 }),
      deco("Baseline", "dashed-line", 24, 172, 168, 8, { color: "#5B47D4", opacity: 0.16, z: 14 }),
      ...platform("#5B47D4"),
      deco("Accent", "sparkle", 208, 30, 14, 14, { color: "#5B47D4", opacity: 0.55, z: 110 }),
      vignette(0.16),
    ],
  },
  {
    id: "quiet-grid",
    name: "Quiet Grid",
    category: "Minimal",
    accent: "#475569",
    background: duo("#F2F4F7", "#FDFEFF", 150),
    elements: [
      ...scatter("Grid", "dots", [[14, 18, 56], [14, 130, 56], [330, 18, 56], [330, 130, 56]], {
        color: "#475569",
        opacity: 0.12,
        z: 10,
      }),
      deco("Rule", "dashed-line", 108, 98, 184, 8, { color: "#475569", opacity: 0.14, z: 12 }),
      ...platform("#475569"),
      vignette(0.14),
    ],
  },
  {
    id: "corner-frame",
    name: "Corner Frame",
    category: "Minimal",
    accent: "#78716C",
    background: duo("#F7F3EF", "#FFFDFB", 158),
    elements: [
      deco("Frame", "frame", 14, 12, 372, 176, { color: "#78716C", opacity: 0.16, z: 10 }),
      deco("Corner Mark", "cross", 344, 20, 34, 34, { color: "#A8A29E", opacity: 0.4, z: 14 }),
      ...platform("#78716C"),
      deco("Accent Dot", "dots", 24, 152, 40, 40, { color: "#78716C", opacity: 0.16, z: 12 }),
      vignette(0.14),
    ],
  },
  {
    id: "half-tone",
    name: "Half Tone",
    category: "Minimal",
    accent: "#334155",
    background: duo("#EEF1F6", "#FCFDFF", 90),
    elements: [
      deco("Field", "semicircle", 214, -46, 200, 200, { color: "#334155", opacity: 0.1, z: 8, rotation: 90 }),
      deco("Dot Field", "dots", 246, 42, 116, 116, { color: "#334155", opacity: 0.14, z: 12 }),
      ...stage("#334155"),
      vignette(0.16),
    ],
  },
  {
    id: "soft-focus",
    name: "Soft Focus",
    category: "Minimal",
    accent: "#7C63E8",
    background: rad("#F1EDF9", "#FDFCFF"),
    elements: [
      ...halo("#7C63E8", 0.22),
      deco("Ring", "ring", 240, 22, 128, 128, { color: "#7C63E8", opacity: 0.12, z: 10 }),
      deco("Blur Blob", "blob", -34, 96, 120, 120, { color: "#7C63E8", opacity: 0.1, z: 8, blur: 4 }),
      ...platform("#7C63E8"),
      deco("Accent", "sparkle", 214, 152, 13, 13, { color: "#7C63E8", opacity: 0.5, z: 110 }),
      vignette(0.16),
    ],
  },
  {
    id: "line-work",
    name: "Line Work",
    category: "Minimal",
    accent: "#57534E",
    background: grad("#F4F2EE", "#FAF9F7", "#FFFFFE"),
    elements: [
      ...spread(
        "Line",
        "dashed-line",
        [[20, 44, 168, 6], [20, 96, 132, 6], [20, 148, 176, 6]],
        { color: "#57534E", opacity: 0.14, z: 12 },
      ),
      deco("Circle Outline", "ring", 256, 34, 108, 108, { color: "#57534E", opacity: 0.14, z: 10 }),
      ...platform("#57534E"),
      vignette(0.14),
    ],
  },
];
