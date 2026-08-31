import type { ReactNode } from "react";

/** One numbered step of the send flow. */
export default function StepCard({
  step,
  title,
  action,
  children,
}: {
  step: number;
  title: string;
  /** Optional control on the right of the header, e.g. "View all drafts". */
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-5">
      <header className="flex items-center gap-2.5">
        <span className="w-6 h-6 shrink-0 rounded-full bg-(--color-brand-primary) text-(--color-text-on-brand) text-[11px] font-bold flex items-center justify-center">
          {step}
        </span>
        <h2 className="text-[14px] font-bold text-(--color-text-primary)">{title}</h2>
        {action && <div className="ml-auto">{action}</div>}
      </header>
      {children}
    </section>
  );
}
