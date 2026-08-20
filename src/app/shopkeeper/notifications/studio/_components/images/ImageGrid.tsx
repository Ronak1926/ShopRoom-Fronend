"use client";

import { useState, type Ref } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import type { AssetRef } from "@/features/notifications/types";

export interface ImageTile {
  key: string;
  thumbUrl: string;
  fullUrl: string;
  width?: number;
  height?: number;
  credit?: string;
  attribution?: AssetRef["attribution"];
}

interface Props {
  tiles: ImageTile[];
  /** When set, the primary action reads "Replace" instead of "Add to Canvas". */
  replacing?: boolean;
  /** Overrides the primary action's label entirely (e.g. "Use as Background"). */
  actionLabel?: string;
  onAdd: (tile: ImageTile) => void;
  emptyLabel?: string;
  /**
   * Attached to the tile at `observeIndex` so an infinite-scroll observer can
   * trigger the next page once the user has scrolled that far in (Stock tab).
   */
  observeRef?: Ref<HTMLDivElement>;
  observeIndex?: number;
}

/** Real-thumbnail tile grid shared by the Uploads/Stock/Recent tabs — clicking Add inserts a real IMAGE element. */
export default function ImageGrid({
  tiles,
  replacing,
  actionLabel,
  onAdd,
  emptyLabel = "No images yet.",
  observeRef,
  observeIndex,
}: Props) {
  const [preview, setPreview] = useState<ImageTile | null>(null);

  if (!tiles.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-(--color-text-hint)">
        <ImageOutlinedIcon sx={{ fontSize: 26 }} />
        <p className="text-[12px]">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((tile, i) => (
          <div
            key={tile.key}
            ref={i === observeIndex ? observeRef : undefined}
            className="group relative aspect-square rounded-xl border border-(--color-border-default) overflow-hidden bg-(--color-bg-page)"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- remote/user asset thumbnail, not a static site asset */}
            <img src={tile.thumbUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onAdd(tile)}
                className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-white text-[11px] font-semibold text-(--color-text-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
              >
                <AddOutlinedIcon sx={{ fontSize: 14 }} />
                {actionLabel ?? (replacing ? "Replace" : "Add to Canvas")}
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Preview"
                  onClick={() => setPreview(tile)}
                  className="w-6 h-6 flex items-center justify-center rounded-md bg-white/15 text-white hover:bg-white/25 transition-colors cursor-pointer"
                >
                  <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
                </button>
                <button
                  type="button"
                  title="Copy image URL"
                  onClick={() => navigator.clipboard.writeText(tile.fullUrl)}
                  className="w-6 h-6 flex items-center justify-center rounded-md bg-white/15 text-white hover:bg-white/25 transition-colors cursor-pointer"
                >
                  <LinkOutlinedIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            </div>
            {tile.credit && (
              <span className="absolute bottom-0 inset-x-0 px-1.5 py-1 text-[9px] font-medium text-white bg-gradient-to-t from-black/70 to-transparent truncate pointer-events-none">
                {tile.credit}
              </span>
            )}
          </div>
        ))}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-8"
          onClick={() => setPreview(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- lightbox preview of a remote/user asset */}
          <img src={preview.fullUrl} alt="" className="max-w-full max-h-full rounded-lg shadow-(--shadow-lg)" />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <CloseOutlinedIcon sx={{ fontSize: 20 }} />
          </button>
        </div>
      )}
    </>
  );
}
