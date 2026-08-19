"use client";

/**
 * components/notifications/NotificationRenderer.tsx — Generic recursive renderer
 * for a NotificationDesign composition tree. Knows only element TYPES, never
 * template names — the same renderer draws every ShopRoom + custom design.
 */

import type { CSSProperties, MouseEvent } from "react";
import type {
  CompositionNode,
  NotificationDesign,
  RenderContext,
} from "@/features/notifications/types";
import { backgroundCss, buildNodeStyle, flexStyle, leafOverflowStyle, verticalAlignItems } from "./nodeStyle";
import { getIcon } from "@/features/notifications/icons";
import { CSS_ASSETS, SVG_ASSETS } from "@/features/notifications/assets";
import { resolveProductImage, resolveVariables } from "@/features/notifications/resolver";

interface Props {
  design: NotificationDesign;
  context: RenderContext;
  scale?: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export default function NotificationRenderer({
  design,
  context,
  scale = 1,
  selectedId,
  onSelect,
}: Props) {
  const { width, height, background } = design.canvas;
  return (
    <div style={{ width: width * scale, height: height * scale }}>
      <div
        style={{
          width,
          height,
          position: "relative",
          overflow: "hidden",
          background: backgroundCss(background),
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        onClick={() => onSelect?.("")}
      >
        {design.elements.map((n) => (
          <RenderNode key={n.id} node={n} inFlow={false} ctx={context} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

interface NodeProps {
  node: CompositionNode;
  inFlow: boolean;
  ctx: RenderContext;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

const SELECTION: CSSProperties = {
  outline: "2px solid var(--color-brand-primary)",
  outlineOffset: "1px",
};

function RenderNode({ node, inFlow, ctx, selectedId, onSelect }: NodeProps) {
  if (node.visible === false) return null;
  const base = buildNodeStyle(node, inFlow);
  const isSelected = !!selectedId && selectedId === node.id;
  // Locking only blocks dragging (SelectionOverlay disables its handles for a
  // locked node) — clicking must still select it, otherwise there's no way to
  // reach its Properties panel and unlock it again without hunting for it in
  // the Layers list.
  const selectable = !!onSelect;
  const onClick = selectable
    ? (e: MouseEvent) => {
        e.stopPropagation();
        onSelect?.(node.id);
      }
    : undefined;

  const isDecoration = node.type === "DECORATION" || node.type === "PARTICLES" || !!node.asset;
  if (isDecoration) {
    return <DecorationNode node={node} base={base} selected={isSelected} selectable={selectable} onClick={onClick} />;
  }

  const children = node.children ?? [];
  if (children.length) {
    const style: CSSProperties = {
      ...base,
      ...(node.layout?.direction ? flexStyle(node.layout) : null),
      ...(selectable ? { cursor: "pointer" } : null),
      ...(isSelected ? SELECTION : null),
    };
    return (
      <div style={style} onClick={onClick}>
        {children.map((c) => (
          <RenderNode key={c.id} node={c} inFlow={!!node.layout?.direction} ctx={ctx} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  const ta = node.style?.textAlign ?? "center";
  const style: CSSProperties = {
    ...base,
    display: "flex",
    alignItems: verticalAlignItems(node.style?.verticalAlign),
    justifyContent: ta === "right" ? "flex-end" : ta === "left" ? "flex-start" : "center",
    ...leafOverflowStyle(node.style),
    gap: 6,
    ...(selectable ? { cursor: "pointer" } : null),
    ...(isSelected ? SELECTION : null),
  };
  return (
    <div style={style} onClick={onClick}>
      {renderLeaf(node, ctx)}
    </div>
  );
}

function renderLeaf(node: CompositionNode, ctx: RenderContext) {
  const c = node.content ?? {};
  switch (node.type) {
    case "PRODUCT_IMAGE":
    case "IMAGE": {
      const variable = c.variable ?? (c.source === "DYNAMIC" ? c.text : undefined);
      const src = resolveProductImage(variable, ctx);
      if (src) {
        return (
          // eslint-disable-next-line @next/next/no-img-element -- data/remote product URL, not a static asset
          <img
            src={src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: node.image?.fit ?? "contain", filter: "drop-shadow(0 16px 16px rgba(15,23,42,0.28))" }}
          />
        );
      }
      return (
        <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>Product image</span>
      );
    }
    case "ICON":
    case "AVATAR":
    case "LOGO": {
      const Icon = getIcon(c.icon);
      if (!Icon) return null;
      const size = Math.min(node.frame.width, node.frame.height);
      return <Icon style={{ fontSize: size }} />;
    }
    case "BADGE":
    case "LABEL": {
      const Icon = getIcon(c.icon);
      const text = resolveVariables(String(c.text ?? ""), ctx);
      const iconPos = c.iconPosition ?? (Icon ? "left" : "none");
      if (!Icon || iconPos === "none") return <span>{text}</span>;
      const iconEl = <Icon key="icon" style={{ fontSize: c.iconSize ?? (node.style?.fontSize ?? 12) + 2, flexShrink: 0 }} />;
      if (iconPos === "only") return iconEl;
      const textEl = text ? <span key="text">{text}</span> : null;
      return iconPos === "right" ? <>{textEl}{iconEl}</> : <>{iconEl}{textEl}</>;
    }
    case "CIRCLE":
    case "RECTANGLE":
    case "LINE":
    case "SHAPE":
    case "SPARKLE":
    case "DIVIDER":
    case "GRADIENT":
    case "PROGRESS_BAR":
      return null;
    default:
      return <span>{resolveVariables(String(c.text ?? c.label ?? c.value ?? ""), ctx)}</span>;
  }
}

function DecorationNode({
  node,
  base,
  selected,
  selectable,
  onClick,
}: {
  node: CompositionNode;
  base: CSSProperties;
  selected: boolean;
  selectable: boolean;
  onClick?: (e: MouseEvent) => void;
}) {
  const aid = node.asset?.assetId ?? "";
  const color = node.style?.color ?? "#FFFFFF";
  // Atmospheric CSS overlays (glow/vignette/spotlight/…) are soft full-area
  // fills, not distinct objects — they'd otherwise sit on top of and steal
  // every click meant for the real cloud/leaf/sparkle underneath them. They
  // stay click-through on canvas; select them from the Layers list instead.
  const isOverlay = CSS_ASSETS.has(aid);
  const click = isOverlay ? undefined : onClick;
  const interactive = selectable && !isOverlay;
  const common: CSSProperties = {
    ...base,
    // Decorations only need to catch clicks in editable contexts (a canvas
    // with onSelect wired up); static previews keep them pass-through so they
    // never block the real content sitting on top of them.
    pointerEvents: selectable && !isOverlay ? "auto" : "none",
    ...(selectable && !isOverlay ? { cursor: "pointer" } : null),
    ...(selected ? SELECTION : null),
  };

  if (aid === "glow" || aid === "product-glow" || aid === "spotlight" || aid === "radial-light") {
    return (
      <div
        onClick={click}
        style={{ ...common, background: `radial-gradient(circle at 50% 45%, ${color}59 0%, ${color}24 46%, ${color}00 72%)` }}
      />
    );
  }
  if (aid === "gradient-orb") {
    return (
      <div
        onClick={click}
        style={{ ...common, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${color}CC 0%, ${color}66 45%, ${color}00 75%)`, filter: "blur(6px)" }}
      />
    );
  }
  if (aid === "vignette") {
    return <div onClick={click} style={{ ...common, background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(15,23,42,0.32) 100%)" }} />;
  }
  if (aid === "product-shadow" || aid === "soft-shadow") {
    return <div onClick={click} style={{ ...common, borderRadius: "50%", background: "rgba(15,23,42,0.18)", filter: "blur(9px)" }} />;
  }
  // Shape primitives are plain painted boxes (radius carries the silhouette).
  if (aid.startsWith("shape-")) {
    const radius =
      aid === "shape-circle" || aid === "shape-ellipse" ? "50%"
      : aid === "shape-rounded" ? 16
      : aid === "shape-line" ? 999
      : 0;
    return <div onClick={click} style={{ ...common, background: color, borderRadius: radius }} />;
  }
  const svg = SVG_ASSETS[aid];
  if (svg) {
    // Real SVG art is mostly transparent inside its own bounding box (a
    // sparkle's viewBox dwarfs its tiny star, a leaf sprig has gaps between
    // leaves, dot grids have gaps between dots). Hit-testing the wrapper's
    // full rectangle would let those empty gaps swallow clicks meant for
    // whatever's layered underneath, so pixel-accurate hit-testing is scoped
    // to what the SVG actually paints instead — the wrapper stays
    // click-through, and only where an inner shape is painted.
    const html = interactive ? svg.replace("<svg ", '<svg pointer-events="visiblePainted" ') : svg;
    return (
      <div
        onClick={click}
        style={{ ...common, pointerEvents: interactive ? "none" : common.pointerEvents, color }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <div onClick={click} style={common} />;
}
