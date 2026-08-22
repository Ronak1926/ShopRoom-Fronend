/**
 * features/notifications/elementFactory.ts — Builds a default node for a given
 * element type when the shopkeeper adds one from the toolbar. New elements are
 * top-level (absolute frame near the canvas centre) so they can be dragged.
 */

import type { LibraryItem } from "./sceneLibrary";
import type { TextContentPreset } from "./textPresets";
import type { BadgeLabelPreset } from "./badgeLabelPresets";
import type { ButtonPreset } from "./buttonPresets";
import type { AssetRef, CompositionNode, NodeStyle } from "./types";

function uid(type: string): string {
  return `${type.toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`;
}

const TOP_Z = 200;

/**
 * Builds a DECORATION node from a library item (decoration / shape / effect).
 * Inserted centred on the canvas so it can immediately be dragged.
 */
export function createDecoration(
  item: LibraryItem,
  canvasW: number,
  canvasH: number,
  zIndex = TOP_Z,
): CompositionNode {
  const w = Math.min(item.width, canvasW);
  const h = Math.min(item.height, canvasH);
  return {
    id: uid(item.assetId),
    type: "DECORATION",
    name: item.name,
    asset: { type: "SVG", assetId: item.assetId },
    frame: {
      x: Math.round((canvasW - w) / 2),
      y: Math.round((canvasH - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      zIndex,
    },
    style: {
      ...(item.color ? { color: item.color } : {}),
      ...(item.opacity != null ? { opacity: item.opacity } : {}),
    },
    visible: true,
    locked: false,
  };
}

const ELEMENT_NAMES: Record<string, string> = {
  TEXT: "Text", BUTTON: "Button", BADGE: "Badge", IMAGE: "Image",
  PRODUCT_IMAGE: "Product Image", ICON: "Icon", SHAPE: "Shape",
  RECTANGLE: "Rectangle", CIRCLE: "Circle", DIVIDER: "Divider",
  STOCK: "Stock", DISCOUNT: "Discount", PRICE: "Price",
};

/** Builds a default node for a toolbar element type, named for the Layers panel. */
export function createElement(type: string, canvasW: number, canvasH: number): CompositionNode {
  const node = buildElement(type, canvasW, canvasH);
  return { ...node, name: node.name ?? ELEMENT_NAMES[type] ?? "Element", visible: true, locked: false };
}

function buildElement(type: string, canvasW: number, canvasH: number): CompositionNode {
  const id = uid(type);
  const cx = Math.round(canvasW / 2);
  const cy = Math.round(canvasH / 2);
  const frame = (w: number, h: number) => ({
    x: cx - Math.round(w / 2),
    y: cy - Math.round(h / 2),
    width: w,
    height: h,
    rotation: 0,
    zIndex: TOP_Z,
  });

  switch (type) {
    case "TEXT":
      return { id, type, frame: frame(200, 40), style: { color: "#0F172A", fontSize: 20, fontWeight: 700, textAlign: "center" }, content: { text: "New text" } };
    case "BUTTON":
      return {
        id, type: "BUTTON", frame: frame(200, 48),
        layout: { direction: "row", align: "center", justify: "center", gap: 8 },
        style: { backgroundColor: "#5B47D4", borderRadius: 14 },
        interaction: { onClick: { type: "NONE" } },
        children: [
          { id: uid("btntx"), type: "TEXT", frame: { x: 0, y: 0, width: 140, height: 18 }, style: { color: "#FFFFFF", fontSize: 14, fontWeight: 700 }, content: { label: "Button" } },
          { id: uid("btnic"), type: "ICON", frame: { x: 0, y: 0, width: 16, height: 16 }, style: { color: "#FFFFFF" }, content: { icon: "ArrowForward" } },
        ],
      };
    case "BADGE":
      return {
        id, type: "CONTAINER", frame: frame(130, 28),
        layout: { direction: "row", align: "center", justify: "center", gap: 6 },
        style: { backgroundColor: "#5B47D4", borderRadius: 9999 },
        children: [
          { id: uid("btx"), type: "TEXT", frame: { x: 0, y: 0, width: 90, height: 14 }, style: { color: "#FFFFFF", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }, content: { text: "Badge" } },
        ],
      };
    case "IMAGE":
    case "PRODUCT_IMAGE":
      return { id, type, frame: frame(120, 120), image: { fit: "contain", position: "center" }, content: { source: "DYNAMIC", variable: "{{product.image}}" } };
    case "ICON":
      return { id, type, frame: frame(40, 40), style: { color: "#5B47D4" }, content: { icon: "Star" } };
    case "SHAPE":
    case "RECTANGLE":
      return { id, type: "RECTANGLE", frame: frame(120, 80), style: { backgroundColor: "#5B47D4", borderRadius: 16, opacity: 0.9 } };
    case "CIRCLE":
      return { id, type: "CIRCLE", frame: frame(90, 90), style: { backgroundColor: "#5B47D4", borderRadius: 9999, opacity: 0.9 } };
    case "DIVIDER":
      return { id, type: "RECTANGLE", frame: frame(200, 3), style: { backgroundColor: "#CBD5E1", borderRadius: 9999 } };
    case "STOCK":
      return { id, type: "STOCK", frame: frame(160, 24), style: { color: "#0F172A", fontSize: 13, fontWeight: 700 }, content: { source: "DYNAMIC", text: "Only {{product.stock}} left" } };
    case "DISCOUNT":
      return { id, type: "DISCOUNT", frame: frame(120, 24), style: { color: "#0F172A", fontSize: 16, fontWeight: 800 }, content: { source: "DYNAMIC", text: "{{product.discount}} OFF" } };
    case "PRICE":
      return { id, type: "PRICE", frame: frame(120, 24), style: { color: "#0F172A", fontSize: 18, fontWeight: 800 }, content: { source: "DYNAMIC", text: "{{product.price}}" } };
    default:
      return { id, type: "TEXT", frame: frame(200, 40), style: { color: "#0F172A", fontSize: 18, textAlign: "center" }, content: { text: "New element" } };
  }
}

/**
 * Builds a real IMAGE node from an uploaded/stock photo URL, centred on the
 * canvas and sized from its natural aspect ratio (clamped so it never
 * dwarfs the canvas). Used by the Images panel's Uploads/Stock/Recent tabs.
 */
export function createImageElement(
  url: string,
  canvasW: number,
  canvasH: number,
  extra?: { name?: string; naturalWidth?: number; naturalHeight?: number; attribution?: AssetRef["attribution"] },
): CompositionNode {
  const id = uid("image");
  const naturalW = extra?.naturalWidth;
  const naturalH = extra?.naturalHeight;

  let w = 160;
  let h = 160;
  if (naturalW && naturalH) {
    const maxDim = Math.min(canvasW * 0.6, canvasH * 0.4, 260);
    const aspect = naturalW / naturalH;
    if (aspect >= 1) {
      w = maxDim;
      h = maxDim / aspect;
    } else {
      h = maxDim;
      w = maxDim * aspect;
    }
  }
  w = Math.round(w);
  h = Math.round(h);

  const cx = Math.round(canvasW / 2);
  const cy = Math.round(canvasH / 2);
  return {
    id,
    type: "IMAGE",
    name: extra?.name ?? "Image",
    frame: { x: cx - Math.round(w / 2), y: cy - Math.round(h / 2), width: w, height: h, rotation: 0, zIndex: TOP_Z },
    image: { fit: "cover", position: "center", opacity: 1 },
    asset: { type: "IMAGE", url, naturalWidth: naturalW, naturalHeight: naturalH, attribution: extra?.attribution },
    visible: true,
    locked: false,
  };
}

/** Builds a TEXT node from a Text-tool content preset (Heading, Price, …), centred on the canvas. */
export function createTextFromPreset(preset: TextContentPreset, canvasW: number, canvasH: number): CompositionNode {
  const id = uid("text");
  const w = Math.min(preset.width, canvasW - 24);
  const h = preset.height;
  const cx = Math.round(canvasW / 2);
  const cy = Math.round(canvasH / 2);
  return {
    id,
    type: "TEXT",
    name: preset.label,
    frame: { x: cx - Math.round(w / 2), y: cy - Math.round(h / 2), width: w, height: h, rotation: 0, zIndex: TOP_Z },
    style: { ...preset.style },
    content: { text: preset.text },
    visible: true,
    locked: false,
  };
}

/** Builds a TEXT node carrying a Text Style preset's look (used when a style preset is applied with nothing selected). */
export function createTextWithStyle(style: NodeStyle, label: string, canvasW: number, canvasH: number): CompositionNode {
  const id = uid("text");
  const w = 220;
  const h = 40;
  const cx = Math.round(canvasW / 2);
  const cy = Math.round(canvasH / 2);
  return {
    id,
    type: "TEXT",
    name: label,
    frame: { x: cx - Math.round(w / 2), y: cy - Math.round(h / 2), width: w, height: h, rotation: 0, zIndex: TOP_Z },
    style: { ...style },
    content: { text: label },
    visible: true,
    locked: false,
  };
}

/**
 * Builds a real BADGE or LABEL node from a Badges & Labels preset, centred on
 * the canvas. No static `name` is set — Layers derives "Badge (30% OFF)" /
 * "Label (FREE SHIPPING)" live from content.text (see tree.ts nodeLabel).
 */
export function createBadgeOrLabelFromPreset(preset: BadgeLabelPreset, canvasW: number, canvasH: number): CompositionNode {
  const id = uid(preset.kind);
  const w = Math.min(preset.width, canvasW - 24);
  const h = preset.height;
  const cx = Math.round(canvasW / 2);
  const cy = Math.round(canvasH / 2);
  return {
    id,
    type: preset.kind,
    frame: { x: cx - Math.round(w / 2), y: cy - Math.round(h / 2), width: w, height: h, rotation: 0, zIndex: TOP_Z },
    style: { ...preset.style },
    content: { text: preset.text, icon: preset.icon, iconPosition: preset.iconPosition },
    visible: true,
    locked: false,
  };
}

/**
 * Builds a real ICON node from the Icons library, centred on the canvas. The
 * icon NAME is stored (never JSX/SVG) and resolved by the renderer through
 * ICON_REGISTRY — same contract badges and buttons already use.
 */
export function createIconElement(
  iconName: string,
  label: string,
  canvasW: number,
  canvasH: number,
): CompositionNode {
  const size = 40;
  const cx = Math.round(canvasW / 2);
  const cy = Math.round(canvasH / 2);
  return {
    id: uid("icon"),
    type: "ICON",
    name: label,
    frame: {
      x: cx - Math.round(size / 2),
      y: cy - Math.round(size / 2),
      width: size,
      height: size,
      rotation: 0,
      zIndex: TOP_Z,
    },
    style: { color: "#5B47D4", opacity: 1 },
    content: { icon: iconName },
    visible: true,
    locked: false,
  };
}

/**
 * Builds a real BUTTON node from a Buttons preset, centred on the canvas. The
 * node keeps the same shape the renderer already expects: a flex-row container
 * whose children are the label TEXT and (optionally) an ICON.
 */
export function createButtonFromPreset(preset: ButtonPreset, canvasW: number, canvasH: number): CompositionNode {
  const id = uid("button");
  const w = Math.min(preset.width, canvasW - 24);
  const h = preset.height;
  const cx = Math.round(canvasW / 2);
  const cy = Math.round(canvasH / 2);
  return {
    id,
    type: "BUTTON",
    name: preset.label,
    frame: { x: cx - Math.round(w / 2), y: cy - Math.round(h / 2), width: w, height: h, rotation: 0, zIndex: TOP_Z },
    layout: { direction: "row", align: "center", justify: "center", gap: 8 },
    style: { ...preset.style },
    interaction: { onClick: { type: "NONE" } },
    children: buttonChildren(preset),
    visible: true,
    locked: false,
  };
}

/** Label + icon children for a button preset, ordered by iconPosition. */
function buttonChildren(preset: ButtonPreset): CompositionNode[] {
  const pos = preset.iconPosition ?? "none";
  const fontSize = preset.textStyle.fontSize ?? 14;
  const label: CompositionNode = {
    id: uid("btntx"),
    type: "TEXT",
    frame: { x: 0, y: 0, width: Math.max(40, preset.width - 48), height: fontSize + 6 },
    style: { ...preset.textStyle },
    content: { label: preset.text },
    visible: true,
    locked: false,
  };
  if (!preset.icon || pos === "none") return [label];

  const icon: CompositionNode = {
    id: uid("btnic"),
    type: "ICON",
    frame: { x: 0, y: 0, width: fontSize + 4, height: fontSize + 4 },
    style: { color: preset.textStyle.color },
    content: { icon: preset.icon },
    visible: true,
    locked: false,
  };
  if (pos === "only") return [icon];
  return pos === "left" ? [icon, label] : [label, icon];
}

/**
 * Applies a different preset's look to an EXISTING button node (the inspector's
 * "Change style" flow) — same id, position and animation, so it stays one
 * element. The label text the shopkeeper already typed is preserved.
 */
export function applyButtonPreset(node: CompositionNode, preset: ButtonPreset): CompositionNode {
  const existingLabel = node.children?.find((c) => c.type === "TEXT")?.content?.label;
  const children = buttonChildren(existingLabel ? { ...preset, text: existingLabel } : preset);
  return {
    ...node,
    style: { ...preset.style },
    layout: node.layout ?? { direction: "row", align: "center", justify: "center", gap: 8 },
    frame: { ...node.frame, height: preset.height },
    children,
  };
}

/**
 * Applies a different preset's look to an EXISTING badge/label node (the
 * inspector's "Change" flow) — same id, same position/animation, so it stays
 * one element rather than becoming a second one. The frame only resizes when
 * the new preset's natural size differs meaningfully from the current one
 * (e.g. swapping a pill for a circular shape badge).
 */
export function applyBadgeLabelPreset(node: CompositionNode, preset: BadgeLabelPreset): CompositionNode {
  const sameFamily = node.type === preset.kind;
  const w = Math.max(preset.width, 28);
  const h = preset.height;
  const resize = !sameFamily || Math.abs(w - node.frame.width) > 40 || Math.abs(h - node.frame.height) > 24;
  const cx = node.frame.x + node.frame.width / 2;
  const cy = node.frame.y + node.frame.height / 2;
  return {
    ...node,
    type: preset.kind,
    frame: resize
      ? { ...node.frame, x: Math.round(cx - w / 2), y: Math.round(cy - h / 2), width: w, height: h }
      : node.frame,
    style: { ...preset.style },
    content: { ...node.content, text: preset.text, icon: preset.icon, iconPosition: preset.iconPosition },
  };
}
