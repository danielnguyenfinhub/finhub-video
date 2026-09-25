// Neon title text, adapted from elements/NeonTitle.tsx: cream (#FFF4DA) text
// instead of white (the neon "core" colour for this design) with the same
// flicker-on over the first 15 frames and slow glow pulse, amber throughout.
import type React from "react";
import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import { FONT } from "../../mortgage/style";

export const NEON_CREAM = "#FFF4DA";

export const NeonTitle: React.FC<{
  text: string;
  fontSize?: number;
  letterSpacing?: number;
}> = ({ text, fontSize = 88, letterSpacing }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = frame >= 15 || random(`neon-${frame}-${text}`) > 0.35;
  const glow = interpolate(Math.sin(frame / 10), [-1, 1], [14, 30]);
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize,
        fontWeight: 900,
        lineHeight: 1.25,
        textAlign: "center",
        color: NEON_CREAM,
        letterSpacing,
        opacity: on ? 1 : 0.25,
        transform: `scale(${pop})`,
        textShadow: `0 0 6px #fff, 0 0 ${glow}px ${brand.highlight}, 0 0 ${glow * 2}px ${brand.highlight}`,
      }}
    >
      {text}
    </div>
  );
};
