import Link from "next/link";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import Reveal from "./Reveal";

const perks = [
  "Free for 30 days",
  "No credit card required",
  "Setup in under 5 minutes",
];

export default function CtaBanner() {
  return (
    <section
      id="shopkeepers"
      className="w-full bg-(--color-bg-page) py-28 px-6 relative overflow-hidden"
    >
      {/* Top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-(--color-border-default)" />

      <Reveal className="relative z-10 max-w-[640px] mx-auto flex flex-col items-center gap-7 text-center">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-(--color-brand-primary) mb-4">
            For Shopkeepers
          </p>
          <h2 className="font-display text-[clamp(28px,4vw,46px)] font-semibold text-(--color-text-primary) leading-[1.1] tracking-tight max-w-[580px]">
            Ready to bring your shop online?
          </h2>
        </div>

        <p className="text-[16px] text-(--color-text-secondary) max-w-[460px] leading-relaxed">
          Open your Room today — free for the first 30 days. Your first 100
          members join free. No credit card required.
        </p>

        {/* Perks row */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {perks.map((p) => (
            <div key={p} className="flex items-center gap-1.5">
              <CheckOutlinedIcon
                sx={{ fontSize: 14, color: "var(--color-brand-primary)" }}
              />
              <span className="text-[13px] text-(--color-text-secondary)">
                {p}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-1">
          <Link
            href="/customer/signup"
            className="h-[52px] px-9 flex items-center gap-2 text-[16px] font-semibold text-white bg-(--color-brand-primary) rounded-full hover:bg-(--color-brand-primary-hover) transition-colors duration-150"
          >
            Open a Shop Room — Free
            <ArrowForwardOutlinedIcon sx={{ fontSize: 18 }} />
          </Link>
          <Link
            href="/customer/login"
            className="h-[52px] px-9 flex items-center text-[16px] text-(--color-text-secondary) border border-(--color-border-default) rounded-full hover:border-(--color-border-strong) hover:text-(--color-text-primary) transition-all duration-150"
          >
            Sign in to your account
          </Link>
        </div>

        <p className="text-[12px] text-(--color-text-hint) tracking-wide">
          Already trusted by 500+ shopkeepers across India
        </p>
      </Reveal>
    </section>
  );
}
