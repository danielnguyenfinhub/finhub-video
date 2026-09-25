// "editorial"'s shared page furniture: the cream magazine page and its
// masthead rule (thin navy lines around "FINANCE HUB" / "GÓC NHÌN"), plus the
// giant faded wordmark that sits behind Daniel on the first talk segment.
import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import { LOGO_HEIGHT, SAFE } from "../../mortgage/golden";
import { FONT, clamp } from "../../mortgage/style";

export const CREAM = "#F7F2E7";
export const INK = brand.textOnCard;

export const CreamBackdrop: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CREAM }} />
);

// The logo tile sits above the masthead rule (its own row), so the two never
// collide: Cover positions its own tile off LOGO_BOX/LOGO_TILE_HEIGHT (the
// Overlay's talk logo is LogoMark, which owns its own placement); the rule
// clears whichever is taller.
export const LOGO_BOX = { top: SAFE.top, right: 1080 - SAFE.right };
const LOGO_TILE_HEIGHT = LOGO_HEIGHT + 28; // 120px logo + vertical padding
const RULE_TOP = LOGO_BOX.top + LOGO_TILE_HEIGHT + 20; // clears the logo tile + a gap
export const MASTHEAD_BOTTOM = RULE_TOP + 62;

export const MastheadRule: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      right: 1080 - SAFE.right,
      top: RULE_TOP,
    }}
  >
    <div style={{ height: 2, background: INK }} />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 2px",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: 5,
        color: INK,
      }}
    >
      <span>FINANCE HUB</span>
      <span>GÓC NHÌN</span>
    </div>
    <div style={{ height: 2, background: INK }} />
  </div>
);

// ponytail: the design contract doesn't pass Talk the video's title, so the
// "giant headline word behind Daniel" reuses the masthead wordmark rather
// than the real title. Upgrade if TalkProps ever carries the title.
export const HeadlineWatermark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps * 2], [0.16, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 150,
          letterSpacing: -4,
          color: INK,
          opacity,
          textAlign: "center",
        }}
      >
        FINANCE HUB
      </div>
    </AbsoluteFill>
  );
};
