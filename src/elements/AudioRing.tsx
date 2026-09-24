// A ring of frequency bars pulsing around a centre image (the logo, a face),
// driven by the audio file it also plays. For podcast-style clips.
import { Audio } from "@remotion/media";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import type React from "react";
import { Img, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";

const BARS = 64; // visualizeAudio needs a power of two

export const AudioRing: React.FC<{ audioSrc: string; imageSrc: string; radius?: number }> = ({ audioSrc, imageSrc, radius = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc);
  const bars = audioData ? visualizeAudio({ fps, frame, audioData, numberOfSamples: BARS }) : new Array<number>(BARS).fill(0);
  const size = radius * 3;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Audio src={audioSrc} />
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`translate(${size / 2} ${size / 2})`}>
          {bars.map((a, i) => {
            const h = Math.max(8, Math.min(radius * 0.45, a * radius * 2.5));
            return <rect key={i} x={-4} y={-radius - h} width={8} height={h} rx={4} fill={i % 2 ? brand.accent : brand.primary} transform={`rotate(${(i / BARS) * 360})`} />;
          })}
        </g>
      </svg>
      <div style={{ width: radius * 1.7, height: radius * 1.7, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Img src={imageSrc} style={{ width: "80%", objectFit: "contain" }} />
      </div>
    </div>
  );
};
