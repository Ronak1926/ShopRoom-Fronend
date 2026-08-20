"use client";

import { useRef, useState } from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { ACCEPTED_TYPES, type QueueItem } from "./useImageUploads";

interface Props {
  title: string;
  hint: string;
  queue: QueueItem[];
  onFiles: (files: FileList | File[]) => void;
  onRetry: (id: string) => void;
  onDismiss: (id: string) => void;
  multiple?: boolean;
}

/** Dashed drag & drop upload area plus its per-file progress/error queue. */
export default function UploadDropzone({
  title,
  hint,
  queue,
  onFiles,
  onRetry,
  onDismiss,
  multiple = true,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center text-center gap-2 rounded-xl border-2 border-dashed py-8 px-4 cursor-pointer transition-colors ${
          dragOver
            ? "border-(--color-brand-primary) bg-(--color-brand-primary-light)"
            : "border-(--color-border-strong) hover:border-(--color-brand-primary) hover:bg-(--color-bg-surface-hover)"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple={multiple}
          hidden
          onChange={(e) => e.target.files && onFiles(e.target.files)}
        />
        <CloudUploadOutlinedIcon sx={{ fontSize: 24, color: "var(--color-brand-primary)" }} />
        <p className="text-[12px] font-semibold text-(--color-text-primary)">{title}</p>
        <p className="text-[11px] text-(--color-text-hint)">{hint}</p>
        <p className="text-[10px] text-(--color-text-hint)">PNG, JPG, JPEG, WEBP · Max 10MB</p>
      </div>

      {queue.length > 0 && (
        <div className="flex flex-col gap-2">
          {queue.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-lg border border-(--color-border-default)">
              {/* eslint-disable-next-line @next/next/no-img-element -- local object-URL preview during upload */}
              <img src={item.previewUrl} alt="" className="w-10 h-10 rounded-md object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-(--color-text-primary) truncate">{item.file.name}</p>
                {item.status === "uploading" ? (
                  <div className="mt-1 h-1.5 rounded-full bg-(--color-bg-surface-hover) overflow-hidden">
                    <div className="h-full bg-(--color-brand-primary) transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                ) : (
                  <p className="text-[10px] text-(--color-danger) flex items-center gap-1 mt-0.5">
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: 12 }} />
                    {item.error}
                  </p>
                )}
              </div>
              {item.status === "error" && (
                <button
                  type="button"
                  title="Retry"
                  onClick={() => onRetry(item.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-(--color-brand-primary) hover:bg-(--color-brand-primary-light) transition-colors cursor-pointer"
                >
                  <RefreshOutlinedIcon sx={{ fontSize: 15 }} />
                </button>
              )}
              <button
                type="button"
                title="Dismiss"
                onClick={() => onDismiss(item.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
              >
                <CloseOutlinedIcon sx={{ fontSize: 15 }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
