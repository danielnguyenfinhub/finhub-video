// Captions in a boxed card near the bottom: words are grouped into pages with
// @remotion/captions' createTikTokStyleCaptions, and the word being said is lit
// in the accent colour. Takes the same Caption[] as words.json (times in ms,
// relative to where this element starts). No CSS transitions: a render draws
// every frame on its own, so a transition would never play.
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";
import { FONT } from "../mortgage/style";

export const CaptionBox: React.FC<{
  captions: Caption[];
  combineWithinMs?: number;
  width?: number;
}> = ({ captions, combineWithinMs = 1200, width = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: combineWithinMs,
      }),
    [captions, combineWithinMs],
  );
  const page = pages.find(
    (p) => nowMs >= p.startMs && nowMs < p.startMs + p.durationMs,
  );
  if (!page) return null;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 260,
      }}
    >
      <div
        style={{
          width,
          padding: "24px 36px",
          borderRadius: 24,
          backgroundColor: "rgba(11, 31, 61, 0.92)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1.35,
          color: "#fff",
          whiteSpace: "pre-wrap",
        }}
      >
        {page.tokens.map((t) => (
          <span
            key={t.fromMs}
            style={{
              color:
                nowMs >= t.fromMs && nowMs < t.toMs ? brand.accent : "#fff",
            }}
          >
            {t.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
