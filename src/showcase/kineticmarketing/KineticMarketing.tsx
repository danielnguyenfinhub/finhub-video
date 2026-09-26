// Built from the Remotion prompt gallery: https://www.remotion.dev/prompts/the-kinetic-marketing
import React from "react";
import { measureText } from "@remotion/layout-utils";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { z } from "zod";
import { useTyDoFont } from "../../brand/font";
import { brand } from "../../brand/theme";

export const kineticMarketingSchema = z.object({
  // Each phrase is one scene; its words crash in one per beat.
  phrases: z.array(z.string().min(1)).min(1).max(6),
});
type Props = z.infer<typeof kineticMarketingSchema>;

export const kineticMarketingDefaultProps: Props = {
  phrases: ["Rates keep moving", "Know where you stand", "Finance Hub"],
};

const FPS = 30;
const BEAT = (FPS * 60) / 140; // 140 BPM, 12.86 frames a beat
const AZURE = "#0b84f3";
const INK = "#0a0a0f";
const FONT_SIZE = 150;
const GAP = 36;

const words = (phrase: string) => phrase.trim().split(/\s+/);
// Words land one a beat, hold 3 beats, exit over 2.
const sceneFrames = (phrase: string) => Math.round(BEAT * (words(phrase).length + 5));

export const calculateKineticMarketingMetadata: CalculateMetadataFunction<Props> = ({ props }) => ({
  durationInFrames: props.phrases.reduce((sum, p) => sum + sceneFrames(p), 0),
  fps: FPS,
});

const Aurora: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / FPS;
  const blob = (x: number, y: number, c: string, r: number) =>
    `radial-gradient(circle at ${x}% ${y}%, ${c} 0%, transparent ${r}%)`;
  return (
    <AbsoluteFill
      style={{
        background: [
          blob(25 + 8 * Math.sin(t * 0.7), 30 + 6 * Math.cos(t * 0.5), "#ffc6e0", 55 + 5 * Math.sin(t)),
          blob(75 + 7 * Math.cos(t * 0.6), 35 + 8 * Math.sin(t * 0.8), "#d7c8ff", 55 + 5 * Math.cos(t * 1.1)),
          blob(50 + 10 * Math.sin(t * 0.4), 80 + 5 * Math.cos(t * 0.9), "#bfe0ff", 60 + 5 * Math.sin(t * 0.8)),
        ].join(", "),
        backgroundColor: "#f4f1fb",
      }}
    />
  );
};

// A simple house mark stands in for the prompt's React logos.
const HouseMark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 10 L92 46 H80 V90 H20 V46 H8 Z" fill="none" stroke={color} strokeWidth={7} strokeLinejoin="round" />
    <rect x={42} y={62} width={16} height={28} fill={color} />
  </svg>
);

const Floaters: React.FC<{ frame: number; width: number; height: number }> = ({ frame, width, height }) => (
  <AbsoluteFill style={{ perspective: 1200 }}>
    {new Array(30).fill(0).map((_, i) => {
      const depth = random(`d${i}`); // 0 far .. 1 near
      const size = 50 + depth * 170;
      const x = random(`x${i}`) * width + Math.sin(frame / 50 + i) * 40;
      const y = ((random(`y${i}`) * (height + 400) - frame * (0.6 + depth * 1.6)) % (height + 400) + height + 400) % (height + 400) - 200;
      const blur = Math.abs(depth - 0.55) * 14; // depth of field: sharp mid-plane
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - size / 2,
            top: y - size / 2,
            filter: `blur(${blur}px)`,
            opacity: 0.35 + depth * 0.4,
            transform: `rotateY(${frame * 2 + i * 40}deg) rotateX(${20 * Math.sin(frame / 40 + i)}deg)`,
          }}
        >
          <HouseMark size={size} color={i % 3 === 0 ? "#ffffff" : AZURE} />
        </div>
      );
    })}
  </AbsoluteFill>
);

const Rings: React.FC<{ frame: number; width: number; height: number }> = ({ frame, width, height }) => {
  const beatPhase = (frame % BEAT) / BEAT;
  return (
    <svg width={width} height={height} style={{ position: "absolute" }}>
      <g transform={`translate(${width / 2} ${height / 2})`}>
        {[260, 380, 520].map((r, i) => (
          <circle
            key={r}
            r={r}
            fill="none"
            stroke={AZURE}
            strokeOpacity={0.35}
            strokeWidth={3}
            strokeDasharray={i === 1 ? "4 18" : "40 22"}
            transform={`rotate(${(i % 2 ? -1 : 1) * frame * (0.8 + i * 0.3)})`}
          />
        ))}
        <circle r={120 + beatPhase * 700} fill="none" stroke={AZURE} strokeWidth={6} strokeOpacity={0.4 * (1 - beatPhase)} />
      </g>
    </svg>
  );
};

