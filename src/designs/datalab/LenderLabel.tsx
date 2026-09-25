// Golden rule 2: a bank Daniel names shows its logo. A compact "data label":
// the logo on white with a small grey kicker, sitting just below the figure
// panel (Behind layer) on the left, with a soft amber ring pulse of its own
// instead of a leader line pointing at Daniel — his rule is nothing covers
// his face, so this never draws toward it (Daniel, 25/09/2026).
import type React from "react";
import {
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import { SAFE } from "../../mortgage/golden";
import { LenderLogo } from "../../mortgage/LenderLogo";
import type { LenderMention } from "../../mortgage/lenders";
import { FONT, clamp, enter } from "../../mortgage/style";
import { PANEL_MAX_BOTTOM } from "./Figures";

const KICKER = "NGÂN HÀNG ĐƯỢC NHẮC";
const LOGO_HEIGHT = 48;
// Below the figure panel's worst-case (non-compact) bottom, on the left.
// Kept entirely left of FACE (x <= 250) so it never overlaps Daniel's face
// regardless of what's above it — narrower than the panel's own width.
const TILE_LEFT = SAFE.left;
const TILE_TOP = PANEL_MAX_BOTTOM + 24;
const TILE_MAX_WIDTH = 210 - SAFE.left;

const LenderLabel: React.FC<{ mention: LenderMention }> = ({ mention }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = enter(frame, fps);
  const ringP = interpolate(frame, [0, 20], [0, 1], clamp);
  const ringOpacity = interpolate(frame, [0, 20], [0.85, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: TILE_LEFT,
        top: TILE_TOP,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        maxWidth: TILE_MAX_WIDTH,
        fontFamily: FONT,
        opacity: drop,
        transform: `translateY(${interpolate(drop, [0, 1], [-40, 0])}px)`,
      }}
    >
      <div style={{ position: "relative" }}>
        {/* Soft amber ring pulse, first 20 frames only. */}
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: LOGO_HEIGHT * 0.25 + 6,
            border: `3px solid ${brand.accent}`,
            opacity: ringOpacity,
            transform: `scale(${1 + ringP * 0.18})`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            borderRadius: 12,
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <LenderLogo lender={mention.lender} height={LOGO_HEIGHT} />
        </div>
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 2,
          color: "#9fb3d1",
          textTransform: "uppercase",
        }}
      >
        {KICKER}
      </span>
    </div>
  );
};

export const LenderLayer: React.FC<{ mentions: LenderMention[] }> = ({
  mentions,
}) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {mentions.map((m) => {
        const from = Math.round((m.startMs / 1000) * fps);
        const dur = Math.max(
          1,
          Math.round(((m.endMs - m.startMs) / 1000) * fps),
        );
        return (
          <Sequence
            key={`${m.lender.name}${m.startMs}`}
            from={from}
            durationInFrames={dur}
          >
            <LenderLabel mention={m} />
          </Sequence>
        );
      })}
    </>
  );
};
