---
name: video-production-team
description: >-
  Runs Finance Hub's video production team end to end: script writer → compliance review →
  Daniel's approval → editor → final compliance review → finished video. Use when Daniel wants
  a video made or re-made with the team: "make a video from this document/policy", "faceless
  video about…", "turn this RBA announcement into a video", "produce this video with the team",
  "edit my video and have compliance check it", "run the video team", "re-run compliance",
  "redo the script only", "fix what compliance flagged", "update the video from the last run".
  For a quick edit of a talking-head video with no second review, vietnamese-finance-video-editor
  alone is enough; use this skill when Daniel wants the independent compliance check or a
  script written from a document. NOT for footage-free rate-alert reels (finhub-rate-alert-reel)
  or branding an existing clip (finhub-branded-reel).
---

# Video production team

**User story:** Daniel hands over a document or a recording and gets back a finished,
independently compliance-checked video, having made one decision: approving the script.

## The team

| Agent (`.claude/agents/`) | Does | Standard it follows |
|---|---|---|
| `video-script-writer` | document → `script.json` (faceless only) | `vietnamese-finance-video-editor/references/faceless-script.md` |
| `video-editor` | voice, design, stills, render | `vietnamese-finance-video-editor` skill |
| `video-compliance-reviewer` | independent PASS / FIX / BLOCK at script and final stage | `video-compliance-review` skill |

**Execution mode: subagents**, called one at a time with the Agent tool (`subagent_type` = the
agent name, `model: "opus"`). The flow is sequential with Daniel's approval in the middle, and
the reviewer must start from a clean context so it judges the files, not the author's reasoning.
Each agent reports to you; you relay questions to Daniel.

If the Agent tool says an agent type isn't found (agent files register at session start), use
`subagent_type: "general-purpose"` and open the prompt with "Read and adopt
`.claude/agents/<name>.md` as your role". The reviewer's independence is then by instruction
only; say so in the delivery report.

A subagent doesn't see this conversation or `AGENTS.md`. Put everything it needs in its prompt:
slug, mode, stage, every file path, and Daniel's feedback word for word.

## Phase 0 — Context

Work from the repository root. Get from Daniel:
- **Faceless:** the document. Keep it **outside the repository** (or under `out/`, which is
  git-ignored): the repository is public on GitHub, and `public/videos/` is committed.
- **Talking-head:** the path of his recording (the phone original, not a proxy).

Pick the slug (kebab-case ASCII) and check `out/videos/<slug>/team/`:
- No folder → **new run**. Run `git status`; if there's uncommitted work, tell Daniel before
  touching anything.
- Folder exists and Daniel asks to change one part ("redo the script", "fix what compliance
  flagged", "change the ending") → **partial re-run**: start at the phase that owns that part,
  passing the previous files and the feedback.
- Folder exists and Daniel brings a new document or recording → **fresh run**: move
  `out/videos/<slug>/team/` to `out/videos/<slug>/team_prev_<YYYYMMDD-HHMM>/` and
  `public/videos/<slug>/edit.json` to the same folder (an old `edit.json` keeps the old
  video's cues and stats). Or use a new slug.

## Phase 1 — Script (faceless only; talking-head skips to Phase 3)

1. `video-script-writer` with the document path, slug and any feedback.
   - `blocked` (client data, no clear idea) → stop; tell Daniel what category of problem it
     found and where. Never work around client data.
   - `open_questions` → ask Daniel, pass his answers back to the writer.
2. `video-compliance-reviewer`, stage `script`.
   - **FIX** → back to the writer with the report path; re-review. At most 2 rounds, then show
     Daniel the open findings.
   - **BLOCK** → stop; show Daniel the finding in plain words and what would clear it.
   - **PASS** → Phase 2.

## Phase 2 — Daniel approves the script (the only gate)

Show Daniel the script as a readable list: each scene's Vietnamese, English and visual; the
post copy; the voice engine and any paid step (fal.ai images, ElevenLabs); the reviewer's
verify notes. Nothing is voiced and nothing is spent until he says yes. His edits go back to
Phase 1 (writer, then reviewer).

## Phase 3 — Build

`video-editor` with slug, mode (`faceless` or `talking-head`), the recording path
(talking-head), the paths of `01_writer_notes.md` and `02_compliance_script.json` (faceless),
and any feedback.
- `open_questions` (a wrong number, an unsure cut) → ask Daniel, pass his answer back.
- `failed` → retry once with the error; failing again, report the last lines and stop.

## Phase 4 — Final review

`video-compliance-reviewer`, stage `final`, with the editor's report path and (faceless) the
script-stage report path.
- **FIX** → route each finding by its `owner`: `editor` → Phase 3 with the report path;
  `writer` → Phase 1, then Daniel re-approves (Phase 2) and the editor re-voices (Phase 3);
  `Daniel` → ask him (re-record, cut, or accept with a note). Then re-review. At most 2
  rounds per owner.
- **BLOCK** → if the cause is the editor's (a missing still, a render error, an untouched
  flag) send it to Phase 3 once; otherwise stop and tell Daniel what blocks posting and what
  would clear it.
- **PASS** → Phase 5.

## Phase 5 — Deliver

Send Daniel the phone copy and thumbnail with SendUserFile; if that tool isn't available, give
the file paths. Report in plain words: verdict, what the reviewer asked him to check himself
(`verify_for_daniel`), anything left out, and one next step. Then ask once whether anything
should change in the video or the team.

## Files

Team files live in `out/videos/<slug>/team/`. `out/` is git-ignored, so this trail exists
only on the machine that ran the job; copy the folder elsewhere if it must be kept.

| File | Written by |
|---|---|
| `01_writer_notes.md` | script writer |
| `02_compliance_script.json`, `guard-script.log` | reviewer, script stage |
| `03_editor_report.json` | editor |
| `04_compliance_final.json`, `guard-final.log`, `card.png` | reviewer, final stage |

The video follows the editor skill's paths (`public/videos/<slug>/`, `out/videos/<slug>/`).

## Errors

| Situation | Action |
|---|---|
| An agent returns malformed or no JSON | Re-run it once with the error; then stop and report |
| Reviewer and editor disagree on a finding | Don't pick a side; show Daniel both, with the rule cited |
| Two FIX rounds didn't clear a finding | Stop the loop; show Daniel the open finding |
| Any agent reports client data | Stop the whole run; tell Daniel the category and location, never the value |
