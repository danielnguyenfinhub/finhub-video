// MortgageReel: the reusable FinHub talking-head template. Per video, only
// public/videos/<slug>/{source.mp4, words.json, edit.json} change; this code
// doesn't. calculateMetadata loads the edit, enforces ASIC RG 234 on every
// on-screen string (the render FAILS rather than ship a non-compliant claim),
// builds the paced timeline and hands it to the component as props.
import {
  TransitionSeries,
  linearTiming,
  pushCut,
  springTiming,
  type TransitionPresentation,
} from "@remotion/transitions";
import { Audio, Video } from "@remotion/media";
import { colorCorrection } from "@remotion/effects/color-correction";
import { grayscale } from "@remotion/effects/grayscale";
import { vignette } from "@remotion/effects/vignette";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
  type EffectsProp,
} from "remotion";
import { z } from "zod";
import { brand } from "../brand/theme";
import {
  blurSlideOrFallback,
  bookFlipOrFallback,
  crossZoomOrFallback,
  crosswarpOrFallback,
  dissolveOrFallback,
  dreamyZoomOrFallback,
  filmBurnOrFallback,
  linearBlurOrFallback,
  rippleOrFallback,
  swapOrFallback,
  zoomBlurOrFallback,
  zoomInOutOrFallback,
} from "../showcase/htmlInCanvasPresentation";
import { Captions, Chapters, StatCards } from "./Captions";
import { assertCompliantCopy, assertRateGate } from "./compliance";
import { MotionTrack } from "./Cues";
import { ComplianceCard, Outro } from "./EndCards";
import {
  Chrome,
  Cover,
  HookBurst,
  HookSfx,
  HookTitle,
  MoneyRain,
} from "./Frame";
import {
  DEFAULT_CTA_QUESTION,
  DEFAULT_SUBTITLE,
  onScreenCopy,
  parseEdit,
  type EditJson,
  type Look,
  type Reel,
} from "./schema";
import { KEYWORDS, clamp, retryVideoFetch, useReelFont } from "./style";
import {
  CHAPTER_TRANSITION_FRAMES,
  COVER_FRAMES,
  COVER_TRANSITION_FRAMES,
  TALK_START_FRAME,
  buildTimeline,
  type OutCaption,
  type Segment,
  type TransitionKind,
  type Word,
} from "./timeline";

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const OUTRO_FRAMES = 150;
const OUTRO_TRANSITION = 18;
// Compliance disclosures close the video, held for 5 s.
const COMPLIANCE_FRAMES = 150;
const COMPLIANCE_TRANSITION = 10;
const HOOK_FRAMES = 105;
const DEFAULT_COVER_FRAME_MS = 1500;
const MUSIC_VOLUME = 0.3;
// While Daniel talks the music plays at this fraction of its volume.
const MUSIC_DUCK = 0.3;
// Pauses shorter than this stay ducked, so the music doesn't pump between words.
const MUSIC_HOLD_MS = 700;
// Frames for a full swing between ducked and full, either way.
const MUSIC_RAMP_FRAMES = 10;
const MUSIC_FADE_IN_FRAMES = 15;
const MUSIC_FADE_OUT_FRAMES = 45;

export const mortgageReelSchema = z.object({ slug: z.string() });
export type MortgageReelProps = z.infer<typeof mortgageReelSchema> & {
  reel: Reel | null;
};

const fetchJson = async (slug: string, file: string): Promise<unknown> => {
  const path = `videos/${slug}/${file}`;
  const res = await fetch(staticFile(path));
  if (!res.ok)
    throw new Error(
      `MortgageReel "${slug}": public/${path} not found (HTTP ${res.status}). ` +
        `Run scripts/prep-video.py <video> ${slug} first, then write edit.json.`,
    );
  return res.json();
};

export const calculateMortgageReelMetadata: CalculateMetadataFunction<
  MortgageReelProps
> = async ({ props }) => {
  const { slug } = props;
  const [editJson, words] = await Promise.all([
    fetchJson(slug, "edit.json"),
    fetchJson(slug, "words.json"),
  ]);
  const edit = parseEdit(editJson, slug);
  if (!Array.isArray(words) || words.length === 0)
    throw new Error(`public/videos/${slug}/words.json has no words.`);
  // Throws "RG 234: restricted terminology found" and fails the render.
  assertCompliantCopy(onScreenCopy(edit), edit.exemptions ?? []);
  const rate = edit.compliance?.advertisedRate;
  if (rate)
    assertRateGate(rate.rateFigure, rate.comparisonRate, rate.ratesAsAt);
  const timeline = buildTimeline(words as Word[], edit, FPS);
  return {
    durationInFrames:
      TALK_START_FRAME +
      timeline.talkFrames +
      OUTRO_FRAMES -
      OUTRO_TRANSITION +
      COMPLIANCE_FRAMES -
      COMPLIANCE_TRANSITION,
    defaultOutName: slug,
    props: { slug, reel: { edit, timeline } },
  };
};

