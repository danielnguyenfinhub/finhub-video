// The explainer's overlay: marker-pen captions on the paper under the card,
// sticky-note stats, chapter tabs, the hook note and a pencil progress line.
// Timing comes from the same core data as every design (toOutMs on the paced
// timeline); only the drawing differs.
import type { TikTokPage } from "@remotion/captions";
import { captionPages } from "../../mortgage/captionPages";
import { fitText } from "@remotion/layout-utils";
import { Audio } from "@remotion/media";
import { Trail } from "@remotion/motion-blur";
import { Box, Circle, Highlight, Underline } from "@remotion/rough-notation";
import type React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import type { OverlayProps } from "../../mortgage/design";
import type { EditJson, Reel } from "../../mortgage/schema";
import { FONT, LOGO, clamp, emphasised, enter } from "../../mortgage/style";
import { toOutMs } from "../../mortgage/timeline";
import { CueTrack } from "./Cues";
import { INK, MARKER, PencilLine, Sticky } from "./Paper";

const HOOK_FRAMES = 105;
// Captions sit on the paper below the talking-head card (see index.tsx).
const CAPTION_TOP = 1350;

// ---------------------------------------------------------------- captions

// Each word is marked with a highlighter stroke as it is spoken, so the
// sentence fills with marker; keywords are ink-blue and underlined.
const CaptionPage: React.FC<{ page: TikTokPage; keywords: string[] }> = ({
  page,
  keywords,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;
  const hit = emphasised(
    page.tokens.map((t) => t.text),
    keywords,
  );
  const p = enter(frame, fps);
  return (
    <AbsoluteFill style={{ top: CAPTION_TOP, alignItems: "center" }}>
      <div
        style={{
          width: 900,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px 16px",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.35,
          color: INK,
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
        }}
      >
        {page.tokens.map((t, i) => {
          const marked = interpolate(
            nowMs,
            [t.fromMs, t.fromMs + 180],
            [0, 1],
            clamp,
          );
          const word = (
            <span style={{ color: hit.has(i) ? brand.primary : INK }}>
              {t.text.trim()}
            </span>
          );
          return (
            <Highlight
              key={t.fromMs}
              progress={marked}
              color={MARKER}
              iterations={1}
              seed={i + 1}
              padding={{ left: 4, right: 4 }}
            >
              {hit.has(i) ? (
                <Underline
                  progress={marked}
                  color={brand.primary}
                  strokeWidth={4}
                  iterations={1}
                  seed={i + 7}
                >
                  {word}
                </Underline>
              ) : (
                word
              )}
            </Highlight>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC<{ reel: Reel; keywords: string[] }> = ({
  reel,
  keywords,
}) => {
  const { fps } = useVideoConfig();
  const pages = captionPages({
    captions: reel.timeline.captions,
    combineWithinMs: 1200,
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
          Math.round(((page.durationMs + 400) / 1000) * fps),
          next - from,
        );
        if (dur <= 0) return null;
        return (
          <Sequence
            key={page.startMs}
            from={from}
            durationInFrames={dur}
            layout="none"
          >
            <CaptionPage page={page} keywords={keywords} />
          </Sequence>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- stats

const StatNote: React.FC<{ big: string; label: string }> = ({ big, label }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inP = enter(frame, fps);
  const outP = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [0, 1],
    clamp,
  );
  // Long figures shrink to the note (640 px of text), never above 110 px.
  const size = Math.min(
    110,
    fitText({ text: big, withinWidth: 640, fontFamily: FONT, fontWeight: 900 })
      .fontSize,
  );
  return (
    <AbsoluteFill style={{ top: 190, alignItems: "center" }}>
      <Audio src={staticFile("sfx/ding.wav")} volume={() => 0.3} />
      <Sticky
        rotate={0}
        style={{
          width: 760,
          textAlign: "center",
          fontFamily: FONT,
          color: INK,
          opacity: 1 - outP,
          transform: `scale(${interpolate(inP, [0, 1], [1.4, 1])}) rotate(${interpolate(inP, [0, 1], [-12, 2])}deg)`,
        }}
      >
        <Underline
          progress={interpolate(frame, [10, 26], [0, 1], clamp)}
          color={brand.primary}
          strokeWidth={6}
          iterations={2}
          seed={3}
        >
          <span
            style={{ fontSize: size, fontWeight: 900, whiteSpace: "nowrap" }}
          >
            {big}
          </span>
        </Underline>
        <div
          style={{
            fontSize: 42,
            fontWeight: 600,
            marginTop: 12,
            lineHeight: 1.3,
          }}
        >
          {label}
        </div>
      </Sticky>
    </AbsoluteFill>
  );
};

const StatNotes: React.FC<{ reel: Reel }> = ({ reel }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {(reel.edit.stats ?? []).map((c) => {
        const at = toOutMs(reel.timeline.segments, c.atMs, fps);
        if (at === null) return null;
        return (
          <Sequence
            key={c.atMs}
            from={Math.round((at / 1000) * fps)}
            durationInFrames={Math.round((c.durMs / 1000) * fps)}
          >
            <StatNote big={c.big} label={c.label} />
          </Sequence>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- chapters

const ChapterTab: React.FC<{ index: number; title: string }> = ({
  index,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inP = enter(frame, fps);
  const outP = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    clamp,
  );
  return (
    <AbsoluteFill style={{ top: 70, left: 60 }}>
      <Audio src={staticFile("sfx/whoosh.wav")} volume={() => 0.3} />
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 26,
          alignSelf: "flex-start",
          // Ends 24 px before the logo badge (top right); a long title wraps.
          maxWidth: 760,
          background: "#fff",
          padding: "18px 34px",
          fontFamily: FONT,
          color: INK,
          boxShadow: "0 10px 26px rgba(11,31,61,0.22)",
          transform: `translateX(${interpolate(inP, [0, 1], [-900, 0]) - outP * 900}px) rotate(-1.5deg)`,
        }}
      >
        <Box
          progress={interpolate(frame, [8, 22], [0, 1], clamp)}
          color={brand.accent}
          strokeWidth={4}
          iterations={2}
          seed={index + 11}
          padding={{ left: 8, right: 8, top: 4, bottom: 4 }}
        >
          <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: 2 }}>
            PHẦN {index + 1}
          </span>
        </Box>
        <span style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15 }}>
          {title}
        </span>
      </div>
    </AbsoluteFill>
  );
};

const ChapterTabs: React.FC<{ reel: Reel }> = ({ reel }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {(reel.edit.chapters ?? []).map((c, i) => {
        const at = toOutMs(reel.timeline.segments, c.atMs, fps);
        if (at === null) return null;
        return (
          <Sequence
            key={c.atMs}
            from={Math.round((at / 1000) * fps)}
            durationInFrames={Math.round(2.6 * fps)}
          >
            <ChapterTab index={i} title={c.title} />
          </Sequence>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- hook

// A sticky note slapped onto the page (motion-blurred as it lands), its big
// figure counting up and then circled in red pen.
const HookNote: React.FC<{ hook: NonNullable<EditJson["hook"]> }> = ({
  hook,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inP = enter(frame, fps);
  const outP = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [0, 1],
    clamp,
  );
  const big =
    hook.countTo === undefined
      ? hook.big
      : [
          interpolate(frame, [4, 40], [0, hook.countTo], clamp).toLocaleString(
            "vi-VN",
            {
              minimumFractionDigits: hook.decimals ?? 0,
              maximumFractionDigits: hook.decimals ?? 0,
            },
          ),
          hook.suffix ?? "",
        ]
          .join(" ")
          .trim();
  // Sized once from the string shown when the count-up ends (number + suffix),
  // so the text doesn't jitter or outgrow the note mid-count.
  const finalText =
    hook.countTo === undefined
      ? hook.big
      : [
          hook.countTo.toLocaleString("vi-VN", {
            minimumFractionDigits: hook.decimals ?? 0,
            maximumFractionDigits: hook.decimals ?? 0,
          }),
          hook.suffix ?? "",
        ]
          .join(" ")
          .trim();
  const size = Math.min(
    120,
    fitText({
      text: finalText,
      withinWidth: 700,
      fontFamily: FONT,
      fontWeight: 900,
    }).fontSize,
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - outP }}>
      <Audio src={staticFile("sfx/mouse-click.wav")} volume={() => 0.5} />
      <Trail layers={4} lagInFrames={0.6} trailOpacity={0.5}>
        <AbsoluteFill style={{ top: 175, alignItems: "center" }}>
          <Sticky
            rotate={0}
            style={{
              width: 820,
              textAlign: "center",
              fontFamily: FONT,
              color: INK,
              transform: `translateY(${interpolate(inP, [0, 1], [-700, 0])}px) rotate(${interpolate(inP, [0, 1], [8, -3])}deg)`,
            }}
          >
            <Circle
              progress={interpolate(frame, [30, 55], [0, 1], clamp)}
              color="#D2342A"
              strokeWidth={6}
              iterations={1}
              seed={5}
              padding={{ left: 24, right: 24, top: 6, bottom: 2 }}
            >
              <span
                style={{
                  fontSize: size,
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                }}
              >
                {big}
              </span>
            </Circle>
            {hook.sub ? (
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  marginTop: 40,
                  lineHeight: 1.3,
                }}
              >
                {hook.sub}
              </div>
            ) : null}
          </Sticky>
        </AbsoluteFill>
      </Trail>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- progress

const ProgressLine: React.FC<{ talkFrames: number }> = ({ talkFrames }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ top: 1860, left: 60 }}>
      <PencilLine
        progress={Math.min(1, frame / talkFrames)}
        width={960}
        seed="progress"
        color={brand.primary}
      />
    </AbsoluteFill>
  );
};

// The FinHub logo, top right for the whole talk (as in the classic design),
// on white as the brand kit requires; drawn last so nothing covers it.
const LogoBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 28,
      right: 36,
      padding: "10px 16px",
      borderRadius: 18,
      background: "#fff",
      boxShadow: "0 6px 18px rgba(11, 31, 61, 0.25)",
    }}
  >
    <Img src={LOGO} style={{ height: 100, display: "block" }} />
  </div>
);

export const Overlay: React.FC<OverlayProps> = ({
  reel,
  keywords,
  talkFrames,
}) => (
  <>
    <CueTrack reel={reel} />
    <ProgressLine talkFrames={talkFrames} />
    <StatNotes reel={reel} />
    <ChapterTabs reel={reel} />
    <Captions reel={reel} keywords={keywords} />
    {reel.edit.hook ? (
      <Sequence durationInFrames={HOOK_FRAMES}>
        <HookNote hook={reel.edit.hook} />
      </Sequence>
    ) : null}
    <LogoBadge />
  </>
);
