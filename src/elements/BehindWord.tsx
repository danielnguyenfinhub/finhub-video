// A spoken keyword drawn huge BEHIND Daniel: render it from a design's Behind
// layer (between the backdrop and his cut-out), so his head and shoulders
// cover part of the word, the way a magazine cover puts the title behind the
// model. Idea from HyperFrames' embedded-captions "embed" mode (Apache-2.0);
// here it rides the existing cut-out instead of a separate matte.
//
// Words come from the talk captions; the emphasised ones (keywords, numbers)
// are candidates, and at most `max` are shown, at least `gapMs` apart, so it
// stays an accent on the big moments rather than a second caption track.
import { fitText } from "@remotion/layout-utils";
import type React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand/theme";
import type { OutCaption } from "../mortgage/timeline";
import { FONT, clamp, emphasised } from "../mortgage/style";

// Above-and-around the head (Daniel's measured footage: hair top y~600,
// face x 250-830), so the word reads first, then disappears behind him.
const BAND_TOP = 430;
const MAX_WIDTH = 1000;
const MAX_SIZE = 260;

export type BehindWordPick = { text: string; fromMs: number; toMs: number };

// Pure, so a design (or a test) can see what will be shown.
export const pickBehindWords = (
  captions: OutCaption[],
  keywords: string[],
  { max = 4, gapMs = 6000, holdMs = 1400 } = {},
): BehindWordPick[] => {
  const hits = emphasised(captions.map((c) => c.text), keywords);
  const picks: BehindWordPick[] = [];
  for (const i of [...hits].sort((a, b) => a - b)) {
    const c = captions[i];
    const text = c.text.trim().replace(/[,.!?;:]+$/, "");
    if (text.length < 2) continue; // too short to be a hero word
    const last = picks[picks.length - 1];
    if (last && c.startMs - last.fromMs < gapMs) continue;
    picks.push({ text: text.toUpperCase(), fromMs: c.startMs, toMs: c.startMs + holdMs });
    if (picks.length === max) break;
  }
  return picks;
};

const Word: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const size = Math.min(
    MAX_SIZE,
    fitText({ text, withinWidth: MAX_WIDTH, fontFamily: FONT, fontWeight: 900 }).fontSize,
  );
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: BAND_TOP,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: size,
          // Room for Vietnamese stacked marks above the caps.
          lineHeight: 1.25,
          color: brand.highlight,
          whiteSpace: "nowrap",
          opacity: pop * (1 - out),
          transform: `scale(${interpolate(pop, [0, 1], [1.25, 1])})`,
          textShadow: "0 10px 40px rgba(11,31,61,0.55)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const BehindWord: React.FC<{
  captions: OutCaption[];
  keywords: string[];
  max?: number;
  gapMs?: number;
  holdMs?: number;
}> = ({ captions, keywords, ...opts }) => {
  const { fps } = useVideoConfig();
  const f = (ms: number) => Math.round((ms / 1000) * fps);
  return (
    <>
      {pickBehindWords(captions, keywords, opts).map((p) => (
        <Sequence
          key={p.fromMs}
          from={f(p.fromMs)}
          durationInFrames={Math.max(1, f(p.toMs) - f(p.fromMs))}
        >
          <Word text={p.text} />
        </Sequence>
      ))}
    </>
  );
};
