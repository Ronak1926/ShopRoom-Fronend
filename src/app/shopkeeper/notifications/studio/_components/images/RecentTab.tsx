"use client";

import { useEffect, useState } from "react";
import { listAssets, type AssetSummary } from "@/features/notifications/api";
import { getRecentlyUsedImages } from "@/features/notifications/recentlyUsedImages";
import ImageGrid, { type ImageTile } from "./ImageGrid";

interface Props {
  replacing: boolean;
  onAdd: (tile: ImageTile) => void;
}

export default function RecentTab({ replacing, onAdd }: Props) {
  const [added, setAdded] = useState<AssetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const used = getRecentlyUsedImages();

  useEffect(() => {
    listAssets()
      .then((all) => setAdded(all.slice(0, 12)))
      .finally(() => setLoading(false));
  }, []);

  const usedTiles: ImageTile[] = used.map((u) => ({
    key: u.url,
    thumbUrl: u.url,
    fullUrl: u.url,
    credit: u.attribution?.photographer,
    attribution: u.attribution,
  }));
  const addedTiles: ImageTile[] = added.map((a) => ({
    key: a.id,
    thumbUrl: a.secureUrl,
    fullUrl: a.secureUrl,
    width: a.width ?? undefined,
    height: a.height ?? undefined,
  }));

  return (
    <div className="flex flex-col gap-5">
      <section>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2.5">
          Recently Used
        </p>
        <ImageGrid tiles={usedTiles} replacing={replacing} onAdd={onAdd} emptyLabel="No recently used images." />
      </section>

      <section>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint) mb-2.5">
          Recently Added
        </p>
        {loading ? (
          <div className="grid grid-cols-2 gap-2.5">
            {[0, 1].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-(--color-bg-surface-hover) animate-pulse" />
            ))}
          </div>
        ) : (
          <ImageGrid tiles={addedTiles} replacing={replacing} onAdd={onAdd} emptyLabel="No uploads yet." />
        )}
      </section>
    </div>
  );
}
