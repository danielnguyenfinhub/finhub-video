// Split-screen backdrop for "scenario": navy on the left (option A), brand
// blue on the right (option B), with a 4px amber divider that nudges left or
// right on each cut (the BeforeAfter split feel, drawn directly since our
// divider separates two colour fields rather than two media layers).
import type React from "react";
import {
  AbsoluteFill,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";

const CENTER_X = 540;
const SHIFT = 40;

export const SplitBackdrop: React.FC<{ seed?: number }> = ({ seed = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const side = random(`scenario-divider-${seed}`) < 0.5 ? -1 : 1;
  const shift =
    side *
    SHIFT *
    spring({ frame, fps, config: { damping: 20, stiffness: 40, mass: 1.2 } });
  const x = CENTER_X + shift;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: brand.background }} />
      <AbsoluteFill style={{ left: x, background: brand.primary }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: x - 2,
          width: 4,
          background: brand.accent,
        }}
      />
    </AbsoluteFill>
  );
};
