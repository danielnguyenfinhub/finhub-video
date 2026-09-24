// Drifting particles, placed with remotion's seeded random() so every render
// (Studio, CLI, Player) shows exactly the same field.
import type React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";

const COLORS = [brand.accent, brand.primary, "#ffffff"];

export const Particles: React.FC<{ seed?: string; count?: number }> = ({ seed = "finhub", count = 60 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (k: string) => random(`${seed}-${k}-${i}`);
        const size = 4 + r("s") * 12;
        const x = (((r("x") * width + (r("vx") - 0.5) * 3 * frame) % width) + width) % width;
        const y = (((r("y") * height - (0.5 + r("vy")) * 2 * frame) % height) + height) % height;
        const color = COLORS[Math.floor(r("c") * COLORS.length)];
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, opacity: 0.35 + r("o") * 0.5, boxShadow: `0 0 10px ${color}` }} />;
      })}
    </AbsoluteFill>
  );
};
