// "classic": the MortgageReel look every video had before designs existed.
import type React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Design, OverlayProps, TalkProps } from "../../mortgage/design";
import { PacedVideo } from "../../mortgage/PacedVideo";
import { chapterTransition } from "../../mortgage/transitions";
import { Captions, Chapters, StatCards } from "./Captions";
import { MotionTrack } from "./Cues";
import {
  Chrome,
  Cover,
  HookBurst,
  HookSfx,
  HookTitle,
  MoneyRain,
} from "./Frame";
import { Outro } from "./Outro";

const HOOK_FRAMES = 105;

// The first segment eases in from a 1.3 zoom; alternate segments sit
// punched-in on the face, so every jump cut reads as an intentional zoom-cut,
// and each cut lands with a small spring "punch" and a slow 2% drift.
const Talk: React.FC<TalkProps> = ({
  seg,
  index,
  src,
  look,
  foreground,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
  const drift = interpolate(frame, [0, seg.outDuration], [0, 0.02]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <PacedVideo
        seg={seg}
        src={src}
        look={look}
        foreground={foreground}
        style={{
          transform: `scale(${base + punch + drift})`,
          transformOrigin: "50% 30%",
        }}
      />
    </AbsoluteFill>
  );
};

const Overlay: React.FC<OverlayProps> = ({ reel, keywords, talkFrames }) => (
  <>
    <MotionTrack reel={reel} />
    <Chrome talkFrames={talkFrames} />
    <StatCards reel={reel} />
    <Chapters reel={reel} />
    <Captions reel={reel} keywords={keywords} />
    {reel.edit.hook ? (
      <Sequence durationInFrames={HOOK_FRAMES}>
        <MoneyRain />
        <HookTitle hook={reel.edit.hook} />
        <HookBurst />
        <HookSfx />
      </Sequence>
    ) : null}
  </>
);

export const classic: Design = {
  id: "classic",
  Cover,
  Talk,
  Overlay,
  Outro,
  chapterTransition,
  copy: [
    "PHẦN",
    "VS",
    "Các ngân hàng Finance Hub làm việc cùng",
    "Daniel Nguyen",
    "Điện thoại",
    "Email",
    "Website",
  ],
};
