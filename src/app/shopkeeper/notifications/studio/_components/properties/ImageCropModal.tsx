"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import type { ImageCrop } from "@/features/notifications/types";
import { Slider } from "./fields";

interface Props {
  imageUrl: string;
  aspect: number;
  initialCrop?: ImageCrop;
  onApply: (crop: ImageCrop) => void;
  onCancel: () => void;
}

/** Modal crop editor — non-destructive, writes a fraction rect back onto the node's image.crop. */
export default function ImageCropModal({ imageUrl, aspect, initialCrop, onApply, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  // The first arg is the crop in PERCENTAGES of the natural image (the second
  // is raw pixels) — image.crop stores fractions, so percentages are what we
  // want, scaled to 0–1 and clamped to stay inside the schema's bounds.
  const onCropComplete = useCallback((croppedAreaPercent: Area) => {
    setArea(croppedAreaPercent);
  }, []);

  function apply() {
    if (!area) return;
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v / 100));
    onApply({
      x: clamp01(area.x),
      y: clamp01(area.y),
      width: Math.max(0.01, clamp01(area.width)),
      height: Math.max(0.01, clamp01(area.height)),
    });
  }

  function reset() {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-(--color-bg-surface) shadow-(--shadow-lg) overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border-default)">
          <h3 className="text-[14px] font-bold text-(--color-text-primary)">Crop Image</h3>
          <button
            type="button"
            title="Reset"
            onClick={reset}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            <RestartAltOutlinedIcon sx={{ fontSize: 17 }} />
          </button>
        </div>

        <div className="relative w-full bg-(--color-bg-page)" style={{ height: 340 }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            initialCroppedAreaPercentages={
              initialCrop
                ? { x: initialCrop.x * 100, y: initialCrop.y * 100, width: initialCrop.width * 100, height: initialCrop.height * 100 }
                : undefined
            }
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-t border-(--color-border-default)">
          <span className="text-[12px] text-(--color-text-secondary) shrink-0">Zoom</span>
          <Slider value={zoom} min={1} max={3} step={0.05} onChange={setZoom} />
        </div>

        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-lg border border-(--color-border-default) text-[12px] font-semibold text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            className="h-9 rounded-lg bg-(--color-brand-primary) text-[12px] font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
