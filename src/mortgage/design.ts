// A design is everything a MortgageReel video looks like; the core (this
// folder) keeps what it must do: cuts, pacing, audio, RG 234, compliance card.
// Designs live in src/designs/<id>/ and are picked by edit.json `design`.
import type { TransitionPresentation } from "@remotion/transitions";
import type React from "react";
import type { Look, Reel } from "./schema";
import type { Segment, TransitionKind } from "./timeline";

export type CoverProps = {
  src: string;
  coverFrame: number;
  title: string;
  subtitle: string;
  keywords: string[];
};
// Must render <PacedVideo seg src look foreground />, which owns pacing and
// audio (and, with foreground, the brand backdrop behind the cut-out).
export type TalkProps = {
  seg: Segment;
  index: number;
  src: string;
  look?: Look;
  foreground?: string; // set when edit.json "background" is on
};
// Frame 0 is the first word of the talk.
export type OverlayProps = { reel: Reel; keywords: string[]; talkFrames: number };

export type Design = {
  id: string;
  Cover: React.FC<CoverProps>; // COVER_FRAMES long, crossfades into the talk
  Talk: React.FC<TalkProps>; // frames one paced segment
  Overlay: React.FC<OverlayProps>; // captions, hook, chapters, stats, cues, sfx
  Outro: React.FC<{ question: string }>; // CTA + contact
  chapterTransition: (
    kind: TransitionKind,
  ) => TransitionPresentation<Record<string, unknown>>;
  copy: string[]; // every hard-coded on-screen string, RG 234-scanned
};
