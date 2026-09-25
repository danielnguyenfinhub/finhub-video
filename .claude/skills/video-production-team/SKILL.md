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
| `video-compliance-reviewer` | independent PASS / FIX / BLOCK, at script and final stage | `video-compliance-review` skill |

**Execution mode: subagents**, called in sequence with the Agent tool (`subagent_type` = the
agent name, `model: "opus"`). Why not an agent team: the flow is sequential with a human gate
in the middle, and the reviewer must start from a clean context so it judges the artefacts,
not the author's reasoning. Each agent reports back to you; you relay questions to Daniel.

Agent files register when a session starts. If the Agent tool says an agent type isn't found
(the files arrived mid-session), use `subagent_type: "general-purpose"` and start the prompt
with "Read and adopt `.claude/agents/<name>.md` as your role"; give the reviewer only the
read-only tools its file lists.

A subagent doesn't see this conversation or `AGENTS.md`. Put everything it needs in its
prompt: slug, mode, stage, file paths, and Daniel's feedback word for word.

## Phase 0 — Context

Work from the repository root. Pick the slug (kebab-case ASCII) and check
`out/videos/<slug>/team/`:

- No folder → **new run**.
- Folder exists and Daniel asks to change one part ("redo the script", "fix what compliance
  flagged", "change the ending") → **partial re-run**: start at the phase that owns that part,
  passing the previous files and the feedback.
- Folder exists and Daniel brings a new document or recording for the same slug → **fresh run**:
  move the folder to `out/videos/<slug>/team_prev/` first.

Run `git status`; if there's uncommitted work, tell Daniel before touching anything.

## Phase 1 — Script (faceless only; talking-head skips to Phase 3)

1. `video-script-writer` with the document path, slug and any feedback.
   - `blocked` (client data, no clear idea) → stop; tell Daniel what it found. Never work around client data.
2. `video-compliance-reviewer`, stage `script`.
   - **FIX** → back to the writer with the findings; re-review. At most 2 rounds, then show Daniel the open findings.
   - **BLOCK** → stop; show Daniel the finding in plain words and what would clear it.
   - **PASS** → Phase 2.

## Phase 2 — Daniel approves the script (the only gate)

Show Daniel the script as a readable list: each scene's Vietnamese, English and visual; the
post copy; the character count; the reviewer's verify notes. Nothing is voiced and no credits
are spent until he says yes. His edits go back to Phase 1 (writer, then reviewer).

## Phase 3 — Build

`video-editor` with slug, mode (`faceless` or `talking-head`), and any feedback.
- `open_questions` (a wrong number, an unsure cut) → ask Daniel, pass his answer back.
- `failed` → retry once with the error; failing again, report the last 5 lines and stop.

## Phase 4 — Final review

`video-compliance-reviewer`, stage `final`, with the editor's report path.
- **FIX** → back to the editor with the findings; re-review. At most 2 rounds.
- **BLOCK** → stop; tell Daniel what blocks posting and what would clear it.
- **PASS** → Phase 5.

## Phase 5 — Deliver

Send Daniel the phone copy and thumbnail (SendUserFile). Report in plain words: verdict, what
the reviewer asked him to check himself (`verify_for_daniel`), anything left out, and one next
step. Then ask once whether anything should change in the video or the team.

## Files

All team files live in `out/videos/<slug>/team/` (git-ignored, kept as the audit trail):

| File | Written by |
|---|---|
| `01_writer_notes.md` | script writer |
| `02_compliance_script.json` | reviewer, script stage |
| `03_editor_report.json` | editor |
| `04_compliance_final.json` | reviewer, final stage |

The video itself follows the editor skill's paths (`public/videos/<slug>/`, `out/videos/<slug>/`).

## Errors

| Situation | Action |
|---|---|
| An agent returns malformed or no JSON | Re-run it once with the error; then stop and report |
| Reviewer and editor disagree on a finding | Don't pick a side; show Daniel both, with the rule cited |
| Two FIX rounds didn't clear a finding | Stop the loop; show Daniel the open finding |
| Any agent reports client data | Stop the whole run; tell Daniel |

## Test scenarios

- **Normal (faceless):** a lender policy PDF → writer PASSes dry run → reviewer PASS → Daniel
  approves → editor renders → reviewer PASS → phone copy delivered with verify notes.
- **Error (script):** a script scene says "chắc chắn được duyệt" or quotes "từ 5,79%" with no
  comparison rate → reviewer BLOCK → run stops before any voicing; Daniel sees the line and the fix.
- **Partial re-run:** "compliance flagged the ending, fix it" → Phase 0 finds the team folder →
  editor gets `04_compliance_final.json` → reviewer re-checks, marking the old finding resolved.
