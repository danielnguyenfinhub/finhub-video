# Element libraries: .claude/elements and remocn

Part of the project guide; [AGENTS.md](../../AGENTS.md) is the core and routes here.

## Elements

`.claude/elements/` is a local copy of the official [Remotion Elements](https://www.remotion.dev/elements/) gallery (vendored from Remotion's `packages/docs/elements`) — 41 small, self-contained, drop-in components across 11 categories (audio, backgrounds, captions, commerce, data, layouts, maps, overlays, storytelling, text, youtube). `.claude/elements/CATALOG.md` lists every one with its description. Elements are designed to be copied and edited directly (not installed as a dependency): pick one from the catalog, copy its `.tsx` file (and `initial-props.ts` if present) into `src/showcase/`, and adapt it — check the file's own imports for any package to install first.

`.claude/elements/remocn/` holds 300+ more items from [remocn](https://remocn.dev) (MIT): kinetic text, transitions, shader backgrounds, effects, charts, 100 icons and 5 full templates, indexed with a "use when" line each in `.claude/elements/remocn/CATALOG.md`. They sit at their shadcn install paths (`components/remocn/*`, `lib/remocn*/*`) and import each other through `@/components/remocn/...` and `@/lib/remocn-*`, so copy an element together with the files it imports and rewrite those imports to relative paths. Their npm packages are installed. Adapt any element before use (Be Vietnam Pro, `src/brand/theme.ts` colours, no bundled `<Audio>`): the editing skill's `references/toolkit.md` → "Element libraries" has the full list. Items marked third-party brand UI are reference only.

Two files come from the live site instead, because they are newer than `packages/docs/elements`: `captions/rounded-captions` and `youtube/youtube-subscribe-nudge`. The vendor script deletes and rewrites everything in the folder except `remocn/`, so after re-vendoring, restore them with `git checkout -- .claude/elements/captions/rounded-captions .claude/elements/youtube/youtube-subscribe-nudge` and re-add their `CATALOG.md` lines, unless upstream has caught up.

Re-vendor after pulling upstream changes to `packages/docs/elements`:

```console
node scripts/vendor-elements.mjs   # defaults to ../remotion/packages/docs/elements; pass another source path if needed
```

