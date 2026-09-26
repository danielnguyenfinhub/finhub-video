// useWindowedAudioData, but the frame waits until the data covers it.
// @remotion/media-utils 4.0.527 holds the frame only while NO window is loaded
// (use-windowed-audio-data.js:280-297): once the previous or next window is in,
// the frame renders without the current one and draws a flat line (see
// docs/BUG-remotion-media-utils-flat-waveform.md). Here the frame is held until
// every window the hook wants for this frame (previous, current, next) is in,
// so each frame draws the same contiguous data on every run.
import { useWindowedAudioData } from "@remotion/media-utils";
import { useLayoutEffect } from "react";
import { useDelayRender } from "remotion";

type Args = Parameters<typeof useWindowedAudioData>[0];

export const useCoveredAudioData = (args: Args) => {
  const result = useWindowedAudioData(args);
  const { delayRender, continueRender } = useDelayRender();
  const { audioData } = result;
  const time = args.frame / args.fps;
  const current = Math.floor(time / args.windowInSeconds);
  // The hook names the windows it combined in resultId: "<src>-windows-1,2,3".
  const loaded = audioData
    ? audioData.resultId.slice(audioData.resultId.lastIndexOf("-windows-") + 9)
    : null;
  const last = audioData
    ? Math.floor(audioData.durationInSeconds / args.windowInSeconds - 1e-12)
    : 0;
  const wanted = [current - 1, current, current + 1]
    .filter((i) => i >= 0 && i <= last)
    .join(",");
  const covered = loaded === wanted;
  const label = `Audio windows ${wanted} for frame ${args.frame} (${time.toFixed(2)}s) of "${args.src}"`;
  useLayoutEffect(() => {
    // No data at all: the hook holds the frame itself (or it is past the end).
    if (covered || audioData === null) return;
    const handle = delayRender(label);
    return () => continueRender(handle);
  }, [covered, audioData, label, delayRender, continueRender]);
  return result;
};
