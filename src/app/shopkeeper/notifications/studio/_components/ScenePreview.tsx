"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotificationRenderer from "@/components/notifications/NotificationRenderer";
import { EDITOR_CONTEXT } from "@/features/notifications/resolver";
import type { Scene } from "@/features/notifications/scenes";
import type { NotificationDesign } from "@/features/notifications/types";

const CANVAS_W = 320;
const CANVAS_H = 560;

/**
 * Live thumbnail of a scene — renders the real composition (background +
 * decoration layers) through the same generic renderer the canvas uses, scaled
 * to fit the card. Never a flat screenshot.
 */
export default function ScenePreview({ scene, height }: { scene: Scene; height: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  // The panel is drag-resizable, so measure the card instead of assuming a width.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const design = useMemo<NotificationDesign>(
    () => ({
      schemaVersion: 2,
      id: scene.id,
      name: scene.name,
      category: "CUSTOM",
      status: "DRAFT",
      canvas: { width: CANVAS_W, height: CANVAS_H, background: scene.background },
      elements: scene.elements,
      metadata: { createdAt: "", updatedAt: "", source: "SHOPROOM_TEMPLATE" },
    }),
    [scene],
  );

  const scale = width ? width / CANVAS_W : 0;
  // Centre the decorated band vertically inside the short card.
  const offsetY = scale ? Math.max(0, (CANVAS_H * scale - height) / 2) : 0;

  return (
    <span
      ref={ref}
      // thumbnail geometry is measured at runtime, so it must be an inline style
      style={{ display: "block", position: "relative", height, overflow: "hidden" }}
    >
      {scale > 0 && (
        <span style={{ position: "absolute", top: -offsetY, left: 0 }}>
          <NotificationRenderer design={design} context={EDITOR_CONTEXT} scale={scale} />
        </span>
      )}
    </span>
  );
}
