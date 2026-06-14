import Image from "next/image";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const points = [
  {
    title: "Zero Algorithms",
    description:
      "See updates based on distance and relevance, not a profit-seeking feed.",
  },
  {
    title: "Hyper-Local Sync",
    description:
      "Inventory synchronisation that feels like magic. Arrive just in time, every time.",
  },
  {
    title: "Built for Physical Retail",
    description:
      "Designed around how local shops actually operate — not adapted from e-commerce.",
  },
];

export default function MissionSection() {
  return (
    <section className="w-full bg-(--color-bg-surface) overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-stretch min-h-[560px]">
        {/* Left: shop photo — hard clean edge, no overlay */}
        <div className="relative lg:w-[44%] min-h-[360px] lg:min-h-0 shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=85"
            alt="A well-stocked local shop interior"
            fill
            sizes="(max-width: 1024px) 100vw, 44vw"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Right: text */}
        <div className="lg:w-[56%] flex flex-col justify-center px-8 py-16 lg:pl-4 lg:pr-16 gap-8">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-(--color-brand-primary) mb-4">
              Our mission
            </p>
            <h2 className="text-[clamp(28px,3.2vw,42px)] font-bold text-(--color-text-primary) leading-[1.15] tracking-tight">
              The new standard for
              <br />
              local commerce.
            </h2>
          </div>

          <p className="text-[15px] text-(--color-text-secondary) leading-[1.75] max-w-[460px]">
            We believe physical shops are more than just places to buy things —
            they are the architectural anchors of our communities. ShopRoom
            bridges the gap between the tactile experience of walking into a
            store and the speed of modern digital alerts.
          </p>

          <div className="flex flex-col gap-6">
            {points.map(({ title, description }) => (
              <div key={title} className="flex gap-3.5 items-start">
                <div className="mt-0.5 shrink-0">
                  <CheckCircleOutlinedIcon
                    sx={{ color: "var(--color-brand-primary)", fontSize: 19 }}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-(--color-text-primary) mb-1">
                    {title}
                  </p>
                  <p className="text-[13px] text-(--color-text-secondary) leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
