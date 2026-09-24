# Review & tweak page

A local web page for checking a MortgageReel video and making the small calls
yourself, without editing `edit.json` by hand:

- watch the reel exactly as it will render (a `@remotion/player` of the real
  composition, built with the same `buildReel()` as the render);
- pick the **design** and the **colour grade**;
- pick each **chapter transition**;
- move a chapter, stat or cue **earlier or later** in 0.5 s steps (its inner
  beats move with it) and jump the player to it;
- **Save** writes `public/videos/<slug>/edit.json`, keeping the previous
  version as `edit.json.bak`; **Render video** then runs
  `scripts/render-video.py <slug>` and shows its progress.

```console
npm run review        # then open http://localhost:4100/
```

Only videos with `source.mp4`, `words.json` and `edit.json` are listed (run
`scripts/prep-video.py` first). Every change is checked with the same schema
and RG 234 scan as the render: a change that would fail shows the error and
cannot be saved. Wording (titles, captions, cue text) is not editable here on
purpose; change it with Claude so it gets the full compliance review.

The server (`server.ts`) listens on 127.0.0.1 only, serves `public/` with HTTP
Range support, and runs one render at a time. `node review/check-shift.mjs`
checks the timing logic.
