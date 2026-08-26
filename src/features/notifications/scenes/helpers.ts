/**
 * features/notifications/scenes/helpers.ts — Shared primitives every scene file
 * composes with. Data only, no React.
 *
 * A "scene" is the editable background composition of a notification: a canvas
 * background plus layered DECORATION nodes, composed in depth bands —
 * atmosphere (z0–9) → far motif (z10–19) → near motif (z20–29) → product
 * environment (z30–49) → foreground sparkle/vignette (z100+) — so the result
 * reads like an illustration, not a flat tint.
 *
 * THE ONE RULE: every decoration must have its CENTRE inside the canvas. Art
 * may bleed past an edge — that bleed is what makes it read as a frame — but a
 * layer whose centre falls outside can't be seen or grabbed on the banner while
 * still being listed in Layers, so clicking its row throws the selection
 * handles out into empty space beside the artboard.
 */

import type { Background, CompositionNode } from "../types";

/** The notification banner scenes are composed for — Android's 2:1 big picture. */
export const CANVAS_W = 400;
export const CANVAS_H = 200;

/**
 * Centre of the right-hand product zone every ShopRoom template leaves free.
 * Scene artwork frames the product and the left-hand text column (x 22–220);
 * it never takes them over.
 */
export const VISUAL_CX = 306;

export interface DecoOpts {
  color?: string;
  opacity?: number;
  z?: number;
  rotation?: number;
  blur?: number;
}

/**
 * `name` doubles as the Layers label (e.g. "Leaf Left") AND seeds the node id,
 * so names must be unique within a scene or two layers collide.
 */
export function deco(
  name: string,
  assetId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  o: DecoOpts = {},
): CompositionNode {
  return {
    id: `scn-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    type: "DECORATION",
    name,
    asset: { type: "SVG", assetId },
    frame: { x, y, width: w, height: h, rotation: o.rotation ?? 0, zIndex: o.z ?? 10 },
    style: {
      ...(o.color ? { color: o.color } : {}),
      ...(o.opacity != null ? { opacity: o.opacity } : {}),
      ...(o.blur != null ? { blur: o.blur } : {}),
    },
    visible: true,
    locked: false,
  };
}

// ── backgrounds ──────────────────────────────────────────────────────────────

/** Three-stop linear wash — the house style for scene backgrounds. */
export function grad(from: string, mid: string, to: string, angle = 172): Background {
  return {
    type: "GRADIENT",
    gradient: {
      type: "LINEAR",
      angle,
      stops: [{ offset: 0, color: from }, { offset: 0.55, color: mid }, { offset: 1, color: to }],
    },
  };
}

/** Two-stop linear, for scenes that want a cleaner sweep. */
export function duo(from: string, to: string, angle = 160): Background {
  return {
    type: "GRADIENT",
    gradient: { type: "LINEAR", angle, stops: [{ offset: 0, color: from }, { offset: 1, color: to }] },
  };
}

/** Radial wash — brightest in the middle, where the product sits. */
export function rad(from: string, to: string): Background {
  return {
    type: "GRADIENT",
    gradient: { type: "RADIAL", stops: [{ offset: 0, color: from }, { offset: 1, color: to }] },
  };
}

// ── composition passes ───────────────────────────────────────────────────────

/** Atmosphere shared by many scenes: two soft corner glows for depth. */
export function atmosphere(a: string, b: string): CompositionNode[] {
  return [
    deco("Glow Top", "glow", -58, -74, 210, 210, { color: a, opacity: 0.55, z: 2 }),
    deco("Glow Bottom", "glow", 232, 62, 210, 210, { color: b, opacity: 0.4, z: 2 }),
  ];
}

/**
 * Product environment: soft light, contact shadow and a 3D podium. `baseY` is
 * tuned so the podium's top edge meets the bottom of the template's product
 * image slot (which ends at y=144) — the product stands on it rather than
 * floating above it.
 */
export function stage(color: string, cx = VISUAL_CX, baseY = 164): CompositionNode[] {
  return [
    deco("Product Glow", "product-glow", cx - 62, baseY - 104, 124, 124, { color, opacity: 0.45, z: 30 }),
    deco("Product Shadow", "product-shadow", cx - 38, baseY - 4, 76, 16, { z: 32, opacity: 0.5 }),
    deco("Pedestal", "pedestal", cx - 52, baseY - 14, 104, 32, { color, opacity: 0.92, z: 34 }),
  ];
}

/** Flat-lit alternative to stage(): a wide platform, no podium block. */
export function platform(color: string, cx = VISUAL_CX, baseY = 168): CompositionNode[] {
  return [
    deco("Stage Light", "product-glow", cx - 68, baseY - 116, 136, 136, { color, opacity: 0.4, z: 30 }),
    deco("Platform", "platform", cx - 66, baseY - 18, 132, 34, { color, opacity: 0.45, z: 32 }),
  ];
}

export const sparkles = (color: string): CompositionNode[] => [
  deco("Sparkle 1", "sparkle", 232, 26, 16, 16, { color: "#FFFFFF", opacity: 0.95, z: 110 }),
  deco("Sparkle 2", "sparkle", 366, 142, 13, 13, { color, opacity: 0.85, z: 110 }),
  deco("Sparkle 3", "sparkle", 356, 40, 10, 10, { color: "#FFFFFF", opacity: 0.75, z: 110 }),
];

/**
 * Full-canvas edge darkening. It MUST cover the canvas exactly — a vignette
 * narrower than the canvas darkens only part of it and leaves a hard vertical
 * seam where it stops, which reads as a shadow across one side of the banner.
 */
export const vignette = (opacity: number): CompositionNode =>
  deco("Vignette", "vignette", 0, 0, CANVAS_W, CANVAS_H, { opacity, z: 120 });

/** One broad halo behind the product, for scenes with no podium. */
export function halo(color: string, opacity = 0.42, cx = VISUAL_CX, cy = 96): CompositionNode[] {
  return [deco("Halo", "glow", cx - 100, cy - 100, 200, 200, { color, opacity, z: 4 })];
}

/** `[x, y, size]` triples, so a scatter reads as coordinates at the call site. */
export type Point = [number, number, number];

/**
 * Repeats one asset across the banner. Names are numbered from `name`, which
 * keeps every generated node id unique inside its scene.
 */
export function scatter(name: string, assetId: string, points: Point[], o: DecoOpts = {}): CompositionNode[] {
  return points.map(([x, y, size], i) => deco(`${name} ${i + 1}`, assetId, x, y, size, size, o));
}

/** Same as scatter(), but each point may set its own width and height. */
export function spread(
  name: string,
  assetId: string,
  boxes: [number, number, number, number][],
  o: DecoOpts = {},
): CompositionNode[] {
  return boxes.map(([x, y, w, h], i) => deco(`${name} ${i + 1}`, assetId, x, y, w, h, o));
}
