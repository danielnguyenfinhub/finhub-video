// A reels-style progress bar along the top or bottom edge of the video.
import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";

export const ProgressBar: React.FC<{ position?: "top" | "bottom"; height?: number; color?: string }> = ({
  position = "top",
  height = 10,
  color = brand.accent,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, [position]: 0, height, background: "rgba(255,255,255,0.25)" }}>
        <div style={{ height: "100%", width: `${(frame / Math.max(1, durationInFrames - 1)) * 100}%`, background: color }} />
      </div>
    </AbsoluteFill>
  );
};
