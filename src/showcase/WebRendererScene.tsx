import {
  canRenderMediaOnWeb,
  getDefaultAudioCodecForContainer,
  getDefaultContainerForCodec,
  getDefaultVideoCodecForContainer,
  getEncodableAudioCodecs,
  getEncodableVideoCodecs,
  getSupportedAudioCodecsForContainer,
  getSupportedVideoCodecsForContainer,
  isAudioOnlyContainer,
  renderStillOnWeb,
} from "@remotion/web-renderer";
import {useEffect, useState} from "react";
import {AbsoluteFill, Img, useDelayRender} from "remotion";
import {palette, gradientBg} from "./palette";
import {poppins} from "./font";

type Row = {label: string; value: string};

// The frame renderStillOnWeb() draws: plain boxes and text, all within the
// CSS the web renderer emulates (see its limitations page).
const Card: React.FC = () => (
  <AbsoluteFill style={{background: "linear-gradient(135deg, #6366f1, #22d3ee)", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif"}}>
    <div style={{fontSize: 64, fontWeight: 800, color: "#fff"}}>4,1 TỶ ĐÔ</div>
    <div style={{fontSize: 26, color: "#fff", marginTop: 10, border: "3px solid #fff", borderRadius: 16, padding: "6px 18px"}}>drawn by renderStillOnWeb()</div>
  </AbsoluteFill>
);

// One renderStillOnWeb() per page, not per frame: every client-side render
// sends Remotion a telemetry event, and each frame shows the same still.
let cardUrl: Promise<string> | null = null;
const renderCardOnce = () => {
  cardUrl ??= renderStillOnWeb({
    composition: {id: "web-renderer-card", component: Card, width: 640, height: 360, fps: 30, durationInFrames: 1},
    frame: 0,
    isProduction: false,
    logLevel: "error",
  }).then((result) => result.url({format: "png"}));
  return cardUrl;
};

// Demonstrates: @remotion/web-renderer, rendering in the browser with
// WebCodecs instead of the server. Rendering a whole video that way belongs
// in a page, not a composition (see player-demo, "Render in the browser").
// Here, inside the render: the synchronous container/codec tables
// (getSupported*CodecsForContainer, getDefault*, isAudioOnlyContainer), what
// this browser can actually encode (getEncodable*Codecs), a
// canRenderMediaOnWeb() check for a 1280x720 MP4, and a real
// renderStillOnWeb() of <Card>, shown as the image on the right.
// isProduction: false marks it as a development render in the telemetry
// ping every client-side render sends (docs/telemetry).
export const WebRendererScene: React.FC = () => {
  const {delayRender, continueRender} = useDelayRender();
  const [handle] = useState(() => delayRender("web-renderer checks", {timeoutInMilliseconds: 25000}));
  const [rows, setRows] = useState<Row[]>([]);
  const [still, setStill] = useState<string | null>(null);

  useEffect(() => {
    const syncRows: Row[] = [
      {label: "getSupportedVideoCodecsForContainer('mp4')", value: getSupportedVideoCodecsForContainer("mp4").join(", ")},
      {label: "getSupportedAudioCodecsForContainer('webm')", value: getSupportedAudioCodecsForContainer("webm").join(", ")},
      {
        label: "getDefault…ForContainer('webm')",
        value: `video ${getDefaultVideoCodecForContainer("webm")}, audio ${getDefaultAudioCodecForContainer("webm")}`,
      },
      {label: "getDefaultContainerForCodec('vp9')", value: getDefaultContainerForCodec("vp9")},
      {label: "isAudioOnlyContainer('mp3' / 'mp4')", value: `${isAudioOnlyContainer("mp3")} / ${isAudioOnlyContainer("mp4")}`},
    ];
    const run = async () => {
      const [mp4Video, webmVideo, mp4Audio, check] = await Promise.all([
        getEncodableVideoCodecs("mp4"),
        getEncodableVideoCodecs("webm"),
        getEncodableAudioCodecs("mp4"),
        canRenderMediaOnWeb({container: "mp4", width: 1280, height: 720}),
      ]);
      const liveRows: Row[] = [
        {label: "getEncodableVideoCodecs('mp4')", value: mp4Video.join(", ") || "none"},
        {label: "getEncodableVideoCodecs('webm')", value: webmVideo.join(", ") || "none"},
        {label: "getEncodableAudioCodecs('mp4')", value: mp4Audio.join(", ") || "none"},
        {
          label: "canRenderMediaOnWeb(1280×720 MP4)",
          value: check.canRender ? `yes: ${check.resolvedVideoCodec} + ${check.resolvedAudioCodec}` : `no: ${check.issues.map((i) => i.type).join(", ")}`,
        },
      ];
      setRows([...syncRows, ...liveRows]);
      try {
        setStill(await renderCardOnce());
      } catch (err) {
        setRows((r) => [...r, {label: "renderStillOnWeb()", value: `failed: ${(err as Error).message}`}]);
      }
    };
    run()
      .catch((err: Error) => setRows([...syncRows, {label: "web-renderer", value: `failed: ${err.message}`}]))
      .finally(() => continueRender(handle));
  }, [continueRender, handle]);

  return (
    <AbsoluteFill style={{background: gradientBg, fontFamily: poppins, color: palette.text, padding: "44px 56px"}}>
      <div style={{fontSize: 38, fontWeight: 700}}>@remotion/web-renderer</div>
      <div style={{fontSize: 20, color: palette.textDim, marginTop: 4}}>Render in the browser with WebCodecs, no server</div>
      <div style={{display: "flex", gap: 40, marginTop: 30}}>
        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 14}}>
          {rows.map((row) => (
            <div key={row.label} style={{fontSize: 22}}>
              <span style={{color: palette.textDim}}>{row.label}: </span>
              <span style={{color: palette.accent2}}>{row.value}</span>
            </div>
          ))}
        </div>
        <div style={{width: 420}}>{still ? <Img src={still} style={{width: 420, borderRadius: 12, border: `2px solid ${palette.textDim}`}} /> : null}</div>
      </div>
    </AbsoluteFill>
  );
};
