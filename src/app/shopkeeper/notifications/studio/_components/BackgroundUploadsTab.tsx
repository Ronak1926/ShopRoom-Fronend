"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import { useImageUploads } from "./images/useImageUploads";
import UploadDropzone from "./images/UploadDropzone";
import ImageGrid, { type ImageTile } from "./images/ImageGrid";

interface Props {
  /** URL currently set as the canvas background image, if any. */
  currentImageUrl?: string;
  hasElements: boolean;
  onSetImage: (url: string) => void;
  onClearImage: () => void;
  onClearElements: () => void;
}

/**
 * Background → Uploads: use one photo as the entire notification background.
 * Lets a shopkeeper send a plain product shot without composing a layout.
 * Uploads share the same Cloudinary pipeline as the Images panel.
 */
export default function BackgroundUploadsTab({
  currentImageUrl,
  hasElements,
  onSetImage,
  onClearImage,
  onClearElements,
}: Props) {
  const { queue, assets, loading, addFiles, retry, dismiss } = useImageUploads();

  const tiles: ImageTile[] = assets.map((a) => ({
    key: a.id,
    thumbUrl: a.secureUrl,
    fullUrl: a.secureUrl,
    width: a.width ?? undefined,
    height: a.height ?? undefined,
  }));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] leading-relaxed text-(--color-text-secondary)">
        Use a photo as the whole background — upload a product shot and send it as-is, or layer text on top.
      </p>

      {currentImageUrl && (
        <div className="rounded-xl border border-(--color-brand-primary) bg-(--color-brand-primary-light) p-2.5">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-(--color-brand-primary) mb-1.5">
            <CheckCircleIcon sx={{ fontSize: 13 }} />
            Current background image
          </p>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- user's own uploaded asset */}
            <img
              src={currentImageUrl}
              alt=""
              className="w-14 h-14 shrink-0 rounded-lg object-cover border border-(--color-border-default)"
            />
            <button
              type="button"
              onClick={onClearImage}
              className="h-7 px-2.5 rounded-lg bg-(--color-bg-surface) text-[11px] font-semibold text-(--color-text-secondary) hover:text-(--color-danger) transition-colors cursor-pointer"
            >
              Remove image
            </button>
          </div>

          {hasElements && (
            <>
              <button
                type="button"
                onClick={onClearElements}
                className="mt-2 w-full flex items-center justify-center gap-1.5 h-8 rounded-lg bg-(--color-bg-surface) text-[11px] font-semibold text-(--color-brand-primary) hover:bg-white transition-colors cursor-pointer"
              >
                <AutoFixHighOutlinedIcon sx={{ fontSize: 14 }} />
                Clear everything else (photo only)
              </button>
              <p className="mt-1.5 text-[10px] leading-relaxed text-(--color-text-secondary)">
                Removes the text, badges and decorations on top. Undo (Ctrl+Z) brings them back.
              </p>
            </>
          )}
        </div>
      )}

      <UploadDropzone
        title="Upload Background Image"
        hint="Drag &amp; drop a photo here, or click to browse"
        queue={queue}
        onFiles={(files) => addFiles(files, (asset) => onSetImage(asset.secureUrl))}
        onRetry={retry}
        onDismiss={dismiss}
        multiple={false}
      />

      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2.5">
          Or pick an uploaded image
        </p>
        {loading ? (
          <div className="grid grid-cols-2 gap-2.5">
            {[0, 1].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-(--color-bg-surface-hover) animate-pulse" />
            ))}
          </div>
        ) : (
          <ImageGrid
            tiles={tiles}
            onAdd={(tile) => onSetImage(tile.fullUrl)}
            actionLabel="Use as Background"
            emptyLabel="No images yet. Upload a background photo above."
          />
        )}
      </div>
    </div>
  );
}
