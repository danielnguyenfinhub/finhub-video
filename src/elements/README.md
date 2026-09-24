# Elements

Reusable, checked building blocks for designs and one-off videos, each one file,
brand-coloured by default, Vietnamese-safe (letters keep their marks, line
heights leave room for them). Every element renders in the `ElementCatalog`
composition (Studio → "Elements"), which is how each was verified.

| Element | What it does | Remotion APIs |
|---|---|---|
| `Typewriter` | types text out, blinking caret | `interpolate` |
| `LineReveal` | headline lines slide up out of clipped rows | `spring` |
| `StaggerTitle` | letters spring in one by one | `spring` |
| `NeonTitle` | neon flicker-on, then glow pulse | `random`, `spring` |
| `RgbSplitText` | glitch red/cyan channel split | `random` |
| `CountdownRing` | 5…4…3 countdown with emptying ring | `spring` |
| `SlashIntro` | diagonal split title card | `spring`, CSS `clip-path` |
| `KenBurns` | pan-and-zoom over a still | `Img`, `interpolate` |
| `TiltFrame` | 2.5D camera swing around any content | `spring`, CSS 3D |
| `FocusCrop` | reframes wide footage to 9:16 following the subject | `OffthreadVideo`, `interpolate` |
| `BeforeAfter` | sweeping split between two layers (e.g. graded vs not) | CSS `clip-path` |
| `TextMatte` | content shows through big letters | blend modes |
| `VideoGrid` | up to 9 clips in a grid with name tags | `OffthreadVideo` |
| `NewsTicker` | seamless scrolling ticker | `@remotion/layout-utils` `measureText`, `useDelayRender` |
| `SocialHandle` | "follow us" pill with the logo | `Img`, `spring` |
| `ProgressBar` | reels-style progress bar | `useVideoConfig` |
| `ReviewStamp` | "draft" watermark + burnt-in timecode for review copies | `useCurrentFrame` |
| `Particles` | seeded drifting particles | `random` |
| `PulseBadge` | badge that pulses every N frames | `Loop` |
| `AudioRing` | frequency ring around a logo/face | `@remotion/media-utils` `useAudioData`, `visualizeAudio` |
| `NoiseField` | breathing dot-grid background | `@remotion/noise` `noise3D` |
| `starWipe` | custom transition presentation: next scene grows from a star | `@remotion/transitions`, `@remotion/shapes` `makeStar`, `@remotion/paths` `translatePath` |

Script: `node scripts/export-chapters.mjs <slug>` prints a YouTube/Facebook
chapter list (timed on the rendered video) from `edit.json` chapters.

Adapted from snippets Daniel collected; each was fixed against Remotion
4.0.527 before landing here (e.g. text is measured only after the brand font
has loaded, at a weight that is loaded; clip paths avoid shared SVG ids;
sample text is RG 234-clean). Snippets not taken: editor UI (timeline,
gizmos, snapping), AWS/Lambda/server code, and ones that duplicate what
exists (captions, ducking, loudness, 3D, Lottie, grain/vignette via `look`).
