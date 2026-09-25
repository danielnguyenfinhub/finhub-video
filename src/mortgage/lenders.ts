// Golden rule: when Daniel names a bank, its logo shows. The lenders, the ways
// a transcript spells them, and their logo in public/lenders/ (none yet =
// a name badge instead; drop the official file in and set `file`).
// Logos only name the bank Daniel is talking about; nothing on screen may
// suggest the bank made or endorses the video.
import type { OutCaption } from "./timeline";

export type Lender = {
  name: string; // shown on the badge and scanned by RG 234
  file?: string; // under public/, e.g. "lenders/anz.webp"
  scale?: number; // evens out logo shapes at one height
  aliases: string[]; // lower-case, as Whisper writes them
};

export const LENDERS: Lender[] = [
  {
    name: "CommBank",
    file: "lenders/commbank.png",
    scale: 1.3,
    aliases: ["commbank", "commonwealth", "cba"],
  },
  {
    name: "Westpac",
    file: "lenders/westpac.png",
    scale: 0.7,
    aliases: ["westpac"],
  },
  { name: "ANZ", file: "lenders/anz.webp", scale: 0.9, aliases: ["anz"] },
  {
    name: "NAB",
    file: "lenders/nab.png",
    scale: 0.8,
    aliases: ["nab", "national australia bank"],
  },
  {
    name: "St.George",
    file: "lenders/st-george.png",
    scale: 1.3,
    aliases: ["st.george", "st george", "saint george"],
  },
  {
    name: "Bankwest",
    file: "lenders/bankwest.png",
    scale: 0.8,
    aliases: ["bankwest", "bank west"],
  },
  {
    name: "firstmac",
    file: "lenders/firstmac.png",
    scale: 0.8,
    aliases: ["firstmac", "first mac"],
  },
  { name: "Macquarie", aliases: ["macquarie"] },
  { name: "ING", aliases: ["ing"] },
  { name: "Suncorp", aliases: ["suncorp"] },
  { name: "Bank of Melbourne", aliases: ["bank of melbourne"] },
  { name: "BankSA", aliases: ["banksa", "bank sa"] },
  { name: "Bendigo Bank", aliases: ["bendigo"] },
  { name: "AMP", aliases: ["amp"] },
  { name: "HSBC", aliases: ["hsbc"] },
  { name: "Great Southern Bank", aliases: ["great southern"] },
  { name: "Pepper Money", aliases: ["pepper"] },
  { name: "Liberty", aliases: ["liberty"] },
];

export type LenderMention = { lender: Lender; startMs: number; endMs: number };

// A logo shows at least this long, and a repeat of the same bank inside it
// extends the one already up instead of popping a second.
export const MENTION_MIN_MS = 2500;

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[,!?;:"“”()…]/g, "")
    .trim();

// Talk-timeline captions -> where each bank is named, merged per bank.
export const findLenderMentions = (captions: OutCaption[]): LenderMention[] => {
  const toks = captions.map((c) => norm(c.text).replace(/\.$/, ""));
  const hits: LenderMention[] = [];
  toks.forEach((_, i) => {
    for (const lender of LENDERS) {
      // "st.george" is one token, "st george" two.
      const matched = lender.aliases.some((a) =>
        a.split(" ").every((p, j) => toks[i + j] === p),
      );
      if (!matched) continue;
      const endMs = Math.max(
        captions[i].endMs,
        captions[i].startMs + MENTION_MIN_MS,
      );
      const last = [...hits].reverse().find((h) => h.lender === lender);
      if (last && captions[i].startMs <= last.endMs)
        last.endMs = Math.max(last.endMs, endMs);
      else hits.push({ lender, startMs: captions[i].startMs, endMs });
    }
  });
  return hits.sort((a, b) => a.startMs - b.startMs);
};
