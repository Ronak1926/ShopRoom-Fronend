"use client";

import { useState } from "react";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

interface Props {
  codes: string[];
  onDone: () => void;
}

/** Recovery codes are shown exactly once: the person must have them somewhere safe before moving on. */
export default function RecoveryCodesPanel({ codes, onDone }: Props) {
  const [copied, setCopied] = useState(false);
  const text = codes.join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([`ShopRoom recovery codes\nEach works once. Keep them somewhere safe.\n\n${text}\n`], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "shoproom-recovery-codes.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-(--color-text-primary)">Save these recovery codes now. They are shown only once, and each works one time if you lose your phone.</p>
      <ul className="grid grid-cols-2 gap-2 rounded-lg bg-(--color-bg-surface-hover) p-3 font-mono text-[13px] text-(--color-text-primary)">
        {codes.map((code) => (
          <li key={code} className="select-all">
            {code}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex h-9 items-center gap-1.5 px-4 rounded-lg text-[13px] font-semibold text-(--color-text-secondary) bg-(--color-bg-surface) border border-(--color-border-default) cursor-pointer hover:bg-(--color-bg-surface-hover)"
        >
          <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={download}
          className="inline-flex h-9 items-center gap-1.5 px-4 rounded-lg text-[13px] font-semibold text-(--color-text-secondary) bg-(--color-bg-surface) border border-(--color-border-default) cursor-pointer hover:bg-(--color-bg-surface-hover)"
        >
          <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
          Download
        </button>
        <button
          type="button"
          onClick={onDone}
          className="h-9 px-4 rounded-lg text-[13px] font-semibold text-white bg-(--color-brand-primary) hover:bg-(--color-brand-primary-active) border-0 cursor-pointer"
        >
          I&apos;ve saved them
        </button>
      </div>
    </div>
  );
}
