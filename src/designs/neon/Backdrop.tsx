// Neon backdrop: a slowly rotating starburst of brand wedges, darkened toward
// the edges with a radial vignette, plus floating amber sparks. Adapted from
// .claude/elements/backgrounds/rotating-starburst (brand colours instead of
// the demo blues, ~4deg/s instead of a full spin over the whole video, a
// vignette instead of a flat backing colour) and elements/Particles (amber
// only, smaller, glowing, instead of the three-colour mix).
import { starburst } from "@remotion/effects/starburst";
import type React from "react";
import {
  AbsoluteFill,
  Solid,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";

const DEG_PER_SEC = 4;
const SPARK_COUNT = 24;

const Sparks: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: SPARK_COUNT }, (_, i) => {
        const r = (k: string) => random(`neon-spark-${k}-${i}`);
        const size = 3 + r("s") * 6;
        const x =
          (((r("x") * width + (r("vx") - 0.5) * 2.4 * frame) % width) + width) %
          width;
        const y =
          (((r("y") * height - (0.4 + r("vy")) * 1.6 * frame) % height) +
            height) %
          height;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: brand.highlight,
              opacity: 0.4 + r("o") * 0.5,
              boxShadow: `0 0 ${size * 2.5}px ${brand.highlight}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const NeonBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Solid
        color={brand.background}
        width={width}
        height={height}
        effects={[
          starburst({
            rays: 24,
            colors: [brand.primary, brand.background],
            rotation: (frame / fps) * DEG_PER_SEC,
            origin: [0.5, 0.4],
          }),
        ]}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 68% 58% at 50% 38%, transparent 30%, #07142A 92%)",
        }}
      />
      <Sparks />
    </AbsoluteFill>
  );
};
