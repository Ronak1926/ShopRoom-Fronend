/**
 * components/notifications/nodeStyle.ts — Builds CSS for a composition node.
 * A canvas renderer positions every node by dynamic per-node geometry, so
 * inline styles are the only option here (the documented editor exception).
 */

import type { CSSProperties } from "react";
import type {
  Background,
  CompositionNode,
  Gradient,
  Layout,
  NodeStyle,
  Shadow,
} from "@/features/notifications/types";
import { resolveFontFamily } from "@/features/notifications/fonts";

export function gradientCss(g: Gradient): string {
  const stops = g.stops.map((s) => `${s.color} ${Math.round(s.offset * 100)}%`).join(", ");
  return g.type === "RADIAL"
    ? `radial-gradient(circle, ${stops})`
    : `linear-gradient(${g.angle ?? 160}deg, ${stops})`;
}

export function backgroundCss(bg?: Background): string {
  if (bg?.type === "GRADIENT" && bg.gradient) return gradientCss(bg.gradient);
  if (bg?.color) return bg.color;
  return "#FFFFFF";
}

function shadowCss(sh: Shadow): string {
  return `${sh.inset ? "inset " : ""}${sh.x ?? 0}px ${sh.y ?? 8}px ${sh.blur ?? 24}px ${sh.spread ?? 0}px ${sh.color ?? "rgba(15,23,42,0.14)"}`;
}

// CSS text-shadow has no spread channel, so a text shadow only carries x/y/blur/color.
function textShadowCss(sh: Shadow): string {
  return `${sh.x ?? 0}px ${sh.y ?? 8}px ${sh.blur ?? 24}px ${sh.color ?? "rgba(15,23,42,0.14)"}`;
}

function glowCss(glow: NonNullable<NodeStyle["glow"]>): string {
  return `drop-shadow(0 0 ${glow.blur ?? 16}px ${withAlpha(glow.color ?? "#7C6AE8", glow.opacity ?? 0.6)})`;
}

