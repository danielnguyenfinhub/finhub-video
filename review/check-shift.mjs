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
