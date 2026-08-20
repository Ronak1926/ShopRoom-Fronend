/**
 * features/notifications/types.ts — Frontend mirror of the v2 NotificationDesign
 * composition schema (backend is the validating source of truth). These types
 * describe the shape the renderer consumes and the editor mutates.
 */

export interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  zIndex?: number;
}

export interface GradientStop {
  offset: number;
  color: string;
}
export interface Gradient {
  type?: "LINEAR" | "RADIAL";
  angle?: number;
  stops: GradientStop[];
}
export interface Shadow {
  enabled?: boolean;
  x?: number;
  y?: number;
  blur?: number;
  spread?: number;
  color?: string;
  inset?: boolean;
}
export interface Border {
  width?: number;
  color?: string;
  style?: "solid" | "dashed" | "dotted";
}

export interface Background {
  type?: "SOLID" | "GRADIENT" | "IMAGE" | "PATTERN" | "NONE";
  color?: string;
  gradient?: Gradient;
  imageUrl?: string;
  opacity?: number;
}

export interface NodeStyle {
  color?: string;
  backgroundColor?: string;
  backgroundGradient?: Gradient;
  opacity?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  fontStyle?: "normal" | "italic";
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "center" | "right" | "justify";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";
  whiteSpace?: "normal" | "nowrap";
  verticalAlign?: "top" | "center" | "bottom";
  overflow?: "visible" | "hidden" | "clip" | "ellipsis";
  textShadow?: Shadow;
  borderRadius?: number;
  border?: Border;
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  shadow?: Shadow;
  glow?: { enabled?: boolean; color?: string; blur?: number; opacity?: number };
  blur?: number;
  backdropBlur?: number;
  clipShape?:
    | "pill" | "circle" | "hexagon" | "diamond" | "shield" | "star" | "burst"
    | "rectangle" | "rounded" | "ellipse" | "blob";
}

export interface Layout {
  position?: "absolute" | "relative";
  overflow?: "visible" | "hidden";
  direction?: "row" | "column";
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
}

export interface ElementContent {
  text?: string;
  source?: "STATIC" | "DYNAMIC";
  variable?: string;
  label?: string;
  icon?: string;
  iconPosition?: "left" | "right" | "only" | "none";
  iconSize?: number;
  value?: string | number;
}

export interface ImageCrop {
  /** Fractions (0–1) of the image's natural size — the visible sub-rect. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageFilters {
  /** CSS filter multipliers/degrees. Neutral values: 1, 1, 1, 0, 0. */
  brightness?: number;
  contrast?: number;
  saturate?: number;
  hueRotate?: number;
  grayscale?: number;
}

export interface ImageOverlay {
  color?: string;
  gradient?: Gradient;
  opacity?: number;
  blendMode?: "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten";
}

export interface ImageConfig {
  fit?: "cover" | "contain" | "fill" | "none";
  position?: "center" | "top" | "bottom" | "left" | "right";
  opacity?: number;
  borderRadius?: number;
  /** Non-destructive crop rect — when set, takes precedence over fit/position. */
  crop?: ImageCrop;
  filters?: ImageFilters;
  overlay?: ImageOverlay;
}

export interface AssetRef {
  type?: "SVG" | "IMAGE" | "LOTTIE";
  assetId?: string;
  url?: string;
  naturalWidth?: number;
  naturalHeight?: number;
  attribution?: {
    photographer?: string;
    photographerUrl?: string;
    provider?: "PEXELS" | "UNSPLASH";
  };
}

export interface ElementAction {
  type: string;
  target?: string;
  url?: string;
}

export interface AnimStep {
  type: string;
  durationMs?: number;
  delayMs?: number;
  easing?: string;
  intensity?: number;
  repeat?: number | "infinite";
}
export interface Animation {
  entry?: AnimStep;
  attention?: AnimStep;
  exit?: AnimStep | null;
}

export interface CompositionNode {
  id: string;
  type: string;
  /** Human label shown in Layers (e.g. "Leaf Left"). Falls back to the type. */
  name?: string;
  frame: Frame;
  layout?: Layout;
  style?: NodeStyle;
  content?: ElementContent;
  image?: ImageConfig;
  asset?: AssetRef;
  animation?: Animation;
  interaction?: { onClick?: ElementAction };
  visible?: boolean;
  locked?: boolean;
  children?: CompositionNode[];
}

export interface NotificationDesign {
  schemaVersion: number;
  id: string;
  name: string;
  category: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  designTokens?: Record<string, unknown>;
  canvas: { width: number; height: number; background: Background };
  elements: CompositionNode[];
  /** Total playback duration (ms) for the Timeline's Play/scrub control. */
  timeline?: { durationMs: number };
  metadata: { createdAt: string; updatedAt: string; source: string };
}

/** Server row shape returned by the design endpoints. */
export interface DesignRecord {
  id: string;
  name: string;
  status: string;
  version: number;
  designJson: NotificationDesign;
  updatedAt: string;
}

export type RenderContext = Record<string, Record<string, string | number | null | undefined>>;
