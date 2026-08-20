"use client";

import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import UploadsTab from "./images/UploadsTab";
import StockTab from "./images/StockTab";
import RecentTab from "./images/RecentTab";
import type { ImageTile } from "./images/ImageGrid";

type Tab = "uploads" | "stock" | "recent";
const TABS: Tab[] = ["uploads", "stock", "recent"];

interface Props {
  width: number;
  /** Set while ImageInspector's "Replace" is swapping an existing image's source. */
  replaceTargetName: string | null;
  onAdd: (tile: ImageTile) => void;
  onCancelReplace: () => void;
}

export default function ImagesPanel({ width, replaceTargetName, onAdd, onCancelReplace }: Props) {
  const [tab, setTab] = useState<Tab>("uploads");
  const replacing = !!replaceTargetName;

  return (
    <aside
      // width is drag-controlled, so it must be an inline style
      style={{ width }}
      className="shrink-0 flex flex-col bg-(--color-bg-surface) overflow-hidden"
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-(--color-text-primary)">Images</h2>
      </div>

      {replacing && (
        <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg bg-(--color-brand-primary-light) px-2.5 py-2">
          <p className="min-w-0 flex-1 text-[11px] font-medium text-(--color-brand-primary) truncate">
            Replacing image on &ldquo;{replaceTargetName}&rdquo;
          </p>
          <button
            type="button"
            onClick={onCancelReplace}
            title="Cancel replace"
            className="w-5 h-5 shrink-0 flex items-center justify-center rounded-md text-(--color-brand-primary) hover:bg-white/50 transition-colors cursor-pointer"
          >
            <CloseOutlinedIcon sx={{ fontSize: 13 }} />
          </button>
        </div>
      )}

      <div className="px-4 flex items-center gap-4 border-b border-(--color-border-default)">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`pb-2.5 text-[13px] font-medium capitalize border-b-2 -mb-px transition-colors cursor-pointer ${
              tab === t
                ? "border-(--color-brand-primary) text-(--color-brand-primary)"
                : "border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {tab === "uploads" && <UploadsTab replacing={replacing} onAdd={onAdd} />}
        {tab === "stock" && <StockTab replacing={replacing} onAdd={onAdd} />}
        {tab === "recent" && <RecentTab replacing={replacing} onAdd={onAdd} />}
      </div>
    </aside>
  );
}
