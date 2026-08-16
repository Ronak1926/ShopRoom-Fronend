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
}: Props) {
  return (
    <header className="h-14 shrink-0 flex items-center gap-4 px-5 bg-(--color-bg-surface) border-b border-(--color-border-default)">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[13px] font-medium text-(--color-text-secondary)">
          Notification Studio
        </span>
        <ChevronRightOutlinedIcon
          sx={{ fontSize: 16, color: "var(--color-text-hint)" }}
        />
        <span className="text-[13px] font-semibold text-(--color-text-primary) truncate">
          {designName}
        </span>
        <span className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-hint)">
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
        </span>
      </div>

      <div className="flex items-center gap-3 ml-auto">
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
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-(--color-border-default) text-[13px] font-medium text-(--color-text-primary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          Preview
        </button>

        <button
          type="button"
          onClick={onSave}
          className="h-9 px-4 rounded-lg bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-(--color-text-on-brand) text-[13px] font-semibold transition-colors cursor-pointer"
        >
          Save Template
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
        <CloudSyncOutlinedIcon sx={{ fontSize: 15 }} /> Saving…
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-(--color-danger)">
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 15 }} /> Save failed
      </span>
    );
  }
  if (state === "saved") {
    const t = savedAt
      ? savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";
    return (
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-(--color-success)">
        <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} /> Saved
        {t ? ` ${t}` : ""}
      </span>
    );
  }
  return null;
}