// Widened so the differently-typed presentations fit one <Transition> prop;
// presentations with required props only widen via unknown. A Record, so a
// name added to TRANSITIONS without an entry here fails the type check.
type AnyPresentation = TransitionPresentation<Record<string, unknown>>;
const widen = (p: unknown) => p as AnyPresentation;
const PRESENTATIONS: Record<TransitionKind, () => AnyPresentation> = {
  fade: () => widen(fade()),
  slide: () => widen(slide({ direction: "from-right" })),
  wipe: () => widen(wipe({ direction: "from-left" })),
  flip: () => widen(flip({ direction: "from-right" })),
  clockWipe: () => widen(clockWipe({ width: WIDTH, height: HEIGHT })),
  iris: () => widen(iris({ width: WIDTH, height: HEIGHT })),
  pushCut: () => widen(pushCut({ flashColor: brand.accent })),
  // Shader transitions, each falling back to fade() without HTML-in-canvas.
  blurSlide: blurSlideOrFallback,
  bookFlip: bookFlipOrFallback,
  crossZoom: crossZoomOrFallback,
  crosswarp: crosswarpOrFallback,
  dissolve: dissolveOrFallback,
  dreamyZoom: dreamyZoomOrFallback,
  filmBurn: filmBurnOrFallback,
  linearBlur: linearBlurOrFallback,
  ripple: rippleOrFallback,
  swap: swapOrFallback,
  zoomBlur: zoomBlurOrFallback,
  zoomInOut: zoomInOutOrFallback,
};
const presentation = (kind: TransitionKind) => PRESENTATIONS[kind]();

// edit.json `look` recipes. Values stay inside each effect's documented range
// (contrast/saturation 0-3, temperature -1..1, vignette amount 0-1).
const LOOK_EFFECTS: Record<Look, EffectsProp> = {
  warm: [
    colorCorrection({ temperature: 0.15, saturation: 1.1, contrast: 1.05 }),
    vignette({ amount: 0.25 }),
  ],
  cinematic: [
    colorCorrection({ temperature: 0.05, saturation: 0.9, contrast: 1.15 }),
    vignette({ amount: 0.4 }),
  ],
  mono: [
    grayscale({ amount: 1 }),
    colorCorrection({ contrast: 1.1 }),
    vignette({ amount: 0.3 }),
  ],
};

// One kept piece of the source, played at its pacing rate. Alternate segments
// sit punched-in on the face, so every jump cut reads as an intentional
// zoom-cut, and each cut lands with a small spring "punch". Volume ramps 2
// frames at each edge so cuts don't click.
// Only trimBefore is set: <OffthreadVideo>'s trimAfter is applied as a timeline
// duration (trimAfter - trimBefore frames), not scaled by playbackRate, so at a
// rate below 1 it would blank the segment's tail. The enclosing sequence of
// outDuration frames ends playback at srcFrom + outDuration * rate ≈ srcTo.
const TalkSegment: React.FC<{
  seg: Segment;
  index: number;
  src: string;
  look?: Look;
}> = ({ seg, index, src, look }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = seg.outDuration;
  const base =
    index === 0
      ? interpolate(frame, [0, 24], [1.3, 1], { extrapolateRight: "clamp" })
      : seg.zoomed
        ? 1.13
        : 1.0;
  const punch =
    index === 0
      ? 0
      : (1 - spring({ frame, fps, config: { damping: 18, stiffness: 260 } })) *
        0.05;
  const drift = interpolate(frame, [0, dur], [0, 0.02]);
  const shared = {
    src,
    trimBefore: seg.srcFrom,
    playbackRate: seg.rate,
    volume: (f: number) =>
      interpolate(f, [0, 2, dur - 2, dur], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transform: `scale(${base + punch + drift})`,
      transformOrigin: "50% 30%",
    } as const,
  };
  // A graded video plays through @remotion/media's <Video>, whose `effects`
  // run the grade on each decoded frame. <OffthreadVideo> has no effects prop
  // and wrapping it in <HtmlInCanvas> never paints, so the render hangs.
  // No fallback to <OffthreadVideo>: that would ship the video ungraded. Its
  // objectFit prop (default "contain") overrides style.objectFit, so it is set
  // too. No onError: after delayRenderRetries the render fails, as it should.
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {look ? (
        <Video
          {...shared}
          objectFit="cover"
          effects={LOOK_EFFECTS[look]}
          disallowFallbackToOffthreadVideo
          delayRenderRetries={retryVideoFetch.delayRenderRetries}
          delayRenderTimeoutInMilliseconds={
            retryVideoFetch.delayRenderTimeoutInMilliseconds
          }
        />
      ) : (
        <OffthreadVideo {...shared} {...retryVideoFetch} />
      )}
    </AbsoluteFill>
  );
};

