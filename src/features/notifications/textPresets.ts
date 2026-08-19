/**
 * features/notifications/textPresets.ts — Static content for the Text tool
 * (Notification Studio left panel + right Text inspector). Presets are plain
 * data; the actual TEXT nodes they produce/patch are built by
 * elementFactory.ts and applied through the same update/addElement path as
 * every other element, so nothing here bypasses the normal design model.
 */

import type { BadgeLabelKind } from "./badgeLabelPresets";
import type { NodeStyle } from "./types";

export interface TextContentPreset {
  id: string;
  label: string;
  description: string;
  text: string;
  width: number;
  height: number;
  style: NodeStyle;
}

/**
 * Text-preset ids that no longer insert text — the dedicated Badges & Labels
 * editor (real shaped BADGE/LABEL nodes, not styled text) supersedes them.
 * They stay in TEXT_CONTENT_PRESETS so "label"/"badge" still surfaces
 * something when searched here, but clicking opens that editor instead
 * (see page.tsx's handleAddTextPreset).
 */
export const TEXT_PRESET_LINKS: Partial<Record<string, BadgeLabelKind>> = {
  label: "LABEL",
  "badge-text": "BADGE",
};

// The 10 "TEXT PRESETS" cards — each adds a real TEXT node styled for its
// typical use. Price/Discount/Stock-like presets pre-fill a dynamic variable
// token; they intentionally stay type "TEXT" (not the dedicated PRICE/DISCOUNT/
// STOCK node types already reachable from Add → Product) so this panel adds
// exactly one way to create styled text, not a second one.
export const TEXT_CONTENT_PRESETS: TextContentPreset[] = [
  {
    id: "heading",
    label: "Heading",
    description: "Large title",
    text: "New Arrival!",
    width: 260,
    height: 44,
    style: { color: "#0F172A", fontSize: 30, fontWeight: 800, textAlign: "center", lineHeight: 1.2 },
  },
  {
    id: "subheading",
    label: "Subheading",
    description: "Medium title",
    text: "Subheading",
    width: 220,
    height: 26,
    style: { color: "#0F172A", fontSize: 16, fontWeight: 400, textAlign: "center", lineHeight: 1.3 },
  },
  {
    id: "body",
    label: "Body",
    description: "Paragraph text",
    text: "Body text goes here.",
    width: 240,
    height: 40,
    style: { color: "#55596E", fontSize: 14, fontWeight: 400, textAlign: "left", lineHeight: 1.5 },
  },
  {
    id: "caption",
    label: "Caption",
    description: "Small text",
    text: "Caption",
    width: 160,
    height: 20,
    style: { color: "#979AB0", fontSize: 12, fontWeight: 500, textAlign: "left", lineHeight: 1.4 },
  },
  {
    // Clicking this opens the dedicated Badges & Labels editor instead of
    // inserting text — see textPresets.ts's LINK_PRESET_IDS and page.tsx's
    // handleAddTextPreset. Real chip/tag styling lives there now, not here.
    id: "label",
    label: "Label",
    description: "Open Badges & Labels",
    text: "Label",
    width: 120,
    height: 18,
    style: { color: "#55596E", fontSize: 11, fontWeight: 600, textAlign: "left", textTransform: "uppercase", letterSpacing: 0.6 },
  },
  {
    id: "badge-text",
    label: "Badge Text",
    description: "Open Badges & Labels",
    text: "New",
    width: 90,
    height: 18,
    style: { color: "#FFFFFF", fontSize: 11, fontWeight: 700, textAlign: "center", textTransform: "uppercase" },
  },
  {
    id: "price",
    label: "Price",
    description: "Price display",
    text: "{{product.price}}",
    width: 140,
    height: 30,
    style: { color: "#0F172A", fontSize: 22, fontWeight: 800, textAlign: "left" },
  },
  {
    id: "discount",
    label: "Discount",
    description: "Discount tag",
    text: "{{product.discount}} OFF",
    width: 140,
    height: 24,
    style: { color: "#DC2626", fontSize: 16, fontWeight: 800, textAlign: "left" },
  },
  {
    id: "cta-text",
    label: "CTA Text",
    description: "Button label",
    text: "Shop Now",
    width: 130,
    height: 20,
    style: { color: "#5B47D4", fontSize: 14, fontWeight: 700, textAlign: "center", textTransform: "uppercase", letterSpacing: 0.4 },
  },
  {
    id: "small-note",
    label: "Small Note",
    description: "Fine print",
    text: "Only a few left",
    width: 160,
    height: 18,
    style: { color: "#979AB0", fontSize: 11, fontWeight: 400, textAlign: "center" },
  },
];

