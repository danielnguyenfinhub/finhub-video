import {
  canUseWhisperWeb,
  deleteModel,
  getAvailableModels,
  getLoadedModels,
  resampleTo16Khz,
  toCaptions,
  transcribe,
  type TranscriptionItemWithTimestamp,
  type WhisperWebModel,
} from "@remotion/whisper-web";
import {useEffect, useState} from "react";
import {AbsoluteFill, staticFile, useDelayRender} from "remotion";
import {palette, gradientBg} from "./palette";
import {poppins} from "./font";

type Row = {label: string; value: string};

const word = (text: string, from: number, to: number): TranscriptionItemWithTimestamp["tokens"][number] => ({
  text,
  t_dtw: -1,
  id: 0,
  p: 0.95,
  offsets: {from, to},
  timestamps: {from: "", to: ""},
});

// The shape transcribe() returns, hand-built so toCaptions() runs without a
// model: one segment, three Vietnamese words.
const sampleOutput: TranscriptionItemWithTimestamp[] = [
  {
    text: " Lãi suất thả nổi",
    offsets: {from: 0, to: 1400},
    timestamps: {from: "00:00:00,000", to: "00:00:01,400"},
    tokens: [word(" Lãi", 0, 300), word(" suất", 300, 650), word(" thả", 650, 1000), word(" nổi", 1000, 1400)],
  },
];

// Demonstrates: @remotion/whisper-web, Whisper.cpp compiled to WebAssembly.
// Remotion marks it experimental and recommends @remotion/whisper-webgpu
// (BrowserTranscriptionScene) instead: this one needs a cross-origin
// isolated page (SharedArrayBuffer) and downloads its model into IndexedDB.
// So, inside the render: canUseWhisperWeb() for the three multilingual
// models (the .en ones only know English, so never for Vietnamese),
// getAvailableModels() with sizes, getLoadedModels(), deleteModel() on a
// model that isn't downloaded (a no-op, so a render never deletes one),
// resampleTo16Khz() on sample-tone.wav (a real Web Audio decode) and
// toCaptions() on a hand-built result. transcribe() runs only when the page
// is isolated and 'tiny' is already downloaded (downloadWhisperModel() is
// for an app page, not a render); here neither holds.
export const WhisperWebScene: React.FC = () => {
  const {delayRender, continueRender} = useDelayRender();
  const [handle] = useState(() => delayRender("whisper-web checks", {timeoutInMilliseconds: 25000}));
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const run = async () => {
      const models: WhisperWebModel[] = ["tiny", "base", "small"];
      const support = await Promise.all(models.map((m) => canUseWhisperWeb(m)));
      const loaded = await getLoadedModels();
      const notLoaded = getAvailableModels().find((m) => !loaded.includes(m.name));
      if (notLoaded) {
        await deleteModel(notLoaded.name);
      }
      const blob = await (await fetch(staticFile("sample-tone.wav"))).blob();
      const waveform = await resampleTo16Khz({file: blob, logLevel: "error"});
      const {captions} = toCaptions({whisperWebOutput: sampleOutput});

      const next: Row[] = [
        ...models.map((m, i) => ({
          label: `canUseWhisperWeb('${m}')`,
          value: support[i].supported ? "yes" : `no: ${support[i].reason}`,
        })),
        {
          label: "getAvailableModels()",
          value: getAvailableModels()
            .map((m) => `${m.name} ${Math.round(m.downloadSize / 1e6)} MB`)
            .join(", "),
        },
        {label: "getLoadedModels()", value: loaded.length > 0 ? loaded.join(", ") : "none downloaded"},
        {label: "deleteModel()", value: notLoaded ? `'${notLoaded.name}' (not downloaded: no-op)` : "skipped: every model is downloaded"},
        {label: "resampleTo16Khz(sample-tone.wav)", value: `${waveform.length} samples = ${(waveform.length / 16000).toFixed(2)} s at 16 kHz`},
        {label: "toCaptions(hand-built result)", value: captions.map((c) => `${c.text.trim()} ${c.startMs}–${c.endMs} ms`).join(" · ")},
      ];
      if (support[0].supported && loaded.includes("tiny")) {
        const {transcription} = await transcribe({channelWaveform: waveform, model: "tiny", language: "vi", logLevel: "error"});
        next.push({label: "transcribe(tiny, vi)", value: transcription.map((t) => t.text).join(" ") || "(no speech in a tone)"});
      } else {
        next.push({label: "transcribe()", value: "not run: needs an isolated page and 'tiny' downloaded"});
      }
      setRows(next);
    };
    run()
      .catch((err: Error) => setRows([{label: "whisper-web", value: `failed: ${err.message}`}]))
      .finally(() => continueRender(handle));
  }, [continueRender, handle]);

  return (
    <AbsoluteFill style={{background: gradientBg, fontFamily: poppins, color: palette.text, padding: "44px 56px"}}>
      <div style={{fontSize: 38, fontWeight: 700}}>@remotion/whisper-web</div>
      <div style={{fontSize: 20, color: palette.textDim, marginTop: 4}}>Whisper.cpp in the browser (WebAssembly), experimental</div>
      <div style={{display: "flex", flexDirection: "column", gap: 14, marginTop: 30}}>
        {rows.map((row) => (
          <div key={row.label} style={{fontSize: 22}}>
            <span style={{color: palette.textDim}}>{row.label}: </span>
            <span style={{color: palette.accent2}}>{row.value}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
