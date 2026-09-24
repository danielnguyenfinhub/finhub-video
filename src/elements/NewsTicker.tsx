// A news-style ticker that scrolls forever without a gap: the text is measured
// with measureText (not guessed from its length) once the brand font has
// loaded, then laid out twice so the second copy follows the first.
import { measureText } from "@remotion/layout-utils";
import type React from "react";
import { useEffect, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useDelayRender } from "remotion";
import { brand } from "../brand/theme";
import { FONT, reelFontReady } from "../mortgage/style";

const FONT_SIZE = 40;
const WEIGHT = 800; // a weight reelFontReady() loads, so the measure is exact
const SEPARATOR = "   •   ";

export const NewsTicker: React.FC<{ items: string[]; label?: string; pxPerFrame?: number }> = ({
  items,
  label = "TIN NHANH",
  pxPerFrame = 4,
}) => {
  const frame = useCurrentFrame();
  const text = items.join(SEPARATOR) + SEPARATOR;
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("measuring ticker text"));
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    reelFontReady()
      .then(() => {
        setWidth(measureText({ text, fontFamily: FONT, fontSize: FONT_SIZE, fontWeight: WEIGHT, validateFontIsLoaded: true }).width);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [text, handle, continueRender, cancelRender]);
  const x = width ? -((frame * pxPerFrame) % width) : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end" }}>
      <div style={{ display: "flex", height: 84, background: brand.background, borderTop: `4px solid ${brand.accent}`, fontFamily: FONT, fontSize: FONT_SIZE, fontWeight: WEIGHT, color: "#fff", alignItems: "center" }}>
        <div style={{ background: brand.accent, color: brand.background, fontWeight: 900, height: "100%", display: "flex", alignItems: "center", padding: "0 26px", zIndex: 1 }}>{label}</div>
        <div style={{ overflow: "hidden", flex: 1, whiteSpace: "pre" }}>
          <div style={{ transform: `translateX(${x}px)` }}>{text + text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
