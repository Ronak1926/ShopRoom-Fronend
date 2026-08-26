/**
 * features/notifications/scenes — ShopRoom scene catalog (data, not React).
 *
 * A "scene" is the editable background composition of a notification: a canvas
 * background plus layered DECORATION nodes. Applying one inserts those as
 * normal composition nodes, so every object stays editable in Layers.
 *
 * Scenes live in per-theme files rather than one list, because the catalog is
 * large enough that a single module would be unreviewable. helpers.ts holds the
 * shared primitives and documents the placement rule they all obey.
 */

import { ABSTRACT_SCENES } from "./abstract";
import { CLASSIC_SCENES } from "./classic";
import { CLOUD_SCENES } from "./clouds";
import { FESTIVE_SCENES } from "./festive";
import { GEOMETRIC_SCENES } from "./geometric";
import { GLOW_SCENES } from "./glow";
import { MINIMAL_SCENES } from "./minimal";
import { NATURE_SCENES } from "./nature";
import { NIGHT_SCENES } from "./night";
import { PREMIUM_SCENES } from "./premium";
import { RETAIL_SCENES } from "./retail";
import { SEASONAL_SCENES } from "./seasonal";
import { SCENE_CATEGORIES, type Scene, type SceneCategory } from "./types";

export { SCENE_CATEGORIES };
export type { Scene, SceneCategory };

/**
 * Classic first so the twelve original scenes stay at the top of the browser
 * where shopkeepers are used to finding them; everything else follows.
 */
export const SCENES: Scene[] = [
  ...CLASSIC_SCENES,
  ...NATURE_SCENES,
  ...CLOUD_SCENES,
  ...ABSTRACT_SCENES,
  ...GEOMETRIC_SCENES,
  ...RETAIL_SCENES,
  ...FESTIVE_SCENES,
  ...SEASONAL_SCENES,
  ...MINIMAL_SCENES,
  ...GLOW_SCENES,
  ...PREMIUM_SCENES,
  ...NIGHT_SCENES,
];

export function scenesByCategory(cat: SceneCategory): Scene[] {
  return cat === "All" ? SCENES : SCENES.filter((s) => s.category === cat);
}

/** Category + free-text filter used by the Scenes library. */
export function filterScenes(cat: SceneCategory, query: string): Scene[] {
  const q = query.trim().toLowerCase();
  return scenesByCategory(cat).filter(
    (s) => !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
  );
}

/** A blank scene — the starting point for "New Blank Scene". */
export function blankScene(): Scene {
  return {
    id: "custom-scene",
    name: "My Scene",
    category: "Minimal",
    accent: "#5B47D4",
    background: { type: "SOLID", color: "#FFFFFF" },
    elements: [],
  };
}
