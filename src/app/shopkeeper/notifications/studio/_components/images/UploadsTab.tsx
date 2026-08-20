"use client";

import { useCallback, useState } from "react";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { apiClient } from "@/utils/apiClient";
import { getCookie } from "@/utils/cookieUtils";
import ImageGrid, { type ImageTile } from "./ImageGrid";
import UploadDropzone from "./UploadDropzone";
import { useImageUploads } from "./useImageUploads";

interface Props {
  replacing: boolean;
  onAdd: (tile: ImageTile) => void;
}

export default function UploadsTab({ replacing, onAdd }: Props) {
  const { queue, assets, loading, addFiles, retry, dismiss } = useImageUploads();
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const addShopLogo = useCallback(async () => {
    try {
      const { data } = await apiClient.get<{ shop: { logoUrl: string | null } }>("/api/shop/dashboard", {
        headers: { Authorization: `Bearer ${getCookie("shopkeeper_token")}` },
      });
      if (data.shop.logoUrl) {
        onAdd({ key: "shop-logo", thumbUrl: data.shop.logoUrl, fullUrl: data.shop.logoUrl, credit: "Shop logo" });
      }
    } catch {
      // No shop profile yet — silently no-op, quick-add is opportunistic.
    }
  }, [onAdd]);

  const sortedAssets = [...assets].sort((a, b) =>
    sort === "newest"
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const tiles: ImageTile[] = sortedAssets.map((a) => ({
    key: a.id,
    thumbUrl: a.secureUrl,
    fullUrl: a.secureUrl,
    width: a.width ?? undefined,
    height: a.height ?? undefined,
  }));

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={addShopLogo}
        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-(--color-border-default) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
      >
        <span className="w-8 h-8 rounded-lg bg-(--color-brand-primary-light) flex items-center justify-center shrink-0">
          <StorefrontOutlinedIcon sx={{ fontSize: 17, color: "var(--color-brand-primary)" }} />
        </span>
        <span className="text-left">
          <span className="block text-[12px] font-semibold text-(--color-text-primary)">Add Shop Logo</span>
          <span className="block text-[10px] text-(--color-text-hint)">Insert your shop&apos;s logo from your profile</span>
        </span>
      </button>

      <UploadDropzone
        title="Upload Images"
        hint="Drag &amp; drop images here, or click to browse"
        queue={queue}
        onFiles={addFiles}
        onRetry={retry}
        onDismiss={dismiss}
      />

      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-(--color-text-hint)">
          My Images {assets.length ? `(${assets.length})` : ""}
        </p>
        <div className="flex items-center gap-1.5">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            className="h-7 px-1.5 rounded-md border border-(--color-border-default) bg-(--color-bg-input) text-[10px] font-medium text-(--color-text-primary) cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button
            type="button"
            title={view === "grid" ? "List view" : "Grid view"}
            onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-(--color-border-default) text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
          >
            {view === "grid" ? <ViewListOutlinedIcon sx={{ fontSize: 14 }} /> : <GridViewOutlinedIcon sx={{ fontSize: 14 }} />}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-(--color-bg-surface-hover) animate-pulse" />
          ))}
        </div>
      ) : view === "grid" ? (
        <ImageGrid
          tiles={tiles}
          replacing={replacing}
          onAdd={onAdd}
          emptyLabel="No images yet. Upload your first image to start building your notification."
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          {tiles.map((tile) => (
            <button
              key={tile.key}
              type="button"
              onClick={() => onAdd(tile)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg border border-(--color-border-default) hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded asset thumbnail */}
              <img src={tile.thumbUrl} alt="" className="w-10 h-10 rounded-md object-cover shrink-0" />
              <span className="text-[11px] text-(--color-text-secondary)">
                {tile.width && tile.height ? `${tile.width} × ${tile.height}` : "Image"}
              </span>
            </button>
          ))}
          {!tiles.length && <p className="text-[12px] text-(--color-text-hint) py-6 text-center">No images yet.</p>}
        </div>
      )}
    </div>
  );
}
