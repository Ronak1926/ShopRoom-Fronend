"use client";

import type { CSSProperties, ReactNode } from "react";
import { buildNodeStyle } from "@/components/notifications/nodeStyle";
import { getIcon } from "@/features/notifications/icons";
import type { ButtonPreset } from "@/features/notifications/buttonPresets";
import type { CompositionNode } from "@/features/notifications/types";

/** Plain helper (not a component) so the dynamically-resolved icon renders safely — mirrors NotificationRenderer's renderLeaf. */
function renderButtonContent(preset: ButtonPreset): ReactNode {
  const Icon = getIcon(preset.icon);
  const pos = preset.iconPosition ?? (Icon ? "right" : "none");
  const t = preset.textStyle;
  const fontSize = t.fontSize ?? 14;
  // Map only the label fields that are valid CSS — NodeStyle carries editor
  // concepts (shadow objects, clipShape) that aren't CSSProperties.
  const labelCss: CSSProperties = {
    whiteSpace: "nowrap",
    color: t.color,
    fontSize,
    fontWeight: t.fontWeight,
    letterSpacing: t.letterSpacing,
    textTransform: t.textTransform,
    textDecoration: t.textDecoration,
  };
  const textEl = preset.text ? <span style={labelCss}>{preset.text}</span> : null;
  if (!Icon || pos === "none") return textEl;
  const iconEl = <Icon style={{ fontSize: fontSize + 2, color: preset.textStyle.color }} />;
  if (pos === "only") return iconEl;
  return pos === "left" ? <>{iconEl}{textEl}</> : <>{textEl}{iconEl}</>;
}

/**
 * Renders a button preset's actual appearance using the same buildNodeStyle the
 * canvas renderer uses, so a preset card and the inserted element are
 * guaranteed to match. Wider presets scale down to fit the card slot.
 */
export default function ButtonThumb({ preset, maxWidth = 148 }: { preset: ButtonPreset; maxWidth?: number }) {
  const node: CompositionNode = {
    id: "preview",
    type: "BUTTON",
    frame: { x: 0, y: 0, width: preset.width, height: preset.height, rotation: 0 },
    style: preset.style,
  };
  const box = buildNodeStyle(node, true);
  const scale = Math.min(1, maxWidth / preset.width);

  const style: CSSProperties = {
    ...box,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexShrink: 0,
    transform: scale < 1 ? `scale(${scale})` : undefined,
  };

  return <div style={style}>{renderButtonContent(preset)}</div>;
}
