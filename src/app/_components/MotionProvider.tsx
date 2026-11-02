"use client";

import type { ReactNode } from "react";
import { LazyMotion } from "framer-motion";

// The animation engine is fetched after the page is interactive instead of shipping in the
// first bundle. Everything on the public pages (variants, scroll reveal, hover/tap, exit)
// is in the DOM feature set; drag and layout animation are not used here.
const loadFeatures = () => import("./motionFeatures").then((module) => module.default);

/**
 * Wraps the public pages. Components inside use `m.*` instead of `motion.*`: `m` is the
 * same component without the bundled engine, and `strict` makes a stray `motion.*` fail
 * loudly rather than quietly pulling the whole engine back in.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
