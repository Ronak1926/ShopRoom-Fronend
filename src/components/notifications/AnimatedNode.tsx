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
 * What makes two presets look DIFFERENT is the curve, not the start value. A
 * preset that only varies its starting scale and then eases to rest with the
 * same tween as every other preset is indistinguishable at 500ms — Zoom In,
 * Pop, Bounce In and Elastic In were all "start smaller, ease out", so they
 * played identically. Each entry therefore declares its own motion character:
 * a spring (`bounce`), explicit `keyframes`, a `perspective` for real 3D, or a
 * `origin` for pendulum pivots.
 *
 * Every type offered by features/notifications/animationPresets.ts must have a
 * case here — that catalog and these maps are asserted to agree.
 */

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  motion,
  useAnimationControls,
  type Easing,
  type MotionStyle,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import { ANIM_DEFAULTS } from "@/features/notifications/animationPresets";
import type { AnimStep, Animation } from "@/features/notifications/types";

const EASE: Record<string, Easing> = {
  easeOut: "easeOut",
  easeIn: "easeIn",
  easeInOut: "easeInOut",
  linear: "linear",
};

type Frame = {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  skewX?: number;
  filter?: string;
  clipPath?: string;
};

type Keyframes = { [K in keyof Frame]?: NonNullable<Frame[K]>[] };

const REST: Frame = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  skewX: 0,
  filter: "blur(0px)",
};

/**
 * How a preset moves, beyond where it starts.
 *
 * `bounce`, `keyframes`, `perspective` and `origin` are the four levers that
 * give presets distinct personalities; a spec with only `frame` is a plain
 * eased tween.
 */
interface MotionSpec {
  /** Where the element sits before an entry, or lands after an exit. */
  frame?: Frame;
  /**
   * Extra properties the element must hold at rest for `frame` to animate
   * against. clip-path has no animatable "unset", so a clip-path reveal has to
   * declare the fully-open shape it rests at.
   */
  rest?: Frame;
  /** Multi-step motion. Replaces the straight frame → rest tween. */
  keyframes?: Keyframes;
  /** Keyframe timing, 0–1. Must match the keyframe array length. */
  times?: number[];
  /** Spring instead of a tween. 0 = settles flat, 1 = very springy. */
  bounce?: number;
  /** 3D rotations collapse into a flat squash without it — that squash is
   *  what made Flip In Y look like a zoom. */
  perspective?: number;
  /** transform-origin, e.g. "top center" so a swing pivots like a sign. */
  origin?: string;
}

/** Offset applied to directional slides, in px. */
const TRAVEL = 32;

/** Where a directional entry travels FROM. */
const FROM_DIRECTION: Record<string, Frame> = {
  up: { opacity: 0, y: TRAVEL },
  down: { opacity: 0, y: -TRAVEL },
  left: { opacity: 0, x: TRAVEL },
  right: { opacity: 0, x: -TRAVEL },
  center: { opacity: 0, scale: 0.85 },
};

/** Where a directional exit travels TO. */
const TO_DIRECTION: Record<string, Frame> = {
  up: { opacity: 0, y: -TRAVEL },
  down: { opacity: 0, y: TRAVEL },
  left: { opacity: 0, x: -TRAVEL },
  right: { opacity: 0, x: TRAVEL },
  center: { opacity: 0, scale: 0.85 },
};

