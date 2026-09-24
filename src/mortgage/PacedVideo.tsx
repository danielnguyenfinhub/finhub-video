// One kept piece of the source at its pacing rate, with its audio: the part of
// a talk segment every design must use. Designs frame it through `style`
// (scale, mask, position) and can add a `muted` second copy (blurred backdrop,
// mirror). Volume ramps 2 frames at each edge so cuts don't click.
// Only trimBefore is set: <OffthreadVideo>'s trimAfter is applied as a timeline
// duration (trimAfter - trimBefore frames), not scaled by playbackRate, so at a
// rate below 1 it would blank the segment's tail. The enclosing sequence of
// outDuration frames ends playback at srcFrom + outDuration * rate ≈ srcTo.
import { colorCorrection } from "@remotion/effects/color-correction";
import { grayscale } from "@remotion/effects/grayscale";
import { vignette } from "@remotion/effects/vignette";
import { Video } from "@remotion/media";
import type React from "react";
import { OffthreadVideo, interpolate, type EffectsProp } from "remotion";
import type { Look } from "./schema";
import { retryVideoFetch } from "./style";
import type { Segment } from "./timeline";

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

export const PacedVideo: React.FC<{
  seg: Segment;
  src: string;
  look?: Look;
  style?: React.CSSProperties;
  muted?: boolean;
}> = ({ seg, src, look, style, muted }) => {
  const dur = seg.outDuration;
  const shared = {
    src,
    trimBefore: seg.srcFrom,
    playbackRate: seg.rate,
    muted,
    volume: (f: number) =>
      interpolate(f, [0, 2, dur - 2, dur], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      ...style,
    } as const,
  };
  // A graded video plays through @remotion/media's <Video>, whose `effects`
  // run the grade on each decoded frame. <OffthreadVideo> has no effects prop
  // and wrapping it in <HtmlInCanvas> never paints, so the render hangs.
  // No fallback to <OffthreadVideo>: that would ship the video ungraded. Its
  // objectFit prop (default "contain") overrides style.objectFit, so it is set
  // too. No onError: after delayRenderRetries the render fails, as it should.
  return look ? (
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
  );
};
