# Remotion — one example per API (all 5 batches)

Remotion v4.0.529 · every code block type-checks under tsc --strict against the published packages · assembled 26 Sep 2026.


Covers `remotion` (core), `@remotion/media`, `@remotion/captions`, `@remotion/google-fonts`, `@remotion/renderer`, `@remotion/light-leaks`, `@remotion/motion-blur`, `@remotion/transitions`. Every snippet type-checks under `tsc --strict` against v4.0.529. Assets referenced via `staticFile()` (logo.png, talking-head.mp4, music.mp3…) are placeholders — put your own files in `public/`. Renderer scripts assume a bundle at `./build` (`npx remotion bundle`) or pass a fresh `bundle()` result.


## remotion


#### <AbsoluteFill>

Position content absolutely and in full size — [docs](https://www.remotion.dev/docs/absolute-fill)

```tsx
// AbsoluteFill.tsx
import {AbsoluteFill} from 'remotion';
// Full-size, absolutely positioned flex container. Later siblings stack on top.
export const MyComp = () => (
  <AbsoluteFill style={{backgroundColor: '#0B1F3A'}}>
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 80}}>Layer 2</AbsoluteFill>
  </AbsoluteFill>
);
```

#### cancelRender()

Abort an error — [docs](https://www.remotion.dev/docs/cancel-render)

```tsx
// cancelRender.tsx
import {useEffect, useState} from 'react';
import {cancelRender, useDelayRender} from 'remotion';
// Abort the render with a real error instead of timing out.
export const MyComp = () => {
  const {delayRender, continueRender} = useDelayRender();
  const [handle] = useState(() => delayRender('Fetching rates'));
  const [rate, setRate] = useState<number | null>(null);
  useEffect(() => {
    fetch('https://example.com/rate.json').then((r) => r.json())
      .then((j: {rate: number}) => { setRate(j.rate); continueRender(handle); })
      .catch((err) => cancelRender(err));
  }, [handle, continueRender]);
  return <div style={{fontSize: 80}}>{rate ?? ''}</div>;
};
```

#### <Composition>

Define a video — [docs](https://www.remotion.dev/docs/composition)

```tsx
// Composition.tsx
import {Composition, registerRoot} from 'remotion';
const Hello: React.FC<{name: string}> = ({name}) => <h1>Hello {name}</h1>;
// Registers a renderable video; `id` is what `npx remotion render <id>` targets.
export const Root = () => (
  <>
    <Composition id="Landscape" component={Hello} durationInFrames={150} fps={30} width={1920} height={1080} defaultProps={{name: 'FinHub'}} />
    <Composition id="Reel" component={Hello} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{name: 'Reel'}}
      calculateMetadata={async ({props}) => ({durationInFrames: 30 * (props.name.length + 5)})} />
  </>
);
registerRoot(Root);
```

#### continueRender()

Unblock a render — [docs](https://www.remotion.dev/docs/continue-render)

```tsx
// continueRender.tsx
import {useCallback, useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
// continueRender(handle) releases a delayRender() block. (Hook form: useDelayRender)
export const MyComp = () => {
  const [handle] = useState(() => delayRender('Loading data'));
  const [data, setData] = useState<string[]>([]);
  const load = useCallback(async () => {
    setData(['a', 'b']);
    continueRender(handle);
  }, [handle]);
  useEffect(() => { load(); }, [load]);
  return <div>{data.join(', ')}</div>;
};
```

#### delayRender()

Block a render from continuing — [docs](https://www.remotion.dev/docs/delay-render)

```tsx
// delayRender.tsx
import {useEffect, useState} from 'react';
import {delayRender, continueRender} from 'remotion';
// Blocks the frame from being captured until continueRender(). Timeout default 30 s; override per call.
export const MyComp = () => {
  const [handle] = useState(() => delayRender('Loading image', {timeoutInMilliseconds: 60000, retries: 1}));
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => { setSrc('https://example.com/bg.jpg'); continueRender(handle); }, [handle]);
  return src ? <img src={src} /> : null;
};
```

#### Easing

Customize animation curve of `interpolate()` — [docs](https://www.remotion.dev/docs/easing)

```tsx
// Easing.tsx
import {Easing, interpolate, useCurrentFrame} from 'remotion';
// Curves for interpolate(): Easing.bezier, Easing.inOut(Easing.cubic), Easing.elastic(1), Easing.bounce...
export const MyComp = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 30], [0, 1000], {easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, 30], [0, 300], {easing: Easing.inOut(Easing.cubic), extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', left: x, top: y, width: 80, height: 80, background: '#F5B400'}} />;
};
```

#### <Folder>

Organize compositions in the Studio sidebar — [docs](https://www.remotion.dev/docs/folder)

```tsx
// Folder.tsx
import {Composition, Folder} from 'remotion';
const C: React.FC = () => null;
// Groups compositions in the Studio sidebar only (no effect on output).
export const Root = () => (
  <Folder name="Rate-Alerts">
    <Composition id="RateAlertEN" component={C} durationInFrames={300} fps={30} width={1080} height={1920} />
    <Composition id="RateAlertVI" component={C} durationInFrames={300} fps={30} width={1080} height={1920} />
  </Folder>
);
```

#### <Freeze>

Freeze some content in time — [docs](https://www.remotion.dev/docs/freeze)

```tsx
// Freeze.tsx
import {AbsoluteFill, Freeze, OffthreadVideo, staticFile} from 'remotion';
// Children see `frame` as the fixed value — freeze-frame a clip at frame 45.
export const MyComp = () => (
  <AbsoluteFill>
    <Freeze frame={45}><OffthreadVideo src={staticFile('clip.mp4')} /></Freeze>
  </AbsoluteFill>
);
```

#### getInputProps()

Receive the user-defined input data — [docs](https://www.remotion.dev/docs/get-input-props)

```tsx
// getInputProps.tsx
import {getInputProps} from 'remotion';
// Props passed on the CLI (--props='{"client":"..."}') or renderMedia({inputProps}). Prefer typed component props where possible.
const {headline = 'Default'} = getInputProps() as {headline?: string};
export const MyComp = () => <h1>{headline}</h1>;
```

#### getRemotionEnvironment()

Determine if you are currently previewing or rendering — [docs](https://www.remotion.dev/docs/get-remotion-environment)

```tsx
// getRemotionEnvironment.tsx
import {getRemotionEnvironment} from 'remotion';
// isStudio / isRendering / isPlayer / isReadOnlyStudio — e.g. hide guides during render.
export const MyComp = () => {
  const env = getRemotionEnvironment();
  return <div>{env.isStudio ? <div style={{outline: '2px dashed red', position: 'absolute', inset: 60}} /> : null}Safe area</div>;
};
```

#### <Html5Audio>

Synchronize `<audio>` with Remotion's time — [docs](https://www.remotion.dev/docs/html5-audio)

```tsx
// Html5Audio.tsx
import {Html5Audio, interpolate, staticFile} from 'remotion';
// Browser <audio> synced to the timeline. volume can be a per-frame function.
export const MyComp = () => (
  <Html5Audio src={staticFile('music.mp3')} volume={(f) => interpolate(f, [0, 30], [0, 0.3], {extrapolateRight: 'clamp'})} trimBefore={60} />
);
```

#### <Html5Video>

Synchronize a `<video>` with Remotion's time — [docs](https://www.remotion.dev/docs/html5-video)

```tsx
// Html5Video.tsx
import {AbsoluteFill, Html5Video, staticFile} from 'remotion';
// Browser <video> synced to the timeline. For renders prefer <Video> from @remotion/media or <OffthreadVideo>.
export const MyComp = () => (
  <AbsoluteFill><Html5Video src={staticFile('clip.mp4')} trimBefore={30} trimAfter={300} muted style={{width: '100%'}} /></AbsoluteFill>
);
```

#### <HtmlInCanvas>

Draw DOM content into a canvas via HTML-in-canvas — [docs](https://www.remotion.dev/docs/remotion/html-in-canvas)

```tsx
// HtmlInCanvas.tsx
import {HtmlInCanvas} from 'remotion';
// Draws DOM into a canvas (needs HTML-in-canvas browser support) so canvas effects can apply to it.
export const MyComp = () => (
  <HtmlInCanvas width={1280} height={720}>
    <div style={{fontSize: 80, color: 'white'}}>Hello</div>
  </HtmlInCanvas>
);
```

#### <IFrame>

Render an `<iframe>` tag and wait for it to load — [docs](https://www.remotion.dev/docs/iframe)

```tsx
// IFrame.tsx
import {AbsoluteFill, IFrame} from 'remotion';
// Like <iframe> but delays the render until it has loaded.
export const MyComp = () => (
  <AbsoluteFill><IFrame src="https://finhub.net.au" style={{width: '100%', height: '100%', border: 0}} /></AbsoluteFill>
);
```

#### <Img>

Render an `<img>` tag and wait for it to load — [docs](https://www.remotion.dev/docs/img)

```tsx
// Img.tsx
import {AbsoluteFill, Img, staticFile} from 'remotion';
// Like <img> but waits for load before the frame is captured; retries on failure.
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <Img src={staticFile('logo.png')} style={{width: 400}} maxRetries={3} />
  </AbsoluteFill>
);
```

#### <CanvasImage>

Render an image into a canvas and apply effects — [docs](https://www.remotion.dev/docs/canvasimage)

```tsx
// CanvasImage.tsx
import {AbsoluteFill, CanvasImage, staticFile} from 'remotion';
import {lightLeak} from '@remotion/light-leaks';
// Image drawn to canvas so `effects` can be chained on it.
export const MyComp = () => (
  <AbsoluteFill>
    <CanvasImage src={staticFile('house.jpg')} width={1920} height={1080} fit="cover" effects={[lightLeak({seed: 2, progress: 0.5})]} />
  </AbsoluteFill>
);
```

#### createEffect()

Create custom effects for canvas components — [docs](https://www.remotion.dev/docs/create-effect)

```tsx
// createEffect.tsx
import {AbsoluteFill, CanvasImage, createEffect, staticFile, type InteractivitySchema} from 'remotion';
// Define a custom canvas effect usable in any `effects` prop.
type Params = {readonly amount?: number};
const schema = {amount: {type: 'number', min: 0, max: 1, step: 0.01, default: 1, description: 'Amount', hiddenFromList: false}} as const satisfies InteractivitySchema;
export const desaturate = createEffect<Params, null>({
  type: 'com.finhub.desaturate', label: 'desaturate()', documentationLink: null, backend: '2d',
  calculateKey: ({amount = 1}) => `desaturate-${amount}`,
  setup: () => null,
  apply: ({source, target, width, height, params}) => {
    const ctx = target.getContext('2d');
    if (!ctx) throw new Error('No 2D context');
    ctx.clearRect(0, 0, width, height);
    ctx.filter = `grayscale(${params.amount ?? 1})`;
    ctx.drawImage(source, 0, 0, width, height);
    ctx.filter = 'none';
  },
  cleanup: () => undefined,
  schema,
  validateParams: ({amount = 1}) => { if (amount < 0 || amount > 1) throw new TypeError('amount must be 0–1'); },
});
export const MyComp = () => (
  <AbsoluteFill><CanvasImage src={staticFile('house.jpg')} width={1920} height={1080} effects={[desaturate({amount: 0.8})]} /></AbsoluteFill>
);
```

#### interpolateColors()

Map a range of values to colors — [docs](https://www.remotion.dev/docs/interpolate-colors)

```tsx
// interpolateColors.tsx
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
// Map a number range onto colours (any CSS colour format).
export const MyComp = () => {
  const bg = interpolateColors(useCurrentFrame(), [0, 60, 120], ['#0B1F3A', '#1C4E80', '#F5B400']);
  return <AbsoluteFill style={{backgroundColor: bg}} />;
};
```

#### interpolate()

Map a range of values to another — [docs](https://www.remotion.dev/docs/interpolate)

```tsx
// interpolate.tsx
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
// Map input range → output range. Always clamp unless you want overshoot.
export const MyComp = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity, justifyContent: 'center', alignItems: 'center', fontSize: 90}}>Fade in / out</AbsoluteFill>;
};
```

#### <Loop>

Play some content repeatedly — [docs](https://www.remotion.dev/docs/loop)

```tsx
// Loop.tsx
import {AbsoluteFill, Loop, interpolate, useCurrentFrame} from 'remotion';
const Pulse = () => {
  const s = interpolate(useCurrentFrame(), [0, 15, 30], [1, 1.2, 1]);
  return <div style={{width: 100, height: 100, borderRadius: 50, background: '#F5B400', scale: String(s)}} />;
};
// Repeats children every `durationInFrames` (optionally `times`).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Loop durationInFrames={30}><Pulse /></Loop></AbsoluteFill>
);
```

#### measureSpring()

Determine the duration of a spring — [docs](https://www.remotion.dev/docs/measure-spring)

```tsx
// measureSpring.tsx
import {Sequence, measureSpring, spring, useCurrentFrame, useVideoConfig} from 'remotion';
// How many frames a spring takes to settle — use it to size the next Sequence.
const settle = measureSpring({fps: 30, config: {damping: 200}});
const In = () => {
  const {fps} = useVideoConfig();
  return <div style={{scale: String(spring({frame: useCurrentFrame(), fps, config: {damping: 200}}))}}>In</div>;
};
export const MyComp = () => (<><Sequence durationInFrames={settle}><In /></Sequence><Sequence from={settle}><div>Next</div></Sequence></>);
```

#### <OffthreadVideo>

Alternative to `<Html5Video>` — [docs](https://www.remotion.dev/docs/offthreadvideo)

```tsx
// OffthreadVideo.tsx
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';
// Frame-exact video (extracted with FFmpeg during render). Supports more codecs than <Html5Video>.
export const MyComp = () => (
  <AbsoluteFill><OffthreadVideo src={staticFile('talking-head.mp4')} trimBefore={15} volume={1} playbackRate={1} /></AbsoluteFill>
);
```

#### <AnimatedImage>

Disply a GIF, AVIF or animated WebP image — [docs](https://www.remotion.dev/docs/animatedimage)

```tsx
// AnimatedImage.tsx
import {AbsoluteFill, AnimatedImage, staticFile} from 'remotion';
// GIF / animated WebP / AVIF synced to the timeline.
export const MyComp = () => (
  <AbsoluteFill><AnimatedImage src={staticFile('sticker.webp')} width={400} height={400} fit="contain" loopBehavior="loop" /></AbsoluteFill>
);
```

#### registerRoot()

Initialize a Remotion project — [docs](https://www.remotion.dev/docs/register-root)

```tsx
// registerRoot.tsx
// src/index.ts — entry point referenced by the CLI / bundle(). Call once.
import {registerRoot, Composition} from 'remotion';
const C: React.FC = () => null;
const RemotionRoot = () => <Composition id="MyComp" component={C} durationInFrames={90} fps={30} width={1920} height={1080} />;
registerRoot(RemotionRoot);
```

#### <Sequence>

Time-shifts it's children — [docs](https://www.remotion.dev/docs/sequence)

```tsx
// Sequence.tsx
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
// Time-shifts children: inside, useCurrentFrame() starts at 0 at `from`.
const Label: React.FC<{t: string}> = ({t}) => <div style={{fontSize: 60}}>{t} · local frame {useCurrentFrame()}</div>;
export const MyComp = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={60} name="Hook"><Label t="Hook" /></Sequence>
    <Sequence from={60} durationInFrames={90} premountFor={30} name="Body"><Label t="Body" /></Sequence>
  </AbsoluteFill>
);
```

#### InteractivitySchema

Define timeline controls for components and effects — [docs](https://www.remotion.dev/docs/interactivity-schema)

```tsx
// InteractivitySchema.tsx
import {Interactive, type InteractivitySchema} from 'remotion';
// Declares Studio timeline controls (used by Interactive.withSchema and createEffect).
export const titleCardSchema = {
  ...Interactive.baseSchema,
  ...Interactive.transformSchema,
  tint: {type: 'color', default: '#ffffff', description: 'Tint'},
  size: {type: 'number', min: 10, max: 200, step: 1, default: 80, description: 'Font size', hiddenFromList: false},
} as const satisfies InteractivitySchema;
```

#### <Series>

Display contents after another — [docs](https://www.remotion.dev/docs/series)

```tsx
// Series.tsx
import {AbsoluteFill, Series} from 'remotion';
// Plays sequences back-to-back without computing `from` by hand. `offset` overlaps/gaps.
export const MyComp = () => (
  <Series>
    <Series.Sequence durationInFrames={60}><AbsoluteFill style={{background: '#0B1F3A'}} /></Series.Sequence>
    <Series.Sequence durationInFrames={60} offset={-10}><AbsoluteFill style={{background: '#1C4E80'}} /></Series.Sequence>
    <Series.Sequence durationInFrames={60}><AbsoluteFill style={{background: '#F5B400'}} /></Series.Sequence>
  </Series>
);
```

#### spring()

Physics-based animation primitive — [docs](https://www.remotion.dev/docs/spring)

```tsx
// spring.tsx
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
// Physics 0→1 value. damping 200 = no bounce; `delay` in frames; `durationInFrames` stretches it.
export const MyComp = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, delay: 10, config: {damping: 12, stiffness: 120}});
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><div style={{fontSize: 120, scale: String(s)}}>Pop</div></AbsoluteFill>;
};
```

#### staticFile()

Access file from `public/` folder — [docs](https://www.remotion.dev/docs/staticfile)

```tsx
// staticFile.tsx
import {Img, staticFile} from 'remotion';
// URL for a file in /public. Never use relative paths or `import` for media.
export const MyComp = () => <Img src={staticFile('brand/logo.png')} />;
```

#### <Still>

Define a still — [docs](https://www.remotion.dev/docs/still)

```tsx
// Still.tsx
import {Still} from 'remotion';
const Thumb: React.FC<{title: string}> = ({title}) => <div style={{fontSize: 100}}>{title}</div>;
// Single-frame composition — render with `npx remotion still Thumbnail out.png`.
export const Root = () => <Still id="Thumbnail" component={Thumb} width={1280} height={720} defaultProps={{title: 'Fixed rate ending?'}} />;
```

#### useCurrentFrame()

Obtain the current time — [docs](https://www.remotion.dev/docs/use-current-frame)

```tsx
// useCurrentFrame.tsx
import {AbsoluteFill, useCurrentFrame} from 'remotion';
// The single source of time. Relative to the nearest parent <Sequence>.
export const MyComp = () => <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 120}}>{useCurrentFrame()}</AbsoluteFill>;
```

#### useVideoConfig()

Get the duration, dimensions and FPS of a composition — [docs](https://www.remotion.dev/docs/use-video-config)

```tsx
// useVideoConfig.tsx
import {useVideoConfig} from 'remotion';
// width, height, fps, durationInFrames, id, defaultProps of the current composition.
export const MyComp = () => {
  const {width, height, fps, durationInFrames} = useVideoConfig();
  return <div>{width}×{height} @ {fps}fps, {(durationInFrames / fps).toFixed(1)}s</div>;
};
```

#### VERSION

Get the current version of Remotion — [docs](https://www.remotion.dev/docs/version)

```ts
// VERSION.ts
import {VERSION} from 'remotion';
// Installed Remotion version string, e.g. "4.0.529".
console.log(VERSION);
```

#### Interactive.withSchema()

Expose component props as Studio timeline controls — [docs](https://www.remotion.dev/docs/interactive-with-schema)

```tsx
// Interactive.withSchema.tsx
import {forwardRef, useImperativeHandle, useRef} from 'react';
import {Interactive, Sequence, type InteractiveBaseProps, type InteractiveTransformProps, type InteractivitySchema, type SequenceControls} from 'remotion';
// Turns a component's props into Studio timeline controls (drag, keyframe, write back to code).
type BadgeProps = InteractiveBaseProps & InteractiveTransformProps & {readonly color?: string; readonly radius?: number};
const schema = {
  ...Interactive.baseSchema,
  radius: {type: 'number', min: 1, step: 1, default: 80, description: 'Radius', hiddenFromList: false},
  color: {type: 'color', default: '#F5B400', description: 'Color'},
  ...Interactive.transformSchema,
} as const satisfies InteractivitySchema;
const Inner = forwardRef<HTMLDivElement, BadgeProps & {readonly controls: SequenceControls | undefined}>(
  ({radius = 80, color = '#F5B400', name, style, controls, ...seq}, ref) => {
    const el = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => el.current as HTMLDivElement, []);
    return (
      <Sequence layout="none" {...seq} name={name ?? '<Badge>'} controls={controls}>
        <div ref={el} style={{...style, width: radius * 2, height: radius * 2, borderRadius: '50%', backgroundColor: color}} />
      </Sequence>
    );
  },
);
export const Badge = Interactive.withSchema({Component: Inner, componentName: '<Badge>', schema, supportsEffects: false});
export const MyComp = () => <Badge radius={120} color="#1C4E80" />;
```

## @remotion/captions


#### Caption

An object shape for captions — [docs](https://www.remotion.dev/docs/captions/caption)

```ts
// Caption.ts
import type {Caption} from '@remotion/captions';
// The shared caption shape every transcription package converts into.
export const captions: Caption[] = [
  {text: 'Hello', startMs: 0, endMs: 500, timestampMs: 250, confidence: 0.98},
  {text: ' there', startMs: 500, endMs: 900, timestampMs: 700, confidence: 0.95},
];
```

#### parseSrt()

Parse a .srt file into a `Caption` array — [docs](https://www.remotion.dev/docs/captions/parse-srt)

```ts
// parseSrt.ts
import fs from 'fs';
import {parseSrt} from '@remotion/captions';
// .srt → Caption[]
const {captions} = parseSrt({input: fs.readFileSync('public/subs.srt', 'utf-8')});
console.log(captions.length);
```

#### serializeSrt()

Serialize a .srt file into a `Caption` array — [docs](https://www.remotion.dev/docs/captions/serialize-srt)

```ts
// serializeSrt.ts
import fs from 'fs';
import {serializeSrt, type Caption} from '@remotion/captions';
// Caption[][] (one inner array per subtitle line) → .srt text
const lines: Caption[][] = [[{text: 'Fixed rate ending?', startMs: 0, endMs: 1500, timestampMs: 750, confidence: 1}]];
fs.writeFileSync('out/subs.srt', serializeSrt({lines}));
```

#### createTikTokStyleCaptions()

Structure the captions for TikTok-style display — [docs](https://www.remotion.dev/docs/captions/create-tiktok-style-captions)

```tsx
// createTikTokStyleCaptions.tsx
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
// Groups word-level captions into short "pages"; combineTokensWithinMilliseconds sets words per page.
const captions: Caption[] = [
  {text: 'Your', startMs: 0, endMs: 300, timestampMs: 150, confidence: 1},
  {text: ' fixed', startMs: 300, endMs: 600, timestampMs: 450, confidence: 1},
  {text: ' rate', startMs: 600, endMs: 900, timestampMs: 750, confidence: 1},
];
export const MyComp = () => {
  const {fps} = useVideoConfig();
  const {pages} = createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 800});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {pages.map((p) => (
        <Sequence key={p.startMs} from={Math.round((p.startMs / 1000) * fps)} durationInFrames={Math.max(1, Math.round((p.durationMs / 1000) * fps))}>
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 90, color: 'white', whiteSpace: 'pre'}}>{p.text}</AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

## @remotion/google-fonts


#### loadFont()

Load a Google Font — [docs](https://www.remotion.dev/docs/google-fonts/load-font)

```tsx
// loadFont.tsx
import {loadFont} from '@remotion/google-fonts/BeVietnamPro';
// Load only the weights + subsets you use (each is a network request during render).
const {fontFamily, waitUntilDone} = loadFont('normal', {weights: ['400', '700'], subsets: ['latin', 'vietnamese']});
export const ready = waitUntilDone();
export const MyComp = () => <h1 style={{fontFamily, fontWeight: 700}}>Vay mua nhà lần đầu</h1>;
```

#### loadVariableFont()

Load a variable Google Font — [docs](https://www.remotion.dev/docs/google-fonts/load-variable-font)

```tsx
// loadVariableFont.tsx
import {loadVariableFont} from '@remotion/google-fonts/NotoSans';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Variable font with axes you can animate (wght here).
const {axes, fontFamily} = loadVariableFont('normal', {subsets: ['latin']});
export const MyComp = () => (
  <AbsoluteFill style={{fontFamily, fontSize: 120, fontWeight: interpolate(useCurrentFrame(), [0, 90], [axes.wght.min, axes.wght.max])}}>Weight</AbsoluteFill>
);
```

#### getAvailableFonts()

Static list of available fonts — [docs](https://www.remotion.dev/docs/google-fonts/get-available-fonts)

```ts
// getAvailableFonts.ts
import {getAvailableFonts} from '@remotion/google-fonts';
// Every font: {fontFamily, importName, load()} — for building a font picker.
const fonts = getAvailableFonts();
console.log(fonts.length, fonts.find((f) => f.fontFamily === 'Inter')?.importName);
```

#### getInfo()

Metadata about a specific font — [docs](https://www.remotion.dev/docs/google-fonts/get-info)

```ts
// getInfo.ts
import {getInfo} from '@remotion/google-fonts/Montserrat';
// Metadata (styles, weights, subsets, file URLs) without loading the font.
const info = getInfo();
console.log(info.fontFamily, Object.keys(info.fonts));
```

#### loadFontFromInfo()

Load a Google Font based on metadata — [docs](https://www.remotion.dev/docs/google-fonts/load-font-from-info)

```ts
// loadFontFromInfo.ts
import {getInfo} from '@remotion/google-fonts/InterTight';
import {loadFontFromInfo} from '@remotion/google-fonts/from-info';
// Load from an info object (e.g. sent from your server) instead of importing the font module.
const {fontFamily} = loadFontFromInfo(getInfo(), 'normal', {weights: ['700'], subsets: ['latin']});
console.log(fontFamily);
```

#### loadVariableFontFromInfo()

Load a variable Google Font based on metadata — [docs](https://www.remotion.dev/docs/google-fonts/load-variable-font-from-info)

```ts
// loadVariableFontFromInfo.ts
import {getInfo} from '@remotion/google-fonts/NotoSans';
import {loadVariableFontFromInfo} from '@remotion/google-fonts/from-info';
const {axes, fontFamily, waitUntilDone} = loadVariableFontFromInfo(getInfo(), 'normal', {subsets: ['latin']});
console.log(fontFamily, axes.wght);
await waitUntilDone();
```

## @remotion/light-leaks


#### `lightLeak()`

Apply a light leak as a canvas effect — [docs](https://www.remotion.dev/docs/light-leaks/light-leak-effect)

```tsx
// lightLeak-effect.tsx
import {lightLeak} from '@remotion/light-leaks';
import {CanvasImage, interpolate, staticFile, useCurrentFrame} from 'remotion';
// Effect form: applies a light leak to a canvas component; you drive `progress`.
export const MyComp = () => {
  const progress = interpolate(useCurrentFrame(), [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <CanvasImage src={staticFile('image.png')} width={1280} height={720} fit="cover" effects={[lightLeak({seed: 3, hueShift: 30, progress})]} />;
};
```

#### <LightLeak>

Render a light leak effect — [docs](https://www.remotion.dev/docs/light-leaks/light-leak)

```tsx
// LightLeak-component.tsx
import {LightLeak} from '@remotion/light-leaks';
import {AbsoluteFill, Sequence} from 'remotion';
// Component form: a self-timed leak overlay. Great at scene cuts.
export const MyComp = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <Sequence from={45} durationInFrames={40}><LightLeak durationInFrames={40} seed={7} hueShift={0} /></Sequence>
  </AbsoluteFill>
);
```

## @remotion/media


#### <Video>

WebCodecs-based tag for embedding videos — [docs](https://www.remotion.dev/docs/media/video)

```tsx
// Video.tsx
import {Video} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
// WebCodecs-based video tag: trim, speed, volume, loop; works in Studio, Player and render.
export const MyComp = () => (
  <AbsoluteFill>
    <Video src={staticFile('talking-head.mp4')} trimBefore={30} trimAfter={900} playbackRate={1.1} volume={(f) => (f < 15 ? f / 15 : 1)} objectFit="cover" />
  </AbsoluteFill>
);
```

#### <Audio>

WebCodecs-based tag for embedding audio — [docs](https://www.remotion.dev/docs/media/audio)

```tsx
// Audio.tsx
import {Audio} from '@remotion/media';
import {Sequence, staticFile} from 'remotion';
// Audio track: position with <Sequence>, trim, loop, volume curve.
export const MyComp = () => (
  <>
    <Audio src={staticFile('voiceover.mp3')} />
    <Sequence from={0}><Audio src={staticFile('music.mp3')} volume={0.12} loop /></Sequence>
  </>
);
```

## @remotion/motion-blur


#### <HtmlInCanvasMotionBlur>

Sample HTML across a frame for the best motion blur result — [docs](https://www.remotion.dev/docs/motion-blur/html-in-canvas-motion-blur)

```tsx
// HtmlInCanvasMotionBlur.tsx
import {HtmlInCanvasMotionBlur} from '@remotion/motion-blur';
import {useCurrentFrame, useVideoConfig} from 'remotion';
// Real motion blur via HTML-in-canvas (needs browser support).
const Box = () => <div style={{position: 'absolute', left: useCurrentFrame() * 10, top: 300, width: 120, height: 120, backgroundColor: '#ff6b6b'}} />;
export const MyComp = () => {
  const {width, height} = useVideoConfig();
  return <HtmlInCanvasMotionBlur width={width} height={height} samples={8} shutterAngle={180}><Box /></HtmlInCanvasMotionBlur>;
};
```

#### <CameraMotionBlur>

Add a natural camera motion blur effect to children — [docs](https://www.remotion.dev/docs/motion-blur/camera-motion-blur)

```tsx
// CameraMotionBlur.tsx
import {CameraMotionBlur} from '@remotion/motion-blur';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Renders sub-frames and averages them. Cost scales with `samples`.
const Mover = () => <div style={{width: 150, height: 150, background: '#1C4E80', translate: `${interpolate(useCurrentFrame(), [0, 20], [0, 1500], {extrapolateRight: 'clamp'})}px 400px`}} />;
export const MyComp = () => <CameraMotionBlur shutterAngle={180} samples={10}><AbsoluteFill><Mover /></AbsoluteFill></CameraMotionBlur>;
```

#### <Trail>

Add a trail effect to children — [docs](https://www.remotion.dev/docs/motion-blur/trail)

```tsx
// Trail.tsx
import {Trail} from '@remotion/motion-blur';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Stacks delayed copies for a streak/trail effect.
const Dot = () => <div style={{width: 80, height: 80, borderRadius: 40, background: '#F5B400', translate: `${interpolate(useCurrentFrame(), [0, 40], [0, 1600], {extrapolateRight: 'clamp'})}px 500px`}} />;
export const MyComp = () => <Trail layers={30} lagInFrames={0.15} trailOpacity={0.8}><AbsoluteFill><Dot /></AbsoluteFill></Trail>;
```

## @remotion/renderer


#### getCompositions()

List available compositions — [docs](https://www.remotion.dev/docs/renderer/get-compositions)

```ts
// getCompositions.ts
import {bundle} from '@remotion/bundler';
import {getCompositions} from '@remotion/renderer';
// Lists every composition (id, size, fps, duration, resolved props) in a bundle.
const serveUrl = await bundle({entryPoint: './src/index.ts'});
const comps = await getCompositions(serveUrl, {inputProps: {}});
console.log(comps.map((c) => `${c.id} ${c.width}x${c.height} ${c.durationInFrames}f`));
```

#### selectComposition()

Get a composition — [docs](https://www.remotion.dev/docs/renderer/select-composition)

```ts
// selectComposition.ts
import {selectComposition} from '@remotion/renderer';
// Resolves ONE composition incl. calculateMetadata() with your inputProps. Use this before renderMedia().
const composition = await selectComposition({serveUrl: './build', id: 'MyComp', inputProps: {title: 'Hi'}});
console.log(composition.durationInFrames, composition.props);
```

#### renderMedia()

Render a video or audio — [docs](https://www.remotion.dev/docs/renderer/render-media)

```ts
// renderMedia.ts
import {renderMedia, selectComposition} from '@remotion/renderer';
// Render video/audio. Key options: codec, crf, concurrency, audioCodec, frameRange, scale.
const serveUrl = './build';
const inputProps = {title: 'Fixed rate ending?'};
const composition = await selectComposition({serveUrl, id: 'MyComp', inputProps});
await renderMedia({
  composition, serveUrl, inputProps, codec: 'h264', crf: 18, outputLocation: 'out/reel.mp4',
  concurrency: 4, onProgress: ({progress, renderedFrames, encodedFrames}) => console.log(Math.round(progress * 100), renderedFrames, encodedFrames),
});
```

#### renderFrames()

Render a series of images — [docs](https://www.remotion.dev/docs/renderer/render-frames)

```ts
// renderFrames.ts
import {renderFrames, selectComposition} from '@remotion/renderer';
// Lower-level: writes image frames only (pair with stitchFramesToVideo). Prefer renderMedia().
const serveUrl = './build';
const composition = await selectComposition({serveUrl, id: 'MyComp', inputProps: {}});
await renderFrames({
  composition, serveUrl, inputProps: {}, outputDir: 'out/frames', imageFormat: 'jpeg',
  onStart: ({frameCount}) => console.log('frames', frameCount), onFrameUpdate: (done) => console.log(done),
});
```

#### renderStill()

Render a single image — [docs](https://www.remotion.dev/docs/renderer/render-still)

```ts
// renderStill.ts
import {renderStill, selectComposition} from '@remotion/renderer';
// Single frame to PNG/JPEG/WebP/PDF — thumbnails and social images.
const serveUrl = './build';
const composition = await selectComposition({serveUrl, id: 'Thumbnail', inputProps: {title: 'Refinance'}});
await renderStill({composition, serveUrl, output: 'out/thumb.png', frame: 0, imageFormat: 'png', inputProps: {title: 'Refinance'}});
```

#### stitchFramesToVideo()

Turn images into a video — [docs](https://www.remotion.dev/docs/renderer/stitch-frames-to-video)

```ts
// stitchFramesToVideo.ts
import {renderFrames, selectComposition, stitchFramesToVideo} from '@remotion/renderer';
// Encodes frames written by renderFrames() into a video, reusing its assetsInfo (audio/media). Prefer renderMedia().
const serveUrl = './build';
const composition = await selectComposition({serveUrl, id: 'MyComp', inputProps: {}});
const {assetsInfo} = await renderFrames({composition, serveUrl, inputProps: {}, outputDir: 'out/frames', imageFormat: 'jpeg', onStart: () => undefined, onFrameUpdate: () => undefined});
await stitchFramesToVideo({assetsInfo, fps: composition.fps, width: composition.width, height: composition.height, outputLocation: 'out/stitched.mp4', codec: 'h264'});
```

#### openBrowser()

Open a Chrome browser to reuse across renders — [docs](https://www.remotion.dev/docs/renderer/open-browser)

```ts
// openBrowser.ts
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
// Reuse one Chrome instance across many renders (faster batches).
const puppeteerInstance = await openBrowser('chrome');
const serveUrl = './build';
for (const title of ['A', 'B', 'C']) {
  const composition = await selectComposition({serveUrl, id: 'Thumbnail', inputProps: {title}, puppeteerInstance});
  await renderStill({composition, serveUrl, output: `out/${title}.png`, inputProps: {title}, puppeteerInstance});
}
await puppeteerInstance.close({silent: false});
```

#### ensureBrowser()

Open a Chrome browser to reuse across renders — [docs](https://www.remotion.dev/docs/renderer/ensure-browser)

```ts
// ensureBrowser.ts
import {ensureBrowser} from '@remotion/renderer';
// Downloads Chrome Headless Shell if missing — run at deploy/startup, not per render.
await ensureBrowser({onBrowserDownload: () => ({version: null, onProgress: ({percent}) => console.log(percent)})});
```

#### makeCancelSignal()

Create token to later cancel a render — [docs](https://www.remotion.dev/docs/renderer/make-cancel-signal)

```ts
// makeCancelSignal.ts
import {makeCancelSignal, renderMedia, selectComposition} from '@remotion/renderer';
// Cancel an in-flight render (renderMedia rejects with a cancellation error).
const {cancelSignal, cancel} = makeCancelSignal();
const serveUrl = './build';
const composition = await selectComposition({serveUrl, id: 'MyComp', inputProps: {}});
setTimeout(cancel, 10_000);
await renderMedia({composition, serveUrl, codec: 'h264', outputLocation: 'out/x.mp4', cancelSignal}).catch((e) => console.log('cancelled', e));
```

#### getVideoMetadata() (deprecated)

Get metadata from a video file in Node.js — [docs](https://www.remotion.dev/docs/renderer/get-video-metadata)

```ts
// getVideoMetadata.ts
import {getVideoMetadata} from '@remotion/renderer';
// DEPRECATED — use parseMedia() from @remotion/media-parser instead.
const meta = await getVideoMetadata('public/talking-head.mp4');
console.log(meta.durationInSeconds, meta.width, meta.height, meta.fps);
```

#### getSilentParts()

Obtain silent portions of a video or audio — [docs](https://www.remotion.dev/docs/renderer/get-silent-parts)

```ts
// getSilentParts.ts
import {getSilentParts} from '@remotion/renderer';
// Find pauses in a talking-head clip → auto-cut them.
const {silentParts, audibleParts, durationInSeconds} = await getSilentParts({
  src: 'public/talking-head.mp4', noiseThresholdInDecibels: -30, minDurationInSeconds: 0.4,
});
console.log(durationInSeconds, silentParts.length, audibleParts);
```

#### combineChunks()

Combine chunks of partial renders — [docs](https://www.remotion.dev/docs/renderer/combine-chunks)

```ts
// combineChunks.ts
import {combineChunks} from '@remotion/renderer';
// Join separately rendered chunks (distributed rendering) into one file.
await combineChunks({
  outputLocation: 'out/final.mp4', videoFiles: ['out/c1.mp4', 'out/c2.mp4'], audioFiles: ['out/c1.aac', 'out/c2.aac'],
  codec: 'h264', fps: 30, framesPerChunk: 150, audioCodec: 'aac', preferLossless: false, compositionDurationInFrames: 300,
});
```

#### ensureFfmpeg() ⟨deprecated⟩

Check for ffmpeg binary and install if not existing — [docs](https://www.remotion.dev/docs/renderer/ensure-ffmpeg)

_No example: deprecated and not exported by v4.0.529._


#### ensureFfprobe() ⟨deprecated⟩

Check for ffprobe binary and install if not existing — [docs](https://www.remotion.dev/docs/renderer/ensure-ffprobe)

_No example: deprecated and not exported by v4.0.529._


#### getCanExtractFramesFast() ⟨deprecated⟩

Probes for fast extraction for — [docs](https://www.remotion.dev/docs/renderer/get-can-extract-frames-fast)

_No example: deprecated and not exported by v4.0.529._


## @remotion/transitions


### Components


#### `<TransitionSeries>`

A `<Series>` with transitions inbetween — [docs](https://www.remotion.dev/docs/transitions/transitionseries)

```tsx
// TransitionSeries.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Scene} from './_Scene';
// A <Series> whose neighbours overlap during each Transition. Duration = sum(sequences) − sum(transitions).
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
    <TransitionSeries.Overlay durationInFrames={20}><div /></TransitionSeries.Overlay>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#F5B400" t="C" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

### Timings


#### `springTiming()`

Transition with a `spring()` — [docs](https://www.remotion.dev/docs/transitions/timings/springtiming)

```tsx
// springTiming.tsx
import {TransitionSeries, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {Scene} from './_Scene';
// Spring-driven progress. getDurationInFrames() tells you how long it takes.
const timing = springTiming({config: {damping: 200}, durationInFrames: 25, durationRestThreshold: 0.001});
export const frames = timing.getDurationInFrames({fps: 30});
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide()} timing={timing} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `linearTiming()`

Transition linearly with optional Easing — [docs](https://www.remotion.dev/docs/transitions/timings/lineartiming)

```tsx
// linearTiming.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {wipe} from '@remotion/transitions/wipe';
import {Easing} from 'remotion';
import {Scene} from './_Scene';
// Fixed duration, optional easing.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: 'from-left'})} timing={linearTiming({durationInFrames: 18, easing: Easing.inOut(Easing.ease)})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### Custom timings

Implement your own timing — [docs](https://www.remotion.dev/docs/transitions/timings/custom)

```tsx
// customTiming.tsx
import {TransitionSeries, type TransitionTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Scene} from './_Scene';
// Custom timing = {getDurationInFrames, getProgress}.
const stepped: TransitionTiming = {
  getDurationInFrames: () => 20,
  getProgress: ({frame}) => Math.min(1, Math.floor(frame / 5) / 4),
};
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={stepped} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

### Presentations


#### Custom presentations

Implement your own effect — [docs](https://www.remotion.dev/docs/transitions/presentations/custom)

```tsx
// customPresentation.tsx
import {TransitionSeries, linearTiming, type TransitionPresentation, type TransitionPresentationComponentProps} from '@remotion/transitions';
import {AbsoluteFill} from 'remotion';
import {Scene} from './_Scene';
// Custom presentation: a component that receives presentationProgress + presentationDirection.
type Props = Record<string, never>;
const ScaleIn: React.FC<TransitionPresentationComponentProps<Props>> = ({children, presentationDirection, presentationProgress}) => (
  <AbsoluteFill style={{opacity: presentationDirection === 'entering' ? presentationProgress : 1, scale: presentationDirection === 'entering' ? String(0.8 + 0.2 * presentationProgress) : '1'}}>{children}</AbsoluteFill>
);
const scaleIn = (): TransitionPresentation<Props> => ({component: ScaleIn, props: {}});
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={scaleIn()} timing={linearTiming({durationInFrames: 20})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `fade()`

Animate the opacity of the scenes — [docs](https://www.remotion.dev/docs/transitions/presentations/fade)

```tsx
// fade.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Scene} from './_Scene';
// Crossfade opacity.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `pushCut()`

Punch into a hard cut with a brief flash — [docs](https://www.remotion.dev/docs/transitions/presentations/push-cut)

```tsx
// pushCut.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {pushCut} from '@remotion/transitions/push-cut';
import {Scene} from './_Scene';
// Punch into a hard cut with a brief flash.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={pushCut()} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `slide()`

Slide in and push out the previous scene — [docs](https://www.remotion.dev/docs/transitions/presentations/slide)

```tsx
// slide.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {Scene} from './_Scene';
// Slide in, push out. direction: from-left | from-right | from-top | from-bottom.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `wipe()`

Slide over the previous scene — [docs](https://www.remotion.dev/docs/transitions/presentations/wipe)

```tsx
// wipe.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {wipe} from '@remotion/transitions/wipe';
import {Scene} from './_Scene';
// New scene slides over the old one.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({direction: 'from-top-left'})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `flip()`

Rotate the previous scene — [docs](https://www.remotion.dev/docs/transitions/presentations/flip)

```tsx
// flip.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {flip} from '@remotion/transitions/flip';
import {Scene} from './_Scene';
// 3D rotate the outgoing scene.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={flip({direction: 'from-right', perspective: 1000})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `clockWipe()`

Reveal the new scene in a circular movement — [docs](https://www.remotion.dev/docs/transitions/presentations/clock-wipe)

```tsx
// clockWipe.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {Scene} from './_Scene';
// Circular clock-hand reveal. Needs the composition size.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={clockWipe({width: 1920, height: 1080})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `iris()`

Reveal the scene through a circular mask from center — [docs](https://www.remotion.dev/docs/transitions/presentations/iris)

```tsx
// iris.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {iris} from '@remotion/transitions/iris';
import {Scene} from './_Scene';
// Circular mask opening from centre. Needs the composition size.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={iris({width: 1920, height: 1080})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `zoomBlur()`

Zoom and rotate scenes with a radial blur — [docs](https://www.remotion.dev/docs/transitions/presentations/zoom-blur)

```tsx
// zoomBlur.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {zoomBlur} from '@remotion/transitions/zoom-blur';
import {Scene} from './_Scene';
// WebGL: zoom + rotate with radial blur.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={zoomBlur({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `dreamyZoom()`

Zoom through a white flash with gentle rotation — [docs](https://www.remotion.dev/docs/transitions/presentations/dreamy-zoom)

```tsx
// dreamyZoom.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {dreamyZoom} from '@remotion/transitions/dreamy-zoom';
import {Scene} from './_Scene';
// WebGL: zoom through a white flash.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={dreamyZoom({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `filmBurn()`

Burn through scenes with procedural glow and blur — [docs](https://www.remotion.dev/docs/transitions/presentations/film-burn)

```tsx
// filmBurn.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {filmBurn} from '@remotion/transitions/film-burn';
import {Scene} from './_Scene';
// WebGL: procedural film-burn glow.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={filmBurn({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `linearBlur()`

Blend scenes with a directional multi-sample blur — [docs](https://www.remotion.dev/docs/transitions/presentations/linear-blur)

```tsx
// linearBlur.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {linearBlur} from '@remotion/transitions/linear-blur';
import {Scene} from './_Scene';
// WebGL: directional multi-sample blur blend.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={linearBlur({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `bookFlip()`

Turn the scenes like a shaded book page — [docs](https://www.remotion.dev/docs/transitions/presentations/book-flip)

```tsx
// bookFlip.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {bookFlip} from '@remotion/transitions/book-flip';
import {Scene} from './_Scene';
// WebGL: shaded page turn.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={bookFlip({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `zoomInOut()`

Zoom one scene in, crossfade, zoom the next out — [docs](https://www.remotion.dev/docs/transitions/presentations/zoom-in-out)

```tsx
// zoomInOut.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {zoomInOut} from '@remotion/transitions/zoom-in-out';
import {Scene} from './_Scene';
// WebGL: zoom one in, crossfade, zoom next out.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={zoomInOut({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `dissolve()`

Burn through the previous scene with a glowing edge — [docs](https://www.remotion.dev/docs/transitions/presentations/dissolve)

```tsx
// dissolve.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {dissolve} from '@remotion/transitions/dissolve';
import {Scene} from './_Scene';
// WebGL: burn-through with glowing edge.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={dissolve({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `ripple()`

Ripple the outgoing scene with a sinusoidal wave — [docs](https://www.remotion.dev/docs/transitions/presentations/ripple)

```tsx
// ripple.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {ripple} from '@remotion/transitions/ripple';
import {Scene} from './_Scene';
// WebGL: sinusoidal ripple.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={ripple({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `crosswarp()`

Warp both scenes across the x-axis and blend them — [docs](https://www.remotion.dev/docs/transitions/presentations/crosswarp)

```tsx
// crosswarp.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {crosswarp} from '@remotion/transitions/crosswarp';
import {Scene} from './_Scene';
// WebGL: warp both scenes along x.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={crosswarp({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `crossZoom()`

Zoom both scenes through a moving center and blur — [docs](https://www.remotion.dev/docs/transitions/presentations/cross-zoom)

```tsx
// crossZoom.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {crossZoom} from '@remotion/transitions/cross-zoom';
import {Scene} from './_Scene';
// WebGL: zoom through a moving centre with blur.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={crossZoom({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `swap()`

Swap scenes with perspective and reflections — [docs](https://www.remotion.dev/docs/transitions/presentations/swap)

```tsx
// swap.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {swap} from '@remotion/transitions/swap';
import {Scene} from './_Scene';
// WebGL: perspective swap with reflections.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={swap({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `blurSlide()`

Whip both scenes sideways with a motion blur — [docs](https://www.remotion.dev/docs/transitions/presentations/blur-slide)

```tsx
// blurSlide.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {blurSlide} from '@remotion/transitions/blur-slide';
import {Scene} from './_Scene';
// WebGL: sideways whip with motion blur.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={blurSlide({})} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### `cube()`

Rotate both scenes with 3D perspective — [docs](https://www.remotion.dev/docs/transitions/presentations/cube)

_No example: documented but not exported by v4.0.529 — upgrade when it ships._


#### `none()`

Have no visual effect. — [docs](https://www.remotion.dev/docs/transitions/presentations/none)

```tsx
// none.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {none} from '@remotion/transitions/none';
import {Scene} from './_Scene';
// No visual — useful with audio-only transitions or TransitionSeries timing.
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={none()} timing={linearTiming({durationInFrames: 30})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

#### Audio transitions

Add a sound effect to a transition — [docs](https://www.remotion.dev/docs/transitions/audio-transitions)

```tsx
// audioTransition.tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {whoosh} from '@remotion/sfx';
import {Audio} from '@remotion/media';
import {Sequence} from 'remotion';
import {Scene} from './_Scene';
// Audio transition: place a sound effect at the transition start (frame 60 − overlap).
export const MyComp = () => (
  <>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="A" /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide()} timing={linearTiming({durationInFrames: 20})} />
      <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="B" /></TransitionSeries.Sequence>
    </TransitionSeries>
    <Sequence from={40}><Audio src={whoosh} /></Sequence>
  </>
);
```

#### Shared helper used above

```tsx
// _Scene.tsx
import {AbsoluteFill} from 'remotion';
export const Scene: React.FC<{c: string; t: string}> = ({c, t}) => (
  <AbsoluteFill style={{backgroundColor: c, justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 110}}>{t}</AbsoluteFill>
);
```

#### useTransitionProgress() (exported, not in docs table)

```tsx
// useTransitionProgress.tsx
import {TransitionSeries, linearTiming, useTransitionProgress} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {AbsoluteFill} from 'remotion';
// Inside a sequence: read how far its entering/exiting transition has progressed.
const Title = () => {
  const {entering, exiting} = useTransitionProgress();
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 100, translate: `0px ${(1 - entering) * 80}px`, opacity: 1 - exiting}}>Title</AbsoluteFill>;
};
export const MyComp = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Title /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 20})} />
    <TransitionSeries.Sequence durationInFrames={60}><Title /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```


Covers `@remotion/paths`, `@remotion/shapes`, `@remotion/noise`, `@remotion/layout-utils`, `@remotion/animation-utils`, `@remotion/rough-notation`, `@remotion/starburst`, `@remotion/mac-cursors`, `@remotion/sfx`. Every snippet type-checks under `tsc --strict` against v4.0.529. Assets referenced via `staticFile()` (logo.png, talking-head.mp4, music.mp3…) are placeholders — put your own files in `public/`. 


## @remotion/animation-utils


#### makeTransform()

Create a value for the CSS `transform` property — [docs](https://www.remotion.dev/docs/animation-utils/make-transform)

```tsx
// makeTransform.tsx
import {makeTransform, rotate, scale, translate} from '@remotion/animation-utils';
import {interpolate, useCurrentFrame} from 'remotion';
// Builds a type-safe transform string from helpers (translate, rotate, scale, skew, matrix, perspective…).
export const MyComp = () => {
  const f = useCurrentFrame();
  const transform = makeTransform([translate(interpolate(f, [0, 30], [-200, 0], {extrapolateRight: 'clamp'}), 0), rotate(f * 2), scale(1.2)]);
  return <div style={{transform, width: 120, height: 120, background: '#1C4E80'}} />;
};
```

#### interpolateStyles()

Map a range of values to CSS `style` values — [docs](https://www.remotion.dev/docs/animation-utils/interpolate-styles)

```tsx
// interpolateStyles.tsx
import {interpolateStyles, makeTransform, translateY} from '@remotion/animation-utils';
import {useCurrentFrame} from 'remotion';
// Interpolate whole style objects (numbers, colours, transforms) across keyframes.
export const MyComp = () => (
  <h1 style={interpolateStyles(useCurrentFrame(), [0, 20, 40], [
    {opacity: 0, color: '#ffffff', transform: makeTransform([translateY(60)])},
    {opacity: 1, color: '#F5B400', transform: makeTransform([translateY(0)])},
    {opacity: 1, color: '#ffffff', transform: makeTransform([translateY(0)])},
  ])}>Keyframed styles</h1>
);
```

## @remotion/layout-utils


#### measureText()

Get dimensions of text — [docs](https://www.remotion.dev/docs/layout-utils/measure-text)

```tsx
// measureText.tsx
import {measureText} from '@remotion/layout-utils';
// Pixel width/height of a string in a given font (font must be loaded first).
const {width, height} = measureText({text: 'Refinance', fontFamily: 'Arial', fontSize: 80, fontWeight: 'bold'});
export const MyComp = () => <div style={{width: width + 40, height, background: '#F5B400', fontFamily: 'Arial', fontSize: 80, fontWeight: 'bold', padding: '0 20px'}}>Refinance</div>;
```

#### fillTextBox()

Find line breaks and overflows in a text box — [docs](https://www.remotion.dev/docs/layout-utils/fill-text-box)

```tsx
// fillTextBox.tsx
import {fillTextBox} from '@remotion/layout-utils';
// Add words one by one; tells you when a word starts a new line or overflows the box — for word-by-word reveals.
const words = 'Your fixed rate is ending soon — here is what to do next'.split(' ');
const box = fillTextBox({maxBoxWidth: 800, maxLines: 2});
const fits = words.filter((w, i) => !box.add({text: (i ? ' ' : '') + w, fontFamily: 'Arial', fontSize: 60}).exceedsBox);
export const MyComp = () => <div style={{width: 800, fontFamily: 'Arial', fontSize: 60}}>{fits.join(' ')}</div>;
```

#### fitText()

Get font size to fit text in a box — [docs](https://www.remotion.dev/docs/layout-utils/fit-text)

```tsx
// fitText.tsx
import {fitText} from '@remotion/layout-utils';
// Largest font size so a single line fills `withinWidth`.
const text = 'Lãi suất tốt hơn';
const {fontSize} = fitText({text, withinWidth: 1600, fontFamily: 'Arial', fontWeight: 700});
export const MyComp = () => <div style={{fontSize: Math.min(fontSize, 200), fontFamily: 'Arial', fontWeight: 700, whiteSpace: 'nowrap'}}>{text}</div>;
```

#### fitTextOnNLines()

Get font size to fit text on n lines — [docs](https://www.remotion.dev/docs/layout-utils/fit-text-on-n-lines)

```tsx
// fitTextOnNLines.tsx
import {fitTextOnNLines} from '@remotion/layout-utils';
// Largest font size where text wraps into at most N lines within a width; returns the lines too.
const {fontSize, lines} = fitTextOnNLines({text: 'Five things to check before your fixed rate ends', maxLines: 2, maxBoxWidth: 900, fontFamily: 'Arial', fontWeight: 700, maxFontSize: 140});
export const MyComp = () => <div style={{fontSize, fontFamily: 'Arial', fontWeight: 700, width: 900}}>{lines.map((l) => <div key={l}>{l}</div>)}</div>;
```

## @remotion/rough-notation


#### <Box>

Draw a box around text — [docs](https://www.remotion.dev/docs/rough-notation/box)

```tsx
// Box.tsx
import {Box} from '@remotion/rough-notation';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Rough box around text. `progress` 0→1 draws it on; `seed` changes the hand-drawn wobble.
export const MyComp = () => {
  const progress = interpolate(useCurrentFrame(), [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 90, fontFamily: 'Arial'}}>
      <div>Save <Box progress={progress} seed={2} color="#E03131" strokeWidth={4} padding={{left: 10, right: 10, top: 6, bottom: 6}}>thousands</Box> a year</div>
    </AbsoluteFill>
  );
};
```

#### <Bracket>

Draw brackets beside text — [docs](https://www.remotion.dev/docs/rough-notation/bracket)

```tsx
// Bracket.tsx
import {Bracket} from '@remotion/rough-notation';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Brackets on chosen sides. `progress` 0→1 draws it on; `seed` changes the hand-drawn wobble.
export const MyComp = () => {
  const progress = interpolate(useCurrentFrame(), [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 90, fontFamily: 'Arial'}}>
      <div>Save <Bracket progress={progress} seed={2} color="#1C4E80" strokeWidth={5} bracketLeft bracketRight padding={{left: 10, right: 10, top: 6, bottom: 6}}>thousands</Bracket> a year</div>
    </AbsoluteFill>
  );
};
```

#### <Circle>

Circle text — [docs](https://www.remotion.dev/docs/rough-notation/circle)

```tsx
// Circle.tsx
import {Circle} from '@remotion/rough-notation';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Hand-drawn circle. `progress` 0→1 draws it on; `seed` changes the hand-drawn wobble.
export const MyComp = () => {
  const progress = interpolate(useCurrentFrame(), [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 90, fontFamily: 'Arial'}}>
      <div>Save <Circle progress={progress} seed={2} color="#E03131" strokeWidth={4} padding={{left: 16, right: 16, top: 16, bottom: 16}}>thousands</Circle> a year</div>
    </AbsoluteFill>
  );
};
```

#### <CrossedOff>

Cross off text with two strokes — [docs](https://www.remotion.dev/docs/rough-notation/crossed-off)

```tsx
// CrossedOff.tsx
import {CrossedOff} from '@remotion/rough-notation';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// X through the text. `progress` 0→1 draws it on; `seed` changes the hand-drawn wobble.
export const MyComp = () => {
  const progress = interpolate(useCurrentFrame(), [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 90, fontFamily: 'Arial'}}>
      <div>Save <CrossedOff progress={progress} seed={2} color="#E03131" strokeWidth={5}>thousands</CrossedOff> a year</div>
    </AbsoluteFill>
  );
};
```

#### <Highlight>

Draw a marker highlight behind text — [docs](https://www.remotion.dev/docs/rough-notation/highlight)

```tsx
// Highlight.tsx
import {Highlight} from '@remotion/rough-notation';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Marker highlight behind text. `progress` 0→1 draws it on; `seed` changes the hand-drawn wobble.
export const MyComp = () => {
  const progress = interpolate(useCurrentFrame(), [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 90, fontFamily: 'Arial'}}>
      <div>Save <Highlight progress={progress} seed={2} color="#FFE066">thousands</Highlight> a year</div>
    </AbsoluteFill>
  );
};
```

#### <StrikeThrough>

Strike through text with one line — [docs](https://www.remotion.dev/docs/rough-notation/strike-through)

```tsx
// StrikeThrough.tsx
import {StrikeThrough} from '@remotion/rough-notation';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Line through the text. `progress` 0→1 draws it on; `seed` changes the hand-drawn wobble.
export const MyComp = () => {
  const progress = interpolate(useCurrentFrame(), [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 90, fontFamily: 'Arial'}}>
      <div>Save <StrikeThrough progress={progress} seed={2} color="#E03131" strokeWidth={5}>thousands</StrikeThrough> a year</div>
    </AbsoluteFill>
  );
};
```

#### <Underline>

Underline text — [docs](https://www.remotion.dev/docs/rough-notation/underline)

```tsx
// Underline.tsx
import {Underline} from '@remotion/rough-notation';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Scribbled underline. `progress` 0→1 draws it on; `seed` changes the hand-drawn wobble.
export const MyComp = () => {
  const progress = interpolate(useCurrentFrame(), [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 90, fontFamily: 'Arial'}}>
      <div>Save <Underline progress={progress} seed={2} color="#355F8F" strokeWidth={8} iterations={2}>thousands</Underline> a year</div>
    </AbsoluteFill>
  );
};
```

## @remotion/mac-cursors


#### <MacOSCursor>

Render a macOS or custom CSS cursor — [docs](https://www.remotion.dev/docs/mac-cursors/mac-os-cursor)

```tsx
// MacOSCursor.tsx
import {MacOSCursor, macOSCursorNames} from '@remotion/mac-cursors';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// macOS cursor images for fake screen recordings. Names: see macOSCursorNames.
export const names = macOSCursorNames;
export const MyComp = () => {
  const f = useCurrentFrame();
  const left = interpolate(f, [0, 40], [200, 1100], {extrapolateRight: 'clamp'});
  return <AbsoluteFill><MacOSCursor cursor={f < 40 ? 'default' : 'pointer'} style={{left, top: 500, scale: 2}} /></AbsoluteFill>;
};
```

## @remotion/noise


#### noise2D()

Create 2D noise — [docs](https://www.remotion.dev/docs/noise/noise-2d)

```tsx
// noise2D.tsx
import {noise2D} from '@remotion/noise';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
// Smooth pseudo-random −1…1 from (seed, x, y). Same inputs → same output, so renders are deterministic.
export const MyComp = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><h1 style={{translate: `${noise2D('shake', f * 0.1, 0) * 8}px ${noise2D('shake', 0, f * 0.1) * 8}px`}}>Handheld shake</h1></AbsoluteFill>;
};
```

#### noise3D()

Create 3D noise — [docs](https://www.remotion.dev/docs/noise/noise-3d)

```tsx
// noise3D.tsx
import {noise3D} from '@remotion/noise';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
// Use z = time to animate a 2D field smoothly.
export const MyComp = () => {
  const t = useCurrentFrame() * 0.02;
  return (
    <AbsoluteFill>
      {Array.from({length: 100}, (_, i) => {
        const x = (i % 10) * 190 + 40, y = Math.floor(i / 10) * 105 + 20;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 20, height: 20, borderRadius: 10, background: '#F5B400', opacity: (noise3D('field', x / 400, y / 400, t) + 1) / 2}} />;
      })}
    </AbsoluteFill>
  );
};
```

#### noise4D()

Create 4D noise — [docs](https://www.remotion.dev/docs/noise/noise-4d)

```tsx
// noise4D.tsx
import {noise4D} from '@remotion/noise';
import {useCurrentFrame} from 'remotion';
// 4D: 3D space + time (e.g. drift particles in a 3D scene).
export const MyComp = () => {
  const n = noise4D('drift', 0.5, 0.2, 0.9, useCurrentFrame() * 0.01);
  return <div style={{fontSize: 80}}>{n.toFixed(3)}</div>;
};
```

## @remotion/paths


#### getLength()

Obtain length of an SVG path — [docs](https://www.remotion.dev/docs/paths/get-length)

```ts
// getLength.ts
import {getLength} from '@remotion/paths';
// Total length of an SVG path in user units.
const d = 'M 100 500 C 400 100, 900 900, 1500 300';
console.log(getLength(d));
```

#### cutPath()

Cut an SVG path at a specified length — [docs](https://www.remotion.dev/docs/paths/cut-path)

```tsx
// cutPath.tsx
import {cutPath, getLength} from '@remotion/paths';
import {interpolate, useCurrentFrame} from 'remotion';
// Returns the first N units of a path — draw-on effect with a clean end (no dasharray).
const d = 'M 100 500 C 400 100, 900 900, 1500 300';
export const MyComp = () => {
  const len = interpolate(useCurrentFrame(), [0, 60], [0, getLength(d)], {extrapolateRight: 'clamp'});
  return <svg viewBox="0 0 1920 1080"><path d={cutPath(d, len)} stroke="#F5B400" strokeWidth={8} fill="none" /></svg>;
};
```

#### getPointAtLength()

Get coordinates at a certain point of an SVG path — [docs](https://www.remotion.dev/docs/paths/get-point-at-length)

```tsx
// getPointAtLength.tsx
import {getLength, getPointAtLength} from '@remotion/paths';
import {interpolate, useCurrentFrame} from 'remotion';
// {x, y} at a distance along the path — move an object along a route.
const d = 'M 100 500 C 400 100, 900 900, 1500 300';
export const MyComp = () => {
  const p = getPointAtLength(d, interpolate(useCurrentFrame(), [0, 90], [0, getLength(d)], {extrapolateRight: 'clamp'}));
  return <svg viewBox="0 0 1920 1080"><path d={d} stroke="#334" fill="none" />{p ? <circle cx={p.x} cy={p.y} r={20} fill="#F5B400" /> : null}</svg>;
};
```

#### getTangentAtLength()

Gets tangents `x` and `y` of a point which is on an SVG path — [docs](https://www.remotion.dev/docs/paths/get-tangent-at-length)

```tsx
// getTangentAtLength.tsx
import {getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {interpolate, useCurrentFrame} from 'remotion';
// Direction vector at a point — rotate the moving object to face along the path.
const d = 'M 100 500 C 400 100, 900 900, 1500 300';
export const MyComp = () => {
  const at = interpolate(useCurrentFrame(), [0, 90], [0, getLength(d)], {extrapolateRight: 'clamp'});
  const p = getPointAtLength(d, at); const t = getTangentAtLength(d, at);
  if (!p || !t) return null;
  const angle = (Math.atan2(t.y, t.x) * 180) / Math.PI;
  return <svg viewBox="0 0 1920 1080"><path d={d} stroke="#334" fill="none" /><polygon points="-20,-12 20,0 -20,12" fill="#F5B400" transform={`translate(${p.x} ${p.y}) rotate(${angle})`} /></svg>;
};
```

#### reversePath()

Switch direction of an SVG path — [docs](https://www.remotion.dev/docs/paths/reverse-path)

```ts
// reversePath.ts
import {reversePath} from '@remotion/paths';
// Same shape, opposite drawing direction (makes evolvePath animate from the other end).
const d = 'M 100 500 C 400 100, 900 900, 1500 300';
console.log(reversePath(d));
```

#### normalizePath()

Replace relative with absolute coordinates — [docs](https://www.remotion.dev/docs/paths/normalize-path)

```ts
// normalizePath.ts
import {normalizePath} from '@remotion/paths';
// Converts relative commands (m, l, c…) to absolute M/L/C… — needed before some manual edits.
console.log(normalizePath('m 10 10 l 50 0 l 0 50 z'));
```

#### interpolatePath()

Interpolates between two SVG paths — [docs](https://www.remotion.dev/docs/paths/interpolate-path)

```tsx
// interpolatePath.tsx
import {interpolatePath} from '@remotion/paths';
import {interpolate, useCurrentFrame} from 'remotion';
// Morph between two paths (value 0 → 1).
const square = 'M 100 100 L 300 100 L 300 300 L 100 300 Z';
const diamond = 'M 200 50 L 350 200 L 200 350 L 50 200 Z';
export const MyComp = () => {
  const t = interpolate(useCurrentFrame(), [0, 30], [0, 1], {extrapolateRight: 'clamp'});
  return <svg viewBox="0 0 400 400"><path d={interpolatePath(t, square, diamond)} fill="#1C4E80" /></svg>;
};
```

#### interpolatePaths()

Interpolate SVG paths across multiple keyframes — [docs](https://www.remotion.dev/docs/paths/interpolate-paths)

```tsx
// interpolatePaths.tsx
import {interpolatePaths} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
// Morph through several shapes, like interpolate() with path outputs.
const a = 'M 100 100 L 300 100 L 300 300 L 100 300 Z';
const b = 'M 200 50 L 350 200 L 200 350 L 50 200 Z';
const c = 'M 200 80 L 320 320 L 80 320 Z';
export const MyComp = () => (
  <svg viewBox="0 0 400 400"><path d={interpolatePaths(useCurrentFrame(), [0, 30, 60], [a, b, c], {extrapolateRight: 'clamp'})} fill="#F5B400" /></svg>
);
```

#### evolvePath()

Animate an SVG path — [docs](https://www.remotion.dev/docs/paths/evolve-path)

```tsx
// evolvePath.tsx
import {evolvePath} from '@remotion/paths';
import {interpolate, useCurrentFrame} from 'remotion';
// Stroke dash values that "draw" a path from 0 → 1.
const d = 'M 100 500 C 400 100, 900 900, 1500 300';
export const MyComp = () => {
  const {strokeDasharray, strokeDashoffset} = evolvePath(interpolate(useCurrentFrame(), [0, 60], [0, 1], {extrapolateRight: 'clamp'}), d);
  return <svg viewBox="0 0 1920 1080"><path d={d} stroke="#F5B400" strokeWidth={10} fill="none" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} /></svg>;
};
```

#### centerPath()

Translates an SVG path to center it around a target point — [docs](https://www.remotion.dev/docs/paths/center-path)

```ts
// centerPath.ts
import {centerPath} from '@remotion/paths';
// Moves a path so its bounding box is centred at (0,0) (or a target) — handy before rotating/scaling.
console.log(centerPath('M 100 100 L 300 100 L 300 300 Z'));
```

#### translatePath()

Translates the position of an path against X/Y coordinates — [docs](https://www.remotion.dev/docs/paths/translate-path)

```ts
// translatePath.ts
import {translatePath} from '@remotion/paths';
// Shift every point by x, y.
console.log(translatePath('M 0 0 L 100 0 L 100 100 Z', 50, 20));
```

#### warpPath()

Remap the coordinates of a path — [docs](https://www.remotion.dev/docs/paths/warp-path)

```tsx
// warpPath.tsx
import {warpPath} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
// Apply an arbitrary point transform (wave, bulge…); curves are subdivided to keep it smooth.
const line = 'M 0 200 L 800 200';
export const MyComp = () => {
  const f = useCurrentFrame();
  const d = warpPath(line, ({x, y}) => ({x, y: y + Math.sin(x / 60 + f / 8) * 40}), {interpolationThreshold: 20});
  return <svg viewBox="0 0 800 400"><path d={d} stroke="#1C4E80" strokeWidth={6} fill="none" /></svg>;
};
```

#### scalePath()

Grow or shrink the size of the path — [docs](https://www.remotion.dev/docs/paths/scale-path)

```ts
// scalePath.ts
import {scalePath} from '@remotion/paths';
// Scale x and y independently (about the origin).
console.log(scalePath('M 0 0 L 100 0 L 100 100 Z', 2, 0.5));
```

#### getBoundingBox()

Get the bounding box of a SVG path — [docs](https://www.remotion.dev/docs/paths/get-bounding-box)

```ts
// getBoundingBox.ts
import {getBoundingBox} from '@remotion/paths';
// {x1, y1, x2, y2, width, height, viewBox} — size an <svg> to fit a path.
const box = getBoundingBox('M 100 500 C 400 100, 900 900, 1500 300');
console.log(box.viewBox, box.width, box.height);
```

#### resetPath()

Translates an SVG path to `(0, 0)` — [docs](https://www.remotion.dev/docs/paths/reset-path)

```ts
// resetPath.ts
import {resetPath} from '@remotion/paths';
// Translates a path so its top-left bounding-box corner sits at (0,0).
console.log(resetPath('M 100 100 L 300 100 L 300 300 Z'));
```

#### extendViewBox()

Widen an SVG viewBox in all directions — [docs](https://www.remotion.dev/docs/paths/extend-viewbox)

```ts
// extendViewBox.ts
import {extendViewBox} from '@remotion/paths';
// Scale a viewBox around its centre — add breathing room so strokes don't clip.
console.log(extendViewBox('0 0 400 400', 1.2));
```

#### getSubpaths()

Split SVG path into its parts — [docs](https://www.remotion.dev/docs/paths/get-subpaths)

```ts
// getSubpaths.ts
import {getSubpaths} from '@remotion/paths';
// Splits a path at every M into separate paths — animate letters of an icon individually.
console.log(getSubpaths('M 0 0 L 10 0 M 20 20 L 30 30'));
```

#### parsePath()

Parse a string into an array of instructions — [docs](https://www.remotion.dev/docs/paths/parse-path)

```ts
// parsePath.ts
import {parsePath} from '@remotion/paths';
// String → instruction objects ({type:'M', x, y}, …).
console.log(parsePath('M 0 0 L 100 0 C 150 50 150 100 100 150 Z'));
```

#### serializeInstructions()

Turn an array of instructions into a SVG path — [docs](https://www.remotion.dev/docs/paths/serialize-instructions)

```ts
// serializeInstructions.ts
import {parsePath, serializeInstructions} from '@remotion/paths';
// Instruction objects → path string (round-trips parsePath).
console.log(serializeInstructions(parsePath('M 0 0 L 100 0 Z')));
```

#### reduceInstructions()

Reduce the amount of instruction types — [docs](https://www.remotion.dev/docs/paths/reduce-instructions)

```ts
// reduceInstructions.ts
import {parsePath, reduceInstructions} from '@remotion/paths';
// Simplifies to only M, L, C, Q, Z in absolute form — easiest shape to transform manually.
console.log(reduceInstructions(parsePath('m 0 0 h 100 v 100 a 20 20 0 0 1 -20 20 z')));
```

#### getInstructionIndexAtLength() (exported, not in docs table)

```ts
// getInstructionIndexAtLength.ts
import {getInstructionIndexAtLength} from '@remotion/paths';
// Which segment of the path sits at a given length (exported, not in docs table).
console.log(getInstructionIndexAtLength('M 0 0 L 100 0 L 100 100', 150));
```

## @remotion/sfx

Every export is a URL string; usage is identical for all 32, so one example plus the full list:

```tsx
// MyComp.tsx
import {Audio} from '@remotion/media';
import {Sequence} from 'remotion';
import {ding, mouseClick, recordScratch, vineBoom, whoosh} from '@remotion/sfx';
// Every @remotion/sfx export is a URL string to a hosted sound file — pass it to <Audio src>.
// Position with <Sequence from>; lower `volume` so SFX sit under the voiceover.
export const MyComp = () => (
  <>
    <Sequence from={0}><Audio src={whoosh} volume={0.5} /></Sequence>
    <Sequence from={30}><Audio src={mouseClick} /></Sequence>
    <Sequence from={60}><Audio src={ding} volume={0.6} /></Sequence>
    <Sequence from={90}><Audio src={vineBoom} volume={0.4} /></Sequence>
    <Sequence from={120}><Audio src={recordScratch} volume={0.5} /></Sequence>
  </>
);
```

| Import | Sound | Docs |
|---|---|---|
| `import {whip} from '@remotion/sfx'` | Whip sound effect | [docs](https://www.remotion.dev/docs/sfx/whip) |
| `import {whoosh} from '@remotion/sfx'` | Whoosh sound effect | [docs](https://www.remotion.dev/docs/sfx/whoosh) |
| `import {pageTurn} from '@remotion/sfx'` | Page turn sound effect | [docs](https://www.remotion.dev/docs/sfx/page-turn) |
| `import {uiSwitch} from '@remotion/sfx'` | UI switch sound effect | [docs](https://www.remotion.dev/docs/sfx/ui-switch) |
| `import {mouseClick} from '@remotion/sfx'` | Mouse click sound effect | [docs](https://www.remotion.dev/docs/sfx/mouse-click) |
| `import {shutterModern} from '@remotion/sfx'` | Modern camera shutter sound effect | [docs](https://www.remotion.dev/docs/sfx/shutter-modern) |
| `import {shutterOld} from '@remotion/sfx'` | Vintage camera shutter sound effect | [docs](https://www.remotion.dev/docs/sfx/shutter-old) |
| `import {ding} from '@remotion/sfx'` | Ding notification sound effect | [docs](https://www.remotion.dev/docs/sfx/ding) |
| `import {bruh} from '@remotion/sfx'` | Bruh sound effect | [docs](https://www.remotion.dev/docs/sfx/bruh) |
| `import {vineBoom} from '@remotion/sfx'` | Vine boom sound effect | [docs](https://www.remotion.dev/docs/sfx/vine-boom) |
| `import {windowsXpError} from '@remotion/sfx'` | Windows XP error sound effect | [docs](https://www.remotion.dev/docs/sfx/windows-xp-error) |
| `import {fah} from '@remotion/sfx'` | Fah meme sound effect | [docs](https://www.remotion.dev/docs/sfx/fah) |
| `import {spongebobFail} from '@remotion/sfx'` | SpongeBob fail sound effect | [docs](https://www.remotion.dev/docs/sfx/spongebob-fail) |
| `import {omgHellNah} from '@remotion/sfx'` | Oh my god bro hell nah sound effect | [docs](https://www.remotion.dev/docs/sfx/omg-hell-nah) |
| `import {priceIsRightFail} from '@remotion/sfx'` | Price Is Right fail horn sound effect | [docs](https://www.remotion.dev/docs/sfx/price-is-right-fail) |
| `import {romanceMeme} from '@remotion/sfx'` | Romance meme sound effect | [docs](https://www.remotion.dev/docs/sfx/romance-meme) |
| `import {boneCrack} from '@remotion/sfx'` | Bone crack sound effect | [docs](https://www.remotion.dev/docs/sfx/bone-crack) |
| `import {animeWow} from '@remotion/sfx'` | Anime wow sound effect | [docs](https://www.remotion.dev/docs/sfx/anime-wow) |
| `import {yippee} from '@remotion/sfx'` | Yippee sound effect | [docs](https://www.remotion.dev/docs/sfx/yippee) |
| `import {loadingLag} from '@remotion/sfx'` | Loading lag sound effect | [docs](https://www.remotion.dev/docs/sfx/loading-lag) |
| `import {wilhelmScream} from '@remotion/sfx'` | Wilhelm scream sound effect | [docs](https://www.remotion.dev/docs/sfx/wilhelm-scream) |
| `import {macQuack} from '@remotion/sfx'` | Mac quack sound effect | [docs](https://www.remotion.dev/docs/sfx/mac-quack) |
| `import {skedaddle} from '@remotion/sfx'` | Skedaddle sound effect | [docs](https://www.remotion.dev/docs/sfx/skedaddle) |
| `import {snapchatNotification} from '@remotion/sfx'` | Snapchat notification sound effect | [docs](https://www.remotion.dev/docs/sfx/snapchat-notification) |
| `import {nellyAhh} from '@remotion/sfx'` | Nelly ahh sound effect | [docs](https://www.remotion.dev/docs/sfx/nelly-ahh) |
| `import {sanctuaryGuardianWhat} from '@remotion/sfx'` | Sanctuary Guardian what meme sound effect | [docs](https://www.remotion.dev/docs/sfx/sanctuary-guardian-what) |
| `import {minecraftHurt} from '@remotion/sfx'` | Minecraft hurt sound effect | [docs](https://www.remotion.dev/docs/sfx/minecraft-hurt) |
| `import {ohMyGodVine} from '@remotion/sfx'` | Oh my god vine sound effect | [docs](https://www.remotion.dev/docs/sfx/oh-my-god-vine) |
| `import {illuminatiConfirmed} from '@remotion/sfx'` | Illuminati confirmed sound effect | [docs](https://www.remotion.dev/docs/sfx/illuminati-confirmed) |
| `import {dramaticBoomer} from '@remotion/sfx'` | Dramatic boomer sound effect | [docs](https://www.remotion.dev/docs/sfx/dramatic-boomer) |
| `import {triggered} from '@remotion/sfx'` | Triggered meme sound effect | [docs](https://www.remotion.dev/docs/sfx/triggered) |
| `import {recordScratch} from '@remotion/sfx'` | Record scratch sound effect | [docs](https://www.remotion.dev/docs/sfx/record-scratch) |

## @remotion/shapes


#### <Arrow />

Render an arrow as an SVG component — [docs](https://www.remotion.dev/docs/shapes/arrow)

```tsx
// Arrow.tsx
import {Arrow} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Arrow; direction left/right/up/down. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Arrow length={300} headWidth={185} headLength={120} shaftWidth={80} direction="right" cornerRadius={8} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makeArrow()

Generate the SVG path and metadata for an arrow — [docs](https://www.remotion.dev/docs/shapes/make-arrow)

```tsx
// makeArrow.tsx
import {makeArrow} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makeArrow({length: 300, headWidth: 185, headLength: 120, shaftWidth: 80, direction: "right", cornerRadius: 8});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Callout />

Render a callout as an SVG component — [docs](https://www.remotion.dev/docs/shapes/callout)

```tsx
// Callout.tsx
import {Callout} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Speech-bubble callout. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Callout width={400} height={200} pointerLength={60} pointerBaseWidth={60} pointerPosition={0.3} pointerDirection="down" cornerRadius={24} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makeCallout()

Generate the SVG path and metadata for a callout — [docs](https://www.remotion.dev/docs/shapes/make-callout)

```tsx
// makeCallout.tsx
import {makeCallout} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makeCallout({width: 400, height: 200, pointerLength: 60, pointerBaseWidth: 60, pointerPosition: 0.3, pointerDirection: "down", cornerRadius: 24});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Circle />

Render a circle as an SVG component — [docs](https://www.remotion.dev/docs/shapes/circle)

```tsx
// Circle.tsx
import {Circle} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Circle. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Circle radius={120} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makeCircle()

Generate the SVG path and metadata for a circle — [docs](https://www.remotion.dev/docs/shapes/make-circle)

```tsx
// makeCircle.tsx
import {makeCircle} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makeCircle({radius: 120});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Ellipse />

Render an ellipse as an SVG component — [docs](https://www.remotion.dev/docs/shapes/ellipse)

```tsx
// Ellipse.tsx
import {Ellipse} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Ellipse. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Ellipse rx={200} ry={100} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makeEllipse()

Generate the SVG path and metadata for an ellipse — [docs](https://www.remotion.dev/docs/shapes/make-ellipse)

```tsx
// makeEllipse.tsx
import {makeEllipse} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makeEllipse({rx: 200, ry: 100});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Heart />

Render a heart as an SVG component — [docs](https://www.remotion.dev/docs/shapes/heart)

```tsx
// Heart.tsx
import {Heart} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Heart. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Heart height={240} aspectRatio={1.1} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makeHeart()

Generate the SVG path and metadata for a heart — [docs](https://www.remotion.dev/docs/shapes/make-heart)

```tsx
// makeHeart.tsx
import {makeHeart} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makeHeart({height: 240, aspectRatio: 1.1});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Pie />

Render a pie as an SVG component — [docs](https://www.remotion.dev/docs/shapes/pie)

```tsx
// Pie.tsx
import {Pie} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Pie/progress wedge — animate `progress` 0→1 for a ring timer. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Pie radius={150} progress={0.72} rotation={-90} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makePie()

Generate the SVG path and metadata for a pie — [docs](https://www.remotion.dev/docs/shapes/make-pie)

```tsx
// makePie.tsx
import {makePie} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makePie({radius: 150, progress: 0.72, rotation: -90});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Polygon />

Render a polygon as an SVG component — [docs](https://www.remotion.dev/docs/shapes/polygon)

```tsx
// Polygon.tsx
import {Polygon} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Regular polygon. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Polygon points={6} radius={150} cornerRadius={10} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makePolygon()

Generate the SVG path and metadata for a polygon — [docs](https://www.remotion.dev/docs/shapes/make-polygon)

```tsx
// makePolygon.tsx
import {makePolygon} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makePolygon({points: 6, radius: 150, cornerRadius: 10});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Rect />

Render a rect as an SVG component — [docs](https://www.remotion.dev/docs/shapes/rect)

```tsx
// Rect.tsx
import {Rect} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Rectangle. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Rect width={400} height={200} cornerRadius={20} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makeRect()

Generate the SVG path and metadata for a rect — [docs](https://www.remotion.dev/docs/shapes/make-rect)

```tsx
// makeRect.tsx
import {makeRect} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makeRect({width: 400, height: 200, cornerRadius: 20});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Spark />

Render a spark as an SVG component — [docs](https://www.remotion.dev/docs/shapes/spark)

```tsx
// Spark.tsx
import {Spark} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Four-point spark. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Spark width={200} height={200} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makeSpark()

Generate the SVG path and metadata for a spark — [docs](https://www.remotion.dev/docs/shapes/make-spark)

```tsx
// makeSpark.tsx
import {makeSpark} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makeSpark({width: 200, height: 200});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Star />

Render a star as an SVG component — [docs](https://www.remotion.dev/docs/shapes/star)

```tsx
// Star.tsx
import {Star} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Star. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Star points={5} innerRadius={60} outerRadius={140} cornerRadius={6} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makeStar()

Generate the SVG path and metadata for a star — [docs](https://www.remotion.dev/docs/shapes/make-star)

```tsx
// makeStar.tsx
import {makeStar} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makeStar({points: 5, innerRadius: 60, outerRadius: 140, cornerRadius: 6});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

#### <Triangle />

Render a triangle as an SVG component — [docs](https://www.remotion.dev/docs/shapes/triangle)

```tsx
// Triangle.tsx
import {Triangle} from '@remotion/shapes';
import {AbsoluteFill} from 'remotion';
// Triangle; direction up/down/left/right. Accepts SVG props (fill, stroke, strokeWidth, style).
export const MyComp = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><Triangle length={250} direction="up" cornerRadius={10} fill="#F5B400" stroke="#0B1F3A" strokeWidth={4} /></AbsoluteFill>
);
```

#### makeTriangle()

Generate the SVG path and metadata for a triangle — [docs](https://www.remotion.dev/docs/shapes/make-triangle)

```tsx
// makeTriangle.tsx
import {makeTriangle} from '@remotion/shapes';
// Returns {path, width, height, transformOrigin, instructions} — use the path in your own <svg>, or with @remotion/paths.
const {path, width, height, transformOrigin} = makeTriangle({length: 250, direction: "up", cornerRadius: 10});
export const MyComp = () => <svg width={width} height={height}><path d={path} fill="#1C4E80" style={{transformOrigin}} /></svg>;
```

## @remotion/starburst


### Effects


#### `starburst()`

Apply a starburst ray effect — [docs](https://www.remotion.dev/docs/starburst/starburst-effect)

```tsx
// starburst-effect.tsx
import {starburst} from '@remotion/effects/starburst';
import {CanvasImage, staticFile} from 'remotion';
// Effect form. NOTE: @remotion/starburst's starburst() is deprecated — import from @remotion/effects/starburst.
export const MyComp = () => (
  <CanvasImage src={staticFile('image.png')} width={1080} height={1080} fit="cover" effects={[starburst({rays: 16, colors: ['#ffdd00', '#ff8800'], rotation: 15})]} />
);
```

### Components


#### <Starburst>

Render a starburst ray effect — [docs](https://www.remotion.dev/docs/starburst/starburst)

```tsx
// Starburst-component.tsx
import {Starburst} from '@remotion/starburst';
import {AbsoluteFill} from 'remotion';
// Component form: animated ray burst background.
export const MyComp = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <Starburst durationInFrames={60} rays={16} colors={['#ffdd00', '#ff8800', '#ff4400']} rotation={15} width={1080} height={1080} />
  </AbsoluteFill>
);
```


Covers `@remotion/player`, `@remotion/preload`, `@remotion/studio`, `@remotion/studio-protocol`, `@remotion/zod-types`, `@remotion/media-utils`. Every snippet type-checks under `tsc --strict` against v4.0.529. Assets referenced via `staticFile()` (logo.png, talking-head.mp4, music.mp3…) are placeholders — put your own files in `public/`. 


## @remotion/media-utils


#### audioBufferToDataUrl()

Serialize an audio buffer — [docs](https://www.remotion.dev/docs/audio-buffer-to-data-url)

```tsx
// audioBufferToDataUrl.tsx
import {audioBufferToDataUrl} from '@remotion/media-utils';
import {Audio} from '@remotion/media';
// Turn a generated AudioBuffer (e.g. a synthesised beep) into a src usable by <Audio>.
const ctx = new OfflineAudioContext(1, 44100, 44100);
const buf = ctx.createBuffer(1, 44100, 44100);
buf.getChannelData(0).forEach((_, i, a) => { a[i] = Math.sin((i / 44100) * 440 * 2 * Math.PI) * 0.2; });
const src = audioBufferToDataUrl(buf);
export const MyComp = () => <Audio src={src} />;
```

#### getAudioData()

Get metadata of an audio source — [docs](https://www.remotion.dev/docs/get-audio-data)

```ts
// getAudioData.ts
import {getAudioData} from '@remotion/media-utils';
import {staticFile} from 'remotion';
// Decodes an audio file → {channelWaveforms, sampleRate, durationInSeconds, numberOfChannels…}. Whole file in memory.
const data = await getAudioData(staticFile('voiceover.mp3'));
console.log(data.durationInSeconds, data.sampleRate, data.numberOfChannels);
```

#### getAudioDurationInSeconds()

Get the duration of an audio source — [docs](https://www.remotion.dev/docs/get-audio-duration-in-seconds)

```tsx
// getAudioDurationInSeconds.tsx
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Composition, staticFile} from 'remotion';
// Size a composition to its voiceover via calculateMetadata.
const C: React.FC<{src: string}> = () => null;
export const Root = () => (
  <Composition id="VO" component={C} fps={30} width={1080} height={1920} durationInFrames={1} defaultProps={{src: staticFile('voiceover.mp3')}}
    calculateMetadata={async ({props}) => ({durationInFrames: Math.ceil((await getAudioDurationInSeconds(props.src)) * 30)})} />
);
```

#### getVideoMetadata()

Get metadata of a video source — [docs](https://www.remotion.dev/docs/get-video-metadata)

```ts
// getVideoMetadata.ts
import {getVideoMetadata} from '@remotion/media-utils';
import {staticFile} from 'remotion';
// Browser-side: duration, width, height, aspectRatio, isRemote. (For codecs/fps use @remotion/media-parser.)
const meta = await getVideoMetadata(staticFile('talking-head.mp4'));
console.log(meta.durationInSeconds, meta.width, meta.height, meta.aspectRatio);
```

#### getWaveformPortion()

Trims audio data into a waveform — [docs](https://www.remotion.dev/docs/get-waveform-portion)

```tsx
// getWaveformPortion.tsx
import {getWaveformPortion, useAudioData} from '@remotion/media-utils';
import {AbsoluteFill, staticFile} from 'remotion';
// Static waveform bars for a time window (not frame-driven) — e.g. a podcast-style strip.
export const MyComp = () => {
  const audioData = useAudioData(staticFile('voiceover.mp3'));
  if (!audioData) return null;
  const bars = getWaveformPortion({audioData, startTimeInSeconds: 0, durationInSeconds: 10, numberOfSamples: 60});
  return <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>{bars.map((b) => <div key={b.index} style={{flex: 1, height: `${b.amplitude * 100}%`, background: '#1C4E80'}} />)}</AbsoluteFill>;
};
```

#### useAudioData()

`getAudioData()` as a hook — [docs](https://www.remotion.dev/docs/use-audio-data)

```tsx
// useAudioData.tsx
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
// Loads + decodes the whole file once (delays render until ready). For long files prefer useWindowedAudioData.
export const MyComp = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const audioData = useAudioData(staticFile('music.mp3'));
  if (!audioData) return null;
  const v = visualizeAudio({fps, frame, audioData, numberOfSamples: 16})[0];
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><div style={{width: 200, height: 200, borderRadius: 100, background: '#F5B400', scale: String(1 + v)}} /></AbsoluteFill>;
};
```

#### useWindowedAudioData()

Optimized for fetching only current data, works only with `.wav` — [docs](https://www.remotion.dev/docs/use-windowed-audio-data)

```tsx
// useWindowedAudioData.tsx
import {useWindowedAudioData, visualizeAudio} from '@remotion/media-utils';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
// Loads only a window around the current frame — use for long voiceovers. Pass dataOffsetInSeconds to visualizers.
export const MyComp = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({src: staticFile('voiceover.wav'), frame, fps, windowInSeconds: 10});
  if (!audioData) return null;
  const bars = visualizeAudio({fps, frame, audioData, numberOfSamples: 32, optimizeFor: 'speed', dataOffsetInSeconds});
  return <AbsoluteFill style={{flexDirection: 'row', alignItems: 'flex-end', gap: 6}}>{bars.map((v, i) => <div key={i} style={{flex: 1, height: `${v * 100}%`, background: '#F5B400'}} />)}</AbsoluteFill>;
};
```

#### visualizeAudio()

Process a music waveform for visualization — [docs](https://www.remotion.dev/docs/visualize-audio)

```tsx
// visualizeAudio.tsx
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
// Frequency spectrum for the current frame (numberOfSamples must be a power of 2). Low bins = bass.
export const MyComp = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const audioData = useAudioData(staticFile('music.mp3'));
  if (!audioData) return null;
  const spectrum = visualizeAudio({fps, frame, audioData, numberOfSamples: 64, smoothing: true});
  return <AbsoluteFill style={{flexDirection: 'row', alignItems: 'flex-end'}}>{spectrum.map((v, i) => <div key={i} style={{flex: 1, height: `${Math.min(1, v * 3) * 100}%`, background: '#1C4E80', margin: 1}} />)}</AbsoluteFill>;
};
```

#### visualizeAudioWaveform()

Process a voice waveform for visualization — [docs](https://www.remotion.dev/docs/media-utils/visualize-audio-waveform)

```tsx
// visualizeAudioWaveform.tsx
import {createSmoothSvgPath, useWindowedAudioData, visualizeAudioWaveform} from '@remotion/media-utils';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
// Oscilloscope-style waveform (−1…1) around the current frame.
export const MyComp = () => {
  const frame = useCurrentFrame(); const {fps, width} = useVideoConfig();
  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({src: staticFile('voiceover.wav'), frame, fps, windowInSeconds: 10});
  if (!audioData) return null;
  const wave = visualizeAudioWaveform({fps, frame, audioData, numberOfSamples: 64, windowInSeconds: 0.25, dataOffsetInSeconds});
  const d = createSmoothSvgPath({points: wave.map((y, i) => ({x: (i / (wave.length - 1)) * width, y: 300 + y * 200}))});
  return <AbsoluteFill><svg viewBox={`0 0 ${width} 600`}><path d={d} stroke="#F5B400" strokeWidth={6} fill="none" /></svg></AbsoluteFill>;
};
```

#### createSmoothSvgPath()

Turn waveform points into a smooth SVG path — [docs](https://www.remotion.dev/docs/media-utils/create-smooth-svg-path)

```ts
// createSmoothSvgPath.ts
import {createSmoothSvgPath} from '@remotion/media-utils';
// Points → smooth curve path (used for waveforms, also any line chart).
export const d = createSmoothSvgPath({points: [{x: 0, y: 100}, {x: 100, y: 20}, {x: 200, y: 80}, {x: 300, y: 10}]});
```

#### getImageDimensions() (exported, not in docs table)

```ts
// getImageDimensions.ts
import {getImageDimensions} from '@remotion/media-utils';
import {staticFile} from 'remotion';
// Exported, not in docs table: natural width/height of an image.
const {width, height} = await getImageDimensions(staticFile('house.jpg'));
console.log(width, height);
```

## @remotion/player


#### <Player>

Embed a Remotion composition in a web app — [docs](https://www.remotion.dev/docs/player/player)

```tsx
// Player.tsx
import {useRef, useState} from 'react';
import {Player, type PlayerRef} from '@remotion/player';
import {RateAlert} from './_Video';
// Embeds a composition in any React app; inputProps update live. Ref gives play/pause/seekTo/getCurrentFrame/events.
export const App = () => {
  const ref = useRef<PlayerRef>(null);
  const [rate, setRate] = useState('5.89%');
  return (
    <div>
      <input value={rate} onChange={(e) => setRate(e.target.value)} />
      <Player ref={ref} component={RateAlert} inputProps={{rate}} durationInFrames={150} fps={30}
        compositionWidth={1080} compositionHeight={1920} style={{width: 360}} controls loop clickToPlay acknowledgeRemotionLicense />
      <button onClick={() => ref.current?.seekTo(0)}>Restart</button>
    </div>
  );
};
```

#### <Thumbnail>

Embed a still in a web app — [docs](https://www.remotion.dev/docs/player/thumbnail)

```tsx
// Thumbnail.tsx
import {Thumbnail} from '@remotion/player';
import {RateAlert} from './_Video';
// Renders a single frame of a composition as a React element (no playback) — gallery cards, previews.
export const Card = () => (
  <Thumbnail component={RateAlert} inputProps={{rate: '5.89%'}} compositionWidth={1080} compositionHeight={1920}
    frameToDisplay={30} durationInFrames={150} fps={30} style={{width: 180}} />
);
```

#### Installation

Install the Player into your project — [docs](https://www.remotion.dev/docs/player/installation)

```tsx
// Installation.tsx
// npx remotion add @remotion/player   (or: npm i --save-exact @remotion/player@<same version as remotion>)
// The Player needs `remotion` too, at the SAME exact version.
import {Player} from '@remotion/player';
import {RateAlert} from './_Video';
export const Minimal = () => <Player component={RateAlert} inputProps={{rate: '5.89%'}} durationInFrames={150} fps={30} compositionWidth={1080} compositionHeight={1920} />;
```

#### Examples

Code samples for various scenarios — [docs](https://www.remotion.dev/docs/player/examples)

```tsx
// Examples.tsx
import {Player} from '@remotion/player';
import {RateAlert} from './_Video';
// Common prop combos from the examples page: autoplay muted loop, no controls (like a GIF), and a double-click fullscreen player.
export const GifLike = () => (
  <Player component={RateAlert} inputProps={{rate: '5.89%'}} durationInFrames={150} fps={30} compositionWidth={1080} compositionHeight={1920}
    autoPlay loop initiallyMuted style={{width: 300}} />
);
export const Full = () => (
  <Player component={RateAlert} inputProps={{rate: '5.89%'}} durationInFrames={150} fps={30} compositionWidth={1080} compositionHeight={1920}
    controls doubleClickToFullscreen allowFullscreen showVolumeControls playbackRate={1} style={{width: 360}} />
);
```

#### Sizing

Setting the size of the Player — [docs](https://www.remotion.dev/docs/player/scaling)

```tsx
// Sizing.tsx
import {Player} from '@remotion/player';
import {RateAlert} from './_Video';
// Fit a player into any box: fixed aspect-ratio wrapper + width/height 100%.
export const Fitted = () => {
  const w = 1080, h = 1920;
  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
      <div style={{position: 'absolute', inset: 0, margin: 'auto', aspectRatio: `${w} / ${h}`, maxHeight: '100%', maxWidth: '100%'}}>
        <Player component={RateAlert} inputProps={{rate: '5.89%'}} durationInFrames={150} fps={30} compositionWidth={w} compositionHeight={h}
          style={{width: '100%', height: '100%'}} controls />
      </div>
    </div>
  );
};
```

#### Autoplay

Dealing with browser autoplay policies — [docs](https://www.remotion.dev/docs/player/autoplay)

```tsx
// Autoplay.tsx
import {useRef} from 'react';
import {Player, type PlayerRef} from '@remotion/player';
import {RateAlert} from './_Video';
// Browsers block audio autoplay. Start playback from a user gesture and pass the event to play()/toggle().
export const App = () => {
  const ref = useRef<PlayerRef>(null);
  return (
    <>
      <Player ref={ref} component={RateAlert} inputProps={{rate: '5.89%'}} durationInFrames={150} fps={30} compositionWidth={1080} compositionHeight={1920} style={{width: 300}} />
      <button onClickCapture={(e) => ref.current?.play(e)}>Play</button>
    </>
  );
};
```

#### Display time

Write a custom component for displaying the current time — [docs](https://www.remotion.dev/docs/player/current-time)

```tsx
// DisplayTime.tsx
import {useCallback, useRef, useSyncExternalStore} from 'react';
import {Player, type CallbackListener, type PlayerRef} from '@remotion/player';
import {RateAlert} from './_Video';
// Show the current time outside the player without re-rendering the whole app every frame.
const useCurrentPlayerFrame = (ref: React.RefObject<PlayerRef | null>) => {
  const subscribe = useCallback((onChange: () => void) => {
    const {current} = ref;
    if (!current) return () => undefined;
    const updater: CallbackListener<'frameupdate'> = () => onChange();
    current.addEventListener('frameupdate', updater);
    return () => current.removeEventListener('frameupdate', updater);
  }, [ref]);
  return useSyncExternalStore(subscribe, () => ref.current?.getCurrentFrame() ?? 0, () => 0);
};
const TimeDisplay: React.FC<{playerRef: React.RefObject<PlayerRef | null>; fps: number}> = ({playerRef, fps}) => {
  const frame = useCurrentPlayerFrame(playerRef);
  return <span>{(frame / fps).toFixed(1)}s</span>;
};
export const App = () => {
  const ref = useRef<PlayerRef>(null);
  return (<><Player ref={ref} component={RateAlert} inputProps={{rate: '5.89%'}} durationInFrames={150} fps={30} compositionWidth={1080} compositionHeight={1920} controls style={{width: 300}} /><TimeDisplay playerRef={ref} fps={30} /></>);
};
```

#### Preloading assets

Make assets ready to play when they appear in the video — [docs](https://www.remotion.dev/docs/player/preloading)

```tsx
// PreloadingAssets.tsx
import {useEffect} from 'react';
import {prefetch} from 'remotion';
import {preloadVideo} from '@remotion/preload';
// Two options: preload (browser hint, keeps URL) or prefetch (downloads to a blob URL, reliable but memory-heavy).
export const usePreload = (url: string) => {
  useEffect(() => {
    const unpreload = preloadVideo(url);
    const {free, waitUntilDone} = prefetch(url, {method: 'blob-url'});
    waitUntilDone().then(() => console.log('ready'));
    return () => { unpreload(); free(); };
  }, [url]);
};
```

#### Best practices

Checklist of correct implementation — [docs](https://www.remotion.dev/docs/player/best-practices)

```tsx
// BestPractices.tsx
import {useMemo, useState} from 'react';
import {Player} from '@remotion/player';
import {RateAlert} from './_Video';
// Memoise inputProps (and keep `component` stable) so the Player doesn't re-render every parent render.
export const App = () => {
  const [rate, setRate] = useState('5.89%');
  const inputProps = useMemo(() => ({rate}), [rate]);
  return (<><button onClick={() => setRate('5.49%')}>Drop</button><Player component={RateAlert} inputProps={inputProps} durationInFrames={150} fps={30} compositionWidth={1080} compositionHeight={1920} style={{width: 300}} /></>);
};
```

#### Buffer state

Pause the Player while assets are loading — [docs](https://www.remotion.dev/docs/player/buffer-state)

```tsx
// BufferState.tsx
import {useEffect} from 'react';
import {useBufferState} from 'remotion';
// Inside a composition: pause the Player (buffering spinner) until something is ready. Always unblock in cleanup.
export const WaitsForData = () => {
  const buffer = useBufferState();
  useEffect(() => {
    const handle = buffer.delayPlayback();
    const t = setTimeout(() => handle.unblock(), 2000);
    return () => { clearTimeout(t); handle.unblock(); };
  }, [buffer]);
  return null;
};
```

#### Avoiding flickers

Troubleshooting for flickers due to unloaded assets — [docs](https://www.remotion.dev/docs/troubleshooting/player-flicker)

```tsx
// AvoidingFlickers.tsx
import {Video} from '@remotion/media';
import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
// Flicker = media mounting late. @remotion/media <Video>/<Audio> already pause the Player while buffering (default).
// Premount upcoming media; on older tags add pauseWhenBuffering, on <Img> pauseWhenLoading.
export const MyComp = () => (
  <>
    <Sequence from={90} premountFor={60}><Video src={staticFile('broll.mp4')} /></Sequence>
    <Sequence from={180} premountFor={30}><OffthreadVideo src={staticFile('broll2.mp4')} pauseWhenBuffering /></Sequence>
    <Sequence from={270} premountFor={30}><Img src={staticFile('chart.png')} pauseWhenLoading /></Sequence>
  </>
);
```

#### Premounting

Mount components earlier to allow them to load — [docs](https://www.remotion.dev/docs/player/premounting)

```tsx
// Premounting.tsx
import {Video} from '@remotion/media';
import {AbsoluteFill, Img, Sequence, staticFile} from 'remotion';
// premountFor mounts children N frames early (invisible) so they're loaded when they appear.
export const MyComp = () => (
  <AbsoluteFill>
    <Sequence from={100} premountFor={100}><Video src={staticFile('broll.mp4')} /></Sequence>
    <Sequence from={60} durationInFrames={90} premountFor={30}><Img src={staticFile('logo.png')} width={200} /></Sequence>
  </AbsoluteFill>
);
```

#### Drag & Drop

Allow interactivity on the canvas — [docs](https://www.remotion.dev/docs/player/drag-and-drop)

```tsx
// DragAndDrop.tsx
import {Player} from '@remotion/player';
import {AbsoluteFill} from 'remotion';
// Pointer events inside the composition work in the Player: keep interactive state in the parent and pass it via inputProps.
const Draggable: React.FC<{x: number; onMove: (x: number) => void}> = ({x, onMove}) => (
  <AbsoluteFill onPointerMove={(e) => e.buttons === 1 && onMove(e.nativeEvent.offsetX)}>
    <div style={{position: 'absolute', left: x, top: 400, width: 120, height: 120, background: '#F5B400'}} />
  </AbsoluteFill>
);
export const App: React.FC<{x: number; setX: (x: number) => void}> = ({x, setX}) => (
  <Player component={Draggable} inputProps={{x, onMove: setX}} durationInFrames={300} fps={30} compositionWidth={1920} compositionHeight={1080} style={{width: 640}} clickToPlay={false} />
);
```

#### Custom controls

Recipes for custom Play buttons, volume sliders, etc. — [docs](https://www.remotion.dev/docs/player/custom-controls)

```tsx
// CustomControls.tsx
import {useCallback, useRef} from 'react';
import {Player, type PlayerRef, type RenderCustomControls} from '@remotion/player';
import {RateAlert} from './_Video';
// Add your own buttons into the built-in control bar.
export const App = () => {
  const ref = useRef<PlayerRef>(null);
  const renderCustomControls: RenderCustomControls = useCallback(
    () => <button style={{background: 'transparent', border: 'none', color: 'white'}} onClick={() => console.log(ref.current?.getCurrentFrame())}>Log frame</button>, []);
  return <Player ref={ref} component={RateAlert} inputProps={{rate: '5.89%'}} durationInFrames={150} fps={30} compositionWidth={1080} compositionHeight={1920} controls renderCustomControls={renderCustomControls} style={{width: 300}} />;
};
```

#### Media Keys

Control what happens when users presses ⏯️ — [docs](https://www.remotion.dev/docs/player/media-keys)

```tsx
// MediaKeys.tsx
import {Player} from '@remotion/player';
import {RateAlert} from './_Video';
// Keyboard/OS media keys: 'register-media-session' | 'prevent-media-session' | 'do-nothing'.
export const App = () => (
  <Player component={RateAlert} inputProps={{rate: '5.89%'}} durationInFrames={150} fps={30} compositionWidth={1080} compositionHeight={1920}
    browserMediaControlsBehavior={{mode: 'register-media-session'}} style={{width: 300}} />
);
```

#### Shared helper used above

```tsx
// _Video.tsx
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
// Stand-in for your real composition component (import yours from the Remotion folder instead).
export const RateAlert: React.FC<{rate: string}> = ({rate}) => {
  const opacity = interpolate(useCurrentFrame(), [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: '#0B1F3A', color: 'white', justifyContent: 'center', alignItems: 'center', fontSize: 120, opacity}}>{rate}</AbsoluteFill>;
};
```

## @remotion/preload


#### preloadVideo()

Preload a video source — [docs](https://www.remotion.dev/docs/preload/preload-video)

```ts
// preloadVideo.ts
import {preloadVideo} from '@remotion/preload';
// Hints the browser to fetch a video the Player will need. Returns a cleanup fn.
const unpreload = preloadVideo('https://example.com/broll.mp4');
export const cleanup = () => unpreload();
```

#### preloadAudio()

Preload an audio source — [docs](https://www.remotion.dev/docs/preload/preload-audio)

```ts
// preloadAudio.ts
import {preloadAudio} from '@remotion/preload';
const unpreload = preloadAudio('https://example.com/music.mp3');
export const cleanup = () => unpreload();
```

#### preloadFont()

Preload a font — [docs](https://www.remotion.dev/docs/preload/preload-font)

```ts
// preloadFont.ts
import {preloadFont} from '@remotion/preload';
// Preload a font file so the first Player frames don't flash a fallback font.
const unpreload = preloadFont('https://example.com/fonts/BeVietnamPro-Bold.woff2');
export const cleanup = () => unpreload();
```

#### preloadImage()

Preload an image — [docs](https://www.remotion.dev/docs/preload/preload-image)

```ts
// preloadImage.ts
import {preloadImage} from '@remotion/preload';
const unpreload = preloadImage('https://example.com/house.jpg');
export const cleanup = () => unpreload();
```

#### resolveRedirect()

Get the definitive URL after all redirects — [docs](https://www.remotion.dev/docs/preload/resolve-redirect)

```ts
// resolveRedirect.ts
import {preloadVideo, resolveRedirect} from '@remotion/preload';
// Follow redirects first so the preloaded URL matches what the Player actually loads (CORS permitting).
const url = await resolveRedirect('https://example.com/short-link-to-video');
export const cleanup = preloadVideo(url);
```

## @remotion/studio


#### getStaticFiles()

Get a list of files in the `public` folder — [docs](https://www.remotion.dev/docs/studio/get-static-files)

```tsx
// getStaticFiles.tsx
import {getStaticFiles} from '@remotion/studio';
import {Img} from 'remotion';
// Studio-only list of /public files: {name, src, sizeInBytes, lastModified}. Empty during render — use for pickers.
export const Gallery = () => (
  <div>{getStaticFiles().filter((f) => f.name.endsWith('.png')).map((f) => <Img key={f.name} src={f.src} style={{width: 120}} />)}</div>
);
```

#### watchPublicFolder()

Listen to changes in the public folder — [docs](https://www.remotion.dev/docs/studio/watch-public-folder)

```tsx
// watchPublicFolder.tsx
import {useEffect, useState} from 'react';
import {getStaticFiles, watchPublicFolder, type StaticFile} from '@remotion/studio';
// Callback when anything in /public changes.
export const useFiles = () => {
  const [files, setFiles] = useState<StaticFile[]>(getStaticFiles());
  useEffect(() => watchPublicFolder((f) => setFiles(f)).cancel, []);
  return files;
};
```

#### watchStaticFile()

Listen to changes of a static file — [docs](https://www.remotion.dev/docs/studio/watch-static-file)

```tsx
// watchStaticFile.tsx
import {useEffect, useState} from 'react';
import {watchStaticFile} from '@remotion/studio';
// Re-read one /public file when it changes (e.g. captions.json edited externally).
export const useCaptionsVersion = () => {
  const [v, setV] = useState(0);
  useEffect(() => watchStaticFile('captions.json', () => setV((x) => x + 1)).cancel, []);
  return v;
};
```

#### writeStaticFile()

Save content to a file in the public directory — [docs](https://www.remotion.dev/docs/studio/write-static-file)

```ts
// writeStaticFile.ts
import {writeStaticFile} from '@remotion/studio';
// Studio-only: write text/binary into /public (e.g. save edited captions from a custom UI).
export const saveCaptions = (json: unknown) => writeStaticFile({filePath: 'captions.json', contents: JSON.stringify(json, null, 2)});
```

#### saveDefaultProps()

Save default props to the root file — [docs](https://www.remotion.dev/docs/studio/save-default-props)

```ts
// saveDefaultProps.ts
import {saveDefaultProps} from '@remotion/studio';
// Writes new defaultProps back into Root.tsx for a composition (Studio only).
export const bumpRate = () => saveDefaultProps({
  compositionId: 'RateAlert',
  defaultProps: ({savedDefaultProps}) => ({...savedDefaultProps, rate: '5.49%'}),
});
```

#### updateDefaultProps()

Update default props in the Props editor — [docs](https://www.remotion.dev/docs/studio/update-default-props)

```ts
// updateDefaultProps.ts
import {updateDefaultProps} from '@remotion/studio';
// Changes the props shown in the Studio props panel WITHOUT saving to disk.
export const preview = () => updateDefaultProps({
  compositionId: 'RateAlert',
  defaultProps: ({unsavedDefaultProps}) => ({...unsavedDefaultProps, rate: '6.09%'}),
});
```

#### deleteStaticFile()

Delete a file from the public directory — [docs](https://www.remotion.dev/docs/studio/delete-static-file)

```ts
// deleteStaticFile.ts
import {deleteStaticFile} from '@remotion/studio';
// Studio-only: delete a file in /public.
export const removeOld = () => deleteStaticFile('old/draft-captions.json');
```

#### restartStudio()

Restart the Studio Server. — [docs](https://www.remotion.dev/docs/studio/restart-studio)

```ts
// restartStudio.ts
import {restartStudio} from '@remotion/studio';
// Restart the Studio server (e.g. after changing remotion.config.ts from a custom tool).
export const restart = () => restartStudio();
```

#### shutDownStudio()

Shut down the Studio Server. — [docs](https://www.remotion.dev/docs/studio/shut-down-studio)

```ts
// shutDownStudio.ts
import {shutDownStudio} from '@remotion/studio';
// Stop the Studio server process.
export const quit = () => shutDownStudio();
```

#### play()

Start playback in the timeline — [docs](https://www.remotion.dev/docs/studio/play)

```tsx
// play.tsx
import {play} from '@remotion/studio';
// Start Studio playback programmatically. Pass the event when called from a click (audio policy).
export const PlayBtn = () => <button onClick={(e) => play(e)}>Play</button>;
```

#### pause()

Pause playback in the timeline — [docs](https://www.remotion.dev/docs/studio/pause)

```ts
// pause.ts
import {pause} from '@remotion/studio';
export const stop = () => pause();
```

#### toggle()

Toggle playback in the timeline — [docs](https://www.remotion.dev/docs/studio/toggle)

```tsx
// toggle.tsx
import {toggle} from '@remotion/studio';
export const ToggleBtn = () => <button onClick={(e) => toggle(e)}>Play/Pause</button>;
```

#### seek()

Jump to a position in the timeline — [docs](https://www.remotion.dev/docs/studio/seek)

```ts
// seek.ts
import {seek} from '@remotion/studio';
// Jump the Studio playhead to a frame.
export const toCta = () => seek(240);
```

#### goToComposition()

Select a composition in the composition selector — [docs](https://www.remotion.dev/docs/studio/go-to-composition)

```ts
// goToComposition.ts
import {goToComposition} from '@remotion/studio';
// Switch the Studio to another composition by id.
export const openReel = () => goToComposition('RateAlert-Reel');
```

#### focusDefaultPropsPath()

Scrolls to a specific field in the default props editor — [docs](https://www.remotion.dev/docs/studio/focus-default-props-path)

```ts
// focusDefaultPropsPath.ts
import {focusDefaultPropsPath} from '@remotion/studio';
// Scroll/focus a field in the props editor, e.g. jump to the headline input.
export const focusHeadline = () => focusDefaultPropsPath({path: ['headline']});
```

#### reevaluateComposition()

Re-runs calculateMetadata() on the current composition — [docs](https://www.remotion.dev/docs/studio/reevaluate-composition)

```ts
// reevaluateComposition.ts
import {reevaluateComposition} from '@remotion/studio';
// Re-run calculateMetadata() for the current composition (e.g. after external data changed).
export const refresh = () => reevaluateComposition();
```

#### visualControl()

Create a control in the right sidebar of the Studio — [docs](https://www.remotion.dev/docs/studio/visual-control)

```tsx
// visualControl.tsx
import {visualControl} from '@remotion/studio';
import {z} from 'zod';
import {AbsoluteFill} from 'remotion';
// Exposes a value as a live Studio control you can tweak and save back into code. Optional zod schema for objects.
export const MyComp = () => {
  const rotation = visualControl('rotation', 0);
  const card = visualControl('card', {title: 'Refinance', size: 90}, z.object({title: z.string(), size: z.number()}));
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><h1 style={{rotate: `${rotation}deg`, fontSize: card.size}}>{card.title}</h1></AbsoluteFill>;
};
```

## @remotion/studio-protocol


#### createElementPayload()

Create a versioned Element payload — [docs](https://www.remotion.dev/docs/studio-protocol/create-element-payload)

```ts
// createElementPayload.ts
import {createElementPayload} from '@remotion/studio-protocol';
// Packages a reusable element (source code + deps + assets + default props) that a Studio can install.
export const payload = createElementPayload({
  displayName: 'Rate Badge', slug: 'rate-badge',
  sourceCode: "export const RateBadge = ({rate}: {rate: string}) => <div style={{fontSize: 80}}>{rate}</div>;\n",
  dependencies: [{name: '@remotion/google-fonts', version: null}],
  dimensions: {width: 600, height: 200}, durationInFrames: 60, initialProps: {rate: '5.89%'}, assets: [],
});
```

#### buildOpenInRemotionNewUrl()

Build a URL that opens an Element on remotion.dev/new — [docs](https://www.remotion.dev/docs/studio-protocol/build-open-in-remotion-new-url)

```ts
// buildOpenInRemotionNewUrl.ts
import {buildOpenInRemotionNewUrl} from '@remotion/studio-protocol';
import {payload} from './_payload';
// A link that opens the element in a fresh Remotion project (remotion.new).
export const url = buildOpenInRemotionNewUrl({payload});
```

#### setStudioDragData()

Put an Element payload on a drag event — [docs](https://www.remotion.dev/docs/studio-protocol/set-studio-drag-data)

```tsx
// setStudioDragData.tsx
import {setStudioDragData} from '@remotion/studio-protocol';
import {payload} from './_payload';
// Make an element on your website draggable straight into a running Remotion Studio.
export const DragCard = () => (
  <div draggable onDragStart={(e) => setStudioDragData({dataTransfer: e.dataTransfer, payload})}>Drag “FinHub Lower Third” into Studio</div>
);
```

#### installInStudio()

Request installation into the active Studio — [docs](https://www.remotion.dev/docs/studio-protocol/install-in-studio)

```tsx
// installInStudio.tsx
import {installInStudio} from '@remotion/studio-protocol';
import {payload} from './_payload';
// Button that installs the element into the user's open Studio.
export const InstallBtn = () => <button onClick={async () => console.log(await installInStudio({payload}))}>Add to my Studio</button>;
```

#### addElementLibraryToStudio()

Add an Element Library to a Studio project — [docs](https://www.remotion.dev/docs/studio-protocol/add-element-library-to-studio)

```ts
// addElementLibraryToStudio.ts
import {addElementLibraryToStudio} from '@remotion/studio-protocol';
// Registers a whole element library (by URL) in the user's Studio.
export const add = () => addElementLibraryToStudio({url: 'https://example.com/finhub-elements.json', displayName: 'FinHub elements'});
```

#### isInsideStudio()

Check whether a library is embedded in Studio — [docs](https://www.remotion.dev/docs/studio-protocol/is-inside-studio)

```tsx
// isInsideStudio.tsx
import {isInsideStudio} from '@remotion/studio-protocol';
// True when your page is rendered inside the Remotion Studio (e.g. hide "Open in Studio" buttons).
export const Banner = () => (isInsideStudio() ? null : <a href="#">Open in Remotion</a>);
```

#### Shared helper used above

```tsx
// _payload.ts
import {createElementPayload, staticFileRef} from '@remotion/studio-protocol';
export const payload = createElementPayload({
  displayName: 'FinHub Lower Third', slug: 'finhub-lower-third',
  sourceCode: "import {Img} from 'remotion';\nexport const LowerThird = ({logoSrc}: {logoSrc: string}) => <Img src={logoSrc} />;\n",
  dependencies: [], dimensions: {width: 900, height: 260}, durationInFrames: 90,
  initialProps: {logoSrc: staticFileRef('lower-third/logo.png')},
  assets: [{path: 'lower-third/logo.png', type: 'url', url: 'https://example.com/logo.png'}],
});
```

## @remotion/zod-types


#### zColor()

A Zod Type for colors — [docs](https://www.remotion.dev/docs/zod-types/z-color)

```tsx
// zColor.tsx
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {Composition} from 'remotion';
// Colour field → colour picker in the Studio props panel.
const schema = z.object({accent: zColor()});
const C: React.FC<z.infer<typeof schema>> = ({accent}) => <div style={{background: accent, width: '100%', height: '100%'}} />;
export const Root = () => <Composition id="Accent" component={C} schema={schema} defaultProps={{accent: '#F5B400'}} durationInFrames={60} fps={30} width={1080} height={1080} />;
```

#### zTextarea()

A Zod Type for multiple-line text in a textarea — [docs](https://www.remotion.dev/docs/zod-types/z-textarea)

```tsx
// zTextarea.tsx
import {z} from 'zod';
import {zTextarea} from '@remotion/zod-types';
import {Composition} from 'remotion';
// Multi-line text field in the Studio props panel.
const schema = z.object({script: zTextarea()});
const C: React.FC<z.infer<typeof schema>> = ({script}) => <div style={{whiteSpace: 'pre-wrap', fontSize: 50}}>{script}</div>;
export const Root = () => <Composition id="Script" component={C} schema={schema} defaultProps={{script: 'Line 1\nLine 2'}} durationInFrames={60} fps={30} width={1080} height={1920} />;
```

#### zMatrix()

A Zod Type for editing matrices — [docs](https://www.remotion.dev/docs/zod-types/z-matrix)

```tsx
// zMatrix.tsx
import {z} from 'zod';
import {zMatrix} from '@remotion/zod-types';
import {Composition} from 'remotion';
// Numeric matrix editor (array of numbers) — e.g. a CSS transform matrix.
const schema = z.object({m: zMatrix()});
const C: React.FC<z.infer<typeof schema>> = ({m}) => <div style={{transform: `matrix(${m.join(',')})`, width: 200, height: 200, background: '#1C4E80'}} />;
export const Root = () => <Composition id="Matrix" component={C} schema={schema} defaultProps={{m: [1, 0, 0, 1, 0, 0]}} durationInFrames={60} fps={30} width={1080} height={1080} />;
```


Covers `@remotion/bundler`, `@remotion/lambda`, `@remotion/cloudrun`, `@remotion/vercel`, `@remotion/licensing`. Every snippet type-checks under `tsc --strict` against v4.0.529. Assets referenced via `staticFile()` (logo.png, talking-head.mp4, music.mp3…) are placeholders — put your own files in `public/`. 


## @remotion/bundler


#### bundle()

Create a Webpack bundle — [docs](https://www.remotion.dev/docs/bundle)

```ts
// bundle.ts
import path from 'path';
import {bundle} from '@remotion/bundler';
// Webpack-bundle the Remotion project once; pass the returned serveUrl to any number of renders.
// Pass your remotion.config.ts webpack override here too — the config file is NOT read by this API.
const serveUrl = await bundle({
  entryPoint: path.resolve('src/index.ts'),
  onProgress: (p) => console.log(`${p}%`),
  webpackOverride: (config) => config,
  publicDir: path.resolve('public'),
});
console.log(serveUrl);
```

## @remotion/cloudrun


#### getServiceInfo()

Gets information about a service — [docs](https://www.remotion.dev/docs/cloudrun/getserviceinfo)

```ts
// getServiceInfo.ts
import {getServiceInfo} from '@remotion/cloudrun';
import {region, serviceName} from './_config';
const info = await getServiceInfo({region, serviceName});
console.log(info.uri, info.memoryLimit, info.cpuLimit, info.remotionVersion);
```

#### deployService()

Create a new service in GCP Cloud Run — [docs](https://www.remotion.dev/docs/cloudrun/deployservice)

```ts
// deployService.ts
import {deployService} from '@remotion/cloudrun';
import {region} from './_config';
// One-time: deploy the render service into your GCP project.
const {shortName} = await deployService({projectID: 'finhub-remotion', region, memoryLimit: '2Gi', cpuLimit: '2.0', timeoutSeconds: 500});
console.log(shortName);
```

#### deleteService()

Delete a service in GCP Cloud Run — [docs](https://www.remotion.dev/docs/cloudrun/deleteservice)

```ts
// deleteService.ts
import {deleteService, getServices} from '@remotion/cloudrun';
import {region} from './_config';
for (const s of await getServices({region, compatibleOnly: false})) {
  if (s.remotionVersion !== '4.0.529') await deleteService({region, serviceName: s.serviceName});
}
```

#### getServices()

Lists available Remotion Cloud Run services — [docs](https://www.remotion.dev/docs/cloudrun/getservices)

```ts
// getServices.ts
import {getServices} from '@remotion/cloudrun';
import {region} from './_config';
console.log((await getServices({region, compatibleOnly: true})).map((s) => s.serviceName));
```

#### speculateServiceName()

Speculate a service name based on its configuration — [docs](https://www.remotion.dev/docs/cloudrun/speculateservicename)

```ts
// speculateServiceName.ts
import {speculateServiceName} from '@remotion/cloudrun/client';
// Name the service will have for these settings — no GCP call.
export const serviceName = speculateServiceName({memoryLimit: '2Gi', cpuLimit: '2.0', timeoutSeconds: 500});
```

#### getRegions()

Get all available regions — [docs](https://www.remotion.dev/docs/cloudrun/getregions)

```ts
// getRegions.ts
import {getRegions} from '@remotion/cloudrun';
console.log(getRegions().includes('australia-southeast1'));
```

#### deploySite()

Bundle and upload a site to Cloud Storage — [docs](https://www.remotion.dev/docs/cloudrun/deploysite)

```ts
// deploySite.ts
import path from 'path';
import {deploySite} from '@remotion/cloudrun';
import {bucketName} from './_config';
// Bundle + upload the project to Cloud Storage.
const {serveUrl} = await deploySite({entryPoint: path.resolve('src/index.ts'), bucketName, siteName: 'finhub-videos',
  options: {onBundleProgress: (p) => console.log(`bundle ${p}%`)}});
console.log(serveUrl);
```

#### deleteSite()

Delete a bundle from Cloud Storage — [docs](https://www.remotion.dev/docs/cloudrun/deletesite)

```ts
// deleteSite.ts
import {deleteSite, getSites} from '@remotion/cloudrun';
import {region} from './_config';
const {sites} = await getSites(region);
for (const site of sites.filter((s) => s.id !== 'finhub-videos')) await deleteSite({bucketName: site.bucketName, siteName: site.id});
```

#### getSites()

Get all available sites from Cloud Storage — [docs](https://www.remotion.dev/docs/cloudrun/getsites)

```ts
// getSites.ts
import {getSites} from '@remotion/cloudrun';
import {region} from './_config';
const {sites} = await getSites(region);
console.log(sites.map((s) => `${s.id} → ${s.serveUrl}`));
```

#### getOrCreateBucket()

Ensure a Remotion Cloud Storage bucket exists — [docs](https://www.remotion.dev/docs/cloudrun/getorcreatebucket)

```ts
// getOrCreateBucket.ts
import {getOrCreateBucket} from '@remotion/cloudrun';
import {region} from './_config';
const {bucketName, alreadyExisted} = await getOrCreateBucket({region});
console.log(bucketName, alreadyExisted);
```

#### renderMediaOnCloudrun()

Trigger a video or audio render — [docs](https://www.remotion.dev/docs/cloudrun/rendermediaoncloudrun)

```ts
// renderMediaOnCloudrun.ts
import {renderMediaOnCloudrun} from '@remotion/cloudrun/client';
import {region, serveUrl, serviceName} from './_config';
// Renders on one Cloud Run instance (not distributed like Lambda) and waits for the result.
const result = await renderMediaOnCloudrun({region, serviceName, serveUrl, composition: 'RateAlert', codec: 'h264', inputProps: {rate: '5.89%'},
  updateRenderProgress: (p) => console.log(Math.round(p * 100))});
if (result.type === 'success') console.log(result.publicUrl, result.renderId);
```

#### renderStillOnCloudrun()

Trigger a still render — [docs](https://www.remotion.dev/docs/cloudrun/renderstilloncloudrun)

```ts
// renderStillOnCloudrun.ts
import {renderStillOnCloudrun} from '@remotion/cloudrun/client';
import {region, serveUrl, serviceName} from './_config';
const result = await renderStillOnCloudrun({region, serviceName, serveUrl, composition: 'Thumbnail', imageFormat: 'png', inputProps: {title: 'Refinance'}});
if (result.type === 'success') console.log(result.publicUrl);
```

#### testPermissions()

Ensure permissions are correctly set up in GCP — [docs](https://www.remotion.dev/docs/cloudrun/testpermissions)

```ts
// testPermissions.ts
import {testPermissions} from '@remotion/cloudrun';
// Checks the service account in your .env has every permission Remotion needs.
const {results} = await testPermissions();
for (const r of results) if (!r.decision) console.log('MISSING', r.permissionName);
```

#### Shared helper used above

```tsx
// _config.ts
import type {GcpRegion} from '@remotion/cloudrun';
export const region: GcpRegion = 'australia-southeast1'; // Sydney
export const serviceName = 'remotion--4-0-529--mem2gi--cpu2-0--t-500';
export const bucketName = 'remotioncloudrun-xxxxxxxxxx';
export const serveUrl = 'https://storage.googleapis.com/remotioncloudrun-xxxxxxxxxx/sites/finhub-videos/index.html';
```

## @remotion/lambda


#### estimatePrice()

Estimate the price of a render — [docs](https://www.remotion.dev/docs/lambda/estimateprice)

```ts
// estimatePrice.ts
import {estimatePrice} from '@remotion/lambda';
import {region} from './_config';
// USD estimate for a render from its measured Lambda time. (Every render's progress object also reports costs.)
console.log(estimatePrice({region, durationInMilliseconds: 20000, memorySizeInMb: 2048, diskSizeInMb: 2048, lambdasInvoked: 1}));
```

#### deployFunction()

Create a new function in AWS Lambda — [docs](https://www.remotion.dev/docs/lambda/deployfunction)

```ts
// deployFunction.ts
import {deployFunction} from '@remotion/lambda';
import {region} from './_config';
// One-time: create the render function (redeploy after every Remotion upgrade).
const {functionName, alreadyExisted} = await deployFunction({region, timeoutInSeconds: 240, memorySizeInMb: 2048, diskSizeInMb: 2048, createCloudWatchLogGroup: true});
console.log(functionName, alreadyExisted);
```

#### deleteFunction()

Delete a function in AWS Lambda — [docs](https://www.remotion.dev/docs/lambda/deletefunction)

```ts
// deleteFunction.ts
import {deleteFunction, getFunctions} from '@remotion/lambda';
import {region} from './_config';
// Remove functions left from old Remotion versions.
for (const fn of await getFunctions({region, compatibleOnly: false})) {
  if (fn.version !== '4.0.529') await deleteFunction({region, functionName: fn.functionName});
}
```

#### getFunctionInfo()

Gets information about a function — [docs](https://www.remotion.dev/docs/lambda/getfunctioninfo)

```ts
// getFunctionInfo.ts
import {getFunctionInfo} from '@remotion/lambda';
import {functionName, region} from './_config';
const info = await getFunctionInfo({functionName, region});
console.log(info.memorySizeInMb, info.diskSizeInMb, info.timeoutInSeconds, info.version);
```

#### getFunctions()

Lists available Remotion Lambda functions — [docs](https://www.remotion.dev/docs/lambda/getfunctions)

```ts
// getFunctions.ts
import {getFunctions} from '@remotion/lambda';
import {region} from './_config';
// compatibleOnly: true → only functions matching this installed Remotion version.
const fns = await getFunctions({region, compatibleOnly: true});
console.log(fns.map((f) => f.functionName));
```

#### getCompositionsOnLambda()

Gets list of compositions inside a Lambda function — [docs](https://www.remotion.dev/docs/lambda/getcompositionsonlambda)

```ts
// getCompositionsOnLambda.ts
import {getCompositionsOnLambda} from '@remotion/lambda/client';
import {functionName, region, serveUrl} from './_config';
// List compositions of a deployed site without running a browser locally.
const comps = await getCompositionsOnLambda({region, functionName, serveUrl, inputProps: {}});
console.log(comps.map((c) => c.id));
```

#### deleteSite()

Delete a bundle from S3 — [docs](https://www.remotion.dev/docs/lambda/deletesite)

```ts
// deleteSite.ts
import {deleteSite, getSites} from '@remotion/lambda';
import {region} from './_config';
// Delete old sites (bundles) from S3.
const {sites} = await getSites({region});
for (const site of sites.filter((s) => s.id !== 'finhub-videos')) await deleteSite({bucketName: site.bucketName, siteName: site.id, region});
```

#### deploySiteFromBundle()

Upload an existing bundle to S3 — [docs](https://www.remotion.dev/docs/lambda/deploysitefrombundle)

```ts
// deploySiteFromBundle.ts
import {deploySiteFromBundle} from '@remotion/lambda';
import {bucketName, region} from './_config';
// Upload an already-built bundle (`npx remotion bundle` → ./build) instead of bundling again.
const {serveUrl, siteName} = await deploySiteFromBundle({bucketName, region, bundleDir: './build', siteName: 'finhub-videos'});
console.log(serveUrl, siteName);
```

#### deploySite()

Deprecated: Bundle and upload a site to S3 — [docs](https://www.remotion.dev/docs/lambda/deploysite)

```ts
// deploySite.ts
import path from 'path';
import {deploySite} from '@remotion/lambda';
import {bucketName, region} from './_config';
// Bundle + upload the Remotion project. Re-run whenever the video code changes; same siteName = overwrite.
const {serveUrl} = await deploySite({
  entryPoint: path.resolve('src/index.ts'), bucketName, region, siteName: 'finhub-videos',
  options: {onBundleProgress: (p) => console.log(`bundle ${p}%`), onUploadProgress: ({filesUploaded, totalFiles}) => console.log(`${filesUploaded}/${totalFiles}`)},
});
console.log(serveUrl);
```

#### getAwsClient()

Access the AWS SDK directly — [docs](https://www.remotion.dev/docs/lambda/getawsclient)

```ts
// getAwsClient.ts
import {getAwsClient, getRenderProgress} from '@remotion/lambda/client';
import {bucketName, functionName, region} from './_config';
// Raw AWS SDK client using Remotion's credentials — e.g. read the output file yourself.
const progress = await getRenderProgress({renderId: 'd7nlc2y', bucketName, functionName, region});
if (progress.outKey) {
  const {client, sdk} = getAwsClient({region, service: 's3'});
  const obj = await client.send(new sdk.GetObjectCommand({Bucket: bucketName, Key: progress.outKey}));
  console.log(obj.ContentLength);
}
```

#### getRegions()

Get all available regions — [docs](https://www.remotion.dev/docs/lambda/getregions)

```ts
// getRegions.ts
import {getRegions} from '@remotion/lambda';
// Every AWS region Remotion Lambda supports.
console.log(getRegions().includes('ap-southeast-2'));
```

#### getSites()

Get all available sites — [docs](https://www.remotion.dev/docs/lambda/getsites)

```ts
// getSites.ts
import {getSites} from '@remotion/lambda/client';
import {region} from './_config';
const {sites, buckets} = await getSites({region});
console.log(buckets.map((b) => b.name), sites.map((s) => `${s.id} → ${s.serveUrl}`));
```

#### downloadMedia()

Download a render artifact from S3 — [docs](https://www.remotion.dev/docs/lambda/downloadmedia)

```ts
// downloadMedia.ts
import {downloadMedia} from '@remotion/lambda';
import {bucketName, region} from './_config';
// Download a finished render from S3 to disk.
const {outputPath, sizeInBytes} = await downloadMedia({bucketName, region, renderId: '8hfxlw', outPath: 'out/reel.mp4',
  onProgress: ({percent}) => console.log(`${(percent * 100).toFixed(0)}%`)});
console.log(outputPath, sizeInBytes);
```

#### cancelRenderOnLambda()

Cancel an in-progress render — [docs](https://www.remotion.dev/docs/lambda/cancelrenderonlambda)

```ts
// cancelRenderOnLambda.ts
import {cancelRenderOnLambda, renderMediaOnLambda} from '@remotion/lambda/client';
import {functionName, region, serveUrl} from './_config';
// Only renders started with enableCancellation: true can be cancelled.
const {bucketName, renderId} = await renderMediaOnLambda({region, functionName, serveUrl, composition: 'MyComp', codec: 'h264', enableCancellation: true});
await cancelRenderOnLambda({region, bucketName, renderId});
```

#### getUserPolicy()

Get the policy JSON for your AWS user — [docs](https://www.remotion.dev/docs/lambda/getuserpolicy)

```ts
// getUserPolicy.ts
import {getUserPolicy} from '@remotion/lambda';
// IAM policy JSON to attach to the IAM user whose keys deploy/trigger renders.
console.log(getUserPolicy());
```

#### getRolePolicy()

Get the policy JSON for your AWS role — [docs](https://www.remotion.dev/docs/lambda/getrolepolicy)

```ts
// getRolePolicy.ts
import {getRolePolicy} from '@remotion/lambda';
// IAM policy JSON for the `remotion-lambda-role` the function runs as.
console.log(getRolePolicy());
```

#### getOrCreateBucket()

Ensure a Remotion S3 bucket exists — [docs](https://www.remotion.dev/docs/lambda/getorcreatebucket)

```ts
// getOrCreateBucket.ts
import {getOrCreateBucket} from '@remotion/lambda';
import {region} from './_config';
// One Remotion bucket per region; returns the existing one if present.
const {bucketName, alreadyExisted} = await getOrCreateBucket({region});
console.log(bucketName, alreadyExisted);
```

#### getRenderProgress()

Query the progress of a render — [docs](https://www.remotion.dev/docs/lambda/getrenderprogress)

```ts
// getRenderProgress.ts
import {getRenderProgress} from '@remotion/lambda/client';
import {bucketName, functionName, region} from './_config';
// Poll until done; exposes overallProgress, outputFile, costs, errors.
export const waitFor = async (renderId: string) => {
  for (;;) {
    const p = await getRenderProgress({renderId, bucketName, functionName, region});
    if (p.fatalErrorEncountered) throw new Error(p.errors[0]?.message);
    if (p.done) return {url: p.outputFile, costUsd: p.costs.accruedSoFar};
    console.log(Math.round(p.overallProgress * 100));
    await new Promise((r) => setTimeout(r, 2000));
  }
};
```

#### presignUrl()

Make a private file public to those with the link — [docs](https://www.remotion.dev/docs/lambda/presignurl)

```ts
// presignUrl.ts
import {presignUrl} from '@remotion/lambda/client';
import {bucketName, region} from './_config';
// Time-limited link to a private S3 object (e.g. a render done with privacy: 'private').
const url = await presignUrl({region, bucketName, objectKey: 'renders/abc/out.mp4', expiresInSeconds: 900, checkIfObjectExists: true});
console.log(url);
```

#### renderMediaOnLambda()

Trigger a video or audio render — [docs](https://www.remotion.dev/docs/lambda/rendermediaonlambda)

```ts
// renderMediaOnLambda.ts
import {renderMediaOnLambda} from '@remotion/lambda/client';
import {functionName, region, serveUrl} from './_config';
// Start a distributed render. Import from /client in API routes (smaller, no bundler deps).
const {renderId, bucketName} = await renderMediaOnLambda({
  region, functionName, serveUrl, composition: 'RateAlert', codec: 'h264', inputProps: {rate: '5.89%'},
  privacy: 'public', downloadBehavior: {type: 'download', fileName: 'rate-alert.mp4'},
  webhook: {url: 'https://finhub.net.au/api/remotion-webhook', secret: process.env.REMOTION_WEBHOOK_SECRET ?? null},
});
console.log(renderId, bucketName);
```

#### renderStillOnLambda()

Trigger a still render — [docs](https://www.remotion.dev/docs/lambda/renderstillonlambda)

```ts
// renderStillOnLambda.ts
import {renderStillOnLambda} from '@remotion/lambda/client';
import {functionName, region, serveUrl} from './_config';
// Single frame, returns synchronously with a URL.
const {url, sizeInBytes, estimatedPrice} = await renderStillOnLambda({
  region, functionName, serveUrl, composition: 'Thumbnail', inputProps: {title: 'Refinance'},
  imageFormat: 'png', privacy: 'public', frame: 0, maxRetries: 1, envVariables: {},
});
console.log(url, sizeInBytes, estimatedPrice.accruedSoFar);
```

#### simulatePermissions()

Ensure permissions are correctly set up — [docs](https://www.remotion.dev/docs/lambda/simulatepermissions)

```ts
// simulatePermissions.ts
import {simulatePermissions} from '@remotion/lambda';
import {region} from './_config';
// Checks your IAM user has every permission Remotion needs.
const {results} = await simulatePermissions({region});
for (const r of results) if (r.decision !== 'allowed') console.log('MISSING', r.name);
```

#### speculateFunctionName()

Get the lambda function name based on its configuration — [docs](https://www.remotion.dev/docs/lambda/speculatefunctionname)

```ts
// speculateFunctionName.ts
import {speculateFunctionName} from '@remotion/lambda/client';
// Derive the deployed function's name from its settings — no AWS call, so API routes needn't hardcode it.
export const functionName = speculateFunctionName({memorySizeInMb: 2048, diskSizeInMb: 2048, timeoutInSeconds: 240});
```

#### validateWebhookSignature()

Validate an incoming webhook request is authentic — [docs](https://www.remotion.dev/docs/lambda/validatewebhooksignature)

```ts
// validateWebhookSignature.ts
import {validateWebhookSignature} from '@remotion/lambda/client';
// Verify a webhook came from your render (throws if the signature doesn't match).
export const verify = (body: object, signatureHeader: string) =>
  validateWebhookSignature({secret: process.env.REMOTION_WEBHOOK_SECRET as string, body, signatureHeader});
```

#### appRouterWebhook()

Handle incoming webhooks specifically for the Next.js app router — [docs](https://www.remotion.dev/docs/lambda/approuterwebhook)

```ts
// appRouterWebhook.ts
import {appRouterWebhook} from '@remotion/lambda/client';
// Next.js App Router: app/api/remotion-webhook/route.ts
export const POST = appRouterWebhook({
  secret: process.env.REMOTION_WEBHOOK_SECRET as string,
  onSuccess: (p) => console.log('done', p.renderId, p.outputUrl),
  onError: (p) => console.log('failed', p.errors),
  onTimeout: (p) => console.log('timeout', p.renderId),
});
export const OPTIONS = POST;
```

#### pagesRouterWebhook()

Handle incoming webhooks specifically for the Next.js pages router — [docs](https://www.remotion.dev/docs/lambda/pagesrouterwebhook)

```ts
// pagesRouterWebhook.ts
import {pagesRouterWebhook} from '@remotion/lambda/client';
// Next.js Pages Router: pages/api/remotion-webhook.ts
export default pagesRouterWebhook({
  secret: process.env.REMOTION_WEBHOOK_SECRET as string,
  onSuccess: (p) => console.log('done', p.outputUrl), onError: () => undefined, onTimeout: () => undefined,
});
```

#### expressWebhook()

Handle incoming webhooks specifically for Express.js — [docs](https://www.remotion.dev/docs/lambda/expresswebhook)

```ts
// expressWebhook.ts
import express from 'express';
import {expressWebhook} from '@remotion/lambda/client';
// Express: needs JSON body parsing on the route.
const handler = expressWebhook({secret: process.env.REMOTION_WEBHOOK_SECRET as string, onSuccess: (p) => console.log(p.outputUrl), onError: () => undefined, onTimeout: () => undefined});
const app = express();
app.post('/remotion-webhook', express.json(), handler);
app.options('/remotion-webhook', express.json(), handler);
```

#### renderVideoOnLambda() (exported, not in docs table)

```ts
// renderVideoOnLambda.ts
import {deleteRender, renderVideoOnLambda} from '@remotion/lambda/client';
import {bucketName, functionName, region, serveUrl} from './_config';
// Exported, not in the docs table: renderVideoOnLambda = older name for renderMediaOnLambda; deleteRender removes a render's files from S3.
const {renderId} = await renderVideoOnLambda({region, functionName, serveUrl, composition: 'MyComp', codec: 'h264'});
await deleteRender({region, bucketName, renderId});
```

#### Shared helper used above

```tsx
// _config.ts
import type {AwsRegion} from '@remotion/lambda';
// Fill these once from your deploy output (`npx remotion lambda functions deploy` / `sites create`).
export const region: AwsRegion = 'ap-southeast-2'; // Sydney
export const functionName = 'remotion-render-4-0-529-mem2048mb-disk2048mb-240sec';
export const bucketName = 'remotionlambda-apsoutheast2-xxxxxxxxxx';
export const serveUrl = 'https://remotionlambda-apsoutheast2-xxxxxxxxxx.s3.ap-southeast-2.amazonaws.com/sites/finhub-videos/index.html';
```

## @remotion/licensing


#### registerUsageEvent()

Register a render — [docs](https://www.remotion.dev/docs/licensing/register-usage-event)

```ts
// registerUsageEvent.ts
import {registerUsageEvent} from '@remotion/licensing';
// Company-licence holders report each render (public key rm_pub_…). event: 'cloud-render' | 'webcodec-conversion'…
await registerUsageEvent({licenseKey: process.env.REMOTION_PUBLIC_LICENSE_KEY!, event: 'cloud-render', host: 'https://finhub.net.au', succeeded: true});
```

#### getUsage()

Query usage of company license — [docs](https://www.remotion.dev/docs/licensing/get-usage)

```ts
// getUsage.ts
import {getUsage} from '@remotion/licensing';
// Read your usage counts (secret key rm_sec_… — server only).
const usage = await getUsage({licenseKey: process.env.REMOTION_SECRET_LICENSE_KEY!, since: Date.now() - 30 * 24 * 3600 * 1000});
console.log(usage);
```

## @remotion/vercel


#### createSandbox()

Create a sandbox with Remotion installed — [docs](https://www.remotion.dev/docs/vercel/create-sandbox)

```ts
// createSandbox.ts
import {createSandbox} from '@remotion/vercel';
// Spins up a Vercel Sandbox with Chrome + Remotion's renderer installed. Stop it when finished.
const sandbox = await createSandbox({onProgress: async ({progress, message}) => console.log(`${message} ${Math.round(progress * 100)}%`)});
await sandbox.stop();
```

#### addBundleToSandbox()

Copy a Remotion bundle into a sandbox — [docs](https://www.remotion.dev/docs/vercel/add-bundle-to-sandbox)

```ts
// addBundleToSandbox.ts
import {addBundleToSandbox, createSandbox} from '@remotion/vercel';
// Copy your built bundle (`npx remotion bundle` → ./build) into the sandbox before rendering.
const sandbox = await createSandbox();
await addBundleToSandbox({sandbox, bundleDir: './build'});
await sandbox.stop();
```

#### renderMediaOnVercel()

Render a video in a sandbox — [docs](https://www.remotion.dev/docs/vercel/render-media-on-vercel)

```ts
// renderMediaOnVercel.ts
import {addBundleToSandbox, createSandbox, renderMediaOnVercel} from '@remotion/vercel';
// Render inside the sandbox; returns the file path within the sandbox.
const sandbox = await createSandbox();
await addBundleToSandbox({sandbox, bundleDir: './build'});
const {sandboxFilePath} = await renderMediaOnVercel({sandbox, compositionId: 'RateAlert', inputProps: {rate: '5.89%'},
  onProgress: async (u) => { if (u.stage === 'render-progress') console.log(Math.round(u.progress.progress * 100)); }});
console.log(sandboxFilePath);
```

#### getRenderProgress()

Poll a detached sandbox render — [docs](https://www.remotion.dev/docs/vercel/get-render-progress)

```ts
// getRenderProgress.ts
import {getRenderProgress} from '@remotion/vercel';
// For detached renders: poll by sandboxId + cmdId from a route handler.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const sandboxId = u.searchParams.get('sandboxId'); const cmdId = u.searchParams.get('cmdId');
  if (!sandboxId || !cmdId) return Response.json({error: 'Missing params'}, {status: 400});
  return Response.json(await getRenderProgress({sandboxId, cmdId}));
}
```

#### renderStillOnVercel()

Render a still image in a sandbox — [docs](https://www.remotion.dev/docs/vercel/render-still-on-vercel)

```ts
// renderStillOnVercel.ts
import {addBundleToSandbox, createSandbox, renderStillOnVercel} from '@remotion/vercel';
const sandbox = await createSandbox();
await addBundleToSandbox({sandbox, bundleDir: './build'});
const {sandboxFilePath} = await renderStillOnVercel({sandbox, compositionId: 'Thumbnail', inputProps: {title: 'Refinance'}, imageFormat: 'png'});
console.log(sandboxFilePath);
```

#### uploadToVercelBlob()

Upload a file from the sandbox to Vercel Blob — [docs](https://www.remotion.dev/docs/vercel/upload-to-vercel-blob)

```ts
// uploadToVercelBlob.ts
import {addBundleToSandbox, createSandbox, renderMediaOnVercel, uploadToVercelBlob} from '@remotion/vercel';
// Move the rendered file from the sandbox to Vercel Blob storage for a public URL.
const sandbox = await createSandbox();
await addBundleToSandbox({sandbox, bundleDir: './build'});
const {sandboxFilePath} = await renderMediaOnVercel({sandbox, compositionId: 'RateAlert', inputProps: {rate: '5.89%'}});
const {url, size} = await uploadToVercelBlob({sandbox, sandboxFilePath, contentType: 'video/mp4', blobToken: process.env.BLOB_READ_WRITE_TOKEN!, access: 'public'});
console.log(url, size);
await sandbox.stop();
```

#### Types

TypeScript types reference — [docs](https://www.remotion.dev/docs/vercel/types)

```ts
// Types.ts
import type {RenderMediaOnVercelProgress} from '@remotion/vercel';
// Types page: e.g. the progress union passed to onProgress.
export const onProgress = async (u: RenderMediaOnVercelProgress) => {
  console.log(`Overall ${Math.round(u.overallProgress * 100)}%`, u.stage);
};
```


Covers `@remotion/media-parser`, `@remotion/webcodecs`, `@remotion/video-matting`, `@remotion/whisper-webgpu`, `@remotion/install-whisper-cpp`, `@remotion/elevenlabs`, `@remotion/openai-whisper`, `@remotion/animated-emoji`, `@remotion/fonts`, `@remotion/gif`, `@remotion/gsap`, `@remotion/lottie`, `@remotion/rive`, `@remotion/skia`, `@remotion/three`, `@remotion/tailwind`, `@remotion/tailwind-v4`, `@remotion/enable-scss`. Every snippet type-checks under `tsc --strict` against v4.0.529. Assets referenced via `staticFile()` (logo.png, talking-head.mp4, music.mp3…) are placeholders — put your own files in `public/`. 


## @remotion/animated-emoji


#### <AnimatedEmoji>

Component for rendering an animated emoji. — [docs](https://www.remotion.dev/docs/animated-emoji/animated-emoji)

```tsx
// AnimatedEmoji.tsx
import {AnimatedEmoji} from '@remotion/animated-emoji';
import {AbsoluteFill} from 'remotion';
// Google's animated Noto emoji as a frame-synced video.
export const MyComp = () => <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><AnimatedEmoji emoji="partying-face" style={{width: 300, height: 300}} /></AbsoluteFill>;
```

#### getAvailableEmoji()

Get a list of available emoji. — [docs](https://www.remotion.dev/docs/animated-emoji/get-available-emoji)

```ts
// getAvailableEmoji.ts
import {getAvailableEmojis} from '@remotion/animated-emoji';
// Docs call it getAvailableEmoji(); v4.0.529 exports getAvailableEmojis().
console.log(getAvailableEmojis().slice(0, 5));
```

## @remotion/elevenlabs


#### elevenLabsTranscriptToCaptions()

Turn ElevenLabs Speech to Text output into an array of `Caption` — [docs](https://www.remotion.dev/docs/elevenlabs/elevenlabs-transcript-to-captions)

```ts
// elevenLabsTranscriptToCaptions.ts
import fs from 'fs';
import {elevenLabsTranscriptToCaptions} from '@remotion/elevenlabs';
// ElevenLabs Scribe (word timestamps) → Caption[].
const form = new FormData();
form.append('file', new Blob([fs.readFileSync('audio.mp3')]));
form.append('model_id', 'scribe_v2');
form.append('timestamps_granularity', 'word');
const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {method: 'POST', headers: {'xi-api-key': process.env.ELEVENLABS_API_KEY!}, body: form});
const {captions} = elevenLabsTranscriptToCaptions({transcript: await res.json()});
fs.writeFileSync('public/captions.json', JSON.stringify(captions));
```

## @remotion/enable-scss


#### enableScss()

Override the bundler config to enable SCSS — [docs](https://www.remotion.dev/docs/enable-scss/enable-scss)

```ts
// enableScss.ts
// remotion.config.ts — lets you `import './styles.scss'`. For bundle()/deploySite, pass the same override as webpackOverride.
import {Config} from '@remotion/cli/config';
import {enableScss} from '@remotion/enable-scss';
Config.overrideWebpackConfig((c) => enableScss(c));
```

## @remotion/fonts


#### loadFont()

Load a font from a URL or a local file — [docs](https://www.remotion.dev/docs/fonts-api/load-font)

```tsx
// loadFont.tsx
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, staticFile} from 'remotion';
// Load a local font file from /public; the render waits until it's ready.
loadFont({family: 'FinHub Sans', url: staticFile('fonts/FinHubSans-Bold.woff2'), weight: '700', format: 'woff2'}).then(() => console.log('font ready'));
export const MyComp = () => <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: 'FinHub Sans', fontWeight: 700, fontSize: 100}}>Brand font</AbsoluteFill>;
```

## @remotion/gif


#### <Gif>

Render a GIF — [docs](https://www.remotion.dev/docs/gif/gif)

```tsx
// Gif.tsx
import {Gif} from '@remotion/gif';
import {AbsoluteFill, staticFile} from 'remotion';
// GIF synced to the timeline (not the browser's clock). loopBehavior: loop | pause-after-finish | unmount-after-finish.
export const MyComp = () => <AbsoluteFill><Gif src={staticFile('reaction.gif')} width={500} height={500} fit="contain" loopBehavior="pause-after-finish" /></AbsoluteFill>;
```

#### getGifDurationInSeconds()

Get the runtime of a GIF — [docs](https://www.remotion.dev/docs/gif/get-gif-duration-in-seconds)

```tsx
// getGifDurationInSeconds.tsx
import {getGifDurationInSeconds} from '@remotion/gif';
import {Composition, staticFile} from 'remotion';
// Size a composition to a GIF's length.
const C: React.FC<{src: string}> = () => null;
export const Root = () => <Composition id="GifComp" component={C} fps={30} width={500} height={500} durationInFrames={1} defaultProps={{src: staticFile('reaction.gif')}}
  calculateMetadata={async ({props}) => ({durationInFrames: Math.ceil((await getGifDurationInSeconds(props.src)) * 30)})} />;
```

#### preloadGif()

Prepare a GIF for displaying in the Player — [docs](https://www.remotion.dev/docs/gif/preload-gif)

```ts
// preloadGif.ts
import {preloadGif} from '@remotion/gif';
// Player: fetch + decode a GIF before it appears. Returns {waitUntilDone, free}.
const {waitUntilDone, free} = preloadGif('https://example.com/reaction.gif');
await waitUntilDone();
export const cleanup = free;
```

## @remotion/gsap


#### `useGsapTimeline()`

Build a GSAP timeline that is driven by the Remotion frame — [docs](https://www.remotion.dev/docs/gsap/use-gsap-timeline)

```tsx
// useGsapTimeline.tsx
import {useGsapTimeline} from '@remotion/gsap';
import {AbsoluteFill} from 'remotion';
// A paused GSAP timeline scrubbed by Remotion's frame. Scope selectors to the returned ref.
export const MyComp = () => {
  const scope = useGsapTimeline<HTMLDivElement>(({timeline, selector}) => {
    timeline.from(selector('[data-title]'), {y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'})
      .to(selector('[data-badge]'), {rotation: 360, duration: 2, ease: 'none'});
  });
  return (<AbsoluteFill ref={scope} style={{background: '#000', color: '#fff'}}><h1 data-title>Hello GSAP</h1><div data-badge style={{width: 60, height: 60, background: '#F5B400'}} /></AbsoluteFill>);
};
```

## @remotion/install-whisper-cpp


#### installWhisperCpp()

Install the whisper.cpp software — [docs](https://www.remotion.dev/docs/install-whisper-cpp/install-whisper-cpp)

```ts
// installWhisperCpp.ts
import path from 'path';
import {installWhisperCpp} from '@remotion/install-whisper-cpp';
// Downloads + builds whisper.cpp locally (server/desktop). Idempotent.
const {alreadyExisted} = await installWhisperCpp({to: path.resolve('whisper.cpp'), version: '1.5.5'});
console.log(alreadyExisted);
```

#### downloadWhisperModel()

Download a Whisper model — [docs](https://www.remotion.dev/docs/install-whisper-cpp/download-whisper-model)

```ts
// downloadWhisperModel.ts
import path from 'path';
import {downloadWhisperModel} from '@remotion/install-whisper-cpp';
// Multilingual 'medium' handles Vietnamese; '*.en' models are English-only.
await downloadWhisperModel({model: 'medium', folder: path.resolve('whisper.cpp'), onProgress: (d, t) => console.log(`${Math.round((d / t) * 100)}%`)});
```

#### transcribe()

Transcribe an audio file — [docs](https://www.remotion.dev/docs/install-whisper-cpp/transcribe)

```ts
// transcribe.ts
import path from 'path';
import {transcribe} from '@remotion/install-whisper-cpp';
// Input must be 16 kHz WAV:  ffmpeg -i clip.mp4 -ar 16000 audio.wav -y
const out = await transcribe({inputPath: path.resolve('audio.wav'), whisperPath: path.resolve('whisper.cpp'), whisperCppVersion: '1.5.5',
  model: 'medium', tokenLevelTimestamps: true, language: 'vi'});
console.log(out.transcription.length);
```

#### toCaptions()

Converts the output from `transcribe()` into an array of `Caption` objects — [docs](https://www.remotion.dev/docs/install-whisper-cpp/to-captions)

```ts
// toCaptions.ts
import fs from 'fs';
import path from 'path';
import {toCaptions, transcribe} from '@remotion/install-whisper-cpp';
const whisperCppOutput = await transcribe({inputPath: path.resolve('audio.wav'), whisperPath: path.resolve('whisper.cpp'), whisperCppVersion: '1.5.5', model: 'medium', tokenLevelTimestamps: true});
fs.writeFileSync('public/captions.json', JSON.stringify(toCaptions({whisperCppOutput}).captions));
```

## @remotion/lottie


#### <Lottie>

Embed a Lottie animation in Remotion — [docs](https://www.remotion.dev/docs/lottie/lottie)

```tsx
// Lottie.tsx
import {useEffect, useState} from 'react';
import {Lottie, type LottieAnimationData} from '@remotion/lottie';
import {AbsoluteFill, cancelRender, staticFile, useDelayRender} from 'remotion';
// Lottie JSON synced to frames. Load the JSON with delayRender so the render waits.
export const MyComp = () => {
  const {delayRender, continueRender} = useDelayRender();
  const [handle] = useState(() => delayRender('Loading Lottie'));
  const [data, setData] = useState<LottieAnimationData | null>(null);
  useEffect(() => { fetch(staticFile('confetti.json')).then((r) => r.json()).then((j) => { setData(j); continueRender(handle); }).catch(cancelRender); }, [handle, continueRender]);
  return <AbsoluteFill>{data ? <Lottie animationData={data} loop playbackRate={1} /> : null}</AbsoluteFill>;
};
```

#### getLottieMetadata()

Get metadata of a Lottie animation — [docs](https://www.remotion.dev/docs/lottie/getlottiemetadata)

```tsx
// getLottieMetadata.tsx
import {getLottieMetadata, type LottieAnimationData} from '@remotion/lottie';
import {Composition} from 'remotion';
import animation from './confetti.json';
// Duration, fps and size from the Lottie file → size the composition to match.
const meta = getLottieMetadata(animation as unknown as LottieAnimationData);
const C: React.FC = () => null;
export const Root = () => meta ? <Composition id="Confetti" component={C} durationInFrames={meta.durationInFrames} fps={meta.fps} width={meta.width} height={meta.height} /> : null;
```

#### staticFile()

Load Lottie animations from a static file — [docs](https://www.remotion.dev/docs/lottie/staticfile)

```tsx
// staticFile.tsx
// Lottie docs page "staticFile()": put .json/.lottie files in /public and fetch via staticFile() (see Lottie.tsx).
import {staticFile} from 'remotion';
export const url = staticFile('confetti.json');
```

#### 

Loading Lottie animations from a remote URL — [docs](https://www.remotion.dev/docs/lottie/remote)

_No example: reference-only._


#### 

Where to find Lottie files — [docs](https://www.remotion.dev/docs/lottie/lottiefiles)

_No example: reference-only._


## @remotion/media-parser


#### Getting video metadata

Simple examples of extracting video metadata — [docs](https://www.remotion.dev/docs/media-parser/metadata)

```ts
// GettingVideoMetadata.ts
import {parseMedia} from '@remotion/media-parser';
// Ask only for the fields you need — parsing stops as soon as they're known.
const src = 'https://remotion.media/video.mp4';
const {durationInSeconds, dimensions, fps, videoCodec, audioCodec, rotation} = await parseMedia({src, fields: {durationInSeconds: true, dimensions: true, fps: true, videoCodec: true, audioCodec: true, rotation: true}});
console.log(durationInSeconds, dimensions, fps, videoCodec, audioCodec, rotation);
```

#### Available fields

Information you can get using the media parser — [docs](https://www.remotion.dev/docs/media-parser/fields)

```ts
// AvailableFields.ts
import {parseMedia} from '@remotion/media-parser';
// A broad sample of available fields (see docs for the full list and cost of each).
const src = 'https://remotion.media/video.mp4';
const r = await parseMedia({src, fields: {container: true, size: true, name: true, mimeType: true, tracks: true, keyframes: true, isHdr: true, location: true, slowFps: true, slowNumberOfFrames: true}});
console.log(r.container, r.size, r.tracks.length, r.keyframes, r.isHdr, r.location, r.slowFps, r.slowNumberOfFrames);
```

#### Fast and slow operations

Efficently use `parseMedia()` — [docs](https://www.remotion.dev/docs/media-parser/fast-and-slow)

```ts
// FastAndSlowOperations.ts
import {parseMedia} from '@remotion/media-parser';
// Fast fields read only the header; "slow*" fields need the whole file. internalStats shows how far it read.
const src = 'https://remotion.media/video.mp4';
const fast = await parseMedia({src, fields: {container: true, internalStats: true}});
console.log('bytes read', fast.internalStats.finalCursorOffset);
const slow = await parseMedia({src, fields: {slowDurationInSeconds: true, internalStats: true}});
console.log(slow.slowDurationInSeconds, slow.internalStats.finalCursorOffset);
```

#### Extract samples

Extract video and audio samples from a media file — [docs](https://www.remotion.dev/docs/media-parser/samples)

```ts
// ExtractSamples.ts
import {parseMedia} from '@remotion/media-parser';
// Return a callback from onVideoTrack/onAudioTrack to receive every encoded sample.
const src = 'https://remotion.media/video.mp4';
let videoSamples = 0, audioSamples = 0;
await parseMedia({
  src,
  onVideoTrack: ({track}) => { console.log(track.codec, track.width, track.height); return () => { videoSamples++; }; },
  onAudioTrack: () => (sample) => { audioSamples++; void sample.timestamp; },
});
console.log(videoSamples, audioSamples);
```

#### Readers

Read from a variety of sources — [docs](https://www.remotion.dev/docs/media-parser/readers)

```ts
// Readers.ts
import {parseMedia} from '@remotion/media-parser';
import {nodeReader} from '@remotion/media-parser/node';
import {webReader} from '@remotion/media-parser/web';
// Pick where bytes come from: web (fetch/File, default), node (local fs), universal (either).
export const local = () => parseMedia({src: './public/talking-head.mp4', reader: nodeReader, fields: {durationInSeconds: true}});
export const fromFile = (file: File) => parseMedia({src: file, reader: webReader, fields: {durationInSeconds: true}});
```

#### Pause, resume and abort

Steer the parsing process — [docs](https://www.remotion.dev/docs/media-parser/pause-resume-abort)

```ts
// PauseResumeAndAbort.ts
import {hasBeenAborted, mediaParserController, parseMedia} from '@remotion/media-parser';
const src = 'https://remotion.media/video.mp4';
const controller = mediaParserController();
const job = parseMedia({src, controller, fields: {slowDurationInSeconds: true}}).catch((e) => { if (!hasBeenAborted(e)) throw e; });
controller.pause();
await new Promise((r) => setTimeout(r, 500));
controller.resume();
setTimeout(() => controller.abort(), 2000);
await job;
```

#### Seeking

Seek to a different position in a media file — [docs](https://www.remotion.dev/docs/media-parser/seeking)

```ts
// Seeking.ts
import {mediaParserController, parseMedia} from '@remotion/media-parser';
// Seek before or during a parse; samples resume from the nearest keyframe.
const src = 'https://remotion.media/video.mp4';
const controller = mediaParserController();
controller.seek(5);
await parseMedia({src, controller, onVideoTrack: () => (sample) => { console.log(sample.timestamp); controller.abort(); }}).catch(() => undefined);
```

#### Format support

What you can parse — [docs](https://www.remotion.dev/docs/media-parser/format-support)

```ts
// FormatSupport.ts
import {parseMedia} from '@remotion/media-parser';
// Supported containers: MP4/MOV, WebM/MKV, AVI, TS, MP3, WAV, AAC, FLAC, M3U8 (see docs table). Check what you got:
const src = 'https://remotion.media/video.mp4';
const {container} = await parseMedia({src, fields: {container: true}});
console.log(container); // 'mp4' | 'webm' | 'iso-base-media' | ...
```

#### Runtime support

Where you can run it — [docs](https://www.remotion.dev/docs/media-parser/runtime-support)

```ts
// RuntimeSupport.ts
// Needs fetch + resizable ArrayBuffer (modern browsers, Node 20+, Bun). Feature-detect before use:
export const canUseMediaParser = typeof fetch === 'function' && 'resize' in ArrayBuffer.prototype;
```

#### Extract ID3 tags and EXIF data

Get embedded tags from video files — [docs](https://www.remotion.dev/docs/media-parser/tags)

```ts
// ExtractID3TagsAndEXIFData.ts
import {parseMedia} from '@remotion/media-parser';
// Container metadata: ID3 tags, QuickTime keys (camera model, encoder, dates).
const src = 'https://remotion.media/video.mp4';
const {metadata} = await parseMedia({src, fields: {metadata: true}});
for (const m of metadata) console.log(m.key, m.value);
```

#### Web Workers

Parse a media file in the browser on a separate thread. — [docs](https://www.remotion.dev/docs/media-parser/workers)

```ts
// WebWorkers.ts
import {parseMediaOnWebWorker} from '@remotion/media-parser/worker';
// Same API, runs off the main thread.
const src = 'https://remotion.media/video.mp4';
const r = await parseMediaOnWebWorker({src, fields: {durationInSeconds: true, dimensions: true}});
console.log(r.durationInSeconds, r.dimensions);
```

#### Download and parse

Download a media file to disk and parse it simultaneously — [docs](https://www.remotion.dev/docs/media-parser/download-and-parse)

```ts
// DownloadAndParse.ts
import {downloadAndParseMedia} from '@remotion/media-parser';
import {nodeWriter} from '@remotion/media-parser/node-writer';
// Download to disk AND read metadata in one pass (e.g. validate an upload while saving it).
const {durationInSeconds, tracks} = await downloadAndParseMedia({src: 'https://remotion.media/video.mp4', writer: nodeWriter('tmp/upload.mp4'), fields: {durationInSeconds: true, tracks: true}});
console.log(durationInSeconds, tracks.length);
```

#### Foreign file types

Get information from the errors when passing unsupported file types — [docs](https://www.remotion.dev/docs/media-parser/foreign-file-types)

```ts
// ForeignFileTypes.ts
import {IsAPdfError, IsAnImageError, IsAnUnsupportedFileTypeError, parseMedia} from '@remotion/media-parser';
// Detect "this isn't a video" cleanly when users upload the wrong file.
export const check = async (src: string) => {
  try { await parseMedia({src, fields: {}}); return 'video/audio'; }
  catch (e) {
    if (e instanceof IsAnImageError) return `image ${e.imageType}`;
    if (e instanceof IsAPdfError) return 'pdf';
    if (e instanceof IsAnUnsupportedFileTypeError) return 'unsupported';
    throw e;
  }
};
```

#### WebCodecs

Decode video and audio frames in the browser — [docs](https://www.remotion.dev/docs/media-parser/webcodecs)

```ts
// WebCodecs.ts
import {parseMedia} from '@remotion/media-parser';
// Feed samples straight into the browser's VideoDecoder (track objects are VideoDecoderConfig-compatible).
const src = 'https://remotion.media/video.mp4';
await parseMedia({
  src,
  onVideoTrack: ({track}) => {
    const decoder = new VideoDecoder({output: (frame) => frame.close(), error: console.error});
    decoder.configure(track);
    return (sample) => decoder.decode(new EncodedVideoChunk(sample));
  },
});
```

#### Stream selection

Choose which streams to use in a HLS Playlist — [docs](https://www.remotion.dev/docs/media-parser/stream-selection)

```ts
// StreamSelection.ts
import {parseMedia} from '@remotion/media-parser';
// HLS (.m3u8): choose which variant stream to parse.
await parseMedia({
  src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  selectM3uStream: ({streams}) => streams.reduce((best, s) => ((s.bandwidthInBitsPerSec ?? Infinity) < (best.bandwidthInBitsPerSec ?? Infinity) ? s : best)).id,
  fields: {durationInSeconds: true},
});
```

#### parseMedia()

Parse a media file. — [docs](https://www.remotion.dev/docs/media-parser/parse-media)

```ts
// parseMedia.ts
import {parseMedia} from '@remotion/media-parser';
import {nodeReader} from '@remotion/media-parser/node';
// Core API — local file example (e.g. checking a talking-head clip before editing).
const r = await parseMedia({src: './public/talking-head.mp4', reader: nodeReader, fields: {durationInSeconds: true, dimensions: true, fps: true, rotation: true}});
console.log(r);
```

#### downloadAndParseMedia()

Download and parse a media file. — [docs](https://www.remotion.dev/docs/media-parser/download-and-parse-media)

```ts
// downloadAndParseMedia.ts
import {downloadAndParseMedia} from '@remotion/media-parser';
import {nodeWriter} from '@remotion/media-parser/node-writer';
await downloadAndParseMedia({src: 'https://remotion.media/video.mp4', writer: nodeWriter('output.mp4')});
```

#### parseMediaOnWebWorker()

Parse a media file in the browser on a separate thread. — [docs](https://www.remotion.dev/docs/media-parser/parse-media-on-web-worker)

```ts
// parseMediaOnWebWorker.ts
import {parseMediaOnWebWorker} from '@remotion/media-parser/worker';
export const probe = (file: File) => parseMediaOnWebWorker({src: file, fields: {durationInSeconds: true, dimensions: true}});
```

#### parseMediaOnServerWorker()

Parse a media file on the server on a separate thread. — [docs](https://www.remotion.dev/docs/media-parser/parse-media-on-server-worker)

```ts
// parseMediaOnServerWorker.ts
import {parseMediaOnServerWorker} from '@remotion/media-parser/server-worker';
// Node worker thread — keeps a server's event loop free while parsing big files.
const r = await parseMediaOnServerWorker({src: '/tmp/video.mp4', fields: {durationInSeconds: true, dimensions: true}});
console.log(r.durationInSeconds);
```

#### mediaParserController()

Pause, resume and abort the parsing. — [docs](https://www.remotion.dev/docs/media-parser/media-parser-controller)

```ts
// mediaParserController.ts
import {mediaParserController, parseMedia} from '@remotion/media-parser';
// One object for pause/resume/abort/seek; pass as `controller`.
const controller = mediaParserController();
void parseMedia({src: 'https://remotion.media/video.mp4', controller}).catch(() => undefined);
controller.pause(); controller.resume(); controller.abort();
```

#### hasBeenAborted()

Determine from an error if the parsing has been aborted. — [docs](https://www.remotion.dev/docs/media-parser/has-been-aborted)

```ts
// hasBeenAborted.ts
import {hasBeenAborted, parseMedia} from '@remotion/media-parser';
try { await parseMedia({src: 'https://remotion.media/video.mp4'}); }
catch (e) { console.log(hasBeenAborted(e) ? 'aborted by us' : 'real failure'); }
```

#### WEBCODECS_TIMESCALE

The global timescale (`1_000_000`) of WebCodecs as a constant. — [docs](https://www.remotion.dev/docs/media-parser/webcodecs-timescale)

```ts
// WEBCODECS_TIMESCALE.ts
import {WEBCODECS_TIMESCALE} from '@remotion/media-parser';
// Sample timestamps are in microseconds (1_000_000 per second).
export const toSeconds = (timestamp: number) => timestamp / WEBCODECS_TIMESCALE;
```

#### nodeReader

Read a file from the local file system. — [docs](https://www.remotion.dev/docs/media-parser/node-reader)

```ts
// nodeReader.ts
import {parseMedia} from '@remotion/media-parser';
import {nodeReader} from '@remotion/media-parser/node';
const r = await parseMedia({src: './public/talking-head.mp4', reader: nodeReader, fields: {durationInSeconds: true}});
console.log(r.durationInSeconds);
```

#### webReader

Read a file from a `File` or from a URL. — [docs](https://www.remotion.dev/docs/media-parser/web-reader)

```ts
// webReader.ts
import {parseMedia} from '@remotion/media-parser';
import {webReader} from '@remotion/media-parser/web';
export const probe = (file: File) => parseMedia({src: file, reader: webReader, fields: {dimensions: true}});
```

#### universalReader

Read a file from a `File`, from a URL or from the local file system — [docs](https://www.remotion.dev/docs/media-parser/universal-reader)

```ts
// universalReader.ts
import {parseMedia} from '@remotion/media-parser';
import {universalReader} from '@remotion/media-parser/universal';
// Works with a URL, File, or local path — useful in code shared between browser and server.
export const probe = (src: string | File) => parseMedia({src, reader: universalReader, fields: {durationInSeconds: true}});
```

#### nodeWriter

Write a file to the local file system using Node. — [docs](https://www.remotion.dev/docs/media-parser/node-writer)

```ts
// nodeWriter.ts
import {downloadAndParseMedia} from '@remotion/media-parser';
import {nodeWriter} from '@remotion/media-parser/node-writer';
// Writer used by downloadAndParseMedia to stream bytes to a local file.
await downloadAndParseMedia({src: 'https://remotion.media/video.mp4', writer: nodeWriter('downloads/video.mp4')});
```

#### TypeScript types

Reference for the types returned by Media Parser. — [docs](https://www.remotion.dev/docs/media-parser/types)

```ts
// TypeScriptTypes.ts
import type {MediaParserAudioTrack, MediaParserDimensions, MediaParserVideoTrack} from '@remotion/media-parser';
// Exported types for your own helpers.
export const aspect = (d: MediaParserDimensions) => d.width / d.height;
export const describe = (t: MediaParserVideoTrack | MediaParserAudioTrack) => (t.type === 'video' ? `${t.width}x${t.height}` : `${t.sampleRate}Hz`);
```

## @remotion/openai-whisper


#### openAiWhisperApiToCaptions()

Turn OpenAI Whisper API transcriptions into an array of `Caption` — [docs](https://www.remotion.dev/docs/openai-whisper/openai-whisper-api-to-captions)

```ts
// openAiWhisperApiToCaptions.ts
import fs from 'fs';
import OpenAI from 'openai';
import {openAiWhisperApiToCaptions} from '@remotion/openai-whisper';
// OpenAI transcription (verbose_json + word timestamps) → Caption[].
const t = await new OpenAI().audio.transcriptions.create({file: fs.createReadStream('audio.mp3'), model: 'whisper-1', response_format: 'verbose_json', timestamp_granularities: ['word']});
fs.writeFileSync('public/captions.json', JSON.stringify(openAiWhisperApiToCaptions({transcription: t}).captions));
```

## @remotion/rive


#### <RemotionRiveCanvas>

Render a Rive animation — [docs](https://www.remotion.dev/docs/rive/remotionrivecanvas)

```tsx
// RemotionRiveCanvas.tsx
import {RemotionRiveCanvas} from '@remotion/rive';
import {AbsoluteFill, staticFile} from 'remotion';
// Rive animation driven by the timeline. Pick artboard/animation by name if the file has several.
export const MyComp = () => <AbsoluteFill><RemotionRiveCanvas src={staticFile('logo.riv')} fit="contain" alignment="center" /></AbsoluteFill>;
```

## @remotion/skia


#### enableSkia()

Webpack override for enabling Skia — [docs](https://www.remotion.dev/docs/skia/enable-skia)

```ts
// enableSkia.ts
// remotion.config.ts — required once before using <SkiaCanvas>.
import {Config} from '@remotion/cli/config';
import {enableSkia} from '@remotion/skia/enable';
Config.overrideWebpackConfig((c) => enableSkia(c));
```

#### <SkiaCanvas>

React Native Skia <Canvas> wrapper — [docs](https://www.remotion.dev/docs/skia/skia-canvas)

```tsx
// SkiaCanvas.tsx
import {Circle, Fill, LinearGradient, Rect, vec} from '@shopify/react-native-skia';
import {SkiaCanvas} from '@remotion/skia';
import {useCurrentFrame, useVideoConfig} from 'remotion';
// GPU 2D drawing with React Native Skia primitives.
export const MyComp = () => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  return (
    <SkiaCanvas width={width} height={height}>
      <Fill color="#0B1F3A" />
      <Rect x={0} y={0} width={width} height={height}><LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={['#0B1F3A', '#1C4E80']} /></Rect>
      <Circle cx={width / 2} cy={height / 2} r={80 + f * 2} color="#F5B400" />
    </SkiaCanvas>
  );
};
```

## @remotion/tailwind


#### enableTailwind()

Override the bundler config to enable TailwindCSS — [docs](https://www.remotion.dev/docs/tailwind/enable-tailwind)

```ts
// enableTailwind.ts
// remotion.config.ts — Tailwind v3 (needs tailwind.config.js + a CSS file with @tailwind directives).
import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind';
Config.overrideWebpackConfig((c) => enableTailwind(c));
```

## @remotion/tailwind-v4


#### enableTailwind()

Override the bundler config to enable TailwindCSS — [docs](https://www.remotion.dev/docs/tailwind-v4/enable-tailwind)

```ts
// enableTailwind.ts
// remotion.config.ts — Tailwind v4 (CSS file with @import "tailwindcss"; import it in Root). Your project already uses this.
import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind-v4';
Config.overrideWebpackConfig((c) => enableTailwind(c));
```

## @remotion/three


#### <ThreeCanvas>

A wrapper for React Three Fiber' Canvas — [docs](https://www.remotion.dev/docs/three-canvas)

```tsx
// ThreeCanvas.tsx
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
// React Three Fiber canvas synced to Remotion frames. Drive rotation/position from the frame.
export const MyComp = () => {
  const f = useCurrentFrame(); const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#0B1F3A'}}>
      <ThreeCanvas width={width} height={height} camera={{fov: 75, position: [0, 0, 5]}}>
        <ambientLight intensity={1} /><pointLight position={[5, 5, 5]} intensity={50} />
        <mesh rotation={[f / 40, f / 30, 0]}><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color="#F5B400" /></mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
```

#### <ThreeWebGPUCanvas>

Use Three.js with the WebGPU renderer — [docs](https://www.remotion.dev/docs/three-webgpu-canvas)

```tsx
// ThreeWebGPUCanvas.tsx
import {ThreeWebGPUCanvas} from '@remotion/three/webgpu';
import {useCurrentFrame, useVideoConfig} from 'remotion';
// Same as ThreeCanvas but uses three.js's WebGPU renderer (needs WebGPU in the render browser).
export const MyComp = () => {
  const f = useCurrentFrame(); const {width, height} = useVideoConfig();
  return (
    <ThreeWebGPUCanvas width={width} height={height} camera={{fov: 60, position: [0, 0, 5]}}>
      <ambientLight intensity={0.4} /><directionalLight position={[5, 5, 5]} intensity={2.5} />
      <mesh rotation={[f / 80, f / 100, 0]}><torusKnotGeometry args={[1.1, 0.38, 220, 36]} /><meshStandardMaterial color="#1C4E80" /></mesh>
    </ThreeWebGPUCanvas>
  );
};
```

#### useVideoTexture(

Use a video in React Three Fiber — [docs](https://www.remotion.dev/docs/use-video-texture)

```tsx
// useVideoTexture.tsx
import {useRef} from 'react';
import {ThreeCanvas, useVideoTexture} from '@remotion/three';
import {AbsoluteFill, Html5Video, staticFile, useVideoConfig} from 'remotion';
// Browser-video texture (preview-friendly). For frame-exact renders prefer useOffthreadVideoTexture.
export const MyComp = () => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const texture = useVideoTexture(ref);
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Html5Video ref={ref} src={staticFile('clip.mp4')} style={{position: 'absolute', opacity: 0}} />
      <ThreeCanvas width={width} height={height}><mesh><planeGeometry args={[4, 2.25]} />{texture ? <meshBasicMaterial map={texture} /> : null}</mesh></ThreeCanvas>
    </AbsoluteFill>
  );
};
```

#### useOffthreadVideoTexture()

Use an <OffthreadVideo> in React Three Fiber — [docs](https://www.remotion.dev/docs/use-offthread-video-texture)

```tsx
// useOffthreadVideoTexture.tsx
import {ThreeCanvas, useOffthreadVideoTexture} from '@remotion/three';
import {staticFile, useVideoConfig} from 'remotion';
// Frame-exact video texture during renders (e.g. a phone mockup playing your clip).
export const MyComp = () => {
  const {width, height} = useVideoConfig();
  const texture = useOffthreadVideoTexture({src: staticFile('clip.mp4')});
  return <ThreeCanvas width={width} height={height}><mesh rotation={[0, 0.3, 0]}><planeGeometry args={[2.25, 4]} />{texture ? <meshBasicMaterial map={texture} /> : null}</mesh></ThreeCanvas>;
};
```

## @remotion/video-matting


#### canUseVideoMatting()

Check whether a model is supported — [docs](https://www.remotion.dev/docs/video-matting/can-use-video-matting)

```ts
// canUseVideoMatting.ts
import {canUseVideoMatting} from '@remotion/video-matting';
// Browser capability check (WebGPU etc.); returns {supported} or {supported:false, reason}.
const r = await canUseVideoMatting({model: 'modnet'});
console.log(r.supported ? 'ok' : r.reason);
```

#### getAvailableModels()

List models and their download sizes — [docs](https://www.remotion.dev/docs/video-matting/get-available-models)

```ts
// getAvailableModels.ts
import {getAvailableModels} from '@remotion/video-matting';
// Model metadata: name ('modnet' | 'ben2-base'), size, id.
for (const m of getAvailableModels()) console.log(m.name, m.modelId);
```

#### isVideoMattingModelCached()

Check whether a model is downloaded — [docs](https://www.remotion.dev/docs/video-matting/is-video-matting-model-cached)

```ts
// isVideoMattingModelCached.ts
import {isVideoMattingModelCached} from '@remotion/video-matting';
console.log(await isVideoMattingModelCached({model: 'modnet'}));
```

#### downloadVideoMattingModel()

Download a model — [docs](https://www.remotion.dev/docs/video-matting/download-video-matting-model)

```ts
// downloadVideoMattingModel.ts
import {downloadVideoMattingModel} from '@remotion/video-matting';
// Cache model files in the browser ahead of time (show a progress bar).
const {alreadyDownloaded} = await downloadVideoMattingModel({model: 'modnet', onProgress: (p) => console.log(p)});
console.log(alreadyDownloaded);
```

#### loadVideoMattingModel()

Initialize a downloaded model — [docs](https://www.remotion.dev/docs/video-matting/load-video-matting-model)

```ts
// loadVideoMattingModel.ts
import {loadVideoMattingModel} from '@remotion/video-matting';
// Load into memory/GPU now so the first separateVideoLayers() call starts instantly.
const r = await loadVideoMattingModel({model: 'modnet'});
console.log(r.alreadyLoaded);
```

#### removeVideoMattingModel()

Remove a model from the browser cache — [docs](https://www.remotion.dev/docs/video-matting/remove-video-matting-model)

```ts
// removeVideoMattingModel.ts
import {removeVideoMattingModel} from '@remotion/video-matting';
// Delete cached model files from browser storage.
await removeVideoMattingModel({model: 'ben2-base'});
```

#### separateVideoLayers()

Create base and foreground WebM layers — [docs](https://www.remotion.dev/docs/video-matting/separate-video-layers)

```ts
// separateVideoLayers.ts
import {separateVideoLayers} from '@remotion/video-matting';
// Split into an opaque base + alpha foreground: put titles BETWEEN them so the speaker overlaps the text.
export const split = async (file: File) => {
  await using result = await separateVideoLayers({src: file, model: 'modnet', onProgress: (p) => console.log(p)});
  return {base: await result.base.getBlob(), foreground: await result.foreground.getBlob(), size: [result.width, result.height]};
};
```

#### disposeVideoMattingModel()

Release model memory — [docs](https://www.remotion.dev/docs/video-matting/dispose-video-matting-model)

```ts
// disposeVideoMattingModel.ts
import {disposeVideoMattingModel} from '@remotion/video-matting';
// Free GPU/memory when you're done (files stay cached).
await disposeVideoMattingModel({model: 'modnet'});
```

## @remotion/webcodecs


#### Convert a video

from one format to another — [docs](https://www.remotion.dev/docs/webcodecs/convert-a-video)

```ts
// ConvertAVideo.ts
import {convertMedia} from '@remotion/webcodecs';
// Browser re-encode: container mp4 | webm | wav; returns a result you save as a Blob.
const src = 'https://remotion.media/BigBuckBunny.mp4';
const result = await convertMedia({src, container: 'mp4', videoCodec: 'h264', audioCodec: 'aac', onProgress: ({overallProgress}) => console.log(overallProgress)});
export const blob = await result.save();
```

#### Rotate a video

Fix bad orientation — [docs](https://www.remotion.dev/docs/webcodecs/rotate-a-video)

```ts
// RotateAVideo.ts
import {convertMedia} from '@remotion/webcodecs';
// Rotate (90/180/270) during conversion — fix sideways phone clips.
const src = 'https://remotion.media/BigBuckBunny.mp4';
const r = await convertMedia({src, container: 'mp4', rotate: 90});
export const blob = await r.save();
```

#### Track Transformation

Copy, re-encode or drop tracks — [docs](https://www.remotion.dev/docs/webcodecs/track-transformation)

```ts
// TrackTransformation.ts
import {convertMedia} from '@remotion/webcodecs';
// Per-track decisions: copy, reencode, or drop. Here: drop audio, re-encode video to h264.
const src = 'https://remotion.media/BigBuckBunny.mp4';
const r = await convertMedia({
  src, container: 'mp4',
  onAudioTrack: () => ({type: 'drop'}),
  onVideoTrack: () => ({type: 'reencode', videoCodec: 'h264'}),
});
export const blob = await r.save();
```

#### Pause, resume and abort conversion

Steer the conversion process — [docs](https://www.remotion.dev/docs/webcodecs/pause-resume-abort)

```ts
// PauseResumeAndAbortConversion.ts
import {convertMedia, webcodecsController} from '@remotion/webcodecs';
const src = 'https://remotion.media/BigBuckBunny.mp4';
const controller = webcodecsController();
const job = convertMedia({src, container: 'webm', controller}).catch((e) => console.log('stopped', e));
controller.pause(); controller.resume();
setTimeout(() => controller.abort(), 3000);
await job;
```

#### Fix a MediaRecorder video

Fix missing video duration and poor seeking performance — [docs](https://www.remotion.dev/docs/webcodecs/fix-mediarecorder-video)

```ts
// FixAMediaRecorderVideo.ts
import {convertMedia} from '@remotion/webcodecs';
// MediaRecorder WebMs lack duration/seek info — remux/re-encode to a proper MP4.
export const fix = async (recorded: Blob) => (await convertMedia({src: recorded, container: 'mp4', videoCodec: 'h264', audioCodec: 'aac'})).save();
```

#### Resample audio to 16kHz

Resample an audio track to 16kHz for use with Whisper — [docs](https://www.remotion.dev/docs/webcodecs/resample-audio-16khz)

```ts
// ResampleAudioTo16kHz.ts
import {canReencodeAudioTrack, convertMedia} from '@remotion/webcodecs';
// 16 kHz mono-friendly WAV — the input Whisper models expect.
export const toWhisperWav = async (src: string | Blob) => {
  const out = await convertMedia({
    src, container: 'wav',
    onVideoTrack: () => ({type: 'drop'}),
    onAudioTrack: async ({track}) =>
      (await canReencodeAudioTrack({audioCodec: 'wav', track, bitrate: 128000, sampleRate: 16000}))
        ? {type: 'reencode', audioCodec: 'wav', bitrate: 128000, sampleRate: 16000}
        : {type: 'fail'},
  });
  return out.save();
};
```

#### convertMedia()

Converts a video using WebCodecs and Media Parser — [docs](https://www.remotion.dev/docs/webcodecs/convert-media)

```ts
// convertMedia.ts
import {convertMedia} from '@remotion/webcodecs';
const src = 'https://remotion.media/BigBuckBunny.mp4';
const r = await convertMedia({src, container: 'webm'});
export const blob = await r.save();
```

#### getAvailableContainers()

Get a list of containers `@remotion/webcodecs` supports. — [docs](https://www.remotion.dev/docs/webcodecs/get-available-containers)

```ts
// getAvailableContainers.ts
import {getAvailableContainers} from '@remotion/webcodecs';
console.log(getAvailableContainers()); // output containers convertMedia can write
```

#### webcodecsController()

Pause, resume and abort the conversion. — [docs](https://www.remotion.dev/docs/webcodecs/webcodecs-controller)

```ts
// webcodecsController.ts
import {convertMedia, webcodecsController} from '@remotion/webcodecs';
const controller = webcodecsController();
void convertMedia({src: 'https://remotion.media/BigBuckBunny.mp4', container: 'webm', controller}).catch(() => undefined);
controller.pause(); controller.resume(); controller.abort();
```

#### canReencodeVideoTrack()

Determine if a video track can be re-encoded — [docs](https://www.remotion.dev/docs/webcodecs/can-reencode-video-track)

```ts
// canReencodeVideoTrack.ts
import {parseMedia} from '@remotion/media-parser';
import {canReencodeVideoTrack} from '@remotion/webcodecs';
// Does THIS browser have an encoder for the target codec?
const {tracks} = await parseMedia({src: 'https://remotion.media/BigBuckBunny.mp4', fields: {tracks: true}});
for (const track of tracks) if (track.type === 'video') console.log(await canReencodeVideoTrack({track, videoCodec: 'h264', resizeOperation: null, rotate: null}));
```

#### canReencodeAudioTrack()

Determine if a audio track can be re-encoded — [docs](https://www.remotion.dev/docs/webcodecs/can-reencode-audio-track)

```ts
// canReencodeAudioTrack.ts
import {parseMedia} from '@remotion/media-parser';
import {canReencodeAudioTrack} from '@remotion/webcodecs';
const {tracks} = await parseMedia({src: 'https://remotion.media/BigBuckBunny.mp4', fields: {tracks: true}});
for (const track of tracks) if (track.type === 'audio') console.log(await canReencodeAudioTrack({track, audioCodec: 'opus', bitrate: 128000, sampleRate: null}));
```

#### canCopyVideoTrack()

Determine if a video track can be copied without re-encoding — [docs](https://www.remotion.dev/docs/webcodecs/can-copy-video-track)

```ts
// canCopyVideoTrack.ts
import {parseMedia} from '@remotion/media-parser';
import {canCopyVideoTrack} from '@remotion/webcodecs';
// Can the track be copied without re-encoding (fast, lossless)?
const {tracks, container} = await parseMedia({src: 'https://remotion.media/BigBuckBunny.mp4', fields: {tracks: true, container: true}});
for (const t of tracks) if (t.type === 'video') console.log(canCopyVideoTrack({outputContainer: 'mp4', inputTrack: t, inputContainer: container, rotationToApply: 0, resizeOperation: null, outputVideoCodec: null}));
```

#### canCopyAudioTrack()

Determine if a audio track can be copied without re-encoding — [docs](https://www.remotion.dev/docs/webcodecs/can-copy-audio-track)

```ts
// canCopyAudioTrack.ts
import {parseMedia} from '@remotion/media-parser';
import {canCopyAudioTrack} from '@remotion/webcodecs';
const {tracks, container} = await parseMedia({src: 'https://remotion.media/BigBuckBunny.mp4', fields: {tracks: true, container: true}});
for (const t of tracks) if (t.type === 'audio') console.log(canCopyAudioTrack({inputCodec: t.codecEnum, outputContainer: 'mp4', inputContainer: container, outputAudioCodec: null}));
```

#### getDefaultAudioCodec()

Gets the default audio codec for a container if no other audio codec is specified. — [docs](https://www.remotion.dev/docs/webcodecs/get-default-audio-codec)

```ts
// getDefaultAudioCodec.ts
import {getDefaultAudioCodec} from '@remotion/webcodecs';
console.log(getDefaultAudioCodec({container: 'mp4'}), getDefaultAudioCodec({container: 'webm'}));
```

#### getDefaultVideoCodec()

Gets the default video codec for a container if no other audio codec is specified. — [docs](https://www.remotion.dev/docs/webcodecs/get-default-video-codec)

```ts
// getDefaultVideoCodec.ts
import {getDefaultVideoCodec} from '@remotion/webcodecs';
console.log(getDefaultVideoCodec({container: 'mp4'}), getDefaultVideoCodec({container: 'webm'}));
```

#### defaultOnAudioTrackHandler()

The default track transformation function for audio tracks. — [docs](https://www.remotion.dev/docs/webcodecs/default-on-audio-track-handler)

```ts
// defaultOnAudioTrackHandler.ts
import {convertMedia, defaultOnAudioTrackHandler} from '@remotion/webcodecs';
// Custom logic for some tracks, fall back to Remotion's default decision for the rest.
await convertMedia({src: 'https://remotion.media/BigBuckBunny.mp4', container: 'webm',
  onAudioTrack: (params) => (params.track.numberOfChannels > 2 ? {type: 'drop'} : defaultOnAudioTrackHandler(params))});
```

#### defaultOnVideoTrackHandler()

The default track transformation function for video tracks. — [docs](https://www.remotion.dev/docs/webcodecs/default-on-video-track-handler)

```ts
// defaultOnVideoTrackHandler.ts
import {convertMedia, defaultOnVideoTrackHandler} from '@remotion/webcodecs';
await convertMedia({src: 'https://remotion.media/BigBuckBunny.mp4', container: 'webm',
  onVideoTrack: (params) => { console.log(params.track.codec); return defaultOnVideoTrackHandler(params); }});
```

#### getAvailableAudioCodecs()

Get the audio codecs that can fit in a container. — [docs](https://www.remotion.dev/docs/webcodecs/get-available-audio-codecs)

```ts
// getAvailableAudioCodecs.ts
import {getAvailableAudioCodecs} from '@remotion/webcodecs';
console.log(getAvailableAudioCodecs({container: 'mp4'}));
```

#### getAvailableVideoCodecs()

Get the video codecs that can fit in a container. — [docs](https://www.remotion.dev/docs/webcodecs/get-available-video-codecs)

```ts
// getAvailableVideoCodecs.ts
import {getAvailableVideoCodecs} from '@remotion/webcodecs';
console.log(getAvailableVideoCodecs({container: 'webm'}));
```

#### convertAudioData()

Change the format or sample rate of an `AudioData` object. — [docs](https://www.remotion.dev/docs/webcodecs/convert-audiodata)

```ts
// convertAudioData.ts
import {convertAudioData} from '@remotion/webcodecs';
// Resample / change format of a WebCodecs AudioData.
const audioData = new AudioData({data: new Float32Array(4800), format: 'f32', numberOfChannels: 1, numberOfFrames: 4800, sampleRate: 48000, timestamp: 0});
const resampled = convertAudioData({audioData, newSampleRate: 16000});
console.log(resampled.sampleRate, resampled.numberOfFrames);
```

#### createAudioDecoder()

Create an `AudioDecoder` object. — [docs](https://www.remotion.dev/docs/webcodecs/create-audio-decoder)

```ts
// createAudioDecoder.ts
import {parseMedia} from '@remotion/media-parser';
import {createAudioDecoder} from '@remotion/webcodecs';
// Wrapped AudioDecoder with queueing/back-pressure handled for you.
await parseMedia({src: 'https://remotion.media/video.mp4', onAudioTrack: async ({track}) => {
  const decoder = await createAudioDecoder({track, onFrame: (d) => d.close(), onError: console.error});
  return async (sample) => { await decoder.decode(sample); };
}});
```

#### createVideoDecoder()

Create a `VideoDecoder` object. — [docs](https://www.remotion.dev/docs/webcodecs/create-video-decoder)

```ts
// createVideoDecoder.ts
import {parseMedia} from '@remotion/media-parser';
import {createVideoDecoder} from '@remotion/webcodecs';
await parseMedia({src: 'https://remotion.media/video.mp4', onVideoTrack: async ({track}) => {
  const decoder = await createVideoDecoder({track, onFrame: (f) => f.close(), onError: console.error});
  return async (sample) => { await decoder.decode(sample); };
}});
```

#### extractFrames()

Extract frames from a video at specific timestamps. — [docs](https://www.remotion.dev/docs/webcodecs/extract-frames)

```ts
// extractFrames.ts
import {extractFrames} from '@remotion/webcodecs';
// Grab frames at given timestamps (thumbnail strip). Close each VideoFrame when done.
const canvas = new OffscreenCanvas(320, 180); const ctx = canvas.getContext('2d')!;
await extractFrames({src: 'https://remotion.media/video.mp4', timestampsInSeconds: [0, 1, 2, 3], onFrame: (frame) => { ctx.drawImage(frame, 0, 0, 320, 180); frame.close(); }});
```

#### getPartialAudioData()

Extract audio data from a specific time window of a media file. — [docs](https://www.remotion.dev/docs/webcodecs/get-partial-audio-data)

```ts
// getPartialAudioData.ts
import {getPartialAudioData} from '@remotion/webcodecs';
// Float32 samples for a time range of one channel.
const samples = await getPartialAudioData({src: 'https://remotion.media/audio.wav', fromSeconds: 10, toSeconds: 20, channelIndex: 0, signal: new AbortController().signal});
console.log(samples.length);
```

#### rotateAndResizeVideoFrame()

Rotate and resize a video frame. — [docs](https://www.remotion.dev/docs/webcodecs/rotate-and-resize-video-frame)

```ts
// rotateAndResizeVideoFrame.ts
import {rotateAndResizeVideoFrame} from '@remotion/webcodecs';
// Rotate and/or resize a VideoFrame (e.g. inside a custom onFrame pipeline).
export const toPortrait = (frame: VideoFrame) => rotateAndResizeVideoFrame({frame, rotation: 90, resizeOperation: {mode: 'width', width: 1080}});
```

#### webFsWriter

Writer that saves to browser file system using File System Access API. — [docs](https://www.remotion.dev/docs/webcodecs/web-fs-writer)

```ts
// webFsWriter.ts
import {convertMedia} from '@remotion/webcodecs';
import {webFsWriter} from '@remotion/webcodecs/web-fs';
// Writes output to the Origin Private File System — handles files larger than RAM.
const r = await convertMedia({src: 'https://remotion.media/BigBuckBunny.mp4', container: 'webm', writer: webFsWriter});
export const blob = await r.save();
```

#### bufferWriter

Writer that saves to an in-memory resizable ArrayBuffer. — [docs](https://www.remotion.dev/docs/webcodecs/buffer-writer)

```ts
// bufferWriter.ts
import {convertMedia} from '@remotion/webcodecs';
import {bufferWriter} from '@remotion/webcodecs/buffer';
// Keeps output in memory — fine for short clips, and works where OPFS isn't available.
const r = await convertMedia({src: 'https://remotion.media/BigBuckBunny.mp4', container: 'webm', writer: bufferWriter});
export const blob = await r.save();
```

## @remotion/whisper-webgpu


#### canUseWhisperWebGpu()

Check whether transcription is possible — [docs](https://www.remotion.dev/docs/whisper-webgpu/can-use-whisper-webgpu)

```ts
// canUseWhisperWebGpu.ts
import {canUseWhisperWebGpu} from '@remotion/whisper-webgpu';
const r = await canUseWhisperWebGpu();
console.log(r.supported ? 'WebGPU ok' : r.reason);
```

#### getAvailableModels()

List models and their download sizes — [docs](https://www.remotion.dev/docs/whisper-webgpu/get-available-models)

```ts
// getAvailableModels.ts
import {getAvailableModels} from '@remotion/whisper-webgpu';
// tiny / base / small / medium (+ .en), large-v3-turbo — bigger = more accurate, slower. Use multilingual (no .en) for Vietnamese.
for (const m of getAvailableModels()) console.log(m.name);
```

#### clearStaleModels()

Remove models discontinued by newer versions — [docs](https://www.remotion.dev/docs/whisper-webgpu/clear-stale-models)

```ts
// clearStaleModels.ts
import {clearStaleModels} from '@remotion/whisper-webgpu';
// Remove cached files from older model versions.
await clearStaleModels();
```

#### isWhisperModelCached()

Check whether a model is downloaded — [docs](https://www.remotion.dev/docs/whisper-webgpu/is-whisper-model-cached)

```ts
// isWhisperModelCached.ts
import {isWhisperModelCached} from '@remotion/whisper-webgpu';
console.log(await isWhisperModelCached({model: 'small'}));
```

#### downloadWhisperModel()

Download a model — [docs](https://www.remotion.dev/docs/whisper-webgpu/download-whisper-model)

```ts
// downloadWhisperModel.ts
import {downloadWhisperModel} from '@remotion/whisper-webgpu';
await downloadWhisperModel({model: 'small', onProgress: (p) => console.log(p)});
```

#### loadWhisperModel()

Initialize a downloaded model — [docs](https://www.remotion.dev/docs/whisper-webgpu/load-whisper-model)

```ts
// loadWhisperModel.ts
import {loadWhisperModel} from '@remotion/whisper-webgpu';
// Warm the model into GPU memory before the user clicks "Transcribe".
await loadWhisperModel({model: 'small'});
```

#### disposeWhisperModel()

Release model memory — [docs](https://www.remotion.dev/docs/whisper-webgpu/dispose-whisper-model)

```ts
// disposeWhisperModel.ts
import {disposeWhisperModel} from '@remotion/whisper-webgpu';
await disposeWhisperModel({model: 'small'});
```

#### removeWhisperModel()

Remove a model from the persistent cache — [docs](https://www.remotion.dev/docs/whisper-webgpu/remove-whisper-model)

```ts
// removeWhisperModel.ts
import {removeWhisperModel} from '@remotion/whisper-webgpu';
await removeWhisperModel({model: 'medium'});
```

#### transcribe()

Transcribe a waveform with word-level timestamps — [docs](https://www.remotion.dev/docs/whisper-webgpu/transcribe)

```ts
// transcribe.ts
import {resampleTo16Khz, transcribe} from '@remotion/whisper-webgpu';
// In-browser speech-to-text with word timestamps. Input: 16 kHz Float32 waveform.
export const run = async (file: File) => {
  const channelWaveform = await resampleTo16Khz({file});
  return transcribe({channelWaveform, model: 'small'});
};
```

#### toCaptions()

Convert a transcription to `@remotion/captions` — [docs](https://www.remotion.dev/docs/whisper-webgpu/to-captions)

```ts
// toCaptions.ts
import {toCaptions, transcribe} from '@remotion/whisper-webgpu';
// Whisper output → Caption[] for @remotion/captions.
export const captionsFrom = async (channelWaveform: Float32Array) => toCaptions({whisperWebGpuOutput: await transcribe({channelWaveform, model: 'small'})}).captions;
```

#### resampleTo16Khz()

Decode and resample browser audio — [docs](https://www.remotion.dev/docs/whisper-webgpu/resample-to-16khz)

```ts
// resampleTo16Khz.ts
import {resampleTo16Khz} from '@remotion/whisper-webgpu';
// Decode any audio/video File and resample to the 16 kHz mono Float32Array Whisper needs.
export const prep = (file: File) => resampleTo16Khz({file});
```

