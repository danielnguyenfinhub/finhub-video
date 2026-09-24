// Every design a MortgageReel video can name in edit.json `design`.
import type { Design } from "../mortgage/design";
import { classic } from "./classic";
import { explainer } from "./explainer";

const DESIGNS: Record<string, Design> = { classic, explainer };

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
