// Lint ratchet: a file may never have MORE ESLint errors than recorded in
// .lint-baseline.json (missing = 0). Existing violations are tolerated until
// someone touches them; new ones are not.
//
//   node scripts/lintRatchet.mjs                 check everything under src/ (CI)
//   node scripts/lintRatchet.mjs path/a.tsx ...  check only these files (pre-commit)
//   node scripts/lintRatchet.mjs --update        rewrite the baseline from the current state
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { relative, resolve } from "node:path";

const BASELINE = ".lint-baseline.json";
const args = process.argv.slice(2);
const update = args.includes("--update");
const files = args.filter((a) => !a.startsWith("--"));

const result = spawnSync(
  "pnpm",
  ["exec", "eslint", "--format", "json", ...(files.length ? files : ["src"])],
  { encoding: "utf8", shell: process.platform === "win32", maxBuffer: 64 * 1024 * 1024 },
);
let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error("ESLint did not produce a report:\n" + (result.stderr || result.stdout).slice(0, 2000));
  process.exit(2);
}

const current = {};
for (const file of report) {
  const errors = file.messages.filter((m) => m.severity === 2).length;
  if (errors > 0) current[relative(process.cwd(), file.filePath).split("\\").join("/")] = errors;
}

if (update) {
  if (files.length) {
    console.error("--update rewrites the whole baseline; run it without file arguments.");
    process.exit(2);
  }
  const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(BASELINE, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Baseline written: ${Object.keys(sorted).length} files, ${Object.values(sorted).reduce((a, b) => a + b, 0)} errors.`);
  process.exit(0);
}

const baseline = existsSync(resolve(BASELINE)) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
const checked = new Set(report.map((f) => relative(process.cwd(), f.filePath).split("\\").join("/")));
const regressions = [];
const improved = [];
for (const file of checked) {
  const now = current[file] ?? 0;
  const allowed = baseline[file] ?? 0;
  if (now > allowed) regressions.push(`${file}: ${now} errors (allowed ${allowed})`);
  else if (now < allowed) improved.push(`${file}: ${now} (was ${allowed})`);
}

if (improved.length) {
  console.log(`Fewer errors than the baseline in ${improved.length} file(s); run "node scripts/lintRatchet.mjs --update" to lock that in:`);
  improved.forEach((line) => console.log("  " + line));
}
if (regressions.length) {
  console.error("New lint errors:");
  regressions.forEach((line) => console.error("  " + line));
  console.error('Run "pnpm exec eslint <file>" to see them.');
  process.exit(1);
}
console.log(`Lint ratchet OK (${checked.size} file(s) checked).`);
