---
name: vietnamese-finance-video-editor
description: >-
  Edits Daniel's Vietnamese mortgage talking-head videos into branded, compliant
  Facebook/Reels videos where EVERY video gets its own design chosen from its
  content: cover concept, caption style, framing, infographic language,
  transitions, texture, sound and CTA, built from the full Remotion toolkit (3D,
  shaders, drawn paths, cut-outs, transitions, sfx) on a locked core (FinHub
  colours, fonts, logo, cuts, pacing, RG 234 guard, compliance card). ALWAYS use
  when Daniel says: edit my video, edit this video, edit my mortgage video, new
  talking-head video, make this video engaging, add captions to my video, subtitle
  my Vietnamese video, cut the pauses, I recorded a video about [topic], make it
  look different, new design for my video. Output: 1080p mp4, phone copy under 30
  MB, thumbnail, .srt, design-log entry, verify list. NOT for lender-policy videos
  with stock footage → finhub-policy-video. NOT for footage-free motion graphics →
  finhub-rate-alert-reel. NOT for only a logo/intro/outro → finhub-branded-reel.
---

# Vietnamese Finance Video Editor — locked core, new design every video

**User story:** Daniel drops a Vietnamese talking-head video about a mortgage topic and
gets back a finished, compliant video that looks like no previous one — designed from
what he says — plus a thumbnail and a short verify list. He makes no design decisions;
you are the editor AND the motion designer.

Project: this repository, `danielnguyenfinhub/finhub-video` (Remotion 4.0.527); on
Daniel's PC, the `finhub-video` folder GitHub Desktop cloned. Run every command from the
repository root. Composition
`MortgageReel` (1080×1920, 30 fps) = LOCKED CORE (`src/mortgage/`) + one DESIGN
(`src/designs/<id>/`) named by `"design"` in `public/videos/<slug>/edit.json`.

References (read the one you need, when you need it):
- `references/design-architecture.md` — core/design contract; the one-time bootstrap
- `references/design-space.md` — the 8 design axes, directions, signature moments
- `references/toolkit.md` — every installed Remotion package: when it earns its place
- `references/edit-json.md` — every edit.json field
- `references/editing-principles.md` — craft: hooks, pacing, keyword highlighting
- `references/landmines.md` — failures already hit once; read before Step 1

## Iron rules (bridges — cliffs both sides)

> ⚑ IRON RULE: Never change Daniel's meaning. Cut noise (silence, fillers, false starts,
> repeated takes); never cut or reword a claim, a number or a disclaimer. Unsure → keep it.

> ⚑ IRON RULE: Check the maths of every number Daniel says before it goes on screen. A
> wrong figure is flagged to Daniel with its timestamp and never shown; he chooses
> re-record or cut (`remove`).

> ⚑ IRON RULE: The core is locked. Never edit `src/mortgage/` or `src/brand/theme.ts`
> to make one video look different. The compliance card (Finance Hub & Networks Pty Ltd,
> ACN 644 141 613, ACL 573164; "Daniel Nguyen (Credit Representative 369168) is
> authorised under Australian Credit Licence 573164."; the full-situation disclaimer EN +
> VI) is the last 5 seconds of every video, unchanged. Extend the core only for a
> reusable need, and prove it with a regression render of a previous video.

> ⚑ IRON RULE: Colours come only from `src/brand/theme.ts` tokens (navy #0B1F3D, blue
> #0064A8, amber #F5A524, highlight #FFB938; good/bad only to mean good/bad). Tints and
> gradients of those tokens are fine; a new hue is not. Every font must render every
> Vietnamese diacritic (Be Vietnam Pro is the default). The logo always sits on white.

> ⚑ IRON RULE: Every on-screen string — edit.json copy AND text hard-coded in a design —
> passes the RG 234 guard at render time; a design lists its hard-coded strings in its
> exported `copy`. Never add an exemption just to make the render pass.

> ⚑ IRON RULE: No advertised interest rate without `compliance.advertisedRate` (rate,
> comparison rate, as-at date). Tax talk (deductions, prepaid interest, negative
> gearing) → the compliance card carries the "not tax advice" note.

Daniel's spoken words are not scanned: list any RG 234 watch-words (tốt nhất, rẻ nhất,
miễn phí, đảm bảo …) in the verify list — never silently cut them.

## Design rules (open field — the why, then your taste)

