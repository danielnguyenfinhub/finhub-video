// edit.json's captions in "chatstory": a white rounded box per line — same
// approach as classic/BoxCaption.tsx (createRoundedTextBox, measured with the
// real font via captionPages()) — but keywords/numbers light on a pale amber
// halo instead of an underline, and the currently-spoken word turns
// brand.primary. The halo is a box-shadow spread, not padding, so it never
// changes the measured line width the box was sized for.
import type { TikTokPage } from "@remotion/captions";
import { measureText } from "@remotion/layout-utils";
import { createRoundedTextBox } from "@remotion/rounded-text-box";
import type React from "react";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { brand } from "../../brand/theme";
import { captionPages } from "../../mortgage/captionPages";
import { FONT, emphasised, enter, reelFontReady } from "../../mortgage/style";
import type { Reel } from "../../mortgage/schema";

const SIZE = 62;
const WEIGHT = 800;
const LINE_HEIGHT = 1.3;
const PAD = 26;
const RADIUS = 18;
const MAX_LINE = 860;
// Pale tint of brand.accent, for keyword emphasis (not underline).
const AMBER_HIGHLIGHT = "#FFE3A8";

const lineText = (tokens: TikTokPage["tokens"]) =>
  tokens.map((t, j) => (j === 0 ? t.text.trimStart() : t.text)).join("");

const measure = (text: string) =>
  measureText({
    text,
    fontFamily: FONT,
    fontSize: SIZE,
    fontWeight: WEIGHT,
    additionalStyles: { lineHeight: LINE_HEIGHT },
    validateFontIsLoaded: true,
  });

const ChatCaptionPage: React.FC<{ page: TikTokPage; keywords: string[] }> = ({
  page,
  keywords,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() =>
    delayRender("measuring chatstory caption box"),
  );
  const [ready, setReady] = useState(false);
  useEffect(() => {
    reelFontReady()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch(cancelRender);
  }, [handle, continueRender, cancelRender]);
  if (!ready) return null;

  const lines: TikTokPage["tokens"][] = [[]];
  for (const t of page.tokens) {
    const current = lines[lines.length - 1];
    if (current.length && measure(lineText([...current, t])).width > MAX_LINE)
      lines.push([t]);
    else current.push(t);
  }
  const box = createRoundedTextBox({
    textMeasurements: lines.map((l) => measure(lineText(l))),
    textAlign: "center",
    horizontalPadding: PAD,
    borderRadius: RADIUS,
  });
  const nowMs = page.startMs + (frame / fps) * 1000;
  const hit = emphasised(
    page.tokens.map((t) => t.text),
    keywords,
  );
  const p = enter(frame, fps);
  // A small bubble "pop" on every page (Daniel's 1.5-3s rule): a low-damping
  // spring overshoots past 1 before settling, on top of the entrance scale.
  const pop = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.5 },
  });
  const popScale = interpolate(pop, [0, 1], [0.9, 1]);
  const firstIndex = lines.map((_, li) =>
    lines.slice(0, li).reduce((n, l) => n + l.length, 0),
  );
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-start", alignItems: "center", top: 1300 }}
    >
      <div
        style={{
          position: "relative",
          width: box.boundingBox.width,
          height: box.boundingBox.height,
          transform: `scale(${popScale}) translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
          opacity: p,
          filter: "drop-shadow(0 10px 24px rgba(11, 31, 61, 0.3))",
        }}
      >
        <svg
          viewBox={box.boundingBox.viewBox}
          style={{
            position: "absolute",
            inset: 0,
            width: box.boundingBox.width,
            height: box.boundingBox.height,
            overflow: "visible",
          }}
        >
          <path fill="#fff" d={box.d} />
        </svg>
        <div style={{ position: "relative" }}>
          {lines.map((line, li) => (
            <div
              key={li}
              style={{
                paddingInline: PAD,
                fontFamily: FONT,
                fontSize: SIZE,
                fontWeight: WEIGHT,
                lineHeight: LINE_HEIGHT,
                textAlign: "center",
                whiteSpace: "pre",
                color: brand.textOnCard,
              }}
            >
              {line.map((t, j) => {
                const active = nowMs >= t.fromMs && nowMs < t.toMs;
                const isKey = hit.has(firstIndex[li] + j);
                return (
                  <span
                    key={t.fromMs}
                    style={{
                      color: isKey || active ? brand.primary : undefined,
                      opacity: nowMs >= t.fromMs ? 1 : 0.5,
                      borderRadius: isKey ? 6 : undefined,
                      background: isKey ? AMBER_HIGHLIGHT : undefined,
                      boxShadow: isKey
                        ? `0 0 0 6px ${AMBER_HIGHLIGHT}`
                        : undefined,
                    }}
                  >
                    {j === 0 ? t.text.trimStart() : t.text}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ChatCaptions: React.FC<{ reel: Reel; keywords: string[] }> = ({
  reel,
  keywords,
}) => {
  const { fps } = useVideoConfig();
  const pages = captionPages({
    captions: reel.timeline.captions,
    combineWithinMs: 900,
    breakOnSilenceAfterMs: 350,
  });
  return (
    <>
      {pages.map((page, i) => {
        const from = Math.round((page.startMs / 1000) * fps);
        const nextStart = pages[i + 1]
          ? Math.round((pages[i + 1].startMs / 1000) * fps)
          : Infinity;
        const dur = Math.min(
          Math.round(((page.durationMs + 400) / 1000) * fps),
          nextStart - from,
        );
        if (dur <= 0) return null;
        return (
          <Sequence
            key={page.startMs}
            from={from}
            durationInFrames={dur}
            layout="none"
          >
            <ChatCaptionPage page={page} keywords={keywords} />
          </Sequence>
        );
      })}
    </>
  );
};
