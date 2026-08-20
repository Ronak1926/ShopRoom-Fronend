"use client";

/**
 * components/notifications/AnimatedNode.tsx — Real playback for a node's
 * entry/attention/exit animation (previously stored but never rendered
 * anywhere in the Studio, for any element type). Two nested motion.divs so
 * entry/exit (one-shot, imperative via useAnimationControls) and attention
 * (a continuous loop) never fight over the same animated property:
 *  - outer: entry → rest → exit, driven by `isPlaying`.
 *  - inner: attention's looping keyframes, only while `isPlaying`.
 * Composes cleanly with the node's own static rotation (set by nodeStyle's
 * buildNodeStyle on the *parent* div) since CSS transforms on nested
 * elements combine rather than overwrite.
 */

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion, useAnimationControls, type Easing } from "framer-motion";
import type { Animation } from "@/features/notifications/types";

const EASE: Record<string, Easing> = {
  easeOut: "easeOut",
  easeIn: "easeIn",
  easeInOut: "easeInOut",
  linear: "linear",
};

const REST = { opacity: 1, x: 0, y: 0, scale: 1 };

const ENTRY_FROM: Record<string, Partial<typeof REST>> = {
  FADE_IN: { opacity: 0 },
  SLIDE_UP: { opacity: 0, y: 24 },
  SLIDE_DOWN: { opacity: 0, y: -24 },
  SLIDE_LEFT: { opacity: 0, x: 24 },
  SLIDE_RIGHT: { opacity: 0, x: -24 },
  ZOOM_IN: { opacity: 0, scale: 0.7 },
  ZOOM_OUT: { opacity: 0, scale: 1.3 },
  POP: { opacity: 0, scale: 0.4 },
  BOUNCE: { opacity: 0, scale: 0.3 },
};

const EXIT_TO: Record<string, Partial<typeof REST>> = {
  FADE_OUT: { opacity: 0 },
  SLIDE_DOWN: { opacity: 0, y: 24 },
  ZOOM_OUT: { opacity: 0, scale: 0.7 },
};

const ATTENTION_LOOP: Record<string, Record<string, number[]>> = {
  PULSE: { scale: [1, 1.06, 1] },
  GLOW: { opacity: [1, 0.65, 1] },
  FLOAT: { y: [0, -6, 0] },
  WIGGLE: { rotate: [0, -4, 4, -4, 0] },
  SHAKE: { x: [0, -4, 4, -4, 0] },
};

interface Props {
  animation?: Animation;
  isPlaying: boolean;
  contentStyle?: CSSProperties;
  children: ReactNode;
}

export default function AnimatedNode({ animation, isPlaying, contentStyle, children }: Props) {
  const controls = useAnimationControls();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    const entry = animation?.entry;
    const exit = animation?.exit;

    if (!isPlaying) {
      controls.set(REST);
      return;
    }

    if (entry && ENTRY_FROM[entry.type]) {
      controls.set(ENTRY_FROM[entry.type]);
      controls.start({
        ...REST,
        transition: {
          duration: (entry.durationMs ?? 500) / 1000,
          delay: (entry.delayMs ?? 0) / 1000,
          ease: EASE[entry.easing ?? "easeOut"],
        },
      });
    } else {
      controls.set(REST);
    }

    if (exit && EXIT_TO[exit.type]) {
      // delayMs is an absolute offset from playback start, same convention
      // as entry/attention — no separate "fires at end" field needed.
      timer.current = setTimeout(() => {
        controls.start({
          ...EXIT_TO[exit.type],
          transition: { duration: (exit.durationMs ?? 400) / 1000, ease: EASE[exit.easing ?? "easeOut"] },
        });
      }, exit.delayMs ?? 0);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isPlaying, animation, controls]);

  const attention = isPlaying ? animation?.attention : undefined;
  const loop = attention ? ATTENTION_LOOP[attention.type] : undefined;
  // Attention starts once entry has finished (matching how the Timeline draws
  // its bar), falling back to its own delay when there's no entry animation.
  const attentionStartMs = animation?.entry
    ? (animation.entry.delayMs ?? 0) + (animation.entry.durationMs ?? 500)
    : attention?.delayMs ?? 0;

  return (
    <motion.div style={{ width: "100%", height: "100%", ...contentStyle }} initial={REST} animate={controls}>
      {loop ? (
        <motion.div
          style={{ width: "100%", height: "100%" }}
          animate={loop}
          transition={{
            duration: (attention!.durationMs ?? 1200) / 1000,
            repeat: Infinity,
            ease: EASE[attention!.easing ?? "easeInOut"],
            delay: attentionStartMs / 1000,
          }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
}
