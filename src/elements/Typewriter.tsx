// Types text out character by character with a blinking caret. Characters are
// counted as the reader sees them, so a Vietnamese letter with
// its marks never appears half-typed (each base letter keeps its combining marks).
import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand/theme";
import { FONT, clamp } from "../mortgage/style";

const graphemes = (text: string) => text.normalize("NFC").match(/\P{M}\p{M}*/gu) ?? [];

export const Typewriter: React.FC<{
  text: string;
  framesPerChar?: number;
  color?: string;
  fontSize?: number;
}> = ({ text, framesPerChar = 2, color = brand.textOnCard, fontSize = 64 }) => {
  const frame = useCurrentFrame();
  const chars = graphemes(text);
  const shown = Math.floor(interpolate(frame, [0, chars.length * framesPerChar], [0, chars.length], clamp));
  const caretOn = shown < chars.length || Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{ fontFamily: FONT, fontSize, fontWeight: 800, color, lineHeight: 1.35 }}>
      {chars.slice(0, shown).join("")}
      <span style={{ color: brand.accent, opacity: caretOn ? 1 : 0 }}>▌</span>
    </div>
  );
};
