// A custom <TransitionSeries.Transition> presentation: the next scene grows
// out of a star in the middle of the frame. Clips with CSS clip-path: path(),
// so two star wipes on screen never share an SVG id.
import { translatePath } from "@remotion/paths";
import { makeStar } from "@remotion/shapes";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import type React from "react";
import { AbsoluteFill } from "remotion";

type StarWipeProps = { width: number; height: number; points?: number };

const StarWipePresentation: React.FC<TransitionPresentationComponentProps<StarWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: { width, height, points = 5 },
}) => {
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  const outer = Math.max(1, presentationProgress * Math.hypot(width, height));
  const star = makeStar({ points, innerRadius: outer * 0.45, outerRadius: outer });
  const d = translatePath(star.path, width / 2 - star.width / 2, height / 2 - star.height / 2);
  return <AbsoluteFill style={{ clipPath: `path("${d}")` }}>{children}</AbsoluteFill>;
};

export const starWipe = (props: StarWipeProps): TransitionPresentation<StarWipeProps> => ({
  component: StarWipePresentation,
  props,
});
