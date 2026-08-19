/**
 * features/notifications/badgeLabelPresets.ts — Static preset library for the
 * Badges & Labels tool. Every preset is real data (text/shape/colors/icon) fed
 * through the same createBadgeFromPreset/createLabelFromPreset factories that
 * build the actual canvas node — so a preset card and the element it inserts
 * are guaranteed to look identical (see BadgeLabelThumb.tsx).
 */

import type { NodeStyle } from "./types";

export type BadgeLabelKind = "BADGE" | "LABEL";
export type IconPosition = "left" | "right" | "only" | "none";

export interface BadgeLabelPreset {
  id: string;
  kind: BadgeLabelKind;
  category: string;
  label: string;
  text: string;
  width: number;
  height: number;
  style: NodeStyle;
  icon?: string;
  iconPosition?: IconPosition;
}

interface Swatch {
  solid: string;
  soft: string;
  text: string;
  dark: string;
}

const PALETTE = {
  purple: { solid: "#7C3AED", soft: "#EDE9FE", text: "#6D28D9", dark: "#2D1B69" },
  red: { solid: "#EF4444", soft: "#FEE2E2", text: "#DC2626", dark: "#7F1D1D" },
  rose: { solid: "#EC4899", soft: "#FCE7F3", text: "#DB2777", dark: "#831843" },
  amber: { solid: "#F59E0B", soft: "#FEF3C7", text: "#B45309", dark: "#78350F" },
  blue: { solid: "#3B82F6", soft: "#DBEAFE", text: "#2563EB", dark: "#1E3A8A" },
  indigo: { solid: "#6366F1", soft: "#E0E7FF", text: "#4F46E5", dark: "#312E81" },
  green: { solid: "#22C55E", soft: "#DCFCE7", text: "#16A34A", dark: "#14532D" },
  gray: { solid: "#6B7280", soft: "#F1F5F9", text: "#475569", dark: "#1F2937" },
  teal: { solid: "#14B8A6", soft: "#CCFBF1", text: "#0D9488", dark: "#134E4A" },
  sky: { solid: "#0EA5E9", soft: "#E0F2FE", text: "#0284C7", dark: "#0C4A6E" },
} satisfies Record<string, Swatch>;

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** hex -> rgba(...) at the given alpha, for tasteful colored (not generic black) shadows. */
function alphaColor(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Soft, grounded (negative-spread) shadow tinted to the badge/label's own color — never a generic black box-shadow. */
function liftShadow(hex: string, alpha: number, size: "sm" | "md" = "md"): NonNullable<NodeStyle["shadow"]> {
  return size === "md"
    ? { enabled: true, x: 0, y: 4, blur: 12, spread: -2, color: alphaColor(hex, alpha) }
    : { enabled: true, x: 0, y: 2, blur: 6, spread: -1, color: alphaColor(hex, alpha) };
}

/** Rough text width so preset frames don't clip their own label. */
function textWidth(text: string, fontSize: number, pad: number, hasIcon?: boolean): number {
  return Math.round(text.length * fontSize * 0.62 + pad + (hasIcon ? fontSize + 8 : 0));
}

// ─── Style builders (one per visual "fill" treatment) ──────────────────────────

function pillSolid(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: sw.solid, color: "#FFFFFF",
    fontSize: 11, fontWeight: 800, textAlign: "center", textTransform: "uppercase",
    letterSpacing: 0.3, clipShape: "pill",
    padding: { top: 6, bottom: 6, left: 14, right: 14 },
    shadow: liftShadow(sw.solid, 0.45),
    ...extra,
  };
}
function pillOutline(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: "#FFFFFF", color: sw.text,
    border: { width: 1.5, color: sw.solid, style: "solid" },
    fontSize: 11, fontWeight: 800, textAlign: "center", textTransform: "uppercase",
    letterSpacing: 0.3, clipShape: "pill",
    padding: { top: 5, bottom: 5, left: 13, right: 13 },
    ...extra,
  };
}
function pillSoft(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: sw.soft, color: sw.text,
    fontSize: 11, fontWeight: 700, textAlign: "center",
    clipShape: "pill",
    padding: { top: 6, bottom: 6, left: 13, right: 13 },
    shadow: liftShadow(sw.solid, 0.16, "sm"),
    ...extra,
  };
}
function pillDark(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: sw.dark, color: "#FFFFFF",
    fontSize: 11, fontWeight: 800, textAlign: "center", textTransform: "uppercase",
    letterSpacing: 0.3, clipShape: "pill",
    padding: { top: 6, bottom: 6, left: 14, right: 14 },
    shadow: liftShadow(sw.dark, 0.55),
    ...extra,
  };
}
function pillGradient(from: string, to: string, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundGradient: { type: "LINEAR", angle: 120, stops: [{ offset: 0, color: from }, { offset: 1, color: to }] },
    color: "#FFFFFF", fontSize: 11, fontWeight: 800, textAlign: "center", textTransform: "uppercase",
    letterSpacing: 0.3, clipShape: "pill",
    padding: { top: 6, bottom: 6, left: 14, right: 14 },
    shadow: liftShadow(from, 0.4),
    ...extra,
  };
}
function circleSolid(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: sw.solid, color: "#FFFFFF",
    fontSize: 13, fontWeight: 800, textAlign: "center", lineHeight: 1.1,
    clipShape: "circle",
    shadow: liftShadow(sw.solid, 0.4),
    ...extra,
  };
}
/** Light pastel-filled circle — used where a solid circle would read as too heavy (e.g. Number badges). */
function circleSoft(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: sw.soft, color: sw.text,
    fontSize: 13, fontWeight: 800, textAlign: "center", lineHeight: 1.1,
    clipShape: "circle",
    shadow: liftShadow(sw.solid, 0.14, "sm"),
    ...extra,
  };
}
/** White fill + colored ring — the refined "outline" counterpart to circleSolid. */
function circleOutline(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: "#FFFFFF", color: sw.text,
    border: { width: 1.75, color: sw.solid, style: "solid" },
    fontSize: 12, fontWeight: 800, textAlign: "center", lineHeight: 1.1,
    clipShape: "circle",
    shadow: liftShadow(sw.solid, 0.14, "sm"),
    ...extra,
  };
}
function shapeSolid(sw: Swatch, shape: NonNullable<NodeStyle["clipShape"]>, extra?: Partial<NodeStyle>): NodeStyle {
  // No shadow here: clip-path shapes (hexagon/star/shield/…) clip box-shadow
  // along with the box, so it wouldn't follow the silhouette — better flat.
  return {
    backgroundColor: sw.solid, color: "#FFFFFF",
    fontSize: 10, fontWeight: 800, textAlign: "center", textTransform: "uppercase",
    lineHeight: 1.1, clipShape: shape,
    ...extra,
  };
}
/** White fill + colored ring — the refined "outline" counterpart to shapeSolid (clip-path border works cleanly here). */
function shapeOutline(sw: Swatch, shape: NonNullable<NodeStyle["clipShape"]>, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: "#FFFFFF", color: sw.text,
    border: { width: 1.75, color: sw.solid, style: "solid" },
    fontSize: 10, fontWeight: 800, textAlign: "center", textTransform: "uppercase",
    lineHeight: 1.1, clipShape: shape,
    ...extra,
  };
}
function chipSoft(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: sw.soft, color: sw.text,
    fontSize: 11, fontWeight: 600, textAlign: "center", borderRadius: 8,
    padding: { top: 6, bottom: 6, left: 11, right: 11 },
    shadow: liftShadow(sw.solid, 0.12, "sm"),
    ...extra,
  };
}
function chipOutline(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: "#FFFFFF", color: sw.text,
    border: { width: 1.5, color: sw.solid, style: "solid" },
    fontSize: 11, fontWeight: 600, textAlign: "center", borderRadius: 8,
    padding: { top: 5, bottom: 5, left: 10, right: 10 },
    ...extra,
  };
}
function chipDashed(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: "#FFFFFF", color: sw.text,
    border: { width: 1.5, color: sw.solid, style: "dashed" },
    fontSize: 11, fontWeight: 600, textAlign: "center", borderRadius: 8,
    padding: { top: 5, bottom: 5, left: 10, right: 10 },
    ...extra,
  };
}
function chipMinimal(extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: "#FFFFFF", color: "#475569",
    border: { width: 1, color: "#D8DCE6", style: "solid" },
    fontSize: 11, fontWeight: 600, textAlign: "center", borderRadius: 8,
    padding: { top: 5, bottom: 5, left: 10, right: 10 },
    ...extra,
  };
}
function chipDark(sw: Swatch, extra?: Partial<NodeStyle>): NodeStyle {
  return {
    backgroundColor: sw.dark, color: "#FFFFFF",
    fontSize: 11, fontWeight: 700, textAlign: "center", borderRadius: 8,
    padding: { top: 6, bottom: 6, left: 11, right: 11 },
    shadow: liftShadow(sw.dark, 0.4, "sm"),
    ...extra,
  };
}

