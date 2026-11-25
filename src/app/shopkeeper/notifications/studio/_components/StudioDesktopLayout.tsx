"use client";

import type { ReactNode } from "react";
import ResizeHandle from "./ResizeHandle";
import { useResizable } from "../_hooks/useResizable";

interface Props {
  sidebar: ReactNode;
  topBar: ReactNode;
  toolbar: ReactNode;
  canvas: ReactNode;
  timeline: ReactNode;
  overlay: ReactNode;
  /** Each panel is told the width its resize handle currently gives it. */
  leftPanel: (width: number) => ReactNode;
  layersPanel: (width: number) => ReactNode;
  propertiesPanel: (width: number) => ReactNode;
  /** When set, shown in the right rail instead of the element inspector. */
  backgroundBuilder: ((width: number) => ReactNode) | null;
}

/**
 * The Studio on a wide screen: a tool rail and panel on the left, the canvas in the middle, the
 * inspector on the right, layers and timeline underneath. Every divider can be dragged, and the
 * widths live here, because only this layout has dividers.
 */
export default function StudioDesktopLayout({
  sidebar,
  topBar,
  toolbar,
  canvas,
  timeline,
  overlay,
  leftPanel,
  layersPanel,
  propertiesPanel,
  backgroundBuilder,
}: Props) {
  const [leftWidth, resizeLeft] = useResizable(240, 200, 420);
  const [rightWidth, resizeRight] = useResizable(288, 240, 460);
  const [bottomHeight, resizeBottom] = useResizable(224, 150, 440);
  const [layersWidth, resizeLayers] = useResizable(240, 180, 380);
  const [bgBuilderWidth, resizeBgBuilder] = useResizable(320, 280, 440);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-(--color-bg-page) text-(--color-text-primary) lg:flex-row">
      {sidebar}

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {topBar}

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {toolbar}

          <div className="flex flex-1 flex-col min-w-0">
            <div className="flex flex-1 min-h-0">
              {leftPanel(leftWidth)}
              <ResizeHandle orientation="vertical" onResize={resizeLeft} />
              {canvas}
            </div>

            <ResizeHandle orientation="horizontal" onResize={(d) => resizeBottom(-d)} />

            <div className="flex shrink-0" style={{ height: bottomHeight }}>
              {layersPanel(layersWidth)}
              <ResizeHandle orientation="vertical" onResize={resizeLayers} />
              {timeline}
            </div>
          </div>

          {backgroundBuilder ? (
            <>
              <ResizeHandle orientation="vertical" onResize={(d) => resizeBgBuilder(-d)} />
              {backgroundBuilder(bgBuilderWidth)}
            </>
          ) : (
            <>
              <ResizeHandle orientation="vertical" onResize={(d) => resizeRight(-d)} />
              {propertiesPanel(rightWidth)}
            </>
          )}
        </div>
      </div>

      {overlay}
    </div>
  );
}
