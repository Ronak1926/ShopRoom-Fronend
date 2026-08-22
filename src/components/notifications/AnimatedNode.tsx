"use client";

/**
 * components/notifications/AnimatedNode.tsx — Real playback for a node's
 * entry/emphasis/exit animation. Two nested motion.divs so entry/exit
 * (one-shot, imperative via useAnimationControls) and emphasis (a continuous
 * loop) never fight over the same animated property:
 *  - outer: entry → rest → exit, driven by `isPlaying`.
 *  - inner: emphasis keyframes, only while `isPlaying`.
 * Composes cleanly with the node's own static rotation (set by nodeStyle's
 * buildNodeStyle on the *parent* div) since CSS transforms on nested elements
 * combine rather than overwrite.
 *
 * Every type offered by features/notifications/animationPresets.ts must have a
 * case here — that catalog and these maps are asserted to agree.
 */

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion, useAnimationControls, type Easing } from "framer-motion";
import { ANIM_DEFAULTS } from "@/features/notifications/animationPresets";
import type { AnimStep, Animation } from "@/features/notifications/types";

const EASE: Record<string, Easing> = {
  easeOut: "easeOut",
  easeIn: "easeIn",
  easeInOut: "easeInOut",
  linear: "linear",
};

type Frame = {
  opacity?: number; x?: number; y?: number; scale?: number;
  rotate?: number; rotateX?: number; rotateY?: number; filter?: string;
};

const REST: Frame = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, filter: "blur(0px)" };

/** Offset applied to directional slides, in px. */
const TRAVEL = 28;

const byDirection = (dir: string | undefined, fallback: Frame): Frame => {
  switch (dir) {
    case "up": return { opacity: 0, y: TRAVEL };
    case "down": return { opacity: 0, y: -TRAVEL };
    case "left": return { opacity: 0, x: TRAVEL };
    case "right": return { opacity: 0, x: -TRAVEL };
    case "center": return { opacity: 0, scale: 0.85 };
    default: return fallback;
  }
};

/** Starting frame for an entrance (animates → REST). */
function entryFrom(step: AnimStep): Frame | null {
  const d = step.direction;
  switch (step.type) {
    case "FADE_IN": return { opacity: 0 };
    case "ZOOM_IN": return { opacity: 0, scale: 0.7 };
    case "ZOOM_OUT_IN": return { opacity: 0, scale: 1.3 };
    case "SLIDE_UP": return byDirection(d, { opacity: 0, y: TRAVEL });
    case "SLIDE_DOWN": return byDirection(d, { opacity: 0, y: -TRAVEL });
    case "SLIDE_LEFT": return byDirection(d, { opacity: 0, x: TRAVEL });
    case "SLIDE_RIGHT": return byDirection(d, { opacity: 0, x: -TRAVEL });
    case "FLOAT_IN": return byDirection(d, { opacity: 0, y: TRAVEL / 2 });
    case "POP": return { opacity: 0, scale: 0.4 };
    case "ROTATE_IN": return { opacity: 0, rotate: -180, scale: 0.6 };
    case "FLIP_IN_Y": return { opacity: 0, rotateY: 90 };
    case "FLIP_IN_X": return { opacity: 0, rotateX: 90 };
    case "BOUNCE_IN": return { opacity: 0, scale: 0.3 };
    case "SWING_IN": return { opacity: 0, rotate: -28 };
    case "ELASTIC_IN": return { opacity: 0, scale: 0.5 };
    case "BLUR_IN": return { opacity: 0, filter: "blur(12px)" };
    default: return null;
  }
}

/** Ending frame for an exit (animates REST → this). */
function exitTo(step: AnimStep): Frame | null {
  const d = step.direction;
  switch (step.type) {
    case "FADE_OUT": return { opacity: 0 };
    case "ZOOM_OUT": return { opacity: 0, scale: 0.7 };
    case "POP_OUT": return { opacity: 0, scale: 1.35 };
    case "SLIDE_OUT_UP": return byDirection(d, { opacity: 0, y: -TRAVEL });
    case "SLIDE_OUT_DOWN": return byDirection(d, { opacity: 0, y: TRAVEL });
    case "SLIDE_OUT_LEFT": return byDirection(d, { opacity: 0, x: -TRAVEL });
    case "SLIDE_OUT_RIGHT": return byDirection(d, { opacity: 0, x: TRAVEL });
    case "FLIP_OUT": return { opacity: 0, rotateY: 90 };
    case "BLUR_OUT": return { opacity: 0, filter: "blur(12px)" };
    default: return null;
  }
}

