import type { ButtonHTMLAttributes, ReactNode } from "react";

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  loading?: boolean;
  /** Shown instead of the label while loading, e.g. "Creating account…". */
  loadingText?: string;
  children: ReactNode;
};

/**
 * The primary button of an auth form. While `loading` it is disabled, shows a spinner and says what it is
 * doing, so the person never wonders whether the click registered.
 */
export function SubmitButton({ loading = false, loadingText, children, disabled, className, type = "submit", ...props }: SubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-(--color-auth-primary) text-[16px] font-bold text-white transition-opacity disabled:opacity-50 ${className ?? ""}`}
      {...props}
    >
      {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
