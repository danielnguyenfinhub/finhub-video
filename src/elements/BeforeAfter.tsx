// A split line sweeps across, revealing "after" over "before" (e.g. footage
// as recorded vs with an edit.json `look`).
import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";
import { FONT, clamp } from "../mortgage/style";

const tag = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  top: 60,
  [side]: 40,
  background: "rgba(11,31,61,0.8)",
  color: "#fff",
  fontFamily: FONT,
  fontWeight: 800,
  fontSize: 34,
  padding: "8px 18px",
  borderRadius: 10,
});

export const BeforeAfter: React.FC<{
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}> = ({ before, after, beforeLabel = "TRƯỚC · BEFORE", afterLabel = "SAU · AFTER" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const split = interpolate(frame, [0, durationInFrames - 1], [10, 90], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill>{before}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>{after}</AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${split}%`, width: 6, marginLeft: -3, background: brand.accent }} />
      <div style={tag("right")}>{beforeLabel}</div>
      <div style={tag("left")}>{afterLabel}</div>
    </AbsoluteFill>
  );
};
