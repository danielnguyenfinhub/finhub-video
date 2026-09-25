// The Finance Hub logo as the golden rule shows it in every design's Overlay:
// on a white tile, top-right inside SAFE, popping in for the first 10 s of the
// talk and again for the last 10 s (logoVisible). Designs may pass `style` to
// match their tile (shadow, radius) but not to move it into the face zone.
import type React from "react";
import {
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  HOOK_FRAMES,
  LOGO_HEIGHT,
  LOGO_SECONDS,
  SAFE,
  logoVisible,
} from "./golden";
import { LOGO, clamp } from "./style";

export const LogoMark: React.FC<{
  talkFrames: number;
  style?: React.CSSProperties;
}> = ({ talkFrames, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!logoVisible(frame, talkFrames, fps)) return null;
  const late = frame >= talkFrames - LOGO_SECONDS * fps;
  // The opening window starts when the hook ends (logoVisible).
  const local = late
    ? frame - (talkFrames - LOGO_SECONDS * fps)
    : frame - HOOK_FRAMES;
  const inP = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const end = late ? talkFrames : LOGO_SECONDS * fps;
  const outP = interpolate(frame, [end - 8, end], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top,
        right: 1080 - SAFE.right,
        padding: "14px 22px",
        borderRadius: 22,
        background: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        opacity: Math.min(inP, outP),
        transform: `scale(${interpolate(inP, [0, 1], [0.6, 1])})`,
        transformOrigin: "top right",
        ...style,
      }}
    >
      <Img src={LOGO} style={{ height: LOGO_HEIGHT, display: "block" }} />
    </div>
  );
};