export interface TextStylePreset {
  id: string;
  label: string;
  style: NodeStyle;
}

// The 9 "TEXT STYLE PRESETS" — typography treatments applied to the selected
// TEXT element (or used to create one when nothing is selected).
export const TEXT_STYLE_PRESETS: TextStylePreset[] = [
  { id: "classic", label: "Classic", style: { fontFamily: "Inter", fontSize: 22, fontWeight: 700, letterSpacing: 0, lineHeight: 1.3, color: "#0F172A", opacity: 1, textAlign: "center", textTransform: "none" } },
  { id: "modern", label: "Modern", style: { fontFamily: "DM Sans", fontSize: 22, fontWeight: 600, letterSpacing: 0.5, lineHeight: 1.25, color: "#0F172A", opacity: 1, textAlign: "left", textTransform: "none" } },
  { id: "bold", label: "Bold", style: { fontFamily: "Montserrat", fontSize: 26, fontWeight: 800, letterSpacing: 0, lineHeight: 1.15, color: "#0F172A", opacity: 1, textAlign: "center", textTransform: "none" } },
  { id: "elegant", label: "Elegant", style: { fontFamily: "Playfair Display", fontSize: 24, fontWeight: 500, letterSpacing: 0.3, lineHeight: 1.35, color: "#1F2430", opacity: 1, textAlign: "center", textTransform: "none" } },
  { id: "minimal", label: "Minimal", style: { fontFamily: "Inter", fontSize: 16, fontWeight: 400, letterSpacing: 0.2, lineHeight: 1.5, color: "#55596E", opacity: 1, textAlign: "left", textTransform: "none" } },
  { id: "premium", label: "Premium", style: { fontFamily: "Manrope", fontSize: 20, fontWeight: 700, letterSpacing: 1, lineHeight: 1.3, color: "#3C3489", opacity: 1, textAlign: "center", textTransform: "uppercase" } },
  { id: "sale", label: "Sale", style: { fontFamily: "Poppins", fontSize: 24, fontWeight: 800, letterSpacing: 0, lineHeight: 1.1, color: "#DC2626", opacity: 1, textAlign: "center", textTransform: "uppercase" } },
  { id: "playful", label: "Playful", style: { fontFamily: "Plus Jakarta Sans", fontSize: 20, fontWeight: 700, letterSpacing: 0, lineHeight: 1.2, color: "#5B47D4", opacity: 1, textAlign: "center", textTransform: "none" } },
  { id: "luxury", label: "Luxury", style: { fontFamily: "Playfair Display", fontSize: 22, fontWeight: 600, letterSpacing: 2, lineHeight: 1.4, color: "#19192F", opacity: 1, textAlign: "center", textTransform: "uppercase" } },
];

export const FONT_WEIGHT_OPTIONS: { value: number; label: string }[] = [
  { value: 300, label: "300 Light" },
  { value: 400, label: "400 Regular" },
  { value: 500, label: "500 Medium" },
  { value: 600, label: "600 Semibold" },
  { value: 700, label: "700 Bold" },
  { value: 800, label: "800 Extra Bold" },
  { value: 900, label: "900 Black" },
];

export const THEME_TEXT_COLORS: { label: string; value: string }[] = [
  { label: "Primary", value: "#5B47D4" },
  { label: "Secondary", value: "#8B76F0" },
  { label: "Accent", value: "#F59E0B" },
  { label: "Text", value: "#0F172A" },
  { label: "Muted", value: "#55596E" },
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#000000" },
];

export const TEXT_VARIABLES: { token: string; label: string }[] = [
  { token: "{{product.name}}", label: "Product name" },
  { token: "{{product.price}}", label: "Price" },
  { token: "{{product.oldPrice}}", label: "Old price" },
  { token: "{{product.discount}}", label: "Discount" },
  { token: "{{product.stock}}", label: "Stock" },
  { token: "{{shop.name}}", label: "Shop name" },
  { token: "{{shop.url}}", label: "Shop URL" },
];
