// Built from the Remotion prompt gallery: https://www.remotion.dev/prompts/shape-to-words-transformation
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { useTyDoFont } from "../../brand/font";
import { brand } from "../../brand/theme";

export const shapeToWordsSchema = z.object({
  // One hook line; each non-space character gets a shape that morphs into it.
  text: z.string().min(1).max(20),
});

export const shapeToWordsDefaultProps: z.infer<typeof shapeToWordsSchema> = {
  text: "Check your rate",
};

// Timeline (30 fps, 300 frames = the prompt's 10 seconds).
const MORPH_START = 60;
const JUMP_STAGGER = 4;
const LOGO_IN = 150;
const LOGO_SPIN = 180;
const WIPE_START = 215;
const WIPE_FRAMES = 75;

const COLORS = [brand.primary, brand.accent, brand.good, brand.bad, brand.background, brand.highlight];

// Filled shapes in a 100x100 box, in the prompt's order, repeated for longer lines.
const SHAPES = [
  "50,4 96,38 78,94 22,94 4,38", // pentagon
  "50,6 96,92 4,92", // triangle
  "8,8 92,8 92,92 8,92", // square
  "circle",
  "27,6 73,6 96,50 73,94 27,94 4,50", // hexagon
  "50,2 98,50 50,98 2,50", // diamond
  "circle",
  "50,6 96,92 4,92", // triangle
];

const Shape: React.FC<{ index: number; color: string; size: number }> = ({ index, color, size }) => {
  const s = SHAPES[index % SHAPES.length];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      {s === "circle" ? <circle cx={50} cy={50} r={46} fill={color} /> : <polygon points={s} fill={color} />}
    </svg>
  );
};

const Glyph: React.FC<{
  char: string;
  index: number;
  p: number; // jump/morph progress 0..1 (spring, may overshoot)
  slot: number;
  opacity: number;
}> = ({ char, index, p, slot, opacity }) => {
  const color = COLORS[index % COLORS.length];
  const clamped = Math.min(Math.max(p, 0), 1);
  const y = -slot * 2.2 * Math.sin(Math.PI * clamped);
  // The swap happens mid-air, mid-spin: the shape shrinks as the letter grows.
  const shapeScale = interpolate(p, [0.3, 0.55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const letterScale = interpolate(p, [0.45, 0.75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const size = slot * 0.8;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${y}px)`, opacity }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${180 * p}deg) scale(${shapeScale})`,
        }}
      >
        <Shape index={index} color={color} size={size} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${180 * p - 180}deg) scale(${letterScale})`,
          color,
          fontFamily: brand.font,
          fontWeight: 900,
          fontSize: slot * 1.05,
          lineHeight: 1,
        }}
      >
        {char}
      </div>
    </div>
  );
};

export const ShapeToWords: React.FC<z.infer<typeof shapeToWordsSchema>> = ({ text }) => {
  useTyDoFont();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const chars = Array.from(text.toUpperCase());
  const slotsUsed = chars.reduce((sum, c) => sum + (c === " " ? 0.5 : 1), 0);
  const slot = Math.min(130, (width * 0.82) / slotsUsed);
  const rowWidth = slot * slotsUsed;
  const rowLeft = (width - rowWidth) / 2;
  const rowY = height / 2;

  // Lay out: x centre of each glyph; spaces take half a slot and draw nothing.
  let cursor = rowLeft;
  const glyphs: { char: string; x: number; i: number }[] = [];
  let shapeIndex = 0;
  for (const c of chars) {
    if (c === " ") {
      cursor += slot * 0.5;
      continue;
    }
    glyphs.push({ char: c, x: cursor + slot / 2, i: shapeIndex++ });
    cursor += slot;
  }

  const jump = (f: number, i: number) =>
    spring({ frame: f - MORPH_START - i * JUMP_STAGGER, fps, config: { damping: 14 } });

  // Logo: flies in from the left, snaps to hover above-left of the first letter, spins 360.
  const logoH = slot * 0.9;
  const logoW = logoH * (2000 / 1215);
  const hoverX = glyphs[0].x - slot * 0.2;
  const hoverY = rowY - slot * 1.6;
  const arrive = spring({ frame: frame - LOGO_IN, fps, config: { damping: 12 } });
  const spin = spring({ frame: frame - LOGO_SPIN, fps, config: { damping: 18 } });
  const wipe = spring({ frame: frame - WIPE_START, fps, config: { damping: 300 }, durationInFrames: WIPE_FRAMES });
  const logoX = interpolate(wipe, [0, 1], [interpolate(arrive, [0, 1], [-logoW, hoverX]), width + logoW]);
  const logoY = interpolate(wipe, [0, 0.2], [hoverY, rowY], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        backgroundImage:
          "linear-gradient(#eceff3 1px, transparent 1px), linear-gradient(90deg, #eceff3 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    >
      {glyphs.map(({ char, x, i }) => {
        const p = jump(frame, i);
        const breathe = 1 + 0.06 * Math.sin((2 * Math.PI * (frame + i * 7)) / 60) * (1 - Math.min(p, 1));
        // Erased as the logo's centre passes over this letter.
        const erased = frame >= WIPE_START ? interpolate(logoX - x, [0, slot * 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        const inAir = p > 0.02 && p < 0.97;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - slot / 2,
              top: rowY - slot / 2,
              width: slot,
              height: slot,
              transform: `scale(${breathe * (1 - erased)})`,
            }}
          >
            {inAir &&
              [6, 4, 2].map((lag, k) => (
                <Glyph key={lag} char={char} index={i} p={jump(frame - lag, i)} slot={slot} opacity={0.08 + k * 0.07} />
              ))}
            <Glyph char={char} index={i} p={p} slot={slot} opacity={1 - erased} />
          </div>
        );
      })}
      {/* White card: the logo's black wordmark must not sit over the letters it erases. */}
      <div
        style={{
          position: "absolute",
          left: logoX - logoW / 2 - 18,
          top: logoY - logoH / 2 - 14,
          padding: "14px 18px",
          background: brand.card,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(11,31,61,0.18)",
          transform: `rotate(${360 * spin}deg)`,
        }}
      >
        <Img src={staticFile("brand/finhub-logo.png")} style={{ display: "block", width: logoW, height: logoH }} />
      </div>
    </AbsoluteFill>
  );
};
