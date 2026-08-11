import type { Variants, Transition } from "framer-motion";

/** Shared spring — premium, restrained (no overshoot bounce). */
export const SPRING: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.9,
};

export const EASE_OUT: Transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

/** Scroll-reveal viewport config used everywhere. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: SPRING },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: EASE_OUT },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: SPRING },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: SPRING },
};

/** Parent orchestrator for staggered children. */
export const staggerContainer = (
  staggerChildren = 0.1,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Slow floating loop for the hero illustration and floating cards.
 *  Usage: <motion.div animate={floatAnimate()} transition={floatTransition()} /> */
export const floatAnimate = (distance = 16) => ({ y: [0, -distance, 0] });

export const floatTransition = (duration = 6): Transition => ({
  duration,
  repeat: Infinity,
  ease: "easeInOut",
});
