"use client";

/**
 * useImageUploads — shared upload queue + asset list for the Images panel.
 * Used by both the Uploads tab and the Product tab so the base64/progress/
 * retry handling lives in one place.
 */

import { useCallback, useEffect, useState } from "react";
import { listAssets, uploadAsset, type AssetSummary } from "@/features/notifications/api";

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_BYTES = 10 * 1024 * 1024;

export interface QueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "uploading" | "error";
  progress: number;
  error?: string;
}

export function useImageUploads() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [assets, setAssets] = useState<AssetSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setAssets(await listAssets());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadOne = useCallback(async (item: QueueItem) => {
    try {
      const dataUri = await readAsDataUri(item.file);
      const { width, height } = await measureImage(item.previewUrl);
      const asset = await uploadAsset(
        dataUri,
        { width, height, sizeBytes: item.file.size },
        (pct) => setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, progress: pct } : i))),
      );
      setQueue((q) => q.filter((i) => i.id !== item.id));
      URL.revokeObjectURL(item.previewUrl);
      setAssets((prev) => [asset, ...prev]);
      return asset;
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Upload failed";
      setQueue((q) => q.map((i) => (i.id === item.id ? { ...i, status: "error", error: message } : i)));
      return null;
    }
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[], onUploaded?: (asset: AssetSummary) => void) => {
      const items: QueueItem[] = [];
      for (const file of Array.from(files)) {
        if (!ACCEPTED_TYPES.includes(file.type)) continue;
        if (file.size > MAX_BYTES) continue;
        items.push({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          status: "uploading",
          progress: 0,
        });
      }
      if (!items.length) return;
      setQueue((q) => [...items, ...q]);
      items.forEach(async (item) => {
        const asset = await uploadOne(item);
        if (asset && onUploaded) onUploaded(asset);
      });
    },
    [uploadOne],
  );

  const retry = useCallback(
    (id: string) => {
      setQueue((q) => {
        const item = q.find((i) => i.id === id);
        if (item) uploadOne({ ...item, status: "uploading" });
        return q.map((i) => (i.id === id ? { ...i, status: "uploading", progress: 0, error: undefined } : i));
      });
    },
    [uploadOne],
  );

  const dismiss = useCallback((id: string) => {
    setQueue((q) => {
      const item = q.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return q.filter((i) => i.id !== id);
    });
  }, []);

  return { queue, assets, loading, addFiles, retry, dismiss, refresh };
}

function readAsDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function measureImage(url: string): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({});
    img.src = url;
  });
}
