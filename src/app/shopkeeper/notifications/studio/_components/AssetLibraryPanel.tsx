"use client";

import LibraryGrid from "./LibraryGrid";
import type { LibraryGroup, LibraryItem } from "@/features/notifications/sceneLibrary";

interface Props {
  width: number;
  title: string;
  groups: LibraryGroup[];
  onInsert: (item: LibraryItem) => void;
}

/**
 * Generic library browser used by Shapes / Decorations / Effects. Clicking a
 * tile inserts a real DECORATION element into the document (not a mockup).
 */
export default function AssetLibraryPanel({ width, title, groups, onInsert }: Props) {
  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-y-auto"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">{title}</h2>
      </div>

      <div className="px-4 pb-4">
        <LibraryGrid groups={groups} onInsert={onInsert} searchPlaceholder={`Search ${title.toLowerCase()}...`} />
      </div>
    </aside>
  );
}
