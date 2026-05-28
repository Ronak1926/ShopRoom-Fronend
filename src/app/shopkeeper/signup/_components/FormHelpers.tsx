// Shared UI helpers used across all signup step forms.

export function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <path
            d="M2.5 12C4.5 7.5 8 5 12 5C16 5 19.5 7.5 21.5 12C19.5 16.5 16 19 12 19C8 19 4.5 16.5 2.5 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </>
      ) : (
        <path
          d="M3 3l18 18M10.5 10.68A3 3 0 0013.32 13.5M6.5 6.74C4.37 8.12 2.9 10 2.5 12c1.5 4.5 5 7 9.5 7a9.6 9.6 0 005.26-1.55M9 5.28A9.4 9.4 0 0112 5c4.5 0 8 2.5 9.5 7-.4 1.2-1.05 2.3-1.9 3.23"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <span className="text-[12px] text-red-500 mt-0.5">{msg}</span>;
}

export function inputCls(hasError: boolean) {
  return `h-[46px] w-full rounded-[8px] bg-[var(--color-auth-input-bg)] px-4 text-[14px] text-[var(--color-auth-ink)] placeholder:text-[var(--color-auth-ink-muted)]/50 outline-none border transition ${
    hasError
      ? "border-red-400 ring-1 ring-red-300"
      : "border-transparent focus:border-[var(--color-auth-primary)] focus:ring-1 focus:ring-[var(--color-auth-primary)]"
  }`;
}

export function labelCls() {
  return "text-[10px] uppercase font-bold text-[var(--color-auth-ink)] tracking-[1px]";
}
