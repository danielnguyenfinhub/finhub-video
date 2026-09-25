// Chatstory's backdrop — the only LIGHT template: soft ice-blue paper behind
// Daniel's cut-out (Talk, PacedVideo backdrop="none") and behind the cover's
// chat exchange. Texture adapted from .claude/elements/backgrounds/
// paper-texture, kept very faint so it never fights the bubbles or captions.
import { paper } from "@remotion/effects/paper";
import type React from "react";
import {
  AbsoluteFill,
  Solid,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 20% 15%, #FFFFFF, #E3EDF8 60%, #CFDFF0)",
      }}
    >
      <Solid
        color="white"
        width={width}
        height={height}
        style={{ opacity: 0.05, mixBlendMode: "multiply" }}
        effects={[
          paper({
            colorFront: "#CFDFF0",
            colorBack: "#FFFFFF",
            seed: interpolate(frame, [0, 240], [0, 1000], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              posterize: 30,
            }),
          }),
        ]}
      />
    </AbsoluteFill>
  );
};
