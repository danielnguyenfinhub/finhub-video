// Check for review/shift.ts. Run: node review/check-shift.mjs (exit 1 on failure).
const { shiftTimes } = await import(new URL("./shift.ts", import.meta.url));
const cue = { kind: "kinetic", fromMs: 1000, toMs: 3000, struck: [{ text: "x", atMs: 1200, strikeMs: 1500 }], slam: { text: "y", atMs: 2000 } };
const got = shiftTimes(cue, 500);
const ok =
  got.fromMs === 1500 && got.toMs === 3500 && got.struck[0].atMs === 1700 &&
  got.struck[0].strikeMs === 2000 && got.slam.atMs === 2500 && got.struck[0].text === "x" &&
  cue.fromMs === 1000 && // input untouched
  shiftTimes({ atMs: 100, durMs: 3000 }, -500).atMs === 0 && // clamped at 0
  shiftTimes({ atMs: 100, durMs: 3000 }, -50).durMs === 3000; // durations stay
if (!ok) { console.error("shiftTimes check failed", JSON.stringify(got)); process.exit(1); }
console.log("shiftTimes ok");

// toSrcMs must invert toOutMs across cuts and sped-up segments (the drag
// timeline relies on it). Synthetic segments at 30 fps: 0-3 s kept at 1x,
// 3-5 s cut, 5-9 s kept at 2x.
const { toOutMs, toSrcMs } = await import(new URL("../src/mortgage/timeline.ts", import.meta.url));
const segs = [
  { srcFrom: 0, srcTo: 90, outFrom: 0, outDuration: 90, rate: 1 },
  { srcFrom: 150, srcTo: 270, outFrom: 90, outDuration: 60, rate: 2 },
];
const trips = [0, 1500, 2990, 5000, 6000, 8900].map((ms) => [ms, toSrcMs(segs, toOutMs(segs, ms, 30), 30)]);
const bad = trips.filter(([a, b]) => Math.abs(a - b) > 1);
if (bad.length || toSrcMs(segs, 999999, 30) !== 9000 || toSrcMs(segs, -50, 30) !== 0) {
  console.error("toSrcMs check failed", JSON.stringify(trips));
  process.exit(1);
}
console.log("toSrcMs ok");