/** Looping keyframes for an emphasis animation. */
const EMPHASIS: Record<string, Record<string, (number | string)[]>> = {
  PULSE: { scale: [1, 1.06, 1] },
  GLOW: { opacity: [1, 0.6, 1] },
  FLOAT: { y: [0, -6, 0] },
  WIGGLE: { rotate: [0, -4, 4, -4, 0] },
  SHAKE: { x: [0, -5, 5, -5, 0] },
  HEARTBEAT: { scale: [1, 1.12, 1, 1.08, 1] },
  SPIN: { rotate: [0, 360] },
  BOUNCE: { y: [0, -12, 0, -5, 0] },
  TADA: { scale: [1, 0.94, 1.1, 1.1, 1], rotate: [0, -3, 3, -3, 0] },
};

/** Emphasis keeps looping past the window; everything else honours fillMode. */
function repeatCount(step: AnimStep): number {
  if (step.repeat === "infinite") return Infinity;
  const n = typeof step.repeat === "number" ? step.repeat : ANIM_DEFAULTS.repeat;
  return Math.max(1, n) - 1; // framer counts repeats *after* the first play
}

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

    const from = entry ? entryFrom(entry) : null;
    if (entry && from) {
      controls.set({ ...REST, ...from });
      controls.start({
        ...REST,
        transition: {
          duration: (entry.durationMs ?? ANIM_DEFAULTS.durationMs) / 1000,
          delay: (entry.delayMs ?? ANIM_DEFAULTS.delayMs) / 1000,
          ease: EASE[entry.easing ?? ANIM_DEFAULTS.easing],
          repeat: repeatCount(entry),
          repeatType: "loop",
        },
      });
    } else {
      controls.set(REST);
    }

    const to = exit ? exitTo(exit) : null;
    if (exit && to) {
      // delayMs is an absolute offset from playback start, same convention as
      // entry/emphasis — no separate "fires at end" field needed.
      timer.current = setTimeout(() => {
        controls.start({
          ...to,
          transition: {
            duration: (exit.durationMs ?? ANIM_DEFAULTS.durationMs) / 1000,
            ease: EASE[exit.easing ?? ANIM_DEFAULTS.easing],
          },
        });
      }, exit.delayMs ?? ANIM_DEFAULTS.delayMs);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isPlaying, animation, controls]);

  const emphasis = isPlaying ? animation?.attention : undefined;
  const loop = emphasis ? EMPHASIS[emphasis.type] : undefined;
  // Emphasis starts once entry has finished (matching how the Timeline draws
  // its bar), falling back to its own delay when there's no entry animation.
  const emphasisStartMs = animation?.entry
    ? (animation.entry.delayMs ?? ANIM_DEFAULTS.delayMs) + (animation.entry.durationMs ?? ANIM_DEFAULTS.durationMs)
    : emphasis?.delayMs ?? ANIM_DEFAULTS.delayMs;

  // minWidth/minHeight: 0 is load-bearing. These wrappers are flex items, and a
  // flex item defaults to min-width:auto — it refuses to shrink below its own
  // content. Without this the wrapper grows past the node's box, so text that
  // wrapped inside (e.g. "30% OFF" in a circular badge) stops wrapping and
  // spills outside the element the moment an animation is applied.
  const box: CSSProperties = { width: "100%", height: "100%", minWidth: 0, minHeight: 0 };

  return (
    <motion.div style={{ ...box, ...contentStyle }} initial={REST} animate={controls}>
      {loop && emphasis ? (
        <motion.div
          // Also carries contentStyle: this wrapper is what directly holds the
          // node's content, so it must reproduce the same flex centering the
          // node's own box uses — otherwise an emphasis animation drops the
          // content to the top-left instead of keeping it centred.
          style={{ ...box, ...contentStyle }}
          animate={loop}
          transition={{
            duration: (emphasis.durationMs ?? 1200) / 1000,
            repeat: emphasis.repeat === "infinite" || emphasis.repeat == null ? Infinity : Math.max(1, emphasis.repeat) - 1,
            ease: EASE[emphasis.easing ?? "easeInOut"],
            delay: emphasisStartMs / 1000,
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
