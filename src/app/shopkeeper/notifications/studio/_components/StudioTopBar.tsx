"use client";

import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { SaveState } from "../_hooks/useNotificationDesign";

interface Props {
  designName: string;
  saveState: SaveState;
  savedAt: Date | null;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  onPreview: () => void;
}

export default function StudioTopBar({
  designName,
  saveState,
  savedAt,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onPreview,
}: Props) {
  return (
    <header className="h-14 shrink-0 flex items-center gap-2 px-3 bg-(--color-bg-surface) border-b border-(--color-border-default) sm:gap-4 sm:px-5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="hidden text-[13px] font-medium text-(--color-text-secondary) md:inline">
          Notification Studio
        </span>
        <span className="hidden md:inline-flex">
          <ChevronRightOutlinedIcon sx={{ fontSize: 16, color: "var(--color-text-hint)" }} />
        </span>
        <span className="text-[13px] font-semibold text-(--color-text-primary) truncate">
          {designName}
        </span>
        <span className="hidden w-6 h-6 items-center justify-center rounded-md text-(--color-text-hint) sm:flex">
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 ml-auto sm:gap-3">
        <SaveStatus state={saveState} savedAt={savedAt} />

        <div className="flex items-center border border-(--color-border-default) rounded-lg overflow-hidden">
          <button
            type="button"
            title="Undo"
            onClick={onUndo}
            disabled={!canUndo}
            className="w-9 h-9 flex items-center justify-center text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <UndoOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
          <div className="w-px h-5 bg-(--color-border-default)" />
          <button
            type="button"
            title="Redo"
            onClick={onRedo}
            disabled={!canRedo}
            className="w-9 h-9 flex items-center justify-center text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RedoOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <button
          type="button"
          onClick={onPreview}
          title="Preview"
          className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-(--color-border-default) text-[13px] font-medium text-(--color-text-primary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer sm:px-3.5"
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          className="h-9 px-3 rounded-lg bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-(--color-text-on-brand) text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer sm:px-4"
        >
          <span className="sm:hidden">Save</span>
          <span className="hidden sm:inline">Save Template</span>
        </button>
      </div>
    </header>
  );
}

function SaveStatus({
  state,
  savedAt,
}: {
  state: SaveState;
  savedAt: Date | null;
}) {
  if (state === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-(--color-text-secondary)">
        <CloudSyncOutlinedIcon sx={{ fontSize: 15 }} /> <span className="hidden sm:inline">Saving…</span>
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-(--color-danger)">
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 15 }} /> <span className="hidden sm:inline">Save failed</span>
      </span>
    );
  }
  if (state === "saved") {
    const t = savedAt
      ? savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";
    return (
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-(--color-success)">
        <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />
        <span className="hidden sm:inline">Saved{t ? ` ${t}` : ""}</span>
      </span>
    );
  }
  return null;
}
