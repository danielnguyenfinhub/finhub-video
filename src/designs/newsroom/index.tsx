// "newsroom": news-desk urgency for rate moves, fees and market numbers —
// striped studio backdrop, a slashing "breaking news" bar, glitching hook and
// chapter titles, amber-boxed captions, sliding number cards and a news
// ticker, a wipe-in lender lower-third. Cues, transitions and the outro reuse
// the classic design's (already RG 234-scanned and brand-checked).
import { fitText } from "@remotion/layout-utils";
import type React from "react";
import {
  AbsoluteFill,
  Freeze,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import type {
  CoverProps,
  Design,
  OverlayProps,
  TalkProps,
} from "../../mortgage/design";
import { figuresOf, lenderMentionsOf, SAFE } from "../../mortgage/golden";
import { LogoMark } from "../../mortgage/LogoMark";
import { PacedVideo } from "../../mortgage/PacedVideo";
import { outFrameOf } from "../../mortgage/schema";
import {
  emphasised,
  FONT,
  foregroundOf,
  retryVideoFetch,
} from "../../mortgage/style";
import { Typewriter } from "../../elements/Typewriter";
import { NewsTicker } from "../../elements/NewsTicker";
import { MotionTrack } from "../classic/Cues";
import { Outro } from "../classic/Outro";
import { chapterTransition } from "../../mortgage/transitions";
import { NewsroomCaptions } from "./Captions";
import {
  ChapterCard,
  FigureCard,
  GlitchLabel,
  LenderBar,
  LogoTile,
  NewsBar,
  NewsroomBackdrop,
} from "./Pieces";

const HOOK_FRAMES = 105;
const X_LEFT = SAFE.left;
const X_RIGHT = 1080 - SAFE.right;
// NewsTicker's own bar is a fixed 84px tall (src/elements/NewsTicker.tsx).
const TICKER_HEIGHT = 84;
// The LogoMark now waits for the hook to end (golden.ts logoVisible), so the
// hook uses the full safe width and stays on one line above Daniel's head.
const HOOK_RIGHT = X_RIGHT;

// ---------------------------------------------------------------- cover

const Cover: React.FC<CoverProps> = ({
  src,
  coverFrame,
  title,
  subtitle,
  keywords,
}) => {
  const { fontSize } = fitText({
    text: title,
    withinWidth: 1080 - X_RIGHT - X_LEFT,
    fontFamily: FONT,
    fontWeight: 900,
  });
  const size = Math.min(96, fontSize);
  const words = title.split(/\s+/).filter(Boolean);
  const hit = emphasised(words, keywords);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <NewsroomBackdrop />
      <NewsBar text="TIN NÓNG · TÀI CHÍNH" />
      <div
        style={{
          position: "absolute",
          left: X_LEFT,
          right: X_RIGHT,
          top: 480,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.15,
          textAlign: "center",
          color: "#fff",
          textShadow: "0 8px 30px rgba(0,0,0,0.55)",
        }}
      >
        {words.map((w, i) => (
          <span
            key={`${w}${i}`}
            style={{ color: hit.has(i) ? brand.highlight : "#fff" }}
          >
            {w}{" "}
          </span>
        ))}
      </div>
      <div
        style={{ position: "absolute", left: X_LEFT, right: X_RIGHT, top: 630 }}
      >
        <Typewriter text={subtitle} color="#fff" fontSize={44} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 1150,
          overflow: "hidden",
        }}
      >
        <Freeze frame={0}>
          <OffthreadVideo
            src={foregroundOf(src)}
            trimBefore={coverFrame}
            muted
            transparent
            {...retryVideoFetch}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 100%",
            }}
          />
        </Freeze>
      </div>
      <LogoTile />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- talk

