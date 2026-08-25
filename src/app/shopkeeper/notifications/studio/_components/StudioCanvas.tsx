"use client";

import { useRef, useState } from "react";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";
import NotificationRenderer from "@/components/notifications/NotificationRenderer";
import { EDITOR_CONTEXT } from "@/features/notifications/resolver";
import type { CompositionNode, Frame, NotificationDesign } from "@/features/notifications/types";
import { absoluteOffset, findPath } from "@/features/notifications/tree";
import SelectionOverlay, { type ResizeHandleId } from "./SelectionOverlay";


/**
 * What each platform actually does with the notification image.
 * Verified against platform docs: Windows toast hero images are 364×180 and
 * Chrome web push recommends 360×180 — both 2:1, same as Android's big picture.
 * The catch on desktop is that OS/browser combinations crop differently, so
 * anything important has to sit away from the edges.
 */
const PREVIEW_TARGETS = {
  mobile: {
    label: "Mobile",
    // Rendered width of the image area on a phone notification.
    width: 360,
    note: "Android big picture · iOS attachment. The system draws the app icon, name, time, title and body around this image.",
    specs: "Android big picture 2:1",
    safeInsetPct: 0,
  },
  desktop: {
    label: "Desktop",
    // Windows toast hero image width at 100% scaling.
    width: 364,
    note: "Windows toast hero image and Chrome web push both render this at 2:1. Different OS and browser versions crop the edges differently, so keep the headline, price and product inside the guide.",
    specs: "Windows toast hero 364×180 · Chrome web push 360×180",
    // Cross-platform crop guard. 5% is the value every shipped template is
    // audited against, so the guide flags real problems rather than crying wolf.
    safeInsetPct: 5,
  },
} as const;

/** Corner radius the OS applies to the notification image, in design units. */
const RADIUS = 16;

const VIEWS = [
  { id: "mobile", label: "Mobile Preview", icon: SmartphoneOutlinedIcon },
  { id: "desktop", label: "Desktop Preview", icon: DesktopWindowsOutlinedIcon },
] as const;

interface Props {
  design: NotificationDesign | null;
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBeginInteraction: () => void;
  onUpdateLive: (id: string, patch: (n: CompositionNode) => CompositionNode) => void;
  onEndInteraction: () => void;
  isPlaying?: boolean;
  previewId?: string | null;
}

function applyResize(o: Frame, h: ResizeHandleId, dx: number, dy: number): Partial<Frame> {
  let { x, y, width, height } = o;
  if (h.includes("e")) width = Math.max(8, o.width + dx);
  if (h.includes("s")) height = Math.max(8, o.height + dy);
  if (h.includes("w")) {
    width = Math.max(8, o.width - dx);
    x = o.x + (o.width - width);
  }
  if (h.includes("n")) {
    height = Math.max(8, o.height - dy);
    y = o.y + (o.height - height);
  }
  return { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) };
}

