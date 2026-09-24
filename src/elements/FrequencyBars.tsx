// Equaliser bars driven by an audio file, each with a peak marker that holds
// then falls. Silent by default: over a talking-head reel the voice is already
// playing, and a second <Audio> would double it; pass playAudio for a
// standalone clip. The peak is recomputed from the last HOLD_FRAMES frames of
// audio (not remembered between frames), so every frame renders on its own.
import { Audio } from "@remotion/media";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";

const HOLD_FRAMES = 10;
const FALL_PER_FRAME = 0.035; // share of full height the peak drops per frame
const BAR_HEIGHT = 220;

export const FrequencyBars: React.FC<{
  audioSrc: string;
  bars?: 16 | 32 | 64; // visualizeAudio needs a power of two
  playAudio?: boolean;
}> = ({ audioSrc, bars = 32, playAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc);
  const at = (f: number) =>
    audioData && f >= 0
      ? visualizeAudio({ fps, frame: f, audioData, numberOfSamples: bars })
      : new Array<number>(bars).fill(0);
  const level = (a: number) => Math.min(1, a * 2.5);
  const now = at(frame).map(level);
  const history = Array.from({ length: HOLD_FRAMES }, (_, k) =>
    at(frame - k - 1).map(level),
  );
  // A peak from k+1 frames ago holds for a moment, then falls.
  const peaks = now.map((v, i) =>
    Math.max(
      v,
      ...history.map((h, k) => h[i] - Math.max(0, k - 2) * FALL_PER_FRAME),
    ),
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height: BAR_HEIGHT,
        padding: "20px 28px",
        borderRadius: 20,
        backgroundColor: "rgba(11, 31, 61, 0.85)",
      }}
    >
      {playAudio ? <Audio src={audioSrc} /> : null}
      {now.map((v, i) => (
        <div
          key={i}
          style={{ position: "relative", width: 14, height: "100%" }}
        >
          <div
            style={{
              position: "absolute",
              bottom: peaks[i] * BAR_HEIGHT,
              width: "100%",
              height: 4,
              borderRadius: 2,
              backgroundColor: brand.accent,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: Math.max(6, v * BAR_HEIGHT),
              borderRadius: 4,
              backgroundColor: "#4FA3E0",
            }}
          />
        </div>
      ))}
    </div>
  );
};