const Talk: React.FC<TalkProps> = ({
  seg,
  index,
  src,
  look,
  foreground,
  behind,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = seg.zoomed ? 1.1 : 1.02;
  const punch =
    index === 0
      ? 0
      : (1 - spring({ frame, fps, config: { damping: 18, stiffness: 260 } })) *
        0.05;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <NewsroomBackdrop />
      {behind}
      <PacedVideo
        seg={seg}
        src={src}
        look={look}
        foreground={foreground}
        backdrop="none"
        style={{
          transform: `scale(${base + punch})`,
          transformOrigin: "50% 30%",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- overlay

const At: React.FC<{
  reel: OverlayProps["reel"];
  atMs: number;
  frames: number;
  children: React.ReactNode;
}> = ({ reel, atMs, frames, children }) => {
  const { fps } = useVideoConfig();
  const from = outFrameOf(reel.timeline, fps)(atMs);
  return (
    <Sequence from={from} durationInFrames={frames}>
      {children}
    </Sequence>
  );
};

const Hook: React.FC<{ big: string; sub?: string }> = ({ big, sub }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const outP = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
    },
  );
  return (
    <AbsoluteFill style={{ opacity: outP }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,31,61,0.92) 0%, rgba(11,31,61,0.55) 30%, transparent 48%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: X_LEFT,
          right: HOOK_RIGHT,
          top: SAFE.top,
          textAlign: "center",
        }}
      >
        <GlitchLabel text={big} fontSize={140} />
        {sub ? (
          <div
            style={{
              marginTop: 20,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 44,
              color: brand.textDim,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Figures render BEHIND Daniel's cut-out (golden rule: charts never cover his
// face). Same props and frame 0 as Overlay.
const Behind: React.FC<OverlayProps> = ({ reel }) => {
  const { fps } = useVideoConfig();
  const figures = figuresOf(reel, fps);
  return (
    <>
      {figures.map((f) => (
        <Sequence
          key={`${f.source}${f.fromFrame}`}
          from={f.fromFrame}
          durationInFrames={f.frames}
        >
          <FigureCard figure={f} />
        </Sequence>
      ))}
    </>
  );
};

const Overlay: React.FC<OverlayProps> = ({ reel, keywords, talkFrames }) => {
  const { fps } = useVideoConfig();
  const figures = figuresOf(reel, fps);
  const mentions = lenderMentionsOf(reel);
  const tickerItems = figures.flatMap((f) =>
    f.source === "stat" ? [f.big, f.label] : [f.big],
  );
  return (
    <>
      {/* Cue panels shifted into the safe band; grain stays full-frame. */}
      <MotionTrack reel={reel} panelOffset={SAFE.top - 110} />
      <NewsroomCaptions reel={reel} keywords={keywords} />
      {(reel.edit.chapters ?? []).map((c, i) => (
        <At
          key={c.atMs}
          reel={reel}
          atMs={c.atMs}
          frames={Math.round(2.5 * fps)}
        >
          <ChapterCard index={i} title={c.title} />
        </At>
      ))}
      {tickerItems.length > 0 ? (
        <div
          style={{
            position: "absolute",
            top: SAFE.bottom - TICKER_HEIGHT,
            left: 0,
            width: "100%",
            height: TICKER_HEIGHT,
          }}
        >
          <NewsTicker items={tickerItems} label="SỐ LIỆU" />
        </div>
      ) : null}
      {mentions.map((m) => {
        const from = Math.round((m.startMs / 1000) * fps);
        const frames = Math.max(
          1,
          Math.round(((m.endMs - m.startMs) / 1000) * fps),
        );
        return (
          <Sequence
            key={`${m.lender.name}${m.startMs}`}
            from={from}
            durationInFrames={frames}
          >
            <LenderBar lender={m.lender} frames={frames} />
          </Sequence>
        );
      })}
      {reel.edit.hook ? (
        <Sequence durationInFrames={HOOK_FRAMES}>
          <Hook big={reel.edit.hook.big} sub={reel.edit.hook.sub} />
        </Sequence>
      ) : null}
      <LogoMark talkFrames={talkFrames} />
    </>
  );
};

export const newsroom: Design = {
  id: "newsroom",
  Cover,
  Talk,
  Overlay,
  Behind,
  Outro,
  chapterTransition,
  copy: [
    "TIN NÓNG · TÀI CHÍNH",
    "SỐ LIỆU",
    "ĐANG NHẮC TỚI",
    "PHẦN",
    "Daniel Nguyen",
    "VS",
    "Các ngân hàng Finance Hub làm việc cùng",
    "Điện thoại",
    "Email",
    "Website",
  ],
};
