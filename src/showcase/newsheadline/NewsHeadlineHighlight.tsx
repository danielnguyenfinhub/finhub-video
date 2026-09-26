// Prompt: https://www.remotion.dev/prompts/news-article-headline-highlight
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Highlight } from "@remotion/rough-notation";
import { z } from "zod";
import { brand } from "../../brand/theme";
import { useTyDoFont } from "../../brand/font";

// Everything on the card is a prop, so an RBA or lender story is typed in the
// Studio. The article is laid out in HTML (no screenshot, no OCR): each
// phrase in `highlights` is found in the headline or body and marked.
export const newsHeadlineSchema = z.object({
  outlet: z.string(),
  section: z.string(),
  headline: z.string(),
  body: z.string(), // paragraphs separated by a blank line
  highlights: z.array(z.string()),
});

type Props = z.infer<typeof newsHeadlineSchema>;

// Synthetic default: a made-up outlet and a generic story, not a real article.
export const newsHeadlineDefaultProps: Props = {
  outlet: "The Harbour Ledger",
  section: "Economy · Illustrative example",
  headline: "Reserve Bank holds the cash rate steady as inflation cools",
  body:
    "The central bank left the cash rate unchanged at its latest meeting, saying inflation is easing but is still above its target band.\n\n" +
    "Borrowers on variable loans will see no change to repayments from this decision, and economists expect the board to keep watching household spending closely.",
  highlights: ["holds the cash rate steady", "no change to repayments"],
};

const BLUR_FRAMES = 30; // unblur over the first second
const MARK_FRAMES = 24; // each highlighter stroke
const MARK_GAP = 10;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Splits `text` around the first match of each highlight phrase; each match
// gets its index in `highlights` so the strokes run in the order given.
const splitMarks = (text: string, highlights: string[]) => {
  const parts: { text: string; mark: number | null }[] = [];
  let rest = text;
  for (;;) {
    let best: { at: number; i: number } | null = null;
    highlights.forEach((h, i) => {
      const at = h ? rest.indexOf(h) : -1;
      if (at >= 0 && (best === null || at < best.at)) best = { at, i };
    });
    if (best === null) break;
    const { at, i } = best as { at: number; i: number };
    if (at > 0) parts.push({ text: rest.slice(0, at), mark: null });
    parts.push({ text: highlights[i], mark: i });
    rest = rest.slice(at + highlights[i].length);
  }
  if (rest) parts.push({ text: rest, mark: null });
  return parts;
};

const Marked: React.FC<{ text: string; highlights: string[] }> = ({ text, highlights }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {splitMarks(text, highlights).map((p, k) => {
        if (p.mark === null) return <React.Fragment key={k}>{p.text}</React.Fragment>;
        const start = BLUR_FRAMES + p.mark * (MARK_FRAMES + MARK_GAP);
        const progress = interpolate(frame, [start, start + MARK_FRAMES], [0, 1], clamp);
        return (
          <Highlight key={k} progress={progress} color={brand.highlight} iterations={2} seed={p.mark + 1}>
            {p.text}
          </Highlight>
        );
      })}
    </>
  );
};

export const NewsHeadlineHighlight: React.FC<Props> = ({ outlet, section, headline, body, highlights }) => {
  useTyDoFont();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  const blur = interpolate(frame, [0, BLUR_FRAMES], [14, 0], clamp);
  // Slow, subtle push-in with a ~15° sweep on each axis, left to right.
  const scale = interpolate(t, [0, 1], [1, 1.08]);
  const rotateY = interpolate(t, [0, 1], [-7.5, 7.5]);
  const rotateX = interpolate(t, [0, 1], [7.5, -7.5]);

  return (
    <AbsoluteFill style={{ background: "#ffffff", filter: `blur(${blur}px)`, perspective: 2400 }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <article
          style={{
            width: 1280,
            padding: "64px 80px",
            background: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 30px 80px rgba(11, 31, 61, 0.18)",
            fontFamily: brand.font,
            color: brand.textOnCard,
            transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -0.5, borderBottom: `4px solid ${brand.textOnCard}`, paddingBottom: 18 }}>
            {outlet}
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: brand.primary, textTransform: "uppercase", letterSpacing: 2, marginTop: 28 }}>
            {section}
          </div>
          <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.15, margin: "16px 0 32px" }}>
            <Marked text={headline} highlights={highlights} />
          </h1>
          {body.split(/\n\s*\n/).map((para, i) => (
            <p key={i} style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.5, margin: "0 0 20px", color: "#33415c" }}>
              <Marked text={para} highlights={highlights} />
            </p>
          ))}
        </article>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
