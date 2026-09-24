// Glitch type: on random frames (seeded, so renders repeat exactly) red and
// cyan copies of the text jump off the white master layer.
import type React from "react";
import { random, useCurrentFrame } from "remotion";
import { FONT } from "../mortgage/style";

export const RgbSplitText: React.FC<{ text: string; frequency?: number; fontSize?: number }> = ({
  text,
  frequency = 0.25,
  fontSize = 110,
}) => {
  const frame = useCurrentFrame();
  const glitch = random(`rgb-${frame}`) < frequency;
  const off = (k: string, range: number) => (glitch ? (random(`${k}-${frame}`) - 0.5) * range : 0);
  const base: React.CSSProperties = { fontFamily: FONT, fontSize, fontWeight: 900, lineHeight: 1.3, textTransform: "uppercase" };
  const copy = (color: string, k: string): React.CSSProperties => ({
    ...base,
    position: "absolute",
    inset: 0,
    color,
    mixBlendMode: "screen",
    opacity: glitch ? 0.9 : 0,
    transform: `translate(${off(`${k}x`, 26)}px, ${off(`${k}y`, 12)}px)`,
  });
  return (
    <div style={{ position: "relative" }}>
      <span style={copy("#ef4444", "r")}>{text}</span>
      <span style={copy("#06b6d4", "c")}>{text}</span>
      <span style={{ ...base, position: "relative", color: "#fff" }}>{text}</span>
    </div>
  );
};
