// A title that flickers on like a neon sign, then glows with a slow pulse.
// The flicker uses remotion's seeded random(), so every render is identical.
import type React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";
import { FONT } from "../mortgage/style";

export const NeonTitle: React.FC<{ text: string; color?: string; fontSize?: number }> = ({
  text,
  color = brand.accent,
  fontSize = 110,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = frame >= 15 || random(`neon-${frame}`) > 0.35;
  const glow = interpolate(Math.sin(frame / 10), [-1, 1], [14, 32]);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize,
        fontWeight: 900,
        lineHeight: 1.3,
        textAlign: "center",
        color: "#fff",
        opacity: on ? 1 : 0.25,
        transform: `scale(${spring({ frame, fps, config: { damping: 10 } })})`,
        textShadow: `0 0 6px #fff, 0 0 ${glow}px ${color}, 0 0 ${glow * 2}px ${color}, 0 0 ${glow * 3}px ${color}`,
      }}
    >
      {text}
    </div>
  );
};
