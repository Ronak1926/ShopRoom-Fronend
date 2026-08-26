/**
 * features/notifications/scenes/premium.ts — Upmarket presentation: plinths,
 * arches, metallics and restraint. Built around the product, not the copy.
 */

import type { Scene } from "./types";
import { deco, duo, grad, halo, rad, scatter, sparkles, spread, stage, vignette } from "./helpers";

export const PREMIUM_SCENES: Scene[] = [
  {
    id: "marble-plinth",
    name: "Marble Plinth",
    category: "Premium",
    accent: "#8B7355",
    background: grad("#EDEAE3", "#F7F5F1", "#FDFCFB"),
    elements: [
      ...halo("#8B7355", 0.28),
      deco("Arch", "arc", 232, 6, 152, 122, { color: "#8B7355", opacity: 0.16, z: 10 }),
      deco("Column Left", "cylinder", 214, 40, 34, 148, { color: "#A8A29E", opacity: 0.22, z: 12 }),
      deco("Column Right", "cylinder", 364, 40, 34, 148, { color: "#A8A29E", opacity: 0.22, z: 12 }),
      ...stage("#8B7355"),
      deco("Vein", "dashed-line", 24, 168, 160, 6, { color: "#8B7355", opacity: 0.16, z: 16 }),
      ...sparkles("#C0A98A"),
      vignette(0.3),
    ],
  },
  {
    id: "gold-leaf",
    name: "Gold Leaf",
    category: "Premium",
    accent: "#B45309",
    background: grad("#F3E9D2", "#FAF4E7", "#FFFDF8"),
    elements: [
      ...halo("#B45309", 0.3),
      deco("Frame Gold", "frame", 216, 14, 172, 172, { color: "#B45309", opacity: 0.22, z: 12 }),
      ...scatter("Gold Fleck", "diamond", [[24, 34, 26], [96, 148, 20], [200, 26, 22]], {
        color: "#D97706",
        opacity: 0.35,
        z: 14,
        rotation: 18,
      }),
      deco("Sheen", "light-ray", 234, -42, 144, 190, { color: "#FDE68A", opacity: 0.38, z: 6 }),
      ...stage("#B45309"),
      ...sparkles("#F59E0B"),
      vignette(0.32),
    ],
  },
  {
    id: "boutique-arch",
    name: "Boutique Arch",
    category: "Premium",
    accent: "#9F1239",
    // A deeper rose than the near-whites around it; at this lightness two
    // different hues still measure as the same colour.
    background: duo("#EBD3D9", "#FCF6F8", 162),
    elements: [
      ...halo("#9F1239", 0.24),
      deco("Arch Back", "semicircle", 226, 22, 164, 164, { color: "#9F1239", opacity: 0.14, z: 8 }),
      deco("Arch Front", "semicircle", 250, 48, 116, 116, { color: "#BE123C", opacity: 0.12, z: 10 }),
      deco("Drape", "arc", -24, 28, 200, 92, { color: "#9F1239", opacity: 0.14, z: 12 }),
      ...stage("#9F1239"),
      ...sparkles("#E11D48"),
      vignette(0.28),
    ],
  },
  {
    id: "monochrome-luxe",
    name: "Monochrome Luxe",
    category: "Premium",
    accent: "#1F2937",
    background: duo("#E4E5E9", "#FAFAFC", 150),
    elements: [
      deco("Panel", "squircle", 218, 16, 172, 168, { color: "#1F2937", opacity: 0.08, z: 8 }),
      deco("Hairline", "dashed-line", 22, 52, 172, 6, { color: "#1F2937", opacity: 0.18, z: 14 }),
      deco("Ring Thin", "ring", 250, 40, 116, 116, { color: "#374151", opacity: 0.14, z: 12 }),
      ...stage("#1F2937"),
      deco("Mark", "cross", 200, 150, 32, 32, { color: "#374151", opacity: 0.28, z: 16 }),
      vignette(0.26),
    ],
  },
  {
    id: "silk-drape",
    name: "Silk Drape",
    category: "Premium",
    accent: "#4F6F52",
    // Sage — the one hue nothing else in Premium occupies. Violet collided with
    // Spotlight Beam and champagne collided with Lens Bloom and Gold Leaf.
    background: rad("#E2EBE0", "#FAFCF9"),
    elements: [
      ...halo("#4F6F52", 0.28),
      ...spread(
        "Fold",
        "wave",
        [[-30, 44, 230, 48], [148, 84, 250, 50], [-14, 132, 220, 46]],
        { color: "#4F6F52", opacity: 0.14, z: 10 },
      ),
      deco("Sheen", "light-ray", 240, -40, 136, 186, { color: "#FFFFFF", opacity: 0.45, z: 12 }),
      ...stage("#4F6F52"),
      ...sparkles("#7A9A7E"),
      vignette(0.3),
    ],
  },
  {
    id: "atelier-white",
    name: "Atelier White",
    category: "Premium",
    accent: "#A8A29E",
    background: duo("#F5F3F0", "#FFFFFF", 168),
    elements: [
      deco("Wall Shadow", "glow", 190, -20, 200, 200, { color: "#A8A29E", opacity: 0.28, z: 4 }),
      deco("Plinth Wide", "platform", 226, 140, 160, 42, { color: "#D6D3D1", opacity: 0.55, z: 24 }),
      deco("Riser", "cylinder", 274, 70, 64, 92, { color: "#E7E5E4", opacity: 0.7, z: 26 }),
      deco("Rule Left", "dashed-line", 22, 164, 156, 6, { color: "#A8A29E", opacity: 0.2, z: 16 }),
      ...stage("#A8A29E"),
      ...sparkles("#D6D3D1"),
      vignette(0.22),
    ],
  },
];
