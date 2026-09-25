// "neon" pieces: the logo tile, the number gauge ring (figuresOf), the bank
// flip card (lenderMentionsOf, with a shine sweep adapted from
// .claude/elements/commerce/shine) and the chapter card (a ring in the
// CountdownRing style around "PHẦN n", adapted from elements/CountdownRing.tsx
// dropping the countdown-to-zero behaviour for a fill-up progress ring).
import { fitText } from "@remotion/layout-utils";
import type React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import { LenderLogo } from "../../mortgage/LenderLogo";
import type { Lender } from "../../mortgage/lenders";
import { FONT, LOGO, clamp } from "../../mortgage/style";
import { FACE, SAFE } from "../../mortgage/golden";
import { NeonTitle } from "./NeonTitle";

const RIGHT_MARGIN = 1080 - SAFE.right;

// FinHub logo on white, top-right inside SAFE (golden rule 3c), 120px high
// — the Cover's own always-on logo (Overlay uses <LogoMark/> instead).
export const LogoTile: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: SAFE.top,
      right: RIGHT_MARGIN,
      padding: "10px 16px",
      borderRadius: 18,
      background: "#fff",
      boxShadow: `0 0 20px ${brand.highlight}55`,
    }}
  >
    <Img src={LOGO} style={{ height: 120, display: "block" }} />
  </div>
);

// Golden rule 1/3b: the gauge renders in Behind (behind Daniel's cut-out), a
// halo around his head. The number + label must read ABOVE his head (SAFE.top
// .. FACE.top, y 420-480) so his silhouette never hides them; the ring itself
// is decorative and may sit partly behind him lower down, down to y 760.
export const GaugeRing: React.FC<{
  big: string;
  label: string;
  small?: boolean;
}> = ({ big, label, small }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const size = small ? 220 : 280;
  const stroke = small ? 10 : 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const fillFrames = 40;
  const progress = interpolate(frame, [0, fillFrames], [0, 1], clamp);
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const numberSize = small ? 32 : 44;
  const { fontSize } = fitText({
    text: big,
    withinWidth: SAFE.right - SAFE.left - 100,
    fontFamily: FONT,
    fontWeight: 900,
  });
  const ringTop = FACE.top; // 480: halo starts where his head does
  return (
    <>
      {/* number + label: pinned above FACE.top so they never sit behind him */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SAFE.top,
          height: ringTop - SAFE.top,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${pop})`,
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            color: "#FFF4DA",
            fontSize: Math.min(fontSize, numberSize),
            textAlign: "center",
            textShadow: `0 0 6px #fff, 0 0 18px ${brand.highlight}`,
          }}
        >
          {big}
        </div>
        <div
          style={{
            marginTop: 2,
            fontWeight: 700,
            fontSize: small ? 13 : 15,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: brand.highlight,
            maxWidth: size + 100,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
      </div>
      {/* halo ring, decorative, behind his head */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ringTop,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${pop})`,
        }}
      >
        <svg
          width={size}
          height={size}
          style={{
            transform: "rotate(-90deg)",
            filter: `drop-shadow(0 0 12px ${brand.highlight})`,
          }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={brand.highlight}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - progress)}
          />
        </svg>
      </div>
    </>
  );
};

// A bank card that flips in from -90deg to -18deg with a diagonal shine sweep
// (adapted from .claude/elements/commerce/shine: HtmlInCanvas + shine(),
// swapped the demo image for LenderLogo on the brand card).
const CARD_W = 380; // golden rule 4: lender card width <= 380, top-left of SAFE
const CARD_H = 136;

export const LenderFlipCard: React.FC<{ lender: Lender }> = ({ lender }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const turn = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const angle = interpolate(turn, [0, 1], [-90, -18]);
  const shineProgress = interpolate(frame, [10, 54], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top,
        display: "flex",
        justifyContent: "flex-start",
        perspective: 900,
      }}
    >
      <div
        style={{
          transform: `rotateY(${angle}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* A CSS sweep instead of @remotion/effects shine: HtmlInCanvas never
            paints under the renderer here (see PacedVideo.tsx), so the effect
            would hang the render. */}
        <div
          style={{ position: "relative", overflow: "hidden", borderRadius: 18 }}
        >
          <LenderCardFace lender={lender} />
          <div
            style={{
              position: "absolute",
              top: -CARD_H,
              left: interpolate(shineProgress, [0, 1], [-CARD_W, CARD_W * 1.2]),
              width: CARD_W * 0.5,
              height: CARD_H * 3,
              transform: "rotate(35deg)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const LenderCardFace: React.FC<{ lender: Lender }> = ({ lender }) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `2px solid ${brand.highlight}`,
      borderRadius: 22,
      boxShadow: `0 0 24px ${brand.highlight}`,
      background: brand.card,
    }}
  >
    <LenderLogo lender={lender} height={64} />
  </div>
);

// "PHẦN n" inside a filling ring (CountdownRing's look, without the
// countdown-to-zero behaviour) plus the chapter title as a NeonTitle, with a
// one-frame white flash at the start of the chapter card.
export const ChapterCard: React.FC<{ index: number; title: string }> = ({
  index,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const size = 200;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 170 } });
  const { fontSize } = fitText({
    text: title,
    withinWidth: SAFE.right - SAFE.left - 80,
    fontFamily: FONT,
    fontWeight: 900,
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {frame === 0 ? (
        <AbsoluteFill style={{ background: "#fff", opacity: 0.3 }} />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SAFE.top + 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${pop})`,
        }}
      >
        <div style={{ position: "relative", width: size, height: size }}>
          <svg
            width={size}
            height={size}
            style={{
              transform: "rotate(-90deg)",
              filter: `drop-shadow(0 0 10px ${brand.highlight})`,
            }}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={brand.highlight}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - progress)}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: "#FFF4DA",
              fontSize: 32,
            }}
          >
            PHẦN {index + 1}
          </div>
        </div>
        <div style={{ marginTop: 26, maxWidth: SAFE.right - SAFE.left }}>
          <NeonTitle text={title} fontSize={Math.min(64, fontSize)} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
