// Check for src/mortgage/captionPages.ts. Run: node scripts/check-caption-pages.mjs [slug]
// (exit 1 on failure). With a slug, also compares against plain
// createTikTokStyleCaptions on that video's words.json and prints the counts.
import { readFileSync } from "node:fs";
import { createTikTokStyleCaptions } from "@remotion/captions";

const { captionPages } = await import(new URL("../src/mortgage/captionPages.ts", import.meta.url));
const OPTS = { combineWithinMs: 900, breakOnSilenceAfterMs: 350 };
const SENTENCE_END = /[.!?…]["'”’)\]]*$/u;
const LEANS_FORWARD = /^(và|của|cho|là|thì|mà|với|để|các|những|một)$/u;

// Synthetic words, 150 ms apart (no pauses), Whisper-style leading spaces.
const words = (text) =>
  text.split(" ").map((w, i) => ({
    text: ` ${w}`, startMs: i * 150, endMs: i * 150 + 120, timestampMs: null, confidence: null,
  }));

const problems = (pages) => {
  let crossing = 0, awkward = 0;
  pages.forEach((p, i) => {
    p.tokens.slice(0, -1).forEach((t) => SENTENCE_END.test(t.text.trim()) && crossing++);
    const last = p.tokens[p.tokens.length - 1].text.trim().toLowerCase();
    if (i < pages.length - 1 && LEANS_FORWARD.test(last)) awkward++;
  });
  return { crossing, awkward };
};

const input = words("Lãi suất tăng. Các bạn nên xem khoản vay của bạn và so sánh với ngân hàng khác trước khi quyết định nhé.");
const pages = captionPages({ captions: input, ...OPTS });
const flat = pages.flatMap((p) => p.tokens.map((t) => t.text.trim())).join(" ");
const p = problems(pages);
const ok =
  flat === input.map((w) => w.text.trim()).join(" ") &&
  pages.every((pg) => !pg.tokens[0].text.startsWith(" ")) && // nothing lost, reordered or duplicated
  p.crossing === 0 && p.awkward === 0 &&
  pages.every((pg) => pg.durationMs > 0) &&
  pages.every((pg, i) => i === 0 || pg.startMs >= pages[i - 1].startMs + pages[i - 1].durationMs - 1);
if (!ok) {
  console.error("captionPages check failed", JSON.stringify(pages.map((x) => [x.text, x.startMs, x.durationMs])));
  process.exit(1);
}
// Glued tokens (Whisper splits "4.1%" into " 4", ".1", "%") keep their spacing,
// including when a page boundary is nudged next to them.
const num = captionPages({ captions: [
  ...words("Lãi suất là"), { text: " 4", startMs: 450, endMs: 520, timestampMs: null, confidence: null },
  { text: ".1", startMs: 520, endMs: 600, timestampMs: null, confidence: null },
  { text: "%", startMs: 600, endMs: 650, timestampMs: null, confidence: null },
], ...OPTS });
const numText = num.map((x) => x.text).join(" ");
if (!numText.includes("4.1%")) { console.error("glued number split:", numText); process.exit(1); }
console.log("captionPages ok");

const slug = process.argv[2];
if (slug) {
  const { recordingPath } = await import(new URL("../src/mortgage/recording.ts", import.meta.url));
  const edit = JSON.parse(readFileSync(new URL(`../public/videos/${slug}/edit.json`, import.meta.url), "utf8"));
  const raw = JSON.parse(readFileSync(new URL(`../public/${recordingPath(slug, edit.source, "words.json")}`, import.meta.url), "utf8"));
  const caps = Array.isArray(raw) ? raw : raw.words;
  const before = problems(createTikTokStyleCaptions({ captions: caps, combineTokensWithinMilliseconds: OPTS.combineWithinMs, breakOnSilenceAfterMilliseconds: OPTS.breakOnSilenceAfterMs }).pages);
  const after = problems(captionPages({ captions: caps, ...OPTS }));
  console.log(`${slug}: pages crossing a sentence end ${before.crossing} -> ${after.crossing}; pages ending on a function word ${before.awkward} -> ${after.awkward}`);
}
