/**
 * features/notifications/scenes/night.ts — Dark backgrounds. These need light
 * copy: the seeded templates lay dark ink on the banner, so applying one of
 * these means recolouring the headline and body text to read against it.
 */

import type { Scene } from "./types";
import { deco, duo, grad, halo, platform, rad, scatter, sparkles, spread, stage, vignette } from "./helpers";

export const NIGHT_SCENES: Scene[] = [
  {
    id: "starfield",
    name: "Starfield",
    category: "Night",
    accent: "#818CF8",
    background: grad("#151033", "#1E1B4B", "#2C2A6B"),
    elements: [
      ...halo("#818CF8", 0.4),
      ...scatter(
        "Star",
        "star",
        [[30, 26, 18], [96, 78, 12], [166, 34, 15], [222, 120, 11], [352, 44, 16], [300, 158, 12]],
        { color: "#FFFFFF", opacity: 0.85, z: 100 },
      ),
      deco("Nebula", "gradient-orb", 244, 6, 150, 150, { color: "#8B5CF6", opacity: 0.5, z: 8 }),
      deco("Dust", "particles", 60, 96, 180, 110, { color: "#C7D2FE", opacity: 0.3, z: 12 }),
      ...platform("#818CF8"),
      vignette(0.3),
    ],
  },
  {
    id: "moonlit",
    name: "Moonlit",
    category: "Night",
    accent: "#60A5FA",
    background: grad("#0C1B33", "#14294D", "#1D3A66"),
    elements: [
      ...halo("#60A5FA", 0.35),
      deco("Moon", "crescent", 306, 16, 88, 88, { color: "#E0F2FE", opacity: 0.85, z: 14 }),
      deco("Moon Glow", "glow", 264, -26, 172, 172, { color: "#93C5FD", opacity: 0.4, z: 6 }),
      deco("Cloud Wisp", "cloud-soft", -40, 92, 190, 74, { color: "#1E3A8A", opacity: 0.55, z: 12, blur: 3 }),
      ...scatter("Night Star", "sparkle", [[46, 30, 16], [150, 62, 12], [212, 22, 14]], {
        color: "#FFFFFF",
        opacity: 0.8,
        z: 100,
      }),
      ...platform("#60A5FA"),
      vignette(0.32),
    ],
  },
  {
    id: "midnight-sale",
    name: "Midnight Sale",
    category: "Night",
    accent: "#F43F5E",
    background: grad("#2A0A1C", "#4C0B2C", "#6D1240"),
    elements: [
      ...halo("#F43F5E", 0.42),
      deco("Burst", "sale-burst", 240, 4, 132, 132, { color: "#FB7185", opacity: 0.35, z: 8 }),
      deco("Bolt", "lightning", 202, 30, 42, 70, { color: "#FBBF24", opacity: 0.9, z: 26, rotation: -12 }),
      deco("Tag", "price-tag", 336, 118, 66, 66, { color: "#FB7185", opacity: 0.4, z: 16, rotation: 14 }),
      deco("Streak", "dashed-line", 22, 160, 170, 8, { color: "#F43F5E", opacity: 0.35, z: 16 }),
      ...stage("#E11D48"),
      ...sparkles("#FBBF24"),
      vignette(0.28),
    ],
  },
  {
    id: "deep-space",
    name: "Deep Space",
    category: "Night",
    accent: "#A855F7",
    background: rad("#3B1D6E", "#0B0620"),
    elements: [
      ...spread(
        "Galaxy",
        "gradient-orb",
        [[212, -30, 170, 170], [284, 60, 130, 130]],
        { color: "#A855F7", opacity: 0.5, z: 8 },
      ),
      deco("Orbit", "ring", 226, 6, 160, 160, { color: "#C4B5FD", opacity: 0.25, z: 12 }),
      ...scatter("Speck", "sparkle", [[24, 44, 14], [88, 20, 11], [140, 116, 13], [190, 62, 10], [58, 150, 12]], {
        color: "#FFFFFF",
        opacity: 0.8,
        z: 100,
      }),
      ...platform("#A855F7"),
      vignette(0.24),
    ],
  },
  {
    id: "neon-night",
    name: "Neon Night",
    category: "Night",
    accent: "#22D3EE",
    background: duo("#0A1F2E", "#123B4F", 155),
    elements: [
      ...halo("#22D3EE", 0.42),
      ...spread(
        "Neon Bar",
        "dashed-line",
        [[20, 40, 178, 8], [20, 152, 138, 8]],
        { color: "#22D3EE", opacity: 0.5, z: 16 },
      ),
      deco("Neon Ring", "ring", 240, 20, 132, 132, { color: "#F472B6", opacity: 0.45, z: 12 }),
      deco("Neon Ring Inner", "ring", 264, 44, 84, 84, { color: "#22D3EE", opacity: 0.4, z: 12 }),
      deco("Grid Floor", "zigzag", 168, 156, 230, 42, { color: "#22D3EE", opacity: 0.28, z: 14 }),
      ...platform("#22D3EE"),
      vignette(0.26),
    ],
  },
  {
    id: "velvet-luxe",
    name: "Velvet Luxe",
    category: "Night",
    accent: "#FBBF24",
    background: grad("#1A1206", "#33240C", "#4A3412"),
    elements: [
      ...halo("#FBBF24", 0.38),
      deco("Gold Ring", "ring", 244, 18, 128, 128, { color: "#FBBF24", opacity: 0.34, z: 12 }),
      deco("Laurel Left", "leaf-cluster", -32, 62, 92, 108, { color: "#D97706", opacity: 0.28, z: 10, rotation: -16 }),
      deco("Laurel Right", "leaf-cluster", 336, 60, 90, 106, { color: "#D97706", opacity: 0.28, z: 10, rotation: 16 }),
      deco("Rays", "light-ray", 240, -48, 136, 186, { color: "#FDE68A", opacity: 0.3, z: 6 }),
      ...stage("#B45309"),
      ...sparkles("#FBBF24"),
      vignette(0.24),
    ],
  },
];
