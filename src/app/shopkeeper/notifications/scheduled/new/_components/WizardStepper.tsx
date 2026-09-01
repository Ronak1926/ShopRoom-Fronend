"use client";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { WIZARD_STEPS, type WizardStep } from "../../_schemas/schedule";

interface Props {
  current: WizardStep;
  /** Steps already filled in, in order — drives the ticks. */
  completed: WizardStep[];
  /** One line under each finished step, e.g. the chosen draft's name. */
  summaries: Partial<Record<WizardStep, string>>;
  onJump: (step: WizardStep) => void;
}

/** The rail that says where you are and lets you go back to a finished step. */
export default function WizardStepper({ current, completed, summaries, onJump }: Props) {
  return (
    <nav aria-label="Schedule steps" className="flex flex-col gap-1">
      {WIZARD_STEPS.map((step, i) => {
        const done = completed.includes(step.id);
        const active = current === step.id;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => (done || active ? onJump(step.id) : undefined)}
            disabled={!done && !active}
            className={`flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
              active
                ? "bg-(--color-brand-primary-light) cursor-pointer"
                : done
                  ? "hover:bg-(--color-bg-surface-hover) cursor-pointer"
                  : "cursor-not-allowed"
            }`}
          >
            <span
              className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold ${
                done
                  ? "bg-(--color-brand-primary) text-(--color-text-on-brand)"
                  : active
                    ? "bg-(--color-brand-primary) text-(--color-text-on-brand)"
                    : "bg-(--color-bg-surface-hover) text-(--color-text-hint)"
              }`}
            >
              {done ? <CheckOutlinedIcon sx={{ fontSize: 13 }} /> : i + 1}
            </span>

            <span className="min-w-0">
              <span
                className={`block text-[12.5px] font-semibold ${
                  active || done ? "text-(--color-brand-primary)" : "text-(--color-text-secondary)"
                }`}
              >
                {step.title}
              </span>
              <span className="block text-[11px] text-(--color-text-hint) mt-0.5 truncate">
                {summaries[step.id] ?? step.hint}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