- **Variety is the product.** Daniel's audience must never feel a template. Read the
  design log (`python .claude/skills/vietnamese-finance-video-editor/scripts/main.py log`). The new design differs from each of the
  last 3 videos on ≥ 4 of the 8 axes and never repeats the previous video's cover
  concept or caption style (`python .claude/skills/vietnamese-finance-video-editor/scripts/main.py check <axes.json>` proves it).
- **Content decides the direction**, not habit (decision tree below).
- **Use the toolkit generously, but every effect earns its place**: it makes the point
  clearer, or it holds attention at a retention moment (the hook, a number, a topic
  change, the conclusion). Decoration that covers Daniel's face for > ~3 s is a defect.
- **Reuse before building**: remix an existing design in `src/designs/`, or lift a scene
  idea from the starter projects (`my-three`, `my-skia`, `my-audiogram`, `my-code-hike`,
  `my-tiktok`, `my-prompt-to-motion-graphics`, `my-music-visualization`, `my-overlay`)
  in `danielnguyenfinhub/remotion` (version 1, cloned next to this repo as `../remotion`),
  mapping every colour to theme tokens.
- **Verify at source**: before using a package API, read its types in
  `node_modules/@remotion/<pkg>`; never write a prop from memory.

## Decision Tree — content → direction

```
IF src/designs/ does not exist
  → run the one-time bootstrap (references/design-architecture.md) first
IF Daniel asks for a previous video's look ("like the 4.1 tỷ đô one")
  → reuse that design; log reused: true; skip the variety check
ELSE pick the lead direction from the talk:
  number-heavy (costs, comparisons, repayments)   → DATA-LED
  explains a concept or mechanism                  → EXPLAINER (whiteboard / hand-drawn)
  a process with steps                             → ROADMAP
  warns, or busts a myth                           → ALERT (newsroom, strike-throughs)
  reacts to news (RBA, lender policy)              → BROADCAST (lower-thirds, ticker)
  tells a (synthetic) scenario story               → CINEMATIC
  none clearly                                     → the direction least used in the log
Mixed talks: one direction leads; borrow single scenes from a second.
IF the chosen direction was used by the previous video
  → change direction, or change ≥ 5 axes inside it
```

Directions and their axis options: `references/design-space.md`.

## Workflow

Before each step state what you will do, what you expect, and what you do if it differs.

**Step 0 — Reason first.** State the video file, slug (kebab-case ASCII), topic in one
line, new or re-edit. Read `references/landmines.md` and the design log. Run
`git status` in the repo: if uncommitted work exists, say so before touching anything
(GitHub Desktop stashes uncommitted work on every pull or branch switch).

**Step 1 — Prep.** `python scripts/prep-video.py "<video>" <slug>` from the repository root, in the
background (faster-whisper large-v3 on CPU takes minutes). It writes the short-GOP proxy
`source.mp4`, `words.json`, a pace table and a skeleton `edit.json`. Check the source
aspect ratio: a non-9:16 source is cover-cropped; confirm the face stays in frame.

**Step 2 — Understand the talk.** One paragraph: problem, example, conclusion. Mark the
hook sentence, topic changes, every number (maths-checked), false starts, misheard words
(context-bound fixes, never audio cuts), RG 234 watch-words, tax talk.

**Step 3 — Design brief** (write it into edit.json `notes`): the direction and why; the
8 axes filled in; `python .claude/skills/vietnamese-finance-video-editor/scripts/main.py check` output showing the axes that differ from
the last 3 videos; the 3–6 signature moments (hook, key number, turn, conclusion) and the
exact effect at each.

**Step 4 — Build.** A new `src/designs/<id>/` (or a remix) implementing the `Design`
contract; register it (one line in `src/designs/index.ts`); set `"design"` in edit.json;
time every beat from `words.json` `startMs`. Keep each design file under ~400 lines.

**Step 5 — Preview.** `npx remotion compositions src/index.ts --props='{"slug":"<slug>"}'`
(schema + RG 234), then stills (`--gl=angle --scale=0.4`) at the cover, every signature
moment, the CTA and the compliance card; tile them and LOOK, next to the previous
video's thumbnail. Fix clipped text, overlaps (banner vs card), face covered > 3 s, and
anything that reads like the last video.

**Step 6 — Render and log.** `python scripts/render-video.py <slug>`. Verify duration,
audio, and re-transcribe ~15 s around each cut (take the window from the TALK, not the
end cards — Whisper invents "cảm ơn các bạn đã theo dõi" on silence). Then
`python .claude/skills/vietnamese-finance-video-editor/scripts/main.py add <entry.json>`. Send Daniel the phone copy + thumbnail.

