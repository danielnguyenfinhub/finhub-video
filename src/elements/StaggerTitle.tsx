// Letters spring up one after another. Each letter keeps its combining marks, so a
// Vietnamese letter and its marks (ế, ữ) move as one character.
import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../mortgage/style";

export const StaggerTitle: React.FC<{ text: string; stagger?: number; color?: string; fontSize?: number }> = ({
  text,
  stagger = 2,
  color = "#fff",
  fontSize = 96,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.normalize("NFC").match(/\P{M}\p{M}*/gu) ?? [];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", fontFamily: FONT, fontSize, fontWeight: 900, lineHeight: 1.3, color }}>
      {chars.map((ch, i) => {
        const p = spring({ frame: frame - i * stagger, fps, config: { damping: 12, stiffness: 140 } });
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [90, 0])}px) scale(${interpolate(p, [0, 1], [0.4, 1])})` }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};
