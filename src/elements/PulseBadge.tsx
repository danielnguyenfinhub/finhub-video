// A badge that pulses every `every` frames for as long as it is on screen,
// using <Loop> so the animation restarts cleanly each cycle.
import type React from "react";
import { Loop, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";
import { FONT } from "../mortgage/style";

const Pulse: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ transform: `scale(${0.85 + 0.15 * spring({ frame, fps, config: { damping: 8, stiffness: 100 } })})`, background: brand.accent, color: brand.background, fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: "14px 32px", borderRadius: 999, boxShadow: "0 12px 28px rgba(245,165,36,0.45)", width: "fit-content" }}>
      {text}
    </div>
  );
};

export const PulseBadge: React.FC<{ text: string; every?: number }> = ({ text, every = 60 }) => (
  <Loop durationInFrames={every} layout="none">
    <Pulse text={text} />
  </Loop>
);
