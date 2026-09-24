// Caption pages that respect sentences. createTikTokStyleCaptions groups words
// by timing alone, so a page could run across a full stop ("…các bạn. Các bạn…")
// or end on a word that belongs with the next one ("…khoản vay của | bạn").
// Here a sentence-ending word forces a page break (the library's own
// pageBreakAfter), then each remaining boundary that isn't a sentence end or a
// pause is nudged by one word off a Vietnamese function word.
// ponytail: no width balancing between the two caption lines (the source
// algorithm in remotion/packages/jonnys-videos measures text for that); add it
// if pages start wrapping unevenly.
import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokPage,
  type TikTokToken,
} from "@remotion/captions";

const SENTENCE_END = /[.!?…]["'”’)\]]*$/u;
// Words that lean on the word after them: a page shouldn't end on one.
const LEANS_FORWARD = new Set([
  "và",
  "của",
  "cho",
  "là",
  "thì",
  "mà",
  "với",
  "để",
  "các",
  "những",
  "một",
  "rất",
  "đã",
  "sẽ",
  "đang",
  "được",
  "bị",
  "khi",
  "nếu",
  "vì",
  "nhưng",
  "hoặc",
  "từ",
  "đến",
  "trong",
  "trên",
  "về",
  "theo",
  "bằng",
  "tại",
  "do",
  "nên",
  "cũng",
]);
// Words that lean on the word before them: a page shouldn't start with one.
const LEANS_BACK = new Set([
  "này",
  "đó",
  "ấy",
  "nhé",
  "nha",
  "ạ",
  "luôn",
  "nữa",
  "thôi",
]);

const bare = (text: string) =>
  text
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/^["'“‘(]+|[.,!?…:;"'”’)]+$/gu, "");

export const captionPages = ({
  captions,
  combineWithinMs,
  breakOnSilenceAfterMs,
}: {
  captions: Caption[];
  combineWithinMs: number;
  breakOnSilenceAfterMs: number;
}): TikTokPage[] => {
  const marked = captions.map((c) =>
    SENTENCE_END.test(c.text.trim()) ? { ...c, pageBreakAfter: true } : c,
  );
  const { pages } = createTikTokStyleCaptions({
    captions: marked,
    combineTokensWithinMilliseconds: combineWithinMs,
    breakOnSilenceAfterMilliseconds: breakOnSilenceAfterMs,
  });
  const tokens: TikTokToken[][] = pages.map((p) => [...p.tokens]);
  const ends = pages.map((p) => p.startMs + p.durationMs);
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i];
    const b = tokens[i + 1];
    const last = a[a.length - 1];
    const natural =
      SENTENCE_END.test(last.text.trim()) ||
      b[0].fromMs - last.toMs >= breakOnSilenceAfterMs;
    if (natural) continue;
    if (a.length > 1 && LEANS_FORWARD.has(bare(last.text))) b.unshift(a.pop()!);
    else if (b.length > 1 && LEANS_BACK.has(bare(b[0].text)))
      a.push(b.shift()!);
    else continue;
    ends[i] = b[0].fromMs; // this page now ends where the next one starts
  }
  // The library trims each page's first word, so moving a word across a
  // boundary loses its space. Restore every word's original text (a glued
  // token such as ".1" in "4.1" has no space, and must stay that way), then
  // trim only the first word of each page.
  const original = new Map(
    captions.map((c) => [`${c.startMs}|${c.endMs}|${c.text.trim()}`, c.text]),
  );
  const spaced = tokens.map((t) =>
    t.map((k, j) => {
      const text =
        original.get(`${k.fromMs}|${k.toMs}|${k.text.trim()}`) ?? k.text;
      return { ...k, text: j === 0 ? text.trimStart() : text };
    }),
  );
  return spaced.map((t, i) => ({
    text: t.map((k) => k.text).join(""),
    startMs: t[0].fromMs,
    durationMs: ends[i] - t[0].fromMs,
    tokens: t,
  }));
};