const ENTRIES: Record<string, MotionSpec> = {
  FADE_IN: { frame: { opacity: 0 } },

  // The scale family, kept deliberately apart: Zoom In eases straight to rest,
  // Pop springs past it, Bounce In rebounds several times, Elastic In distorts.
  ZOOM_IN: { frame: { opacity: 0, scale: 0.72 } },
  ZOOM_OUT_IN: { frame: { opacity: 0, scale: 1.35 } },
  POP: { frame: { opacity: 0, scale: 0.4 }, bounce: 0.55 },
  BOUNCE_IN: {
    keyframes: { opacity: [0, 1, 1, 1, 1, 1], scale: [0.3, 1.12, 0.88, 1.06, 0.96, 1] },
    times: [0, 0.34, 0.54, 0.72, 0.87, 1],
  },
  ELASTIC_IN: {
    // Squash-and-stretch: the shape distorts on each axis rather than just
    // changing size, which is what separates it from Bounce In at a glance.
    keyframes: {
      opacity: [0, 1, 1, 1, 1, 1],
      scaleX: [0.4, 1.28, 0.86, 1.1, 0.96, 1],
      scaleY: [1.55, 0.78, 1.16, 0.92, 1.03, 1],
    },
    times: [0, 0.3, 0.5, 0.68, 0.85, 1],
  },

  SLIDE_UP: { frame: FROM_DIRECTION.up },
  SLIDE_DOWN: { frame: FROM_DIRECTION.down },
  SLIDE_LEFT: { frame: FROM_DIRECTION.left },
  SLIDE_RIGHT: { frame: FROM_DIRECTION.right },
  FLOAT_IN: { frame: { opacity: 0, y: 18, scale: 0.98 } },
  DROP_IN: { frame: { opacity: 0, y: -72 }, bounce: 0.5 },

  ROTATE_IN: { frame: { opacity: 0, rotate: -180, scale: 0.6 } },
  ROLL_IN: { frame: { opacity: 0, x: -72, rotate: -150 } },
  SWING_IN: {
    keyframes: { opacity: [0, 1, 1, 1, 1], rotate: [-42, 18, -9, 4, 0] },
    times: [0, 0.4, 0.62, 0.83, 1],
    origin: "top center",
  },

  // Real 3D. Without perspective these are a flat horizontal/vertical squash.
  FLIP_IN_Y: { frame: { opacity: 0, rotateY: -100 }, perspective: 700 },
  FLIP_IN_X: { frame: { opacity: 0, rotateX: 100 }, perspective: 700 },
  TILT_IN: { frame: { opacity: 0, rotateX: -72, y: 24 }, perspective: 700, origin: "bottom center" },

  BLUR_IN: { frame: { opacity: 0, filter: "blur(14px)" } },
  SKEW_IN: { frame: { opacity: 0, x: 48, skewX: 24 } },
  UNFOLD_IN: { frame: { opacity: 0, scaleY: 0 }, origin: "top center" },
  SPLIT_IN: { frame: { opacity: 0, scaleX: 0 } },
  BACK_IN: { keyframes: { opacity: [0, 1, 1], y: [64, -14, 0] }, times: [0, 0.68, 1] },
  CIRCLE_IN: {
    frame: { clipPath: "circle(0% at 50% 50%)" },
    // 150% keeps the resting clip well outside the box, so it never trims a
    // shadow or an overflowing glyph once the reveal has finished.
    rest: { clipPath: "circle(150% at 50% 50%)" },
  },
};

const EXITS: Record<string, MotionSpec> = {
  FADE_OUT: { frame: { opacity: 0 } },
  ZOOM_OUT: { frame: { opacity: 0, scale: 0.7 } },
  POP_OUT: { frame: { opacity: 0, scale: 1.4 } },
  BOUNCE_OUT: {
    keyframes: { opacity: [1, 1, 0], scale: [1, 1.14, 0.3] },
    times: [0, 0.35, 1],
  },

  SLIDE_OUT_UP: { frame: TO_DIRECTION.up },
  SLIDE_OUT_DOWN: { frame: TO_DIRECTION.down },
  SLIDE_OUT_LEFT: { frame: TO_DIRECTION.left },
  SLIDE_OUT_RIGHT: { frame: TO_DIRECTION.right },
  DROP_OUT: { frame: { opacity: 0, y: 90, rotate: 14 } },
  ROLL_OUT: { frame: { opacity: 0, x: 78, rotate: 150 } },

  FLIP_OUT: { frame: { opacity: 0, rotateY: 100 }, perspective: 700 },
  FLIP_OUT_X: { frame: { opacity: 0, rotateX: -100 }, perspective: 700 },

  BLUR_OUT: { frame: { opacity: 0, filter: "blur(14px)" } },
  SKEW_OUT: { frame: { opacity: 0, x: -48, skewX: -24 } },
  FOLD_OUT: { frame: { opacity: 0, scaleY: 0 }, origin: "top center" },
  CIRCLE_OUT: {
    frame: { clipPath: "circle(0% at 50% 50%)" },
    rest: { clipPath: "circle(150% at 50% 50%)" },
  },
};

