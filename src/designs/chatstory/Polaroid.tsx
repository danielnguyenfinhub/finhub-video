// The tilted white card every figure and lender logo sits in, adapted from
// .claude/elements/storytelling/polaroid-pictures: thick bottom margin for
// the caption, a drop shadow, and a spring swing on entry. `frames` (the
// card's own lifetime) makes it lift out at the end; `frameOverride` lets a
// caller outside a dedicated <Sequence> (Lenders.tsx) drive the entrance off
// its own local clock instead of the shared timeline frame.
import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../../mortgage/style";

const clampOpt = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const Polaroid: React.FC<{
  rotate: number;
  width: number;
  frames?: number;
  frameOverride?: number;
  style?: React.CSSProperties;
  caption?: string;
  captionSize?: number;
  children: React.ReactNode;
}> = ({
  rotate,
  width,
  frames,
  frameOverride,
  style,
  caption,
  captionSize = 30,
  children,
}) => {
  const localFrame = useCurrentFrame();
  const frame = frameOverride ?? localFrame;
  const { fps } = useVideoConfig();
  const inP = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 170, mass: 0.7 },
  });
  const outP = frames
    ? interpolate(frame, [frames - 10, frames], [0, 1], clampOpt)
    : 0;
  return (
    <div
      style={{
        position: "absolute",
        width,
        padding: "18px 18px 26px",
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 20px 44px rgba(11,31,61,0.3)",
        fontFamily: FONT,
        transformOrigin: "50% 0%",
        transform: `rotate(${interpolate(inP, [0, 1], [rotate * 5, rotate])}deg) scale(${interpolate(inP, [0, 1], [0.6, 1])}) translateY(${-outP * 70}px)`,
        opacity: interpolate(inP, [0, 1], [0, 1]) * (1 - outP),
        ...style,
      }}
    >
      {children}
      {caption ? (
        <div
          style={{
            marginTop: 14,
            textAlign: "center",
            fontSize: captionSize,
            fontWeight: 800,
            color: "#0B1F3D",
            lineHeight: 1.2,
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};