## Self-Correction Loop (before delivering)

1. Would Daniel say "this looks like the last one"? → change at least one more axis.
2. Does every effect sit on a signature moment or make a point clearer? → cut the rest.
3. Any text clipped, overlapping, or on the face > 3 s? → fix, re-still.
4. Core, colours, fonts, logo, compliance card untouched? → prove it with `git diff --stat
   src/mortgage src/brand` (empty unless a reusable core change was agreed).
5. Did any automatic cut change a sentence? → read the auto-cut list against the words.

If confidence drops below "I'd stake my reputation on this" on any claim, number, cut or
compliance point: STOP. Name what is uncertain. Ask Daniel. A wrong financial edit is
worse than no edit.

## Output Contract

Report to Daniel in plain language, backed by this structure (`templates/output.md`):

```json
{
  "status": "success | partial | failed",
  "files": {"video": "out/videos/<slug>/<slug>.mp4", "mobile": "out/videos/<slug>/<slug>-mobile.mp4",
            "thumbnail": "out/videos/<slug>/thumbnail.png", "srt": "out/videos/<slug>/<slug>.srt"},
  "design": {"id": "string", "direction": "string", "axes": {"cover": "", "captions": "",
             "framing": "", "graphics": "", "transitions": "", "texture": "", "sound": "", "cta": ""},
             "differs_from": [{"slug": "string", "axes_changed": 0}], "reused": false},
  "cuts": [{"atMs": 0, "what": "string", "why": "string"}],
  "pacing": "0.9–1.2×",
  "verify": ["caption words unsure", "spoken RG 234 watch-words", "flagged numbers", "tax/accuracy points"],
  "next": "one step"
}
```

## Memory Management

- Design log: `public/videos/design-log.json`, read and written only through this
  skill's `scripts/main.py` (`log`, `check`, `add`); it is seeded with the first two videos.
- Read at Step 0, append at Step 6. A failure you hit that isn't in
  `references/landmines.md` → append it there in one line (symptom → cause → fix).

## Error Handling

| Error | Condition | Action |
|---|---|---|
| `edit.json is invalid` | zod path in the message | Fix that field; never loosen the schema |
| `RG 234: restricted terminology` | a string in edit.json or design `copy` | Rewrite the text; exemption only for a genuine definition, quote, negation or proper noun |
| `"design" … is not a design` | id not registered | Register it in `src/designs/index.ts` |
| Frame fetch timeout / 404 on source.mp4 | render from the phone original or missing proxy | Re-run prep; render only from `public/videos/<slug>/source.mp4` |
| Light leaks or 3D render black | WebGL without ANGLE | Use `render-video.py` (sets `--gl=angle`) |
| Files changed on disk mid-task | GitHub Desktop pull/checkout stashed your work | Stop; find the stash (`git stash list`), restore, tell Daniel |
| Check fails in `main.py check` | < 4 axes differ | Redesign; do not edit the log |

## Anti-Patterns

| Anti-pattern | Why it fails | Correct behaviour |
|---|---|---|
| Re-using the last design by habit | Viewers see a template; retention drops | Read the log; change ≥ 4 axes |
| Editing the core or theme for one video | The next video breaks; compliance drifts | Designs only; core changes need a regression render |
| Hard-coded text missing from `copy` | Escapes the RG 234 guard | List every string in `copy` |
| Effects stacked everywhere | Noise hides the message and the face | Effects at signature moments only |
| Colours copied from a starter project | Off-brand | Map each colour to a theme token |
| A font without Vietnamese diacritics | Broken captions | Verify the subset; default Be Vietnam Pro |
| Showing a misspoken number | A wrong figure in a financial ad | Flag with timestamp; cut or re-record |
| Fixed-size headline text | Long words run off the card | Size with `@remotion/layout-utils` `fitText` |
| Flat `captionFixes` swap for a word that is also correct elsewhere | Breaks the correct uses | Context-bound fix (neighbouring words) |
| Sending the 1080p file to the phone | Over 30 MB | Send the phone copy |

## Change log
- 24/09/2026 — v3.0.1: moved into `danielnguyenfinhub/finhub-video` (paths from the repo
  root; `main.py` finds the design log itself); the stutter-across-a-sentence-end fix is
  now in the core.
- 24/09/2026 — v3.0.0: new design every video (locked core + design layer, design log,
  variety check, content → direction tree, toolkit and design-space references,
  first-run bootstrap, landmines from the interest-in-advance edit).
- v2 — MortgageReel template workflow (edit.json only, one look).
