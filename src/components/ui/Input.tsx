import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className, ...props }: Props) {
  return (
    <label className="flex flex-col gap-2">
      {label ? (
        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-hint)]">
          {label}
        </span>
      ) : null}
      <input
        className={[
          "h-[var(--height-input)] rounded-[12px] border border-[var(--color-border-default)] bg-[var(--color-bg-input)] px-4 text-[var(--color-text-primary)] outline-none transition-[border,box-shadow]",
          "placeholder:text-[var(--color-text-hint)]",
          "focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_4px_var(--color-brand-primary-light)]",
          className ?? "",
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
