import Link from "next/link";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

const perks = [
  "Free for 30 days",
  "No credit card required",
  "Setup in under 5 minutes",
];

export default function CtaBanner() {
  return (
    <section
      id="shopkeepers"
      className="w-full bg-(--color-bg-page) py-24 px-6"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-(--color-landing-hero-bg) px-8 py-16 md:px-16 flex flex-col items-center text-center gap-7">
          {/* Purple glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_80%,rgba(91,71,212,0.28),transparent)] pointer-events-none" />
          {/* Top accent line */}
          <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-(--color-brand-primary) to-transparent opacity-60" />

          <div className="relative z-10 flex flex-col items-center gap-7">
            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-(--color-brand-primary) mb-4">
                For Shopkeepers
              </p>
              <h2 className="text-[clamp(28px,4vw,46px)] font-bold text-white leading-[1.1] tracking-tight max-w-[580px]">
                Ready to bring your shop online?
              </h2>
            </div>

            <p className="text-[16px] text-white/50 max-w-[460px] leading-relaxed">
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
                  <span className="text-[13px] text-white/55">{p}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-1">
              <Link
                href="/signup"
                className="h-[52px] px-9 flex items-center gap-2 text-[16px] font-bold text-white bg-(--color-brand-primary) rounded-full hover:bg-(--color-brand-primary-hover) transition-all duration-150 shadow-[0_4px_32px_rgba(91,71,212,0.5)]"
              >
                Open a Shop Room — Free
                <ArrowForwardOutlinedIcon sx={{ fontSize: 18 }} />
              </Link>
              <Link
                href="/login"
                className="h-[52px] px-9 flex items-center text-[16px] text-white/55 border border-white/15 rounded-full hover:bg-white/6 hover:text-white hover:border-white/25 transition-all duration-150"
              >
                Sign in to your account
              </Link>
            </div>

            <p className="text-[12px] text-white/25 tracking-wide">
              Already trusted by 500+ shopkeepers across India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
