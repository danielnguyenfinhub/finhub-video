import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";

// [start, end) frames of each burst in the 120-frame loop.
const BURSTS: ReadonlyArray<readonly [number, number]> = [
  [16, 22],
  [52, 59],
  [96, 102],
];
const FILTER_ID = "logo3d-glitch";

type Band = {y: number; h: number; dx: number};

// Horizontal slices of the frame, some pushed sideways; seeded by the frame
// number through Remotion's random(), so every render is identical.
const makeBands = (frame: number, height: number): Band[] => {
  const bands: Band[] = [];
  for (let y = 0, i = 0; y < height; i++) {
    const h = Math.min(height - y, Math.round(interpolate(random(`h-${frame}-${i}`), [0, 1], [16, 150])));
    const moved = random(`m-${frame}-${i}`) < 0.3;
    const dx = moved ? Math.round(interpolate(random(`dx-${frame}-${i}`), [0, 1], [-90, 90])) : 0;
    bands.push({y, h, dx});
    y += h;
  }
  return bands;
};

// The look of pmndrs' Glitch effect (slice displacement + RGB split in short
// bursts) as an SVG filter over the WebGL canvas. Channels are split with
// feColorMatrix and recombined with "screen", which keeps alpha: transparent
// stays transparent.
export const Glitch: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const on = BURSTS.some(([a, b]) => frame >= a && frame < b);
  if (!on) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const bands = makeBands(frame, height);
  const split = Math.round(interpolate(random(`rgb-${frame}`), [0, 1], [3, 10]));
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{position: "absolute"}}>
        <filter
          id={FILTER_ID}
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={width}
          height={height}
          colorInterpolationFilters="sRGB"
        >
          {bands.map((b, i) => (
            <feOffset key={i} in="SourceGraphic" dx={b.dx} dy={0} x={0} y={b.y} width={width} height={b.h} result={`band${i}`} />
          ))}
          <feMerge result="sliced">
            {bands.map((_, i) => (
              <feMergeNode key={i} in={`band${i}`} />
            ))}
          </feMerge>
          <feColorMatrix in="sliced" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
          <feOffset in="red" dx={split} dy={0} result="redShifted" />
          <feColorMatrix in="sliced" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
          <feColorMatrix in="sliced" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
          <feOffset in="blue" dx={-split} dy={0} result="blueShifted" />
          <feBlend in="redShifted" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blueShifted" mode="screen" />
        </filter>
      </svg>
      <AbsoluteFill style={{filter: `url(#${FILTER_ID})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
