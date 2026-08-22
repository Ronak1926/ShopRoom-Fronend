/**
 * features/notifications/buttonPresets.ts — Static preset library for the
 * Buttons tool. Every preset is real node data (label/icon/style/size) fed
 * through createButtonFromPreset, so a preset card and the element it inserts
 * look identical (see ButtonThumb.tsx) — never a mockup.
 */

import type { NodeStyle } from "./types";

export type ButtonSize = "sm" | "md" | "lg";
export type IconPosition = "left" | "right" | "only" | "none";

export interface ButtonPreset {
  id: string;
  category: string;
  label: string;
  /** Text shown inside the button. */
  text: string;
  width: number;
  height: number;
  /** Container style (fill, radius, border, shadow). */
  style: NodeStyle;
  /** Label style (colour, size, weight). */
  textStyle: NodeStyle;
  icon?: string;
  iconPosition?: IconPosition;
}

const PALETTE = {
  purple: "#5B47D4",
  dark: "#0F172A",
  green: "#16A34A",
  red: "#EF4444",
  amber: "#F59E0B",
  blue: "#2563EB",
  white: "#FFFFFF",
};

function alphaColor(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lift(hex: string, alpha = 0.35): NonNullable<NodeStyle["shadow"]> {
  return { enabled: true, x: 0, y: 6, blur: 16, spread: -4, color: alphaColor(hex, alpha) };
}

const SIZES: Record<ButtonSize, { width: number; height: number; fontSize: number; radius: number; padX: number }> = {
  sm: { width: 132, height: 36, fontSize: 12, radius: 10, padX: 16 },
  md: { width: 180, height: 46, fontSize: 14, radius: 14, padX: 22 },
  lg: { width: 240, height: 54, fontSize: 15, radius: 16, padX: 28 },
};

/** Rough label width so a preset's frame never clips its own text. */
function fitWidth(text: string, size: ButtonSize, hasIcon: boolean): number {
  const s = SIZES[size];
  return Math.max(s.width, Math.round(text.length * s.fontSize * 0.62 + s.padX * 2 + (hasIcon ? s.fontSize + 10 : 0)));
}

function solid(color: string, size: ButtonSize = "md"): { style: NodeStyle; textStyle: NodeStyle } {
  const s = SIZES[size];
  return {
    style: { backgroundColor: color, borderRadius: s.radius, shadow: lift(color) },
    textStyle: { color: PALETTE.white, fontSize: s.fontSize, fontWeight: 700 },
  };
}

function pill(color: string, size: ButtonSize = "md"): { style: NodeStyle; textStyle: NodeStyle } {
  return {
    style: { backgroundColor: color, borderRadius: 9999, shadow: lift(color) },
    textStyle: { color: PALETTE.white, fontSize: SIZES[size].fontSize, fontWeight: 700 },
  };
}

function outline(color: string, size: ButtonSize = "md"): { style: NodeStyle; textStyle: NodeStyle } {
  const s = SIZES[size];
  return {
    style: { backgroundColor: "transparent", borderRadius: s.radius, border: { width: 1.5, color, style: "solid" } },
    textStyle: { color, fontSize: s.fontSize, fontWeight: 700 },
  };
}

function soft(color: string, size: ButtonSize = "md"): { style: NodeStyle; textStyle: NodeStyle } {
  const s = SIZES[size];
  return {
    style: { backgroundColor: alphaColor(color, 0.14), borderRadius: s.radius },
    textStyle: { color, fontSize: s.fontSize, fontWeight: 700 },
  };
}

function ghost(color: string, size: ButtonSize = "md"): { style: NodeStyle; textStyle: NodeStyle } {
  return {
    style: { backgroundColor: "transparent", borderRadius: SIZES[size].radius },
    textStyle: { color, fontSize: SIZES[size].fontSize, fontWeight: 700, textDecoration: "underline" },
  };
}

function gradient(from: string, to: string, size: ButtonSize = "md"): { style: NodeStyle; textStyle: NodeStyle } {
  const s = SIZES[size];
  return {
    style: {
      backgroundGradient: { type: "LINEAR", angle: 135, stops: [{ offset: 0, color: from }, { offset: 1, color: to }] },
      borderRadius: s.radius,
      shadow: lift(from, 0.4),
    },
    textStyle: { color: PALETTE.white, fontSize: s.fontSize, fontWeight: 700 },
  };
}

function make(
  id: string,
  category: string,
  label: string,
  text: string,
  look: { style: NodeStyle; textStyle: NodeStyle },
  opts: { size?: ButtonSize; icon?: string; iconPosition?: IconPosition } = {},
): ButtonPreset {
  const size = opts.size ?? "md";
  const hasIcon = !!opts.icon && opts.iconPosition !== "none";
  return {
    id,
    category,
    label,
    text,
    width: fitWidth(text, size, hasIcon),
    height: SIZES[size].height,
    style: look.style,
    textStyle: look.textStyle,
    icon: opts.icon,
    iconPosition: opts.icon ? (opts.iconPosition ?? "right") : undefined,
  };
}

export const BUTTON_PRESETS: ButtonPreset[] = [
  // ── Primary ────────────────────────────────────────────────────────────────
  make("shop-now", "Primary", "Shop Now", "Shop Now", solid(PALETTE.purple), { icon: "ArrowForward" }),
  make("buy-now", "Primary", "Buy Now", "Buy Now", solid(PALETTE.dark), { icon: "ShoppingCart", iconPosition: "left" }),
  make("order-now", "Primary", "Order Now", "Order Now", solid(PALETTE.green), { icon: "ArrowForward" }),
  make("grab-deal", "Primary", "Grab Deal", "Grab the Deal", solid(PALETTE.red), { icon: "Bolt", iconPosition: "left" }),
  make("shop-lg", "Primary", "Large CTA", "Shop the Collection", solid(PALETTE.purple, "lg"), { size: "lg", icon: "ArrowForward" }),
  make("shop-sm", "Primary", "Small CTA", "Shop", solid(PALETTE.purple, "sm"), { size: "sm" }),

  // ── Pill ───────────────────────────────────────────────────────────────────
  make("pill-shop", "Pill", "Pill Shop", "Shop Now", pill(PALETTE.purple), { icon: "ArrowForward" }),
  make("pill-offer", "Pill", "Pill Offer", "View Offer", pill(PALETTE.amber), { icon: "LocalOffer", iconPosition: "left" }),
  make("pill-dark", "Pill", "Pill Dark", "Get Started", pill(PALETTE.dark)),
  make("pill-sale", "Pill", "Pill Sale", "Shop Sale", pill(PALETTE.red), { icon: "Whatshot", iconPosition: "left" }),

  // ── Gradient ───────────────────────────────────────────────────────────────
  make("grad-purple", "Gradient", "Purple Fade", "Shop Now", gradient("#7C3AED", "#5B47D4"), { icon: "ArrowForward" }),
  make("grad-sunset", "Gradient", "Sunset", "Grab Offer", gradient("#F59E0B", "#EF4444"), { icon: "Bolt", iconPosition: "left" }),
  make("grad-ocean", "Gradient", "Ocean", "Explore", gradient("#0EA5E9", "#2563EB"), { icon: "ArrowForward" }),
  make("grad-mint", "Gradient", "Mint", "Order Now", gradient("#22C55E", "#14B8A6"), { icon: "ArrowForward" }),

  // ── Outline ────────────────────────────────────────────────────────────────
  make("out-purple", "Outline", "Outline", "Learn More", outline(PALETTE.purple)),
  make("out-dark", "Outline", "Outline Dark", "View Details", outline(PALETTE.dark)),
  make("out-white", "Outline", "On Photo", "Shop Now", outline(PALETTE.white), { icon: "ArrowForward" }),

  // ── Soft ───────────────────────────────────────────────────────────────────
  make("soft-purple", "Soft", "Soft Purple", "See More", soft(PALETTE.purple)),
  make("soft-green", "Soft", "Soft Green", "In Stock", soft(PALETTE.green), { icon: "CheckCircleOutlined", iconPosition: "left" }),
  make("soft-blue", "Soft", "Soft Blue", "Track Order", soft(PALETTE.blue), { icon: "LocalShipping", iconPosition: "left" }),

  // ── Text ───────────────────────────────────────────────────────────────────
  make("ghost-more", "Text", "Text Link", "View all products", ghost(PALETTE.purple, "sm"), { size: "sm" }),
  make("ghost-terms", "Text", "Subtle Link", "Terms apply", ghost("#64748B", "sm"), { size: "sm" }),

  // ── Icon only ──────────────────────────────────────────────────────────────
  make("icon-cart", "Icon", "Cart", "", solid(PALETTE.purple, "sm"), { size: "sm", icon: "ShoppingCart", iconPosition: "only" }),
  make("icon-fav", "Icon", "Favourite", "", soft(PALETTE.red, "sm"), { size: "sm", icon: "Favorite", iconPosition: "only" }),
];

export const BUTTON_CATEGORIES = Array.from(new Set(BUTTON_PRESETS.map((p) => p.category)));

/** Icons offered in the Button inspector's icon picker. */
export const BUTTON_ICON_OPTIONS: string[] = [
  "ArrowForward", "ShoppingCart", "Bolt", "LocalOffer", "Whatshot", "Star",
  "Favorite", "CheckCircleOutlined", "LocalShipping", "CardGiftcard", "Storefront",
  "TrendingUp", "Sell", "AutoAwesome", "Download", "RocketLaunch", "Schedule",
];

/** Click actions a button can carry (mirrors the backend ACTION_TYPES enum). */
export const BUTTON_ACTIONS = [
  "NONE", "OPEN_PRODUCT", "OPEN_ROOM", "OPEN_CHAT", "OPEN_COLLECTION", "OPEN_URL", "JOIN_ROOM",
] as const;
