// Golden rules every design gets for free (Daniel, 25/09/2026):
//   1. a spoken number always gets a visual (figuresOf: edit.json stats plus an
//      automatic figure for every number the captions carry that no stat or
//      cue covers);
//   2. a bank Daniel names shows its logo (lenderMentionsOf);
//   3. everything sits inside the 4:5 band, so one render works as a Reel
//      and in the Facebook feed (SAFE).
// Designs decide how these look, never whether they appear.
import { findLenderMentions, type LenderMention } from "./lenders";
import type { Reel } from "./schema";
import { toOutMs } from "./timeline";

// 1080x1920 frame; Facebook crops the feed post to the middle 1080x1350
// (y 285-1635) and keeps its own header/CTA over the top 10% and bottom 12%
// of that crop; Reels cover the top 14%, bottom 20% and the right-hand
// buttons. SAFE is the strictest of both (Daniel's spec, 25/09/2026).
export const SAFE = {
  top: 420,
  bottom: 1473,
  left: 54,
  right: 960,
} as const;

// Where Daniel's face is in a full-frame talk (head centred, eyes near the
// upper third). Golden rule: no overlay element inside it; charts go BEHIND
// him (design.Behind) and captions below it.
export const FACE = { left: 250, right: 830, top: 480, bottom: 1250 } as const;

// The Finance Hub logo shows for the first and last 10 s of the talk only
// (and on the cover / outro), at this height on its white tile.
export const LOGO_SECONDS = 10;
export const LOGO_HEIGHT = 120;
// The hook owns the top of the frame for its first 3.5 s, so the opening logo
// window starts after it (3.5–10 s): the two never sit on each other.
export const HOOK_FRAMES = 105;
export const logoVisible = (
  frame: number,
  talkFrames: number,
  fps: number,
): boolean =>
  (frame >= HOOK_FRAMES && frame < LOGO_SECONDS * fps) ||
  frame >= talkFrames - LOGO_SECONDS * fps;

export type Figure = {
  fromFrame: number; // talk timeline
  frames: number;
  big: string; // the number as said, e.g. "4.1", "0,4%", "1.600"
  label: string; // stat label, or the words around an automatic figure
  source: "stat" | "auto";
};

const AUTO_MS = 2600;
const AUTO_GAP_MS = 4000;
// Money and percent units only: "1 năm", "1 phần lời" are counts, not figures.
const UNIT = /^(%|tỷ|ti|triệu|nghìn|ngàn|đô|k)(?!\p{L})/iu;
const NUMERIC = /^[.,]?\d/;
const clean = (s: string) => s.trim().replace(/[.,!?;:]+$/g, "");

// Every number in the captions, glued across Whisper's split tokens ("4" ".1"
// -> "4.1", "100" ".000" "%" -> "100.000%").
const spokenNumbers = (reel: Reel) => {
  const caps = reel.timeline.captions;
  const out: { big: string; label: string; startMs: number }[] = [];
  for (let i = 0; i < caps.length; i++) {
    if (!/\d/.test(caps[i].text)) continue;
    let j = i;
    let big = caps[i].text.trim();
    while (
      j + 1 < caps.length &&
      !caps[j + 1].text.startsWith(" ") &&
      (NUMERIC.test(caps[j + 1].text) || caps[j + 1].text.startsWith("%"))
    ) {
      big += caps[++j].text.trim();
    }
    const next = caps[j + 1]?.text.trim() ?? "";
    // "6,2 phần trăm" is said, "6,2%" is shown.
    const percent =
      next.toLowerCase() === "phần" &&
      /^trăm(?!\p{L})/iu.test(caps[j + 2]?.text.trim() ?? "");
    // ponytail: a bare small count ("1 năm", "2 người") is not a figure
    // unless a money/percent unit follows; add units above when one slips through.
    const bare = /^\d{1,2}$/.test(clean(big)) && !UNIT.test(next) && !percent;
    if (!bare) {
      const around = caps
        .slice(Math.max(0, i - 3), Math.min(caps.length, j + 4))
        .map((c) => c.text)
        .join("")
        .trim();
      out.push({
        big: clean(big) + (percent ? "%" : ""),
        label: around,
        startMs: caps[i].startMs,
      });
    }
    i = j;
  }
  return out;
};

