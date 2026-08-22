"use client";

import { useRef, useState } from "react";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import NotificationRenderer from "@/components/notifications/NotificationRenderer";
import { EDITOR_CONTEXT } from "@/features/notifications/resolver";
import type { CompositionNode, Frame, NotificationDesign } from "@/features/notifications/types";
import { absoluteOffset, findPath } from "@/features/notifications/tree";
import SelectionOverlay, { type ResizeHandleId } from "./SelectionOverlay";

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
          <div className="w-80 h-140 rounded-[40px] bg-(--color-bg-surface-hover) animate-pulse" />
        )}
        {!loading && error && (
          <div className="text-[13px] text-(--color-danger) mt-16">{error}</div>
        )}
        {!loading && !error && design && (
          <div className="shrink-0 rounded-[40px] border-[6px] border-(--color-gray-900) overflow-hidden shadow-(--shadow-lg)">
            <div style={{ position: "relative" }}>
              <NotificationRenderer
                design={design}
                context={EDITOR_CONTEXT}
                scale={zoom}
                selectedId={selectedId}
                onSelect={onSelect}
                isPlaying={isPlaying}
                previewId={previewId}
              />
              {selectedNode && offset && (
                <SelectionOverlay
                  frame={selectedNode.frame}
                  scale={zoom}
                  offset={offset}
                  locked={!!selectedNode.locked}
                  onStart={startDrag}
                  onMove={move}
                  onResize={resize}
                  onRotate={rotate}
                  onEnd={endDrag}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
