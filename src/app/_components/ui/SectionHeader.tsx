"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, VIEWPORT } from "../motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  /** Substring of `title` rendered in the brand colour. */
  highlight?: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) return title;
  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-(--color-brand-primary)">{highlight}</span>
      {after}
    </>
  );
}

export default function SectionHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <motion.div
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={`flex flex-col gap-4 max-w-2xl ${alignment} ${className}`}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="text-[12px] font-bold tracking-[0.16em] uppercase text-(--color-brand-primary)"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className="text-[clamp(28px,4vw,44px)] font-extrabold text-(--color-text-primary) leading-[1.12] tracking-tight text-balance"
      >
        {renderTitle(title, highlight)}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="text-[16px] text-(--color-text-secondary) leading-relaxed text-pretty"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
