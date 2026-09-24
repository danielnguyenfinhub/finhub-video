// Marks a review copy: a diagonal "draft" watermark and a burnt-in timecode
// (MM:SS:FF), so feedback can point at an exact frame and the copy can never be
// mistaken for the approved video.
import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const pad = (n: number) => String(n).padStart(2, "0");

export const ReviewStamp: React.FC<{ text?: string }> = ({ text = "BẢN NHÁP · DRAFT · CHƯA DUYỆT" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.floor(frame / fps);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: "rotate(-30deg)", opacity: 0.18 }}>
        <span style={{ color: "#fff", fontSize: 72, fontWeight: 900, fontFamily: "monospace", letterSpacing: 6, whiteSpace: "nowrap", textShadow: "0 0 6px #000" }}>{text}</span>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 24, left: 24, background: "rgba(0,0,0,0.75)", color: "#4ade80", fontFamily: "monospace", fontSize: 30, padding: "6px 14px", borderRadius: 6 }}>
        {pad(Math.floor(s / 60))}:{pad(s % 60)}:{pad(frame % fps)} · f{frame}
      </div>
    </AbsoluteFill>
  );
};
