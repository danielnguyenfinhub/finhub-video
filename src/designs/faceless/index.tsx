// "faceless": a voiced script with no one on screen (scripts/voice-video.mjs
// makes a transparent foreground.webm, so the core runs unchanged). The middle
// of the frame is the stage: big popping Vietnamese captions own it, and step
// down to the lower band whenever the hook, a spoken number (counting ring
// chart) or a named bank (logo card) takes it. English line at the bottom.
import { fitText } from "@remotion/layout-utils";
import type React from "react";
import { useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokPage } from "@remotion/captions";
import { brand } from "../../brand/theme";
import { captionPages } from "../../mortgage/captionPages";
import type {
  CoverProps,
  Design,
  OverlayProps,
  TalkProps,
} from "../../mortgage/design";
import { SAFE } from "../../mortgage/golden";
import { LogoMark } from "../../mortgage/LogoMark";
import { PacedVideo } from "../../mortgage/PacedVideo";
import type { Reel } from "../../mortgage/schema";
import { FONT, LOGO, clamp, emphasised, enter } from "../../mortgage/style";
import { chapterTransition } from "../../mortgage/transitions";
import { MotionTrack } from "../classic/Cues";
import { Outro } from "../classic/Outro";
import {
  ChapterPills,
  EnglishLine,
  FacelessBackdrop,
  STAGE,
  StageLayer,
  busyFrames,
} from "./Stage";

const RAMP_FRAMES = 8;
const BIG = 92;
const SMALL = 58;
// Lower band: clear of the English line, which is bottom-anchored at
// SAFE.bottom and up to two lines (~115 px) tall.
const LOW_BOTTOM = 1920 - SAFE.bottom + 140;

const Cover: React.FC<CoverProps> = ({ title, subtitle, keywords }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = title.split(/\s+/).filter(Boolean);
  const hit = emphasised(words, keywords);
  const { fontSize } = fitText({
    text: title,
    withinWidth: 900,
    fontFamily: FONT,
    fontWeight: 900,
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <FacelessBackdrop />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          right: 1080 - SAFE.right,
          top: 700,
          textAlign: "center",
          fontWeight: 900,
          fontSize: Math.min(110, fontSize * 1.6),
          lineHeight: 1.2,
          color: "#fff",
          textShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}
      >
        {words.map((w, i) => (
          <span
            key={`${w}${i}`}
            style={{
              display: "inline-block",
              marginRight: "0.25em",
              color: hit.has(i) ? brand.highlight : "#fff",
              opacity: enter(frame, fps, i * 3),
            }}
          >
            {w}
          </span>
        ))}
        <div
          style={{
            marginTop: 30,
            fontSize: 44,
            fontWeight: 700,
            color: brand.textDim,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "14px 24px",
          borderRadius: 20,
          background: "#fff",
        }}
      >
        <Img src={LOGO} style={{ height: 120, display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

const Talk: React.FC<TalkProps> = ({ seg, src, look, foreground, behind }) => (
  <AbsoluteFill>
    <FacelessBackdrop />
    {behind}
    {/* The voice. foreground.webm is fully transparent: no one on screen. */}
    <PacedVideo
      seg={seg}
      src={src}
      look={look}
      foreground={foreground}
      backdrop="none"
    />
  </AbsoluteFill>
);

const Page: React.FC<{
  page: TikTokPage;
  keywords: string[];
  from: number;
  level: number[];
}> = ({ page, keywords, from, level }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const low = level[from + frame] ?? 0;
  const size = interpolate(low, [0, 1], [BIG, SMALL]);
  const hit = emphasised(
    page.tokens.map((t) => t.text),
    keywords,
  );
  const nowMs = page.startMs + (frame / fps) * 1000;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: 1080 - SAFE.right,
        // Centre of the stage when free, the lower band when it is busy.
        bottom: interpolate(
          low,
          [0, 1],
          [1920 - (STAGE.top + STAGE.bottom) / 2 - BIG, LOW_BOTTOM],
        ),
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.3,
        color: "#fff",
        paintOrder: "stroke fill",
        WebkitTextStroke: `${size / 9}px rgba(6,19,42,0.9)`,
      }}
    >
      {page.tokens.map((t, i) => {
        const start = Math.round(((t.fromMs - page.startMs) / 1000) * fps);
        const pop = spring({
          frame: frame - start,
          fps,
          config: { damping: 12, stiffness: 200 },
        });
        const spoken = nowMs >= t.fromMs;
        return (
          <span key={t.fromMs}>
            {i > 0 && t.text.startsWith(" ") ? " " : ""}
            <span
              style={{
                display: "inline-block",
                color: hit.has(i) ? brand.highlight : "#fff",
                opacity: spoken ? 1 : 0.35,
                transform: `translateY(${interpolate(pop, [0, 1], [18, 0], clamp)}px)`,
              }}
            >
              {t.text.trim()}
            </span>
          </span>
        );
      })}
    </div>
  );
};

const Captions: React.FC<{
  reel: Reel;
  keywords: string[];
  talkFrames: number;
}> = ({ reel, keywords, talkFrames }) => {
  const { fps } = useVideoConfig();
  // 1 while the stage is busy, ramped RAMP_FRAMES each way so the captions
  // glide between the stage and the lower band instead of jumping.
  const level = useMemo(() => {
    const l = new Array<number>(talkFrames + 1).fill(0);
    for (const [a, b] of busyFrames(reel, fps))
      for (let f = Math.max(0, a); f < Math.min(l.length, b); f++) l[f] = 1;
    const step = 1 / RAMP_FRAMES;
    for (let f = 1; f < l.length; f++) l[f] = Math.min(l[f], l[f - 1] + step);
    for (let f = l.length - 2; f >= 0; f--)
      l[f] = Math.max(l[f], l[f + 1] - step);
    return l;
  }, [reel, fps, talkFrames]);
  const pages = captionPages({
    captions: reel.timeline.captions,
    combineWithinMs: 1100,
    breakOnSilenceAfterMs: 350,
  });
  return (
    <>
      {pages.map((page, i) => {
        const from = Math.round((page.startMs / 1000) * fps);
        const next = pages[i + 1]
          ? Math.round((pages[i + 1].startMs / 1000) * fps)
          : Infinity;
        const dur = Math.min(
          Math.round(((page.durationMs + 300) / 1000) * fps),
          next - from,
        );
        return dur > 0 ? (
          <Sequence key={page.startMs} from={from} durationInFrames={dur}>
            <Page page={page} keywords={keywords} from={from} level={level} />
          </Sequence>
        ) : null;
      })}
    </>
  );
};

const Overlay: React.FC<OverlayProps> = ({ reel, keywords, talkFrames }) => (
  <>
    <MotionTrack reel={reel} panelOffset={SAFE.top - 110} />
    <StageLayer reel={reel} />
    <ChapterPills reel={reel} />
    <Captions reel={reel} keywords={keywords} talkFrames={talkFrames} />
    <EnglishLine reel={reel} />
    <LogoMark talkFrames={talkFrames} />
  </>
);

export const faceless: Design = {
  id: "faceless",
  Cover,
  Talk,
  Overlay,
  Outro,
  chapterTransition,
  copy: [
    "ĐANG NHẮC TỚI · MENTIONED",
    "PHẦN",
    "Daniel Nguyen",
    "VS",
    "Các ngân hàng Finance Hub làm việc cùng",
    "Điện thoại",
    "Email",
    "Website",
  ],
};
