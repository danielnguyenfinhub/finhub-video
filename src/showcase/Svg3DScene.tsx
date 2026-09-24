import {parsePath} from "@remotion/paths";
import {makeRect} from "@remotion/shapes";
import {
  aroundCenterPoint,
  extrudeAndTransformElement,
  interpolateMatrix4d,
  makeMatrix3dTransform,
  reduceMatrices,
  rotateX,
  rotateY,
  threeDIntoSvgPath,
  transformPath,
  translateZ,
  type FaceType,
  type MatrixTransform4D,
} from "@remotion/svg-3d-engine";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {palette, gradientBg} from "./palette";
import {poppins} from "./font";

// A house, convex so its side walls never hide each other wrongly.
const HOUSE = "M 150 0 L 300 120 L 300 270 L 0 270 L 0 120 Z";
const HOUSE_SIZE = {width: 300, height: 270};
const CARD_SIZE = {width: 420, height: 250};

// extrudeElement() builds only the side walls, from z = -depth/2 (the
// front, nearest the viewer) to +depth/2, and doesn't order them. Drawing
// the farthest first (the painter's algorithm) keeps any pose correct.
const farthestFirst = (faces: FaceType[]) => {
  const meanZ = (face: FaceType) => face.points.reduce((sum, p) => sum + p.point[2], 0) / face.points.length;
  return [...faces].sort((a, b) => meanZ(b) - meanZ(a));
};

const Walls: React.FC<{faces: FaceType[]}> = ({faces}) => (
  <>
    {farthestFirst(faces).map((face, i) => (
      <path key={i} d={threeDIntoSvgPath(face.points)} fill={face.color} shapeRendering={face.crispEdges ? "crispEdges" : undefined} />
    ))}
  </>
);

// Demonstrates: @remotion/svg-3d-engine, the matrix engine behind
// Remotion's own 3D buttons (an internal package: no docs, so this follows
// packages/example/src/3DEngine in the Remotion source). Left: an SVG path
// extruded into walls (extrudeAndTransformElement) with its front face
// moved by the same matrix (transformPath), swinging on rotateY/rotateX
// around its centre (aroundCenterPoint). Right: a rounded card (makeRect)
// whose front is live HTML placed with makeMatrix3dTransform(), easing
// between two poses with interpolateMatrix4d().
export const Svg3DScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const houseDepth = 64;
  const swing = interpolate(frame, [0, durationInFrames], [-0.7, 0.7]);
  const houseTurn = aroundCenterPoint({
    matrix: reduceMatrices([rotateY(swing), rotateX(-0.28)]),
    x: HOUSE_SIZE.width / 2,
    y: HOUSE_SIZE.height / 2,
    z: 0,
  });
  const houseWalls = extrudeAndTransformElement({
    points: parsePath(HOUSE),
    depth: houseDepth,
    pressInDepth: 0,
    sideColor: palette.accent,
    crispEdges: false,
    transformations: houseTurn,
  });
  const houseFront = transformPath({
    path: HOUSE,
    transformation: reduceMatrices([translateZ(-houseDepth / 2), houseTurn]),
  });

  const cardDepth = 36;
  const flat: MatrixTransform4D = reduceMatrices([rotateX(-0.12)]);
  const tilted: MatrixTransform4D = reduceMatrices([rotateY(-0.55), rotateX(-0.3)]);
  const progress = interpolate(frame, [10, durationInFrames - 15], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardTurn = interpolateMatrix4d(progress, flat, tilted);
  const card = makeRect({...CARD_SIZE, cornerRadius: 28});
  const cardWalls = extrudeAndTransformElement({
    points: parsePath(card.path),
    depth: cardDepth,
    pressInDepth: 0,
    sideColor: "#4338ca",
    crispEdges: false,
    transformations: aroundCenterPoint({
      matrix: cardTurn,
      x: CARD_SIZE.width / 2,
      y: CARD_SIZE.height / 2,
      z: 0,
    }),
  });

  const label = {
    color: palette.textDim,
    fontSize: 20,
    marginTop: 44,
    textAlign: "center" as const,
  };

  return (
    <AbsoluteFill
      style={{
        background: gradientBg,
        fontFamily: poppins,
        color: palette.text,
        alignItems: "center",
        paddingTop: 50,
      }}
    >
      <div style={{fontSize: 40, fontWeight: 700}}>@remotion/svg-3d-engine</div>
      <div style={{fontSize: 22, color: palette.textDim, marginTop: 6}}>Flat SVG shapes, extruded and turned in 3D</div>
      <div
        style={{
          display: "flex",
          gap: 160,
          marginTop: 90,
          alignItems: "flex-end",
        }}
      >
        <div>
          <svg width={HOUSE_SIZE.width} height={HOUSE_SIZE.height} style={{overflow: "visible"}}>
            <Walls faces={houseWalls} />
            <path d={houseFront} fill={palette.accent2} stroke={palette.text} strokeWidth={2} />
          </svg>
          <div style={label}>extrudeAndTransformElement + transformPath</div>
        </div>
        <div>
          <div style={{position: "relative", ...CARD_SIZE}}>
            <svg width={CARD_SIZE.width} height={CARD_SIZE.height} style={{position: "absolute", overflow: "visible"}}>
              <Walls faces={cardWalls} />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 28,
                background: palette.accent,
                transform: makeMatrix3dTransform(reduceMatrices([translateZ(-cardDepth / 2), cardTurn])),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{fontSize: 64, fontWeight: 800}}>4,1 TỶ ĐÔ</div>
              <div style={{fontSize: 22, opacity: 0.85}}>live HTML on the front face</div>
            </div>
          </div>
          <div style={label}>makeMatrix3dTransform + interpolateMatrix4d</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
