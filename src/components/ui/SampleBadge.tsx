/**
 * Marks a panel whose numbers are illustrative. Sends are not recorded anywhere
 * yet, so anything measured from them is shape, not fact — and says so.
 */
export default function SampleBadge({ title }: { title?: string }) {
  return (
    <span
      title={title ?? "Sample figures — no send data is recorded yet."}
      className="shrink-0 h-5 px-2 rounded-full bg-(--color-brand-alert-light) text-[9.5px] font-bold uppercase tracking-wide text-(--color-brand-alert-text) flex items-center"
    >
      Sample
    </span>
  );
}
