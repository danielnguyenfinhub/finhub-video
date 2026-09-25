// The persistent episode strip: an amber bar across the top of SAFE with the
// episode line in navy, letter-spaced. A chapter (edit.json `chapters`)
// replaces the text for 2.5s with a slide-down, then the episode line returns.
// Shown on the Cover (static) and through the whole talk (Overlay, animated).
import type React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import { outFrameOf, type Reel } from "../../mortgage/schema";
import { FONT, LOGO, clamp } from "../../mortgage/style";
import { SAFE } from "../../mortgage/golden";

const CHAPTER_FRAMES_S = 2.5;
const SLIDE_FRAMES = 10;

const STRIP_HEIGHT = 60;

export const StripBar: React.FC<{ text: string; chapter?: boolean }> = ({
  text,
  chapter = false,
}) => {
  const frame = useCurrentFrame();
  const slide = chapter
    ? interpolate(frame, [0, SLIDE_FRAMES], [-40, 0], clamp)
    : 0;
  const fade = chapter
    ? interpolate(frame, [0, SLIDE_FRAMES], [0, 1], clamp)
    : 1;
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top,
        left: 0,
        right: 0,
        height: STRIP_HEIGHT,
        background: brand.accent,
        display: "flex",
        alignItems: "center",
        paddingLeft: SAFE.left,
        paddingRight: 120,
        opacity: fade,
        transform: `translateY(${slide}px)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 30,
          letterSpacing: 3,
          color: brand.textOnCard,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// The logo on white, just under the strip — the Cover's own static logo, same
// size and place as the Overlay's animated LogoMark (120 px, top-right in SAFE).
export const StripLogo: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: SAFE.top + 70,
      right: 1080 - SAFE.right,
      padding: "14px 22px",
      borderRadius: 22,
      background: "#fff",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    }}
  >
    <Img src={LOGO} style={{ height: 120, display: "block" }} />
  </div>
);

// Swaps the episode line for "PHẦN n · title" for CHAPTER_FRAMES_S seconds
// around each chapter cut, else shows the episode line throughout the talk.
export const Strip: React.FC<{ reel: Reel; episodeLine: string }> = ({
  reel,
  episodeLine,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const outFrame = outFrameOf(reel.timeline, fps);
  const chapterFrames = Math.round(CHAPTER_FRAMES_S * fps);
  const chapters = reel.edit.chapters ?? [];
  const active = chapters.reduce<{ title: string; index: number } | null>(
    (found, c, i) => {
      const at = outFrame(c.atMs);
      return frame >= at && frame < at + chapterFrames
        ? { title: c.title, index: i }
        : found;
    },
    null,
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {active ? (
        <StripBar
          text={`PHẦN ${active.index + 1} · ${active.title.toLocaleUpperCase("vi")}`}
          chapter
        />
      ) : (
        <StripBar text={episodeLine} />
      )}
      {/* LogoMark (golden rule 3c) renders the animated logo in the Overlay;
          this static StripLogo is the Cover's own, elsewhere. */}
    </AbsoluteFill>
  );
};
