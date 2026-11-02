// Shows which heavy libraries ship on which routes, from the last `next build`.
//
//   pnpm build && node scripts/bundleAudit.mjs
//
// Reads .next/diagnostics/route-bundle-stats.json (first-load JS per route and the
// chunks behind it) and looks inside each chunk for names that survive minification,
// so a library that was meant to be code-split but leaked into a shared chunk shows up
// as "loaded by 25/25 routes". Exits non-zero when a route listed in BUDGETS_KB is over.
import { readFileSync } from "node:fs";

const STATS_FILE = ".next/diagnostics/route-bundle-stats.json";

/** First-load JS ceilings (uncompressed KB). The studio is allowed to be big; nothing else is. */
const BUDGETS_KB = {
  "/shopkeeper/notifications/studio": 1400,
  "/customer/room/[roomId]": 1550,
};
const DEFAULT_BUDGET_KB = 1250;

// Names that survive minification, per library.
const SIGNATURES = {
  "framer-motion": ["whileHover", "whileTap"],
  "animation presets": ["ELASTIC_IN", "RUBBER_BAND", "SPLIT_IN"],
  "three.js": ["WebGLRenderer", "PerspectiveCamera"],
  leaflet: ["leaflet-container", "_leaflet_id"],
  "emoji picker": ["EmojiStyle"],
  "firebase messaging": ["firebase/messaging", "@firebase/messaging"],
  "react-easy-crop": ["reactEasyCrop"],
};

const stats = JSON.parse(readFileSync(STATS_FILE, "utf8"));
const kb = (bytes) => `${Math.round(bytes / 1024)}`.padStart(5);

const chunks = new Map();
for (const row of stats) {
  for (const chunk of row.firstLoadChunkPaths) {
    if (chunks.has(chunk)) continue;
    const body = readFileSync(chunk.replaceAll("\\", "/"), "utf8");
    chunks.set(chunk, {
      bytes: Buffer.byteLength(body),
      libraries: Object.entries(SIGNATURES)
        .filter(([, names]) => names.some((name) => body.includes(name)))
        .map(([library]) => library),
    });
  }
}

console.log("Heavy libraries and the routes whose first load includes them:\n");
const byLibrary = new Map();
for (const [chunk, info] of chunks) for (const library of info.libraries) (byLibrary.get(library) ?? byLibrary.set(library, []).get(library)).push(chunk);
for (const [library, libraryChunks] of byLibrary) {
  const routes = stats.filter((row) => row.firstLoadChunkPaths.some((c) => libraryChunks.includes(c))).map((row) => row.route);
  const size = libraryChunks.reduce((sum, c) => sum + chunks.get(c).bytes, 0);
  console.log(`${library}  (chunks totalling ${kb(size)} KB)`);
  console.log(`   ${routes.length}/${stats.length} routes: ${routes.length > 6 ? `${routes.slice(0, 6).join(", ")}, …` : routes.join(", ")}\n`);
}

const baselineRoute = [...stats].sort((a, b) => a.firstLoadUncompressedJsBytes - b.firstLoadUncompressedJsBytes)[0];
const baseline = new Set(baselineRoute.firstLoadChunkPaths);
console.log(`First-load JS per route, uncompressed (smallest route: ${baselineRoute.route}):\n`);
let overBudget = 0;
for (const row of [...stats].sort((a, b) => b.firstLoadUncompressedJsBytes - a.firstLoadUncompressedJsBytes)) {
  const extra = row.firstLoadChunkPaths.filter((c) => !baseline.has(c));
  const extras = [...new Set(extra.flatMap((c) => chunks.get(c).libraries))];
  const budget = BUDGETS_KB[row.route] ?? DEFAULT_BUDGET_KB;
  const over = row.firstLoadUncompressedJsBytes / 1024 > budget;
  if (over) overBudget += 1;
  console.log(`${kb(row.firstLoadUncompressedJsBytes)} KB ${over ? "OVER " : "     "}${row.route.padEnd(38)} ${extras.length ? `+ ${extras.join(", ")}` : ""}`);
}
if (overBudget > 0) {
  console.error(`\n${overBudget} route(s) exceed their first-load budget (see BUDGETS_KB in this script).`);
  process.exit(1);
}
