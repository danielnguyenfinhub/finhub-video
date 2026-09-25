# Landmines — each one already cost a render (symptom → cause → fix)

- Frame-fetch timeouts at random frames → phone source has 8 s keyframes → always render
  the prep proxy `public/videos/<slug>/source.mp4` (short GOP).
- Files change on disk mid-task, render 404s on edit.json → GitHub Desktop pull or branch
  switch stashed uncommitted work (one stash per branch, replaced on each switch) →
  `git stash list`; untracked files sit in the stash's main tree
  (`git show "stash@{0}:<path>"`), not `^3`. Work on a branch Daniel isn't switching.
- A long headline runs off its card ("INTEREST IN ADVANCE", "CLAIM NĂM NAY") → fixed
  font size → `fitText` to the box width.
- A stat card and a chapter banner overlap → both timed near the same word → start the
  card after the banner (~1 s) or move the banner.
- The auto stutter cut removed "các bạn." before "Các bạn hãy…" → repeats across a
  sentence end matched → core fix in design-architecture.md; always read the auto-cut
  list printed by render-video.py.
- A caption fix broke a correct phrase ("tiền giống" → "gốc" would also hit "giống như")
  → flat `captionFixes` swap → context-bound rule in `fixWord`.
- Compare-card row text collides with the VS badge → label + value share one line →
  keep each row under ~18 characters.
- Re-transcribing the last seconds returned "Cảm ơn các bạn đã theo dõi" → Whisper
  hallucinates on silence/end cards → take the window from the talk; use `vad_filter=True`.
- A 4:5 (1080×1350) source → `objectFit: cover` zooms 1.42× and crops the sides → check
  the face stays inside ~15–85% of the width before designing.
- WebGL leaks/3D/effects render black → missing `--gl=angle` → render via render-video.py.
- `trimAfter` with `playbackRate` blanks a slowed segment's tail → only `trimBefore`
  (PacedVideo does this).
- Tax talk with no tax disclaimer → a credit rep isn't a tax agent → `compliance.taxNote`.
- Moving-pill caption drawn beside the words in renders (fine in the Player) → words measured with offsetLeft/Top before Be Vietnam Pro loaded, so the line wrapped differently → measure only after reelFontReady() and hold the frame with useDelayRender (studio PillCaptions; same class as NewsTicker/BoxCaption). Applies to every Remotion Element that measures text.
- Background removal (review/matte.html) took 44.5 min for a 3.5-min video on this PC (about 13x, not the 9x measured on the shorter interest-in-advance). Start it first, before any other work on the video, and keep the browser tab open.
