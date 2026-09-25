// Data Lab backdrop: a dark blueprint grid on a radial navy, with a few
// slowly drifting light-blue particles. Shared by Cover and Talk (Talk draws
// it itself since PacedVideo runs with backdrop="none" here).
import type React from "react";
import { AbsoluteFill } from "remotion";
import { Particles } from "../../elements/Particles";

const GRID = 22;

// A light-blue tint of brand.primary (#0064A8), allowed by the golden rules
// as a tint of a brand colour.
export const LIGHT_BLUE = "#7FC4FF";

export const DataLabBackdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 90% 70% at 50% 32%, #10305C 0%, #06132A 78%)",
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,100,168,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,168,0.2) 1px, transparent 1px)",
        backgroundSize: `${GRID}px ${GRID}px`,
      }}
    />
    <Particles seed="datalab" count={22} />
  </AbsoluteFill>
);
