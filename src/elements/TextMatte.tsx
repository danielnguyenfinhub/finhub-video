// Footage (or anything) shows through big letters on black. Uses a multiply
// blend instead of an SVG mask so the loaded brand font (with Vietnamese
// marks) is used; the background is therefore always black.
import type React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../mortgage/style";

export const TextMatte: React.FC<{ text: string; children: React.ReactNode; fontSize?: number }> = ({
  text,
  children,
  fontSize = 260,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          color: "#fff",
          mixBlendMode: "multiply",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize,
          lineHeight: 1.1,
        }}
      >
        <span style={{ transform: `scale(${0.6 + 0.4 * p})` }}>{text}</span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
