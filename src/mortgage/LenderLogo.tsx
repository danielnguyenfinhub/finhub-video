// One lender, as the golden rule shows it: the official logo on a white tile
// when public/lenders/ has the file, else the name as a badge. Designs wrap
// this in their own frame (strap, polaroid, card) and animate the wrapper.
import type React from "react";
import { Img, staticFile } from "remotion";
import { brand } from "../brand/theme";
import type { Lender } from "./lenders";
import { FONT } from "./style";

export const LenderLogo: React.FC<{
  lender: Lender;
  height?: number; // logo height; the tile pads around it
  style?: React.CSSProperties;
}> = ({ lender, height = 64, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `${height * 0.3}px ${height * 0.45}px`,
      borderRadius: height * 0.25,
      background: brand.card,
      fontFamily: FONT,
      ...style,
    }}
  >
    {lender.file ? (
      <Img
        src={staticFile(lender.file)}
        alt={lender.name}
        style={{
          height: height * (lender.scale ?? 1),
          maxWidth: height * 5,
          objectFit: "contain",
        }}
      />
    ) : (
      <span
        style={{
          fontSize: height * 0.7,
          fontWeight: 900,
          color: brand.textOnCard,
          whiteSpace: "nowrap",
        }}
      >
        {lender.name}
      </span>
    )}
  </div>
);
