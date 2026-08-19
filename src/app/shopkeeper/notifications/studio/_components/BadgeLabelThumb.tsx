"use client";

import type { CSSProperties, ReactNode } from "react";
import { buildNodeStyle } from "@/components/notifications/nodeStyle";
import { getIcon } from "@/features/notifications/icons";
import type { BadgeLabelPreset } from "@/features/notifications/badgeLabelPresets";
import type { CompositionNode } from "@/features/notifications/types";

/** Plain helper (not a component) so the dynamically-resolved icon renders safely — mirrors NotificationRenderer's renderLeaf. */
function renderBadgeContent(preset: BadgeLabelPreset): ReactNode {
  const Icon = getIcon(preset.icon);
  const iconPos = preset.iconPosition ?? (Icon ? "left" : "none");
  if (!Icon || iconPos === "none") return preset.text ? <span>{preset.text}</span> : null;
  const iconFontSize = (preset.style.fontSize ?? 12) + 2;
  const iconEl = <Icon style={{ fontSize: iconFontSize }} />;
  if (iconPos === "only") return iconEl;
  const textEl = preset.text ? <span>{preset.text}</span> : null;
  return iconPos === "right" ? <>{textEl}{iconEl}</> : <>{iconEl}{textEl}</>;
}

/**
 * Renders a preset's actual appearance — same buildNodeStyle + icon
 * resolution the canvas renderer uses — so preset cards and the real
 * inserted element are guaranteed to look identical, never a placeholder.
 */
export default function BadgeLabelThumb({
  preset,
  maxSize = 64,
}: {
  preset: BadgeLabelPreset;
  /** Cards are a fixed slot; larger presets (e.g. Mega Sale burst) scale down to fit. */
  maxSize?: number;
}) {
  const node: CompositionNode = {
    id: "preview",
    type: preset.kind,
    frame: { x: 0, y: 0, width: preset.width, height: preset.height, rotation: 0 },
    style: preset.style,
    content: { text: preset.text, icon: preset.icon, iconPosition: preset.iconPosition },
  };
  const box = buildNodeStyle(node, true);
  const scale = Math.min(1, maxSize / preset.width, maxSize / preset.height);

  const style: CSSProperties = {
    ...box,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    transform: scale < 1 ? `scale(${scale})` : undefined,
    flexShrink: 0,
  };

  return <div style={style}>{renderBadgeContent(preset)}</div>;
}
