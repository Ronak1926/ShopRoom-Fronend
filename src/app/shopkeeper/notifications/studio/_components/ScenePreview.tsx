"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotificationRenderer from "@/components/notifications/NotificationRenderer";
import { EDITOR_CONTEXT } from "@/features/notifications/resolver";
import type { Scene } from "@/features/notifications/scenes";
import type { NotificationDesign } from "@/features/notifications/types";

// Must match the banner scenes are composed for, or the thumbnail shows a
// different crop than the canvas does once the scene is applied.
const CANVAS_W = 400;
const CANVAS_H = 200;

/**
 * Live thumbnail of a scene — renders the real composition (background +
 * decoration layers) through the same generic renderer the canvas uses, scaled
 * to fit the card. Never a flat screenshot.
 *
 * The card carries the banner's own 2:1 ratio rather than a fixed height, so
 * what the picker shows is the whole scene at the shape it applies at — no
 * crop and no letterbox.
 */
export default function ScenePreview({ scene }: { scene: Scene }) {
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

  return (
    <span ref={ref} className="block relative overflow-hidden aspect-2/1">
      {scale > 0 && <NotificationRenderer design={design} context={EDITOR_CONTEXT} scale={scale} />}
    </span>
  );
}
