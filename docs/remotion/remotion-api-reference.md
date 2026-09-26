# Remotion API reference + working examples

Remotion **v4.0.529** (npm `latest`, checked 26 Sep 2026). Package list and descriptions are taken from the source of https://www.remotion.dev/docs/api; export lists are read from each package's published TypeScript declarations; every code example below type-checks (`tsc --strict`) against the real 4.0.529 packages.

> Version rule: `remotion` and every `@remotion/*` package must be the **same exact version**, no `^`. Upgrade them together with `npx remotion upgrade`. Add a package with `npx remotion add @remotion/<name>`.

> Animation rule: drive everything from `useCurrentFrame()` / `interpolate()` / `spring()`. CSS transitions, CSS keyframes, Tailwind `animate-*` and `setTimeout` do not render correctly.

> Any doc link: append `.md` to get the Markdown source, e.g. `https://www.remotion.dev/docs/sequence.md`.

## Contents

- [CLI and config file](#cli-and-config-file)
- [remotion](#remotion)
- [@remotion/animated-emoji](#remotionanimated-emoji)
- [@remotion/animation-utils](#remotionanimation-utils)
- [@remotion/bundler](#remotionbundler)
- [@remotion/captions](#remotioncaptions)
- [@remotion/cloudrun](#remotioncloudrun)
- [@remotion/elevenlabs](#remotionelevenlabs)
- [@remotion/enable-scss](#remotionenable-scss)
- [@remotion/fonts](#remotionfonts)
- [@remotion/gif](#remotiongif)
- [@remotion/google-fonts](#remotiongoogle-fonts)
- [@remotion/gsap](#remotiongsap)
- [@remotion/install-whisper-cpp](#remotioninstall-whisper-cpp)
- [@remotion/lambda](#remotionlambda)
- [@remotion/layout-utils](#remotionlayout-utils)
- [@remotion/licensing](#remotionlicensing)
- [@remotion/light-leaks](#remotionlight-leaks)
- [@remotion/rough-notation](#remotionrough-notation)
- [@remotion/lottie](#remotionlottie)
- [@remotion/mac-cursors](#remotionmac-cursors)
- [@remotion/media](#remotionmedia)
- [@remotion/media-parser](#remotionmedia-parser)
- [@remotion/media-utils](#remotionmedia-utils)
- [@remotion/motion-blur](#remotionmotion-blur)
- [@remotion/noise](#remotionnoise)
- [@remotion/openai-whisper](#remotionopenai-whisper)
- [@remotion/paths](#remotionpaths)
- [@remotion/player](#remotionplayer)
- [@remotion/preload](#remotionpreload)
- [@remotion/renderer](#remotionrenderer)
- [@remotion/rive](#remotionrive)
- [@remotion/sfx](#remotionsfx)
- [@remotion/shapes](#remotionshapes)
- [@remotion/skia](#remotionskia)
- [@remotion/starburst](#remotionstarburst)
- [@remotion/studio](#remotionstudio)
- [@remotion/studio-protocol](#remotionstudio-protocol)
- [@remotion/tailwind](#remotiontailwind)
- [@remotion/tailwind-v4](#remotiontailwind-v4)
- [@remotion/three](#remotionthree)
- [@remotion/transitions](#remotiontransitions)
- [@remotion/vercel](#remotionvercel)
- [@remotion/video-matting](#remotionvideo-matting)
- [@remotion/webcodecs](#remotionwebcodecs)
- [@remotion/whisper-webgpu](#remotionwhisper-webgpu)
- [@remotion/zod-types](#remotionzod-types)

## CLI and config file

| Reference | Doc |
|---|---|
| `npx remotion` commands (studio, render, still, bundle, upgrade, add, lambda, cloudrun…) | https://www.remotion.dev/docs/cli |
| `remotion.config.ts` options (`Config.*`, imported from `@remotion/cli/config`) | https://www.remotion.dev/docs/config |


## remotion

Core APIs: `useCurrentFrame()`, `interpolate()`, etc.

Installed with every project.


| API | What it does | Doc |
|---|---|---|
| `<AbsoluteFill>` | Position content absolutely and in full size | [link](https://www.remotion.dev/docs/absolute-fill) |
| `cancelRender()` | Abort an error | [link](https://www.remotion.dev/docs/cancel-render) |
| `<Composition>` | Define a video | [link](https://www.remotion.dev/docs/composition) |
| `continueRender()` | Unblock a render | [link](https://www.remotion.dev/docs/continue-render) |
| `delayRender()` | Block a render from continuing | [link](https://www.remotion.dev/docs/delay-render) |
| `Easing` | Customize animation curve of `interpolate()` | [link](https://www.remotion.dev/docs/easing) |
| `<Folder>` | Organize compositions in the Studio sidebar | [link](https://www.remotion.dev/docs/folder) |
| `<Freeze>` | Freeze some content in time | [link](https://www.remotion.dev/docs/freeze) |
| `getInputProps()` | Receive the user-defined input data | [link](https://www.remotion.dev/docs/get-input-props) |
| `getRemotionEnvironment()` | Determine if you are currently previewing or rendering | [link](https://www.remotion.dev/docs/get-remotion-environment) |
| `<Html5Audio>` | Synchronize `<audio>` with Remotion's time | [link](https://www.remotion.dev/docs/html5-audio) |
| `<Html5Video>` | Synchronize a `<video>` with Remotion's time | [link](https://www.remotion.dev/docs/html5-video) |
| `<HtmlInCanvas>` | Draw DOM content into a canvas via HTML-in-canvas | [link](https://www.remotion.dev/docs/remotion/html-in-canvas) |
| `<IFrame>` | Render an `<iframe>` tag and wait for it to load | [link](https://www.remotion.dev/docs/iframe) |
| `<Img>` | Render an `<img>` tag and wait for it to load | [link](https://www.remotion.dev/docs/img) |
| `<CanvasImage>` | Render an image into a canvas and apply effects | [link](https://www.remotion.dev/docs/canvasimage) |
| `createEffect()` | Create custom effects for canvas components | [link](https://www.remotion.dev/docs/create-effect) |
| `interpolateColors()` | Map a range of values to colors | [link](https://www.remotion.dev/docs/interpolate-colors) |
| `interpolate()` | Map a range of values to another | [link](https://www.remotion.dev/docs/interpolate) |
| `<Loop>` | Play some content repeatedly | [link](https://www.remotion.dev/docs/loop) |
| `measureSpring()` | Determine the duration of a spring | [link](https://www.remotion.dev/docs/measure-spring) |
| `<OffthreadVideo>` | Alternative to `<Html5Video>` | [link](https://www.remotion.dev/docs/offthreadvideo) |
| `<AnimatedImage>` | Disply a GIF, AVIF or animated WebP image | [link](https://www.remotion.dev/docs/animatedimage) |
| `registerRoot()` | Initialize a Remotion project | [link](https://www.remotion.dev/docs/register-root) |
| `<Sequence>` | Time-shifts it's children | [link](https://www.remotion.dev/docs/sequence) |
| `InteractivitySchema` | Define timeline controls for components and effects | [link](https://www.remotion.dev/docs/interactivity-schema) |
| `<Series>` | Display contents after another | [link](https://www.remotion.dev/docs/series) |
| `spring()` | Physics-based animation primitive | [link](https://www.remotion.dev/docs/spring) |
| `staticFile()` | Access file from `public/` folder | [link](https://www.remotion.dev/docs/staticfile) |
| `<Still>` | Define a still | [link](https://www.remotion.dev/docs/still) |
| `useCurrentFrame()` | Obtain the current time | [link](https://www.remotion.dev/docs/use-current-frame) |
| `useVideoConfig()` | Get the duration, dimensions and FPS of a composition | [link](https://www.remotion.dev/docs/use-video-config) |
| `VERSION` | Get the current version of Remotion | [link](https://www.remotion.dev/docs/version) |
| `Interactive.withSchema()` | Expose component props as Studio timeline controls | [link](https://www.remotion.dev/docs/interactive-with-schema) |

Also exported but not in the docs table: `Artifact`, `Audio`, `Config`, `Experimental`, `FolderContext`, `HTML_IN_CANVAS_UNSUPPORTED_MESSAGE`, `MediaPlaybackError`, `OverrideIdsToNodePathsGettersContext`, `OverrideIdsToNodePathsSettersContext`, `Solid`, `Video`, `absoluteFillSchema`, `assertValidInterpolateEasingOption`, `assertValidInterpolatePosterizeOption`, `getStaticFiles`, `isHtmlInCanvasSupported`, `prefetch`, `random`, `useBufferState`, `useCurrentScale`, `useDelayRender`, `usePixelDensity`, `useRemotionEnvironment`, `watchStaticFile`.

Subpath imports: `remotion/version` → `VERSION`; `remotion/no-react` → `assertValidInterpolateEasingOption`, `assertValidInterpolatePosterizeOption`, `interpolate`, `random`

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {
  AbsoluteFill, Easing, Img, Sequence, Series, interpolate, interpolateColors,
  random, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';

export const MyComp: React.FC<{title: string}> = ({title}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 200}});
  const bg = interpolateColors(frame, [0, durationInFrames], ['#0B1F3A', '#1C4E80']);
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <AbsoluteFill style={{backgroundColor: bg, justifyContent: 'center', alignItems: 'center'}}>
      <h1 style={{color: 'white', fontSize: 90, opacity, scale: String(pop)}}>{title}</h1>
      <Sequence from={30} durationInFrames={60} layout="none">
        <Img src={staticFile('logo.png')} style={{width: 200, rotate: `${random('spin') * 10}deg`}} />
      </Sequence>
      <Series>
        <Series.Sequence durationInFrames={45}><div /></Series.Sequence>
        <Series.Sequence durationInFrames={45}><div /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
```

**Example — `Root.tsx`**

```tsx
import React from 'react';
import {Composition} from 'remotion';
import {MyComp} from './MyComp';

export const RemotionRoot: React.FC = () => (
  <Composition id="MyComp" component={MyComp} durationInFrames={150} fps={30}
    width={1920} height={1080} defaultProps={{title: 'Hello FinHub'}} />
);
```

## @remotion/animated-emoji

Google Fonts Animated Emojis as Remotion Components

Install: `npx remotion add @remotion/animated-emoji`


| API | What it does | Doc |
|---|---|---|
| `<AnimatedEmoji>` | Component for rendering an animated emoji. | [link](https://www.remotion.dev/docs/animated-emoji/animated-emoji) |
| `getAvailableEmoji()` | Get a list of available emoji. | [link](https://www.remotion.dev/docs/animated-emoji/get-available-emoji) |

⚠ Documented on the docs site but **not exported by v4.0.529** (newer release or renamed): getAvailableEmoji() — v4.0.529 exports it as `getAvailableEmojis()`.

Also exported but not in the docs table: `getAvailableEmojis`.

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {AnimatedEmoji, getAvailableEmojis} from '@remotion/animated-emoji';
import {AbsoluteFill} from 'remotion';

export const available = getAvailableEmojis().length;
export const MyComp: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <AnimatedEmoji emoji="blush" style={{width: 300, height: 300}} />
  </AbsoluteFill>
);
```

## @remotion/animation-utils

Obtain info about video and audio.

Install: `npx remotion add @remotion/animation-utils`


| API | What it does | Doc |
|---|---|---|
| `makeTransform()` | Create a value for the CSS `transform` property | [link](https://www.remotion.dev/docs/animation-utils/make-transform) |
| `interpolateStyles()` | Map a range of values to CSS `style` values | [link](https://www.remotion.dev/docs/animation-utils/interpolate-styles) |

Also exported but not in the docs table: `matrix`, `matrix3d`, `perspective`, `rotate`, `rotate3d`, `rotateX`, `rotateY`, `rotateZ`, `scale`, `scale3d`, `scaleX`, `scaleY`, `scaleZ`, `skew`, `skewX`, `skewY`, `translate`, `translate3d`, `translateX`, `translateY`, `translateZ`.

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {interpolateStyles, makeTransform, rotate, translateY} from '@remotion/animation-utils';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const MyComp: React.FC = () => {
  const frame = useCurrentFrame();
  const style = interpolateStyles(frame, [0, 30], [
    {opacity: 0, transform: makeTransform([translateY(80), rotate(-10)])},
    {opacity: 1, transform: makeTransform([translateY(0), rotate(0)])},
  ]);
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><h1 style={style}>Styles</h1></AbsoluteFill>;
};
```

## @remotion/bundler

Create a Webpack bundle from Node.JS

Install: `npx remotion add @remotion/bundler`
  ·  Runs in: **Node/Bun script**


| API | What it does | Doc |
|---|---|---|
| `bundle()` | Create a Webpack bundle | [link](https://www.remotion.dev/docs/bundle) |

Also exported but not in the docs table: `WatchIgnoreNextChangePlugin`, `webpack`.

**Example — `render.ts`**

```ts
import path from 'path';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
const serveUrl = await bundle({entryPoint: path.resolve('./src/index.ts')});
const inputProps = {title: 'Rendered from Node'};
const composition = await selectComposition({serveUrl, id: 'MyComp', inputProps});
await renderMedia({composition, serveUrl, codec: 'h264', outputLocation: 'out/MyComp.mp4', inputProps,
  onProgress: ({progress}) => console.log(`${Math.round(progress * 100)}%`)});
await renderStill({composition, serveUrl, output: 'out/thumb.png', frame: 30, inputProps});
```

## @remotion/captions

Common operations for subtitles.

Install: `npx remotion add @remotion/captions`


| API | What it does | Doc |
|---|---|---|
| `Caption` | An object shape for captions | [link](https://www.remotion.dev/docs/captions/caption) |
| `parseSrt()` | Parse a .srt file into a `Caption` array | [link](https://www.remotion.dev/docs/captions/parse-srt) |
| `serializeSrt()` | Serialize a .srt file into a `Caption` array | [link](https://www.remotion.dev/docs/captions/serialize-srt) |
| `createTikTokStyleCaptions()` | Structure the captions for TikTok-style display | [link](https://www.remotion.dev/docs/captions/create-tiktok-style-captions) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {createTikTokStyleCaptions, type Caption} from '@remotion/captions';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';

const captions: Caption[] = [
  {text: 'Fixed', startMs: 0, endMs: 400, timestampMs: 200, confidence: 1},
  {text: ' rate', startMs: 400, endMs: 800, timestampMs: 600, confidence: 1},
  {text: ' ending?', startMs: 800, endMs: 1400, timestampMs: 1100, confidence: 1},
];

const Page: React.FC<{tokens: {text: string; fromMs: number; toMs: number}[]; startMs: number}> = ({tokens, startMs}) => {
  const {fps} = useVideoConfig();
  const t = startMs + (useCurrentFrame() / fps) * 1000;
  return (
    <h1 style={{fontSize: 80, whiteSpace: 'pre'}}>
      {tokens.map((tk) => (
        <span key={tk.fromMs} style={{color: tk.fromMs <= t && tk.toMs > t ? '#F5B400' : 'white'}}>{tk.text}</span>
      ))}
    </h1>
  );
};

export const MyComp: React.FC = () => {
  const {fps} = useVideoConfig();
  const {pages} = createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 1200});
  return (
    <AbsoluteFill style={{backgroundColor: '#111', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 160}}>
      {pages.map((p) => (
        <Sequence key={p.startMs} from={Math.round((p.startMs / 1000) * fps)}
          durationInFrames={Math.max(1, Math.round((p.durationMs / 1000) * fps))} layout="none">
          <Page tokens={p.tokens} startMs={p.startMs} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

**Example — `srt.ts`**

```ts
import {parseSrt, serializeSrt} from '@remotion/captions';
const {captions} = parseSrt({input: '1\n00:00:00,000 --> 00:00:01,000\nHello\n'});
export const roundTrip = serializeSrt({lines: [captions]});
```

## @remotion/cloudrun

Render videos and stills on GCP Cloud Run

Install: `npx remotion add @remotion/cloudrun`
  ·  Runs in: **Node/Bun script**


| API | What it does | Doc |
|---|---|---|
| `getServiceInfo()` | Gets information about a service | [link](https://www.remotion.dev/docs/cloudrun/getserviceinfo) |
| `deployService()` | Create a new service in GCP Cloud Run | [link](https://www.remotion.dev/docs/cloudrun/deployservice) |
| `deleteService()` | Delete a service in GCP Cloud Run | [link](https://www.remotion.dev/docs/cloudrun/deleteservice) |
| `getServices()` | Lists available Remotion Cloud Run services | [link](https://www.remotion.dev/docs/cloudrun/getservices) |
| `speculateServiceName()` | Speculate a service name based on its configuration | [link](https://www.remotion.dev/docs/cloudrun/speculateservicename) |
| `getRegions()` | Get all available regions | [link](https://www.remotion.dev/docs/cloudrun/getregions) |
| `deploySite()` | Bundle and upload a site to Cloud Storage | [link](https://www.remotion.dev/docs/cloudrun/deploysite) |
| `deleteSite()` | Delete a bundle from Cloud Storage | [link](https://www.remotion.dev/docs/cloudrun/deletesite) |
| `getSites()` | Get all available sites from Cloud Storage | [link](https://www.remotion.dev/docs/cloudrun/getsites) |
| `getOrCreateBucket()` | Ensure a Remotion Cloud Storage bucket exists | [link](https://www.remotion.dev/docs/cloudrun/getorcreatebucket) |
| `renderMediaOnCloudrun()` | Trigger a video or audio render | [link](https://www.remotion.dev/docs/cloudrun/rendermediaoncloudrun) |
| `renderStillOnCloudrun()` | Trigger a still render | [link](https://www.remotion.dev/docs/cloudrun/renderstilloncloudrun) |
| `testPermissions()` | Ensure permissions are correctly set up in GCP | [link](https://www.remotion.dev/docs/cloudrun/testpermissions) |

Subpath imports: `@remotion/cloudrun/client` → `deleteService`, `deleteSite`, `getOrCreateBucket`, `getRegions`, `getServiceInfo`, `getServices`, `getSites`, `renderMediaOnCloudrun`, `renderStillOnCloudrun`, `speculateServiceName`

**Example — `render.ts`**

```ts
import {renderMediaOnCloudrun} from '@remotion/cloudrun/client';
// Service + site are deployed first with `npx remotion cloudrun services deploy` / `sites create`
const result = await renderMediaOnCloudrun({
  region: 'australia-southeast1', serviceName: 'remotion-xxxx', serveUrl: 'https://storage.googleapis.com/.../index.html',
  composition: 'MyComp', codec: 'h264', inputProps: {title: 'From Cloud Run'},
});
if (result.type === 'success') console.log(result.publicUrl);
```

## @remotion/elevenlabs

Work with transcriptions from ElevenLabs

Install: `npx remotion add @remotion/elevenlabs`
  ·  Runs in: **Node/Bun script**


| API | What it does | Doc |
|---|---|---|
| `elevenLabsTranscriptToCaptions()` | Turn ElevenLabs Speech to Text output into an array of `Caption` | [link](https://www.remotion.dev/docs/elevenlabs/elevenlabs-transcript-to-captions) |

**Example — `transcribe.ts`**

```ts
import fs from 'fs';
import {elevenLabsTranscriptToCaptions} from '@remotion/elevenlabs';
const form = new FormData();
form.append('file', new Blob([fs.readFileSync('audio.mp3')]));
form.append('model_id', 'scribe_v2');
form.append('timestamps_granularity', 'word');
const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
  method: 'POST', headers: {'xi-api-key': process.env.ELEVENLABS_API_KEY!}, body: form,
});
const {captions} = elevenLabsTranscriptToCaptions({transcript: await res.json()});
fs.writeFileSync('public/captions.json', JSON.stringify(captions));
```

## @remotion/enable-scss

Bundler override for enabling SASS/SCSS

Install: `npx remotion add @remotion/enable-scss`
  ·  Runs in: **remotion.config.ts**


| API | What it does | Doc |
|---|---|---|
| `enableScss()` | Override the bundler config to enable SCSS | [link](https://www.remotion.dev/docs/enable-scss/enable-scss) |

**Example — `remotion.config.ts`**

```ts
import {Config} from '@remotion/cli/config';
import {enableScss} from '@remotion/enable-scss';
Config.overrideWebpackConfig((c) => enableScss(c));
```

## @remotion/fonts

Load font files onto a page.

Install: `npx remotion add @remotion/fonts`


| API | What it does | Doc |
|---|---|---|
| `loadFont()` | Load a font from a URL or a local file | [link](https://www.remotion.dev/docs/fonts-api/load-font) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, staticFile} from 'remotion';
loadFont({family: 'Brand', url: staticFile('fonts/Brand-Bold.woff2'), weight: '700'});
export const MyComp: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <h1 style={{fontFamily: 'Brand', fontWeight: 700}}>Local font</h1>
  </AbsoluteFill>
);
```

## @remotion/gif

Include a GIF in your video.

Install: `npx remotion add @remotion/gif`


| API | What it does | Doc |
|---|---|---|
| `<Gif>` | Render a GIF | [link](https://www.remotion.dev/docs/gif/gif) |
| `getGifDurationInSeconds()` | Get the runtime of a GIF | [link](https://www.remotion.dev/docs/gif/get-gif-duration-in-seconds) |
| `preloadGif()` | Prepare a GIF for displaying in the Player | [link](https://www.remotion.dev/docs/gif/preload-gif) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {Gif} from '@remotion/gif';
import {AbsoluteFill, staticFile} from 'remotion';
export const MyComp: React.FC = () => (
  <AbsoluteFill><Gif src={staticFile('reaction.gif')} width={600} height={400} fit="contain" playbackRate={1} /></AbsoluteFill>
);
```

## @remotion/google-fonts

Load Google Fonts onto a page.

Install: `npx remotion add @remotion/google-fonts`


| API | What it does | Doc |
|---|---|---|
| `loadFont()` | Load a Google Font | [link](https://www.remotion.dev/docs/google-fonts/load-font) |
| `loadVariableFont()` | Load a variable Google Font | [link](https://www.remotion.dev/docs/google-fonts/load-variable-font) |
| `getAvailableFonts()` | Static list of available fonts | [link](https://www.remotion.dev/docs/google-fonts/get-available-fonts) |
| `getInfo()` | Metadata about a specific font | [link](https://www.remotion.dev/docs/google-fonts/get-info) |
| `loadFontFromInfo()` | Load a Google Font based on metadata | [link](https://www.remotion.dev/docs/google-fonts/load-font-from-info) |
| `loadVariableFontFromInfo()` | Load a variable Google Font based on metadata | [link](https://www.remotion.dev/docs/google-fonts/load-variable-font-from-info) |

Each Google Font is its own subpath: `import {loadFont} from '@remotion/google-fonts/<FontName>'` (e.g. `BeVietnamPro`, `Inter`, `Montserrat`). Also `@remotion/google-fonts/from-info`.

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {loadFont} from '@remotion/google-fonts/BeVietnamPro';
import {AbsoluteFill} from 'remotion';
const {fontFamily} = loadFont('normal', {weights: ['400', '700'], subsets: ['latin', 'vietnamese']});
export const MyComp: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily}}>
    <h1>Lãi suất cố định sắp hết hạn?</h1>
  </AbsoluteFill>
);
```

## @remotion/gsap

Use GSAP timelines in Remotion.

Install: `npx remotion add @remotion/gsap`


| API | What it does | Doc |
|---|---|---|
| `useGsapTimeline()` | Build a GSAP timeline that is driven by the Remotion frame | [link](https://www.remotion.dev/docs/gsap/use-gsap-timeline) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {useGsapTimeline} from '@remotion/gsap';
import {AbsoluteFill} from 'remotion';
export const MyComp: React.FC = () => {
  const scope = useGsapTimeline<HTMLDivElement>(({timeline, selector}) => {
    timeline.from(selector('[data-title]'), {y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'});
  });
  return <AbsoluteFill ref={scope} style={{background: '#000', color: '#fff'}}><h1 data-title>Hello GSAP</h1></AbsoluteFill>;
};
```

## @remotion/install-whisper-cpp

Whisper.cpp installation and transcription

Install: `npx remotion add @remotion/install-whisper-cpp`
  ·  Runs in: **Node/Bun script**


| API | What it does | Doc |
|---|---|---|
| `installWhisperCpp()` | Install the whisper.cpp software | [link](https://www.remotion.dev/docs/install-whisper-cpp/install-whisper-cpp) |
| `downloadWhisperModel()` | Download a Whisper model | [link](https://www.remotion.dev/docs/install-whisper-cpp/download-whisper-model) |
| `transcribe()` | Transcribe an audio file | [link](https://www.remotion.dev/docs/install-whisper-cpp/transcribe) |
| `toCaptions()` | Converts the output from `transcribe()` into an array of `Caption` objects | [link](https://www.remotion.dev/docs/install-whisper-cpp/to-captions) |

Also exported but not in the docs table: `convertToCaptions`.

**Example — `transcribe.ts`**

```ts
import fs from 'fs';
import path from 'path';
import {downloadWhisperModel, installWhisperCpp, toCaptions, transcribe} from '@remotion/install-whisper-cpp';
const whisperPath = path.join(process.cwd(), 'whisper.cpp');
await installWhisperCpp({to: whisperPath, version: '1.5.5'});
await downloadWhisperModel({model: 'medium.en', folder: whisperPath});
// Input must be a 16 kHz WAV: ffmpeg -i input.mp4 -ar 16000 audio.wav -y
const whisperCppOutput = await transcribe({
  inputPath: path.join(process.cwd(), 'audio.wav'), whisperPath, whisperCppVersion: '1.5.5',
  model: 'medium.en', tokenLevelTimestamps: true,
});
const {captions} = toCaptions({whisperCppOutput});
fs.writeFileSync('public/captions.json', JSON.stringify(captions));
```

## @remotion/lambda

Render videos and stills on AWS Lambda

Install: `npx remotion add @remotion/lambda`
  ·  Runs in: **Node/Bun script**


| API | What it does | Doc |
|---|---|---|
| `estimatePrice()` | Estimate the price of a render | [link](https://www.remotion.dev/docs/lambda/estimateprice) |
| `deployFunction()` | Create a new function in AWS Lambda | [link](https://www.remotion.dev/docs/lambda/deployfunction) |
| `deleteFunction()` | Delete a function in AWS Lambda | [link](https://www.remotion.dev/docs/lambda/deletefunction) |
| `getFunctionInfo()` | Gets information about a function | [link](https://www.remotion.dev/docs/lambda/getfunctioninfo) |
| `getFunctions()` | Lists available Remotion Lambda functions | [link](https://www.remotion.dev/docs/lambda/getfunctions) |
| `getCompositionsOnLambda()` | Gets list of compositions inside a Lambda function | [link](https://www.remotion.dev/docs/lambda/getcompositionsonlambda) |
| `deleteSite()` | Delete a bundle from S3 | [link](https://www.remotion.dev/docs/lambda/deletesite) |
| `deploySiteFromBundle()` | Upload an existing bundle to S3 | [link](https://www.remotion.dev/docs/lambda/deploysitefrombundle) |
| `deploySite()` | Deprecated: Bundle and upload a site to S3 | [link](https://www.remotion.dev/docs/lambda/deploysite) |
| `getAwsClient()` | Access the AWS SDK directly | [link](https://www.remotion.dev/docs/lambda/getawsclient) |
| `getRegions()` | Get all available regions | [link](https://www.remotion.dev/docs/lambda/getregions) |
| `getSites()` | Get all available sites | [link](https://www.remotion.dev/docs/lambda/getsites) |
| `downloadMedia()` | Download a render artifact from S3 | [link](https://www.remotion.dev/docs/lambda/downloadmedia) |
| `cancelRenderOnLambda()` | Cancel an in-progress render | [link](https://www.remotion.dev/docs/lambda/cancelrenderonlambda) |
| `getUserPolicy()` | Get the policy JSON for your AWS user | [link](https://www.remotion.dev/docs/lambda/getuserpolicy) |
| `getRolePolicy()` | Get the policy JSON for your AWS role | [link](https://www.remotion.dev/docs/lambda/getrolepolicy) |
| `getOrCreateBucket()` | Ensure a Remotion S3 bucket exists | [link](https://www.remotion.dev/docs/lambda/getorcreatebucket) |
| `getRenderProgress()` | Query the progress of a render | [link](https://www.remotion.dev/docs/lambda/getrenderprogress) |
| `presignUrl()` | Make a private file public to those with the link | [link](https://www.remotion.dev/docs/lambda/presignurl) |
| `renderMediaOnLambda()` | Trigger a video or audio render | [link](https://www.remotion.dev/docs/lambda/rendermediaonlambda) |
| `renderStillOnLambda()` | Trigger a still render | [link](https://www.remotion.dev/docs/lambda/renderstillonlambda) |
| `simulatePermissions()` | Ensure permissions are correctly set up | [link](https://www.remotion.dev/docs/lambda/simulatepermissions) |
| `speculateFunctionName()` | Get the lambda function name based on its configuration | [link](https://www.remotion.dev/docs/lambda/speculatefunctionname) |
| `validateWebhookSignature()` | Validate an incoming webhook request is authentic | [link](https://www.remotion.dev/docs/lambda/validatewebhooksignature) |
| `appRouterWebhook()` | Handle incoming webhooks specifically for the Next.js app router | [link](https://www.remotion.dev/docs/lambda/approuterwebhook) |
| `pagesRouterWebhook()` | Handle incoming webhooks specifically for the Next.js pages router | [link](https://www.remotion.dev/docs/lambda/pagesrouterwebhook) |
| `expressWebhook()` | Handle incoming webhooks specifically for Express.js | [link](https://www.remotion.dev/docs/lambda/expresswebhook) |

Also exported but not in the docs table: `deleteRender`, `renderVideoOnLambda`.

Subpath imports: `@remotion/lambda/client` → `appRouterWebhook`, `cancelRenderOnLambda`, `deleteFunction`, `deleteRender`, `estimatePrice`, `expressWebhook`, `getAwsClient`, `getCompositionsOnLambda`, `getFunctionVersion`, `getFunctions`, `getRenderProgress`, `getSites`, `pagesRouterWebhook`, `presignUrl`, `renderMediaOnLambda`, `renderStillOnLambda`, `renderVideoOnLambda`, `speculateFunctionName`, `validateWebhookSignature`; `@remotion/lambda/policies` → `ROLE_NAME`, `getRolePolicy`, `getUserPolicy`

**Example — `render.ts`**

```ts
import {deployFunction, deploySite, getOrCreateBucket, getRenderProgress, renderMediaOnLambda} from '@remotion/lambda';
const region = 'ap-southeast-2';
const {functionName} = await deployFunction({region, timeoutInSeconds: 240, memorySizeInMb: 2048, createCloudWatchLogGroup: true});
const {bucketName} = await getOrCreateBucket({region});
const {serveUrl} = await deploySite({region, entryPoint: './src/index.ts', siteName: 'finhub-videos', bucketName});
const {renderId} = await renderMediaOnLambda({region, functionName, serveUrl, composition: 'MyComp', codec: 'h264', inputProps: {title: 'From Lambda'}});
let done = false;
while (!done) {
  const p = await getRenderProgress({renderId, bucketName, functionName, region});
  if (p.fatalErrorEncountered) throw new Error(p.errors[0]?.message);
  done = p.done; console.log(p.overallProgress, p.outputFile);
  await new Promise((r) => setTimeout(r, 2000));
}
```

## @remotion/layout-utils

Layout helpers

Install: `npx remotion add @remotion/layout-utils`


| API | What it does | Doc |
|---|---|---|
| `measureText()` | Get dimensions of text | [link](https://www.remotion.dev/docs/layout-utils/measure-text) |
| `fillTextBox()` | Find line breaks and overflows in a text box | [link](https://www.remotion.dev/docs/layout-utils/fill-text-box) |
| `fitText()` | Get font size to fit text in a box | [link](https://www.remotion.dev/docs/layout-utils/fit-text) |
| `fitTextOnNLines()` | Get font size to fit text on n lines | [link](https://www.remotion.dev/docs/layout-utils/fit-text-on-n-lines) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {fitText, measureText} from '@remotion/layout-utils';
import {AbsoluteFill} from 'remotion';
const text = 'Refinance and save';
const {fontSize} = fitText({text, withinWidth: 1600, fontFamily: 'Arial', fontWeight: 'bold'});
export const width = measureText({text, fontFamily: 'Arial', fontSize: 40, fontWeight: 'bold'}).width;
export const MyComp: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{fontSize, fontFamily: 'Arial', fontWeight: 'bold'}}>{text}</div>
  </AbsoluteFill>
);
```

## @remotion/licensing

Report and query company license usage

Install: `npx remotion add @remotion/licensing`
  ·  Runs in: **Node/Bun script**


| API | What it does | Doc |
|---|---|---|
| `registerUsageEvent()` | Register a render | [link](https://www.remotion.dev/docs/licensing/register-usage-event) |
| `getUsage()` | Query usage of company license | [link](https://www.remotion.dev/docs/licensing/get-usage) |

**Example — `usage.ts`**

```ts
import {registerUsageEvent} from '@remotion/licensing';
await registerUsageEvent({licenseKey: process.env.REMOTION_LICENSE_KEY!, event: 'cloud-render', host: 'https://finhub.net.au', succeeded: true});
```

## @remotion/light-leaks

Light Leak effects

Install: `npx remotion add @remotion/light-leaks`


| API | What it does | Doc |
|---|---|---|
| `lightLeak()` | Apply a light leak as a canvas effect | [link](https://www.remotion.dev/docs/light-leaks/light-leak-effect) |
| `<LightLeak>` | Render a light leak effect | [link](https://www.remotion.dev/docs/light-leaks/light-leak) |

Also exported but not in the docs table: `lightLeakEffectSchema`.

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {LightLeak} from '@remotion/light-leaks';
import {AbsoluteFill} from 'remotion';
export const MyComp: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}><LightLeak durationInFrames={60} seed={3} hueShift={30} /></AbsoluteFill>
);
```

## @remotion/rough-notation

Rough annotation primitives

Install: `npx remotion add @remotion/rough-notation`


| API | What it does | Doc |
|---|---|---|
| `<Box>` | Draw a box around text | [link](https://www.remotion.dev/docs/rough-notation/box) |
| `<Bracket>` | Draw brackets beside text | [link](https://www.remotion.dev/docs/rough-notation/bracket) |
| `<Circle>` | Circle text | [link](https://www.remotion.dev/docs/rough-notation/circle) |
| `<CrossedOff>` | Cross off text with two strokes | [link](https://www.remotion.dev/docs/rough-notation/crossed-off) |
| `<Highlight>` | Draw a marker highlight behind text | [link](https://www.remotion.dev/docs/rough-notation/highlight) |
| `<StrikeThrough>` | Strike through text with one line | [link](https://www.remotion.dev/docs/rough-notation/strike-through) |
| `<Underline>` | Underline text | [link](https://www.remotion.dev/docs/rough-notation/underline) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {Highlight, Underline} from '@remotion/rough-notation';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
export const MyComp: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [10, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontSize: 80}}>
      <div>Save <Highlight progress={progress} color="#FFE066">thousands</Highlight> by <Underline progress={progress} color="#355F8F" strokeWidth={8}>refinancing</Underline></div>
    </AbsoluteFill>
  );
};
```

## @remotion/lottie

Include a Lottie animation in your video

Install: `npx remotion add @remotion/lottie`


| API | What it does | Doc |
|---|---|---|
| `<Lottie>` | Embed a Lottie animation in Remotion | [link](https://www.remotion.dev/docs/lottie/lottie) |
| `getLottieMetadata()` | Get metadata of a Lottie animation | [link](https://www.remotion.dev/docs/lottie/getlottiemetadata) |
| `staticFile()` | Load Lottie animations from a static file | [link](https://www.remotion.dev/docs/lottie/staticfile) |
| Guide | Loading Lottie animations from a remote URL | [link](https://www.remotion.dev/docs/lottie/remote) |
| Guide | Where to find Lottie files | [link](https://www.remotion.dev/docs/lottie/lottiefiles) |

**Example — `MyComp.tsx`**

```tsx
import React, {useEffect, useState} from 'react';
import {Lottie, type LottieAnimationData} from '@remotion/lottie';
import {AbsoluteFill, cancelRender, staticFile, useDelayRender} from 'remotion';
export const MyComp: React.FC = () => {
  const {delayRender, continueRender} = useDelayRender();
  const [handle] = useState(() => delayRender('Loading Lottie'));
  const [data, setData] = useState<LottieAnimationData | null>(null);
  useEffect(() => {
    fetch(staticFile('animation.json')).then((r) => r.json()).then((j) => { setData(j); continueRender(handle); }).catch(cancelRender);
  }, [handle, continueRender]);
  return <AbsoluteFill>{data ? <Lottie animationData={data} loop /> : null}</AbsoluteFill>;
};
```

## @remotion/mac-cursors

Render macOS and custom CSS cursors.

Install: `npx remotion add @remotion/mac-cursors`


| API | What it does | Doc |
|---|---|---|
| `<MacOSCursor>` | Render a macOS or custom CSS cursor | [link](https://www.remotion.dev/docs/mac-cursors/mac-os-cursor) |

Also exported but not in the docs table: `macOSCursorNames`, `macOSCursorSchema`, `resolveCursor`.

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {MacOSCursor} from '@remotion/mac-cursors';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
export const MyComp: React.FC = () => {
  const left = interpolate(useCurrentFrame(), [0, 60], [100, 900], {extrapolateRight: 'clamp'});
  return <AbsoluteFill><MacOSCursor cursor="pointer" style={{left, top: 300, scale: 2}} /></AbsoluteFill>;
};
```

## @remotion/media

An experimental `<NewVideo />` tag for embedding videos.

Install: `npx remotion add @remotion/media`


| API | What it does | Doc |
|---|---|---|
| `<Video>` | WebCodecs-based tag for embedding videos | [link](https://www.remotion.dev/docs/media/video) |
| `<Audio>` | WebCodecs-based tag for embedding audio | [link](https://www.remotion.dev/docs/media/audio) |

Also exported but not in the docs table: `AudioForPreview`, `getTargetSampleRate`.

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {Audio, Video} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
export const MyComp: React.FC = () => (
  <AbsoluteFill>
    <Video src={staticFile('talking-head.mp4')} trimBefore={30} trimAfter={600} volume={1} />
    <Audio src={staticFile('music.mp3')} volume={0.15} loop />
  </AbsoluteFill>
);
```

## @remotion/media-parser

A pure JavaScript library for parsing video files

Install: `npx remotion add @remotion/media-parser`
  ·  Runs in: **Node or browser script**


| API | What it does | Doc |
|---|---|---|
| `Getting video metadata` | Simple examples of extracting video metadata | [link](https://www.remotion.dev/docs/media-parser/metadata) |
| `Available fields` | Information you can get using the media parser | [link](https://www.remotion.dev/docs/media-parser/fields) |
| `Fast and slow operations` | Efficently use `parseMedia()` | [link](https://www.remotion.dev/docs/media-parser/fast-and-slow) |
| `Extract samples` | Extract video and audio samples from a media file | [link](https://www.remotion.dev/docs/media-parser/samples) |
| `Readers` | Read from a variety of sources | [link](https://www.remotion.dev/docs/media-parser/readers) |
| `Pause, resume and abort` | Steer the parsing process | [link](https://www.remotion.dev/docs/media-parser/pause-resume-abort) |
| `Seeking` | Seek to a different position in a media file | [link](https://www.remotion.dev/docs/media-parser/seeking) |
| `Format support` | What you can parse | [link](https://www.remotion.dev/docs/media-parser/format-support) |
| `Runtime support` | Where you can run it | [link](https://www.remotion.dev/docs/media-parser/runtime-support) |
| `Extract ID3 tags and EXIF data` | Get embedded tags from video files | [link](https://www.remotion.dev/docs/media-parser/tags) |
| `Web Workers` | Parse a media file in the browser on a separate thread. | [link](https://www.remotion.dev/docs/media-parser/workers) |
| `Download and parse` | Download a media file to disk and parse it simultaneously | [link](https://www.remotion.dev/docs/media-parser/download-and-parse) |
| `Foreign file types` | Get information from the errors when passing unsupported file types | [link](https://www.remotion.dev/docs/media-parser/foreign-file-types) |
| `WebCodecs` | Decode video and audio frames in the browser | [link](https://www.remotion.dev/docs/media-parser/webcodecs) |
| `Stream selection` | Choose which streams to use in a HLS Playlist | [link](https://www.remotion.dev/docs/media-parser/stream-selection) |
| `parseMedia()` | Parse a media file. | [link](https://www.remotion.dev/docs/media-parser/parse-media) |
| `downloadAndParseMedia()` | Download and parse a media file. | [link](https://www.remotion.dev/docs/media-parser/download-and-parse-media) |
| `parseMediaOnWebWorker()` | Parse a media file in the browser on a separate thread. | [link](https://www.remotion.dev/docs/media-parser/parse-media-on-web-worker) |
| `parseMediaOnServerWorker()` | Parse a media file on the server on a separate thread. | [link](https://www.remotion.dev/docs/media-parser/parse-media-on-server-worker) |
| `mediaParserController()` | Pause, resume and abort the parsing. | [link](https://www.remotion.dev/docs/media-parser/media-parser-controller) |
| `hasBeenAborted()` | Determine from an error if the parsing has been aborted. | [link](https://www.remotion.dev/docs/media-parser/has-been-aborted) |
| `WEBCODECS_TIMESCALE` | The global timescale (`1_000_000`) of WebCodecs as a constant. | [link](https://www.remotion.dev/docs/media-parser/webcodecs-timescale) |
| `nodeReader` | Read a file from the local file system. | [link](https://www.remotion.dev/docs/media-parser/node-reader) |
| `webReader` | Read a file from a `File` or from a URL. | [link](https://www.remotion.dev/docs/media-parser/web-reader) |
| `universalReader` | Read a file from a `File`, from a URL or from the local file system | [link](https://www.remotion.dev/docs/media-parser/universal-reader) |
| `nodeWriter` | Write a file to the local file system using Node. | [link](https://www.remotion.dev/docs/media-parser/node-writer) |
| `TypeScript types` | Reference for the types returned by Media Parser. | [link](https://www.remotion.dev/docs/media-parser/types) |

Also exported but not in the docs table: `IsAPdfError`, `IsAnImageError`, `IsAnUnsupportedFileTypeError`, `MediaParserAbortError`, `VERSION`, `defaultSelectM3uAssociatedPlaylists`, `defaultSelectM3uStreamFn`.

Subpath imports: `@remotion/media-parser/node` → `nodeCreateAdjacentFileSource`, `nodeReadContent`, `nodeReadWholeAsText`, `nodeReader`; `@remotion/media-parser/web` → `webReader`; `@remotion/media-parser/universal` → `universalReader`; `@remotion/media-parser/node-writer` → `nodeWriter`

**Example — `probe.ts`**

```ts
import {parseMedia} from '@remotion/media-parser';
import {nodeReader} from '@remotion/media-parser/node';
const result = await parseMedia({
  src: './public/talking-head.mp4', reader: nodeReader,
  fields: {durationInSeconds: true, dimensions: true, fps: true, videoCodec: true},
});
console.log(result.durationInSeconds, result.dimensions, result.fps, result.videoCodec);
```

## @remotion/media-utils

Obtain info about video and audio.

Install: `npx remotion add @remotion/media-utils`


| API | What it does | Doc |
|---|---|---|
| `audioBufferToDataUrl()` | Serialize an audio buffer | [link](https://www.remotion.dev/docs/audio-buffer-to-data-url) |
| `getAudioData()` | Get metadata of an audio source | [link](https://www.remotion.dev/docs/get-audio-data) |
| `getAudioDurationInSeconds()` | Get the duration of an audio source | [link](https://www.remotion.dev/docs/get-audio-duration-in-seconds) |
| `getVideoMetadata()` | Get metadata of a video source | [link](https://www.remotion.dev/docs/get-video-metadata) |
| `getWaveformPortion()` | Trims audio data into a waveform | [link](https://www.remotion.dev/docs/get-waveform-portion) |
| `useAudioData()` | `getAudioData()` as a hook | [link](https://www.remotion.dev/docs/use-audio-data) |
| `useWindowedAudioData()` | Optimized for fetching only current data, works only with `.wav` | [link](https://www.remotion.dev/docs/use-windowed-audio-data) |
| `visualizeAudio()` | Process a music waveform for visualization | [link](https://www.remotion.dev/docs/visualize-audio) |
| `visualizeAudioWaveform()` | Process a voice waveform for visualization | [link](https://www.remotion.dev/docs/media-utils/visualize-audio-waveform) |
| `createSmoothSvgPath()` | Turn waveform points into a smooth SVG path | [link](https://www.remotion.dev/docs/media-utils/create-smooth-svg-path) |

Also exported but not in the docs table: `getAudioDuration`, `getImageDimensions`.

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {useWindowedAudioData, visualizeAudio} from '@remotion/media-utils';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
const src = staticFile('voiceover.mp3');
export const MyComp: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({src, frame, fps, windowInSeconds: 10});
  if (!audioData) return null;
  const bars = visualizeAudio({fps, frame, audioData, numberOfSamples: 32, optimizeFor: 'speed', dataOffsetInSeconds});
  return (
    <AbsoluteFill style={{flexDirection: 'row', alignItems: 'flex-end', gap: 6}}>
      {bars.map((v, i) => <div key={i} style={{flex: 1, height: `${v * 100}%`, background: '#F5B400'}} />)}
    </AbsoluteFill>
  );
};
```

## @remotion/motion-blur

Apply motion blur effects to components

Install: `npx remotion add @remotion/motion-blur`


| API | What it does | Doc |
|---|---|---|
| `<HtmlInCanvasMotionBlur>` | Sample HTML across a frame for the best motion blur result | [link](https://www.remotion.dev/docs/motion-blur/html-in-canvas-motion-blur) |
| `<CameraMotionBlur>` | Add a natural camera motion blur effect to children | [link](https://www.remotion.dev/docs/motion-blur/camera-motion-blur) |
| `<Trail>` | Add a trail effect to children | [link](https://www.remotion.dev/docs/motion-blur/trail) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {CameraMotionBlur, Trail} from '@remotion/motion-blur';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
const Box: React.FC = () => {
  const x = interpolate(useCurrentFrame(), [0, 30], [0, 1200], {extrapolateRight: 'clamp'});
  return <div style={{width: 150, height: 150, background: '#1C4E80', translate: `${x}px 0px`}} />;
};
export const MyComp: React.FC = () => (
  <AbsoluteFill>
    <CameraMotionBlur shutterAngle={180} samples={10}><AbsoluteFill><Box /></AbsoluteFill></CameraMotionBlur>
    <Trail layers={20} lagInFrames={0.1} trailOpacity={1}><AbsoluteFill style={{top: 300}}><Box /></AbsoluteFill></Trail>
  </AbsoluteFill>
);
```

## @remotion/noise

Generate noise effects

Install: `npx remotion add @remotion/noise`


| API | What it does | Doc |
|---|---|---|
| `noise2D()` | Create 2D noise | [link](https://www.remotion.dev/docs/noise/noise-2d) |
| `noise3D()` | Create 3D noise | [link](https://www.remotion.dev/docs/noise/noise-3d) |
| `noise4D()` | Create 4D noise | [link](https://www.remotion.dev/docs/noise/noise-4d) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {noise3D} from '@remotion/noise';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
export const MyComp: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: 40}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: (i % 8) * 220 + noise3D('x', i, 0, frame * 0.01) * 60,
          top: Math.floor(i / 8) * 200 + noise3D('y', i, 0, frame * 0.01) * 60, width: 20, height: 20, borderRadius: 10, background: 'white'}} />
      ))}
    </AbsoluteFill>
  );
};
```

## @remotion/openai-whisper

Work with transcriptions from OpenAI Whisper

Install: `npx remotion add @remotion/openai-whisper`
  ·  Runs in: **Node/Bun script**


| API | What it does | Doc |
|---|---|---|
| `openAiWhisperApiToCaptions()` | Turn OpenAI Whisper API transcriptions into an array of `Caption` | [link](https://www.remotion.dev/docs/openai-whisper/openai-whisper-api-to-captions) |

**Example — `transcribe.ts`**

```ts
import fs from 'fs';
import OpenAI from 'openai';
import {openAiWhisperApiToCaptions} from '@remotion/openai-whisper';
const openai = new OpenAI();
const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream('audio.mp3'), model: 'whisper-1', response_format: 'verbose_json',
  timestamp_granularities: ['word'],
});
const {captions} = openAiWhisperApiToCaptions({transcription});
fs.writeFileSync('public/captions.json', JSON.stringify(captions));
```

## @remotion/paths

Manipulate and obtain info about SVG paths

Install: `npx remotion add @remotion/paths`


| API | What it does | Doc |
|---|---|---|
| `getLength()` | Obtain length of an SVG path | [link](https://www.remotion.dev/docs/paths/get-length) |
| `cutPath()` | Cut an SVG path at a specified length | [link](https://www.remotion.dev/docs/paths/cut-path) |
| `getPointAtLength()` | Get coordinates at a certain point of an SVG path | [link](https://www.remotion.dev/docs/paths/get-point-at-length) |
| `getTangentAtLength()` | Gets tangents `x` and `y` of a point which is on an SVG path | [link](https://www.remotion.dev/docs/paths/get-tangent-at-length) |
| `reversePath()` | Switch direction of an SVG path | [link](https://www.remotion.dev/docs/paths/reverse-path) |
| `normalizePath()` | Replace relative with absolute coordinates | [link](https://www.remotion.dev/docs/paths/normalize-path) |
| `interpolatePath()` | Interpolates between two SVG paths | [link](https://www.remotion.dev/docs/paths/interpolate-path) |
| `interpolatePaths()` | Interpolate SVG paths across multiple keyframes | [link](https://www.remotion.dev/docs/paths/interpolate-paths) |
| `evolvePath()` | Animate an SVG path | [link](https://www.remotion.dev/docs/paths/evolve-path) |
| `centerPath()` | Translates an SVG path to center it around a target point | [link](https://www.remotion.dev/docs/paths/center-path) |
| `translatePath()` | Translates the position of an path against X/Y coordinates | [link](https://www.remotion.dev/docs/paths/translate-path) |
| `warpPath()` | Remap the coordinates of a path | [link](https://www.remotion.dev/docs/paths/warp-path) |
| `scalePath()` | Grow or shrink the size of the path | [link](https://www.remotion.dev/docs/paths/scale-path) |
| `getBoundingBox()` | Get the bounding box of a SVG path | [link](https://www.remotion.dev/docs/paths/get-bounding-box) |
| `resetPath()` | Translates an SVG path to `(0, 0)` | [link](https://www.remotion.dev/docs/paths/reset-path) |
| `extendViewBox()` | Widen an SVG viewBox in all directions | [link](https://www.remotion.dev/docs/paths/extend-viewbox) |
| `getSubpaths()` | Split SVG path into its parts | [link](https://www.remotion.dev/docs/paths/get-subpaths) |
| `parsePath()` | Parse a string into an array of instructions | [link](https://www.remotion.dev/docs/paths/parse-path) |
| `serializeInstructions()` | Turn an array of instructions into a SVG path | [link](https://www.remotion.dev/docs/paths/serialize-instructions) |
| `reduceInstructions()` | Reduce the amount of instruction types | [link](https://www.remotion.dev/docs/paths/reduce-instructions) |

Also exported but not in the docs table: `getInstructionIndexAtLength`.

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
const d = 'M 100 600 C 400 100, 900 900, 1800 200';
export const MyComp: React.FC = () => {
  const progress = interpolate(useCurrentFrame(), [0, 60], [0, 1], {extrapolateRight: 'clamp'});
  const {strokeDasharray, strokeDashoffset} = evolvePath(progress, d);
  const head = getPointAtLength(d, getLength(d) * progress);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080">
        <path d={d} stroke="#F5B400" strokeWidth={10} fill="none" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
        {head ? <circle cx={head.x} cy={head.y} r={16} fill="white" /> : null}
      </svg>
    </AbsoluteFill>
  );
};
```

## @remotion/player

Play a Remotion video in the browser.

Install: `npx remotion add @remotion/player`
  ·  Runs in: **Web app (outside the Remotion project)**


| API | What it does | Doc |
|---|---|---|
| `<Player>` | Embed a Remotion composition in a web app | [link](https://www.remotion.dev/docs/player/player) |
| `<Thumbnail>` | Embed a still in a web app | [link](https://www.remotion.dev/docs/player/thumbnail) |
| `Installation` | Install the Player into your project | [link](https://www.remotion.dev/docs/player/installation) |
| `Examples` | Code samples for various scenarios | [link](https://www.remotion.dev/docs/player/examples) |
| `Sizing` | Setting the size of the Player | [link](https://www.remotion.dev/docs/player/scaling) |
| `Autoplay` | Dealing with browser autoplay policies | [link](https://www.remotion.dev/docs/player/autoplay) |
| `Display time` | Write a custom component for displaying the current time | [link](https://www.remotion.dev/docs/player/current-time) |
| `Preloading assets` | Make assets ready to play when they appear in the video | [link](https://www.remotion.dev/docs/player/preloading) |
| `Best practices` | Checklist of correct implementation | [link](https://www.remotion.dev/docs/player/best-practices) |
| `Buffer state` | Pause the Player while assets are loading | [link](https://www.remotion.dev/docs/player/buffer-state) |
| `Avoiding flickers` | Troubleshooting for flickers due to unloaded assets | [link](https://www.remotion.dev/docs/troubleshooting/player-flicker) |
| `Premounting` | Mount components earlier to allow them to load | [link](https://www.remotion.dev/docs/player/premounting) |
| `Drag & Drop` | Allow interactivity on the canvas | [link](https://www.remotion.dev/docs/player/drag-and-drop) |
| `Custom controls` | Recipes for custom Play buttons, volume sliders, etc. | [link](https://www.remotion.dev/docs/player/custom-controls) |
| `Media Keys` | Control what happens when users presses ⏯️ | [link](https://www.remotion.dev/docs/player/media-keys) |

**Example — `App.tsx`**

```tsx
import React, {useRef} from 'react';
import {Player, type PlayerRef} from '@remotion/player';
import {MyComp} from '../core/MyComp';
// Lives in your web app (Next.js / Vite), not in the Remotion project
export const App: React.FC = () => {
  const ref = useRef<PlayerRef>(null);
  return (
    <div>
      <Player ref={ref} component={MyComp} inputProps={{title: 'Live preview'}} durationInFrames={150}
        fps={30} compositionWidth={1920} compositionHeight={1080} style={{width: '100%'}} controls loop />
      <button onClick={() => ref.current?.seekTo(0)}>Restart</button>
    </div>
  );
};
```

## @remotion/preload

Preload media for the Player

Install: `npx remotion add @remotion/preload`
  ·  Runs in: **Web app (outside the Remotion project)**


| API | What it does | Doc |
|---|---|---|
| `preloadVideo()` | Preload a video source | [link](https://www.remotion.dev/docs/preload/preload-video) |
| `preloadAudio()` | Preload an audio source | [link](https://www.remotion.dev/docs/preload/preload-audio) |
| `preloadFont()` | Preload a font | [link](https://www.remotion.dev/docs/preload/preload-font) |
| `preloadImage()` | Preload an image | [link](https://www.remotion.dev/docs/preload/preload-image) |
| `resolveRedirect()` | Get the definitive URL after all redirects | [link](https://www.remotion.dev/docs/preload/resolve-redirect) |

**Example — `App.tsx`**

```tsx
import {preloadAudio, preloadFont, preloadImage, preloadVideo} from '@remotion/preload';
// Call in the web app hosting <Player>; each returns an unpreload() cleanup
const cleanups = [
  preloadVideo('https://example.com/clip.mp4'), preloadAudio('https://example.com/music.mp3'),
  preloadImage('https://example.com/bg.png'), preloadFont('https://example.com/brand.woff2'),
];
export const unpreloadAll = () => cleanups.forEach((fn) => fn());
```

## @remotion/renderer

Render video, audio and stills from Node.JS or Bun

Install: `npx remotion add @remotion/renderer`
  ·  Runs in: **Node/Bun script**


| API | What it does | Doc |
|---|---|---|
| `getCompositions()` | List available compositions | [link](https://www.remotion.dev/docs/renderer/get-compositions) |
| `selectComposition()` | Get a composition | [link](https://www.remotion.dev/docs/renderer/select-composition) |
| `renderMedia()` | Render a video or audio | [link](https://www.remotion.dev/docs/renderer/render-media) |
| `renderFrames()` | Render a series of images | [link](https://www.remotion.dev/docs/renderer/render-frames) |
| `renderStill()` | Render a single image | [link](https://www.remotion.dev/docs/renderer/render-still) |
| `stitchFramesToVideo()` | Turn images into a video | [link](https://www.remotion.dev/docs/renderer/stitch-frames-to-video) |
| `openBrowser()` | Open a Chrome browser to reuse across renders | [link](https://www.remotion.dev/docs/renderer/open-browser) |
| `ensureBrowser()` | Open a Chrome browser to reuse across renders | [link](https://www.remotion.dev/docs/renderer/ensure-browser) |
| `makeCancelSignal()` | Create token to later cancel a render | [link](https://www.remotion.dev/docs/renderer/make-cancel-signal) |
| `getVideoMetadata()` | **Deprecated.** Get metadata from a video file in Node.js | [link](https://www.remotion.dev/docs/renderer/get-video-metadata) |
| `getSilentParts()` | Obtain silent portions of a video or audio | [link](https://www.remotion.dev/docs/renderer/get-silent-parts) |
| `combineChunks()` | Combine chunks of partial renders | [link](https://www.remotion.dev/docs/renderer/combine-chunks) |
| `ensureFfmpeg()` | **Deprecated.** Check for ffmpeg binary and install if not existing | [link](https://www.remotion.dev/docs/renderer/ensure-ffmpeg) |
| `ensureFfprobe()` | **Deprecated.** Check for ffprobe binary and install if not existing | [link](https://www.remotion.dev/docs/renderer/ensure-ffprobe) |
| `getCanExtractFramesFast()` | **Deprecated.** Probes for fast extraction for | [link](https://www.remotion.dev/docs/renderer/get-can-extract-frames-fast) |

Also exported but not in the docs table: `ErrorWithStackFrame`, `HeadlessBrowser`, `customEditorColumnNumberPlaceholder`, `customEditorLineNumberPlaceholder`, `customEditorTargetPathPlaceholder`, `defaultCodingAgentIds`, `defaultEditorIds`, `extractAudio`, `validateOutputFilename`, `validateSelectedPixelFormatAndImageFormatCombination`.

Subpath imports: `@remotion/renderer/client` → `BrowserSafeApis`, `customEditorColumnNumberPlaceholder`, `customEditorLineNumberPlaceholder`, `customEditorTargetPathPlaceholder`, `defaultCodingAgentIds`, `defaultEditorIds`; `@remotion/renderer/pure` → `NoReactAPIs`; `@remotion/renderer/error-handling` → `wrapWithErrorHandling`

**Example — `render.ts`**

```ts
import path from 'path';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
const serveUrl = await bundle({entryPoint: path.resolve('./src/index.ts')});
const inputProps = {title: 'Rendered from Node'};
const composition = await selectComposition({serveUrl, id: 'MyComp', inputProps});
await renderMedia({composition, serveUrl, codec: 'h264', outputLocation: 'out/MyComp.mp4', inputProps,
  onProgress: ({progress}) => console.log(`${Math.round(progress * 100)}%`)});
await renderStill({composition, serveUrl, output: 'out/thumb.png', frame: 30, inputProps});
```

## @remotion/rive

Embed Rive animations in Remotion

Install: `npx remotion add @remotion/rive`


| API | What it does | Doc |
|---|---|---|
| `<RemotionRiveCanvas>` | Render a Rive animation | [link](https://www.remotion.dev/docs/rive/remotionrivecanvas) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {RemotionRiveCanvas} from '@remotion/rive';
import {AbsoluteFill, staticFile} from 'remotion';
export const MyComp: React.FC = () => (
  <AbsoluteFill><RemotionRiveCanvas src={staticFile('animation.riv')} fit="contain" /></AbsoluteFill>
);
```

## @remotion/sfx

Sound effects library

Install: `npx remotion add @remotion/sfx`


| API | What it does | Doc |
|---|---|---|
| `whip` | Whip sound effect | [link](https://www.remotion.dev/docs/sfx/whip) |
| `whoosh` | Whoosh sound effect | [link](https://www.remotion.dev/docs/sfx/whoosh) |
| `pageTurn` | Page turn sound effect | [link](https://www.remotion.dev/docs/sfx/page-turn) |
| `uiSwitch` | UI switch sound effect | [link](https://www.remotion.dev/docs/sfx/ui-switch) |
| `mouseClick` | Mouse click sound effect | [link](https://www.remotion.dev/docs/sfx/mouse-click) |
| `shutterModern` | Modern camera shutter sound effect | [link](https://www.remotion.dev/docs/sfx/shutter-modern) |
| `shutterOld` | Vintage camera shutter sound effect | [link](https://www.remotion.dev/docs/sfx/shutter-old) |
| `ding` | Ding notification sound effect | [link](https://www.remotion.dev/docs/sfx/ding) |
| `bruh` | Bruh sound effect | [link](https://www.remotion.dev/docs/sfx/bruh) |
| `vineBoom` | Vine boom sound effect | [link](https://www.remotion.dev/docs/sfx/vine-boom) |
| `windowsXpError` | Windows XP error sound effect | [link](https://www.remotion.dev/docs/sfx/windows-xp-error) |
| `fah` | Fah meme sound effect | [link](https://www.remotion.dev/docs/sfx/fah) |
| `spongebobFail` | SpongeBob fail sound effect | [link](https://www.remotion.dev/docs/sfx/spongebob-fail) |
| `omgHellNah` | Oh my god bro hell nah sound effect | [link](https://www.remotion.dev/docs/sfx/omg-hell-nah) |
| `priceIsRightFail` | Price Is Right fail horn sound effect | [link](https://www.remotion.dev/docs/sfx/price-is-right-fail) |
| `romanceMeme` | Romance meme sound effect | [link](https://www.remotion.dev/docs/sfx/romance-meme) |
| `boneCrack` | Bone crack sound effect | [link](https://www.remotion.dev/docs/sfx/bone-crack) |
| `animeWow` | Anime wow sound effect | [link](https://www.remotion.dev/docs/sfx/anime-wow) |
| `yippee` | Yippee sound effect | [link](https://www.remotion.dev/docs/sfx/yippee) |
| `loadingLag` | Loading lag sound effect | [link](https://www.remotion.dev/docs/sfx/loading-lag) |
| `wilhelmScream` | Wilhelm scream sound effect | [link](https://www.remotion.dev/docs/sfx/wilhelm-scream) |
| `macQuack` | Mac quack sound effect | [link](https://www.remotion.dev/docs/sfx/mac-quack) |
| `skedaddle` | Skedaddle sound effect | [link](https://www.remotion.dev/docs/sfx/skedaddle) |
| `snapchatNotification` | Snapchat notification sound effect | [link](https://www.remotion.dev/docs/sfx/snapchat-notification) |
| `nellyAhh` | Nelly ahh sound effect | [link](https://www.remotion.dev/docs/sfx/nelly-ahh) |
| `sanctuaryGuardianWhat` | Sanctuary Guardian what meme sound effect | [link](https://www.remotion.dev/docs/sfx/sanctuary-guardian-what) |
| `minecraftHurt` | Minecraft hurt sound effect | [link](https://www.remotion.dev/docs/sfx/minecraft-hurt) |
| `ohMyGodVine` | Oh my god vine sound effect | [link](https://www.remotion.dev/docs/sfx/oh-my-god-vine) |
| `illuminatiConfirmed` | Illuminati confirmed sound effect | [link](https://www.remotion.dev/docs/sfx/illuminati-confirmed) |
| `dramaticBoomer` | Dramatic boomer sound effect | [link](https://www.remotion.dev/docs/sfx/dramatic-boomer) |
| `triggered` | Triggered meme sound effect | [link](https://www.remotion.dev/docs/sfx/triggered) |
| `recordScratch` | Record scratch sound effect | [link](https://www.remotion.dev/docs/sfx/record-scratch) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {ding, whoosh} from '@remotion/sfx';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence} from 'remotion';
export const MyComp: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0}><Audio src={whoosh} /></Sequence>
    <Sequence from={45}><Audio src={ding} volume={0.6} /></Sequence>
  </AbsoluteFill>
);
```

## @remotion/shapes

Generate SVG shapes

Install: `npx remotion add @remotion/shapes`


| API | What it does | Doc |
|---|---|---|
| `<Arrow />` | Render a arrow as an SVG component | [link](https://www.remotion.dev/docs/shapes/arrow) |
| `makeArrow()` | Generate the SVG path and metadata for a arrow | [link](https://www.remotion.dev/docs/shapes/make-arrow) |
| `<Callout />` | Render a callout as an SVG component | [link](https://www.remotion.dev/docs/shapes/callout) |
| `makeCallout()` | Generate the SVG path and metadata for a callout | [link](https://www.remotion.dev/docs/shapes/make-callout) |
| `<Circle />` | Render a circle as an SVG component | [link](https://www.remotion.dev/docs/shapes/circle) |
| `makeCircle()` | Generate the SVG path and metadata for a circle | [link](https://www.remotion.dev/docs/shapes/make-circle) |
| `<Ellipse />` | Render a ellipse as an SVG component | [link](https://www.remotion.dev/docs/shapes/ellipse) |
| `makeEllipse()` | Generate the SVG path and metadata for a ellipse | [link](https://www.remotion.dev/docs/shapes/make-ellipse) |
| `<Heart />` | Render a heart as an SVG component | [link](https://www.remotion.dev/docs/shapes/heart) |
| `makeHeart()` | Generate the SVG path and metadata for a heart | [link](https://www.remotion.dev/docs/shapes/make-heart) |
| `<Pie />` | Render a pie as an SVG component | [link](https://www.remotion.dev/docs/shapes/pie) |
| `makePie()` | Generate the SVG path and metadata for a pie | [link](https://www.remotion.dev/docs/shapes/make-pie) |
| `<Polygon />` | Render a polygon as an SVG component | [link](https://www.remotion.dev/docs/shapes/polygon) |
| `makePolygon()` | Generate the SVG path and metadata for a polygon | [link](https://www.remotion.dev/docs/shapes/make-polygon) |
| `<Rect />` | Render a rect as an SVG component | [link](https://www.remotion.dev/docs/shapes/rect) |
| `makeRect()` | Generate the SVG path and metadata for a rect | [link](https://www.remotion.dev/docs/shapes/make-rect) |
| `<Spark />` | Render a spark as an SVG component | [link](https://www.remotion.dev/docs/shapes/spark) |
| `makeSpark()` | Generate the SVG path and metadata for a spark | [link](https://www.remotion.dev/docs/shapes/make-spark) |
| `<Star />` | Render a star as an SVG component | [link](https://www.remotion.dev/docs/shapes/star) |
| `makeStar()` | Generate the SVG path and metadata for a star | [link](https://www.remotion.dev/docs/shapes/make-star) |
| `<Triangle />` | Render a triangle as an SVG component | [link](https://www.remotion.dev/docs/shapes/triangle) |
| `makeTriangle()` | Generate the SVG path and metadata for a triangle | [link](https://www.remotion.dev/docs/shapes/make-triangle) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {Circle, Star, makeRect} from '@remotion/shapes';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
const {path} = makeRect({width: 400, height: 120, cornerRadius: 20});
export const MyComp: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 40, flexDirection: 'row'}}>
      <Circle radius={80} fill="#F5B400" style={{scale: String(s)}} />
      <Star points={5} innerRadius={50} outerRadius={100} fill="#1C4E80" />
      <svg width={400} height={120}><path d={path} fill="#E0E7EF" /></svg>
    </AbsoluteFill>
  );
};
```

## @remotion/skia

Low-level graphics using React Native Skia

Install: `npx remotion add @remotion/skia`


| API | What it does | Doc |
|---|---|---|
| `enableSkia()` | Webpack override for enabling Skia | [link](https://www.remotion.dev/docs/skia/enable-skia) |
| `<SkiaCanvas>` | React Native Skia <Canvas> wrapper | [link](https://www.remotion.dev/docs/skia/skia-canvas) |

Subpath imports: `@remotion/skia/enable` → `enableSkia`

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {Fill, Circle} from '@shopify/react-native-skia';
import {SkiaCanvas} from '@remotion/skia';
import {useCurrentFrame, useVideoConfig} from 'remotion';
// Requires enableSkia() in remotion.config.ts (see skia/remotion.config.ts)
export const MyComp: React.FC = () => {
  const {width, height} = useVideoConfig();
  const r = 100 + useCurrentFrame() * 2;
  return (
    <SkiaCanvas width={width} height={height}>
      <Fill color="black" /><Circle cx={width / 2} cy={height / 2} r={r} color="#F5B400" />
    </SkiaCanvas>
  );
};
```

**Example — `remotion.config.ts`**

```ts
import {Config} from '@remotion/cli/config';
import {enableSkia} from '@remotion/skia/enable';
Config.overrideWebpackConfig((c) => enableSkia(c));
```

## @remotion/starburst

Starburst Effect

Install: `npx remotion add @remotion/starburst`


| API | What it does | Doc |
|---|---|---|
| **Effects** | | |
| `starburst()` | Apply a starburst ray effect | [link](https://www.remotion.dev/docs/starburst/starburst-effect) |
| **Components** | | |
| `<Starburst>` | Render a starburst ray effect | [link](https://www.remotion.dev/docs/starburst/starburst) |

Also exported but not in the docs table: `starburstEffectSchema`.

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {Starburst} from '@remotion/starburst';
import {AbsoluteFill} from 'remotion';
export const MyComp: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'black'}}>
    <Starburst durationInFrames={60} rays={16} colors={['#ffdd00', '#ff8800', '#ff4400']} rotation={15} width={1080} height={1080} />
  </AbsoluteFill>
);
```

## @remotion/studio

APIs for controlling theRemotion Studio

Install: `npx remotion add @remotion/studio`


| API | What it does | Doc |
|---|---|---|
| `getStaticFiles()` | Get a list of files in the `public` folder | [link](https://www.remotion.dev/docs/studio/get-static-files) |
| `watchPublicFolder()` | Listen to changes in the public folder | [link](https://www.remotion.dev/docs/studio/watch-public-folder) |
| `watchStaticFile()` | Listen to changes of a static file | [link](https://www.remotion.dev/docs/studio/watch-static-file) |
| `writeStaticFile()` | Save content to a file in the public directory | [link](https://www.remotion.dev/docs/studio/write-static-file) |
| `saveDefaultProps()` | Save default props to the root file | [link](https://www.remotion.dev/docs/studio/save-default-props) |
| `updateDefaultProps()` | Update default props in the Props editor | [link](https://www.remotion.dev/docs/studio/update-default-props) |
| `deleteStaticFile()` | Delete a file from the public directory | [link](https://www.remotion.dev/docs/studio/delete-static-file) |
| `restartStudio()` | Restart the Studio Server. | [link](https://www.remotion.dev/docs/studio/restart-studio) |
| `shutDownStudio()` | Shut down the Studio Server. | [link](https://www.remotion.dev/docs/studio/shut-down-studio) |
| `play()` | Start playback in the timeline | [link](https://www.remotion.dev/docs/studio/play) |
| `pause()` | Pause playback in the timeline | [link](https://www.remotion.dev/docs/studio/pause) |
| `toggle()` | Toggle playback in the timeline | [link](https://www.remotion.dev/docs/studio/toggle) |
| `seek()` | Jump to a position in the timeline | [link](https://www.remotion.dev/docs/studio/seek) |
| `goToComposition()` | Select a composition in the composition selector | [link](https://www.remotion.dev/docs/studio/go-to-composition) |
| `focusDefaultPropsPath()` | Scrolls to a specific field in the default props editor | [link](https://www.remotion.dev/docs/studio/focus-default-props-path) |
| `reevaluateComposition()` | Re-runs calculateMetadata() on the current composition | [link](https://www.remotion.dev/docs/studio/reevaluate-composition) |
| `visualControl()` | Create a control in the right sidebar of the Studio | [link](https://www.remotion.dev/docs/studio/visual-control) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {visualControl} from '@remotion/studio';
import {AbsoluteFill} from 'remotion';
// visualControl() values become sliders/inputs in Studio and can be saved back to code
export const MyComp: React.FC = () => {
  const rotation = visualControl('rotation', 0);
  return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><h1 style={{rotate: `${rotation}deg`}}>Tweak me</h1></AbsoluteFill>;
};
```

## @remotion/studio-protocol

Create Element payloads and send them into Remotion Studio

Install: `npx remotion add @remotion/studio-protocol`
  ·  Runs in: **Tooling script**


| API | What it does | Doc |
|---|---|---|
| `createElementPayload()` | Create a versioned Element payload | [link](https://www.remotion.dev/docs/studio-protocol/create-element-payload) |
| `buildOpenInRemotionNewUrl()` | Build a URL that opens an Element on remotion.dev/new | [link](https://www.remotion.dev/docs/studio-protocol/build-open-in-remotion-new-url) |
| `setStudioDragData()` | Put an Element payload on a drag event | [link](https://www.remotion.dev/docs/studio-protocol/set-studio-drag-data) |
| `installInStudio()` | Request installation into the active Studio | [link](https://www.remotion.dev/docs/studio-protocol/install-in-studio) |
| `addElementLibraryToStudio()` | Add an Element Library to a Studio project | [link](https://www.remotion.dev/docs/studio-protocol/add-element-library-to-studio) |
| `isInsideStudio()` | Check whether a library is embedded in Studio | [link](https://www.remotion.dev/docs/studio-protocol/is-inside-studio) |

Also exported but not in the docs table: `staticFileRef`.

**Example — `payload.ts`**

```ts
import {createElementPayload, staticFileRef} from '@remotion/studio-protocol';
export const payload = createElementPayload({
  displayName: 'FinHub Lower Third', slug: 'finhub-lower-third',
  sourceCode: "import {Img} from 'remotion';\nexport const LowerThird = ({logoSrc}: {logoSrc: string}) => <Img src={logoSrc} />;\n",
  dependencies: [{name: '@remotion/google-fonts', version: null}],
  dimensions: {width: 900, height: 260}, durationInFrames: 90,
  initialProps: {logoSrc: staticFileRef('lower-third/logo.png')},
  assets: [{path: 'lower-third/logo.png', type: 'url', url: 'https://example.com/logo.png'}],
});
```

## @remotion/tailwind

Bundler override for using TailwindCSS v3

Install: `npx remotion add @remotion/tailwind`
  ·  Runs in: **remotion.config.ts**


| API | What it does | Doc |
|---|---|---|
| `enableTailwind()` | Override the bundler config to enable TailwindCSS | [link](https://www.remotion.dev/docs/tailwind/enable-tailwind) |

**Example — `remotion.config.ts`**

```ts
import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind';
Config.overrideWebpackConfig((c) => enableTailwind(c));
```

## @remotion/tailwind-v4

Bundler override for using TailwindCSS v4

Install: `npx remotion add @remotion/tailwind-v4`


| API | What it does | Doc |
|---|---|---|
| `enableTailwind()` | Override the bundler config to enable TailwindCSS | [link](https://www.remotion.dev/docs/tailwind-v4/enable-tailwind) |

**Example — `remotion.config.ts`**

```ts
import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind-v4';
Config.overrideWebpackConfig((c) => enableTailwind(c));
```

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill} from 'remotion';
import './index.css'; // contains: @import "tailwindcss";
export const MyComp: React.FC = () => (
  <AbsoluteFill className="items-center justify-center bg-slate-900"><h1 className="text-8xl font-bold text-white">Tailwind v4</h1></AbsoluteFill>
);
```

## @remotion/three

Create 3D videos using React Three Fiber

Install: `npx remotion add @remotion/three`


| API | What it does | Doc |
|---|---|---|
| `<ThreeCanvas>` | A wrapper for React Three Fiber' Canvas | [link](https://www.remotion.dev/docs/three-canvas) |
| `<ThreeWebGPUCanvas>` | Use Three.js with the WebGPU renderer | [link](https://www.remotion.dev/docs/three-webgpu-canvas) |
| `useVideoTexture(` | Use a video in React Three Fiber | [link](https://www.remotion.dev/docs/use-video-texture) |
| `useOffthreadVideoTexture()` | Use an <OffthreadVideo> in React Three Fiber | [link](https://www.remotion.dev/docs/use-offthread-video-texture) |

Subpath imports: `@remotion/three/webgpu` → `ThreeWebGPUCanvas`

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
export const MyComp: React.FC = () => {
  const {width, height} = useVideoConfig();
  const rot = interpolate(useCurrentFrame(), [0, 150], [0, Math.PI * 2]);
  return (
    <AbsoluteFill style={{backgroundColor: '#0B1F3A'}}>
      <ThreeCanvas width={width} height={height}>
        <ambientLight intensity={1.5} /><pointLight position={[10, 10, 10]} />
        <mesh rotation={[rot, rot, 0]}><boxGeometry args={[2, 2, 2]} /><meshStandardMaterial color="#F5B400" /></mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
```

## @remotion/transitions

Transition between scenes

Install: `npx remotion add @remotion/transitions`


| API | What it does | Doc |
|---|---|---|
| **Components** | | |
| `<TransitionSeries>` | A `<Series>` with transitions inbetween | [link](https://www.remotion.dev/docs/transitions/transitionseries) |
| **Timings** | | |
| `springTiming()` | Transition with a `spring()` | [link](https://www.remotion.dev/docs/transitions/timings/springtiming) |
| `linearTiming()` | Transition linearly with optional Easing | [link](https://www.remotion.dev/docs/transitions/timings/lineartiming) |
| `Custom timings` | Implement your own timing | [link](https://www.remotion.dev/docs/transitions/timings/custom) |
| **Presentations** | | |
| `Overview` | List of available presentations | [link](https://www.remotion.dev/docs/transitions/presentations) |
| `Custom presentations` | Implement your own effect | [link](https://www.remotion.dev/docs/transitions/presentations/custom) |
| `fade()` | Animate the opacity of the scenes | [link](https://www.remotion.dev/docs/transitions/presentations/fade) |
| `pushCut()` | Punch into a hard cut with a brief flash | [link](https://www.remotion.dev/docs/transitions/presentations/push-cut) |
| `slide()` | Slide in and push out the previous scene | [link](https://www.remotion.dev/docs/transitions/presentations/slide) |
| `wipe()` | Slide over the previous scene | [link](https://www.remotion.dev/docs/transitions/presentations/wipe) |
| `flip()` | Rotate the previous scene | [link](https://www.remotion.dev/docs/transitions/presentations/flip) |
| `clockWipe()` | Reveal the new scene in a circular movement | [link](https://www.remotion.dev/docs/transitions/presentations/clock-wipe) |
| `iris()` | Reveal the scene through a circular mask from center | [link](https://www.remotion.dev/docs/transitions/presentations/iris) |
| `zoomBlur()` | Zoom and rotate scenes with a radial blur | [link](https://www.remotion.dev/docs/transitions/presentations/zoom-blur) |
| `dreamyZoom()` | Zoom through a white flash with gentle rotation | [link](https://www.remotion.dev/docs/transitions/presentations/dreamy-zoom) |
| `filmBurn()` | Burn through scenes with procedural glow and blur | [link](https://www.remotion.dev/docs/transitions/presentations/film-burn) |
| `linearBlur()` | Blend scenes with a directional multi-sample blur | [link](https://www.remotion.dev/docs/transitions/presentations/linear-blur) |
| `bookFlip()` | Turn the scenes like a shaded book page | [link](https://www.remotion.dev/docs/transitions/presentations/book-flip) |
| `zoomInOut()` | Zoom one scene in, crossfade, zoom the next out | [link](https://www.remotion.dev/docs/transitions/presentations/zoom-in-out) |
| `dissolve()` | Burn through the previous scene with a glowing edge | [link](https://www.remotion.dev/docs/transitions/presentations/dissolve) |
| `ripple()` | Ripple the outgoing scene with a sinusoidal wave | [link](https://www.remotion.dev/docs/transitions/presentations/ripple) |
| `crosswarp()` | Warp both scenes across the x-axis and blend them | [link](https://www.remotion.dev/docs/transitions/presentations/crosswarp) |
| `crossZoom()` | Zoom both scenes through a moving center and blur | [link](https://www.remotion.dev/docs/transitions/presentations/cross-zoom) |
| `swap()` | Swap scenes with perspective and reflections | [link](https://www.remotion.dev/docs/transitions/presentations/swap) |
| `blurSlide()` | Whip both scenes sideways with a motion blur | [link](https://www.remotion.dev/docs/transitions/presentations/blur-slide) |
| `cube()` | Rotate both scenes with 3D perspective | [link](https://www.remotion.dev/docs/transitions/presentations/cube) |
| `none()` | Have no visual effect. | [link](https://www.remotion.dev/docs/transitions/presentations/none) |
| `Audio transitions` | Add a sound effect to a transition | [link](https://www.remotion.dev/docs/transitions/audio-transitions) |

⚠ Documented on the docs site but **not exported by v4.0.529** (newer release or renamed): `cube()`.

Also exported but not in the docs table: `makeHtmlInCanvasPresentation`, `useTransitionProgress`.

Subpath imports: `@remotion/transitions/fade` → `fade`; `@remotion/transitions/slide` → `slide`; `@remotion/transitions/wipe` → `wipe`; `@remotion/transitions/flip` → `flip`; `@remotion/transitions/clock-wipe` → `clockWipe`; `@remotion/transitions/book-flip` → `bookFlip`, `bookFlipShader`; `@remotion/transitions/zoom-blur` → `zoomBlur`, `zoomBlurShader`; `@remotion/transitions/dreamy-zoom` → `dreamyZoom`, `dreamyZoomShader`; `@remotion/transitions/film-burn` → `filmBurn`, `filmBurnShader`; `@remotion/transitions/linear-blur` → `linearBlur`, `linearBlurShader`; `@remotion/transitions/zoom-in-out` → `zoomInOut`, `zoomInOutShader`; `@remotion/transitions/none` → `none`; `@remotion/transitions/iris` → `iris`; `@remotion/transitions/dissolve` → `dissolve`, `dissolveShader`; `@remotion/transitions/ripple` → `ripple`, `rippleShader`; `@remotion/transitions/crosswarp` → `crosswarp`, `crosswarpShader`; `@remotion/transitions/cross-zoom` → `crossZoom`, `crossZoomShader`; `@remotion/transitions/swap` → `swap`, `swapShader`; `@remotion/transitions/push-cut` → `pushCut`; `@remotion/transitions/blur-slide` → `blurSlide`, `blurSlideShader`

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {AbsoluteFill} from 'remotion';
const Scene: React.FC<{c: string; t: string}> = ({c, t}) => (
  <AbsoluteFill style={{backgroundColor: c, justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 100}}>{t}</AbsoluteFill>
);
// Total = 60 + 60 + 60 - 15 - 20 = 145 frames (transitions overlap scenes)
export const MyComp: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#0B1F3A" t="Hook" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#1C4E80" t="Point" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={springTiming({config: {damping: 200}, durationInFrames: 20})} />
    <TransitionSeries.Sequence durationInFrames={60}><Scene c="#F5B400" t="CTA" /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe()} timing={linearTiming({durationInFrames: 10})} />
    <TransitionSeries.Sequence durationInFrames={30}><Scene c="#000" t="End" /></TransitionSeries.Sequence>
  </TransitionSeries>
);
```

## @remotion/vercel

Render videos on Vercel Sandbox

Install: `npx remotion add @remotion/vercel`
  ·  Runs in: **Node/Bun script**


| API | What it does | Doc |
|---|---|---|
| `createSandbox()` | Create a sandbox with Remotion installed | [link](https://www.remotion.dev/docs/vercel/create-sandbox) |
| `addBundleToSandbox()` | Copy a Remotion bundle into a sandbox | [link](https://www.remotion.dev/docs/vercel/add-bundle-to-sandbox) |
| `renderMediaOnVercel()` | Render a video in a sandbox | [link](https://www.remotion.dev/docs/vercel/render-media-on-vercel) |
| `getRenderProgress()` | Poll a detached sandbox render | [link](https://www.remotion.dev/docs/vercel/get-render-progress) |
| `renderStillOnVercel()` | Render a still image in a sandbox | [link](https://www.remotion.dev/docs/vercel/render-still-on-vercel) |
| `uploadToVercelBlob()` | Upload a file from the sandbox to Vercel Blob | [link](https://www.remotion.dev/docs/vercel/upload-to-vercel-blob) |
| `Types` | TypeScript types reference | [link](https://www.remotion.dev/docs/vercel/types) |

**Example — `render.ts`**

```ts
import {addBundleToSandbox, createSandbox, renderMediaOnVercel, uploadToVercelBlob} from '@remotion/vercel';
const sandbox = await createSandbox();
await addBundleToSandbox({sandbox, bundleDir: './build'}); // from `npx remotion bundle`
const {sandboxFilePath} = await renderMediaOnVercel({sandbox, compositionId: 'MyComp', inputProps: {title: 'From Vercel'},
  onProgress: async (u) => console.log(Math.round(u.overallProgress * 100))});
export const uploaded = await uploadToVercelBlob({sandbox, sandboxFilePath, blobPath: 'renders/MyComp.mp4',
  contentType: 'video/mp4', blobToken: process.env.BLOB_READ_WRITE_TOKEN!, access: 'public'});
```

## @remotion/video-matting

Separate video into base and foreground layers

Install: `npx remotion add @remotion/video-matting`
  ·  Runs in: **Browser app code**


| API | What it does | Doc |
|---|---|---|
| `canUseVideoMatting()` | Check whether a model is supported | [link](https://www.remotion.dev/docs/video-matting/can-use-video-matting) |
| `getAvailableModels()` | List models and their download sizes | [link](https://www.remotion.dev/docs/video-matting/get-available-models) |
| `isVideoMattingModelCached()` | Check whether a model is downloaded | [link](https://www.remotion.dev/docs/video-matting/is-video-matting-model-cached) |
| `downloadVideoMattingModel()` | Download a model | [link](https://www.remotion.dev/docs/video-matting/download-video-matting-model) |
| `loadVideoMattingModel()` | Initialize a downloaded model | [link](https://www.remotion.dev/docs/video-matting/load-video-matting-model) |
| `removeVideoMattingModel()` | Remove a model from the browser cache | [link](https://www.remotion.dev/docs/video-matting/remove-video-matting-model) |
| `separateVideoLayers()` | Create base and foreground WebM layers | [link](https://www.remotion.dev/docs/video-matting/separate-video-layers) |
| `disposeVideoMattingModel()` | Release model memory | [link](https://www.remotion.dev/docs/video-matting/dispose-video-matting-model) |

Also exported but not in the docs table: `VideoMattingUnsupportedReason`.

**Example — `separate.ts`**

```ts
import {canUseVideoMatting, downloadVideoMattingModel, separateVideoLayers} from '@remotion/video-matting';
// Browser: split a talking head into base + foreground so text can sit "behind" the speaker
export const separate = async (file: File) => {
  const can = await canUseVideoMatting();
  if (!can.supported) throw new Error('Video matting unsupported here');
  const model = 'modnet' as const; // or 'ben2-base' — see getAvailableModels()
  await downloadVideoMattingModel({model});
  const result = await separateVideoLayers({src: file, model, onProgress: (p) => console.log(p)});
  return {base: await result.base.getBlob(), foreground: await result.foreground.getBlob()};
};
```

## @remotion/webcodecs

Converting media using WebCodecs

Install: `npx remotion add @remotion/webcodecs`
  ·  Runs in: **Browser app code**


| API | What it does | Doc |
|---|---|---|
| `Convert a video` | from one format to another | [link](https://www.remotion.dev/docs/webcodecs/convert-a-video) |
| `Rotate a video` | Fix bad orientation | [link](https://www.remotion.dev/docs/webcodecs/rotate-a-video) |
| `Track Transformation` | Copy, re-encode or drop tracks | [link](https://www.remotion.dev/docs/webcodecs/track-transformation) |
| `Pause, resume and abort conversion` | Steer the conversion process | [link](https://www.remotion.dev/docs/webcodecs/pause-resume-abort) |
| `Fix a MediaRecorder video` | Fix missing video duration and poor seeking performance | [link](https://www.remotion.dev/docs/webcodecs/fix-mediarecorder-video) |
| `Resample audio to 16kHz` | Resample an audio track to 16kHz for use with Whisper | [link](https://www.remotion.dev/docs/webcodecs/resample-audio-16khz) |
| `convertMedia()` | Converts a video using WebCodecs and Media Parser | [link](https://www.remotion.dev/docs/webcodecs/convert-media) |
| `getAvailableContainers()` | Get a list of containers `@remotion/webcodecs` supports. | [link](https://www.remotion.dev/docs/webcodecs/get-available-containers) |
| `webcodecsController()` | Pause, resume and abort the conversion. | [link](https://www.remotion.dev/docs/webcodecs/webcodecs-controller) |
| `canReencodeVideoTrack()` | Determine if a video track can be re-encoded | [link](https://www.remotion.dev/docs/webcodecs/can-reencode-video-track) |
| `canReencodeAudioTrack()` | Determine if a audio track can be re-encoded | [link](https://www.remotion.dev/docs/webcodecs/can-reencode-audio-track) |
| `canCopyVideoTrack()` | Determine if a video track can be copied without re-encoding | [link](https://www.remotion.dev/docs/webcodecs/can-copy-video-track) |
| `canCopyAudioTrack()` | Determine if a audio track can be copied without re-encoding | [link](https://www.remotion.dev/docs/webcodecs/can-copy-audio-track) |
| `getDefaultAudioCodec()` | Gets the default audio codec for a container if no other audio codec is specified. | [link](https://www.remotion.dev/docs/webcodecs/get-default-audio-codec) |
| `getDefaultVideoCodec()` | Gets the default video codec for a container if no other audio codec is specified. | [link](https://www.remotion.dev/docs/webcodecs/get-default-video-codec) |
| `defaultOnAudioTrackHandler()` | The default track transformation function for audio tracks. | [link](https://www.remotion.dev/docs/webcodecs/default-on-audio-track-handler) |
| `defaultOnVideoTrackHandler()` | The default track transformation function for video tracks. | [link](https://www.remotion.dev/docs/webcodecs/default-on-video-track-handler) |
| `getAvailableAudioCodecs()` | Get the audio codecs that can fit in a container. | [link](https://www.remotion.dev/docs/webcodecs/get-available-audio-codecs) |
| `getAvailableVideoCodecs()` | Get the video codecs that can fit in a container. | [link](https://www.remotion.dev/docs/webcodecs/get-available-video-codecs) |
| `convertAudioData()` | Change the format or sample rate of an `AudioData` object. | [link](https://www.remotion.dev/docs/webcodecs/convert-audiodata) |
| `createAudioDecoder()` | Create an `AudioDecoder` object. | [link](https://www.remotion.dev/docs/webcodecs/create-audio-decoder) |
| `createVideoDecoder()` | Create a `VideoDecoder` object. | [link](https://www.remotion.dev/docs/webcodecs/create-video-decoder) |
| `extractFrames()` | Extract frames from a video at specific timestamps. | [link](https://www.remotion.dev/docs/webcodecs/extract-frames) |
| `getPartialAudioData()` | Extract audio data from a specific time window of a media file. | [link](https://www.remotion.dev/docs/webcodecs/get-partial-audio-data) |
| `rotateAndResizeVideoFrame()` | Rotate and resize a video frame. | [link](https://www.remotion.dev/docs/webcodecs/rotate-and-resize-video-frame) |
| `webFsWriter` | Writer that saves to browser file system using File System Access API. | [link](https://www.remotion.dev/docs/webcodecs/web-fs-writer) |
| `bufferWriter` | Writer that saves to an in-memory resizable ArrayBuffer. | [link](https://www.remotion.dev/docs/webcodecs/buffer-writer) |

Also exported but not in the docs table: `AudioUndecodableError`, `VideoUndecodableError`, `createAudioEncoder`, `createVideoEncoder`.

Subpath imports: `@remotion/webcodecs/web-fs` → `canUseWebFsWriter`, `webFsWriter`; `@remotion/webcodecs/buffer` → `bufferWriter`

**Example — `convert.ts`**

```ts
import {convertMedia} from '@remotion/webcodecs';
// Browser: re-encode without a server
export const toWebm = async (src: string) => {
  const result = await convertMedia({src, container: 'webm', onProgress: ({overallProgress}) => console.log(overallProgress)});
  return result.save();
};
```

## @remotion/whisper-webgpu

Transcribe audio in the browser using Whisper and WebGPU

Install: `npx remotion add @remotion/whisper-webgpu`
  ·  Runs in: **Browser app code**


| API | What it does | Doc |
|---|---|---|
| `canUseWhisperWebGpu()` | Check whether transcription is possible | [link](https://www.remotion.dev/docs/whisper-webgpu/can-use-whisper-webgpu) |
| `getAvailableModels()` | List models and their download sizes | [link](https://www.remotion.dev/docs/whisper-webgpu/get-available-models) |
| `clearStaleModels()` | Remove models discontinued by newer versions | [link](https://www.remotion.dev/docs/whisper-webgpu/clear-stale-models) |
| `isWhisperModelCached()` | Check whether a model is downloaded | [link](https://www.remotion.dev/docs/whisper-webgpu/is-whisper-model-cached) |
| `downloadWhisperModel()` | Download a model | [link](https://www.remotion.dev/docs/whisper-webgpu/download-whisper-model) |
| `loadWhisperModel()` | Initialize a downloaded model | [link](https://www.remotion.dev/docs/whisper-webgpu/load-whisper-model) |
| `disposeWhisperModel()` | Release model memory | [link](https://www.remotion.dev/docs/whisper-webgpu/dispose-whisper-model) |
| `removeWhisperModel()` | Remove a model from the persistent cache | [link](https://www.remotion.dev/docs/whisper-webgpu/remove-whisper-model) |
| `transcribe()` | Transcribe a waveform with word-level timestamps | [link](https://www.remotion.dev/docs/whisper-webgpu/transcribe) |
| `toCaptions()` | Convert a transcription to `@remotion/captions` | [link](https://www.remotion.dev/docs/whisper-webgpu/to-captions) |
| `resampleTo16Khz()` | Decode and resample browser audio | [link](https://www.remotion.dev/docs/whisper-webgpu/resample-to-16khz) |

Also exported but not in the docs table: `WHISPER_WEBGPU_MODELS`, `WHISPER_WEBGPU_SAMPLE_RATE`, `WhisperWebGpuUnsupportedReason`.

**Example — `MyComp.tsx`**

```tsx
import React, {useState} from 'react';
import {canUseWhisperWebGpu, downloadWhisperModel, resampleTo16Khz, toCaptions, transcribe} from '@remotion/whisper-webgpu';

// Browser-only (runs in your app / Studio UI, not inside a rendered frame)
export const Transcriber: React.FC = () => {
  const [out, setOut] = useState('');
  const run = async (file: File) => {
    const ok = await canUseWhisperWebGpu();
    if (!ok.supported) return setOut('WebGPU not available');
    await downloadWhisperModel({model: 'tiny.en'});
    const channelWaveform = await resampleTo16Khz({file});
    const result = await transcribe({channelWaveform, model: 'tiny.en'});
    setOut(JSON.stringify(toCaptions({whisperWebGpuOutput: result}).captions));
  };
  return <div><input type="file" onChange={(e) => e.target.files?.[0] && run(e.target.files[0])} /><pre>{out}</pre></div>;
};
```

## @remotion/zod-types

Zod types enabling Remotion Studio UI

Install: `npx remotion add @remotion/zod-types`


| API | What it does | Doc |
|---|---|---|
| `zColor()` | A Zod Type for colors | [link](https://www.remotion.dev/docs/zod-types/z-color) |
| `zTextarea()` | A Zod Type for multiple-line text in a textarea | [link](https://www.remotion.dev/docs/zod-types/z-textarea) |
| `zMatrix()` | A Zod Type for editing matrices | [link](https://www.remotion.dev/docs/zod-types/z-matrix) |

**Example — `MyComp.tsx`**

```tsx
import React from 'react';
import {z} from 'zod';
import {zColor, zTextarea} from '@remotion/zod-types';
import {AbsoluteFill} from 'remotion';
export const myCompSchema = z.object({headline: zTextarea(), accent: zColor()});
// Register: <Composition schema={myCompSchema} defaultProps={{headline: 'Hi', accent: '#F5B400'}} .../>
export const MyComp: React.FC<z.infer<typeof myCompSchema>> = ({headline, accent}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><h1 style={{color: accent, whiteSpace: 'pre-wrap'}}>{headline}</h1></AbsoluteFill>
);
```

## Not on the API overview page

`@remotion/effects` (GPU effects such as blur, vignette, LUT, chromatic aberration, applied via the `effects` prop on `<CanvasImage>` and friends — see https://www.remotion.dev/docs/effects), `@remotion/web-renderer` / client-side rendering (https://www.remotion.dev/docs/client-side-rendering), `@remotion/cli`, `@remotion/eslint-plugin`, `@remotion/timeline-utils` and the Mediabunny integration exist but are documented outside the API overview.

