/**
 * features/notifications/scenes/clouds.ts — Sky, weather and altitude. Cloud
 * masses sit high or low, never across the middle where the copy runs.
 */

import type { Scene } from "./types";
import { atmosphere, deco, duo, grad, halo, platform, scatter, sparkles, stage, vignette } from "./helpers";

export const CLOUD_SCENES: Scene[] = [
  {
    id: "sunrise-sky",
    name: "Sunrise Sky",
    category: "Clouds",
    accent: "#F97316",
    background: grad("#FBD9C0", "#FDEBDD", "#FFF8F3"),
    elements: [
      ...atmosphere("#F97316", "#FDBA74"),
      deco("Sun Disc", "gradient-orb", 262, 34, 96, 96, { color: "#FB923C", opacity: 0.6, z: 6 }),
      deco("Sun Rays", "light-ray", 240, -40, 140, 190, { color: "#FED7AA", opacity: 0.45, z: 5 }),
      deco("Cloud High", "cloud-soft", -44, -22, 190, 76, { color: "#FFFFFF", opacity: 0.6, z: 8, blur: 3 }),
      deco("Cloud Left", "cloud", -28, 14, 150, 70, { color: "#FFFFFF", opacity: 0.9, z: 12 }),
      deco("Cloud Low", "cloud", 176, 138, 170, 76, { color: "#FFFFFF", opacity: 0.7, z: 14 }),
      ...platform("#F97316"),
      ...sparkles("#FB923C"),
      vignette(0.26),
    ],
  },
  {
    id: "storm-break",
    name: "Storm Break",
    category: "Clouds",
    accent: "#475569",
    background: grad("#D5DAE6", "#E8EBF2", "#F7F8FC"),
    elements: [
      ...atmosphere("#475569", "#94A3B8"),
      deco("Storm Cloud", "cloud", 210, -30, 190, 92, { color: "#64748B", opacity: 0.35, z: 8 }),
      deco("Cloud Left", "cloud-soft", -46, -14, 180, 74, { color: "#94A3B8", opacity: 0.3, z: 8, blur: 2 }),
      deco("Bolt", "lightning", 296, 46, 38, 66, { color: "#FBBF24", opacity: 0.95, z: 26, rotation: 8 }),
      ...scatter("Rain", "teardrop", [[236, 96, 14], [264, 128, 11], [340, 108, 13], [366, 140, 10]], {
        color: "#38BDF8",
        opacity: 0.55,
        z: 20,
      }),
      deco("Ground Mist", "mist", -16, 154, 200, 52, { color: "#FFFFFF", opacity: 0.5, z: 16 }),
      ...stage("#475569"),
      vignette(0.34),
    ],
  },
  {
    id: "high-altitude",
    name: "High Altitude",
    category: "Clouds",
    accent: "#0284C7",
    background: duo("#BBDCF7", "#F6FBFF", 168),
    elements: [
      ...halo("#0284C7", 0.32),
      deco("Cirrus Top", "mist", 130, 10, 250, 44, { color: "#FFFFFF", opacity: 0.75, z: 8 }),
      deco("Cirrus Mid", "mist", -30, 54, 230, 40, { color: "#FFFFFF", opacity: 0.6, z: 8 }),
      deco("Cirrus Low", "mist", 96, 148, 260, 46, { color: "#FFFFFF", opacity: 0.55, z: 10 }),
      deco("Cloud Deck", "cloud-soft", -50, 108, 200, 78, { color: "#FFFFFF", opacity: 0.7, z: 12, blur: 2 }),
      ...platform("#0284C7"),
      ...sparkles("#38BDF8"),
      vignette(0.2),
    ],
  },
  {
    id: "cotton-drift",
    name: "Cotton Drift",
    category: "Clouds",
    accent: "#A855F7",
    // Warm peach into lilac, so it doesn't land in the same pale blue-violet
    // territory as Soft Clouds — the cloud artwork alone can't separate them.
    background: grad("#F7E6E0", "#F1E8FB", "#FDFAFF"),
    elements: [
      ...atmosphere("#A855F7", "#FBCFE8"),
      ...scatter("Puff", "cloud", [[-30, -4, 120], [116, -26, 96], [286, -18, 108], [344, 96, 88]], {
        color: "#FFFFFF",
        opacity: 0.85,
        z: 12,
      }),
      ...scatter("Bobble", "bubble", [[206, 128, 54], [162, 156, 38]], { color: "#F0ABFC", opacity: 0.4, z: 14 }),
      deco("Soft Bank", "cloud-soft", 30, 134, 210, 80, { color: "#FFFFFF", opacity: 0.6, z: 10, blur: 3 }),
      ...stage("#A855F7"),
      ...sparkles("#C084FC"),
      vignette(0.22),
    ],
  },
  {
    id: "monsoon-cool",
    name: "Monsoon Cool",
    category: "Clouds",
    accent: "#0E7490",
    background: grad("#C9E4E7", "#E4F2F4", "#F7FCFD"),
    elements: [
      ...atmosphere("#0E7490", "#67E8F9"),
      deco("Cloud Heavy", "cloud", -34, -24, 176, 84, { color: "#0E7490", opacity: 0.24, z: 8 }),
      deco("Cloud Right", "cloud-soft", 246, -20, 170, 76, { color: "#0E7490", opacity: 0.2, z: 8, blur: 2 }),
      ...scatter(
        "Drop",
        "teardrop",
        [[36, 76, 16], [88, 110, 12], [142, 62, 13], [196, 118, 11], [250, 84, 14]],
        { color: "#0891B2", opacity: 0.4, z: 18 },
      ),
      deco("Puddle Ripple", "ring", 240, 142, 132, 56, { color: "#0891B2", opacity: 0.22, z: 22 }),
      ...platform("#0E7490"),
      ...sparkles("#22D3EE"),
      vignette(0.28),
    ],
  },
  {
    id: "pastel-horizon",
    name: "Pastel Horizon",
    category: "Clouds",
    accent: "#F472B6",
    background: grad("#FBDCE8", "#E6E4FB", "#DCEFFA"),
    elements: [
      ...halo("#F472B6", 0.3, 140, 70),
      deco("Band Upper", "wave", -24, 62, 240, 46, { color: "#FFFFFF", opacity: 0.5, z: 8 }),
      deco("Band Lower", "wave", 168, 112, 250, 48, { color: "#FFFFFF", opacity: 0.42, z: 8 }),
      deco("Cloud Soft Left", "cloud-soft", -40, -16, 176, 72, { color: "#FFFFFF", opacity: 0.65, z: 10, blur: 3 }),
      deco("Cloud Soft Right", "cloud-soft", 258, 130, 168, 70, { color: "#FFFFFF", opacity: 0.55, z: 10, blur: 3 }),
      ...platform("#A78BFA"),
      ...sparkles("#F472B6"),
      vignette(0.2),
    ],
  },
];
