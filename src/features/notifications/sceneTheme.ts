/**
 * features/notifications/sceneTheme.ts — Recolours a design's CONTENT to match
 * an applied scene.
 *
 * Applying a scene used to swap the background and the decoration art but leave
 * the heading, badge and CTA in whatever palette the template shipped with, so
 * a violet "Shop Now" button sat on a sage or slate banner and nothing looked
 * related. This derives a small palette from the scene's own accent and the
 * lightness of its background, then walks the content tree applying it.
 *
 * Only colour is touched. Text, sizes, positions, animations and interactions
 * are left exactly as they were.
 */

import type { Background, CompositionNode, Gradient, NodeStyle } from "./types";
import type { Scene } from "./scenes";

/**
 * Which way the copy should go. "auto" measures the backdrop and picks the
 * higher-contrast option, which is right almost always — but a shopkeeper who
 * wants light copy on a mid-tone scene for the look of it can say so.
 */
export type CopyTone = "auto" | "light" | "dark";

export interface ScenePalette {
  /** Buttons, standalone icons, badge text. */
  accent: string;
  /** Second stop of a button gradient. */
  accentDark: string;
  /** Headings and body copy. */
  ink: string;
  /** Text and icons sitting ON the accent. */
  onAccent: string;
  /** Chip / card surface (badges, stock pills). */
  surface: string;
  /** Text and icons sitting ON that surface. */
  onSurface: string;
  /** True when the background is dark enough to need light copy. */
  dark: boolean;
}

