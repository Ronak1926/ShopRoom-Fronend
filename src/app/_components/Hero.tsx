"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { fadeUp, scaleIn, staggerContainer } from "./motion";
import AnimatedButton from "./ui/AnimatedButton";

const TRUST_POINTS = [
  "Free to start",
  "No credit card",
  "Setup in 2 minutes",
] as const;

const AVATARS = ["Aarav", "Diya", "Kabir", "Meera"] as const;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-(--color-bg-surface)">
      {/* Clean white background with a single faint brand wash behind the copy */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-brand-primary)_9%,transparent),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-24 pb-14 lg:pt-24 lg:pb-16 grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-6 items-center">
        {/* Left — copy */}
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 h-9 pl-1.5 pr-4 rounded-full bg-(--color-bg-surface) border border-(--color-border-default) shadow-(--shadow-xs)"
          >
            <div className="flex -space-x-2">
              {AVATARS.map((name) => (
                <span
                  key={name}
                  className="w-6 h-6 rounded-full ring-2 ring-(--color-bg-surface) bg-(--color-brand-primary) flex items-center justify-center text-[10px] font-bold text-(--color-text-on-brand)"
                >
                  {name[0]}
                </span>
              ))}
            </div>
            <span className="text-[12px] font-semibold text-(--color-text-secondary)">
              Trusted by 10,000+ shopkeepers
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-[clamp(40px,5.6vw,70px)] font-extrabold text-(--color-text-primary) leading-[1.05] tracking-[-0.02em] text-balance"
          >
            Bring your shop closer to your{" "}
            <span className="text-(--color-brand-primary)">customers.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-[18px] text-(--color-text-secondary) max-w-[480px] leading-relaxed"
          >
            Create your own room, invite customers, share updates, and grow your
            business together on ShopRoom.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
          >
            <AnimatedButton href="/shopkeeper/signup" variant="primary" size="lg">
              Create Your Shop
              <ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />
            </AnimatedButton>
            <AnimatedButton variant="ghost" size="lg">
              <PlayCircleOutlineRoundedIcon sx={{ fontSize: 26 }} />
              Watch Demo
            </AnimatedButton>
          </motion.div>

          <motion.ul
            variants={staggerContainer(0.15, 0.2)}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5"
          >
            {TRUST_POINTS.map((point) => (
              <motion.li
                key={point}
                variants={fadeUp}
                className="flex items-center gap-1.5 text-[13px] font-medium text-(--color-text-secondary)"
              >
                <CheckCircleRoundedIcon
                  sx={{ fontSize: 18, color: "var(--color-success)" }}
                />
                {point}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right — illustration (static, fits the column) */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="relative flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[560px] lg:max-w-none">
            <Image
              src="/hero_background.png"
              alt="Shopkeepers and customers connecting on ShopRoom"
              width={1250}
              height={1250}
              priority
              sizes="(max-width: 1024px) 92vw, 760px"
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
