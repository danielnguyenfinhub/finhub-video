// Every design a MortgageReel video can name in edit.json `design`.
import type { Design } from "../mortgage/design";
import { chatstory } from "./chatstory";
import { checklist } from "./checklist";
import { classic } from "./classic";
import { datalab } from "./datalab";
import { editorial } from "./editorial";
import { faceless } from "./faceless";
import { explainer } from "./explainer";
import { kitchen } from "./kitchen";
import { neon } from "./neon";
import { newsroom } from "./newsroom";
import { reaction } from "./reaction";
import { scenario } from "./scenario";
import { series } from "./series";
import { studio } from "./studio";

// Add a design here once its folder builds; keep the ids lowercase.
// The ten of 25/09/2026 follow src/designs/README.md (golden rules).
const DESIGNS: Record<string, Design> = {
  classic,
  explainer,
  studio,
  newsroom,
  datalab,
  chatstory,
  editorial,
  neon,
  reaction,
  checklist,
  scenario,
  // A voiced script with no one on screen (scripts/voice-video.mjs).
  faceless,
  kitchen,
  series,
};

export const DEFAULT_DESIGN = "classic";
export const DESIGN_IDS = Object.keys(DESIGNS);

export const getDesign = (id: string): Design => {
  const d = DESIGNS[id];
  if (!d)
    throw new Error(
      `edit.json design "${id}" is not a design. Available: ${Object.keys(DESIGNS).join(", ")}`,
    );
  return d;
};
