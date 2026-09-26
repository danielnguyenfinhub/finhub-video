import {useThree} from "@react-three/fiber";
import {useMemo} from "react";
import {ExtrudeGeometry, PMREMGenerator, type ShapePath} from "three";
import {RoomEnvironment, SVGLoader} from "three-stdlib";
import {LOGO_WIDTH, REMOTION_LOGO_SVG} from "./remotion-logo";

const DEPTH = 36; // SVG units, about a tenth of the logo's height
const WORLD_WIDTH = 6.5; // ~58% of the frame width with the camera in MetallicLogo3D

// The logo extruded and centred. Parsing and extrusion are synchronous, so
// there is nothing to wait for with useDelayRender; <ThreeCanvas> itself
// delays each frame until R3F has drawn it.
export const Logo3D: React.FC<{rotationY: number}> = ({rotationY}) => {
  const gl = useThree((s) => s.gl);

  const geometry = useMemo(() => {
    // The cast bridges three-stdlib's own ShapePath typing and @types/three's; same object at runtime.
    const shapes = new SVGLoader().parse(REMOTION_LOGO_SVG).paths.flatMap((p) => SVGLoader.createShapes(p as ShapePath));
    const g = new ExtrudeGeometry(shapes, {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 4,
      bevelSize: 2.5,
      bevelSegments: 3,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, []);

  // Reflections from a studio room built in code: no HDR file, no fetch.
  const envMap = useMemo(() => {
    const pmrem = new PMREMGenerator(gl);
    const texture = pmrem.fromScene(RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);

  const s = WORLD_WIDTH / LOGO_WIDTH;
  return (
    // -s on Y turns the SVG's Y-down upright; three flips the winding for a negative scale.
    <mesh geometry={geometry} rotation={[0, rotationY, 0]} scale={[s, -s, s]}>
      <meshStandardMaterial color="#e6e8eb" metalness={0.9} roughness={0.3} envMap={envMap} envMapIntensity={1.15} />
    </mesh>
  );
};
