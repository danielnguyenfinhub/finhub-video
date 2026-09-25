// Overlay pieces that stay small and unhurried: a tilted polaroid for numbers
// (adapted from .claude/elements/storytelling/polaroid-pictures), a plain
// white tag for a named bank, and a chapter title with a brief amber wash.
import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import type { Figure } from "../../mortgage/golden";
import { SAFE } from "../../mortgage/golden";
import type { Lender } from "../../mortgage/lenders";
import { LenderLogo } from "../../mortgage/LenderLogo";
import { FONT } from "../../mortgage/style";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WARM_GREY = "#8C8271";
const PALE_NAVY = "rgba(11,31,61,0.16)";

// A single tilted polaroid at the top-left of SAFE: a pale-navy ring behind
// the figure's number (Daniel, 25/09/2026: too small at 216px/30px — now
// 360px wide with an 84px+ number, kept readable above/left of his head by
// shrinking the ring, not the text; it may run behind his hair on the right).
export const Polaroid: React.FC<{ figure: Figure }> = ({ figure }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 18], [0, 1], clamp);
  const outP = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    clamp,
  );
  const opacity = Math.min(inP, outP);
  const ringSize = 150;
  const r = 62;
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top,
        left: SAFE.left,
        width: 360,
        background: "#fff",
        borderRadius: 18,
        padding: "20px 24px 26px",
        boxShadow: "0 18px 40px rgba(60,45,20,0.22)",
        transform: `rotate(4deg)`,
        opacity,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "relative",
          width: ringSize,
          height: ringSize,
          margin: "0 auto",
        }}
      >
        <svg width={ringSize} height={ringSize} style={{ display: "block" }}>
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={r}
            fill="none"
            stroke={PALE_NAVY}
            strokeWidth={10}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 88,
            lineHeight: 1,
            color: brand.textOnCard,
            whiteSpace: "nowrap",
          }}
        >
          {figure.big}
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 36,
          fontWeight: 800,
          color: brand.textOnCard,
          textAlign: "center",
          lineHeight: 1.25,
        }}
      >
        {figure.label}
      </div>
    </div>
  );
};

// A small white tag, never a hero: a warm-grey "Ngân hàng ·" then the logo.
// Fades only, no spring, no colour claim of endorsement.
export const LenderTag: React.FC<{ lender: Lender; frames: number }> = ({
  lender,
  frames,
}) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(
    interpolate(frame, [0, 10], [0, 1], clamp),
    interpolate(frame, [frames - 10, frames], [1, 0], clamp),
  );
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + 830, // ~1250: left edge, above the caption strip
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 18px",
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 10px 26px rgba(60,45,20,0.16)",
        opacity,
        fontFamily: FONT,
      }}
    >
      <span style={{ color: WARM_GREY, fontWeight: 700, fontSize: 26 }}>
        Ngân hàng ·
      </span>
      <LenderLogo lender={lender} height={36} />
    </div>
  );
};

// A brief amber wash (8 frames) into a small title line, top-left inside
// SAFE, for the chapter's whole 2.5 s — no "PHẦN n" numbering; a story has
// beats, not parts.
export const ChapterCard: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 4, 8], [0, 0.3, 0], clamp);
  const textIn = interpolate(frame, [4, 18], [0, 1], clamp);
  return (
    <>
      <AbsoluteFill
        style={{
          background: brand.accent,
          opacity: flash,
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top,
          opacity: textIn,
          transform: `translateY(${interpolate(textIn, [0, 1], [10, 0])}px)`,
          fontFamily: FONT,
          fontSize: 48,
          fontWeight: 800,
          color: brand.textOnCard,
        }}
      >
        {title}
      </div>
    </>
  );
};