let auto = 0;
function makeBadge(category: string, label: string, text: string, style: NodeStyle, size?: { w: number; h: number }, icon?: string, iconPosition?: IconPosition): BadgeLabelPreset {
  auto += 1;
  const hasIcon = !!icon && iconPosition !== "none";
  const isRound = style.clipShape && style.clipShape !== "pill";
  const w = size?.w ?? (isRound ? 56 : textWidth(text, style.fontSize ?? 11, 30, hasIcon && iconPosition !== "only"));
  const h = size?.h ?? (isRound ? w : 26);
  return {
    id: `badge-${slug(category)}-${slug(label)}-${auto}`,
    kind: "BADGE", category, label, text, width: w, height: h, style,
    icon, iconPosition: icon ? (iconPosition ?? "left") : undefined,
  };
}
function makeLabel(category: string, label: string, text: string, style: NodeStyle, icon?: string): BadgeLabelPreset {
  auto += 1;
  const hasIcon = !!icon;
  const w = textWidth(text, style.fontSize ?? 11, 26, hasIcon);
  return {
    id: `label-${slug(category)}-${slug(label)}-${auto}`,
    kind: "LABEL", category, label, text, width: w, height: 28, style,
    icon, iconPosition: icon ? "left" : undefined,
  };
}

type PaletteKey = keyof typeof PALETTE;
type Row = readonly [label: string, swatch: PaletteKey];

