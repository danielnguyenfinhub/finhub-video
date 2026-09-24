// Checks the caption slip fixes in src/mortgage/timeline.ts on a synthetic
// transcript. Run: node scripts/check-caption-fixes.mjs (exit 1 on failure).
const t = await import(new URL("../src/mortgage/timeline.ts", import.meta.url));
const words = ["Gói", " vai", " này", " tiền", " giống", " như", " tiền", " giống."];
const ws = words.map((text, i) => ({ text, startMs: i * 400, endMs: i * 400 + 350, timestampMs: null, confidence: 1 }));
const got = t.buildTimeline(ws, {}, 30).captions.map((c) => c.text).join("");
const want = " Gói vay này tiền giống như tiền gốc.";
if (got !== want) {
  console.error(`caption fixes: got "${got}", want "${want}"`);
  process.exit(1);
}
console.log("caption fixes ok");
