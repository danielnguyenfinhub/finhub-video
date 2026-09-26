// Combination chart: revenue bars grow up one after another (each starts before
// the previous settles), then a glowing conversion-rate line draws behind them
// with a pulsing dot at its tip. Pure SVG; all motion from useCurrentFrame().
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import type React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { poppins } from "../font";

type Month = { month: string; revenue: number; conversion: number };

const DATA: Month[] = [
  { month: "Jan", revenue: 8, conversion: 2.1 },
  { month: "Feb", revenue: 12, conversion: 2.8 },
  { month: "Mar", revenue: 15, conversion: 3.2 },
  { month: "Apr", revenue: 11, conversion: 2.9 },
  { month: "May", revenue: 18, conversion: 3.8 },
  { month: "Jun", revenue: 22, conversion: 4.2 },
];

const BG = "#1A1A2E";
const BAR = "#2E3358";
const BLUE = "#0B84F3";
const GREY = "#8A8FA8";
const AXIS = "rgba(255,255,255,0.18)";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Plot area in composition pixels.
const L = 200, R = 1720, T = 220, B = 900;
const REV_MAX = 25; // $K
const CONV_MIN = 1.5, CONV_MAX = 4.5; // %
const SLOT = (R - L) / DATA.length;
const BAR_W = SLOT * 0.6;
const BAR_START = 8, BAR_STAGGER = 9, BAR_FRAMES = 26; // stagger < duration = overlap
const LINE_START = 40, LINE_FRAMES = 55; // settles ~frame 95

const cx = (i: number) => L + SLOT * (i + 0.5);
const yRev = (v: number) => B - (v / REV_MAX) * (B - T);
const yConv = (v: number) => B - ((v - CONV_MIN) / (CONV_MAX - CONV_MIN)) * (B - T);

// Bar with rounded top corners only.
const barPath = (x: number, top: number, w: number, r = 10) => {
  const rr = Math.min(r, (B - top) / 2, w / 2);
  return `M ${x} ${B} L ${x} ${top + rr} Q ${x} ${top} ${x + rr} ${top} L ${x + w - rr} ${top} Q ${x + w} ${top} ${x + w} ${top + rr} L ${x + w} ${B} Z`;
};

const LINE = `M ${DATA.map((d, i) => `${cx(i)} ${yConv(d.conversion)}`).join(" L ")}`;
const LINE_LEN = getLength(LINE);

export const BarLineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], clamp);
  const lineP = spring({ frame: frame - LINE_START, fps, durationInFrames: LINE_FRAMES, config: { damping: 200 } });
  const { strokeDasharray, strokeDashoffset } = evolvePath(lineP, LINE);
  const tip = getPointAtLength(LINE, Math.max(0.001, lineP * LINE_LEN));
  const pulse = (frame % 30) / 30; // ponytail: fixed 1s pulse loop, not data-driven
  const text = { fontFamily: poppins, fontSize: 26, fill: GREY };

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={1920} height={1080}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity={fadeIn}>
          <text x={960} y={110} textAnchor="middle" fontFamily={poppins} fontSize={52} fontWeight={700} fill="#fff">
            Monthly Sales Performance
          </text>
          {/* Legend, top right */}
          <rect x={1330} y={150} width={24} height={24} rx={4} fill={BAR} stroke="rgba(255,255,255,0.25)" />
          <text {...text} x={1366} y={171} fill="#D5D7E3">Revenue</text>
          <line x1={1490} x2={1530} y1={162} y2={162} stroke={BLUE} strokeWidth={5} strokeLinecap="round" />
          <text {...text} x={1542} y={171} fill="#D5D7E3">Conversion Rate</text>

          {/* Axes */}
          <line x1={L} x2={R} y1={B} y2={B} stroke={AXIS} strokeWidth={2} />
          <line x1={L} x2={L} y1={T} y2={B} stroke={AXIS} strokeWidth={2} />
          <line x1={R} x2={R} y1={T} y2={B} stroke={BLUE} strokeOpacity={0.6} strokeWidth={2} />
          {[0, 5, 10, 15, 20, 25].map((v) => (
            <text key={v} {...text} x={L - 20} y={yRev(v) + 9} textAnchor="end">${v}K</text>
          ))}
          {[1.5, 2.5, 3.5, 4.5].map((v) => (
            <text key={v} {...text} x={R + 20} y={yConv(v) + 9} fill={BLUE}>{v.toFixed(1)}%</text>
          ))}
          {DATA.map((d, i) => (
            <text key={d.month} {...text} x={cx(i)} y={B + 50} textAnchor="middle">{d.month}</text>
          ))}
        </g>

        {DATA.map((d, i) => {
          const g = spring({ frame: frame - (BAR_START + i * BAR_STAGGER), fps, durationInFrames: BAR_FRAMES, config: { damping: 14, stiffness: 120 } });
          if (g <= 0) return null;
          return <path key={d.month} d={barPath(cx(i) - BAR_W / 2, yRev(d.revenue * g), BAR_W)} fill={BAR} />;
        })}

        {lineP > 0 && tip ? (
          <g>
            <path d={LINE} fill="none" stroke={BLUE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} filter="url(#glow)" />
            <circle cx={tip.x} cy={tip.y} r={14 + pulse * 18} fill="none" stroke={BLUE} strokeWidth={3} opacity={1 - pulse} />
            <circle cx={tip.x} cy={tip.y} r={16} fill="none" stroke={BLUE} strokeOpacity={0.5} strokeWidth={3} />
            <circle cx={tip.x} cy={tip.y} r={9} fill={BLUE} filter="url(#glow)" />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
