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
  Shadow,
} from "@/features/notifications/types";

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

  if (s.backgroundGradient) st.background = gradientCss(s.backgroundGradient);
  else if (s.backgroundColor) st.background = s.backgroundColor;
  if (s.borderRadius != null) st.borderRadius = s.borderRadius;
  if (s.border) st.border = `${s.border.width ?? 1}px ${s.border.style ?? "solid"} ${s.border.color ?? "rgba(255,255,255,0.3)"}`;
  if (s.shadow?.enabled) st.boxShadow = shadowCss(s.shadow);
  if (s.opacity != null) st.opacity = s.opacity;
  if (s.blur) st.filter = `blur(${s.blur}px)`;
  if (s.backdropBlur) {
    st.backdropFilter = `blur(${s.backdropBlur}px)`;
    (st as Record<string, string>).WebkitBackdropFilter = `blur(${s.backdropBlur}px)`;
  }
  if (s.color) st.color = s.color;
  if (s.fontSize) st.fontSize = s.fontSize;
  if (s.fontWeight) st.fontWeight = s.fontWeight;
  if (s.letterSpacing) st.letterSpacing = s.letterSpacing;
  if (s.textTransform) st.textTransform = s.textTransform;
  if (s.textAlign) st.textAlign = s.textAlign;
  if (s.lineHeight) st.lineHeight = s.lineHeight;
  const pad = padValue(node.layout?.padding ?? s.padding);
  if (pad) st.padding = pad;
  if (node.layout?.overflow) st.overflow = node.layout.overflow;
  return st;
}
