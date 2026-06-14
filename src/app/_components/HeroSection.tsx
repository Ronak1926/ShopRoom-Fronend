"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

const ParticleGrid = dynamic(() => import("./ParticleGrid"), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[88vh] bg-(--color-landing-hero-bg) flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Particle canvas */}
      <ParticleGrid />

      {/* Soft radial glow behind content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,rgba(91,71,212,0.18),transparent)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-[720px]">
        {/* Live badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/75 text-[13px] font-medium backdrop-blur-sm">
          <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 shrink-0">
            <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-green-400 opacity-75" />
          </span>
          <BoltOutlinedIcon sx={{ fontSize: 13 }} />
          Real-time stock alerts — now live
        </div>

        <h1 className="text-[clamp(40px,6vw,68px)] font-bold text-white leading-[1.05] tracking-[-0.02em] max-w-[650px]">
          Your shop&apos;s news,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            delivered before the rush.
          </span>
        </h1>

        <p className="text-[17px] text-white/50 max-w-[480px] leading-relaxed font-light">
          Connect customers to your latest stock — in real time. No algorithms.
          No delay. Just your shop, direct.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link
            href="/signup"
            className="h-[52px] px-9 flex items-center text-[16px] font-bold text-white bg-(--color-brand-primary) rounded-full hover:bg-(--color-brand-primary-hover) active:bg-(--color-brand-primary-active) transition-all duration-150 shadow-[0_4px_30px_rgba(91,71,212,0.55)] hover:shadow-[0_4px_36px_rgba(91,71,212,0.7)]"
          >
            Open a Shop Room
          </Link>
          <Link
            href="/customer/home"
            className="h-[52px] px-9 flex items-center text-[16px] text-white/70 border border-white/20 rounded-full hover:bg-white/8 hover:text-white hover:border-white/35 transition-all duration-150"
          >
            Browse Rooms Near Me
          </Link>
        </div>

        <p className="text-[13px] text-white/28 tracking-wide">
          Free for 30 days · No credit card required
        </p>
      </div>

      {/* Scroll chevron */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
        <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 26 }} />
      </div>
    </section>
  );
}