/** Icon for the shared "New / Hot / Sale / Popular / Trending / Exclusive" word set. */
const BASIC_WORD_ICONS: Record<string, string> = {
  New: "AutoAwesome", Hot: "Whatshot", Sale: "LocalOffer",
  Popular: "Star", Trending: "TrendingUp", Exclusive: "WorkspacePremium",
};
const SOFT_WORD_ICONS: Record<string, string> = {
  New: "AutoAwesome", Sale: "LocalOffer", Offer: "Sell",
  Popular: "Star", Limited: "Schedule", Exclusive: "WorkspacePremium",
};

// ─── BADGES ─────────────────────────────────────────────────────────────────────

const BASIC_BADGES: Row[] = [["New", "purple"], ["Hot", "red"], ["Sale", "rose"], ["Popular", "amber"], ["Trending", "blue"], ["Exclusive", "indigo"]];
const OUTLINE_ROWS: Row[] = BASIC_BADGES;
const GRADIENT_ROWS: Row[] = BASIC_BADGES;
const SOFT_BADGE_ROWS: Row[] = [["New", "purple"], ["Sale", "red"], ["Offer", "amber"], ["Popular", "blue"], ["Limited", "rose"], ["Exclusive", "indigo"]];
const DARK_BADGE_ROWS: Row[] = BASIC_BADGES;

