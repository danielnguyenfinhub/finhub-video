// Prompt: https://www.remotion.dev/prompts/transparent-call-to-action-overlay
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { brand } from "../../brand/theme";
import { useTyDoFont } from "../../brand/font";
import { CTA_BUTTON, DEFAULT_CTA_QUESTION } from "../../mortgage/schema";

// End-of-video call to action as a transparent overlay: a white lower third
// slides up from the bottom centre with the logo, name and question, the
// button is "pressed" and swaps to the web address, then it all fades out.
// Nothing draws a background, so it renders with alpha:
//   npx remotion render CtaOverlay out/cta-overlay.mov --codec=prores
//     --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png
// Defaults reuse the reels' own CTA wording from mortgage/schema.
export const ctaOverlaySchema = z.object({
  name: z.string(),
  question: z.string(),
  button: z.string(),
  buttonPressed: z.string(),
});

type Props = z.infer<typeof ctaOverlaySchema>;

export const ctaOverlayDefaultProps: Props = {
  name: "Finance Hub",
  question: DEFAULT_CTA_QUESTION,
  button: CTA_BUTTON,
  buttonPressed: "finhub.net.au",
};

const PRESS_AT = 75; // button goes down
const PRESS_FRAMES = 6;
const FADE_FRAMES = 20;
const BUTTON_WIDTH = 520; // fixed, so the label swap doesn't resize it
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const CtaOverlay: React.FC<Props> = ({ name, question, button, buttonPressed }) => {
  useTyDoFont();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const opacity = interpolate(frame, [durationInFrames - FADE_FRAMES, durationInFrames], [1, 0], clamp);
  // Press in with an ease-out, release with a slightly bouncy spring.
  const released = PRESS_AT + PRESS_FRAMES;
  const pressIn = interpolate(frame, [PRESS_AT, released], [1, 0.9], { ...clamp, easing: Easing.out(Easing.quad) });
  const release = spring({ frame: frame - released, fps, config: { damping: 9, stiffness: 180, mass: 0.6 } });
  const buttonScale = frame < released ? pressIn : interpolate(release, [0, 1], [0.9, 1]);
  const done = frame >= released;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 90, fontFamily: brand.font }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 36,
          padding: "28px 36px 28px 32px",
          background: brand.card,
          borderRadius: 28,
          boxShadow: "0 18px 50px rgba(0, 0, 0, 0.28)",
          opacity,
          transform: `translateY(${interpolate(enter, [0, 1], [320, 0])}px)`,
        }}
      >
        <Img src={staticFile("brand/finhub-logo.png")} style={{ height: 96, display: "block" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, color: brand.textOnCard }}>
          <div style={{ fontSize: 40, fontWeight: 900 }}>{name}</div>
          <div style={{ fontSize: 28, fontWeight: 600, color: "#4a5876" }}>{question}</div>
        </div>
        <div
          style={{
            width: BUTTON_WIDTH,
            padding: "22px 0",
            borderRadius: 999,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 800,
            background: done ? "#e6ebf3" : brand.background,
            color: done ? brand.textOnCard : brand.text,
            transform: `scale(${buttonScale})`,
          }}
        >
          {done ? buttonPressed : button}
        </div>
      </div>
    </AbsoluteFill>
  );
};
