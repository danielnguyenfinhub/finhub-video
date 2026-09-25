// A live waveform line of an audio file (Remotion Elements' AudioOscilloscope,
// adapted). `frame` is the moment in the AUDIO's own timeline to draw, so a
// design can follow Daniel's voice through the cuts and pacing (source frame =
// seg.srcFrom + frame * seg.rate); left out, it follows the current frame.
// Silent by default: in a reel the voice is already playing, and a second
// <Audio> would double it. Reads .mp4 audio too (useWindowedAudioData
// supports every Mediabunny format since 4.0.383).
import { Audio } from "@remotion/media";
import {
  createSmoothSvgPath,
  getWaveformPortion,
  useWindowedAudioData,
} from "@remotion/media-utils";
import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";

export const Oscilloscope: React.FC<{
  src: string;
  frame?: number;
  color?: string;
  width?: number;
  height?: number;
  lineWidth?: number;
  amplitude?: number;
  windowInSeconds?: number;
  playAudio?: boolean;
}> = ({
  src,
  frame,
  color = brand.primary,
  width = 900,
  height = 300,
  lineWidth = 6,
  amplitude = 2,
  windowInSeconds = 0.35,
  playAudio = false,
}) => {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = frame ?? current;
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    fps,
    frame: Math.round(at),
    src,
    windowInSeconds: 10,
  });
  const mid = height / 2;
  const waveform = audioData
    ? getWaveformPortion({
        audioData,
        channel: 0,
        dataOffsetInSeconds,
        durationInSeconds: windowInSeconds,
        normalize: false,
        numberOfSamples: 64,
        outputRange: "minus-one-to-one",
        startTimeInSeconds: at / fps - windowInSeconds / 2,
      }).map((s) => s.amplitude)
    : [];
  const path =
    waveform.length > 1
      ? createSmoothSvgPath({
          points: waveform.map((v, i) => ({
            x:
              lineWidth * 2 +
              (i / (waveform.length - 1)) * (width - lineWidth * 4),
            y:
              mid +
              Math.max(-1, Math.min(1, v * amplitude)) * (mid - lineWidth),
          })),
        })
      : null;
  return (
    <div style={{ width, height, overflow: "hidden" }}>
      {playAudio ? <Audio src={src} /> : null}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line
          x1={0}
          x2={width}
          y1={mid}
          y2={mid}
          stroke={color}
          strokeOpacity={0.18}
          strokeWidth={1}
        />
        {path ? (
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={lineWidth}
          />
        ) : null}
      </svg>
    </div>
  );
};
