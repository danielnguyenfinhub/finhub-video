// Title card split by a diagonal slash: the top panel slides in over the
// bottom one, each with its own line of text.
import type React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand/theme";
import { FONT } from "../mortgage/style";

export const SlashIntro: React.FC<{ top: string; bottom: string; topBg?: string; bottomBg?: string }> = ({
  top,
  bottom,
  topBg = brand.primary,
  bottomBg = brand.background,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const text: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, fontSize: 110, lineHeight: 1.2, color: "#fff", textAlign: "center", padding: "0 60px" };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: bottomBg, justifyContent: "flex-end", alignItems: "center", paddingBottom: 380 }}>
        <div style={{ ...text, transform: `translateY(${50 * (1 - p)}px)` }}>{bottom}</div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: topBg,
          clipPath: "polygon(0 0, 100% 0, 100% 38%, 0 62%)",
          transform: `translateX(${interpolate(p, [0, 1], [-width, 0])}px)`,
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 380,
        }}
      >
        <div style={{ ...text, color: brand.accent, transform: `translateY(${-50 * (1 - p)}px)` }}>{top}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
