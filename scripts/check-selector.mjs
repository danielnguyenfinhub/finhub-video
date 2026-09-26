// Self-test for scripts/select-template.mjs on synthetic briefs (no slug, no
// media): node scripts/check-selector.mjs -> "selector ok", exit 1 on failure.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadManifests, rank } from "./select-template.mjs";

const cfg = JSON.parse(readFileSync(join(import.meta.dirname, "..", "config", "selector.json"), "utf8"));
const manifests = loadManifests();
const byId = Object.fromEntries(manifests.map((t) => [t.id, t]));
let failed = false;
const check = (name, ok, detail = "") => {
  if (!ok) {
    failed = true;
    console.log(`FAIL ${name}${detail ? `  (${detail})` : ""}`);
  }
};

const brief = (over) => ({
  mode: "A", intent: "explain", intents: ["explain"], dataShapes: ["narrative"],
  counts: { numbers: 0, comparisons: 0, steps: 0, banks: 0, eligibility: 0, narrative: 4 },
  aspect: "9:16", languages: ["vi"], longestCard: { vi: 20, en: 0 }, shortestHoldMs: null,
  assets: { foreground: true, voice: false, script: false }, ...over,
});

check("14 manifests", manifests.length === 14, String(manifests.length));

// A number-heavy talk ranks the data templates above the story ones.
const numbers = brief({
  intent: "data", intents: ["data", "explain"], dataShapes: ["numbers", "banks"],
  counts: { numbers: 12, comparisons: 0, steps: 0, banks: 2, eligibility: 0, narrative: 0 },
});
const { ranked } = rank(numbers, manifests, [], cfg);
const score = (id) => ranked.find((r) => r.id === id)?.score ?? -Infinity;
const stories = ranked.filter((r) => byId[r.id].intents.includes("story"));
check("number brief has story templates to beat", stories.length > 0);
for (const s of stories) check(`datalab > ${s.id}`, score("datalab") > s.score, `${score("datalab")} vs ${s.score}`);
check("a data template leads", byId[ranked[0].id].intents.includes("data"), ranked[0].id);

// A faceless video never gets a template that needs Daniel on screen.
const faceless = brief({ mode: "B", languages: ["vi", "en"], assets: { foreground: false, voice: true, script: true } });
const fr = rank(faceless, manifests, [], cfg);
check("faceless: no face-required", fr.ranked.every((r) => byId[r.id].facePolicy !== "face-required"), fr.ranked.map((r) => r.id).join(","));
check("faceless: something ranks", fr.ranked.length > 0);

// The skin used by the last video scores lower than when it was not used.
const fresh = score("datalab");
const used = rank(numbers, manifests, [{ slug: "x", design: "datalab", date: "2026-09-26" }], cfg);
const after = used.ranked.find((r) => r.id === "datalab");
check("recency lowers the just-used skin", after.score < fresh && after.rec === 1, `${fresh} -> ${after.score}`);

// An on-camera brief with the foreground found scores AssetReady for on-camera designs.
const fg = rank(brief(), manifests, [], cfg).ranked.filter((r) => byId[r.id].facePolicy !== "faceless");
check("foreground present: AssetReady > 0", fg.length > 0 && fg.every((r) => r.asset > 0), fg.map((r) => `${r.id}:${r.asset}`).join(","));

// Hard filters: a card too long for a template drops it.
const long = rank(brief({ longestCard: { vi: 200, en: 0 } }), manifests, [], cfg);
check("200-char card drops everything", long.ranked.length === 0, long.ranked.map((r) => r.id).join(","));

if (failed) process.exit(1);
console.log("selector ok");
