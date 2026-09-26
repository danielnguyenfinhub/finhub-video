# Project structure

Part of the project guide; [AGENTS.md](../../AGENTS.md) is the core and routes here.

## Where this repository came from

This repository was split out of `danielnguyenfinhub/remotion` (a fork of the Remotion monorepo, kept as version 1), where it lived as `my-video/`. Older notes such as `docs/findings.md` refer to that repository's `packages/...` source folders.

## Project structure

- `src/index.ts` — entry point, registers the root component
- `src/Root.tsx` — every `<Composition>` must be registered here
- `src/Composition.tsx` — the `MyComp` composition (1280×720 @ 30fps)
- `src/showcase/` — reference reels that exercise almost every installed `@remotion/*` package: `ShowcaseReel`, `ExtendedReel` and `FullReel` (both combined, plus every `@remotion/transitions` presentation and all 74 `@remotion/effects` effects, which are also registered alone as `EffectsCatalog`, then one scene each for `@remotion/web-renderer`, `@remotion/whisper-web`, `@remotion/svg-3d-engine` and `@remotion/maptiler`). Each scene is a worked example for its package, so search here before writing a new one. The scene-by-scene map is in `docs/findings.md`.
- `docs/findings.md` — verified behaviour of individual packages in this project and sandbox; read the part you need
- `scripts/renderer-apis.mjs` — the Node-side APIs that can't run in a scene (`@remotion/bundler`, `@remotion/renderer`, the offline Lambda/Cloud Run helpers and others), run for real: `node scripts/renderer-apis.mjs --browser-executable=… --gl=swangle`
- `player-demo/` — a standalone web page for `@remotion/player`'s `<Player>` and `<Thumbnail>`, which can't live inside a composition: `node player-demo/build.mjs [--serve]`; see its README
- `bundler-override.mjs` — the skia/tailwind bundler override, shared by `remotion.config.ts` and that script's `bundle()` call (the Node APIs don't read `remotion.config.ts`)
- `src/index.css` — Tailwind v4 is enabled (`@import "tailwindcss"`)
- `public/` — static assets, referenced with `staticFile()`: the showcase's sample media (regenerate with `node scripts/generate-sample-media.mjs`; `sample-clip.webm` is the VP9 copy for anything that decodes through WebCodecs), a font and a three.js typeface. What each file is for is in `docs/findings.md`.
- `public/badges/` — the owner's accreditation and award badges for real videos (see "Badges and logos" in [brand-assets.md](brand-assets.md))
- `public/lenders/` — logos of the lenders the owner is accredited with (see "Lender logos" in [brand-assets.md](brand-assets.md))
- `public/emoji/` — Noto animated emoji as Lottie JSON (see "Emoji" in [brand-assets.md](brand-assets.md)); `scripts/fetch-noto-emoji.mjs` adds more
- `.claude/elements/` — local copy of the [Remotion Elements](https://www.remotion.dev/elements/) gallery, plus the [remocn](https://remocn.dev) library in `remocn/`: drop-in components to copy into a scene (see [elements.md](elements.md))
- `out/`, `build/`, `node_modules/`, `remotion-video-skill.zip` — generated, never commit

