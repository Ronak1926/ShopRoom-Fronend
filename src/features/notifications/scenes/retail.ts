/**
 * features/notifications/scenes/retail.ts — Sale and shop-floor motifs:
 * price tags, tickets, bursts and urgency. Loud on the right, clear on the
 * left where the discount copy goes.
 */

import type { Scene } from "./types";
import { atmosphere, deco, duo, grad, halo, platform, scatter, sparkles, spread, stage, vignette } from "./helpers";

export const RETAIL_SCENES: Scene[] = [
  {
    id: "price-drop",
    name: "Price Drop",
    category: "Sale",
    accent: "#DC2626",
    background: grad("#FBD5D5", "#FDE9E9", "#FFF8F8"),
    elements: [
      ...atmosphere("#DC2626", "#FCA5A5"),
      deco("Tag Large", "price-tag", 300, 22, 96, 96, { color: "#DC2626", opacity: 0.32, z: 12, rotation: -14 }),
      deco("Tag Small", "price-tag", 214, 128, 62, 62, { color: "#EF4444", opacity: 0.26, z: 12, rotation: 18 }),
      ...spread("Arrow Down", "arrow-block", [[-22, 74, 68, 44], [34, 118, 56, 38]], {
        color: "#DC2626",
        opacity: 0.2,
        z: 10,
        rotation: 90,
      }),
      ...stage("#DC2626"),
      ...sparkles("#F87171"),
      vignette(0.3),
    ],
  },
  {
    id: "coupon-book",
    name: "Coupon Book",
    category: "Retail",
    accent: "#D97706",
    background: grad("#FDEBD2", "#FEF5E8", "#FFFCF7"),
    elements: [
      ...halo("#D97706", 0.32),
      ...spread(
        "Ticket",
        "ticket",
        [[236, 18, 152, 66], [252, 96, 136, 60]],
        { color: "#D97706", opacity: 0.26, z: 12, rotation: -6 },
      ),
      deco("Perforation", "dashed-line", 30, 96, 170, 8, { color: "#B45309", opacity: 0.24, z: 14 }),
      deco("Ticket Left", "ticket", -34, 122, 132, 58, { color: "#F59E0B", opacity: 0.22, z: 12, rotation: 10 }),
      ...platform("#D97706"),
      ...sparkles("#F59E0B"),
      vignette(0.24),
    ],
  },
  {
    id: "flash-countdown",
    name: "Flash Countdown",
    category: "Sale",
    accent: "#EA580C",
    background: grad("#FCD9C4", "#FDEDE2", "#FFFAF7"),
    elements: [
      ...atmosphere("#EA580C", "#FDBA74"),
      deco("Burst Back", "sale-burst", 236, -6, 132, 132, { color: "#EA580C", opacity: 0.22, z: 6 }),
      ...scatter("Bolt", "lightning", [[212, 22, 42], [356, 96, 36]], {
        color: "#FBBF24",
        opacity: 0.9,
        z: 26,
        rotation: 10,
      }),
      deco("Speed Lines", "zigzag", -22, 142, 210, 40, { color: "#EA580C", opacity: 0.2, z: 14 }),
      ...stage("#EA580C"),
      ...sparkles("#FB923C"),
      vignette(0.32),
    ],
  },
  {
    id: "clearance-rush",
    name: "Clearance Rush",
    category: "Sale",
    accent: "#BE123C",
    background: duo("#FBC7D4", "#FFF6F8", 150),
    elements: [
      ...halo("#BE123C", 0.34),
      deco("Burst", "sale-burst", 252, 26, 116, 116, { color: "#BE123C", opacity: 0.24, z: 8 }),
      ...spread("Ribbon", "ribbon", [[-32, 52, 126, 56], [-20, 122, 116, 52]], {
        color: "#E11D48",
        opacity: 0.28,
        z: 12,
        rotation: -12,
      }),
      deco("Tag", "price-tag", 196, 132, 60, 60, { color: "#BE123C", opacity: 0.3, z: 16, rotation: 12 }),
      ...stage("#BE123C"),
      ...sparkles("#FB7185"),
      vignette(0.3),
    ],
  },
  {
    id: "shelf-fresh",
    name: "Shelf Fresh",
    category: "Retail",
    accent: "#059669",
    background: grad("#D7EEDF", "#EDF8F1", "#FAFDFC"),
    elements: [
      ...halo("#059669", 0.3),
      ...spread(
        "Shelf",
        "platform",
        [[204, 62, 196, 22], [220, 128, 180, 20]],
        { color: "#047857", opacity: 0.2, z: 10 },
      ),
      deco("Crate Left", "squircle", -30, 96, 92, 92, { color: "#059669", opacity: 0.16, z: 10 }),
      deco("Leaf Accent", "leaf-sprig", 202, -14, 68, 88, { color: "#047857", opacity: 0.24, z: 12, rotation: 20 }),
      ...stage("#059669"),
      ...sparkles("#34D399"),
      vignette(0.24),
    ],
  },
  {
    id: "loyalty-reward",
    name: "Loyalty Reward",
    category: "Retail",
    accent: "#6D28D9",
    background: grad("#E6DCF9", "#F3EDFD", "#FBF9FF"),
    elements: [
      ...atmosphere("#6D28D9", "#C4B5FD"),
      deco("Shield", "shield-shape", 258, 22, 100, 116, { color: "#6D28D9", opacity: 0.24, z: 12 }),
      ...scatter("Reward Star", "star", [[212, 30, 30], [368, 60, 24], [232, 150, 22]], {
        color: "#FBBF24",
        opacity: 0.85,
        z: 26,
      }),
      deco("Progress Track", "dashed-line", 22, 168, 176, 8, { color: "#6D28D9", opacity: 0.24, z: 16 }),
      ...platform("#6D28D9"),
      ...sparkles("#A855F7"),
      vignette(0.28),
    ],
  },
];
