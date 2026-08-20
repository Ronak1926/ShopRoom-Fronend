/**
 * properties/animationOptions.ts — Canonical entry/attention/exit animation
 * option lists shared by every inspector (Text, Badge/Label, Image, and the
 * generic fallback). Previously each inspector declared its own local copy
 * and they'd drifted (Badge/Label had no Attention/Exit at all) — this is
 * the single source of truth so every element type offers the same set.
 */

export const ENTRY = [
  "NONE", "FADE_IN", "SLIDE_UP", "SLIDE_DOWN", "SLIDE_LEFT", "SLIDE_RIGHT",
  "ZOOM_IN", "ZOOM_OUT", "POP", "BOUNCE",
] as const;
export const ATTENTION = ["NONE", "PULSE", "GLOW", "FLOAT", "WIGGLE", "SHAKE"] as const;
export const EXIT = ["NONE", "FADE_OUT", "SLIDE_DOWN", "ZOOM_OUT"] as const;
export const EASINGS = ["easeOut", "easeIn", "easeInOut", "linear"] as const;
