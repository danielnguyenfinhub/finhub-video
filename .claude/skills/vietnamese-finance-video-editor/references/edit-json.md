# edit.json — field reference (MortgageReel template)

## Contents

- Rules that apply to every field
- Top-level fields
- Cue types
- Compliance and exemptions
- Minimal example

Source of truth: `src/mortgage/schema.ts` (zod, strict — an unknown or misspelt key fails
the render with a readable error). Full worked example: `public/videos/ty-do/edit.json`.

## Rules that apply to every field

- All times are **source milliseconds** — positions in Daniel's original recording, taken from
  `words.json` `startMs`. The template remaps them through cuts and pacing; never compute output times.
- Every on-screen string (title, subtitle, hook, chapters, stats, every cue text, cta) is scanned
  against RG 234 before rendering. Captions (Daniel's speech) are not.
- `tone` is `"good"` (green), `"bad"` (red) or `"neutral"`.

## Top-level fields

| Field | Required | What it does |
|---|---|---|
| `design` | no | The look: a folder in `src/designs/` registered in `src/designs/index.ts` (default `"classic"`). An unknown name fails the render and lists the designs there are |
| `cut` | no | Automatic cuts, each on unless false: `{fillers?, stutters?, badWords?, words?: []}`. Restarts in different words still need `remove` |
| `music` | no | `{file: "music/<name>.mp3", volume?}` looped bed, auto-ducked under speech |
| `title` | yes | Cover headline and thumbnail text, Vietnamese, ≤ 8 words. Numbers and keyword-list words are auto-highlighted |
| `subtitle` | no | Cover chip. Default "Daniel Nguyen · Finance Hub" |
| `coverFrameMs` | no | Source ms of the frozen frame behind the cover. Pick a frame with Daniel's eyes open, facing camera |
| `notes` | no | Editor notes, never shown (why a span was cut, open questions) |
| `hook` | no | `{big, countTo?, decimals?, suffix?, sub?}` over the first ~3.5 s of talk. With `countTo` the number counts up (vi-VN comma decimal) then `suffix`, e.g. `{"big":"4,1 TỶ ĐÔ","countTo":4.1,"decimals":1,"suffix":"TỶ ĐÔ","sub":"Con số người Úc không ngờ tới"}` |
| `remove` | no | `[[fromMs,toMs], …]` spans to cut: false starts, repeated takes, a misspoken passage Daniel asked to drop. Silences and sentence-initial "thì" are cut automatically |
| `captionFixes` | no | `[{from,to}]` exact caption-token replacements for misheard words. Audio untouched. Built-in: lợi phí→lệ phí, tiền lợi→tiền lời, than chốt→then chốt, đắm→đóng |
| `keywords` | no | Extra words/phrases to highlight in captions (added to the finance default list) |
| `captionStyle` | no | Classic design only: `"outline"` (default, bold white words with an outline) or `"box"` (white rounded box hugging each line, spoken word in blue, keywords underlined). Pick `"box"` when the footage behind the captions is busy or bright |
| `pacing` | no | `{mode:"auto"|"off", target?, min?, max?, overrides?:[{fromMs,toMs,rate}]}`. Default auto: target 4.4 words/s, rate 0.9–1.2, pitch preserved |
| `chapters` | no | `[{atMs,title,effect}]`; `effect` ∈ fade, slide, wipe, flip, clockWipe, iris, pushCut, blurSlide, bookFlip, crossZoom, crosswarp, dissolve, dreamyZoom, filmBurn, linearBlur, ripple, swap, zoomBlur, zoomInOut (`TRANSITIONS` in `src/mortgage/timeline.ts`). From blurSlide on they need HTML-in-canvas (Chrome 149+, which Remotion's renderer downloads); an older Studio browser previews them as a fade. Lands on the nearest cut; shows a "PHẦN n" banner |
| `look` | no | Colour grade on the talking-head footage: `"warm"`, `"cinematic"` or `"mono"` (recipes in `LOOK_EFFECTS`, `src/mortgage/PacedVideo.tsx`). Left out, footage plays as recorded. Graded footage plays through `@remotion/media` `<Video>`; if that can't decode the file the render fails rather than ship it ungraded |
| `stats` | no | `[{atMs,durMs,big,label}]` stat cards at the top, e.g. `{"atMs":12900,"durMs":3000,"big":"~$400","label":"cho mỗi hộ gia đình"}` |
| `cues` | no | Infographics — see below |
| `cta` | no | `{question?}` on the contact card. Default "Bạn cần tư vấn về khoản vay?"; button text is fixed |
| `compliance` | no | See below |
| `exemptions` | no | See below |

## Cue types

Every cue has `kind`, `fromMs`, `toMs` (on screen between them) and inner beats with their own `atMs`.

| kind | Fields | Use when Daniel… |
|---|---|---|
| `kinetic` | `kicker?`, `struck:[{text,atMs,strikeMs}]`, `slam:{kicker?,text,atMs}`, `sub?:{text,atMs}` | says "not X, but Y" (X struck out, Y slams in) |
| `compare` | `cards:[card,card]` each `{title,atMs,highlightAtMs?,rows:[{label,value,tone,atMs}]}`, `vsAtMs?`, `question?:{text,atMs}` | contrasts two products/options |
| `bars` | `kicker?`, `title`, `bars:[{label,value,height 0..1,tone,atMs,overflow?}]` (1–3), `stamp?:{text,tone,atMs}` | compares amounts; `overflow` = bar breaks the chart top |
| `verdict` | `ok` (✓/✗), `text` | gives a clear yes/no conclusion |
| `venn` | `left`, `right`, `label` | talks about shared interest (e.g. Broker / Bạn → LỢI ÍCH CHUNG) |
| `emoji` | `name` (file in `public/emoji/`, no ".json"), `position?` right/left | reacts emotionally ("rất là lớn") — sparingly |
| `lenders` | `title?` | talks about banks/lenders (shows the accredited lender logos) |

Keep top-panel cues from overlapping each other and chapter banners in time.

Cues, stats and chapters are DATA: each design decides how to draw them (the classic
design draws the kinds above). A design needing per-video data the schema lacks either
hard-codes it (single-use design) or adds one optional reusable field to the core schema,
with a regression render.

## Compliance and exemptions

`compliance.taxNote` (added by the bootstrap): true whenever tax is discussed; adds
"General information only, not tax advice" (VI + EN) to the compliance card.

`compliance`: `{illustrativeNumbers? (default true — adds "examples are illustrative" to the
compliance card), conditionsNote? (adds the lender-criteria/fees note — use when a policy feature
or concession is described), advertisedRate?: {rateFigure, comparisonRate, ratesAsAt}}` — a rate
can appear only with all three; the card then adds the comparison-rate warning.

`exemptions`: `[{field, term, reason, note}]`, `reason` ∈ definition | quoted | negation |
third-party-name. `field` is the key printed in the RG 234 error (e.g. `cues[2]`). Promotional
phrases ("lãi suất tốt nhất") can only be cleared by `quoted` or `negation`. Write a real `note`;
it is the audit trail.

## Minimal example

```json
{
  "title": "Lãi suất cố định hay thả nổi?",
  "coverFrameMs": 4200,
  "hook": { "big": "2 LỰA CHỌN", "sub": "Chọn sao cho phù hợp với bạn" },
  "remove": [[61200, 64850]],
  "chapters": [{ "atMs": 30120, "title": "Lãi suất cố định", "effect": "slide" }],
  "stats": [{ "atMs": 15300, "durMs": 3000, "big": "3 NĂM", "label": "Kỳ hạn cố định phổ biến" }],
  "cues": [
    { "kind": "verdict", "fromMs": 88000, "toMs": 90000, "ok": true, "text": "PHÙ HỢP KHI THU NHẬP ỔN ĐỊNH" }
  ],
  "cta": { "question": "Bạn đang phân vân nên chọn loại lãi suất nào?" }
}
```
(Synthetic example — times are illustrative.)
