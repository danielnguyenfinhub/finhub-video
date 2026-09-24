// A countdown (5… 4… 3…) with a ring that empties as the seconds run out.
import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";
import { FONT } from "../mortgage/style";

export const CountdownRing: React.FC<{ seconds?: number; size?: number; color?: string }> = ({
  seconds = 5,
  size = 320,
  color = brand.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = seconds * fps;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const left = Math.max(0, Math.ceil((total - frame) / fps));
  const pop = interpolate(spring({ frame: frame % fps, fps, config: { damping: 12, stiffness: 150 } }), [0, 1], [0.6, 1]);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * Math.min(1, frame / total)} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: size * 0.36, fontWeight: 900, color: "#fff", transform: `scale(${pop})` }}>
        {left}
      </div>
    </div>
  );
};
