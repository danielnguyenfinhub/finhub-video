// Slow pan-and-zoom across a still image, from one focal point to another.
import type React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../mortgage/style";

type Point = { x: number; y: number }; // 0..1 across the image

export const KenBurns: React.FC<{
  src: string;
  fromScale?: number;
  toScale?: number;
  from?: Point;
  to?: Point;
}> = ({ src, fromScale = 1, toScale = 1.3, from = { x: 0.35, y: 0.35 }, to = { x: 0.65, y: 0.6 } }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  const scale = fromScale + (toScale - fromScale) * t;
  const fx = from.x + (to.x - from.x) * t;
  const fy = from.y + (to.y - from.y) * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${(0.5 - fx) * width * (scale - 1)}px, ${(0.5 - fy) * height * (scale - 1)}px) scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
