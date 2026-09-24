// A 3D ring of image cards (property photos, video thumbnails) that turns one
// card every `holdFrames`, springing into place. Every image is loaded before
// the first frame renders (delayRender), so no frame shows a blank card, and a
// missing image stops the render instead of shipping one. Cards show their
// front only: a card seen from behind would be a mirror image.
// Not for lender logos: brand guidelines forbid distorting them; use LenderRow.
import { ThreeCanvas } from "@remotion/three";
import type React from "react";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";

const CARD_HEIGHT = 2.4;
const MAX_CARD_WIDTH = 3.4;
// Camera distance in front of the nearest card: at 1080x1920 the view is
// narrow, so this keeps a full-width card at about 65% of the frame.
const CAMERA_GAP = 10;

const Ring: React.FC<{
  textures: THREE.Texture[];
  radius: number;
  holdFrames: number;
}> = ({ textures, radius, holdFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = (Math.PI * 2) / textures.length;
  const k = Math.floor(frame / holdFrames);
  const p =
    k === 0
      ? 0
      : spring({
          frame: frame - k * holdFrames,
          fps,
          config: { damping: 14, stiffness: 80 },
        });
  return (
    <group rotation={[0, -Math.max(0, k - 1 + p) * step, 0]}>
      {textures.map((tex, i) => {
        const img = tex.image as { width: number; height: number };
        const w = Math.min(
          MAX_CARD_WIDTH,
          (img.width / img.height) * CARD_HEIGHT,
        );
        const a = i * step;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]}
            rotation={[0, a, 0]}
          >
            <planeGeometry args={[w, (w / img.width) * img.height]} />
            <meshBasicMaterial map={tex} side={THREE.FrontSide} transparent />
          </mesh>
        );
      })}
    </group>
  );
};

export const ImageCarousel: React.FC<{
  images: string[]; // staticFile() URLs
  radius?: number;
  holdFrames?: number;
}> = ({ images, radius = 4, holdFrames = 45 }) => {
  const { width, height } = useVideoConfig();
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading carousel images"));
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all(images.map((src) => loader.loadAsync(src)))
      .then((loaded) => {
        loaded.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
        setTextures(loaded);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [images, handle, continueRender, cancelRender]);

  return (
    <AbsoluteFill>
      {textures ? (
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, radius + CAMERA_GAP], fov: 50 }}
        >
          <Sequence layout="none">
            <Ring textures={textures} radius={radius} holdFrames={holdFrames} />
          </Sequence>
        </ThreeCanvas>
      ) : null}
    </AbsoluteFill>
  );
};
