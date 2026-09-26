# Third-party API keys

Part of the project guide; [AGENTS.md](../../AGENTS.md) is the core and routes here.

## Third-party API keys (e.g. ElevenLabs voiceover)

`@remotion/elevenlabs` is a Speech-to-Text→`Caption[]` converter (`elevenLabsTranscriptToCaptions()`), not a text-to-speech package — don't confuse the two. `CaptionsScene` demonstrates the converter itself against a hand-built mock transcript (no network needed — the exact shape a real ElevenLabs STT call returns with `timestamps_granularity: "word"`), since this sandbox can't call ElevenLabs' API for a real one. For generating voiceover audio, `scripts/generate-voiceover.mjs` calls ElevenLabs' TTS REST API directly and writes MP3s to `public/voiceover/`, following the `voiceover.md` skill guide. Copy `.env.example` to `.env.local` and fill in `ELEVENLABS_API_KEY`, then run `node scripts/generate-voiceover.mjs`.

The API key is only ever read inside that standalone script, never inside a `.tsx` component: components get bundled for the browser, and Remotion's CLI exposes `.env`/`.env.local` to that bundle's `process.env` (see `env-variables.mdx`), so a key referenced from a component would ship inside the render output. This pre-generate-once-then-read-the-static-file pattern is how to wire up any other third-party API (image/video generation, other TTS providers, etc.) safely.

The one exception is MapTiler: its SDK draws the map in the browser, so `MapTilerScene` reads `REMOTION_MAPTILER_KEY` from `.env` inside the component, as Remotion's own map examples do. MapTiler keys are browser keys by design; use a dedicated free key, since a render has no origin to restrict it to.

Client-side rendering (`@remotion/web-renderer`, used in `WebRendererScene` and the player demo) always sends Remotion a telemetry ping per render: IP address, page domain, video or still, success or failure, never content. The free licence needs no `licenseKey`; pass `isProduction: false` for test renders.

