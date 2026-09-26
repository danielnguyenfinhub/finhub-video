// Built from the Remotion prompt gallery: https://www.remotion.dev/prompts/travel-route-on-map-with-3d-landmarks
// Keyless/offline take: a hand-simplified Australia outline in SVG through a
// small Mercator projection (no tiles, no API key). The camera zooms out of
// Perth while staying on it, follows the line to Melbourne, then on to Sydney,
// where a procedural 3D Sydney Harbour Bridge rises (@remotion/three).
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import type React from "react";
import * as THREE from "three";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useTyDoFont } from "../../brand/font";
import { brand } from "../../brand/theme";
import { AUSTRALIA, TASMANIA } from "./australia";

type LonLat = readonly [number, number];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1920, H = 1080;

const PERTH: LonLat = [115.86, -31.95];
const MELBOURNE: LonLat = [144.96, -37.81];
const SYDNEY: LonLat = [151.21, -33.87];
const OTHER_CITIES: LonLat[] = [[138.6, -34.93], [149.13, -35.28], [153.03, -27.47], [130.84, -12.46], [147.33, -42.88]];

// Mercator in radians; the camera is a centre point plus pixels-per-radian.
const merc = ([lon, lat]: LonLat): [number, number] => [(lon * Math.PI) / 180, Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))];
type Cam = { c: [number, number]; k: number; oy: number };
const toScreen = (m: [number, number], cam: Cam): [number, number] => [(m[0] - cam.c[0]) * cam.k + W / 2, H / 2 + cam.oy - (m[1] - cam.c[1]) * cam.k];
const ringPath = (ring: LonLat[], cam: Cam) => "M" + ring.map((p) => toScreen(merc(p), cam).map((v) => v.toFixed(1)).join(" ")).join("L") + "Z";

// Each leg is a gentle quadratic arc in Mercator space; bend is a fraction of its length.
const arc = (a: LonLat, b: LonLat, bend: number) => {
  const [p0, p2] = [merc(a), merc(b)];
  const mid: [number, number] = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2];
  const [dx, dy] = [p2[0] - p0[0], p2[1] - p0[1]];
  const p1: [number, number] = [mid[0] - dy * bend, mid[1] + dx * bend];
  return (t: number): [number, number] => [
    (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0],
    (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1],
  ];
};
const LEG1 = arc(PERTH, MELBOURNE, 0.18);
const LEG2 = arc(MELBOURNE, SYDNEY, 0.2);
const SAMPLES = 80;
const partial = (leg: (t: number) => [number, number], t: number) => Array.from({ length: SAMPLES + 1 }, (_, i) => leg((i / SAMPLES) * t));

// Timeline (30 fps, 450 frames).
const T = { zoomOut: [0, 70], leg1: [70, 185], leg2: [215, 290], bridge: 290 } as const;
const ease = Easing.inOut(Easing.cubic);

const camera = (frame: number): Cam => {
  const logK = (a: number, b: number, f0: number, f1: number) => Math.exp(interpolate(frame, [f0, f1], [Math.log(a), Math.log(b)], { ...clamp, easing: ease }));
  if (frame < T.leg1[0]) return { c: merc(PERTH), k: logK(14000, 3000, ...T.zoomOut), oy: 0 };
  if (frame < T.leg2[0]) {
    const t = interpolate(frame, T.leg1, [0, 1], { ...clamp, easing: ease });
    return { c: LEG1(t), k: 3000 - Math.sin(t * Math.PI) * 700, oy: 0 };
  }
  const t = interpolate(frame, T.leg2, [0, 1], { ...clamp, easing: ease });
  return { c: LEG2(t), k: logK(3000, 12000, T.leg2[0], T.bridge + 60), oy: interpolate(frame, [T.bridge, T.bridge + 40], [0, 200], { ...clamp, easing: ease }) };
};

