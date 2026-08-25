"use client";

import { useCallback } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Frame } from "@/features/notifications/types";

export type ResizeHandleId = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

interface Props {
  frame: Frame;
  scale: number;
  /** Canvas-space offset contributed by ancestor groups. */
  offset?: { x: number; y: number };
  locked?: boolean;
  onStart: () => void;
  onMove: (dx: number, dy: number) => void;
  onResize: (handle: ResizeHandleId, dx: number, dy: number) => void;
  onRotate: (deg: number) => void;
  onEnd: () => void;
  /** Corner radius for the selection box — matches the canvas when the
   *  selected element spans it, so it doesn't square off a rounded banner. */
  radius?: number;
}

const HANDLES: { h: ResizeHandleId; cx: number; cy: number; cursor: string }[] = [
  { h: "nw", cx: 0, cy: 0, cursor: "nwse-resize" },
  { h: "n", cx: 0.5, cy: 0, cursor: "ns-resize" },
  { h: "ne", cx: 1, cy: 0, cursor: "nesw-resize" },
  { h: "e", cx: 1, cy: 0.5, cursor: "ew-resize" },
  { h: "se", cx: 1, cy: 1, cursor: "nwse-resize" },
  { h: "s", cx: 0.5, cy: 1, cursor: "ns-resize" },
  { h: "sw", cx: 0, cy: 1, cursor: "nesw-resize" },
  { h: "w", cx: 0, cy: 0.5, cursor: "ew-resize" },
];

/**
 * Interactive move + resize handles drawn over the selected element. Reports
 * deltas in CANVAS pixels (screen delta / scale) so the caller can offset the
 * element's frame. Only used for top-level (absolutely-positioned) elements.
 */
export default function SelectionOverlay({
  frame,
  scale,
  offset = { x: 0, y: 0 },
  locked = false,
  onStart,
  onMove,
  onResize,
  onRotate,
  onEnd,
  radius = 0,
}: Props) {
  const beginDrag = useCallback(
    (e: ReactPointerEvent, apply: (dx: number, dy: number) => void) => {
      e.preventDefault();
      e.stopPropagation();
      const sx = e.clientX;
      const sy = e.clientY;
      onStart();
      const move = (ev: globalThis.PointerEvent) => apply((ev.clientX - sx) / scale, (ev.clientY - sy) / scale);
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        document.body.style.userSelect = "";
        onEnd();
      };
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [scale, onStart, onEnd],
  );

  // Rotation: track the pointer angle around the element's centre.
  const beginRotate = useCallback(
    (e: ReactPointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const box = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect();
      if (!box) return;
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const start = Math.atan2(e.clientY - cy, e.clientX - cx);
      const base = frame.rotation ?? 0;
      onStart();
      const move = (ev: globalThis.PointerEvent) => {
        const a = Math.atan2(ev.clientY - cy, ev.clientX - cx);
        onRotate(Math.round(base + ((a - start) * 180) / Math.PI));
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        document.body.style.userSelect = "";
        onEnd();
      };
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [frame.rotation, onStart, onRotate, onEnd],
  );

  const accent = locked ? "var(--color-text-hint)" : "var(--color-brand-primary)";

  return (
    <div
      style={{
        position: "absolute",
        left: (frame.x + offset.x) * scale,
        top: (frame.y + offset.y) * scale,
        width: frame.width * scale,
        height: frame.height * scale,
        boxSizing: "border-box",
        zIndex: 9999,
        // A plain div with default pointer-events still wins hit-testing and
        // blocks whatever's underneath even without a click handler, so the
        // whole overlay must be non-interactive too when locked — otherwise
        // this wrapper alone (covering the selected frame, which for a
        // locked scene background is the entire canvas) silently eats every
        // click meant for a different element.
        pointerEvents: locked ? "none" : undefined,
      }}
    >
      <div
        onPointerDown={locked ? undefined : (e) => beginDrag(e, (dx, dy) => onMove(dx, dy))}
        style={{
          position: "absolute",
          inset: 0,
          // A locked node (often the full-canvas scene background) still
          // shows its outline so you can see it's selected, but the box must
          // not sit there catching clicks — otherwise it silently blocks you
          // from clicking through to any other element underneath it.
          pointerEvents: locked ? "none" : "auto",
          cursor: locked ? "not-allowed" : "move",
          outline: `2px solid ${accent}`,
          borderRadius: radius || undefined,
        }}
      />
      {!locked && (
        <>
          <div
            onPointerDown={beginRotate}
            title="Rotate"
            style={{
              position: "absolute",
              left: "50%",
              top: -26,
              width: 14,
              height: 14,
              transform: "translateX(-50%)",
              background: "#fff",
              border: `1.5px solid ${accent}`,
              borderRadius: "50%",
              cursor: "grab",
            }}
          />
          {HANDLES.map(({ h, cx, cy, cursor }) => (
            <div
              key={h}
              onPointerDown={(e) => beginDrag(e, (dx, dy) => onResize(h, dx, dy))}
              style={{
                position: "absolute",
                left: `${cx * 100}%`,
                top: `${cy * 100}%`,
                width: 10,
                height: 10,
                transform: "translate(-50%,-50%)",
                background: "#fff",
                border: `1.5px solid ${accent}`,
                borderRadius: 2,
                cursor,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
