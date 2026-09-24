# Toolkit — what is installed in finhub-video and when it earns its place

Remotion 4.0.527. Before using any API below, read its types in
`node_modules/@remotion/<pkg>/dist/` — this file names capabilities, not props.
Every colour you pass comes from `src/brand/theme.ts`.

## Transitions — `@remotion/transitions/<name>`
Installed presentations: fade, slide, wipe, flip, clock-wipe, iris, swap, push-cut,
blur-slide, linear-blur, zoom-blur, zoom-in-out, cross-zoom, dreamy-zoom, crosswarp,
dissolve, ripple, film-burn, book-flip, none. MortgageReel's edit.json `chapters[].effect`
takes all of them except none, by camelCase name (see edit-json.md). Pick one
transition family per design (e.g. EXPLAINER: bookFlip + dissolve; BROADCAST: pushCut +
swap; CINEMATIC: filmBurn + dreamyZoom), and pair it with an edit.json `look` (warm /
cinematic / mono) for the footage grade.

## Drawing and diagrams
- `@remotion/paths` — evolvePath (draw a path on), getLength, getPointAtLength,
  interpolatePath, cutPath, getBoundingBox: hand-drawn arrows, line charts drawing
  themselves, a pen following a curve, morphing icons.
- `@remotion/shapes` — Arrow, Callout, Circle, Ellipse, Heart, Pie, Polygon, Rect, Spark,
  Star, Triangle (+ make* path builders): pie charts that fill, callouts pointing at
  Daniel, badge shapes. Pair with `paths` to draw them on.
- `@remotion/rough-notation` — Box, Bracket, Circle, CrossedOff, Highlight,
  StrikeThrough, Underline: hand-marked emphasis on words and numbers (EXPLAINER, ALERT).
- `@remotion/rounded-text-box` — text boxes whose corners follow each line (sticker
  captions, speech bubbles).
- `@remotion/layout-utils` — measureText, fitText, fitTextOnNLines: size every headline
  to its box. Mandatory for any user text in a fixed box.

## Depth, texture and light
- `@remotion/three` (+ `three`) — ThreeCanvas: 3D bar charts, a rotating house, a coin
  stack, a 3D title for the cover. Needs `--gl=angle`.
- `@remotion/skia` — SkiaCanvas: shaders, blur/glow, gradients, particle fields, liquid
  number reveals. Needs `--gl=angle`.
- `@remotion/noise` — simplex noise (2D/3D/4D): organic drift, paper grain, wobbling
  hand-drawn lines, living backgrounds.
- `@remotion/motion-blur` — trails / camera motion blur on fast moves (whip-ins).
- `@remotion/light-leaks` (LightLeak) and `@remotion/starburst` (Starburst) — warm leaks
  and ray bursts for CINEMATIC or a hook hit; tint with amber/blue tokens.
- `@remotion/effects` — generative effects (checkerboard, pattern, tile, rings,
  starburst, …) applied through `<Solid effects>`: branded pattern backdrops,
  radar rings on a key number. Needs `--gl=angle`.

## Framing Daniel
- `@remotion/video-matting` — separateVideoLayers, canUseVideoMatting,
  loadVideoMattingModel: cut Daniel out of his room and place him over a designed
  backdrop (paper, studio, chart). Call `canUseVideoMatting` first; if unsupported on
  this machine, fall back to a blurred-backdrop `PacedVideo muted` copy + a masked
  foreground, and say so in the verify list. Pre-process once, never per frame.
- `PacedVideo` (core) — the only way to show the talk. Frame it: split-screen, PiP
  bubble over a full-screen graphic, circle mask, tilted phone frame, zoom punch-ins.

## Motion
- `remotion` — spring, interpolate, interpolateColors, Easing, Sequence, Series,
  Loop, Freeze, measureSpring: the default engine.
- `@remotion/animation-utils` — makeTransform, interpolateStyles: composable transforms.
- `@remotion/gsap` — useGsapTimeline: GSAP timelines (text splitting, staggered
  character reveals) driven by the frame.
- `@remotion/lottie` — Lottie JSON animations (icons, ticks, checkmarks). Recolour to
  tokens; check the file's licence.
- `@remotion/animated-emoji` and `public/emoji/*.json` — animated Noto emoji, sparingly.

## Sound
- `@remotion/sfx` — named effects (whoosh, whip, ding, pageTurn, uiSwitch, mouseClick,
  shutterModern, …). Use: whoosh/whip on transitions, ding on a key number, pageTurn on
  book-flip, uiSwitch on a checklist tick. Skip the meme sounds (vineBoom, bruh,
  wilhelmScream …) — wrong register for financial advice. `public/sfx/*.wav` also exists.
- edit.json `music` — looped bed, auto-ducked under speech (core).
- `@remotion/media` `<Audio>` — any extra layer; volume via callback.

## Captions
- `@remotion/captions` — createTikTokStyleCaptions pages the words; the LOOK is yours:
  karaoke pill, word-pop, sentence lower-third, typewriter, marker highlight, sticker
  boxes (rounded-text-box), kinetic stacked words. Numbers and keywords are the
  emphasis targets (`emphasised()` in style.ts).

## Fonts
- Be Vietnam Pro (local TTFs, `useReelFont`) — default everywhere.
- `@remotion/google-fonts` — a display face only if its `subsets` include
  "vietnamese" (check `getInfo()`); load with `loadFont({ subsets: ["vietnamese"] })`.

## Starter projects to mine for scene ideas (read, adapt, re-colour)
In `starters/` (each its own project: `npm i` inside it to run one):
`my-three` (3D scenes), `my-skia` (shaders), `my-audiogram` (waveform + captions),
`my-code-hike` (animated step-by-step reveals), `my-tiktok` (caption styles),
`my-prompt-to-motion-graphics` (motion-graphic patterns), `my-music-visualization`
(audio-reactive shapes), `my-overlay` (overlay layouts), `my-stargazer` (count-ups).
