import { STEP_LABELS } from "../_lib/schemas";

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-[var(--color-auth-primary)] text-white"
                      : "bg-[var(--color-auth-input-bg)] text-[var(--color-auth-ink-muted)]"
                }`}
              >
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-[9px] mt-1 font-medium whitespace-nowrap ${
                  active
                    ? "text-[var(--color-auth-primary)]"
                    : "text-[var(--color-auth-ink-muted)]"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-6 h-px mb-4 transition-all ${
                  done ? "bg-emerald-400" : "bg-[var(--color-border-default)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
