# BUG: useWindowedAudioData lets some frames render a flat waveform

- Date: 2026-09-26 (AEST)
- Component: `@remotion/media-utils` 4.0.527, `useWindowedAudioData`, as used by `src/elements/Oscilloscope.tsx` in the explainer design
- Severity: medium. Visible in the finished video: the waveform drops to a flat line on isolated frames while the audio is playing. Found while timing renders of `interest-in-advance` (explainer design, 2528 frames); it is independent of the changes made that day and of the render concurrency.

## Observed

Five full renders of the same reel, counted by band brightness over the waveform area:

| Render | Concurrency | Flat frames |
|---|---|---|
| 1 | 8 | 18 |
| 2 | 8 | 16 |
| 3 | 6 | 20 |
| 4 | 4 | 16 |
| 5 | 3 | 15 |

Frame 1323 of render 1 is an example (a half-scale still was kept at `out/speed/still-cmp-1323.png`
in the worktree that found it; regenerate with `npx remotion still MortgageReel out/check.png
--frame=1323 --props='{"slug":"interest-in-advance"}' --scale=0.5`, with the recording present).
The flat frames differ between runs, so the fault is timing-dependent, not tied to the audio content.

## Documented vs observed

The hook is documented to hold the frame (`delayRender`) until the audio window for the current
time is loaded, so every rendered frame draws real samples. Observed: on roughly 15–20 frames per
2,500-frame render the element draws with no samples for the current time.

An unconfirmed reading of the hook's source suggests it releases `delayRender` once any cached
window exists, even when the window for the current time was cancelled or not yet loaded. This has
not been verified against the package source and is recorded as a hypothesis only.

## A correct result

1. Every frame rendered while audio is playing draws samples from the window that covers that
   frame's time; no frame draws an empty or zero-filled buffer.
2. Two renders of the same composition draw the same waveform on every frame (no run-to-run
   variation from load timing).
3. If a window cannot be loaded in time, the render fails with an error naming the frame and
   time, rather than continuing with a flat line.
