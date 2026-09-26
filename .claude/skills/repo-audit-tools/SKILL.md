---
name: repo-audit-tools
description: >-
  Runs the local codebase-measurement tools against finhub-video and explains their output:
  repomix (tokens per file and folder), repowise (code health, refactoring targets, dead code,
  doc drift), gitingest (the file tree as an ingestion tool sees it) and a content-hash scan
  that finds duplicated recordings and footage. Use whenever an agent or Daniel asks "where are
  the tokens going", "what is duplicated", "audit the repo", "measure before refactoring",
  "re-run the audit", "did the dedup work", or needs numbers for a refactor report. NOT for
  reviewing code style (ponytail-review) or learning the codebase (codebase-onboarding).
---

# Repo audit tools

One command produces every raw measurement the refactor team reads:

```console
node .claude/skills/repo-audit-tools/scripts/audit.mjs --media-root <path to public/> [--out out/refactor/raw] [--only media,repomix,repowise,gitingest] [--min-size 65536]
```

Run it from the repository root. It never edits project files: it writes only under `--out` and prints one line per tool. A tool that fails is retried once, then skipped with its error in `status.json`, so one broken tool never blocks the audit. `--self-test` checks the duplicate grouping on three temp files and exits.

In a worktree session the recordings are absent (they are git-ignored), so pass the main checkout: `--media-root C:/Users/Daniel/finhub-video/public`.

## Where the tools come from

None is installed globally; each runs from Daniel's local clone or a pinned npm version, so the numbers are reproducible:

| Tool | Runs as | Why this way |
|---|---|---|
| repomix 1.18.0 | `npx -y repomix@1.18.0` | the clone at `C:\Users\Daniel\repomix` is unbuilt; npx fetches that exact version into the npm cache |
| repowise 0.53.0 | `uv tool run --system-certs --from C:/Users/Daniel/repowise repowise` | Python package built from the clone; `--system-certs` because Norton intercepts TLS on this machine and uv's own trust store rejects the certificate |
| gitingest | `uv tool run --system-certs --from C:/Users/Daniel/gitingest gitingest` | same |
| media scan | Node `crypto` inside the script | md5 of every file of at least `--min-size` bytes under the media root |

The first run of each uv tool builds an environment in uv's cache (repowise installs about 130 packages, roughly a minute); later runs start instantly.

## Reading the output

| File | What it means | Blind spot |
|---|---|---|
| `repomix-tree.txt` | the file tree with a token count per file and folder (files under 800 tokens folded), then the 40 largest files | respects `.gitignore`, so git-ignored media and `out/` never appear; that is correct, the model never reads them either |
| `repomix-pack.md` | the packed codebase repomix built | large; read a slice when you need one file, never the whole thing |
| `repowise-health.md`, `repowise-targets.md` | health per production file, and the ranked refactoring candidates by impact over effort | half the score is git churn, so a file edited often scores worse without being bad; `--counts code_shape` removes that half |
| `repowise-dead-code.txt` | symbols nothing references | Remotion compositions are reached through `<Composition>` registration in `src/Root.tsx`, not imports of the component name; check there before calling a scene dead |
| `repowise-doc-drift.txt` | docs that name paths or symbols that no longer exist | |
| `gitingest-digest.txt` | the file tree (first section), then every text file's content | the tree is the useful part |
| `media-duplicates.json` | every content hash seen more than once: size, paths, wasted MB, total | only files of at least `--min-size` bytes, only under the media root you passed |
| `status.json` | per tool: ok or skipped, seconds, error | |

Token cost is text, not video. When ranking "token bottlenecks", use `repomix-tree.txt`, and remember that git-ignored folders are absent from it because Claude Code's file tools skip them too.

## Repowise side effects

`repowise init` does more than index. Even with `--no-claude-md --no-agents --no-codex` it wires
its MCP server and hooks into the **user-level** Claude Code settings (`~/.claude/settings.json`)
and Claude Desktop config, and writes `.mcp.json` and `.vscode/` into the repo (checked on a
scratch repo on 2026-09-26). Nobody asked for that, so the script runs
`repowise agents remove --target claude-code,vscode --scope both .` straight after `init`; what
it removed is in `repowise-unwire.json`. If a `repowise` entry ever appears in a Claude settings
file anyway, that command clears it. The index itself lives in `.repowise/` (about 90 MB,
git-ignored) and is reused by `health`, `dead-code` and `doc-drift`.
