/**
 * features/notifications/scenes/types.ts — Scene shape and the category list.
 * Split out from index.ts so every scene file can import it without pulling in
 * the whole catalog (which would be a cycle).
 */

import type { Background, CompositionNode } from "../types";

export const SCENE_CATEGORIES = [
  "All",
  "Nature",
  "Clouds",
  "Abstract",
  "Geometric",
  "Sale",
  "Retail",
  "Festive",
  "Seasonal",
  "Minimal",
  "Glow",
  "Premium",
  "Night",
] as const;
export type SceneCategory = (typeof SCENE_CATEGORIES)[number];

export interface Scene {
  id: string;
  name: string;
  category: Exclude<SceneCategory, "All">;
  /**
   * The scene's signature colour — the same one its stage/platform/halo is
   * built from. Applying the scene derives the content palette (heading ink,
   * button fill, badge text) from this, so the copy and CTA belong to the
   * artwork instead of staying in the template's original theme.
   */
  accent: string;
  background: Background;
  elements: CompositionNode[];
}
