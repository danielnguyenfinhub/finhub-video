// Reframes wider footage (16:9, 4:5) to the composition's shape while keeping
// a moving subject centred: give the subject's position at a few frames and
// the crop follows it, never showing past the footage's edges.
import type React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../mortgage/style";

export type Focus = { frame: number; x: number; y: number }; // x, y: 0..1 of the source

export const FocusCrop: React.FC<{
  src: string;
  sourceWidth: number;
  sourceHeight: number;
  focus: Focus[];
}> = ({ src, sourceWidth, sourceHeight, focus }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const keys = [...focus].sort((a, b) => a.frame - b.frame);
  const at = (pick: (f: Focus) => number) =>
    keys.length === 1
      ? pick(keys[0])
      : interpolate(frame, keys.map((k) => k.frame), keys.map(pick), clamp);
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const w = sourceWidth * scale;
  const h = sourceHeight * scale;
  const x = Math.min(0, Math.max(width - w, width / 2 - at((k) => k.x) * w));
  const y = Math.min(0, Math.max(height - h, height / 2 - at((k) => k.y) * h));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <div
        style={{ position: "absolute", width: w, height: h, transform: `translate(${x}px, ${y}px)` }}
      >
        <OffthreadVideo src={src} muted style={{ width: "100%", height: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};
