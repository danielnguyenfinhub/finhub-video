// Built from the Remotion prompt gallery: https://www.remotion.dev/prompts/real-estate-investing
// 9:16 luxury real-estate motion package (hook, blueprint + counters, location
// lower-third, For Sale sign, price reveal, CTA) in FinHub navy/amber with
// Be Vietnam Pro. No footage: the property is a drawn floor plan. Every figure
// is synthetic and labelled "Illustrative only". All motion is frame-driven.
import { evolvePath } from "@remotion/paths";
import type React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useTyDoFont } from "../../brand/font";
import { brand } from "../../brand/theme";

const GOLD = brand.accent;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

// Synthetic listing. Suburb is real, the property and every number are not.
const LISTING = { suburb: "Parramatta", state: "NSW 2150", price: 1_150_000, depositPct: 0.2 };
const COUNTERS = [
  { value: 3, label: "Bed" },
  { value: 2, label: "Bath" },
  { value: 2, label: "Car" },
  { value: 450, label: "m² land" },
];
const CUTS = [75, 210, 330, 480]; // scene boundaries: light leak + flash land here

// Word-by-word mask reveal: each word rises out of its own clipped line box.
const WordReveal: React.FC<{ text: string; start: number; size: number; color?: string; stagger?: number }> = ({ text, start, size, color = brand.text, stagger = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.28 }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - start - i * stagger, fps, config: { damping: 18, stiffness: 140 } });
        return (
          <span key={i} style={{ overflow: "hidden", display: "inline-block", paddingBottom: size * 0.08 }}>
            <span style={{ display: "inline-block", fontSize: size, fontWeight: 900, color, lineHeight: 1.1, translate: `0 ${(1 - p) * 110}%`, textShadow: "0 6px 30px rgba(0,0,0,0.45)" }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const Tag: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <div style={{ opacity, alignSelf: "center", border: `2px solid ${GOLD}`, color: GOLD, borderRadius: 999, padding: "10px 28px", fontSize: 30, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase" }}>{children}</div>
);

// Gold corner brackets framing the 4:5-safe area; they snap in, then breathe.
const Brackets: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 14 } });
  const inset = 70 + (1 - p) * 60 + Math.sin(frame / 20) * 4;
  const arm = 110;
  const corner = (top: boolean, left: boolean) => ({
    position: "absolute" as const,
    width: arm,
    height: arm,
    [top ? "top" : "bottom"]: inset + 120,
    [left ? "left" : "right"]: inset,
    borderColor: GOLD,
    borderStyle: "solid",
    borderWidth: `${top ? 6 : 0}px ${left ? 0 : 6}px ${top ? 0 : 6}px ${left ? 6 : 0}px`,
    opacity: p,
  });
  return <AbsoluteFill>{[[true, true], [true, false], [false, true], [false, false]].map(([t, l], i) => <div key={i} style={corner(t, l)} />)}</AbsoluteFill>;
};

// Blueprint grid that slowly pushes in for the whole video ("slow zoom").
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.15]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, #163A6B 0%, ${brand.background} 70%)` }}>
      <AbsoluteFill style={{ scale: String(scale), opacity: 0.35, backgroundImage: "linear-gradient(rgba(120,170,255,0.25) 2px, transparent 2px), linear-gradient(90deg, rgba(120,170,255,0.25) 2px, transparent 2px), linear-gradient(rgba(120,170,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,255,0.1) 1px, transparent 1px)", backgroundSize: "180px 180px, 180px 180px, 36px 36px, 36px 36px" }} />
    </AbsoluteFill>
  );
};

// Warm light leak + white flash at each cut, film grain everywhere.
const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const leak = Math.max(...CUTS.map((c) => interpolate(frame, [c - 12, c, c + 24], [0, 0.55, 0], clamp)));
  const flash = Math.max(...CUTS.slice(1, 3).map((c) => interpolate(frame, [c - 1, c, c + 4], [0, 0.6, 0], clamp)));
  const drift = Math.sin(frame / 15) * 120;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ opacity: leak, mixBlendMode: "screen", background: `radial-gradient(circle at ${20 + drift / 20}% 15%, rgba(255,170,60,0.9), transparent 45%), radial-gradient(circle at 90% ${70 + drift / 30}%, rgba(255,110,40,0.6), transparent 40%)` }} />
      <AbsoluteFill style={{ opacity: flash, background: "#fff" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 24} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 110, gap: 40, scale: String(interpolate(frame, [0, 75], [1.08, 1])) }}>
      <Tag opacity={interpolate(frame, [0, 10], [0, 1], clamp)}>Property investing</Tag>
      <WordReveal text="Thinking about your first investment property?" start={6} size={104} />
      <div style={{ opacity: interpolate(frame, [40, 55], [0, 1], clamp), color: brand.textDim, fontSize: 44, fontWeight: 600 }}>Here's how the numbers stack up.</div>
    </AbsoluteFill>
  );
};

