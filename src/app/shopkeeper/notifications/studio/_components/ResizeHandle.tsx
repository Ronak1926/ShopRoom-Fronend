"use client";

import { useCallback } from "react";

interface Props {
  /** "vertical" = a vertical bar dragged left/right (resizes width);
   *  "horizontal" = a horizontal bar dragged up/down (resizes height). */
  orientation: "vertical" | "horizontal";
  /** Receives the signed pixel delta since the last pointer move. */
  onResize: (deltaPx: number) => void;
}

export default function ResizeHandle({ orientation, onResize }: Props) {
  const isVertical = orientation === "vertical";

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      let last = isVertical ? e.clientX : e.clientY;

      const move = (ev: PointerEvent) => {
        const cur = isVertical ? ev.clientX : ev.clientY;
        onResize(cur - last);
        last = cur;
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      };

      document.body.style.userSelect = "none";
      document.body.style.cursor = isVertical ? "col-resize" : "row-resize";
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [isVertical, onResize],
  );

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`group relative z-10 shrink-0 bg-(--color-border-default) hover:bg-(--color-brand-primary) transition-colors ${
        isVertical ? "w-px cursor-col-resize" : "h-px cursor-row-resize"
      }`}
    >
      {/* Invisible wider hit-area so the 1px line is easy to grab */}
      <span
        className={`absolute ${
          isVertical
            ? "inset-y-0 -left-1 -right-1"
            : "inset-x-0 -top-1 -bottom-1"
        }`}
      />
    </div>
  );
}