export const BADGE_PRESETS: BadgeLabelPreset[] = [
  // Light pastel fill + a small colored icon reads as a modern SaaS badge — a
  // solid saturated block of color reads as a mobile-game sticker, so that
  // treatment is reserved for Dark/Gradient/hero-discount badges below.
  ...BASIC_BADGES.map(([l, sw]) =>
    makeBadge("Basic Badges", l, l, pillSoft(PALETTE[sw], { textTransform: "none" }), undefined, BASIC_WORD_ICONS[l], "left"),
  ),

  makeBadge("Status Badges", "Active", "Active", pillSoft(PALETTE.green, { textTransform: "none" }), undefined, "CheckCircleOutlined", "left"),
  makeBadge("Status Badges", "Inactive", "Inactive", pillSoft(PALETTE.gray, { textTransform: "none" }), undefined, "RadioButtonUnchecked", "left"),
  makeBadge("Status Badges", "Pending", "Pending", pillSoft(PALETTE.amber, { textTransform: "none" }), undefined, "Schedule", "left"),
  makeBadge("Status Badges", "Draft", "Draft", pillSoft(PALETTE.blue, { textTransform: "none" }), undefined, "EditNote", "left"),
  makeBadge("Status Badges", "Approved", "Approved", pillSoft(PALETTE.teal, { textTransform: "none" }), undefined, "CheckCircleOutlined", "left"),
  makeBadge("Status Badges", "Rejected", "Rejected", pillSoft(PALETTE.red, { textTransform: "none" }), undefined, "HighlightOff", "left"),

  ...([["Live", "red"], ["Online", "green"], ["Busy", "amber"], ["Away", "gray"], ["Offline", "gray"], ["Do Not Disturb", "indigo"]] as Row[]).map(([l, sw]) =>
    makeBadge("Dot Badges", l, l, pillOutline(PALETTE[sw], { textTransform: "none" }), undefined, "FiberManualRecord", "left"),
  ),

  makeBadge("Discount Badges", "10% OFF", "10% OFF", circleOutline(PALETTE.green), { w: 58, h: 58 }),
  makeBadge("Discount Badges", "20% OFF", "20% OFF", circleOutline(PALETTE.blue), { w: 58, h: 58 }),
  makeBadge("Discount Badges", "30% OFF", "30% OFF", circleSolid(PALETTE.red), { w: 62, h: 62 }),
  makeBadge("Discount Badges", "50% OFF", "50% OFF", circleOutline(PALETTE.purple), { w: 62, h: 62 }),
  makeBadge("Discount Badges", "70% OFF", "70% OFF", circleOutline(PALETTE.indigo), { w: 62, h: 62 }),
  makeBadge("Discount Badges", "Mega Sale", "MEGA SALE", shapeSolid(PALETTE.gray, "burst", { backgroundColor: PALETTE.gray.dark, fontSize: 9 }), { w: 74, h: 74 }),

  ...([["1", "purple"], ["3", "red"], ["5", "amber"], ["10", "green"], ["25", "blue"], ["50+", "indigo"]] as Row[]).map(([l, sw]) =>
    makeBadge("Number Badges", l, l, circleSoft(PALETTE[sw], { fontSize: 15 }), { w: 44, h: 44 }),
  ),

  makeBadge("Shape Badges", "New", "NEW", shapeOutline(PALETTE.purple, "hexagon"), { w: 58, h: 58 }),
  makeBadge("Shape Badges", "Hot", "HOT", shapeOutline(PALETTE.red, "shield"), { w: 58, h: 58 }),
  makeBadge("Shape Badges", "Sale", "SALE", shapeOutline(PALETTE.rose, "shield"), { w: 58, h: 58 }),
  makeBadge("Shape Badges", "Top", "TOP", shapeOutline(PALETTE.amber, "star"), { w: 60, h: 60 }),
  makeBadge("Shape Badges", "Safe", "SAFE", shapeOutline(PALETTE.green, "shield"), { w: 58, h: 58 }),
  makeBadge("Shape Badges", "Pro", "PRO", shapeOutline(PALETTE.blue, "diamond"), { w: 58, h: 58 }),

  ...OUTLINE_ROWS.map(([l, sw]) =>
    makeBadge("Outline Badges", l, l, pillOutline(PALETTE[sw], { textTransform: "none" }), undefined, BASIC_WORD_ICONS[l], "left"),
  ),
  ...GRADIENT_ROWS.map(([l, sw]) =>
    makeBadge("Gradient Badges", l, l, pillGradient(PALETTE[sw].solid, PALETTE[sw].dark, { textTransform: "none" }), undefined, BASIC_WORD_ICONS[l], "left"),
  ),

  makeBadge("Icon Badges", "Featured", "Featured", pillSoft(PALETTE.purple, { textTransform: "none" }), undefined, "Star", "left"),
  makeBadge("Icon Badges", "Flash Deal", "Flash Deal", pillSoft(PALETTE.amber, { textTransform: "none" }), undefined, "Bolt", "left"),
  makeBadge("Icon Badges", "Hot", "Hot", pillSoft(PALETTE.red, { textTransform: "none" }), undefined, "Whatshot", "left"),
  makeBadge("Icon Badges", "Premium", "Premium", pillSoft(PALETTE.blue, { textTransform: "none" }), undefined, "Diamond", "left"),
  makeBadge("Icon Badges", "Exclusive", "Exclusive", pillSoft(PALETTE.indigo, { textTransform: "none" }), undefined, "WorkspacePremium", "left"),

  makeBadge("Round Badges", "Star", "", circleOutline(PALETTE.purple), { w: 44, h: 44 }, "Star", "only"),
  makeBadge("Round Badges", "Heart", "", circleOutline(PALETTE.red), { w: 44, h: 44 }, "Favorite", "only"),
  makeBadge("Round Badges", "Fire", "", circleOutline(PALETTE.amber), { w: 44, h: 44 }, "Whatshot", "only"),
  makeBadge("Round Badges", "Tag", "", circleOutline(PALETTE.blue), { w: 44, h: 44 }, "LocalOffer", "only"),
  makeBadge("Round Badges", "Cart", "", circleOutline(PALETTE.teal), { w: 44, h: 44 }, "ShoppingCart", "only"),
  makeBadge("Round Badges", "Gift", "", circleOutline(PALETTE.green), { w: 44, h: 44 }, "CardGiftcard", "only"),

  ...SOFT_BADGE_ROWS.map(([l, sw]) =>
    makeBadge("Soft Badges", l, l, pillSoft(PALETTE[sw], { textTransform: "none" }), undefined, SOFT_WORD_ICONS[l], "left"),
  ),
  ...DARK_BADGE_ROWS.map(([l, sw]) =>
    makeBadge("Dark Badges", l, l, pillDark(PALETTE[sw], { textTransform: "none" }), undefined, BASIC_WORD_ICONS[l], "left"),
  ),

  ...([
    ["4.5", "purple"], ["5.0", "amber"], ["4.8", "blue"], ["4.9", "indigo"], ["Top Rated", "rose"], ["Best Rated", "green"],
  ] as Row[]).map(([l, sw]) =>
    makeBadge("Rating Badges", l, l === "Top Rated" || l === "Best Rated" ? l : `${l} ★`, pillSoft(PALETTE[sw], { textTransform: "none" }), undefined, "Star", "left"),
  ),

  makeBadge("Urgency Badges", "Limited Time", "LIMITED TIME", pillSolid(PALETTE.red), undefined, "Schedule", "left"),
  makeBadge("Urgency Badges", "Ending Soon", "ENDING SOON", pillSolid(PALETTE.amber), undefined, "Schedule", "left"),
  makeBadge("Urgency Badges", "Last Chance", "LAST CHANCE", pillSolid(PALETTE.rose), undefined, "Warning", "left"),
  makeBadge("Urgency Badges", "Selling Fast", "SELLING FAST", pillGradient(PALETTE.amber.solid, PALETTE.red.solid), undefined, "Bolt", "left"),
  makeBadge("Urgency Badges", "Almost Gone", "ALMOST GONE", pillSolid(PALETTE.red), undefined, "Warning", "left"),
  makeBadge("Urgency Badges", "Hurry Up", "HURRY UP", pillDark(PALETTE.red), undefined, "Bolt", "left"),
];

