// Music beats for designs: load the audiomap scripts/analyze-beats.py wrote
// next to a track (public/music/<name>.audiomap.json) and snap moments to it,
// so a chart, a cut or a stat lands on the beat instead of just near it.
import { useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";

// The fields read here; the file carries more (events, phrases, energy).
export type AudioMap = {
  tempo: { bpm: number };
  grid: { beats_sec: number[]; downbeats_sec: number[] };
  key_moments?: { t: number; kind?: string }[];
};

/** The beat nearest `ms`, if one is within `windowMs`; otherwise `ms` unchanged. */
export const snapToBeat = (ms: number, beatsSec: number[], windowMs = 150): number => {
  let best = ms;
  let bestGap = windowMs;
  for (const b of beatsSec) {
    const gap = Math.abs(b * 1000 - ms);
    if (gap <= bestGap) {
      best = Math.round(b * 1000);
      bestGap = gap;
    }
  }
  return best;
};

/** `music/<name>.mp3` → its audiomap, or null when there is no music. */
export const useAudioMap = (musicFile?: string): AudioMap | null => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const file = musicFile?.replace(/\.[a-z0-9]+$/i, ".audiomap.json");
  const [handle] = useState(() => (file ? delayRender(`loading ${file}`) : null));
  const [map, setMap] = useState<AudioMap | null>(null);
  useEffect(() => {
    if (!file || handle === null) return;
    fetch(staticFile(file))
      .then((r) => {
        if (!r.ok) throw new Error(`${file} is missing: run scripts/analyze-beats.py on the track first.`);
        return r.json();
      })
      .then((json: AudioMap) => {
        setMap(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [file, handle, continueRender, cancelRender]);
  return map;
};
