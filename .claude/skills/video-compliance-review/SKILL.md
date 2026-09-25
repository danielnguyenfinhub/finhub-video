---
name: video-compliance-review
description: >-
  Independent compliance review of a Finance Hub video — the script.json before voicing, or the
  finished render before Daniel posts it — against ASIC RG 234, NCCP s163/s164 (advertised
  rates), the Finance Hub compliance card and FinHub's no-client-data rule. Returns PASS, FIX
  or BLOCK with each finding tied to a scene or timestamp. Use whenever a video script or
  render needs a compliance check: "review this script", "is this video compliant", "check
  compliance before I post", "RG 234 check on the video", "compliance review again", "re-check
  after the fix". Used by the video-compliance-reviewer agent. NOT for loan files or BID
  evidence (finhub-bid-compliance-auditor), and NOT a replacement for the automatic guard in
  src/mortgage/compliance.ts, which still runs on every render.
---

# Video compliance review

The automatic guard (`src/mortgage/compliance.ts`) blocks a fixed list of phrases in on-screen
and narrated text, and blocks a rate in `edit.json` `compliance.advertisedRate` that lacks a
comparison rate. It cannot judge meaning, and it never sees a rate that is only spoken or
narrated. This review covers what it can't: a promise made without a banned word, advice
dressed as information, a wrong number, a rate with no comparison rate, an English line bolder
than the Vietnamese, client data, and words Daniel speaks. A wrong financial claim in an ad is
a licence risk for Finance Hub, so when in doubt, raise it: a false alarm costs Daniel a
minute, a miss can cost the licence.

Read the artefacts yourself. Work in the repository root.

## Checks

Apply each check to every text the stage names. "→ FIX" means the author rewrites; "→ BLOCK"
means the video must not proceed.

1. **Client data.** A person's name (other than Daniel Nguyen), an address, a loan or account
   number, or a real client's figures → BLOCK. In the finding, give the location and the
   category ("a person's name, scene 2"), never the value: the report is a log, and client
   data must not reach logs.
2. **Every number.** Trace each figure to the source document (the writer's notes give the
   line). Recompute any arithmetic. Untraceable or wrong → BLOCK. Rounded so the message
   changes → FIX. A date or "now/giờ" that puts a future change in the present → FIX.
3. **Promise without a banned word.** Read for meaning: "chắc chắn", "không bao giờ bị từ
   chối", "ai cũng vay được", "tiết kiệm ngay X đô", implied approval or implied savings →
   FIX with a rewrite.
4. **Advice vs information.** A recommendation aimed at the viewer's own situation ("bạn nên
   vay…", "đừng vay…", "if you pay over 6%, refinance now") → FIX. General statements are
   fine, including a generic "hãy" ("hãy xem lại khoản vay mỗi năm một lần").
