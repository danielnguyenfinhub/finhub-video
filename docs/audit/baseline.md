# Baseline — 26 September 2026 (AEST)

Measured for the action plan's WP0 from the worktree at origin/main 3f8f9c3 (merge of PR #35), with
Daniel's media read from the main checkout (C:/Users/Daniel/finhub-video/public, read-only). Later work
packages report their savings against these numbers.

## Repo state

| Item | Value |
|---|---|
| origin/main | 3f8f9c3, merge of PR #35 (recordings contract, TyDoReel retired, render tuning, refactor-team harness) |
| Open pull requests | none |
| Main checkout (C:/Users/Daniel/finhub-video) | still at 0daef77, one merge behind main; untracked public/videos/rba-sept-2026/ and .playwright-mcp/ |
| Recordings migration (scripts/migrate-assets.py --apply) | not run: no public/recordings/, no edit.json has a source id |
| npm run lint (eslint src and tsc) | passes |
| npx remotion compositions | 13 compositions register (TyDoReel gone) |

## Bytes an agent reads

Session start: CLAUDE.md is loaded by Claude Code and points at AGENTS.md, which every session then reads.

| Read | Bytes | Tokens (repomix, 26 Sep audit) |
|---|---|---|
| CLAUDE.md | 331 | |
| AGENTS.md | 35,762 | 8,495 |
| Skill and agent descriptions always in context | 53 descriptions, 13,378 bytes | |

Mode A (talking-head edit) read set, the files the editor SKILL.md points to:

| File | Bytes |
|---|---|
| vietnamese-finance-video-editor/SKILL.md | 15,246 |
| references/editing-principles.md | 13,793 (3,373 tokens) |
| references/toolkit.md | 8,803 |
| references/edit-json.md | 7,683 |
| references/design-architecture.md | 7,105 |
| references/design-space.md | 3,779 (933 tokens) |
| references/landmines.md | 2,702 |
| .claude/elements/CATALOG.md | 6,617 |
| .claude/elements/remocn/CATALOG.md | 65,982 (16,168 tokens) |
| Mode A total if every pointer is followed | 131,710 |
| Mode A total without the remocn catalog | 65,728 |

Mode B (faceless) read set:

| File | Bytes |
|---|---|
| references/faceless-script.md | 7,282 |
| video-production-team/SKILL.md | 6,386 |
| video-compliance-review/SKILL.md | 7,017 |
| agents: video-script-writer, video-editor, video-compliance-reviewer | 2,715 + 2,650 + 1,744 |
| Mode B total | 27,794 |

Whole guidance tree: editor skill folder 83,213 B; remocn catalog 65,982 B; AGENTS.md 35,762 B;
elements catalog 6,617 B; FINHUB.md recipes 4,689 B; video team skills 13,403 B. docs/findings.md is
10,711 tokens and read only in slices.

## Footage and voice caches (per slug, main checkout)

| Slug | Footage files | Footage MB | Voice files | Voice MB |
|---|---|---|---|---|
| bid-explained | 41 | 110.3 | 19 | 38.5 |
| faceless-test | 15 | 62.4 | 17 | 28.2 |
| rba-sept-2026 | 10 | 26.0 | 31 | 29.2 |
| Total | 66 | 198.7 | 67 | 95.9 |

## Duplicates across public/videos (content hash, every file size)

6 duplicate groups, 555.8 MB wasted in total.

| What | Groups | Wasted MB | Detail |
|---|---|---|---|
| Stock footage re-downloaded across slugs | 2 | 10.1 | pexels-34719410-14717157.mp4 and pexels-8814707-10962272.mp4, each in bid-explained and faceless-test |
| Recordings still duplicated until the migration runs | 1 | 545.4 | ty-do/source.mp4 in ty-do, ty-do-box, ty-do-explainer |
| Transcripts and an edit.json duplicated | 3 | 0.3 | words.json x4 (ty-do family), words.json x2 (interest-in-advance family), bank-test/ty-do edit.json |

Raw data: out/audit/wp0/media-duplicates.json (git-ignored) in the worktree that measured this.
