"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DesignPreview from "@/components/notifications/DesignPreview";
import { UPGRADE_HREF } from "@/features/notifications/plan";
import type { CompositionNode } from "@/features/notifications/types";
import type { useNotificationDesign } from "../_hooks/useNotificationDesign";
import { ACCEPTED_TYPES, MAX_BYTES, useImageUploads } from "./images/useImageUploads";
import { quickEditFields, type QuickField } from "../_utils/quickEditFields";

type Studio = ReturnType<typeof useNotificationDesign>;

/**
 * Quick edit — the 1 Month plan's editor. A template's words and photos are
 * the only things that change; layout, colours and animation stay as designed.
 * Every edit autosaves through the same path as the full Studio.
 */
export default function QuickEditor({ studio }: { studio: Studio }) {
  const [playing, setPlaying] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploads = useImageUploads();
  const fileInput = useRef<HTMLInputElement>(null);
  /** The photo element the next chosen file replaces. */
  const [replacing, setReplacing] = useState<string | null>(null);
  const fields = useMemo(() => (studio.design ? quickEditFields(studio.design) : []), [studio.design]);

  if (studio.loading) {
    return <QuickEditorSkeleton />;
  }
  if (studio.error || !studio.design) {
    return <p className="m-6 text-[13px] text-(--color-danger-text)">{studio.error ?? "Could not open this design."}</p>;
  }

  function setText(field: QuickField, value: string) {
    studio.updateElement(field.id, (n: CompositionNode) => ({
      ...n,
      content: { ...n.content, [field.kind === "label" ? "label" : "text"]: value },
    }));
    // The pill's initial follows the shop name.
    if (field.id === "shop-name" && value.trim()) {
      studio.updateElement("shop-initial", (n) => ({ ...n, content: { ...n.content, text: value.trim().charAt(0).toUpperCase() } }));
    }
  }

  function pickPhoto(id: string) {
    setReplacing(id);
    setUploadError(null);
    fileInput.current?.click();
  }

  function onFile(files: FileList | null) {
    const target = replacing;
    const file = files?.[0];
    if (!target || !file) return;
    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_BYTES) {
      setUploadError("Use a PNG, JPG or WebP photo under 10 MB.");
      return;
    }
    uploads.addFiles([file], (asset) => {
      studio.updateElement(target, (n) => ({
        ...n,
        asset: { type: "IMAGE", url: asset.secureUrl, ...(asset.width ? { naturalWidth: asset.width } : {}), ...(asset.height ? { naturalHeight: asset.height } : {}) },
        image: { ...n.image, crop: undefined },
      }));
    });
  }

  const uploading = uploads.queue.some((i) => i.status === "uploading");
  const failed = uploads.queue.find((i) => i.status === "error");

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto grid max-w-6xl gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
        <section>
          <div className="overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-(--shadow-sm)">
            <DesignPreview design={studio.design} isPlaying={playing} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-(--color-border-default) px-3 text-[12.5px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer"
            >
              {playing ? <PauseOutlinedIcon sx={{ fontSize: 17 }} /> : <PlayArrowOutlinedIcon sx={{ fontSize: 17 }} />}
              {playing ? "Stop" : "Play animation"}
            </button>
            <Link
              href="/shopkeeper/notifications/send"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-(--color-brand-primary) px-3 text-[12.5px] font-semibold text-(--color-text-on-brand) hover:bg-(--color-brand-primary-hover) transition-colors"
            >
              <SendOutlinedIcon sx={{ fontSize: 16 }} />
              Send it
            </Link>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-(--color-brand-primary-light) px-4 py-3 text-[12px] leading-relaxed text-(--color-text-secondary)">
            <LockOutlinedIcon sx={{ fontSize: 15 }} className="text-(--color-brand-primary)" />
            Quick edit: change the words and photos. Moving, restyling and animating elements is part of the full editor on 2 Months.
            <Link href={UPGRADE_HREF} className="font-semibold text-(--color-brand-primary) hover:underline">
              See plans
            </Link>
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-[14px] font-semibold text-(--color-text-primary)">Your details</h2>
          {fields.map((field) =>
            field.kind === "photo" ? (
              <div key={field.id} className="rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) p-3">
                <p className="text-[12px] font-semibold text-(--color-text-primary)">{field.label}</p>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => pickPhoto(field.id)}
                  className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-(--color-border-strong) text-[12.5px] font-semibold text-(--color-text-secondary) hover:border-(--color-brand-primary) hover:text-(--color-brand-primary) transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60"
                >
                  <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 17 }} />
                  {uploading && replacing === field.id ? "Uploading…" : "Use my photo"}
                </button>
              </div>
            ) : (
              <label key={field.id} className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold text-(--color-text-primary)">{field.label}</span>
                <input
                  value={field.value}
                  maxLength={80}
                  onChange={(e) => setText(field, e.target.value)}
                  className="h-10 rounded-lg border border-(--color-border-default) bg-(--color-bg-input) px-3 text-[13px] text-(--color-text-primary) outline-none focus:border-(--color-brand-primary)"
                />
              </label>
            ),
          )}
          {(uploadError || failed) && (
            <p className="text-[12px] text-(--color-danger-text)">{uploadError ?? failed?.error}</p>
          )}
          {studio.saveState === "error" && (
            <p className="text-[12px] text-(--color-danger-text)">Your last change could not be saved. Please try again.</p>
          )}
          <p className="text-[11px] text-(--color-text-hint)">Keep the words short so they fit the banner. Changes save automatically.</p>
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files);
              e.target.value = "";
            }}
          />
        </section>
      </div>
    </div>
  );
}

function QuickEditorSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-6xl animate-pulse gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
      <div className="aspect-2/1 rounded-2xl bg-(--color-bg-surface-hover)" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-14 rounded-lg bg-(--color-bg-surface-hover)" />
        ))}
      </div>
    </div>
  );
}
