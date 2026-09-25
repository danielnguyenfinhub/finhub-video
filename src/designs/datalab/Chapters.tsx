// Chapter card: "PHẦN n" + title in light-blue mono-ish letter-spacing,
// top-left inside SAFE, with a zoom-in entrance, 2.5s.
import type React from "react";
import {
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SAFE } from "../../mortgage/golden";
import { outFrameOf, type Reel } from "../../mortgage/schema";
import { FONT } from "../../mortgage/style";
import { LIGHT_BLUE } from "./Backdrop";

const ChapterCard: React.FC<{ index: number; title: string }> = ({
  index,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 13, stiffness: 170 } });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top,
        maxWidth: SAFE.right - SAFE.left - 200,
        fontFamily: FONT,
        transformOrigin: "top left",
        transform: `scale(${interpolate(p, [0, 1], [0.5, 1])})`,
        opacity: p,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 8,
          color: LIGHT_BLUE,
          textTransform: "uppercase",
        }}
      >
        PHẦN {index + 1}
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 900,
          color: "#fff",
          marginTop: 6,
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const ChaptersLayer: React.FC<{ reel: Reel }> = ({ reel }) => {
  const { fps } = useVideoConfig();
  const outFrame = outFrameOf(reel.timeline, fps);
  return (
    <>
      {(reel.edit.chapters ?? []).map((c, i) => (
        <Sequence
          key={c.atMs}
          from={outFrame(c.atMs)}
          durationInFrames={Math.round(2.5 * fps)}
        >
          <ChapterCard index={i} title={c.title} />
        </Sequence>
      ))}
    </>
  );
};
