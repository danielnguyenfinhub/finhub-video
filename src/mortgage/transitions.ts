// The chapter transitions edit.json can name (TRANSITIONS in timeline.ts),
// each with FinHub's defaults. Designs use chapterTransition as is or override it.
import {
  pushCut,
  type TransitionPresentation,
} from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { brand } from "../brand/theme";
import {
  blurSlideOrFallback,
  bookFlipOrFallback,
  crossZoomOrFallback,
  crosswarpOrFallback,
  dissolveOrFallback,
  dreamyZoomOrFallback,
  filmBurnOrFallback,
  linearBlurOrFallback,
  rippleOrFallback,
  swapOrFallback,
  zoomBlurOrFallback,
  zoomInOutOrFallback,
} from "../showcase/htmlInCanvasPresentation";
import type { TransitionKind } from "./timeline";

const WIDTH = 1080;
const HEIGHT = 1920;

// Widened so the differently-typed presentations fit one <Transition> prop;
// presentations with required props only widen via unknown. A Record, so a
// name added to TRANSITIONS without an entry here fails the type check.
type AnyPresentation = TransitionPresentation<Record<string, unknown>>;
const widen = (p: unknown) => p as AnyPresentation;
const PRESENTATIONS: Record<TransitionKind, () => AnyPresentation> = {
  fade: () => widen(fade()),
  slide: () => widen(slide({ direction: "from-right" })),
  wipe: () => widen(wipe({ direction: "from-left" })),
  flip: () => widen(flip({ direction: "from-right" })),
  clockWipe: () => widen(clockWipe({ width: WIDTH, height: HEIGHT })),
  iris: () => widen(iris({ width: WIDTH, height: HEIGHT })),
  pushCut: () => widen(pushCut({ flashColor: brand.accent })),
  // Shader transitions, each falling back to fade() without HTML-in-canvas.
  blurSlide: blurSlideOrFallback,
  bookFlip: bookFlipOrFallback,
  crossZoom: crossZoomOrFallback,
  crosswarp: crosswarpOrFallback,
  dissolve: dissolveOrFallback,
  dreamyZoom: dreamyZoomOrFallback,
  filmBurn: filmBurnOrFallback,
  linearBlur: linearBlurOrFallback,
  ripple: rippleOrFallback,
  swap: swapOrFallback,
  zoomBlur: zoomBlurOrFallback,
  zoomInOut: zoomInOutOrFallback,
};
export const chapterTransition = (kind: TransitionKind) =>
  PRESENTATIONS[kind]();