/** Looping keyframes for an emphasis animation. */
interface EmphasisSpec {
  keyframes: Keyframes;
  times?: number[];
  perspective?: number;
  origin?: string;
}

const EMPHASIS: Record<string, EmphasisSpec> = {
  PULSE: { keyframes: { scale: [1, 1.07, 1] } },
  GLOW: { keyframes: { opacity: [1, 0.55, 1] } },
  // A hard blink, where Glow is a soft dip — same property, opposite feel.
  FLASH: { keyframes: { opacity: [1, 0, 1, 0, 1] } },
  FLOAT: { keyframes: { y: [0, -7, 0] } },
  WIGGLE: { keyframes: { rotate: [0, -5, 5, -5, 0] } },
  SHAKE: { keyframes: { x: [0, -6, 6, -6, 0] } },
  HEARTBEAT: { keyframes: { scale: [1, 1.14, 1, 1.09, 1] }, times: [0, 0.16, 0.32, 0.46, 1] },
  SPIN: { keyframes: { rotate: [0, 360] } },
  SPIN_Y: { keyframes: { rotateY: [0, 360] }, perspective: 700 },
  BOUNCE: { keyframes: { y: [0, -14, 0, -6, 0] }, times: [0, 0.3, 0.55, 0.78, 1] },
  TADA: { keyframes: { scale: [1, 0.92, 1.12, 1.12, 1], rotate: [0, -4, 4, -4, 0] } },
  SWING: { keyframes: { rotate: [0, 14, -11, 7, -4, 0] }, origin: "top center" },
  RUBBER_BAND: {
    keyframes: {
      scaleX: [1, 1.24, 0.87, 1.08, 0.97, 1],
      scaleY: [1, 0.8, 1.14, 0.94, 1.02, 1],
    },
  },
  JELLO: { keyframes: { skewX: [0, -11, 8, -6, 4, -2, 0] } },
  WOBBLE: { keyframes: { x: [0, -15, 11, -8, 5, 0], rotate: [0, -5, 4, -3, 2, 0] } },
};

/** Resolves a directional override onto a spec that travels along an axis. */
function directed(spec: MotionSpec, step: AnimStep, table: Record<string, Frame>): MotionSpec {
  const override = step.direction ? table[step.direction] : undefined;
  return override ? { ...spec, frame: override } : spec;
}

function entrySpec(step: AnimStep): MotionSpec | undefined {
  const spec = ENTRIES[step.type];
  return spec ? directed(spec, step, FROM_DIRECTION) : undefined;
}

function exitSpec(step: AnimStep): MotionSpec | undefined {
  const spec = EXITS[step.type];
  return spec ? directed(spec, step, TO_DIRECTION) : undefined;
}

/** The first value of every keyframe track — where the element must start. */
function firstFrame(kf: Keyframes): Frame {
  const out: Record<string, number | string> = {};
  for (const [key, values] of Object.entries(kf)) {
    if (values?.length) out[key] = values[0];
  }
  return out as Frame;
}

