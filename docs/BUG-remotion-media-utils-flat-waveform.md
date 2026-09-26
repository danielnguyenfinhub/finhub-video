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

## Root cause (confirmed 2026-09-26 against the installed 4.0.527 source)

In `node_modules/@remotion/media-utils/dist/use-windowed-audio-data.js` the only frame hold for
sample data is the `useLayoutEffect` at lines 280-297: it calls `delayRender` only while
`currentAudioData` is `null`. `currentAudioData` (lines 259-276) is built from `availableWindows`
(lines 256-258): the previous, current and next window, filtered to whichever are already in
`waveFormMap`. So as soon as ANY of the three is loaded the hold is released, even when the window
for the current time is still decoding (or was cleared by `setWaveformMap`, lines 172-183). The
frame then draws from data that does not cover it: `getWaveformPortion` reads past the loaded
windows and returns zeros (a flat line), and when the loaded windows are not contiguous (previous +
next) the concatenation at line 267 puts the next window's samples at the current window's time (a
wrong waveform). Which windows are in when a frame is captured depends on decode timing, hence the
run-to-run variation.

Reproduced on `MortgageReel` / `interest-in-advance`, `--frames=1200-1400 --scale=0.5`, two image
sequence renders: 1 and 7 flat frames, and 21 of 201 frames whose waveform band differed between
the two runs. A single `remotion still --frame=1300` also came out flat.

## Local fix (this repo)

`src/elements/useCoveredAudioData.ts` wraps the hook and holds the frame (`useDelayRender()`) until
the windows the hook combined (named in `audioData.resultId`, `…-windows-a,b,c`) are exactly the
previous/current/next set it wants for this frame. `Oscilloscope`, `MirroredSpectrum` and the studio
`VoiceNote` use it. After the fix the same range rendered twice gave 0 flat frames each and 0
differing frames between the runs; frames that were fine before are pixel-identical. A window that
never arrives now fails the render on the `delayRender` timeout, with a label naming the windows,
frame and time. The upstream defect is unchanged; this file stays as the report for it.

## A correct result

1. Every frame rendered while audio is playing draws samples from the window that covers that
   frame's time; no frame draws an empty or zero-filled buffer.
2. Two renders of the same composition draw the same waveform on every frame (no run-to-run
   variation from load timing).
3. If a window cannot be loaded in time, the render fails with an error naming the frame and
   time, rather than continuing with a flat line.
