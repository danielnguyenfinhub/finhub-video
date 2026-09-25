// "chatstory" — Chat Story: Hỏi đáp. A question clients often ask, answered
// warmly, told as an iMessage-style exchange over a soft ice-blue paper
// backdrop. The only LIGHT template. Cues, hook and outro reuse classic's
// (already RG 234-scanned and brand-checked); everything else here is new.
import type React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Design, OverlayProps, TalkProps } from "../../mortgage/design";
import { SAFE } from "../../mortgage/golden";
import { LogoMark } from "../../mortgage/LogoMark";
import { toOutMs } from "../../mortgage/timeline";
import { PacedVideo } from "../../mortgage/PacedVideo";
import { chapterTransition } from "../../mortgage/transitions";
import { MotionTrack } from "../classic/Cues";
import { Outro } from "../classic/Outro";
import { Backdrop } from "./Backdrop";
import { ChapterBubble, HookBubbles } from "./Bubbles";
import { ChatCaptions } from "./ChatCaption";
import { Cover } from "./Cover";
import { Figures } from "./Figures";
import { Lenders } from "./Lenders";

const HOOK_FRAMES = 105;
const CHAPTER_FRAMES_S = 2.5;

// Ice-blue backdrop behind Daniel's cut-out; a gentle punch-in on each cut.
const Talk: React.FC<TalkProps> = ({
  seg,
  index,
  src,
  look,
  foreground,
  behind,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const base = seg.zoomed ? 1.08 : 1.0;
  const punch =
    index === 0
      ? 0
      : (1 - spring({ frame, fps, config: { damping: 18, stiffness: 260 } })) *
        0.04;
  return (
    <AbsoluteFill>
      <Backdrop />
      {behind}
      <PacedVideo
        seg={seg}
        src={src}
        look={look}
        foreground={foreground}
        backdrop="none"
        style={{
          transform: `scale(${base + punch})`,
          transformOrigin: "50% 30%",
        }}
      />
    </AbsoluteFill>
  );
};

const Chapters: React.FC<{ reel: OverlayProps["reel"] }> = ({ reel }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {(reel.edit.chapters ?? []).map((c, i) => {
        const at = toOutMs(reel.timeline.segments, c.atMs, fps);
        if (at === null) return null;
        const frames = Math.round(CHAPTER_FRAMES_S * fps);
        return (
          <Sequence
            key={c.atMs}
            from={Math.round((at / 1000) * fps)}
            durationInFrames={frames}
            layout="none"
          >
            <ChapterBubble index={i} title={c.title} frames={frames} />
          </Sequence>
        );
      })}
    </>
  );
};

const Overlay: React.FC<OverlayProps> = ({ reel, keywords, talkFrames }) => {
  return (
    <>
      {/* Cue panels shifted into the safe band; grain stays full-frame. */}
      <MotionTrack reel={reel} panelOffset={SAFE.top - 110} />
      <LogoMark talkFrames={talkFrames} />
      <Lenders reel={reel} />
      <Chapters reel={reel} />
      <ChatCaptions reel={reel} keywords={keywords} />
      {reel.edit.hook ? (
        <Sequence durationInFrames={HOOK_FRAMES} layout="none">
          <HookBubbles hook={reel.edit.hook} />
        </Sequence>
      ) : null}
    </>
  );
};

export const chatstory: Design = {
  id: "chatstory",
  Cover,
  Talk,
  Overlay,
  Behind: Figures,
  Outro,
  chapterTransition,
  copy: [
    "CÂU HỎI MINH HOẠ",
    "So sánh",
    "PHẦN",
    "VS",
    "Các ngân hàng Finance Hub làm việc cùng",
    "Daniel Nguyen",
    "Điện thoại",
    "Email",
    "Website",
  ],
};
