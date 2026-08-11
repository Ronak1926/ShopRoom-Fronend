"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const MotionLink = motion.create(Link);

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2";

const SIZES = {
  md: "h-11 px-6 text-[15px]",
  lg: "h-[54px] px-8 text-[16px]",
} as const;

const VARIANTS = {
  primary:
    "bg-(--color-brand-primary) text-(--color-text-on-brand) shadow-(--shadow-brand-glow) hover:bg-(--color-brand-primary-hover)",
  outline:
    "border border-(--color-border-default) text-(--color-text-primary) hover:border-(--color-brand-primary-muted) hover:bg-(--color-brand-primary-light)",
  ghost: "text-(--color-text-primary) hover:text-(--color-brand-primary)",
  white:
    "bg-(--color-bg-surface) text-(--color-brand-primary-text) shadow-(--shadow-md) hover:bg-(--color-bg-surface-hover)",
  white_ghost:
    "text-(--color-brand-primary-light) hover:text-(--color-brand-primary-muted)",
} as const;

const HOVER = { scale: 1.04 };
const TAP = { scale: 0.97 };

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
}

export default function AnimatedButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  ariaLabel,
}: AnimatedButtonProps) {
  const classes = `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;

  if (href) {
    return (
      <MotionLink
        href={href}
        aria-label={ariaLabel}
        className={classes}
        whileHover={HOVER}
        whileTap={TAP}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
      whileHover={HOVER}
      whileTap={TAP}
    >
      {children}
    </motion.button>
  );
}
