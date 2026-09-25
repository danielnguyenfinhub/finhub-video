// Backdrop for the talk (PacedVideo backdrop="none"): a mid-navy gradient with
// faint moving waves, adapted from .claude/elements/backgrounds/moving-waves
// (that element paints a two-colour solid fill; here it's thin ~8%-opacity
// white lines drifting upward, so Daniel's cut-out and the sidebar stay readable).
import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

const LINES = 7;
const GAP = 340; // vertical spacing between lines, taller than the frame / LINES so they loop cleanly

export const SeriesBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  // Slow upward drift, one full gap every ~8s at 30fps.
  const shift = (frame * 1.4) % GAP;
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #123A66 0%, #0B1F3D 100%)",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1920"
        preserveAspectRatio="none"
      >
        {Array.from({ length: LINES + 2 }, (_, i) => {
          const y = i * GAP - shift;
          const wobble = Math.sin(frame / 40 + i) * 18;
          return (
            <path
              key={i}
              d={`M -40 ${y} Q 270 ${y - 30 + wobble} 540 ${y} T 1120 ${y}`}
              stroke="#ffffff"
              strokeOpacity={0.08}
              strokeWidth={3}
              fill="none"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
