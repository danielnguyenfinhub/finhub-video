// Golden rule 2: a bank Daniel names shows its logo. Each mention gets a
// small polaroid sticker (rotate alternating -6/+5, like a photo dropped on
// a desk), the bank name as its caption. LogoMark owns the top-right corner
// of SAFE, so stickers drop in top-left instead, narrow enough (STICKER_
// WIDTH) to stay left of FACE (x < 250) regardless of how tall they render;
// two mentions up at once stack vertically rather than side by side, so
// neither one drifts into the face zone. An amber wiggling "So sánh" callout
// (adapted from .claude/elements/commerce/product-discount-callout) shows
// ONLY while two are overlapping — never a shared frame with both logos
// touching, so neither reads as a FinHub pick.
// ponytail: no exit lift for the sticker (it just tracks the mention's own
// window); add one if a mention's end ever needs a softer fade.
import { makeCallout } from "@remotion/shapes";
import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../../brand/theme";
import { lenderMentionsOf, SAFE } from "../../mortgage/golden";
import { LenderLogo } from "../../mortgage/LenderLogo";
import type { Reel } from "../../mortgage/schema";
import { FONT, clamp } from "../../mortgage/style";
import { Polaroid } from "./Polaroid";

// Narrow enough that left + width stays under FACE.left (250) with room to
// spare, whatever SAFE.left is.
const STICKER_WIDTH = 180;
const STICKER_STACK_GAP = 220; // vertical distance between two stacked stickers
const GAP = 24;
// Figures (Behind) anchors its own card at SAFE.left/SAFE.top too (golden
// rule 1); a lender mention can land at the same moment as a figure, so the
// sticker column starts clear below the tallest figure card, not at SAFE.top
// itself — golden rule 3b: concurrent elements each get their own place.
const LENDER_TOP = SAFE.top + 380;

const CompareCallout: React.FC<{ top: number }> = ({ top }) => {
  const frame = useCurrentFrame();
  const bubble = makeCallout({
    width: 180,
    height: 110,
    pointerLength: 22,
    pointerBaseWidth: 40,
    pointerPosition: 0.5,
    pointerDirection: "down",
    cornerRadius: 22,
  });
  const wiggle = interpolate(
    frame % 40,
    [0, 10, 20, 30, 40],
    [0, 6, -6, 3, 0],
    clamp,
  );
  const pop = interpolate(frame, [0, 8], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: 180,
        height: 110,
        transformOrigin: "50% 100%",
        transform: `scale(${pop}) rotate(${wiggle}deg)`,
      }}
    >
      <svg
        viewBox={`0 0 ${bubble.width} ${bubble.height}`}
        style={{ position: "absolute", inset: 0, width: 180, height: 110 }}
      >
        <path d={bubble.path} fill={brand.accent} />
      </svg>
      <div
        style={{
          position: "relative",
          height: 88,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 28,
          color: brand.textOnCard,
        }}
      >
        So sánh
      </div>
    </div>
  );
};

export const Lenders: React.FC<{ reel: Reel }> = ({ reel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;
  const mentions = lenderMentionsOf(reel);
  const active = mentions
    .filter((m) => nowMs >= m.startMs && nowMs < m.endMs)
    .slice(0, 2);
  if (active.length === 0) return null;
  return (
    <>
      {active.map((m, i) => {
        const localFrame = Math.round(((nowMs - m.startMs) / 1000) * fps);
        return (
          <Polaroid
            key={m.lender.name}
            rotate={i % 2 === 0 ? -6 : 5}
            width={STICKER_WIDTH}
            frameOverride={localFrame}
            caption={m.lender.name}
            captionSize={22}
            style={{
              left: SAFE.left,
              top: LENDER_TOP + i * STICKER_STACK_GAP,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px 0",
              }}
            >
              <LenderLogo lender={m.lender} height={40} />
            </div>
          </Polaroid>
        );
      })}
      {active.length === 2 ? (
        <CompareCallout top={LENDER_TOP + STICKER_STACK_GAP - GAP - 40} />
      ) : null}
    </>
  );
};
