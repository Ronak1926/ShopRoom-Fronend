"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import { fadeUp, staggerContainer, VIEWPORT } from "./motion";
import AnimatedButton from "./ui/AnimatedButton";

export default function FinalCTA() {
  return (
    <section className="w-full bg-(--color-bg-page) py-20 px-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="relative max-w-[1320px] mx-auto overflow-hidden rounded-[40px] bg-brand-gradient min-h-[380px] flex items-center"
      >
        {/* Decorative glow */}
        <div className="absolute -top-20 left-1/3 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />

        {/* Illustration — bleeds on the right (stacks below on mobile) */}
        <div className="absolute inset-y-0 right-0 w-[58%] hidden lg:block">
          <Image
            src="/industries/grow-bussiness.png"
            alt="Two shopkeepers growing their business together on ShopRoom"
            fill
            sizes="58vw"
            className="object-cover object-center"
          />
          {/* Blend the image's left edge into the purple banner */}
          <div className="absolute inset-0 bg-linear-to-r from-(--color-brand-primary) from-5% via-(--color-brand-primary)/35 via-35% to-transparent to-70%" />
        </div>

        {/* Copy */}
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative z-10 w-full lg:max-w-[560px] px-8 sm:px-14 py-14 lg:py-16 text-center lg:text-left"
        >
          <motion.h2
            variants={fadeUp}
            className="text-[clamp(28px,3.8vw,44px)] font-extrabold text-(--color-text-on-brand) leading-[1.12] tracking-tight text-balance"
          >
            Ready to grow your business?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-[16px] text-white/85 leading-relaxed max-w-[440px] mx-auto lg:mx-0"
          >
            Join thousands of shopkeepers who trust ShopRoom to connect and grow
            with their customers.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3.5"
          >
            <AnimatedButton href="/shopkeeper/signup" variant="white" size="lg">
              Create Your Shop
              <ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />
            </AnimatedButton>
            <AnimatedButton
              variant="white_ghost"
              size="lg"
              className="text-(--color-text-on-brand) border border-white/30 hover:bg-white/10 hover:text-(--color-text-on-brand)"
            >
              <PlayCircleOutlineRoundedIcon sx={{ fontSize: 24 }} />
              Learn More
            </AnimatedButton>
          </motion.div>
        </motion.div>

        {/* Mobile / tablet illustration (stacked, full width) */}
        <div className="lg:hidden absolute inset-0 z-0 opacity-25 pointer-events-none">
          <Image
            src="/industries/grow-bussiness.png"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </motion.div>
    </section>
  );
}