const Pin: React.FC<{ at: [number, number]; label: string; start: number; active: boolean }> = ({ at, label, start, active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - start, fps, config: { damping: 12 } });
  const ring = ((frame - start) % 40) / 40;
  if (frame < start) return null;
  return (
    <div style={{ position: "absolute", left: at[0], top: at[1] }}>
      <div style={{ position: "absolute", width: 90, height: 90, left: -45, top: -45, borderRadius: "50%", border: `3px solid ${brand.accent}`, opacity: active ? 1 - ring : 0, scale: String(0.3 + ring) }} />
      <div style={{ position: "absolute", width: 26, height: 26, left: -13, top: -13, borderRadius: "50%", background: brand.accent, boxShadow: `0 0 24px ${brand.accent}`, scale: String(p) }} />
      <div style={{ position: "absolute", left: 28, top: -76, whiteSpace: "nowrap", background: brand.panel, border: `2px solid ${brand.accent}`, borderRadius: 14, padding: "8px 22px", fontSize: 40, fontWeight: 800, color: brand.text, opacity: p, translate: `0 ${(1 - p) * 20}px` }}>{label}</div>
    </div>
  );
};

// Procedural Sydney Harbour Bridge: two-chord steel arch, deck, granite pylons, hangers.
const archY = (x: number, top: number, base: number) => base + (top - base) * (1 - (x / 3) ** 2);
const Tube: React.FC<{ top: number; base: number; z: number }> = ({ top, base, z }) => {
  const geo = useMemo(() => {
    const pts = Array.from({ length: 25 }, (_, i) => new THREE.Vector3(-3 + i * 0.25, archY(-3 + i * 0.25, top, base), z));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.06, 8, false);
  }, [top, base, z]);
  return <mesh geometry={geo}><meshStandardMaterial color="#9fb0c8" metalness={0.25} roughness={0.45} /></mesh>;
};
const HANGER_X = Array.from({ length: 13 }, (_, i) => -2.4 + i * 0.4);
const Bridge: React.FC<{ build: number; spin: number }> = ({ build, spin }) => (
  <group rotation={[0.18, spin, 0]} position={[0, -0.9, 0]} scale={[1, Math.max(build, 0.001), 1]}>
    {[-0.35, 0.35].map((z) => (
      <group key={z}>
        <Tube top={2.0} base={0.35} z={z} />
        <Tube top={1.6} base={-0.25} z={z} />
        {HANGER_X.map((x) => {
          const top = archY(x, 1.6, -0.25);
          return top > 0.55 ? (
            <mesh key={x} position={[x, (0.5 + top) / 2, z]}>
              <boxGeometry args={[0.03, top - 0.5, 0.03]} />
              <meshStandardMaterial color="#8a9ab3" metalness={0.25} roughness={0.5} />
            </mesh>
          ) : null;
        })}
      </group>
    ))}
    <mesh position={[0, 0.5, 0]}><boxGeometry args={[9, 0.1, 0.95]} /><meshStandardMaterial color="#5d6b80" roughness={0.6} /></mesh>
    {[-3.35, 3.35, -3.95, 3.95].flatMap((x) => [-0.45, 0.45].map((z) => (
      <mesh key={`${x}${z}`} position={[x, 0.55, z]}><boxGeometry args={[0.38, 1.5, 0.3]} /><meshStandardMaterial color="#d6ccb4" roughness={0.8} /></mesh>
    )))}
  </group>
);

const BridgeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const build = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 50 } });
  const spin = interpolate(frame, [0, 160], [-0.9, 0.5]);
  const title = spring({ frame: frame - 40, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: (W - 1400) / 2, top: 60, width: 1400, height: 720, opacity: interpolate(frame, [0, 12], [0, 1], clamp) }}>
        <ThreeCanvas width={1400} height={720} camera={{ position: [0, 1.4, 7.2], fov: 38 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffe2b0" />
          <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#6fa8ff" />
          <Bridge build={build} spin={spin} />
        </ThreeCanvas>
      </div>
      <div style={{ position: "absolute", left: 110, bottom: 50, background: brand.panel, borderRadius: 20, padding: "22px 40px", opacity: title, translate: `${(1 - title) * -80}px 0` }}>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 5, color: brand.accent }}>STOP 3 · SYDNEY</div>
        <div style={{ fontSize: 76, fontWeight: 900, color: brand.text }}>Sydney Harbour Bridge</div>
      </div>
    </AbsoluteFill>
  );
};

