// Frequency bars mirrored around the centre (Remotion Elements'
// MirroredAudioSpectrum, adapted). Like Oscilloscope: `frame` is the moment in
// the audio's own timeline (so a design can follow Daniel's paced voice), and
// it is silent unless playAudio is set, so it never doubles the voice.
import { Audio } from "@remotion/media";
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";

export const MirroredSpectrum: React.FC<{
  src: string;
  frame?: number;
  color?: string;
  bars?: number; // odd, 3–127
  sensitivity?: number;
  width?: number;
  height?: number;
  playAudio?: boolean;
}> = ({
  src,
  frame,
  color = brand.primary,
  bars = 45,
  sensitivity = 1.5,
  width = 900,
  height = 220,
  playAudio = false,
}) => {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = Math.round(frame ?? current);
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    fps,
    frame: at,
    src,
    windowInSeconds: 10,
  });
  const count = Math.max(3, Math.min(127, Math.round(bars)));
  const half = Math.ceil(count / 2);
  const data = audioData
    ? visualizeAudio({
        audioData,
        dataOffsetInSeconds,
        fps,
        frame: at,
        numberOfSamples: 256, // must be a power of two
        optimizeFor: "speed",
      }).slice(0, half)
    : [];
  const shown = [...data.slice(count % 2).reverse(), ...data];
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {playAudio ? <Audio src={src} /> : null}
      {shown.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            minWidth: 2,
            borderRadius: 999,
            backgroundColor: color,
            height: Math.max(
              4,
              Math.min(height, height * Math.sqrt(v) * sensitivity),
            ),
          }}
        />
      ))}
    </div>
  );
};
