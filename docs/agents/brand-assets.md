# Brand assets: badges, lender logos, emoji, brand kit, src/elements

Part of the project guide; [AGENTS.md](../../AGENTS.md) is the core and routes here.

## Badges and logos: `public/badges/`

The owner's accreditation, membership and award badges, saved unchanged for their videos (end cards, lower thirds, "why choose us" slides). No showcase scene uses them. Load one with `<Img src={staticFile("badges/<file>")} />` and size it by `height` with `objectFit: "contain"`, so it never stretches.

| File | What it is | Pixels | Background |
|---|---|---|---|
| `commbank-platinum-broker-2026-27.webp` | CommBank Platinum Broker, 2026/2027 financial year | 1077×1093 | transparent; works on light and dark |
| `small-business-champion-awards-2026-finalist.jpg` | Australian Small Business Champion Awards 2026, Finalist | 500×1039 | solid white (a JPEG has no transparency) |
| `afca.png` | AFCA, Australian Financial Complaints Authority | 1163×511 | transparent, navy text |
| `connective.png` | Connective, the owner's aggregator | 1188×351 | transparent, navy text |
| `mfaa-accredited-finance-broker.png` | MFAA Accredited Finance Broker | 174×161 | transparent, navy wordmark above a navy panel |

- **Four of them need a light background.** A test render on white and on navy (`#0b1b33`) loaded all five. On navy, the Champion Awards JPG sat in a white box, and the navy text of AFCA, Connective and the MFAA wordmark disappeared. Only the CommBank badge works on dark. In a dark video, put the badge row on a white or light card.
- **The MFAA file is small** (174×161). Keep it near that size: scaled to 300px tall in the test render it was already soft. Ask the owner for a larger file if it has to be big.
- **Check the year before using one.** The CommBank badge is for the 2026/2027 financial year and the awards badge for 2026. When a new one arrives, save it next to these with its own year in the name.
- **These are other organisations' marks**, shown as the owner's credentials. Don't recolour, crop, redraw or animate their parts separately; fade, scale or slide each badge as a whole.

## Lender logos: `public/lenders/`

Logos of the lenders the owner is accredited with, so they are cleared to appear in the owner's videos; follow each lender's broker brand guidelines (clear space, minimum size, no recolouring). Show them with `LenderRow` from the brand kit, and add each new file to its `LENDERS` list.

| File | Pixels | Notes |
|---|---|---|
| `commbank.png` | 532×434 | transparent; the stacked version (diamond above the black "CommBank" wordmark), cropped around the logo. The black wordmark needs a light background |
| `westpac.png` | 632×264 | transparent; the red "W" symbol on its own, cropped around it |
| `anz.webp` | 632×356 | transparent |
| `firstmac.png` | 300×102 | transparent; small, so keep it at or below about 100px tall |
| `st-george.png` | 400×340 | white background. A stock-site copy whose fake transparency (a grey checkerboard in the pixels) was whitened; replace it with the official file from St.George's broker portal |
| `nab.png` | 703×289 | NAB's white-on-black version, cropped to its black box (the file around it had a fake checkerboard) |
| `bankwest.png` | 688×252 | Bankwest's new logo, orange on its dark grey background, cropped around the logo. The orange ribbon symbol on its own is Bankwest's old logo; don't use it |

Official files come from each lender's broker portal or brand team; SVG or transparent PNG is best. Replace a file under the same name and `LenderRow` picks it up.

## Emoji: `public/emoji/`

39 [Noto animated emoji](https://googlefonts.github.io/noto-emoji-animation/) saved as Lottie JSON (vector, so sharp at any size), picked for FinHub videos: money, calls to action, reactions, hands and celebrations. The set has no house, key or chart emoji. Show one with `<NotoEmoji name="thumbs-up" size={160} loop />` from the brand kit. The `EmojiCatalog` composition ("Brand" folder) shows every saved emoji with its name.

- **Credit:** they're CC BY 4.0, so a video that uses them credits "Noto Emoji Animation by Google, CC BY 4.0" in its description.
- **More:** `node scripts/fetch-noto-emoji.mjs rocket fire …` saves others by their `@remotion/animated-emoji` name (411 exist; `getAvailableEmojis()` lists them). Here, run it with `NODE_USE_ENV_PROXY=1`; `googlefonts.github.io` itself is blocked, but the files come from `fonts.gstatic.com`.

## Brand kit: `src/brand/`

Reusable pieces for the owner's real videos; start from these rather than writing new ones. Each animates its own entrance, so wrap it in a `<Sequence>` for timing. `BrandKitDemo` (in the "Brand" folder of the Studio, 1920×1080) shows them all with sample text.

- `BilingualCaption` (`vi`, `en`): Vietnamese main line and English line under it, following "Language" in AGENTS.md.
- `LowerThird` (`name`, `roleVi`, `roleEn`): a name with a bilingual role, sliding in from the left.
- `BadgeRow` (`height`, at most 160): the five badges on a white card, the awards badge 1.5× taller so it stays readable.
- `LenderRow` (`height`, at most 100): the lender logos from `public/lenders/` on a white card.
- `NotoEmoji` (`name`, `size`, `loop`): an animated emoji from `public/emoji/` (see "Emoji" above).
- `EndCard` (`titleVi`, `titleEn`, `website`, `phone`): closing call to action with contact details and the badge row. There are no real contact details in the repo; pass them in.
- `theme.ts`: Finance Hub's brand (first set in the retired TyDoReel): logo blue, navy, amber accent and the Be Vietnam Pro font. A composition that shows brand text calls `useTyDoFont()` (`src/brand/font.ts`) so the font's local files in `public/fonts/` load.
- `BrandOverlay` / `BrandOverlayVertical` (`name`, `roleVi`, `roleEn`, editable in the Studio's props panel): a transparent overlay for video editors, with the logo on a white pill top-right for the whole 8 s and the lower third from 1 s to 6 s. `npx remotion render BrandOverlay` (or `BrandOverlayVertical` for 1080×1920 reels) writes `out/brand-overlay.mov` as ProRes 4444 with transparency, which Final Cut Pro, Premiere Pro and DaVinci Resolve import; put it on a track above the footage.

If a second video project ever needs these, `remotion-dev/library-starter` is Remotion's template for publishing them as a package; it pins Remotion 4.0.46, so upgrade it first.

## Elements: `src/elements/`

22 checked building blocks (typewriter, ticker, Ken Burns, focus crop, before/after, audio ring, custom star-wipe transition, …) for designs and one-off videos; see `src/elements/README.md`. Each renders in the `ElementCatalog` composition ("Elements" folder). Check there before writing a new one.

