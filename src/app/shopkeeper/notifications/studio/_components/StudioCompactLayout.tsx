"use client";

import type { ReactNode } from "react";

export type MobileSheet = "tool" | "edit" | "layers" | "timeline";

/** What the panel under the canvas shows on phones and tablets. */
const MOBILE_SHEETS: { id: MobileSheet; label: string }[] = [
  { id: "tool", label: "Tools" },
  { id: "edit", label: "Edit" },
  { id: "layers", label: "Layers" },
  { id: "timeline", label: "Timeline" },
];

/** Panels are designed for a narrow rail, so on tablets they stay phone-width and centred. */
const MAX_PANEL_WIDTH = 560;

interface Props {
  sidebar: ReactNode;
  topBar: ReactNode;
  /** The horizontal tool row. */
  toolbar: ReactNode;
  canvas: ReactNode;
  timeline: ReactNode;
  overlay: ReactNode;
  screenWidth: number;
  sheet: MobileSheet;
  onSheetChange: (sheet: MobileSheet) => void;
  /** Each panel is told the width it should fill. */
  toolPanel: (width: number) => ReactNode;
  editPanel: (width: number) => ReactNode;
  layersPanel: (width: number) => ReactNode;
}

/**
 * The Studio on a phone or tablet: the canvas on top, the tool row, then tabs that show one
 * full-width panel at a time (Tools, Edit, Layers, Timeline).
 */
export default function StudioCompactLayout({
  sidebar,
  topBar,
  toolbar,
  canvas,
  timeline,
  overlay,
  screenWidth,
  sheet,
  onSheetChange,
  toolPanel,
  editPanel,
  layersPanel,
}: Props) {
  const width = Math.min(screenWidth, MAX_PANEL_WIDTH);
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-(--color-bg-page) text-(--color-text-primary)">
      {sidebar}
      {topBar}
      <div className="h-[38dvh] min-h-56 shrink-0 flex border-b border-(--color-border-default)">{canvas}</div>
      {toolbar}
      <nav className="flex shrink-0 border-b border-(--color-border-default) bg-(--color-bg-surface)" aria-label="Studio panels">
        {MOBILE_SHEETS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSheetChange(id)}
            className={`flex-1 h-10 text-[12px] font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
              sheet === id
                ? "border-(--color-brand-primary) text-(--color-brand-primary)"
                : "border-transparent text-(--color-text-secondary)"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="flex flex-1 min-h-0 justify-center overflow-hidden [&>*]:max-w-full">
        {sheet === "tool" && toolPanel(width)}
        {sheet === "edit" && editPanel(width)}
        {sheet === "layers" && layersPanel(width)}
        {sheet === "timeline" && <div className="flex flex-1 min-w-0">{timeline}</div>}
      </div>
      {overlay}
    </div>
  );
}
