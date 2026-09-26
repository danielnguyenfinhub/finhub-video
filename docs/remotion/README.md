# Remotion API docs (saved copy)

Saved 2026-09-26 from Daniel's download. Use these when fixing or improving the
tools instead of fetching remotion.dev. They are big: **grep, never read whole.**

| File | What | Size |
|---|---|---|
| `remotion-api-reference.md` | Every package, its exports, one working example each | 97 KB |
| `remotion-examples-all.md` | One type-checked example per API | 218 KB |
| `remotion-full-docs.md` | Remotion's own docs, all 394 API pages, `<!-- source: url -->` before each | 1.3 MB |
| `agent-map.md` | Which APIs each agent in `.claude/agents/` needs, with the lookup command | 5 KB |

```bash
grep -n "^### <OffthreadVideo>" docs/remotion/remotion-full-docs.md   # find a page, then sed -n 'N,+80p'
grep -n "^## @remotion/captions" docs/remotion/remotion-api-reference.md
```

## Version gap: docs are 4.0.529, the repo runs 4.0.527

The installed packages win. Before using anything from these files, confirm it in
`node_modules/<package>/dist/*.d.ts`. Checked 2026-09-26 by type-checking every
example against the installed 4.0.527:

| Docs say (4.0.529) | Installed 4.0.527 |
|---|---|
| `@remotion/video-matting` `downloadVideoMattingModel()` | `loadVideoMattingModel()` |
| `@remotion/whisper-webgpu` `downloadWhisperModel()` | `loadWhisperModel()` |
| `@remotion/studio-protocol` `staticFileRef`, `assets` field | not present |
| `@remotion/enable-scss`, `@remotion/tailwind` (v3) | not installed (repo uses `tailwind-v4`, no SCSS) |

Everything else in the examples type-checks against 4.0.527. After `npm run upgrade`,
re-run that check and update this table.
