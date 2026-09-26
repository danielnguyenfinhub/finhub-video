import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 8S1P pack, 1280x720, 300 frames @ 30 fps.
// 0-60 IDLE, 60-90 MEASURING, 90-240 BALANCING, 240-300 BALANCED.
export const BMS_DURATION = 300;
const MEASURE_START = 60;
const BALANCE_START = 90;
const BALANCE_END = 240;

// Fixed, unbalanced start voltages (3.30-4.05 V). They sum to 29.992 V, so the
// balanced cell reads 3.749 V / 62 % and the pack 29.99 V.
const INITIAL_V = [3.92, 3.45, 4.05, 3.61, 3.3, 3.88, 3.78, 4.002];
const AVG_V = INITIAL_V.reduce((a, b) => a + b, 0) / INITIAL_V.length;
const V_EMPTY = 3.0;
const V_FULL = 4.2;

const BG = "#0b1120";
const FONT = "'Courier New', Courier, monospace";
const GREEN = "#22c55e";
const ORANGE = "#f59e0b";
const RED = "#ef4444";
const YELLOW = "#eab308";
const BLUE = "#3b82f6";
const MUTED = "#64748b";
const TEXT = "#e2e8f0";

const CELL_W = 96;
const CELL_H = 250;
const CELL_GAP = 40;
const PACK_W = CELL_W * 8 + CELL_GAP * 7;
const PACK_LEFT = (1280 - PACK_W) / 2;
const CELL_TOP = 190;

type Phase = "IDLE" | "MEASURING" | "BALANCING" | "BALANCED";

const phaseAt = (f: number): Phase =>
  f < MEASURE_START
    ? "IDLE"
    : f < BALANCE_START
      ? "MEASURING"
      : f < BALANCE_END
        ? "BALANCING"
        : "BALANCED";

const socOf = (v: number) =>
  Math.min(100, Math.max(0, ((v - V_EMPTY) / (V_FULL - V_EMPTY)) * 100));

const fillColours = (soc: number): [string, string] =>
  soc >= 60 ? ["#4ade80", "#15803d"] : soc >= 35 ? ["#fbbf24", "#c2410c"] : ["#f87171", "#b91c1c"];

const deltaColour = (mv: number) => (mv < 10 ? GREEN : mv < 50 ? ORANGE : RED);

const StatusDot: React.FC<{ phase: Phase; frame: number }> = ({ phase, frame }) => {
  const colour =
    phase === "MEASURING" ? YELLOW : phase === "BALANCING" ? GREEN : phase === "BALANCED" ? BLUE : MUTED;
  const pulse = phase === "BALANCING" ? 0.5 + 0.5 * Math.sin((frame / 30) * Math.PI * 2) : 0;
  const label =
    phase === "MEASURING" ? "MEASURING CELLS..." : phase === "BALANCING" ? "BALANCING" : phase;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, color: colour, fontWeight: 700 }}>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          background: colour,
          boxShadow: `0 0 ${6 + pulse * 16}px ${colour}`,
          transform: `scale(${1 + pulse * 0.35})`,
        }}
      />
      {label}
    </div>
  );
};

const Particles: React.FC<{ frame: number; up: boolean; strength: number; seed: number }> = ({
  frame,
  up,
  strength,
  seed,
}) => {
  if (strength <= 0.01) return null;
  const colour = up ? ORANGE : GREEN;
  return (
    <>
      {new Array(6).fill(0).map((_, k) => {
        const p = ((frame * 1.6 + k * 20 + random(`p${seed}-${k}`) * 20) % 120) / 120;
        const y = up ? CELL_H - p * (CELL_H + 30) : -30 + p * (CELL_H + 30);
        const x = 14 + random(`x${seed}-${k}`) * (CELL_W - 28);
        const fade = Math.sin(p * Math.PI) * strength;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 6,
              height: 6,
              borderRadius: 3,
              background: colour,
              boxShadow: `0 0 8px ${colour}`,
              opacity: fade,
            }}
          />
        );
      })}
    </>
  );
};