function transitionFor(step: AnimStep, spec: MotionSpec, repeat = 0): Transition {
  const duration = (step.durationMs ?? ANIM_DEFAULTS.durationMs) / 1000;
  const delay = (step.delayMs ?? ANIM_DEFAULTS.delayMs) / 1000;
  if (spec.bounce != null) {
    // duration + bounce keeps the shopkeeper's own duration authoritative —
    // a stiffness/damping spring would silently ignore it.
    return { type: "spring", duration, bounce: spec.bounce, delay, repeat, repeatType: "loop" };
  }
  return {
    duration,
    delay,
    ease: EASE[step.easing ?? ANIM_DEFAULTS.easing],
    repeat,
    repeatType: "loop",
    ...(spec.times ? { times: spec.times } : {}),
  };
}

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

    // Resolved inside the effect, not above it: `directed()` returns a fresh
    // object whenever a direction is set, so depending on the resolved specs
    // would restart the animation on every render.
    const entry = animation?.entry;
    const exit = animation?.exit;
    const entered = entry ? entrySpec(entry) : undefined;
    const exited = exit ? exitSpec(exit) : undefined;

    // Both phases may need extra resting properties (a clip-path reveal has to
    // rest fully open), so rest is the union of REST and whatever they declare.
    const rest: Frame = { ...REST, ...entered?.rest, ...exited?.rest };

    if (!isPlaying) {
      controls.set(rest);
      return;
    }

    if (entry && entered) {
      const from = entered.keyframes ? firstFrame(entered.keyframes) : entered.frame;
      controls.set({ ...rest, ...from });
      const target: TargetAndTransition = entered.keyframes
        ? { ...entered.keyframes, transition: transitionFor(entry, entered, repeatCount(entry)) }
        : { ...rest, transition: transitionFor(entry, entered, repeatCount(entry)) };
      controls.start(target);
    } else {
      controls.set(rest);
    }

    if (exit && exited) {
      // delayMs is an absolute offset from playback start, same convention as
      // entry/emphasis — no separate "fires at end" field needed.
      timer.current = setTimeout(() => {
        const target: TargetAndTransition = exited.keyframes
          ? { ...exited.keyframes, transition: transitionFor(exit, exited) }
          : { ...rest, ...exited.frame, transition: transitionFor(exit, exited) };
        controls.start(target);
      }, exit.delayMs ?? ANIM_DEFAULTS.delayMs);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isPlaying, animation, controls]);

  const entered = animation?.entry ? entrySpec(animation.entry) : undefined;
  const exited = animation?.exit ? exitSpec(animation.exit) : undefined;
  const emphasisStep = isPlaying ? animation?.attention : undefined;
  const emphasis = emphasisStep ? EMPHASIS[emphasisStep.type] : undefined;
  // Emphasis starts once entry has finished (matching how the Timeline draws
  // its bar), falling back to its own delay when there's no entry animation.
  const emphasisStartMs = animation?.entry
    ? (animation.entry.delayMs ?? ANIM_DEFAULTS.delayMs) + (animation.entry.durationMs ?? ANIM_DEFAULTS.durationMs)
    : emphasisStep?.delayMs ?? ANIM_DEFAULTS.delayMs;

  // minWidth/minHeight: 0 is load-bearing. These wrappers are flex items, and a
  // flex item defaults to min-width:auto — it refuses to shrink below its own
  // content. Without this the wrapper grows past the node's box, so text that
  // wrapped inside (e.g. "30% OFF" in a circular badge) stops wrapping and
  // spills outside the element the moment an animation is applied.
  const box: CSSProperties = { width: "100%", height: "100%", minWidth: 0, minHeight: 0 };

  // Entry wins over exit for the shared 3D/pivot properties: it is what the
  // shopkeeper watches first, and a perspective left set is inert unless
  // something actually rotates in 3D.
  const outerStyle: MotionStyle = {
    ...box,
    ...contentStyle,
    ...(entered?.perspective || exited?.perspective
      ? { transformPerspective: entered?.perspective ?? exited?.perspective }
      : {}),
    ...(entered?.origin || exited?.origin ? { transformOrigin: entered?.origin ?? exited?.origin } : {}),
  };

  const innerStyle: MotionStyle = {
    // Also carries contentStyle: this wrapper is what directly holds the node's
    // content, so it must reproduce the same flex centering the node's own box
    // uses — otherwise an emphasis animation drops the content to the top-left
    // instead of keeping it centred.
    ...box,
    ...contentStyle,
    ...(emphasis?.perspective ? { transformPerspective: emphasis.perspective } : {}),
    ...(emphasis?.origin ? { transformOrigin: emphasis.origin } : {}),
  };

  return (
    <motion.div style={outerStyle} initial={REST} animate={controls}>
      {emphasis && emphasisStep ? (
        <motion.div
          style={innerStyle}
          animate={emphasis.keyframes}
          transition={{
            duration: (emphasisStep.durationMs ?? 1200) / 1000,
            repeat:
              emphasisStep.repeat === "infinite" || emphasisStep.repeat == null
                ? Infinity
                : Math.max(1, emphasisStep.repeat) - 1,
            ease: EASE[emphasisStep.easing ?? "easeInOut"],
            delay: emphasisStartMs / 1000,
            ...(emphasis.times ? { times: emphasis.times } : {}),
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
