// The right-hand tracker (x 700-960, y 360-1000 inside SAFE): "HÀNH TRÌNH" plus
// a horizontal-bar list built from reel.edit.stats (golden rule 1's "stat"
// figures ARE this bar list — never rendered a second time as cards), then
// "ĐÃ NHẮC TỚI" with a rotated stack of bank logos (adapted from the rotate +
// stacked-offset feel of .claude/elements/commerce/product-collection, minus
// its Interactive.* wrapper and scroll behaviour: here every seen bank stays
// stacked, newest on top, instead of carousel-scrolling through them).
import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../../brand/theme";
import { SAFE } from "../../mortgage/golden";
import { LenderLogo } from "../../mortgage/LenderLogo";
import type { LenderMention } from "../../mortgage/lenders";
import { outFrameOf, type Reel } from "../../mortgage/schema";
import { FONT, clamp } from "../../mortgage/style";

const X = SAFE.right - 260;
const WIDTH = 260; // to SAFE.right (960)
const BAR_H = 30;
const BAR_GAP = 20;
const GROW_FRAMES = 18;
// Sidebar headings start below the LogoMark (top SAFE.top + 70, 120px tall
// on its tile): golden rule, y >= SAFE.top + 270.
// The auto-figure card (a transient counter for a spoken number with no
// stat/cue of its own) and the Tracker's "HÀNH TRÌNH" heading used to share
// this same top, so a figure landing while stats exist would sit on top of
// the tracker (golden rule 3b). The auto card now owns a permanent slot at
// the top of the sidebar; the tracker always starts below it, whether or not
// this reel ever has an auto figure, so the two can never collide.
const AUTO_CARD_TOP = SAFE.top + 270;
const AUTO_CARD_RESERVED = 170; // card height (~120) + gap, clear of HEADING_TOP
const HEADING_TOP = AUTO_CARD_TOP + AUTO_CARD_RESERVED;
const LENDER_TOP = HEADING_TOP + 480;

// Fades the whole sidebar to 0 while any edit.json cue is on screen, so a
// kinetic/compare/bars/verdict/venn/emoji/lenders card never fights the
// tracker or lender stack for the same space (golden rule 3b).
export const useSidebarFade = (reel: Reel): number => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const outFrame = outFrameOf(reel.timeline, fps);
  const cueActive = (reel.edit.cues ?? []).some((c) => {
    const from = outFrame(c.fromMs);
    const to = outFrame(c.toMs);
    return frame >= from && frame < to;
  });
  return cueActive ? 0 : 1;
};

type Bar = { label: string; big: string; atFrame: number };

const TrackerBar: React.FC<{
  bar: Bar;
  top: number;
  current: boolean;
  frame: number;
}> = ({ bar, top, current, frame }) => {
  const grown = interpolate(
    frame,
    [bar.atFrame, bar.atFrame + GROW_FRAMES],
    [0, 1],
    clamp,
  );
  const color = current ? brand.accent : "#7FC4FF";
  return (
    <div style={{ position: "absolute", left: 0, top, width: WIDTH }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 26,
          color: brand.textDim,
          marginBottom: 6,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {bar.label} · {bar.big}
      </div>
      <div
        style={{
          width: "100%",
          height: BAR_H,
          borderRadius: BAR_H / 2,
          background: "rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${grown * 100}%`,
            borderRadius: BAR_H / 2,
            background: color,
            boxShadow: current ? `0 0 18px ${brand.accent}` : undefined,
          }}
        />
      </div>
    </div>
  );
};

// The "HÀNH TRÌNH" bar-chart tracker. Every reel.edit.stats figure is one bar;
// the most recently reached one glows amber, the rest stay light blue.
export const Tracker: React.FC<{ reel: Reel }> = ({ reel }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const outFrame = outFrameOf(reel.timeline, fps);
  const stats = reel.edit.stats ?? [];
  if (stats.length === 0) return null;
  const bars: Bar[] = stats.map((s) => ({
    label: s.label,
    big: s.big,
    atFrame: outFrame(s.atMs),
  }));
  let currentIndex = -1;
  bars.forEach((b, i) => {
    if (frame >= b.atFrame) currentIndex = i;
  });
  return (
    <div
      style={{ position: "absolute", left: X, top: HEADING_TOP, width: WIDTH }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 24,
          letterSpacing: 3,
          color: brand.accent,
          marginBottom: 22,
        }}
      >
        HÀNH TRÌNH
      </div>
      <div style={{ position: "relative" }}>
        {bars.map((b, i) => (
          <TrackerBar
            key={b.atFrame}
            bar={b}
            top={i * (BAR_H + 30 + BAR_GAP)}
            current={i === currentIndex}
            frame={frame}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: bars.length * (BAR_H + 30 + BAR_GAP) + 4,
          fontFamily: FONT,
          fontSize: 16,
          color: "rgba(201,211,230,0.6)",
          lineHeight: 1.3,
        }}
      >
        ví dụ minh hoạ · cộng dồn qua các tập
      </div>
    </div>
  );
};

// A small counter card for "auto" figures (a spoken number with no stat/cue
// of its own) — top of the sidebar, transient (mounted only for its frames).
export const AutoFigureCard: React.FC<{ big: string; label: string }> = ({
  big,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: AUTO_CARD_TOP,
        width: WIDTH,
        background: "#fff",
        borderRadius: 16,
        padding: "16px 18px",
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 40,
          color: brand.textOnCard,
          lineHeight: 1.1,
        }}
      >
        {big}
      </div>
      <div style={{ fontFamily: FONT, fontSize: 16, color: "#5B6B80" }}>
        {label}
      </div>
    </div>
  );
};

// "ĐÃ NHẮC TỚI": every bank mentioned so far, stacked with a slight rotation
// per card (a "seen so far" stack, not a carousel — each new bank flips in and
// stays). The current one (mentioned right now) gets an amber outline.
export const LenderStack: React.FC<{
  mention: LenderMention;
  index: number;
  current: boolean;
}> = ({ mention, index, current }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = Math.round((mention.startMs / 1000) * fps);
  const flip = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const rotations = [-3, 2, -2];
  const rotate = rotations[index % rotations.length];
  return (
    <div
      style={{
        position: "absolute",
        left: index * 12,
        top: index * 12,
        transform: `rotate(${rotate}deg) rotateY(${interpolate(flip, [0, 1], [90, 0])}deg)`,
        opacity: interpolate(flip, [0, 1], [0, 1]),
        zIndex: index,
      }}
    >
      <div
        style={{
          borderRadius: 14,
          outline: current ? `4px solid ${brand.accent}` : undefined,
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        <LenderLogo lender={mention.lender} height={48} />
      </div>
    </div>
  );
};

export const LenderTracker: React.FC<{ mentions: LenderMention[] }> = ({
  mentions,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;
  const seenSoFar = mentions.filter((m) => nowMs >= m.startMs);
  if (seenSoFar.length === 0) return null;
  return (
    <div
      style={{ position: "absolute", left: X, top: LENDER_TOP, width: WIDTH }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 24,
          letterSpacing: 3,
          color: brand.accent,
          marginBottom: 40,
        }}
      >
        ĐÃ NHẮC TỚI
      </div>
      <div style={{ position: "relative", height: 90 }}>
        {seenSoFar.map((m, i) => (
          <LenderStack
            key={`${m.lender.name}${m.startMs}`}
            mention={m}
            index={i}
            current={nowMs >= m.startMs && nowMs <= m.endMs}
          />
        ))}
      </div>
    </div>
  );
};