// edit.json's music, looped under the whole video and ducked under speech. The
// captions (talk-timeline ms, kept words only) say when Daniel talks; the level
// is precomputed per frame and ramps at most one MUSIC_RAMP_FRAMES step a
// frame, starting to dip before each phrase.
const Music: React.FC<{
  music: NonNullable<EditJson["music"]>;
  captions: OutCaption[];
}> = ({ music, captions }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const levels = React.useMemo(() => {
    const level = new Array<number>(durationInFrames).fill(1);
    for (const c of captions) {
      const from = Math.floor(((c.startMs - MUSIC_HOLD_MS / 2) * fps) / 1000);
      const to = Math.ceil(((c.endMs + MUSIC_HOLD_MS / 2) * fps) / 1000);
      for (
        let f = Math.max(0, TALK_START_FRAME + from);
        f < Math.min(durationInFrames, TALK_START_FRAME + to);
        f++
      )
        level[f] = MUSIC_DUCK;
    }
    const step = (1 - MUSIC_DUCK) / MUSIC_RAMP_FRAMES;
    for (let f = 1; f < level.length; f++)
      level[f] = Math.min(level[f], level[f - 1] + step);
    for (let f = level.length - 2; f >= 0; f--)
      level[f] = Math.min(level[f], level[f + 1] + step);
    return level;
  }, [captions, fps, durationInFrames]);
  const volume = music.volume ?? MUSIC_VOLUME;
  return (
    <Audio
      src={staticFile(music.file)}
      loop
      // The volume curve follows the video, not each pass through the track.
      loopVolumeCurveBehavior="extend"
      volume={(f) =>
        volume *
        (levels[f] ?? 1) *
        interpolate(
          f,
          [
            0,
            MUSIC_FADE_IN_FRAMES,
            durationInFrames - MUSIC_FADE_OUT_FRAMES,
            durationInFrames,
          ],
          [0, 1, 1, 0],
          clamp,
        )
      }
    />
  );
};

export const MortgageReel: React.FC<MortgageReelProps> = ({ slug, reel }) => {
  useReelFont();
  if (!reel) throw new Error("MortgageReel: calculateMetadata did not run.");
  const { edit, timeline } = reel;
  const src = staticFile(`videos/${slug}/source.mp4`);
  const keywords = [...KEYWORDS, ...(edit.keywords ?? [])];
  const talk = timeline.talkFrames;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={COVER_FRAMES}>
          <Cover
            src={src}
            coverFrame={Math.round(
              ((edit.coverFrameMs ?? DEFAULT_COVER_FRAME_MS) * FPS) / 1000,
            )}
            title={edit.title}
            subtitle={edit.subtitle ?? DEFAULT_SUBTITLE}
            keywords={keywords}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: COVER_TRANSITION_FRAMES })}
        />
        {timeline.segments.map((seg, i) => (
          <React.Fragment key={seg.srcFrom}>
            <TransitionSeries.Sequence durationInFrames={seg.outDuration}>
              <TalkSegment seg={seg} index={i} src={src} look={edit.look} />
            </TransitionSeries.Sequence>
            {seg.transitionAfter ? (
              <TransitionSeries.Transition
                presentation={presentation(seg.transitionAfter)}
                timing={linearTiming({
                  durationInFrames: CHAPTER_TRANSITION_FRAMES,
                })}
              />
            ) : null}
          </React.Fragment>
        ))}
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: OUTRO_TRANSITION,
          })}
        />
        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <Outro question={edit.cta?.question ?? DEFAULT_CTA_QUESTION} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: COMPLIANCE_TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={COMPLIANCE_FRAMES}>
          <ComplianceCard compliance={edit.compliance} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {edit.music ? (
        <Music music={edit.music} captions={timeline.captions} />
      ) : null}

      <Sequence
        from={TALK_START_FRAME}
        durationInFrames={talk - OUTRO_TRANSITION}
        layout="none"
      >
        <MotionTrack reel={reel} />
        <Chrome talkFrames={talk} />
        <StatCards reel={reel} />
        <Chapters reel={reel} />
        <Captions reel={reel} keywords={keywords} />
      </Sequence>
      {edit.hook ? (
        <Sequence from={TALK_START_FRAME} durationInFrames={HOOK_FRAMES}>
          <MoneyRain />
          <HookTitle hook={edit.hook} />
          <HookBurst />
          <HookSfx />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

export const mortgageReelComposition = {
  id: "MortgageReel",
  width: WIDTH,
  height: HEIGHT,
  fps: FPS,
  durationInFrames: 300, // replaced by calculateMortgageReelMetadata
} as const;
