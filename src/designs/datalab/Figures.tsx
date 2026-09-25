// The data panel (golden rule 1: every figure gets a visual). A dark
// translucent card at the top of SAFE shows the number as a big counter
// (light blue, landing amber) with its label and a bar that grows to full
// width. While the panel is up, a small amber-ringed picture-in-picture shows
// an Oscilloscope of Daniel's voice, mapped to his source frame through the
// talk timeline so it follows the paced cut.
import type React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import { Oscilloscope } from "../../elements/Oscilloscope";
import type { Figure } from "../../mortgage/golden";
import { SAFE, figuresOf } from "../../mortgage/golden";
import type { Reel } from "../../mortgage/schema";
import { FONT, clamp, enter } from "../../mortgage/style";
import { toSrcMs } from "../../mortgage/timeline";
import { LIGHT_BLUE } from "./Backdrop";

const LAND_FRAME = 24;
// Golden rule 3b: figure cards render BEHIND Daniel, sized so the number and
// label read above his head (SAFE.top..700), even though the card may run
// down behind his shoulders.
const PANEL_TOP = SAFE.top;
// Exported so other Overlay elements (e.g. LenderLabel's bank tile) can sit
// just below the panel's worst-case (non-compact) bottom without guessing.
export const PANEL_MAX_BOTTOM = 700;

const FigureCard: React.FC<{ figure: Figure }> = ({ figure }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterP = enter(frame, fps);
  const landed = frame >= LAND_FRAME;
  const barP = interpolate(
    frame,
    [0, Math.max(10, Math.min(40, figure.frames - 10))],
    [0, 1],
    clamp,
  );
  const compact = figure.source === "auto";
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: PANEL_TOP,
        width: SAFE.right - SAFE.left,
        height: compact ? 180 : PANEL_MAX_BOTTOM - PANEL_TOP,
        borderRadius: 24,
        background: "rgba(6,19,42,0.85)",
        border: `1px solid ${LIGHT_BLUE}`,
        boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        fontFamily: FONT,
        padding: "26px 34px 24px",
        opacity: enterP,
        transform: `translateY(${interpolate(enterP, [0, 1], [-30, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: compact ? 72 : 100,
          fontWeight: 900,
          lineHeight: 1.05,
          color: landed ? brand.accent : LIGHT_BLUE,
        }}
      >
        {figure.big}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "#fff",
          marginTop: 6,
          maxWidth: SAFE.right - SAFE.left - 68,
        }}
      >
        {figure.label}
      </div>
      <div
        style={{
          position: "absolute",
          left: 34,
          right: 34,
          bottom: 22,
          height: 8,
          borderRadius: 4,
          background: "rgba(255,255,255,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barP * 100}%`,
            background: brand.accent,
          }}
        />
      </div>
    </div>
  );
};

// A circular amber-ringed PiP of Daniel's voice, bottom-left inside SAFE.
const PipOscilloscope: React.FC<{ src: string; reel: Reel }> = ({
  src,
  reel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const outMs = (frame / fps) * 1000;
  const srcMs = toSrcMs(reel.timeline.segments, outMs, fps);
  const srcFrame = (srcMs / 1000) * fps;
  return (
    <div
      style={{
        position: "absolute",
        // On Daniel's shoulder: below his face, above the captions.
        left: 60,
        top: 1080,
        width: 200,
        height: 200,
        borderRadius: "50%",
        overflow: "hidden",
        border: `3px solid ${brand.accent}`,
        background: "rgba(6,19,42,0.7)",
      }}
    >
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Oscilloscope
          src={src}
          frame={srcFrame}
          color={LIGHT_BLUE}
          width={180}
          height={180}
          lineWidth={4}
          amplitude={2.4}
        />
      </AbsoluteFill>
    </div>
  );
};

// Behind layer: the data panel only (golden rule 3b — charts render behind
// Daniel's cut-out, never over Overlay/his face).
export const FiguresBehindLayer: React.FC<{ reel: Reel }> = ({ reel }) => {
  const { fps } = useVideoConfig();
  const figures = figuresOf(reel, fps);
  return (
    <>
      {figures.map((f) => (
        <Sequence
          key={`${f.source}${f.fromFrame}`}
          from={f.fromFrame}
          durationInFrames={f.frames}
        >
          <FigureCard figure={f} />
        </Sequence>
      ))}
    </>
  );
};

// Overlay layer: the voice PiP only, kept in front (it sits outside FACE and
// below the caption band, so it stays as a golden-rule-safe Overlay element).
export const FiguresPipLayer: React.FC<{ reel: Reel; src: string }> = ({
  reel,
  src,
}) => {
  const { fps } = useVideoConfig();
  const figures = figuresOf(reel, fps);
  return (
    <>
      {figures.map((f) => (
        <Sequence
          key={`${f.source}${f.fromFrame}`}
          from={f.fromFrame}
          durationInFrames={f.frames}
        >
          <PipOscilloscope src={src} reel={reel} />
        </Sequence>
      ))}
    </>
  );
};
