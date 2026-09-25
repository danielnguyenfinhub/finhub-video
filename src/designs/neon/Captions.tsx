// "neon" captions: TikTok-style, one big glowing word at a time, built
// directly from reel.timeline.captions (a leading space marks the start of a
// word; a token without one glues onto the previous word, e.g. "4" + ".1").
// Numbers and keywords (emphasised) hold a bigger size and a stronger glow.
import type React from "react";
import { useMemo } from "react";
import {
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import { SAFE } from "../../mortgage/golden";
import type { Reel } from "../../mortgage/schema";
import { emphasised, FONT } from "../../mortgage/style";
import type { OutCaption } from "../../mortgage/timeline";

type Word = { text: string; startMs: number; endMs: number };

const mergeWords = (caps: OutCaption[]): Word[] => {
  const out: Word[] = [];
  for (const c of caps) {
    const prev = out[out.length - 1];
    if (prev && !c.text.startsWith(" ")) {
      prev.text += c.text;
      prev.endMs = c.endMs;
    } else {
      out.push({ text: c.text, startMs: c.startMs, endMs: c.endMs });
    }
  }
  return out;
};

const NeonWord: React.FC<{ text: string; big: boolean }> = ({ text, big }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 220 } });
  const scale = interpolate(pop, [0, 1], [0.7, 1]);
  const glow = big ? 34 : 20;
  const size = big ? 143 : 110;
  // Golden rule 3: big-word captions y >= 1300, bottom <= SAFE.bottom.
  // Anchor from the bottom so the word's own height never pushes past
  // SAFE.bottom regardless of font size.
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: 1080 - SAFE.right,
        bottom: 1920 - SAFE.bottom,
        textAlign: "center",
        fontFamily: FONT,
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontWeight: 900,
          fontSize: size,
          color: "#FFF4DA",
          // A dark pill behind the glowing word: it sits over Daniel's chin
          // in a full-frame talk (his rule 5, legible over moving video).
          background: "rgba(7, 20, 42, 0.62)",
          padding: "0 28px",
          borderRadius: 999,
          transform: `scale(${scale})`,
          textShadow: `0 0 6px #fff, 0 0 ${glow}px ${brand.highlight}, 0 0 ${glow * 2}px ${brand.highlight}`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const NeonCaptions: React.FC<{ reel: Reel; keywords: string[] }> = ({
  reel,
  keywords,
}) => {
  const { fps } = useVideoConfig();
  const words = useMemo(
    () => mergeWords(reel.timeline.captions),
    [reel.timeline.captions],
  );
  const hit = useMemo(
    () =>
      emphasised(
        words.map((w) => w.text),
        keywords,
      ),
    [words, keywords],
  );
  return (
    <>
      {words.map((w, i) => {
        const from = Math.round((w.startMs / 1000) * fps);
        const to = Math.round((w.endMs / 1000) * fps);
        const dur = Math.max(1, to - from);
        const text = w.text.trim();
        if (!text) return null;
        return (
          <Sequence
            key={`${w.startMs}-${i}`}
            from={from}
            durationInFrames={dur}
            layout="none"
          >
            <NeonWord text={text} big={hit.has(i)} />
          </Sequence>
        );
      })}
    </>
  );
};