// ── colour maths ─────────────────────────────────────────────────────────────

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB | null {
  const m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const rgbToHex = ([r, g, b]: RGB) =>
  `#${[r, g, b].map((c) => clamp(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase();

/** WCAG relative luminance, 0 (black) – 1 (white). */
function luminance(rgb: RGB): number {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const darken = (rgb: RGB, amount: number): RGB => rgb.map((c) => c * (1 - amount)) as RGB;
const lighten = (rgb: RGB, amount: number): RGB => rgb.map((c) => c + (255 - c) * amount) as RGB;

const WHITE: RGB = [255, 255, 255];
const NEAR_BLACK: RGB = [17, 24, 39];

/** The alpha already on a colour, so a muted subheading stays muted. */
function alphaOf(color: string | undefined): number {
  if (!color) return 1;
  const m = /rgba?\([^)]*,\s*([\d.]+)\s*\)/.exec(color);
  return m ? Number(m[1]) : 1;
}

function withAlpha(hex: string, alpha: number): string {
  if (alpha >= 1) return hex;
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

const CANVAS_W = 400;
const CANVAS_H = 200;

/** Where the template's copy sits — the region the ink actually has to survive. */
const COPY_ZONE = { x: 22, y: 22, w: 198, h: 156 };

function mixRgb(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** The background's colour at one point, honouring gradient direction. */
function backgroundAt(bg: Background | undefined, x: number, y: number): RGB {
  if (bg?.type === "GRADIENT" && bg.gradient?.stops.length) {
    const stops = bg.gradient.stops
      .map((s) => ({ offset: s.offset, rgb: hexToRgb(s.color) }))
      .filter((s): s is { offset: number; rgb: RGB } => !!s.rgb)
      .sort((a, b) => a.offset - b.offset);
    if (!stops.length) return WHITE;
    let t: number;
    if (bg.gradient.type === "RADIAL") {
      const dx = x - CANVAS_W / 2;
      const dy = y - CANVAS_H / 2;
      t = Math.hypot(dx, dy) / Math.hypot(CANVAS_W / 2, CANVAS_H / 2);
    } else {
      // CSS gradient angles run clockwise from "to top".
      const rad = ((bg.gradient.angle ?? 160) - 90) * (Math.PI / 180);
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);
      const span = Math.abs(CANVAS_W * dx) + Math.abs(CANVAS_H * dy);
      t = 0.5 + ((x - CANVAS_W / 2) * dx + (y - CANVAS_H / 2) * dy) / (span || 1);
    }
    t = Math.max(0, Math.min(1, t));
    let lo = stops[0];
    let hi = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (t >= stops[i].offset && t <= stops[i + 1].offset) { lo = stops[i]; hi = stops[i + 1]; }
    }
    const span = hi.offset - lo.offset;
    return mixRgb(lo.rgb, hi.rgb, span ? (t - lo.offset) / span : 0);
  }
  // An image background is unknowable here; assume light, as the templates do.
  return (bg?.color ? hexToRgb(bg.color) : null) ?? WHITE;
}

/**
 * Roughly how much of its own bounding box each asset actually paints.
 *
 * Decoration art is mostly transparent inside its box — a sparkle's viewBox
 * dwarfs its star, a chevron has gaps between strokes — so treating the frame
 * as solid would massively overstate how much it darkens the copy behind it.
 * These are estimates, deliberately conservative.
 */
const COVERAGE: Record<string, number> = {
  glow: 0.3, "product-glow": 0.3, spotlight: 0.3, "radial-light": 0.3,
  "gradient-orb": 0.45, "product-shadow": 0.4, "soft-shadow": 0.4,
  particles: 0.15, dots: 0.2, confetti: 0.2, sparkle: 0.15, star: 0.25,
  "dashed-line": 0.3, zigzag: 0.25, mist: 0.5, "cloud-soft": 0.5,
};
const DEFAULT_COVERAGE = 0.45;

/** Vignette is a fixed dark radial in the renderer, strongest at the edges. */
const VIGNETTE_RGB: RGB = [15, 23, 42];

/**
 * The colour the copy column ends up sitting on: the canvas background with
 * every overlapping decoration composited over it in z order.
 *
 * Sampling the raw gradient alone is what made this wrong — a scene can ship a
 * pale gradient and then lay saturated artwork right across the headline, so
 * the gradient says "light" while the pixels behind the text say otherwise.
 */
function copyBackdrop(scene: Pick<Scene, "background" | "elements">): RGB {
  const layers = [...scene.elements].sort(
    (a, b) => (a.frame.zIndex ?? 0) - (b.frame.zIndex ?? 0),
  );
  const samples: RGB[] = [];
  for (let sx = 0; sx < 5; sx++) {
    for (let sy = 0; sy < 5; sy++) {
      const x = COPY_ZONE.x + (COPY_ZONE.w * (sx + 0.5)) / 5;
      const y = COPY_ZONE.y + (COPY_ZONE.h * (sy + 0.5)) / 5;
      let px = backgroundAt(scene.background, x, y);
      for (const n of layers) {
        if (n.visible === false) continue;
        const f = n.frame;
        if (x < f.x || x > f.x + f.width || y < f.y || y > f.y + f.height) continue;
        const assetId = n.asset?.assetId ?? "";
        const opacity = n.style?.opacity ?? 1;
        if (assetId === "vignette") {
          // Darkest at the canvas edge, transparent through the middle.
          const edge = Math.min(x / CANVAS_W, 1 - x / CANVAS_W, y / CANVAS_H, 1 - y / CANVAS_H) * 2;
          px = mixRgb(px, VIGNETTE_RGB, opacity * 0.32 * Math.max(0, 1 - edge));
          continue;
        }
        const rgb = n.style?.color ? hexToRgb(n.style.color) : null;
        if (!rgb) continue;
        px = mixRgb(px, rgb, Math.min(1, opacity * (COVERAGE[assetId] ?? DEFAULT_COVERAGE)));
      }
      samples.push(px);
    }
  }
  return samples[0].map((_, i) => samples.reduce((s, c) => s + c[i], 0) / samples.length) as RGB;
}

// ── palette ──────────────────────────────────────────────────────────────────

/**
 * Builds the content palette for a scene.
 *
 * The scene's accent is an ART colour — it is used at 15–40% opacity behind
 * everything else, so it is often far too pale to survive as a solid button
 * (Atelier White's accent is a light warm grey). It is therefore pushed until
 * a label actually reads on it, rather than trusted as-is.
 */
export function paletteFor(
  scene: Pick<Scene, "accent" | "background" | "elements">,
  tone: CopyTone = "auto",
): ScenePalette {
  const base = hexToRgb(scene.accent) ?? [91, 71, 212];
  const backdrop = copyBackdrop(scene);

  // Light or dark ink is decided by MEASURING both against the real backdrop,
  // not by a luminance threshold. A saturated mid-tone can be too dark for
  // black and too light for white; whichever wins by contrast is the answer.
  // `tone` overrides that when the shopkeeper wants a specific look.
  const darkCandidate = darken(base, 0.68);
  const lightCandidate = lighten(base, 0.86);
  const dark =
    tone === "light" ? true
    : tone === "dark" ? false
    : contrast(lightCandidate, backdrop) > contrast(darkCandidate, backdrop);

  // Push the accent until its label reads. The CTA label is 11px bold, so it
  // needs a true 4.5:1 — 3:1 is only enough for large text.
  let accent = base;
  let guard = 0;
  if (!dark) {
    // Every template puts white on the accent, so darken until white works
    // rather than flipping the label to dark and breaking the house style.
    while (contrast(accent, WHITE) < 4.5 && guard++ < 24) accent = darken(accent, 0.08);
  } else {
    // On a dark banner the accent has to separate from the BACKDROP, and carry
    // a dark label. Lightening serves both, so drive it until both are met.
    while ((contrast(accent, backdrop) < 2.4 || contrast(accent, NEAR_BLACK) < 4.6) && guard++ < 24) {
      accent = lighten(accent, 0.1);
    }
  }

  const onAccent =
    contrast(accent, WHITE) >= 4.5 ? "#FFFFFF"
    : contrast(accent, NEAR_BLACK) >= 4.5 ? "#111827"
    : contrast(accent, WHITE) >= contrast(accent, NEAR_BLACK) ? "#FFFFFF"
    : "#111827";

  // Ink keeps a trace of the accent hue so the copy belongs to the scene, then
  // is pushed until it clears 7:1 on what it actually sits on.
  let ink: RGB = dark ? lightCandidate : darkCandidate;
  guard = 0;
  while (contrast(ink, backdrop) < 7 && guard++ < 24) ink = dark ? lighten(ink, 0.1) : darken(ink, 0.1);

  return {
    accent: rgbToHex(accent),
    accentDark: rgbToHex(darken(accent, 0.24)),
    ink: rgbToHex(ink),
    onAccent,
    surface: dark ? "rgba(255, 255, 255, 0.14)" : "#FFFFFF",
    onSurface: dark ? rgbToHex(lighten(accent, 0.55)) : rgbToHex(accent),
    dark,
  };
}

// ── retint ───────────────────────────────────────────────────────────────────

/** Where a node sits, which decides what its text may be coloured. */
type Surface = "canvas" | "accent" | "chip";

const TEXTY = new Set(["TEXT", "VARIABLE_TEXT", "PRICE", "DISCOUNT", "STOCK", "LABEL", "BADGE"]);
const CONTAINERY = new Set(["CONTAINER", "GROUP", "BADGE", "LABEL"]);

/** A near-white fill is a chip surface; anything else is deliberate art. */
function isLightFill(color: string | undefined): boolean {
  const rgb = color ? hexToRgb(color) : null;
  return !!rgb && luminance(rgb) > 0.75;
}

function accentGradient(existing: Gradient, p: ScenePalette): Gradient {
  return {
    ...existing,
    stops: [
      { offset: 0, color: p.accent },
      { offset: 1, color: p.accentDark },
    ],
  };
}

function foreground(p: ScenePalette, on: Surface, original: string | undefined): string {
  const alpha = alphaOf(original);
  if (on === "accent") return withAlpha(p.onAccent, alpha);
  if (on === "chip") return withAlpha(p.onSurface, alpha);
  return withAlpha(p.ink, alpha);
}

function retintNode(node: CompositionNode, p: ScenePalette, on: Surface): CompositionNode {
  // Scene art is the scene's own business, and a photo must never be tinted.
  if (node.type === "DECORATION" || node.type === "PARTICLES" || node.type === "PRODUCT_IMAGE" || node.type === "IMAGE") {
    return node;
  }

  const style: NodeStyle = { ...node.style };
  let childSurface: Surface = on;

  if (node.type === "BUTTON") {
    if (style.backgroundGradient) style.backgroundGradient = accentGradient(style.backgroundGradient, p);
    else style.backgroundColor = p.accent;
    if (style.shadow?.color) style.shadow = { ...style.shadow, color: withAlpha(p.accent, alphaOf(style.shadow.color) || 0.5) };
    if (style.border?.color) style.border = { ...style.border, color: withAlpha(p.accent, alphaOf(style.border.color)) };
    if (style.color) style.color = foreground(p, "accent", style.color);
    childSurface = "accent";
  } else if (CONTAINERY.has(node.type)) {
    if (style.backgroundGradient) {
      style.backgroundGradient = accentGradient(style.backgroundGradient, p);
      childSurface = "accent";
    } else if (isLightFill(style.backgroundColor)) {
      style.backgroundColor = p.surface;
      childSurface = "chip";
    }
    if (style.shadow?.color) style.shadow = { ...style.shadow, color: withAlpha(p.ink, alphaOf(style.shadow.color) || 0.18) };
    if (style.border?.color) style.border = { ...style.border, color: withAlpha(p.accent, alphaOf(style.border.color)) };
    if (style.color) style.color = foreground(p, childSurface, style.color);
  } else if (node.type === "ICON") {
    // A standalone icon is an accent mark; inside a button or chip it inherits.
    style.color = on === "canvas" ? withAlpha(p.accent, alphaOf(style.color)) : foreground(p, on, style.color);
  } else if (TEXTY.has(node.type)) {
    style.color = foreground(p, on, style.color);
    if (style.textShadow?.color) {
      style.textShadow = { ...style.textShadow, color: withAlpha(p.ink, alphaOf(style.textShadow.color)) };
    }
  }

  return {
    ...node,
    style,
    ...(node.children ? { children: node.children.map((c) => retintNode(c, p, childSurface)) } : {}),
  };
}

/** Recolours a content tree to a scene's palette. Non-content nodes pass through. */
export function retintForScene(nodes: CompositionNode[], p: ScenePalette): CompositionNode[] {
  return nodes.map((n) => retintNode(n, p, "canvas"));
}

/**
 * Recovers the accent a live scene group was built from. Scenes tint their
 * pedestal/platform with it, so that node is the reliable signal — needed when
 * the shopkeeper has customised a scene and it no longer matches a preset.
 */
export function accentOfSceneGroup(children: CompositionNode[] | undefined, fallback = "#5B47D4"): string {
  if (!children?.length) return fallback;
  const staged = children.find((n) => n.id === "scn-pedestal" || n.id === "scn-platform");
  if (staged?.style?.color) return staged.style.color;
  // Otherwise the most opaque tinted layer is the closest thing to a theme.
  const tinted = children
    .filter((n) => !!n.style?.color && n.style.color !== "#FFFFFF")
    .sort((a, b) => (b.style?.opacity ?? 1) - (a.style?.opacity ?? 1));
  return tinted[0]?.style?.color ?? fallback;
}

/** The design-level colour tokens, kept in step with the applied scene. */
export function tokensFor(p: ScenePalette): Record<string, string> {
  return { accent: p.accent, ink: p.ink, muted: withAlpha(p.ink, 0.64), onBrand: p.onAccent };
}
