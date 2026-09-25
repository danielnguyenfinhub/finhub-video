// "checklist": notebook-paper backdrop shared by Cover, Talk and Overlay.
// Adapted from .claude/elements/backgrounds/notebook-paper (paper() texture)
// with the grid swapped for horizontal-only rules via CSS, since gridlines()
// only draws a square grid. Cream #FBF8F0 and rule blue #CFE0F2 are paper
// tints, not brand colours (README: "cream ... and rule blue ... are paper
// tints").
import { paper } from "@remotion/effects/paper";
import type React from "react";
import { AbsoluteFill, Solid, useVideoConfig } from "remotion";

export const CREAM = "#FBF8F0";
export const RULE_BLUE = "#CFE0F2";
const RULE_HEIGHT = 44;

export const NotebookBackdrop: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Solid
        color={CREAM}
        width={width}
        height={height}
        effects={[
          paper({
            amount: 0.3,
            colorFront: "#E8E0CC",
            colorBack: CREAM,
            contrast: 0.14,
            roughness: 0.16,
            fiber: 0.2,
            crumples: 0.06,
            folds: 0.08,
            seed: 24,
            scale: 0.8,
            drops: 0,
          }),
        ]}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent ${RULE_HEIGHT - 1}px, ${RULE_BLUE} ${RULE_HEIGHT - 1}px, ${RULE_BLUE} ${RULE_HEIGHT}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
