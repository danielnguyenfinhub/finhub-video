// Headline lines slide up out of a clipped row, one after another. Rows leave
// room above the text for Vietnamese marks (lineHeight 1.3, top padding).
import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";
import { FONT } from "../mortgage/style";

export const LineReveal: React.FC<{
  lines: string[];
  staggerFrames?: number;
  color?: string;
  fontSize?: number;
}> = ({ lines, staggerFrames = 6, color = brand.textOnCard, fontSize = 88 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize, lineHeight: 1.3, color }}>
      {lines.map((line, i) => {
        const p = spring({ frame: frame - i * staggerFrames, fps, config: { damping: 14, stiffness: 100 } });
        return (
          <div key={i} style={{ overflow: "hidden", paddingTop: fontSize * 0.2 }}>
            <div style={{ transform: `translateY(${interpolate(p, [0, 1], [110, 0])}%)` }}>{line}</div>
          </div>
        );
      })}
    </div>
  );
};
