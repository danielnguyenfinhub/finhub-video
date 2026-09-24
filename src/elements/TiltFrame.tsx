// 2.5D camera move: its content (footage, a card) swings gently in 3D.
import type React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TiltFrame: React.FC<{ children: React.ReactNode; maxDeg?: number; perspective?: number }> = ({
  children,
  maxDeg = 12,
  perspective = 1400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14, stiffness: 60 } });
  const rx = interpolate(Math.sin(frame / 33), [-1, 1], [-4, 4]);
  const ry = interpolate(p, [0, 1], [-maxDeg, maxDeg]);
  return (
    <AbsoluteFill style={{ perspective, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(p, [0, 1], [1.1, 1.2])}) rotateX(${rx}deg) rotateY(${ry}deg)` }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
