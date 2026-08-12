"use client";

import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

export default function StudioTopBar() {
  return (
    <header className="h-14 shrink-0 flex items-center gap-4 px-5 bg-(--color-bg-surface) border-b border-(--color-border-default)">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[13px] font-medium text-(--color-text-secondary)">
          Notification Studio
        </span>
        <ChevronRightOutlinedIcon
          sx={{ fontSize: 16, color: "var(--color-text-hint)" }}
        />
        <span className="text-[13px] font-semibold text-(--color-text-primary) truncate">
          New Arrival Template
        </span>
        <button
          type="button"
          title="Rename"
          className="w-6 h-6 flex items-center justify-center rounded-md text-(--color-text-hint) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
        >
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
        </button>
      </div>

      {/* Right zone */}
      <div className="flex items-center gap-3 ml-auto">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-(--color-success)">
          <CheckCircleOutlinedIcon sx={{ fontSize: 15 }} />
          Saved 2m ago
        </span>

        {/* Undo / redo */}
        <div className="flex items-center border border-(--color-border-default) rounded-lg overflow-hidden">
          <button
            type="button"
            title="Undo"
            className="w-9 h-9 flex items-center justify-center text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
          >
            <UndoOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
          <div className="w-px h-5 bg-(--color-border-default)" />
          <button
            type="button"
            title="Redo"
            className="w-9 h-9 flex items-center justify-center text-(--color-text-secondary) hover:bg-(--color-bg-surface-hover) hover:text-(--color-text-primary) transition-colors cursor-pointer"
          >
            <RedoOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Preview */}
        <button
          type="button"
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-(--color-border-default) text-[13px] font-medium text-(--color-text-primary) hover:bg-(--color-bg-surface-hover) transition-colors cursor-pointer"
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          Preview
        </button>

        {/* Save Template (split button) */}
        <div className="flex items-center rounded-lg overflow-hidden">
          <button
            type="button"
            className="h-9 px-4 bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-(--color-text-on-brand) text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Save Template
          </button>
          <button
            type="button"
            title="More save options"
            className="h-9 w-8 flex items-center justify-center bg-(--color-brand-primary) hover:bg-(--color-brand-primary-hover) text-(--color-text-on-brand) border-l border-(--color-brand-primary-hover) transition-colors cursor-pointer"
          >
            <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
    </header>
  );
}