const Route: React.FC<{ cam: Cam; frame: number }> = ({ cam, frame }) => {
  const t1 = interpolate(frame, T.leg1, [0, 1], { ...clamp, easing: ease });
  const t2 = interpolate(frame, T.leg2, [0, 1], { ...clamp, easing: ease });
  const pts = [...partial(LEG1, t1), ...(t2 > 0 ? partial(LEG2, t2) : [])].map((m) => toScreen(m, cam));
  const d = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join("L");
  if (t1 <= 0) return null;
  const tip = pts[pts.length - 1];
  return (
    <g>
      <path d={d} fill="none" stroke={brand.accent} strokeOpacity={0.35} strokeWidth={18} strokeLinecap="round" />
      <path d={d} fill="none" stroke={brand.highlight} strokeWidth={7} strokeLinecap="round" strokeDasharray="1 16" />
      <circle cx={tip[0]} cy={tip[1]} r={11} fill="#fff" stroke={brand.accent} strokeWidth={5} />
    </g>
  );
};

export const TravelRouteMap: React.FC = () => {
  useTyDoFont();
  const frame = useCurrentFrame();
  const cam = camera(frame);
  const graticule: string[] = [];
  for (let lon = 100; lon <= 170; lon += 5) graticule.push(ringPath([[lon, -5], [lon, -50]], cam).slice(0, -1));
  for (let lat = -5; lat >= -50; lat -= 5) graticule.push(ringPath([[100, lat], [170, lat]], cam).slice(0, -1));
  const s = (p: LonLat) => toScreen(merc(p), cam);
  const legs = [
    { name: "Perth", at: PERTH, start: 8 },
    { name: "Melbourne", at: MELBOURNE, start: T.leg1[1] - 4 },
    { name: "Sydney", at: SYDNEY, start: T.leg2[1] - 4 },
  ];
  const header = legs.filter((l) => frame >= l.start).map((l) => l.name).join("  →  ");
  return (
    <AbsoluteFill style={{ fontFamily: brand.font, background: `radial-gradient(ellipse at 50% 40%, #12335F 0%, ${brand.background} 75%)` }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {graticule.map((d, i) => <path key={i} d={d} stroke="rgba(120,170,255,0.12)" strokeWidth={1.5} fill="none" />)}
        {[AUSTRALIA, TASMANIA].map((ring, i) => (
          <path key={i} d={ringPath(ring, cam)} fill="#1D4677" stroke="#6FA8FF" strokeWidth={3} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 16px rgba(80,150,255,0.45))" }} />
        ))}
        {OTHER_CITIES.map((c, i) => { const [x, y] = s(c); return <circle key={i} cx={x} cy={y} r={6} fill="#9CC8FF" opacity={0.6} />; })}
        <Route cam={cam} frame={frame} />
      </svg>
      {legs.map((l, i) => (
        <Pin key={l.name} at={s(l.at)} label={l.name} start={l.start} active={i === legs.filter((x) => frame >= x.start).length - 1} />
      ))}
      <div style={{ position: "absolute", top: 60, left: 110, fontSize: 44, fontWeight: 800, color: brand.text, background: brand.panel, borderRadius: 16, padding: "14px 30px", opacity: interpolate(frame, [8, 20], [0, 1], clamp) }}>{header}</div>
      <Sequence from={T.bridge}><BridgeScene /></Sequence>
      <div style={{ position: "absolute", right: 60, bottom: 40, fontSize: 22, color: brand.textDim, opacity: 0.7 }}>Map outline simplified · Finance Hub</div>
    </AbsoluteFill>
  );
};
