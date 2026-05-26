import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  fullWidth,
  className,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-[12px] px-4 font-medium transition-[background,color,border] disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes = "h-[var(--height-btn-lg)]";

  const variants: Record<string, string> = {
    primary:
      "bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)] hover:bg-[var(--color-brand-primary-hover)] active:bg-[var(--color-brand-primary-active)]",
    outline:
      "border border-[var(--color-border-default)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface-hover)]",
  };

  return (
    <button
      className={[
        base,
        sizes,
        variants[variant],
        fullWidth ? "w-full" : "",
        className ?? "",
      ].join(" ")}
      {...props}
    />
  );
}
