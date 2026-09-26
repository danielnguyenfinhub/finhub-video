# Asset contract

**Status: APPROVED by Daniel on 2026-09-26** (C6, with C4 and C5 folded in; TyDoReel retired;
C1 and C2 executed; C7 and C8 declined). The reader/writer map in
`out/refactor/01_auditor_report.md` is the source for the blast radius. Every later change to
this file goes in the approval log at the bottom.

## Why

One recording gets edited several times: on 2026-09-26 five slug folders (`ty-do`, `ty-do-box`,
`ty-do-explainer`, `bank-test`, `studio-preview`) each held the same 273 MB `source.mp4`, and
two held the same 307 MB `foreground.webm`. The recording belongs to the source video; the edit
belongs to the slug. Separate them and a new design of an old recording costs one `edit.json`,
not another 600 MB and a re-run of the matte (about 13× the video's length).

## Layout

```text
public/recordings/<recording-id>/     one per source video, git-ignored (Daniel's originals)
  source.mp4        the proxy prep-video.py makes (voice cleaned unless --no-clean)
  original.<ext>    the raw camera file, when kept (nothing in code writes it today)
  foreground.webm   the cut-out from matte.html (and its .part file while saving)
  words.json        word-level transcript: derived from the recording, so it lives with it;
                    the one file in this folder that stays tracked in Git, as transcripts are today

public/videos/<slug>/                 one per published edit, tracked
  edit.json         gains "source": "<recording-id>"; everything else unchanged
  edit.json.bak     written by the review server on save; git-ignored from now on
  script.json       faceless only
  voice/            faceless only, git-ignored

out/videos/<slug>/                    renders, unchanged
```

Recording id: kebab-case ASCII, chosen when the recording is prepared
(`prep-video.py "<file>" <slug> --recording <id>`, defaulting to the slug). Two slugs that edit
the same recording name the same id.

`prep-video.py` and an existing recording: if `public/recordings/<id>/source.mp4` already exists
and a video file was given, the script **stops** with a plain message naming the folder and every
slug whose `edit.json` points at it, and says how to proceed (`--recording <other-id>` for a new
take, or delete the folder to replace the recording for all of those edits). It never silently
reuses or silently overwrites. A new edit of an existing recording is
`prep-video.py <slug> --recording <id>` with no video file: it writes only the slug's `edit.json`.

## Resolver

- **TypeScript (compositions, review page, review server, Node scripts):** one import-free
  function in `src/mortgage/recording.ts`, `recordingPath(slug, source, file)`, returning
  `recordings/<source>/<file>`, or `videos/<slug>/<file>` when there is no `source`. `MortgageReel`
  wraps the result in `staticFile`; the review page, server and `.mjs` scripts prefix `public/`.
  `MortgageReel` fetches `videos/<slug>/edit.json` first, reads `source`, then resolves through it.
- **Python (`scripts/prep-video.py`, `scripts/render-video.py`):** the same rule once, in
  `scripts/recordings.py`. Two copies of the rule in the repo (TypeScript and Python), never a third.
- **Transition:** an `edit.json` without `source` resolves to `videos/<slug>/` exactly as today,
  so unmigrated and faceless videos keep rendering and the change can ship before the recordings
  move. Faceless slugs stay on this fallback for good: their synthetic source belongs to one slug.

**Every reader and writer the audit found** (all must go through the resolver):

| File | Does today | Change |
|---|---|---|
| `src/mortgage/MortgageReel.tsx` ~125–135, ~205–206 | fetches `videos/<slug>/{edit,words}.json`, HEADs and plays `foreground.webm`, plays `source.mp4` | resolve through `edit.json` → `source` |
| `src/mortgage/schema.ts` | validates `edit.json` | add optional `source` |
| `scripts/prep-video.py` | writes `source.mp4`, `words.json`, starter `edit.json` | write into the recording folder; `--recording <id>`; write `source` into `edit.json` |
| `scripts/render-video.py` | reads the slug folder, writes `out/videos/<slug>/` | resolve through `edit.json`; output unchanged |
| `review/server.ts` `listVideos` (~91) | lists a slug only if `source.mp4`, `words.json`, `edit.json` all sit in the slug folder | list by `edit.json`, resolve the rest through it |
| `review/server.ts` `saveForeground` (~127–158) | writes `foreground.webm.part` then `foreground.webm` into the slug folder | write into the recording folder |
| `review/main.tsx` ~61–62 | reads `words.json` per slug | through the resolver |
| `review/matte.ts` | reads `source.mp4` per slug for the cut-out | through the resolver |
| `scripts/export-srt.mjs`, `scripts/export-chapters.mjs`, `scripts/check-golden.mjs`, `scripts/check-caption-pages.mjs` | read `words.json` (and `edit.json`) per slug | through the resolver |
| `AGENTS.md` "MortgageReel", `.claude/skills/vietnamese-finance-video-editor/` file map, `README.md` | describe `public/videos/<slug>/source.mp4` | describe the new layout |

## Migration

`scripts/migrate-assets.py [--media-root <public/>] [--apply]`:

- Dry run (default) prints, per hash: size, the recording id it will use, every current path, the
  target path. Nothing is written.
- `--apply` hashes each file before and after the move, moves one copy per hash into
  `public/recordings/<id>/`, deletes only the duplicate copies whose hash it verified, writes
  `source` into each slug's `edit.json`, and is idempotent: a second run reports nothing to do.
- Its last step prints, and does not run, the untracking Daniel does next in the main checkout
  (C4): `git rm -r --cached public/videos/faceless-test/voice
  public/videos/ty-do-box/matting-test.mp4 public/videos/ty-do-explainer/edit.json.bak`. The
  files stay on disk; they only leave version control.
- It never runs inside an agent. Daniel runs it in the main checkout, dry run first.

`.gitignore` gains `/public/recordings/*/*` with the exception `!/public/recordings/*/words.json`
(so transcripts stay tracked and every other recording file is ignored), and
`/public/videos/*/*.bak` (`/.repowise/` is already there). The printed untracking step therefore
also includes `git add public/recordings/*/words.json` and the `git rm --cached` of the old
per-slug transcripts, so Git records the move rather than a deletion.

## Retired with this change (Daniel, 2026-09-26)

- **TyDoReel** (`src/tydo/`): the composition, motion, edit and its own copy of `words.json` go,
  and its `<Composition>` line leaves `src/Root.tsx`. Keep `useTyDoFont()`: it is the brand font
  loader that `src/brand/BrandOverlay.tsx` and `src/brand/BrandKitDemo.tsx` import, so move it into
  `src/brand/` and point it at `public/fonts/` (the same Be Vietnam Pro files `src/mortgage/style.ts`
  loads). `BrandOverlay.tsx:57` reads `brand/finhub-logo.png` instead of `ty-do/finhub-logo.png`.
- **`public/ty-do/`** (fonts, logo, seven sound effects) goes only after a hash check shows every
  file has an identical copy under `public/fonts/`, `public/sfx/` or `public/brand/`; any file
  without one is moved there first, and its callers updated. This is C5.
- Update `AGENTS.md` (~line 113, "Brand kit") and the `src/brand/theme.ts` comment that name
  `src/tydo/`. The `src/mortgage/style.ts` header comment may keep its history note.
- **Test-slug media (C1)** deleted on 2026-09-26 after a hash check: `bank-test/{source.mp4,
  foreground.webm}`, `studio-preview/source.mp4`, `iia-preview/source.mp4`. Their `edit.json` and
  `words.json` stay; once migrated they point at the `ty-do` and `interest-in-advance` recordings.

## Not in scope (decided 2026-09-26)

- **`out/` is not renamed to `outputs/`** (C8, declined).
- **Stock footage** (`voice/footage/pexels-*.mp4`, C7) stays where it is.

## Approval log

| Date | Decision | By |
|---|---|---|
| 2026-09-26 | Draft written from the brief and the first hash scan | Claude (refactor-team setup) |
| 2026-09-26 | Audit added the readers the draft missed (TyDoReel, `review/main.tsx`, `review/server.ts` list and save, three check scripts) | architecture-auditor |
| 2026-09-26 | Approved C1, C2, C6 with C4 and C5 inside; TyDoReel retired; C7 and C8 declined | Daniel |
| 2026-09-26 | Resolver: one shared TypeScript function plus one Python function accepted (fewer copies than the draft's wording); transcripts stay tracked in Git under Daniel's "no functionality lost" rule | Claude (orchestrator) |
| 2026-09-26 | Review round 1 (FIX): `prep-video.py` must stop, not silently reuse, when the recording exists and a file was given; no-file form creates a new edit of an existing recording | Claude (orchestrator), from quality-reviewer finding |