export default function StudioCanvas({
  design,
  loading,
  error,
  selectedId,
  onSelect,
  onBeginInteraction,
  onUpdateLive,
  onEndInteraction,
  isPlaying,
  previewId,
}: Props) {
  const [view, setView] = useState<"mobile" | "desktop">("mobile");
  const [zoom, setZoom] = useState(1);
  const [showCropGuide, setShowCropGuide] = useState(false);
  const dragOrigin = useRef<Frame | null>(null);

  // Resolve the selection anywhere in the tree. Nodes laid out by a flex parent
  // are positioned by that parent, so they get no drag overlay (edit via panel).
  const path = design && selectedId ? findPath(design.elements, selectedId) : null;
  const offset = path ? absoluteOffset(path.parents) : null;
  const selectedNode = path && offset ? path.node : null;

  const startDrag = () => {
    if (selectedNode) {
      dragOrigin.current = { ...selectedNode.frame };
      onBeginInteraction();
    }
  };
  const move = (dx: number, dy: number) => {
    const o = dragOrigin.current;
    if (!o || !selectedId) return;
    onUpdateLive(selectedId, (n) => ({ ...n, frame: { ...n.frame, x: Math.round(o.x + dx), y: Math.round(o.y + dy) } }));
  };
  const resize = (h: ResizeHandleId, dx: number, dy: number) => {
    const o = dragOrigin.current;
    if (!o || !selectedId) return;
    onUpdateLive(selectedId, (n) => ({ ...n, frame: { ...n.frame, ...applyResize(o, h, dx, dy) } }));
  };
  const rotate = (deg: number) => {
    if (!selectedId) return;
    onUpdateLive(selectedId, (n) => ({ ...n, frame: { ...n.frame, rotation: deg } }));
  };
  const endDrag = () => {
    dragOrigin.current = null;
    onEndInteraction();
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-(--color-bg-page)">
      {/* Canvas top controls */}
      <div className="shrink-0 flex items-center justify-center gap-4 px-6 py-3 relative">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-(--color-bg-surface) border border-(--color-border-default)">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                view === id
                  ? "bg-(--color-brand-primary-light) text-(--color-brand-primary)"
                  : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
              }`}
            >
              <Icon sx={{ fontSize: 16 }} />
              {label}
            </button>
          ))}
        </div>

        {PREVIEW_TARGETS[view].safeInsetPct > 0 && (
          <button
            type="button"
            onClick={() => setShowCropGuide((v) => !v)}
            title="Show the area that stays visible across desktop platforms"
            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
              showCropGuide
                ? "border-(--color-brand-alert) bg-(--color-brand-alert-light) text-(--color-brand-alert)"
                : "border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover)"
            }`}
          >
            <CropFreeOutlinedIcon sx={{ fontSize: 14 }} />
            Crop guide
          </button>
        )}

        <div className="absolute right-6 flex items-center gap-1 h-8 px-1 rounded-lg bg-(--color-bg-surface) border border-(--color-border-default)">
          <button
            type="button"
            title="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
            className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            <RemoveOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
          <span className="text-[12px] font-medium text-(--color-text-primary) w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            title="Zoom in"
            onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))}
            className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            <AddOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="flex-1 min-h-0 overflow-auto flex items-start justify-center py-8 px-6">
        {loading && (
          <div className="w-[560px] h-[160px] rounded-2xl bg-(--color-bg-surface-hover) animate-pulse" />
        )}
        {!loading && error && (
          <div className="text-[13px] text-(--color-danger) mt-16">{error}</div>
        )}
        {!loading && !error && design && (() => {
          const target = PREVIEW_TARGETS[view];
          // Logical design size is fixed; each platform just renders it at its
          // own width, so the preview scales rather than reflows.
          const fit = (target.width / design.canvas.width) * zoom;
          const inset = target.safeInsetPct;
          return (
          <div className="shrink-0 flex flex-col items-center gap-4">
            <p className="text-[11px] text-(--color-text-hint)">
              Design your notification content. Outer notification UI is handled by the system.
            </p>
            {/* Only the banner itself — no phone frame, no app row, no system
                chrome. The rounded corners and soft shadow ARE the boundary,
                so no outline is needed to show where the canvas ends. */}
            <div style={{ position: "relative" }}>
              {/* Clips just the render, so the selection handles that sit
                  outside the image stay reachable. */}
              <div
                style={{
                  borderRadius: RADIUS * fit,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.13)",
                }}
              >
                <NotificationRenderer
                  design={design}
                  context={EDITOR_CONTEXT}
                  scale={fit}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  isPlaying={isPlaying}
                  previewId={previewId}
                />
              </div>
              {inset > 0 && showCropGuide && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: `${inset}%`, bottom: `${inset}%`, left: `${inset}%`, right: `${inset}%`,
                    borderRadius: (RADIUS / 2) * fit,
                    outline: "1px dashed var(--color-brand-alert)",
                    opacity: 0.4,
                  }}
                />
              )}
              {selectedNode && offset && (
                <SelectionOverlay
                  frame={selectedNode.frame}
                  scale={fit}
                  offset={offset}
                  locked={!!selectedNode.locked}
                  radius={
                    // A full-canvas selection (locked scene background) should
                    // trace the banner's rounded corners, not square it off.
                    selectedNode.frame.width >= design.canvas.width - 1 &&
                    selectedNode.frame.height >= design.canvas.height - 1
                      ? RADIUS * fit
                      : 0
                  }
                  onStart={startDrag}
                  onMove={move}
                  onResize={resize}
                  onRotate={rotate}
                  onEnd={endDrag}
                />
              )}
            </div>

            <div className="w-full max-w-[560px] rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) px-4 py-3">
              <p className="text-[12px] font-semibold text-(--color-text-primary) mb-1.5">
                {target.label} notification · this is your content
              </p>
              <p className="text-[11px] leading-relaxed text-(--color-text-secondary)">{target.note}</p>
              {inset > 0 && showCropGuide && (
                <p className="mt-1.5 text-[11px] leading-relaxed text-(--color-brand-alert)">
                  The dashed guide is the crop-safe area — content outside it may be trimmed on some desktops.
                </p>
              )}
              <p className="mt-2 text-[10px] text-(--color-text-hint)">
                Design {design.canvas.width} × {design.canvas.height} · {target.specs}
              </p>
            </div>
          </div>
          );
        })()}
      </div>
    </div>
  );
}
