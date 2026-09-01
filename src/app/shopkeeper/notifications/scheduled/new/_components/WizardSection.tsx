"use client";

import type { ReactNode } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props {
  step: number;
  title: string;
  hint: string;
  open: boolean;
  done: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/**
 * One part of the multi-part form. Collapsed it is a summary row; open it is
 * the step. Only one is open at a time, so the page never becomes a wall.
 */
export default function WizardSection({
  step,
  title,
  hint,
  open,
  done,
  onToggle,
  children,
}: Props) {
  return (
    <section
      className={`rounded-2xl border bg-(--color-bg-surface) transition-colors ${
        open ? "border-(--color-brand-primary)" : "border-(--color-border-default)"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-(--color-text-primary)">
              {step}. {title}
            </span>
            {done && !open && (
              <CheckCircleIcon sx={{ fontSize: 15, color: "var(--color-success)" }} />
            )}
          </span>
          <span className="block text-[11.5px] text-(--color-text-hint) mt-0.5 truncate">
            {hint}
          </span>
        </span>

        <ExpandMoreOutlinedIcon
          sx={{ fontSize: 20 }}
          className={`shrink-0 text-(--color-text-hint) transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="px-5 pb-5">{children}</div>}
    </section>
  );
}
