# Skills and harnesses

Part of the project guide; [AGENTS.md](../../AGENTS.md) is the core and routes here. The harness triggers stay in AGENTS.md "Harnesses"; goals and change logs are here.

## Skills

`.claude/skills/` contains the official Remotion agent skills (vendored from Remotion's `packages/skills`, matching the pinned Remotion version). Start with `remotion-best-practices` — it routes to the specific skill for the task (creating compositions, markup/animation, captions, maps, rendering, Studio). Follow them when writing any Remotion markup.

Whatever skill is driving (Remotion's, the editor skill, or a scene written by hand), build from the element libraries before writing an effect from scratch: `.claude/elements/CATALOG.md` and `.claude/elements/remocn/CATALOG.md` for components, and `.claude/elements/remocn/recipes/FINHUB.md` for whole-video structures (remocn's composition recipes mapped to FinHub content, with the FinHub overrides). This rule lives here rather than inside the Remotion skills because re-vendoring replaces those.

`.claude/skills/vietnamese-finance-video-editor/` is the owner's own skill, not Remotion's: use it whenever Daniel asks to edit a new talking-head video. It holds the locked-core/new-design-every-video workflow, the design log (`public/videos/design-log.json`, through its `scripts/main.py`) and the compliance rules. Re-vendoring replaces only Remotion's skills and keeps this one.

### Harness: video production team

**Goal:** a document or recording becomes a finished video that a second, independent reviewer has checked for compliance, with Daniel approving only the script.

**Trigger:** when Daniel asks for a video from a document, a faceless video, or a video "with the team" / "with a compliance check", use the `video-production-team` skill. It runs three agents in `.claude/agents/`: `video-script-writer`, `video-editor` (which follows `vietnamese-finance-video-editor`) and `video-compliance-reviewer` (which follows `video-compliance-review`). A plain edit of a talking-head video can still use the editor skill alone.

**Change log:**
| Date | Change | Files | Why |
|---|---|---|---|
| 2026-09-26 | Initial team | the three agents, `video-production-team`, `video-compliance-review` | Independent compliance check; scripts written from documents |

### Harness: refactor team

**Goal:** the repo wastes less — duplicated recordings, tokens per session, render minutes — measured before and proved after, with Daniel's recordings moved only by a script he runs himself.

**Trigger:** when Daniel asks to refactor, dedupe, audit or speed up this repo ("where are the tokens going", "run the refactor pipeline", "make rendering faster", "did the dedup work"), use the `refactor-team` skill. It runs `architecture-auditor`, `asset-refactorer`, `pipeline-optimizer` and `quality-reviewer` from `.claude/agents/`, measuring with the `repo-audit-tools` skill. A one-line fix needs no team.

**Change log:**
| Date | Change | Files | Why |
|---|---|---|---|
| 2026-09-26 | Initial team | the four agents, `refactor-team`, `repo-audit-tools`, `.claude/settings.json` (Read-deny rules for the emoji, typeface and country JSON blobs) | Five copies of one 273 MB recording across slug folders; nothing measured the token cost of a session |

`.claude/` also holds 18 other subagents in `.claude/agents/` and 7 skills (accessibility, bun-runtime, codebase-onboarding, error-handling, react-patterns, react-performance, search-first) imported from ECC (see `.claude/ECC.md`), and the `ponytail-review`, `ponytail-audit` and `ponytail-debt` skills from ponytail (see `.claude/PONYTAIL.md`). They run only when asked; AGENTS.md, these docs and the Remotion and owner skills win where they conflict.

When upgrading Remotion, re-vendor the skills so guidance matches the installed version:

```console
node scripts/vendor-skills.mjs   # defaults to ../remotion/packages/skills/skills; pass another source path if needed
```

The default source is a Remotion checkout in a `remotion` folder next to this one (GitHub Desktop clones `danielnguyenfinhub/remotion` there); check out the Remotion version you're upgrading to first. The script copies the skills without their symlinks (which break on Windows checkouts and inflate zip bundles), rewrites sibling-skill links accordingly, and fails if any relative link is broken. Do not copy the skills by hand.

`node scripts/build-chat-skill.mjs` packages `chat-skill/SKILL.md` plus these skills into `remotion-video-skill.zip` for upload to claude.ai (Claude Chat and account-wide Cowork). Rebuild it after re-vendoring.

