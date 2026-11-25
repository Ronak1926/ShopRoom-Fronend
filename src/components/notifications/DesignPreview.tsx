"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NotificationRenderer from "@/components/notifications/NotificationRenderer";
import PreviewBoundary, { PreviewUnavailable } from "@/components/notifications/PreviewBoundary";
import { EDITOR_CONTEXT } from "@/features/notifications/resolver";
import type {
  ElementAction,
  NotificationDesign,
  RenderContext,
} from "@/features/notifications/types";

/**
 * Live card preview of a design, rendered through the same renderer the Studio
 * canvas uses — never a stored screenshot, so a card can never drift from what
 * the template actually opens as.
 *
 * The card holds the banner's own 2:1 ratio because that IS the notification:
 * Android draws the app row, title and body itself, and only this image is
 * ours. Showing it at any other shape would be showing something that does not
 * exist.
 */
export default function DesignPreview({
  design,
  context = EDITOR_CONTEXT,
  isPlaying,
  onAction,
}: {
  design: NotificationDesign;
  context?: RenderContext;
  /** Off by default: a grid of cards animating at once is noisy, not useful. */
  isPlaying?: boolean;
  /** Makes elements with an onClick action tappable (the customer-facing overlay). */
  onAction?: (action: ElementAction) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Cards reflow with the grid, so measure rather than assume a width.
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

  const scale = useMemo(
    () => (width && design.canvas?.width ? width / design.canvas.width : 0),
    [width, design.canvas?.width],
  );

  return (
    <div ref={ref} className="relative block w-full overflow-hidden aspect-2/1">
      {!design.canvas && <PreviewUnavailable />}
      {scale > 0 && (
        <PreviewBoundary resetKey={design}>
          <NotificationRenderer
            design={design}
            context={context}
            scale={scale}
            isPlaying={isPlaying}
            onAction={onAction}
          />
        </PreviewBoundary>
      )}
    </div>
  );
}
