// A living background: a grid of dots breathing with simplex noise over time.
import { noise3D } from "@remotion/noise";
import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { brand } from "../brand/theme";

export const NoiseField: React.FC<{ cols?: number; rows?: number; speed?: number }> = ({ cols = 12, rows = 20, speed = 0.02 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: brand.background, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, padding: 24, gap: 10, boxSizing: "border-box" }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const v = (noise3D("field", (i % cols) * 0.15, Math.floor(i / cols) * 0.15, frame * speed) + 1) / 2;
        return <div key={i} style={{ borderRadius: "50%", background: `radial-gradient(circle, ${brand.accent}, ${brand.primary})`, transform: `scale(${v})`, opacity: 0.2 + v * 0.8 }} />;
      })}
    </AbsoluteFill>
  );
};
