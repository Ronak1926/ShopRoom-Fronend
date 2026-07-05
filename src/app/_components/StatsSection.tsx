const stats = [
  { value: "10,000+", label: "Active Members", note: "and growing daily" },
  { value: "500+", label: "Shop Rooms", note: "across India" },
  { value: "2M+", label: "Alerts Delivered", note: "with 97% delivery rate" },
  { value: "< 1s", label: "Alert Latency", note: "real-time, every time" },
];

export default function StatsSection() {
  return (
    <section className="w-full bg-(--color-landing-hero-bg) py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,color-mix(in_srgb,var(--color-brand-primary)_12%,transparent),transparent)] pointer-events-none" />
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
          {stats.map(({ value, label, note }) => (
            <div
              key={label}
              className="bg-(--color-landing-hero-bg) flex flex-col items-center justify-center py-12 px-6 text-center gap-2"
            >
              <span className="text-[clamp(34px,4vw,52px)] font-bold text-white leading-none tracking-tight">
                {value}
              </span>
              <span className="text-[15px] font-semibold text-white/70 mt-1">
                {label}
              </span>
              <span className="text-[12px] text-white/30">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
