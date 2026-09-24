// The explainer's surfaces: ruled paper with grain, sticky notes, and a
// pencil line that draws itself.
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import type React from "react";
import { AbsoluteFill } from "remotion";
import { brand } from "../../brand/theme";

export const PAPER = "#F6F1E4";
export const INK = brand.textOnCard;
export const MARKER = "rgba(245,165,36,0.55)"; // brand.accent as highlighter
export const NOTE = "#FFE08A";

// Grain: fixed specks placed by noise, so the texture is identical every
// frame (a paper surface doesn't move) and costs one SVG, not a pixel loop.
const SPECKS = Array.from({ length: 260 }, (_, i) => ({
  x: (noise2D("px", i, 0) * 0.5 + 0.5) * 1080,
  y: (noise2D("py", 0, i) * 0.5 + 0.5) * 1920,
  r: 0.8 + (noise2D("pr", i, i) * 0.5 + 0.5) * 1.6,
  o: 0.05 + (noise2D("po", i, 1) * 0.5 + 0.5) * 0.12,
}));

export const Paper: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PAPER }}>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {Array.from({ length: 30 }, (_, i) => (
        <line
          key={i}
          x1={0}
          x2={1080}
          y1={40 + i * 64}
          y2={40 + i * 64}
          stroke="#9CC3E6"
          strokeOpacity={0.35}
          strokeWidth={2}
        />
      ))}
      <line x1={96} x2={96} y1={0} y2={1920} stroke="#E8A0A0" strokeOpacity={0.5} strokeWidth={3} />
      {SPECKS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={INK} opacity={s.o} />
      ))}
    </svg>
  </AbsoluteFill>
);

export const Sticky: React.FC<{
  children: React.ReactNode;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, rotate = -2, style }) => (
  <div
    style={{
      background: NOTE,
      padding: "34px 44px",
      boxShadow: "0 18px 40px rgba(11,31,61,0.28)",
      transform: `rotate(${rotate}deg)`,
      ...style,
    }}
  >
    {children}
  </div>
);

// A slightly wobbly horizontal pencil line; noise makes it hand-drawn and the
// same on every render.
const wobbly = (width: number, seed: string) =>
  Array.from({ length: 25 }, (_, i) => {
    const x = (i / 24) * width;
    const y = 6 + noise2D(seed, i / 4, 0) * 5;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

export const PencilLine: React.FC<{
  progress: number;
  width: number;
  seed: string;
  color?: string;
  strokeWidth?: number;
}> = ({ progress, width, seed, color = INK, strokeWidth = 5 }) => {
  const d = wobbly(width, seed);
  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, d);
  return (
    <svg width={width} height={14} style={{ overflow: "visible" }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};
