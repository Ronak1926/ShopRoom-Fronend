/**
 * features/notifications/scenes/festive.ts — Celebration, gifting and events.
 * Confetti and ribbons are kept to the corners; the middle stays readable.
 */

import type { Scene } from "./types";
import { atmosphere, deco, duo, grad, halo, platform, rad, scatter, sparkles, spread, stage, vignette } from "./helpers";

export const FESTIVE_SCENES: Scene[] = [
  {
    id: "party-pop",
    name: "Party Pop",
    category: "Festive",
    accent: "#DB2777",
    background: grad("#FBDCEF", "#F3E6FC", "#FBF7FE"),
    elements: [
      ...atmosphere("#DB2777", "#C4B5FD"),
      deco("Confetti Right", "confetti", 258, -22, 150, 150, { opacity: 0.95, z: 100 }),
      deco("Confetti Left", "confetti", -38, -18, 128, 128, { opacity: 0.7, z: 100 }),
      ...spread("Streamer", "ribbon", [[-28, 128, 124, 54], [292, 116, 118, 52]], {
        color: "#DB2777",
        opacity: 0.3,
        z: 12,
        rotation: -14,
      }),
      ...stage("#DB2777"),
      ...sparkles("#F472B6"),
      vignette(0.28),
    ],
  },
  {
    id: "gift-wrap",
    name: "Gift Wrap",
    category: "Festive",
    accent: "#E11D48",
    background: grad("#FBD3D8", "#FDEAEC", "#FFF9FA"),
    elements: [
      ...halo("#E11D48", 0.34),
      deco("Box", "squircle", 254, 46, 104, 104, { color: "#E11D48", opacity: 0.2, z: 10 }),
      deco("Ribbon Vertical", "ribbon", 288, 20, 36, 156, { color: "#F43F5E", opacity: 0.36, z: 14 }),
      deco("Ribbon Horizontal", "ribbon", 232, 82, 148, 34, { color: "#F43F5E", opacity: 0.36, z: 14 }),
      ...scatter("Bow Star", "star", [[204, 26, 28], [370, 132, 22]], { color: "#FBBF24", opacity: 0.85, z: 26 }),
      deco("Corner Sprig", "leaf-sprig", -26, 118, 72, 92, { color: "#BE123C", opacity: 0.2, z: 12, rotation: 16 }),
      ...platform("#E11D48"),
      vignette(0.28),
    ],
  },
  {
    id: "birthday-bright",
    name: "Birthday Bright",
    category: "Festive",
    accent: "#F59E0B",
    background: rad("#FDE7B8", "#FFFCF3"),
    elements: [
      ...halo("#F59E0B", 0.36),
      ...scatter(
        "Balloon",
        "bubble",
        [[-28, 12, 82], [30, 78, 64], [318, -6, 88], [356, 84, 66]],
        { color: "#F97316", opacity: 0.35, z: 10 },
      ),
      deco("Confetti Fall", "confetti", 172, -20, 140, 140, { opacity: 0.8, z: 100 }),
      deco("Bunting", "zigzag", -20, 152, 220, 42, { color: "#F59E0B", opacity: 0.26, z: 14 }),
      ...stage("#F59E0B"),
      ...sparkles("#FBBF24"),
      vignette(0.24),
    ],
  },
  {
    id: "anniversary-gold",
    name: "Anniversary Gold",
    category: "Festive",
    accent: "#B45309",
    background: grad("#F6E7C4", "#FBF3E1", "#FFFDF7"),
    elements: [
      ...atmosphere("#B45309", "#FCD34D"),
      deco("Laurel Left", "leaf-cluster", -32, 60, 96, 110, { color: "#B45309", opacity: 0.24, z: 10, rotation: -16 }),
      deco("Laurel Right", "leaf-cluster", 336, 56, 94, 108, { color: "#B45309", opacity: 0.24, z: 10, rotation: 16 }),
      deco("Medal", "ring", 254, 30, 104, 104, { color: "#D97706", opacity: 0.3, z: 14 }),
      deco("Rays", "light-ray", 240, -44, 136, 186, { color: "#FDE68A", opacity: 0.42, z: 6 }),
      ...stage("#B45309"),
      ...sparkles("#F59E0B"),
      vignette(0.3),
    ],
  },
  {
    id: "invite-card",
    name: "Invite Card",
    category: "Festive",
    accent: "#4F46E5",
    background: duo("#E2E0FA", "#FAFAFE", 155),
    elements: [
      ...halo("#4F46E5", 0.3),
      deco("Card Frame", "frame", 226, 22, 160, 156, { color: "#4F46E5", opacity: 0.2, z: 12 }),
      deco("Speech Note", "speech-bubble", 186, 20, 78, 62, { color: "#6366F1", opacity: 0.26, z: 14, rotation: -8 }),
      deco("Divider", "dashed-line", 26, 122, 168, 8, { color: "#4F46E5", opacity: 0.24, z: 14 }),
      ...scatter("Accent Dot", "dots", [[16, 22, 52], [140, 150, 46]], { color: "#4F46E5", opacity: 0.2, z: 10 }),
      ...platform("#4F46E5"),
      ...sparkles("#818CF8"),
      vignette(0.24),
    ],
  },
  {
    id: "confetti-rain",
    name: "Confetti Rain",
    category: "Festive",
    accent: "#0891B2",
    background: grad("#DFF1F7", "#EFF8FB", "#FAFDFE"),
    elements: [
      ...halo("#0891B2", 0.28),
      ...spread(
        "Confetti Band",
        "confetti",
        [[-34, -24, 140, 140], [128, -30, 150, 150], [286, -20, 144, 144]],
        { opacity: 0.85, z: 100 },
      ),
      deco("Ground Ribbon", "ribbon", 106, 152, 190, 48, { color: "#0891B2", opacity: 0.24, z: 14 }),
      ...stage("#0891B2"),
      ...sparkles("#22D3EE"),
      vignette(0.24),
    ],
  },
];
