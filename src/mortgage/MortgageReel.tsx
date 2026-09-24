// MortgageReel: the reusable FinHub talking-head template. Per video, only
// public/videos/<slug>/{source.mp4, words.json, edit.json} change; this code
// doesn't. calculateMetadata loads the edit, enforces ASIC RG 234 on every
// on-screen string (the render FAILS rather than ship a non-compliant claim),
// builds the paced timeline and hands it to the component as props.
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { Audio } from "@remotion/media";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { z } from "zod";
import { DEFAULT_DESIGN, getDesign } from "../designs";
import { assertCompliantCopy, assertRateGate } from "./compliance";
import { ComplianceCard } from "./EndCards";
import {
  DEFAULT_CTA_QUESTION,
  DEFAULT_SUBTITLE,
  onScreenCopy,
  parseEdit,
  type EditJson,
  type Reel,
} from "./schema";
import { KEYWORDS, clamp, useReelFont } from "./style";
import {
  CHAPTER_TRANSITION_FRAMES,
  COVER_FRAMES,
  COVER_TRANSITION_FRAMES,
  TALK_START_FRAME,
  buildTimeline,
  type OutCaption,
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

// edit.json + words.json -> the reel and its length. Validates the edit,
// enforces ASIC RG 234 and the rate gate (throws, so a render FAILS rather
// than ship a non-compliant claim). Shared by calculateMetadata and the
// review page (review/), which previews unsaved edits in a <Player>.
export const buildReel = (
  editJson: unknown,
  words: unknown,
  slug: string,
): { reel: Reel; durationInFrames: number } => {
  const edit = parseEdit(editJson, slug);
  // Throws for an unknown name, listing the designs there are.
  const design = getDesign(edit.design ?? DEFAULT_DESIGN);
  if (!Array.isArray(words) || words.length === 0)
    throw new Error(`public/videos/${slug}/words.json has no words.`);
  // Throws "RG 234: restricted terminology found".
  assertCompliantCopy(
    { ...onScreenCopy(edit), [`design:${design.id}`]: design.copy },
    edit.exemptions ?? [],
  );
  const rate = edit.compliance?.advertisedRate;
  if (rate)
    assertRateGate(rate.rateFigure, rate.comparisonRate, rate.ratesAsAt);
  const timeline = buildTimeline(words as Word[], edit, FPS);
  return {
    reel: { edit, timeline },
    durationInFrames:
      TALK_START_FRAME +
      timeline.talkFrames +
      OUTRO_FRAMES -
      OUTRO_TRANSITION +
      COMPLIANCE_FRAMES -
      COMPLIANCE_TRANSITION,
  };
};

export const calculateMortgageReelMetadata: CalculateMetadataFunction<
  MortgageReelProps
> = async ({ props }) => {
  const { slug } = props;
  const [editJson, words] = await Promise.all([
    fetchJson(slug, "edit.json"),
    fetchJson(slug, "words.json"),
  ]);
  const { reel, durationInFrames } = buildReel(editJson, words, slug);
  return { durationInFrames, defaultOutName: slug, props: { slug, reel } };
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
  const design = getDesign(edit.design ?? DEFAULT_DESIGN);
  const src = staticFile(`videos/${slug}/source.mp4`);
  const foreground = edit.background
    ? staticFile(`videos/${slug}/foreground.webm`)
    : undefined;
  const keywords = [...KEYWORDS, ...(edit.keywords ?? [])];
  const talk = timeline.talkFrames;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={COVER_FRAMES}>
          <design.Cover
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
              <design.Talk
                seg={seg}
                index={i}
                src={src}
                look={edit.look}
                foreground={foreground}
              />
            </TransitionSeries.Sequence>
            {seg.transitionAfter ? (
              <TransitionSeries.Transition
                presentation={design.chapterTransition(seg.transitionAfter)}
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
          <design.Outro question={edit.cta?.question ?? DEFAULT_CTA_QUESTION} />
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
        <design.Overlay reel={reel} keywords={keywords} talkFrames={talk} />
      </Sequence>
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