const Cell: React.FC<{ i: number; v: number; frame: number; phase: Phase; strength: number }> = ({
  i,
  v,
  frame,
  phase,
  strength,
}) => {
  const soc = socOf(v);
  const [hi, lo] = fillColours(soc);
  const high = INITIAL_V[i] > AVG_V;
  const balancing = phase === "BALANCING";
  const border = balancing ? (high ? ORANGE : GREEN) : phase === "BALANCED" ? "#1e40af" : "#334155";
  const temp = 24.2 + random(`t${i}`) * 1.6 + (balancing ? Math.abs(INITIAL_V[i] - AVG_V) * 6 * strength : 0);
  const fillH = (CELL_H - 8) * (soc / 100);
  const shimmerY = ((frame * 2 + i * 17) % 60) / 60;
  const left = PACK_LEFT + i * (CELL_W + CELL_GAP);

  return (
    <div style={{ position: "absolute", left, top: CELL_TOP, width: CELL_W }}>
      {/* terminal nub */}
      <div
        style={{
          position: "absolute",
          left: CELL_W / 2 - 16,
          top: -12,
          width: 32,
          height: 12,
          background: "#94a3b8",
          borderRadius: "4px 4px 0 0",
        }}
      />
      <div
        style={{
          position: "relative",
          width: CELL_W,
          height: CELL_H,
          borderRadius: 10,
          border: `3px solid ${border}`,
          boxShadow: balancing ? `0 0 14px ${border}66` : "none",
          background: "#111827",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 4,
            right: 4,
            bottom: 4,
            height: fillH,
            borderRadius: 6,
            background: `linear-gradient(to top, ${lo}, ${hi})`,
            overflow: "hidden",
          }}
        >
          {/* shimmer on the fill level */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 10,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0))",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 26,
              left: `${-30 + shimmerY * 160}%`,
              background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))",
            }}
          />
        </div>
        {balancing ? <Particles frame={frame} up={high} strength={strength} seed={i} /> : null}
        <div
          style={{
            position: "absolute",
            top: 10,
            width: "100%",
            textAlign: "center",
            fontSize: 17,
            fontWeight: 700,
            color: "#f8fafc",
            textShadow: "0 1px 3px #000",
          }}
        >
          {v.toFixed(3)}V
        </div>
        {balancing ? (
          <div
            style={{
              position: "absolute",
              top: CELL_H / 2 - 30,
              width: "100%",
              textAlign: "center",
              color: high ? ORANGE : GREEN,
              textShadow: "0 1px 4px #000",
            }}
          >
            <div style={{ fontSize: 30 }}>{high ? "▲" : "▼"}</div>
            <div
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 5px",
                borderRadius: 4,
                background: "rgba(11,17,32,0.85)",
              }}
            >
              {high ? "Discharging" : "Charging"}
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ textAlign: "center", marginTop: 26, color: TEXT, fontSize: 18, fontWeight: 700 }}>C{i + 1}</div>
      <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 14 }}>{Math.round(soc)}%</div>
      <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 14 }}>{temp.toFixed(1)}°C</div>
    </div>
  );
};

const BusBar: React.FC<{ top: number }> = ({ top }) => (
  <div
    style={{
      position: "absolute",
      left: PACK_LEFT + CELL_W / 2 - 16,
      width: PACK_W - CELL_W + 32,
      top,
      height: 8,
      borderRadius: 4,
      background: "linear-gradient(to bottom, #d97706, #92400e)",
      boxShadow: "0 0 6px #b4530966",
    }}
  />
);

const InfoItem: React.FC<{ label: string; value: string; colour?: string }> = ({ label, value, colour }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <div style={{ fontSize: 13, color: MUTED, letterSpacing: 1 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: colour ?? TEXT }}>{value}</div>
  </div>
);

export const BmsCellBalancing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phase = phaseAt(frame);

  const t = interpolate(frame, [BALANCE_START, BALANCE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s = t * t * (3 - 2 * t); // smoothstep
  // At the end the cells are set to exactly the average, so every cell reads the same.
  const volts = INITIAL_V.map((v0) => (t >= 1 ? AVG_V : v0 + (AVG_V - v0) * s));
  const strength = 1 - s; // how much imbalance is left, drives particles and heat

  const pack = volts.reduce((a, b) => a + b, 0);
  const deltaMv = (Math.max(...volts) - Math.min(...volts)) * 1000;
  const packSoc = volts.reduce((a, v) => a + socOf(v), 0) / volts.length;

  const panelIn = spring({ frame: frame - 8, fps, config: { damping: 14, mass: 0.8 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        backgroundImage:
          "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        fontFamily: FONT,
        color: TEXT,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 30,
          width: "100%",
          textAlign: "center",
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        BMS Active Cell Balancing
      </div>

      <div
        style={{
          position: "absolute",
          top: 100,
          left: PACK_LEFT,
          right: PACK_LEFT,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <StatusDot phase={phase} frame={frame} />
        <div style={{ display: "flex", gap: 24, fontSize: 15 }}>
          <span style={{ color: ORANGE }}>▲ Discharging (high cell)</span>
          <span style={{ color: GREEN }}>▼ Charging (low cell)</span>
        </div>
      </div>

      <BusBar top={CELL_TOP - 16} />
      <BusBar top={CELL_TOP + CELL_H + 4} />
      {volts.map((v, i) => (
        <Cell key={i} i={i} v={v} frame={frame} phase={phase} strength={strength} />
      ))}

      <div
        style={{
          position: "absolute",
          left: PACK_LEFT,
          width: PACK_W,
          top: 590,
          height: 96,
          borderRadius: 12,
          border: "1px solid #1e293b",
          background: "rgba(15,23,42,0.9)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 80}px)`,
        }}
      >
        <InfoItem label="PACK VOLTAGE" value={`${pack.toFixed(2)}V`} />
        <InfoItem label="MAX DELTA" value={`${deltaMv.toFixed(1)}mV`} colour={deltaColour(deltaMv)} />
        <InfoItem label="AVG CELL" value={`${(pack / 8).toFixed(3)}V`} />
        <InfoItem label="CONFIG" value="8S1P" />
        <InfoItem label="PACK SOC" value={`${Math.round(packSoc)}%`} />
        <InfoItem label="METHOD" value="Active" />
      </div>
    </AbsoluteFill>
  );
};