const Scene: React.FC<{ phrase: string; frame: number; fontReady: boolean }> = ({ phrase, frame, fontReady }) => {
  const { fps, width } = useVideoConfig();
  if (!fontReady) return null;
  const list = words(phrase);
  const measured = list.map(
    (w) => measureText({ text: w, fontFamily: brand.font, fontSize: FONT_SIZE, fontWeight: 900 }).width,
  );
  const full = measured.reduce((a, b) => a + b, 0) + GAP * (list.length - 1);
  const fit = Math.min(1, (width * 0.82) / full);
  const exitStart = BEAT * (list.length + 3);
  // Presence: an elastic spring per word; its width grows with it, pushing the others aside.
  const presence = list.map((_, i) => spring({ frame: frame - i * BEAT, fps, config: { damping: 9, stiffness: 160 } }));
  const row = presence.reduce((sum, p, i) => sum + p * (measured[i] + GAP), -GAP);
  let cursor = -row / 2;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: 0,
          height: 0,
          transform: `scale(${fit})`,
        }}
      >
        {list.map((w, i) => {
          const p = presence[i];
          const x = cursor + (p * measured[i]) / 2;
          cursor += p * (measured[i] + GAP);
          const exit = spring({ frame: frame - exitStart - i * 2, fps, config: { damping: 200 }, durationInFrames: BEAT * 1.5 });
          const drop = interpolate(p, [0, 1], [-260, 0], { extrapolateRight: "extend" });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: 0,
                transform: `translate(-50%, -50%) translateY(${drop}px) rotate(${-15 * exit}deg) scale(${Math.max(0, p) * (1 - exit)})`,
                fontFamily: brand.font,
                fontWeight: 900,
                fontSize: FONT_SIZE,
                lineHeight: 1.25,
                whiteSpace: "pre",
                color: i === list.length - 1 ? AZURE : INK,
              }}
            >
              {w}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene switches alternate a blue iris wipe and a ring tunnel, centred on the cut.
const Transition: React.FC<{ t: number; kind: number; width: number; height: number }> = ({ t, kind, width, height }) => {
  const T = BEAT * 1.2;
  if (Math.abs(t) > T) return null;
  const cover = Math.hypot(width, height) / 2 + 20;
  if (kind % 2 === 0) {
    const r = t < 0 ? cover * interpolate(t, [-T, 0], [0, 1]) ** 2 : cover * interpolate(t, [0, T], [0, 1]) ** 2;
    const mask = t < 0 ? undefined : `radial-gradient(circle at center, transparent ${r}px, black ${r + 1}px)`;
    return t < 0 ? (
      <div style={{ position: "absolute", left: width / 2 - r, top: height / 2 - r, width: r * 2, height: r * 2, borderRadius: "50%", background: AZURE }} />
    ) : (
      <AbsoluteFill style={{ background: AZURE, WebkitMaskImage: mask, maskImage: mask }} />
    );
  }
  const k = 1 - Math.abs(t) / T; // 0 at the edges, 1 at the cut
  return (
    <svg width={width} height={height} style={{ position: "absolute" }}>
      {new Array(9).fill(0).map((_, i) => {
        const r = ((i / 9 + (t + T) / (2 * T)) % 1) ** 2 * cover;
        return (
          <circle key={i} cx={width / 2} cy={height / 2} r={r} fill="none" stroke={AZURE} strokeWidth={20 + k * k * 220} />
        );
      })}
    </svg>
  );
};

export const KineticMarketing: React.FC<Props> = ({ phrases }) => {
  const fontReady = useTyDoFont();
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const starts = phrases.reduce<number[]>((acc, p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + sceneFrames(phrases[i - 1])], []);
  let current = 0;
  starts.forEach((s, i) => {
    if (frame >= s) current = i;
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Aurora frame={frame} />
      <Rings frame={frame} width={width} height={height} />
      <Floaters frame={frame} width={width} height={height} />
      <AbsoluteFill
        style={{
          margin: "auto",
          width: width * 0.9,
          height: height * 0.44,
          borderRadius: 48,
          background: "rgba(255,255,255,0.28)",
          border: "2px solid rgba(255,255,255,0.6)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 30px 80px rgba(11,132,243,0.15)",
        }}
      />
      <Scene key={current} phrase={phrases[current]} frame={frame - starts[current]} fontReady={fontReady} />
      {starts.slice(1).map((s, i) => (
        <Transition key={s} t={frame - s} kind={i} width={width} height={height} />
      ))}
    </AbsoluteFill>
  );
};