// Talk-timeline spans (ms) that already carry a visual for their numbers.
const coveredSpans = (reel: Reel, fps: number) => {
  const segs = reel.timeline.segments;
  const out = (ms: number) => toOutMs(segs, ms, fps);
  const spans: [number, number][] = [];
  for (const s of reel.edit.stats ?? []) {
    const a = out(s.atMs);
    if (a !== null) spans.push([a, a + s.durMs]);
  }
  for (const c of reel.edit.cues ?? []) {
    const a = out(c.fromMs);
    const b = out(c.toMs);
    if (a !== null) spans.push([a, b ?? a + AUTO_MS]);
  }
  return spans;
};

export const figuresOf = (reel: Reel, fps: number): Figure[] => {
  const segs = reel.timeline.segments;
  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const stats: Figure[] = (reel.edit.stats ?? []).flatMap((s) => {
    const a = toOutMs(segs, s.atMs, fps);
    return a === null
      ? []
      : [
          {
            fromFrame: toFrame(a),
            frames: toFrame(s.durMs),
            big: s.big,
            label: s.label,
            source: "stat" as const,
          },
        ];
  });
  const spans = coveredSpans(reel, fps);
  const autos: Figure[] = [];
  let lastMs = -Infinity;
  for (const n of spokenNumbers(reel)) {
    // Words before the figure are said before it; give the card a head start.
    const at = n.startMs - 200;
    if (spans.some(([a, b]) => at >= a - 500 && at <= b)) continue;
    if (at - lastMs < AUTO_GAP_MS) continue;
    lastMs = at;
    autos.push({
      fromFrame: Math.max(0, toFrame(at)),
      frames: toFrame(AUTO_MS),
      big: n.big,
      label: n.label,
      source: "auto",
    });
  }
  return [...stats, ...autos].sort((a, b) => a.fromFrame - b.fromFrame);
};

export const lenderMentionsOf = (reel: Reel): LenderMention[] =>
  findLenderMentions(reel.timeline.captions);

// Golden rule 4 (WP3, 26/09/2026): a cutaway hides Daniel's face (pip and
// overlay keep him on screen). A single cutaway may not run longer than this,
// and must not cover a spoken number: its figure would be hidden with him.
// UNTUNED: a first guess at 4 s; tune it once Daniel has watched a few.
export const CUTAWAY_MAX_MS = 4000;

export type FaceHidden = {
  totalMs: number; // face-hidden time on the talk timeline
  longestMs: number; // longest single face-hidden stretch
  tooLong: { atMs: number; durMs: number }[]; // cutaways over CUTAWAY_MAX_MS
  overNumbers: { atMs: number; big: string }[]; // cutaways covering a number
};

// atMs as in edit.json (source ms) so a report points at the visual to fix.
export const faceHiddenOf = (reel: Reel, fps: number): FaceHidden => {
  const cut = (reel.edit.visuals ?? []).flatMap((v) => {
    const a = v.mode === "cutaway" ? toOutMs(reel.timeline.segments, v.atMs, fps) : null;
    return a === null ? [] : [{ v, a, b: a + v.durMs }];
  });
  // Overlapping cutaways are one stretch of hidden face.
  const merged: [number, number][] = [];
  for (const { a, b } of [...cut].sort((x, y) => x.a - y.a)) {
    const last = merged[merged.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else merged.push([a, b]);
  }
  const numbers = spokenNumbers(reel);
  return {
    totalMs: merged.reduce((t, [a, b]) => t + b - a, 0),
    longestMs: Math.max(0, ...merged.map(([a, b]) => b - a)),
    tooLong: cut
      .filter(({ v }) => v.durMs > CUTAWAY_MAX_MS)
      .map(({ v }) => ({ atMs: v.atMs, durMs: v.durMs })),
    overNumbers: cut.flatMap(({ v, a, b }) =>
      numbers
        .filter((n) => n.startMs >= a && n.startMs < b)
        .map((n) => ({ atMs: v.atMs, big: n.big })),
    ),
  };
};
