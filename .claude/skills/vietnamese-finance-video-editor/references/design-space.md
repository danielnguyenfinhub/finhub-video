# Design space — 8 axes, 6 directions

## The 8 axes (the design log records one value per axis)

| Axis | Example values (invent new ones freely) |
|---|---|
| cover | frozen-frame + big title · magazine cover · newspaper front page · big-number poster · 3D title · whiteboard sketch · split photo/graphic · ticket/receipt |
| captions | karaoke pill + stroke · word-pop · sentence lower-third · typewriter · marker highlight · sticker boxes · kinetic stacked words · handwritten |
| framing | full-frame zoom-cuts · cut-out over designed backdrop · split-screen · PiP bubble over full-screen graphics · circle/phone mask · letterbox cinematic |
| graphics | navy cards + stat panels · hand-drawn diagrams · path-drawn charts · 3D objects · lower-thirds + ticker · checklist/roadmap rail · sticky notes |
| transitions | light-leak flash + slide/wipe · book-flip + dissolve · push-cut + swap · film-burn + dreamy-zoom · iris + zoom-blur · ripple/crosswarp |
| texture | clean gradient · paper grain (noise) · film grain + leaks · studio glow (skia) · grid/blueprint pattern (effects) · none |
| sound | money-rain hook sfx + whooshes · pen/paper sfx · news stings + ticks · soft piano bed · minimal |
| cta | white card logo + contact list · handwritten sign-off · broadcast end-slate · business card flip · phone-screen mock |

"classic" (ty-do, interest-in-advance) = frozen-frame + big title · karaoke pill + stroke ·
full-frame zoom-cuts · navy cards + stat panels · light-leak flash + slide/wipe · clean
gradient · money-rain hook sfx + whooshes · white card logo + contact list.

## The 6 directions

- **DATA-LED** — numbers are the hero. Charts draw on (paths), count-ups, a 3D bar or
  coin stack for the biggest figure, a running "total" chip. Captions stay small so the
  numbers breathe.
- **EXPLAINER** — a teacher at a whiteboard. Daniel cut out over paper; diagrams build
  stroke by stroke as he says each part; rough-notation circles and arrows; typewriter
  or marker captions; book-flip between chapters; pen sounds.
- **ROADMAP** — a journey. A progress rail with numbered stops lights up per step;
  checklist ticks (lottie/shapes); push-cut transitions; a "you are here" marker.
- **ALERT** — a warning. Bold kinetic type, strike-throughs, red flags (bad token only
  for the warning), a "breaking" bar, hard cuts, short stings.
- **BROADCAST** — the news desk. Lower-thirds with Daniel's name, a ticker with the
  topic, split-screen with a headline card, swap transitions, end-slate CTA.
- **CINEMATIC** — a story. Letterbox, slow push-ins, film-burn and light leaks, chapter
  title cards, a soft music bed, quiet captions.

## Signature moments (plan 3–6 per video)

The hook (first 3 s), each key number, the turn ("but…", "not X but Y"), each chapter
change, the conclusion, the CTA. Put the big effects here; between them let Daniel talk
with captions and light motion only.

## Variety rule

Differs from each of the last 3 videos on ≥ 4 axes; never the previous video's cover or
captions value. `python .claude/skills/vietnamese-finance-video-editor/scripts/main.py check <axes.json>` enforces it.