// ─── LABELS ──────────────────────────────────────────────────────────────────────

export const LABEL_PRESETS: BadgeLabelPreset[] = [
  makeLabel("Basic Labels", "New Arrival", "New Arrival", chipSoft(PALETTE.purple), "AutoAwesome"),
  makeLabel("Basic Labels", "Best Seller", "Best Seller", chipSoft(PALETTE.rose), "EmojiEvents"),
  makeLabel("Basic Labels", "On Sale", "On Sale", chipSoft(PALETTE.green), "LocalOffer"),
  makeLabel("Basic Labels", "Top Rated", "Top Rated", chipSoft(PALETTE.amber), "Star"),
  makeLabel("Basic Labels", "Limited Stock", "Limited Stock", chipSoft(PALETTE.red), "Schedule"),
  makeLabel("Basic Labels", "Premium", "Premium", chipSoft(PALETTE.gray), "WorkspacePremium"),

  makeLabel("Status Labels", "In Stock", "In Stock", chipSoft(PALETTE.green), "CheckCircleOutlined"),
  makeLabel("Status Labels", "Out of Stock", "Out of Stock", chipSoft(PALETTE.red), "HighlightOff"),
  makeLabel("Status Labels", "Pre Order", "Pre Order", chipSoft(PALETTE.amber), "Schedule"),
  makeLabel("Status Labels", "Back Soon", "Back Soon", chipSoft(PALETTE.gray), "Schedule"),
  makeLabel("Status Labels", "Low Stock", "Low Stock", chipSoft(PALETTE.amber), "Schedule"),
  makeLabel("Status Labels", "Restocked", "Restocked", chipSoft(PALETTE.blue), "CheckCircleOutlined"),

  makeLabel("Shipping Labels", "Free Shipping", "Free Shipping", chipSoft(PALETTE.green), "LocalShipping"),
  makeLabel("Shipping Labels", "Fast Delivery", "Fast Delivery", chipSoft(PALETTE.blue), "Bolt"),
  makeLabel("Shipping Labels", "Express", "Express", chipSoft(PALETTE.indigo), "RocketLaunch"),
  makeLabel("Shipping Labels", "Same Day", "Same Day", chipSoft(PALETTE.amber), "Schedule"),
  makeLabel("Shipping Labels", "Next Day", "Next Day", chipSoft(PALETTE.sky), "LocalShipping"),
  makeLabel("Shipping Labels", "International", "International", chipSoft(PALETTE.indigo), "LocalShipping"),

  makeLabel("Feature Labels", "Exclusive", "Exclusive", chipSoft(PALETTE.amber), "Star"),
  makeLabel("Feature Labels", "Eco Friendly", "Eco Friendly", chipSoft(PALETTE.green), "Spa"),
  makeLabel("Feature Labels", "Handmade", "Handmade", chipSoft(PALETTE.blue), "Favorite"),
  makeLabel("Feature Labels", "Organic", "Organic", chipSoft(PALETTE.teal), "Spa"),
  makeLabel("Feature Labels", "Verified", "Verified", chipSoft(PALETTE.indigo), "VerifiedUser"),
  makeLabel("Feature Labels", "Certified", "Certified", chipSoft(PALETTE.purple), "Shield"),

  makeLabel("Offer Labels", "10% OFF", "10% OFF", chipSoft(PALETTE.green), "Sell"),
  makeLabel("Offer Labels", "20% OFF", "20% OFF", chipSoft(PALETTE.blue), "Sell"),
  makeLabel("Offer Labels", "30% OFF", "30% OFF", chipSoft(PALETTE.red), "Sell"),
  makeLabel("Offer Labels", "50% OFF", "50% OFF", chipSoft(PALETTE.purple), "Sell"),
  makeLabel("Offer Labels", "70% OFF", "70% OFF", chipSoft(PALETTE.indigo), "Sell"),
  makeLabel("Offer Labels", "Clearance", "Clearance", chipSoft(PALETTE.rose), "Sell"),

  makeLabel("Category Labels", "Electronics", "Electronics", chipSoft(PALETTE.indigo), "Devices"),
  makeLabel("Category Labels", "Fashion", "Fashion", chipSoft(PALETTE.rose), "Checkroom"),
  makeLabel("Category Labels", "Home & Living", "Home & Living", chipSoft(PALETTE.green), "Home"),
  makeLabel("Category Labels", "Beauty", "Beauty", chipSoft(PALETTE.rose), "Spa"),
  makeLabel("Category Labels", "Sports", "Sports", chipSoft(PALETTE.blue), "SportsSoccer"),
  makeLabel("Category Labels", "Toys", "Toys", chipSoft(PALETTE.amber), "Toys"),

  makeLabel("Info Labels", "New Season", "New Season", chipSoft(PALETTE.sky), "AcUnit"),
  makeLabel("Info Labels", "Trending Now", "Trending Now", chipSoft(PALETTE.rose), "TrendingUp"),
  makeLabel("Info Labels", "Just In", "Just In", chipSoft(PALETTE.purple), "FiberNew"),
  makeLabel("Info Labels", "Staff Pick", "Staff Pick", chipSoft(PALETTE.indigo), "Star"),
  makeLabel("Info Labels", "Editor's Choice", "Editor's Choice", chipSoft(PALETTE.purple), "EmojiEvents"),
  makeLabel("Info Labels", "Popular Choice", "Popular Choice", chipSoft(PALETTE.blue), "ThumbUp"),

  makeLabel("Type Labels", "Digital", "Digital", chipDashed(PALETTE.purple), "Devices"),
  makeLabel("Type Labels", "Physical", "Physical", chipDashed(PALETTE.green), "Inventory2"),
  makeLabel("Type Labels", "Bundle", "Bundle", chipDashed(PALETTE.indigo), "CardGiftcard"),
  makeLabel("Type Labels", "Subscription", "Subscription", chipDashed(PALETTE.amber), "Autorenew"),
  makeLabel("Type Labels", "Download", "Download", chipDashed(PALETTE.blue), "Download"),
  makeLabel("Type Labels", "Service", "Service", chipDashed(PALETTE.gray), "Build"),

  makeLabel("Simple Outline Labels", "New", "New", chipOutline(PALETTE.purple)),
  makeLabel("Simple Outline Labels", "Sale", "Sale", chipOutline(PALETTE.red)),
  makeLabel("Simple Outline Labels", "Offer", "Offer", chipOutline(PALETTE.amber)),
  makeLabel("Simple Outline Labels", "Popular", "Popular", chipOutline(PALETTE.blue)),
  makeLabel("Simple Outline Labels", "Limited", "Limited", chipOutline(PALETTE.rose)),
  makeLabel("Simple Outline Labels", "Exclusive", "Exclusive", chipOutline(PALETTE.indigo)),

  makeLabel("Badge + Label Combined", "Hot Deal", "Hot Deal", chipSoft(PALETTE.red), "Whatshot"),
  makeLabel("Badge + Label Combined", "Top Rated", "Top Rated", chipSoft(PALETTE.amber), "Star"),
  makeLabel("Badge + Label Combined", "Premium", "Premium", chipSoft(PALETTE.purple), "WorkspacePremium"),
  makeLabel("Badge + Label Combined", "Best Seller", "Best Seller", chipSoft(PALETTE.rose), "Star"),
  makeLabel("Badge + Label Combined", "Flash Sale", "Flash Sale", chipSoft(PALETTE.amber), "Bolt"),
  makeLabel("Badge + Label Combined", "In Stock", "In Stock", chipSoft(PALETTE.green), "CheckCircleOutlined"),

  ...(["New", "Sale", "Offer", "Popular", "Limited", "Exclusive"] as const).map((l) =>
    makeLabel("Minimal Labels", l, l, chipMinimal()),
  ),

  makeLabel("Dark Labels", "New Arrival", "New Arrival", chipDark(PALETTE.purple)),
  makeLabel("Dark Labels", "Best Seller", "Best Seller", chipDark(PALETTE.rose)),
  makeLabel("Dark Labels", "On Sale", "On Sale", chipDark(PALETTE.green)),
  makeLabel("Dark Labels", "Premium", "Premium", chipDark(PALETTE.gray)),
  makeLabel("Dark Labels", "Trendy", "Trendy", chipDark(PALETTE.blue)),
  makeLabel("Dark Labels", "Exclusive", "Exclusive", chipDark(PALETTE.indigo)),

  makeLabel("Social Proof Labels", "1000+ Sold", "1000+ Sold", chipSoft(PALETTE.green), "ThumbUp"),
  makeLabel("Social Proof Labels", "Verified Buyer", "Verified Buyer", chipSoft(PALETTE.blue), "VerifiedUser"),
  makeLabel("Social Proof Labels", "Community Favorite", "Community Favorite", chipSoft(PALETTE.purple), "EmojiEvents"),
  makeLabel("Social Proof Labels", "Top Seller", "Top Seller", chipSoft(PALETTE.amber), "Star"),
  makeLabel("Social Proof Labels", "Highly Rated", "Highly Rated", chipSoft(PALETTE.rose), "Star"),
  makeLabel("Social Proof Labels", "Customer Choice", "Customer Choice", chipSoft(PALETTE.indigo), "ThumbUp"),

  makeLabel("Seasonal Labels", "Summer Sale", "Summer Sale", chipSoft(PALETTE.amber), "WbSunny"),
  makeLabel("Seasonal Labels", "Winter Collection", "Winter Collection", chipSoft(PALETTE.sky), "AcUnit"),
  makeLabel("Seasonal Labels", "Holiday Special", "Holiday Special", chipSoft(PALETTE.red), "Celebration"),
  makeLabel("Seasonal Labels", "Black Friday", "Black Friday", chipDark(PALETTE.gray), "Sell"),
  makeLabel("Seasonal Labels", "New Year", "New Year", chipSoft(PALETTE.purple), "Celebration"),
  makeLabel("Seasonal Labels", "Back to School", "Back to School", chipSoft(PALETTE.green), "School"),
];

export const BADGE_CATEGORIES: string[] = Array.from(new Set(BADGE_PRESETS.map((p) => p.category)));
export const LABEL_CATEGORIES: string[] = Array.from(new Set(LABEL_PRESETS.map((p) => p.category)));

/** Curated icon choices for the Badge/Label inspector's icon selector (MUI names — see features/notifications/icons.tsx). */
export const BADGE_LABEL_ICON_OPTIONS: string[] = [
  "Star", "Whatshot", "LocalFireDepartment", "LocalOffer", "Bolt", "FlashOn",
  "CardGiftcard", "ShoppingCart", "Favorite", "WorkspacePremium", "Diamond", "Shield",
  "VerifiedUser", "Verified", "CheckCircleOutlined", "HighlightOff", "Schedule",
  "LocalShipping", "FiberManualRecord", "EmojiEvents", "ThumbUp", "NewReleases",
  "TrendingUp", "FiberNew", "Spa", "Celebration", "Sell", "AutoAwesome",
  "RadioButtonUnchecked", "Warning", "Devices", "Checkroom", "Home", "SportsSoccer",
  "Toys", "AcUnit", "WbSunny", "Autorenew", "Download", "Build", "RocketLaunch",
  "School", "EditNote", "Inventory2",
];