/** Applies an opacity multiplier to a hex/rgb color, producing an rgba() string. */
function withAlpha(color: string, alpha: number): string {
  const hex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(color);
  if (!hex) return color;
  let h = hex[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function polygonCss(points: [number, number][]): string {
  return `polygon(${points.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(", ")})`;
}

/** N-pointed star/burst outline as percentage-space polygon points. */
function starPoints(spikes: number, outerR: number, innerR: number): [number, number][] {
  const pts: [number, number][] = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = -Math.PI / 2 + i * step;
    pts.push([50 + r * Math.cos(angle), 50 + r * Math.sin(angle)]);
  }
  return pts;
}

const HEXAGON = polygonCss([[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]]);
const DIAMOND = polygonCss([[50, 0], [100, 50], [50, 100], [0, 50]]);
const SHIELD = polygonCss([[50, 0], [100, 18], [100, 58], [50, 100], [0, 58], [0, 18]]);
const STAR = polygonCss(starPoints(5, 50, 20));
const BURST = polygonCss(starPoints(10, 50, 41));

/** Resolves a badge/label `clipShape` to CSS (clip-path for geometric shapes; a plain border-radius for pill/circle). */
function shapeCss(shape: NonNullable<NodeStyle["clipShape"]>): { clipPath?: string; borderRadius?: number | string } {
  switch (shape) {
    case "circle":
      return { borderRadius: "50%" };
    case "hexagon":
      return { clipPath: HEXAGON };
    case "diamond":
      return { clipPath: DIAMOND };
    case "shield":
      return { clipPath: SHIELD };
    case "star":
      return { clipPath: STAR };
    case "burst":
      return { clipPath: BURST };
    case "pill":
    default:
      return { borderRadius: 9999 };
  }
}

type Pad = number | { top?: number; right?: number; bottom?: number; left?: number };
function padValue(p?: Pad): string | undefined {
  if (p == null) return undefined;
  if (typeof p === "number") return `${p}px`;
  return `${p.top ?? 0}px ${p.right ?? 0}px ${p.bottom ?? 0}px ${p.left ?? 0}px`;
}

const mapAxis = (a?: string) =>
  a === "start" ? "flex-start"
  : a === "end" ? "flex-end"
  : a === "between" ? "space-between"
  : a === "around" ? "space-around"
  : a === "stretch" ? "stretch"
  : "center";

export function flexStyle(layout: Layout): CSSProperties {
  return {
    display: "flex",
    flexDirection: layout.direction === "row" ? "row" : "column",
    alignItems: mapAxis(layout.align),
    justifyContent: mapAxis(layout.justify),
    gap: layout.gap != null ? layout.gap : undefined,
  };
}

/** Base positioning + visual style for a node (excludes flex/leaf layout). */
export function buildNodeStyle(node: CompositionNode, inFlow: boolean): CSSProperties {
  const f = node.frame;
  const s = node.style ?? {};
  const st: CSSProperties = {
    position: inFlow ? "relative" : "absolute",
    width: f.width,
    height: f.height,
    zIndex: f.zIndex ?? 0,
    boxSizing: "border-box",
  };
  if (!inFlow) {
    st.left = f.x;
    st.top = f.y;
  }
  const tf: string[] = [];
  if (f.rotation) tf.push(`rotate(${f.rotation}deg)`);
  if (f.scaleX != null && f.scaleX !== 1) tf.push(`scaleX(${f.scaleX})`);
  if (f.scaleY != null && f.scaleY !== 1) tf.push(`scaleY(${f.scaleY})`);
  if (tf.length) st.transform = tf.join(" ");

  const isText = node.type === "TEXT";

  if (s.backgroundGradient) st.background = gradientCss(s.backgroundGradient);
  else if (s.backgroundColor) st.background = s.backgroundColor;
  if (s.borderRadius != null) st.borderRadius = s.borderRadius;
  // A shape badge/label's clipShape is the more specific intent, so it wins over
  // a plain borderRadius when both happen to be present.
  if (s.clipShape) {
    const shape = shapeCss(s.clipShape);
    if (shape.clipPath) st.clipPath = shape.clipPath;
    st.borderRadius = shape.borderRadius ?? st.borderRadius;
  }
  // A TEXT node's "Outline" effect strokes the glyphs themselves rather than
  // drawing a box border around the (usually invisible) bounding frame.
  if (s.border && isText) {
    (st as Record<string, string>).WebkitTextStroke = `${s.border.width ?? 1}px ${s.border.color ?? "rgba(255,255,255,0.3)"}`;
  } else if (s.border) {
    st.border = `${s.border.width ?? 1}px ${s.border.style ?? "solid"} ${s.border.color ?? "rgba(255,255,255,0.3)"}`;
  }
  if (s.shadow?.enabled) st.boxShadow = shadowCss(s.shadow);
  // A TEXT node's "Shadow" effect hugs its glyphs, so it's stored separately
  // (style.textShadow) from the box shadow used by every other node type.
  if (isText && s.textShadow?.enabled) st.textShadow = textShadowCss(s.textShadow);
  if (s.opacity != null) st.opacity = s.opacity;
  const filters: string[] = [];
  if (s.blur) filters.push(`blur(${s.blur}px)`);
  if (s.glow?.enabled) filters.push(glowCss(s.glow));
  if (filters.length) st.filter = filters.join(" ");
  if (s.backdropBlur) {
    st.backdropFilter = `blur(${s.backdropBlur}px)`;
    (st as Record<string, string>).WebkitBackdropFilter = `blur(${s.backdropBlur}px)`;
  }
  if (s.color) st.color = s.color;
  if (s.fontFamily) st.fontFamily = resolveFontFamily(s.fontFamily);
  if (s.fontSize) st.fontSize = s.fontSize;
  if (s.fontWeight) st.fontWeight = s.fontWeight;
  if (s.letterSpacing) st.letterSpacing = s.letterSpacing;
  if (s.textTransform) st.textTransform = s.textTransform;
  if (s.textAlign) st.textAlign = s.textAlign;
  if (s.lineHeight) st.lineHeight = s.lineHeight;
  if (s.whiteSpace) st.whiteSpace = s.whiteSpace;
  const pad = padValue(node.layout?.padding ?? s.padding);
  if (pad) st.padding = pad;
  if (node.layout?.overflow) st.overflow = node.layout.overflow;
  return st;
}

/** Vertical alignment for a leaf node's flex wrapper (defaults to "center", matching prior behaviour). */
export function verticalAlignItems(v?: NodeStyle["verticalAlign"]): CSSProperties["alignItems"] {
  return v === "top" ? "flex-start" : v === "bottom" ? "flex-end" : "center";
}

/** Overflow + text-overflow/white-space for a leaf node's text box (defaults to clipped, matching prior behaviour). */
export function leafOverflowStyle(s?: NodeStyle): Pick<CSSProperties, "overflow" | "textOverflow" | "whiteSpace"> {
  const overflow = s?.overflow ?? "hidden";
  if (overflow === "ellipsis") {
    return { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
  }
  return { overflow, whiteSpace: s?.whiteSpace };
}