5. **Advertised rate.** Any rate presented as available (a lender's rate, "từ X%") needs a
   comparison rate and an as-at date in the source document → otherwise BLOCK. If present,
   put all three values in `for_editor.advertisedRate` so they reach `edit.json`. A cash rate
   or a market average quoted as news is not an advertised rate.
6. **Tax and policy features.** Tax talk (deductions, negative gearing, prepaid interest) →
   `for_editor.taxNote: true`. An advertised policy feature or concession ("không cần tiết
   kiệm thật", fewer payslips) → `for_editor.conditionsNote: true`.
7. **Banks.** A named bank must not read as endorsing or sponsoring the video → FIX.
8. **English line.** Each `en` says no more than its `vi`: stronger wording, a dropped
   condition or a different number → FIX.
9. **Call to action.** Exactly one, offering contact, not an outcome ("Nhắn tin cho Finance
   Hub để được hỗ trợ" is fine; "…để được duyệt vay" is not) → FIX.
10. **Exemptions.** Every `exemptions` entry needs a genuine reason (quote, negation,
    definition, third-party name). One that exists only to get past the guard → BLOCK. At the
    final stage, any exemption that was not in the script-stage report is BLOCK until explained.

## Stage `script` (before any credits are spent)

Inputs: `public/videos/<slug>/script.json`, the source document (outside the repo or under
`out/`), `out/videos/<slug>/team/01_writer_notes.md`.

- Run `node scripts/voice-video.mjs <slug> --dry-run > out/videos/<slug>/team/guard-script.log 2>&1; echo "exit=$?"`.
  A non-zero exit is a BLOCK finding; quote the log's last lines.
- Apply checks 1–10 to the title, every `vi` and `en`, the post copy (title, caption,
  hashtags) and `exemptions`.

## Stage `final` (before Daniel posts)

Inputs: `public/videos/<slug>/edit.json`, `words.json`, the design in `src/designs/<id>/`,
`out/videos/<slug>/team/02_compliance_script.json` (faceless), `03_editor_report.json` and the
stills it lists.

1. **Automatic guard and schema.**
   `npx remotion compositions src/index.ts --props='{"slug":"<slug>"}' > out/videos/<slug>/team/guard-final.log 2>&1; echo "exit=$?"`.
   Non-zero → BLOCK; quote the log's last lines.
2. **Text on screen and narrated.** Apply checks 1–10 to everything in `edit.json` (subtitles,
   titles, stats, cues, CTA, `exemptions`) and to the design's hard-coded strings. Every
   hard-coded string must appear in the design's exported `copy` (grep the design folder for
   quoted text) → a missing one is FIX.
3. **Spoken words (talking-head).** Search `words.json` for the watch-words in
   `compliance.ts` (`PROMOTIONAL_VI`, `CONTEXT_VI`, `PROMOTIONAL_EN`, `CONTEXT_EN`), for
   check 3's promises, for client data (check 1) and for any spoken rate (check 5). Each hit
   goes in the report with its timestamp: FIX or BLOCK per the check, or a verify note if
   neutral ("không miễn phí"). Speech is never cut or reworded by you: Daniel decides.
4. **Compliance card.** Render your own still of the last second at full size:
   `npx remotion still src/index.ts MortgageReel out/videos/<slug>/team/card.png --props='{"slug":"<slug>"}' --frame=-1 --gl=angle`
   (`--frame=-1` is the last frame). It must show, unchanged: `Finance Hub & Networks Pty Ltd
   | ACN 644 141 613 | Australian Credit Licence 573164`, the credit representative line
   (369168), and the full-situation disclaimer in English and Vietnamese. Then decide from the
   script or `words.json`, not from the flags, whether the video talks tax or advertises a
   policy feature; if so the tax or conditions note must be on the card. Missing, cut off or
   unreadable → BLOCK. Still can't be rendered → BLOCK with the error.
5. **Advertised rate on screen.** Rate, comparison rate at equal prominence, and the as-at
   date, visible together in one still → otherwise BLOCK.
6. **Numbers on screen.** Each matches what's said (or the approved script) and the source →
   otherwise BLOCK.
7. **Core untouched.** `git status --porcelain -- src/mortgage src/brand` is empty and
   `git diff --stat $(git merge-base HEAD origin/main) -- src/mortgage src/brand` is empty, or
   the editor's report names an agreed core change → otherwise BLOCK.
8. **Legibility.** Compliance text or a condition that's clipped, covered or too small to read
   on the full-size still → FIX.

## Verdict

- **BLOCK** — any BLOCK finding. Not voiced (script stage) or not posted (final stage).
- **FIX** — FIX findings only. Each goes to its `owner`.
- **PASS** — no findings, or only verify notes for Daniel.

## Report (`02_compliance_script.json` / `04_compliance_final.json`)

```json
{
  "slug": "string",
  "stage": "script | final",
  "verdict": "PASS | FIX | BLOCK",
  "guard": "passed | failed: <last lines>",
  "findings": [
    {"severity": "BLOCK | FIX", "where": "scene 3 | 00:42.1 | edit.json cues[2] | card.png",
     "text": "the exact words (never client data: location and category only)",
     "rule": "RG 234 | NCCP s163 | compliance card | client data | number | translation",
     "why": "one sentence", "fix": "the exact rewrite or action", "owner": "writer | editor | Daniel"}
  ],
  "for_editor": {"taxNote": false, "conditionsNote": false,
                 "advertisedRate": null, "notes": []},
  "verify_for_daniel": ["neutral watch-words he should hear once", "judgement calls"],
  "previous_findings": [{"text": "…", "status": "resolved | open"}]
}
```

`for_editor.advertisedRate` is `{"rateFigure": "", "comparisonRate": "", "ratesAsAt": ""}` or
`null`. `owner` is `writer` for narration or script copy (faceless), `editor` for on-screen
copy, design, timing or the card, `Daniel` for something he said on camera.

Write `why` and `fix` in plain English Daniel can read without a glossary. Quote Vietnamese
exactly, with its diacritics.
