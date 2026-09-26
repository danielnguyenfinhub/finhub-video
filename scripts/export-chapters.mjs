// Prints a YouTube/Facebook chapter list for a MortgageReel video, timed on
// the cut, paced output (the rendered video), e.g.
//   0:00 Mở đầu
//   0:17 Chi phí thật sự
//   node scripts/export-chapters.mjs <slug>
// Chapter titles come from edit.json `chapters`, which the render already
// RG 234-scans. YouTube needs the first chapter at 0:00 and each at least
// 10 s long; this script says so when the video doesn't meet that.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const FPS = 30;
const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/export-chapters.mjs <slug>");
  process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// `path` is under public/; words.json is in the video's recording
// (src/mortgage/recording.ts), edit.json in public/videos/<slug>/.
const read = (path) => {
  try {
    return JSON.parse(readFileSync(join(root, "public", path), "utf8"));
  } catch (err) {
    console.error(`Cannot read public/${path}: ${err.message}`);
    process.exit(1);
  }
};
const { recordingPath } = await import(
  pathToFileURL(join(root, "src", "mortgage", "recording.ts")).href
);
const edit = read(`videos/${slug}/edit.json`);
const words = read(recordingPath(slug, edit.source, "words.json"));
const { buildTimeline, toOutMs, TALK_START_FRAME } = await import(
  pathToFileURL(join(root, "src", "mortgage", "timeline.ts")).href
);
const { segments } = buildTimeline(words, edit, FPS);
const startMs = (TALK_START_FRAME * 1000) / FPS;
const clock = (ms) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const chapters = (edit.chapters ?? [])
  .map((c) => ({ title: c.title, ms: toOutMs(segments, c.atMs, FPS) }))
  .filter((c) => c.ms !== null)
  .map((c) => ({ title: c.title, ms: startMs + c.ms }));
if (chapters.length === 0) {
  console.error(`public/videos/${slug}/edit.json has no chapters.`);
  process.exit(1);
}
const list = [{ title: "Mở đầu", ms: 0 }, ...chapters];
console.log(list.map((c) => `${clock(c.ms)} ${c.title}`).join("\n"));
const short = list.filter((c, i) => i + 1 < list.length && list[i + 1].ms - c.ms < 10_000);
if (short.length)
  console.error(`\nNote: YouTube ignores chapter lists with a chapter under 10 s: ${short.map((c) => c.title).join(", ")}.`);
