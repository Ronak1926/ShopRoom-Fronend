"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import LandingNav from "./LandingNav";

const ParticleGrid = dynamic(() => import("./ParticleGrid"), { ssr: false });

export default function HeroSection() {
  return (
    <div className="relative w-full bg-(--color-landing-hero-bg) overflow-hidden">
      {/* Single particle canvas covers nav + hero */}
      <ParticleGrid />

      {/* Radial glow behind headline */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_65%,color-mix(in_srgb,var(--color-brand-primary)_14%,transparent),transparent)] pointer-events-none" />

      {/* Nav sits inside the dark container, above the canvas */}
      <LandingNav />

      {/* Hero content */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[82vh] px-6 text-center pb-16">
        <div className="flex flex-col items-center gap-6 max-w-[720px]">
          <h1 className="text-[clamp(40px,6vw,68px)] font-bold text-white leading-[1.05] tracking-[-0.02em] max-w-[650px]">
            Your shop&apos;s news, <br className="hidden sm:block" />
            delivered before the rush.
          </h1>

          <p className="text-[17px] text-white/45 max-w-[460px] leading-relaxed font-light">
            Connect customers to your latest stock — in real time. No
            algorithms. No delay. Just your shop, direct.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link
              href="/customer/signup"
              className="h-[52px] px-9 flex items-center text-[16px] font-semibold text-white bg-(--color-brand-primary) rounded-full hover:bg-(--color-brand-primary-hover) active:bg-(--color-brand-primary-active) transition-colors duration-150"
            >
              Open a Shop Room
            </Link>
            <Link
              href="/customer/home"
              className="h-[52px] px-9 flex items-center text-[16px] text-white/60 border border-white/15 rounded-full hover:bg-white/8 hover:text-white hover:border-white/30 transition-all duration-150"
            >
              Browse Rooms Near Me
            </Link>
          </div>

          <p className="text-[13px] text-white/25 tracking-wide mt-1">
            Free for 30 days · No credit card required
          </p>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/25 animate-bounce">
          <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 24 }} />
        </div>
      </section>
    </div>
  );
}
