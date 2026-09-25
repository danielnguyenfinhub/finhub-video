// The kitchen backdrop: a warm cream radial with two slow, pale-amber liquid
// contour bands (adapted from .claude/elements/backgrounds/liquid-contours,
// tinted to brand.accent) and a very faint grain (elements/NoiseField.tsx,
// nearly invisible, just enough to take the flatness off the cream). Used
// behind Daniel in Talk (PacedVideo backdrop="none") and behind the Cover.
import { liquidContours } from "@remotion/effects/liquid-contours";
import type React from "react";
import { AbsoluteFill, Solid, interpolate, useCurrentFrame } from "remotion";
import { NoiseField } from "../../elements/NoiseField";

// Two light tints of brand.accent (#F5A524), mixed toward white so the bands
// stay pale on the cream instead of reading as an orange wash.
const TINT_LIGHT = "#FBE3B8";
const TINT_MED = "#F6D28C";

export const KitchenBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 30%, #FFF3DC 0%, #F6E9D2 55%, #EAD9BC 100%)",
        }}
      />
      <Solid
        color={TINT_LIGHT}
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, opacity: 0.28 }}
        effects={[
          liquidContours({
            firstColor: TINT_LIGHT,
            secondColor: TINT_MED,
            scale: 520,
            spacing: 140,
            smoothness: 1,
            phase: interpolate(frame, [0, 1800], [1.2, 2.6]),
          }),
        ]}
      />
      {/* Barely-there grain: takes the flatness off the cream without reading
          as texture on its own. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          mixBlendMode: "overlay",
        }}
      >
        <NoiseField cols={18} rows={30} speed={0.006} />
      </div>
    </AbsoluteFill>
  );
};
