// Up to nine clips in a grid (2 -> 1x2, 3-4 -> 2x2, 5+ -> 3 columns), each
// rounded with an optional name tag. Clips are muted; add audio separately.
import type React from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { brand } from "../brand/theme";
import { FONT } from "../mortgage/style";

export const VideoGrid: React.FC<{ clips: { src: string; title?: string }[]; gap?: number }> = ({ clips, gap = 16 }) => {
  const columns = clips.length <= 1 ? 1 : clips.length <= 4 ? 2 : 3;
  return (
    <AbsoluteFill
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridAutoRows: "1fr",
        gap,
        padding: gap,
        boxSizing: "border-box",
        backgroundColor: brand.background,
      }}
    >
      {clips.map((c, i) => (
        <div key={`${c.src}${i}`} style={{ position: "relative", borderRadius: 16, overflow: "hidden" }}>
          <OffthreadVideo src={c.src} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {c.title ? (
            <div style={{ position: "absolute", left: 12, bottom: 12, background: "rgba(11,31,61,0.85)", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 28, padding: "6px 14px", borderRadius: 8 }}>
              {c.title}
            </div>
          ) : null}
        </div>
      ))}
    </AbsoluteFill>
  );
};
