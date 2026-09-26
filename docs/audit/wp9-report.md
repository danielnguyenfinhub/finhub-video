# WP9 — Token diet: report (26 September 2026, AEST)

Session start is down 75%: AGENTS.md went from 35,762 B to 8,594 B. The other 76% of it moved,
word for word except 7 cross-references, into `docs/agents/` topic files that are read only when a
task needs one. A full new talking-head video now reads about half the bytes it did (67,524 B against
131,710 B) because the 66 KB remocn catalog opens with a 1.8 KB index that tells the agent to grep
instead of reading on. Against the baseline's "without remocn" figure, a new-design video reads 2.7%
more (the index itself). Mode B is unchanged by WP9; its files grew 12.4% since the baseline through
WP1/WP2, not through this work. No code changed.

Baseline: `docs/audit/baseline.md` (WP0). Bytes are file sizes in the worktree (LF line endings).

## Bytes read

| Read | Baseline | After WP9 | Change |
|---|---|---|---|
| AGENTS.md | 35,762 | 8,594 | -76.0% |
| Session start (CLAUDE.md 331 + AGENTS.md) | 36,093 | 8,925 | -75.3% |
| Mode A edit: existing design or re-edit (editor `SKILL.md`, `landmines.md`, `edit-json.md`) | 131,710 (every pointer) / 65,728 (without remocn) | 25,631 | -80.5% / -61.0% |
| New design, the full new talking-head video (Mode A edit + design-space, design-architecture, toolkit, editing-principles, elements CATALOG, remocn index) | 131,710 / 65,728 | 67,524 | -48.7% / +2.7% |
| New design including session start | 167,803 / 101,821 | 76,449 | -54.4% / -24.9% |
| Mode B faceless (faceless-script, video-production-team, video-compliance-review, three agents) | 27,794 | 31,243 | +12.4% (from WP1/WP2 file growth; WP9 changes none of these files) |
| Mode B including session start | 63,887 (67,336 on main before WP9) | 40,168 | -37.1% (-40.3% against main before WP9) |
| Repo or tooling change (code-changes, project-structure, mortgage-reel) | was inside AGENTS.md | 7,738 | new list |
| remocn catalog index, read with `head -n 22` | whole file 65,982 | 1,796 | -97.3% |

The per-task lists are in the AGENTS.md table "Read list per task". The editor `SKILL.md` was not
edited: it says "read the one you need, when you need it" for its references and names only
`landmines.md` as a must-read before Step 1, which the Mode A list keeps.

## What moved where

| Old AGENTS.md section | Now |
|---|---|
| intro, How this repo is used (first paragraph), Commands, Work lean (ladder and checking), Language (intro, real Vietnamese, bilingual layout, voice-cloning consent), both harness triggers, Conventions (first six) | AGENTS.md core |
| Work lean, "For code changes" | `docs/agents/code-changes.md` (AGENTS.md points to it in Work lean) |
| Language: fonts, element fonts, stacked marks, speech-to-text, voiceover | `docs/agents/language.md` |
| Badges and logos, Lender logos, Emoji, Brand kit, Elements (`src/elements/`) | `docs/agents/brand-assets.md` |
| MortgageReel | `docs/agents/mortgage-reel.md` |
| Project structure, and the "split out of danielnguyenfinhub/remotion" paragraph | `docs/agents/project-structure.md` |
| Rendering environments without a GPU, What this sandbox can't do | `docs/agents/rendering-without-gpu.md` |
| Third-party API keys | `docs/agents/api-keys.md` |
| Skills, harness goals and change logs, ECC/ponytail note, re-vendoring skills, chat-skill zip | `docs/agents/skills-and-harnesses.md` |
| Elements (`.claude/elements/`, remocn) | `docs/agents/elements.md` |
| Starter templates | `docs/agents/starters.md` |
| Conventions: Mediabunny (two bullets), Remotion licence | `docs/agents/mediabunny-and-licence.md` |

CLAUDE.md is unchanged and still points to AGENTS.md.

## No rule lost

`node scripts/check-agents-split.mjs` splits the pre-split AGENTS.md (`d269e59:AGENTS.md`, origin/main
before this branch) into sentences of 40+ characters, normalises whitespace and NFC, and looks for each
in AGENTS.md plus `docs/agents/*.md`.

Result: 234/241 found verbatim; the other 7 are listed with reasons in `docs/audit/wp9-allowlist.txt`.
All 7 are cross-references reworded because the section they pointed to ("above", "below", "this file")
now lives in another file:

1. language.md, Google Fonts sentence: "(see below)" now links `rendering-without-gpu.md`.
2. brand-assets.md, `BilingualCaption`: "following "Language" above" now "in AGENTS.md".
3–5. project-structure.md, `public/badges/`, `public/lenders/`, `public/emoji/`: "above" now links `brand-assets.md`.
6. project-structure.md, `.claude/elements/`: "(see "Elements" below)" now links `elements.md`.
7. skills-and-harnesses.md, ECC/ponytail note: "this file" now "AGENTS.md, these docs".

No sentence was removed as a duplicate. Output:

```
sentences found verbatim: 234/241, allowlisted: 7
agents split ok
```

The same script checks every relative markdown link in AGENTS.md and `docs/agents/*.md`; all resolve.
`node --check scripts/check-agents-split.mjs` passes. Vietnamese text was copied byte for byte and every
touched file is NFC.

## Inbound links

`grep -rn "AGENTS.md"` over md, mjs, py and ts files found these references to moved sections:

- Updated: `.claude/PONYTAIL.md` (code-change rules now in `docs/agents/code-changes.md`) and `README.md`
  (known pitfalls now in `docs/agents/rendering-without-gpu.md`).
- Left as they are, because the brief forbids touching them, and routed instead: code comments in
  `scripts/generate-sample-media.mjs`, `scripts/renderer-apis.mjs`, `scripts/voice-video.mjs`,
  `src/brand/*.tsx`, `src/brand/theme.ts`, `src/showcase/*.tsx`, `player-demo/main.tsx`;
  `.claude/agents/asset-refactorer.md` ("MortgageReel"); `.claude/skills/refactor-team/references/asset-contract.md`
  ("MortgageReel", "~line 113, Brand kit"). The AGENTS.md table "Where to read" lists every old section
  name with its new file, and says a comment "see <section> in AGENTS.md" means that file.
- Still valid: `.claude/agents/video-editor.md` reads "Work lean" and "Language", both in the core;
  `CLAUDE.md`, `.claude/ECC.md`, `docs/findings.md` and README line 233 refer to AGENTS.md as a whole.