// Floor plan in a 800x700 box: outer walls, then rooms, drawn with evolvePath.
const WALLS = ["M 40 40 H 760 V 660 H 40 Z", "M 40 330 H 430", "M 430 40 V 660", "M 250 40 V 330", "M 430 420 H 760", "M 600 420 V 660", "M 430 230 H 620"];
const ROOMS = [
  { x: 145, y: 190, t: "BED 1" },
  { x: 340, y: 190, t: "BED 2" },
  { x: 235, y: 500, t: "LIVING" },
  { x: 595, y: 140, t: "KITCHEN" },
  { x: 595, y: 330, t: "DINING" },
  { x: 515, y: 545, t: "BED 3" },
  { x: 680, y: 545, t: "BATH" },
];

const Blueprint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Speed ramp: the plan punches in fast, then eases into a slow drift.
  const zoom = interpolate(frame, [0, 14, 135], [0.7, 1.02, 1.08], { ...clamp, easing: Easing.bezier(0.2, 0.9, 0.3, 1) });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 350, gap: 50 }}>
      <WordReveal text="3-bed house, illustrative" start={0} size={64} color={GOLD} stagger={3} />
      <svg width={880} height={770} viewBox="0 0 800 700" style={{ scale: String(zoom), filter: "drop-shadow(0 0 18px rgba(80,160,255,0.55))" }}>
        {WALLS.map((d, i) => {
          const p = interpolate(frame, [4 + i * 6, 34 + i * 6], [0, 1], clamp);
          return <path key={i} d={d} fill="none" stroke={i === 0 ? "#9CC8FF" : "#5FA2F0"} strokeWidth={i === 0 ? 10 : 6} strokeLinecap="square" {...evolvePath(p, d)} />;
        })}
        {ROOMS.map((r, i) => (
          <text key={r.t} x={r.x} y={r.y} textAnchor="middle" fill="#cfe3ff" fontSize={26} fontWeight={800} letterSpacing={3} style={{ fontFamily: brand.font }} opacity={interpolate(frame, [50 + i * 4, 60 + i * 4], [0, 1], clamp)}>
            {r.t}
          </text>
        ))}
      </svg>
      <div style={{ display: "flex", gap: 26 }}>
        {COUNTERS.map((c, i) => {
          const start = 60 + i * 8;
          const p = spring({ frame: frame - start, fps, config: { damping: 16 } });
          const n = Math.round(interpolate(frame, [start, start + 30], [0, c.value], { ...clamp, easing: Easing.out(Easing.cubic) }));
          return (
            <div key={c.label} style={{ opacity: p, translate: `0 ${(1 - p) * 60}px`, width: 205, padding: "24px 0", borderRadius: 24, background: brand.panel, border: "2px solid rgba(245,165,36,0.5)", textAlign: "center" }}>
              <div style={{ fontSize: 76, fontWeight: 900, color: brand.text, fontVariantNumeric: "tabular-nums" }}>{n}</div>
              <div style={{ fontSize: 30, fontWeight: 600, color: brand.textDim }}>{c.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Location: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame: frame - 6, fps, config: { damping: 20 } });
  const sign = spring({ frame: frame - 20, fps, config: { damping: 5, stiffness: 60 } }); // underdamped = swings
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* For Sale sign swinging on its post */}
      <div style={{ position: "absolute", top: 330, display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(frame, [16, 24], [0, 1], clamp) }}>
        <div style={{ width: 520, height: 14, background: "#d9dde6", borderRadius: 7 }} />
        <div style={{ transformOrigin: "50% 0", rotate: `${(1 - sign) * 28}deg`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 300 }}>
            <div style={{ width: 6, height: 60, background: "#d9dde6" }} />
            <div style={{ width: 6, height: 60, background: "#d9dde6" }} />
          </div>
          <div style={{ width: 620, padding: "46px 0", background: GOLD, borderRadius: 18, textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: 120, fontWeight: 900, color: brand.background, letterSpacing: 6 }}>FOR SALE</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: brand.background, opacity: 0.8 }}>Sample listing · illustrative</div>
          </div>
        </div>
      </div>
      {/* Location lower-third */}
      <div style={{ position: "absolute", bottom: 470, left: 110, display: "flex", alignItems: "center", gap: 30, translate: `${(1 - slide) * -900}px 0` }}>
        <svg width={90} height={120} viewBox="0 0 24 32">
          <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0z" fill={GOLD} />
          <circle cx={12} cy={11.5} r={4.5} fill={brand.background} />
        </svg>
        <div style={{ borderLeft: `6px solid ${GOLD}`, paddingLeft: 30 }}>
          <div style={{ fontSize: 92, fontWeight: 900, color: brand.text, lineHeight: 1 }}>{LISTING.suburb}</div>
          <div style={{ fontSize: 44, fontWeight: 600, color: brand.textDim, marginTop: 10, clipPath: `inset(0 ${100 - interpolate(frame, [22, 40], [0, 100], clamp)}% 0 0)` }}>{LISTING.state} · 22 km to Sydney CBD</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const price = interpolate(frame, [10, 55], [0, LISTING.price], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const deposit = LISTING.price * LISTING.depositPct;
  const rows = [
    { label: `${LISTING.depositPct * 100}% deposit`, value: deposit },
    { label: "Loan amount", value: LISTING.price - deposit },
  ];
  const glow = interpolate(frame, [50, 60, 80], [0, 1, 0.4], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 36, padding: 110 }}>
      <Tag opacity={interpolate(frame, [0, 8], [0, 1], clamp)}>Guide price</Tag>
      <div style={{ fontSize: 158, fontWeight: 900, color: brand.text, fontVariantNumeric: "tabular-nums", clipPath: `inset(0 ${100 - interpolate(frame, [4, 20], [0, 100], clamp)}% 0 0)`, textShadow: `0 0 ${40 * glow}px rgba(245,165,36,${0.9 * glow})` }}>{aud.format(Math.round(price / 1000) * 1000)}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", marginTop: 30 }}>
        {rows.map((r, i) => {
          const p = spring({ frame: frame - 62 - i * 10, fps, config: { damping: 18 } });
          return (
            <div key={r.label} style={{ opacity: p, translate: `${(1 - p) * 300}px 0`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 44px", borderRadius: 24, background: brand.panel, border: "2px solid rgba(255,255,255,0.12)" }}>
              <span style={{ fontSize: 44, fontWeight: 600, color: brand.textDim }}>{r.label}</span>
              <span style={{ fontSize: 60, fontWeight: 900, color: i === 1 ? GOLD : brand.text }}>{aud.format(r.value)}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: GOLD, letterSpacing: 4, opacity: interpolate(frame, [80, 95], [0, 1], clamp) }}>ILLUSTRATIVE ONLY</div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 16 } });
  const pulse = 1 + Math.max(0, Math.sin((frame - 40) / 7)) * 0.04 * interpolate(frame, [40, 50], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 50, padding: 110 }}>
      <div style={{ background: brand.card, borderRadius: 32, padding: "36px 56px", scale: String(0.8 + card * 0.2), opacity: card }}>
        <Img src={staticFile("brand/finhub-logo.png")} style={{ height: 150 }} />
      </div>
      <WordReveal text="Talk to a Finance Hub broker before you buy." start={10} size={82} stagger={3} />
      <div style={{ scale: String(pulse), opacity: interpolate(frame, [36, 46], [0, 1], clamp), background: GOLD, color: brand.background, fontSize: 52, fontWeight: 900, padding: "28px 64px", borderRadius: 999 }}>Book a call today</div>
      <div style={{ fontSize: 40, fontWeight: 700, color: brand.textDim, opacity: interpolate(frame, [46, 56], [0, 1], clamp) }}>finhub.net.au</div>
    </AbsoluteFill>
  );
};

export const RealEstateInvesting: React.FC = () => {
  useTyDoFont();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: brand.font, background: brand.background }}>
      <Backdrop />
      <Sequence durationInFrames={CUTS[0]}><Hook /></Sequence>
      <Sequence from={CUTS[0]} durationInFrames={CUTS[1] - CUTS[0]}><Blueprint /></Sequence>
      <Sequence from={CUTS[1]} durationInFrames={CUTS[2] - CUTS[1]}><Location /></Sequence>
      <Sequence from={CUTS[2]} durationInFrames={CUTS[3] - CUTS[2]}><Price /></Sequence>
      <Sequence from={CUTS[3]}><Cta /></Sequence>
      <Brackets />
      <div style={{ position: "absolute", bottom: 80, left: 110, right: 110, textAlign: "center", fontSize: 26, lineHeight: 1.4, color: brand.textDim, opacity: frame > 60 ? 0.8 : 0 }}>
        Illustrative figures only. General information, not financial advice. Lending criteria apply.
      </div>
      <Finish />
    </AbsoluteFill>
  );
};
