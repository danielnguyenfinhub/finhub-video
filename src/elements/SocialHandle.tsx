// "Follow us" pill: the Finance Hub logo, the platform and the handle, rising
// in from the bottom. Pass the real handle; there is no default.
import type React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, LOGO } from "../mortgage/style";

const PLATFORMS = {
  facebook: { name: "Facebook", color: "#1877F2" },
  youtube: { name: "YouTube", color: "#FF0000" },
  tiktok: { name: "TikTok", color: "#111111" },
  instagram: { name: "Instagram", color: "#E1306C" },
} as const;

export const SocialHandle: React.FC<{ platform: keyof typeof PLATFORMS; handle: string }> = ({ platform, handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const { name, color } = PLATFORMS[platform];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 20,
        background: "#fff",
        borderRadius: 999,
        padding: "14px 34px 14px 18px",
        border: `4px solid ${color}`,
        boxShadow: "0 18px 36px rgba(11,31,61,0.35)",
        fontFamily: FONT,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [140, 0])}px)`,
      }}
    >
      <Img src={LOGO} style={{ height: 64 }} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
        <span style={{ color, fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>{name.toUpperCase()}</span>
        <span style={{ color: "#0B1F3D", fontSize: 40, fontWeight: 900 }}>{handle}</span>
      </div>
    </div>
  );
};
