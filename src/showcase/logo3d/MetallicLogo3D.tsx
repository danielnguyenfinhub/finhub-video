import {ThreeCanvas} from "@remotion/three";
import {interpolate, useCurrentFrame, useVideoConfig, type CalculateMetadataFunction} from "remotion";
import {Glitch} from "./Glitch";
import {Logo3D} from "./Logo3D";

// Transparent ProRes 4444 by default, per the transparent-videos guide, so a
// plain `npx remotion render MetallicLogo3D` gives After Effects an alpha .mov.
export const calculateMetallicLogo3DMetadata: CalculateMetadataFunction<Record<string, unknown>> = () => ({
  defaultCodec: "prores",
  defaultProResProfile: "4444",
  defaultPixelFormat: "yuva444p10le",
  defaultVideoImageFormat: "png",
  defaultOutName: "metallic-logo-3d",
});

// The Remotion logo in brushed silver on a transparent background. It turns
// from -90 to +90 degrees across the composition (one loop = its whole
// duration) and snaps back, so its back is never shown.
export const MetallicLogo3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const rotationY = interpolate(frame, [0, durationInFrames], [-Math.PI / 2, Math.PI / 2]);

  return (
    <Glitch>
      <ThreeCanvas width={width} height={height} camera={{position: [0, 0, 10], fov: 35}} gl={{alpha: true}}>
        {/* Key from front-top, fills from both sides so the turned face stays silver, rim from behind. */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 3, 8]} intensity={2.2} />
        <directionalLight position={[-7, 1, 3]} intensity={1.2} />
        <directionalLight position={[7, -1, 3]} intensity={1.2} />
        <directionalLight position={[0, 3, -6]} intensity={1.5} />
        <Logo3D rotationY={rotationY} />
      </ThreeCanvas>
    </Glitch>
  );
};
