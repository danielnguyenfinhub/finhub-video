// Check for src/mortgage/golden.ts. Run: node scripts/check-golden.mjs [slug]
// [--public-dir dir] (exit 1 on failure). Synthetic captions prove the number gluing, the
// bare-count filter, stat coverage and bank detection; with a slug it also
// prints what that video's captions would produce. scripts/brief.mjs imports
// the exports below; the checks run only when this file is the entry point.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// golden.ts imports sibling .ts files without extensions (Bundler resolution),
// which Node's type stripping cannot follow, so bundle it first.
const bundle = join(mkdtempSync(join(tmpdir(), "golden-")), "golden.mjs");
execFileSync(process.execPath, [
  "node_modules/esbuild/bin/esbuild", "src/mortgage/golden.ts", "src/mortgage/timeline.ts",
  "--bundle", "--format=esm", "--platform=node", "--out-extension:.js=.mjs",
  `--outdir=${join(bundle, "..")}`,
]);
const url = (p) => new URL(`file:///${p.replace(/\\/g, "/")}`);
export const { figuresOf, lenderMentionsOf, faceHiddenOf, CUTAWAY_MAX_MS } = await import(url(bundle));
export const { buildTimeline } = await import(url(join(bundle, "..", "timeline.mjs")));
export const FPS = 30;

export const words = (text) =>
  text.split(" ").map((w, i) => ({
    text: ` ${w}`, startMs: i * 400, endMs: i * 400 + 300, timestampMs: null, confidence: null,
  }));
export const reelOf = (wordList, edit = {}) => {
  const timeline = buildTimeline(wordList, { title: "t", ...edit }, FPS);
  return { edit: { title: "t", ...edit }, timeline };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let failed = false;
  const check = (name, ok, detail = "") => {
    console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? `  (${detail})` : ""}`);
    if (!ok) failed = true;
  };

  // "4" ".1" glue; "1 năm" and "2 người" are counts, "5 triệu" is a figure;
  // "100" ".000" "%" glues. Words 400 ms apart, so figures 4 s apart survive.
  // Distinct fillers: a repeated word would be auto-cut as a stutter.
  const w = words("dân Úc trả 4 .1 tỷ đô trong 1 năm với 2 người rồi sau đó họ thấy 5 triệu là con số mà nhiều người hay quên mất đi khi tính tổng chi phí 100 .000 % xong");
  // Whisper glues: no leading space on the continuation tokens.
  w[4].text = ".1";
  w[36].text = ".000";
  w[37].text = "%";
  const figs = figuresOf(reelOf(w), FPS);
  check("glued 4.1", figs.some((f) => f.big === "4.1"), figs.map((f) => f.big).join(" | "));
  check("1 năm dropped", !figs.some((f) => f.big === "1"));
  check("bare 2 dropped", !figs.some((f) => f.big === "2"));
  check("5 triệu kept", figs.some((f) => f.big === "5"), JSON.stringify(figs.map((f) => [f.big, f.fromFrame])));
  check("100.000% glued", figs.some((f) => f.big === "100.000%"));
  check("all auto", figs.every((f) => f.source === "auto"));
  const pct = figuresOf(reelOf(words("lãi suất hiện là 6 phần trăm mỗi năm")), FPS);
  check("6 phần trăm -> 6%", pct.some((f) => f.big === "6%"), pct.map((f) => f.big).join(" | "));

  // A stat over the number replaces the automatic figure.
  const covered = figuresOf(
    reelOf(w, { stats: [{ atMs: 1000, durMs: 3000, big: "4,1 tỷ", label: "mỗi năm" }] }),
    FPS,
  );
  check("stat covers 4.1", !covered.some((f) => f.source === "auto" && f.big === "4.1"));
  check("stat present", covered.some((f) => f.source === "stat"));

  // Banks: aliases, multi-word, a repeat inside the 2.5 s window merges, a
  // later repeat (4 s on) is its own mention.
  const b = reelOf(words("vay ở ANZ ANZ hoặc Commonwealth Bank, St George thì sao, rồi mình xem lại ANZ nữa"));
  const m = lenderMentionsOf(b);
  check("ANZ + CommBank + St.George + ANZ", m.map((x) => x.lender.name).join(",") === "ANZ,CommBank,St.George,ANZ", m.map((x) => x.lender.name).join(","));
  check("adjacent ANZ merged", m.filter((x) => x.lender.name === "ANZ").length === 2);
  check("mention >= 2.5 s", m.every((x) => x.endMs - x.startMs >= 2500));

  // Visuals: a cutaway hides the face, pip does not; too long fails, over a
  // spoken number is flagged ("4" ".1" is said at 1.2 s source, "5 triệu" at
  // 7.2 s, "100.000%" at 14 s).
  const cutaway = (atMs, durMs, mode = "cutaway") => ({ mode, atMs, durMs, asset: "library/stock-video/x.mp4" });
  const fh = (visuals) => faceHiddenOf(reelOf(w, { visuals }), FPS);
  const overNum = fh([cutaway(1000, 1000)]);
  check("cutaway over 4.1 flagged", overNum.overNumbers.some((n) => n.big === "4.1"), JSON.stringify(overNum));
  check("pip hides nothing", fh([cutaway(1000, 3000, "pip")]).totalMs === 0);
  const long = fh([cutaway(7800, CUTAWAY_MAX_MS + 500)]);
  check("long cutaway fails", long.tooLong.length === 1 && long.overNumbers.length === 0, JSON.stringify(long));
  const two = fh([cutaway(8000, 2000), cutaway(9000, 2000)]);
  // Output ms: pacing speeds the talk up, so the second starts < 1 s after the first.
  check("overlapping cutaways merge", two.longestMs === two.totalMs && two.longestMs > 2000 && two.longestMs < 4000, JSON.stringify(two));

  const [slug, dirFlag, dirArg] = process.argv.slice(2);
  const pub = dirFlag === "--public-dir" ? dirArg : "public";
  if (slug) {
    const { recordingPath } = await import(url(join(process.cwd(), "src", "mortgage", "recording.ts")));
    const edit = JSON.parse(readFileSync(`${pub}/videos/${slug}/edit.json`, "utf8"));
    const src = JSON.parse(readFileSync(`${pub}/${recordingPath(slug, edit.source, "words.json")}`, "utf8"));
    const reel = reelOf(src, edit);
    const f = figuresOf(reel, FPS);
    console.log(`\n${slug}: ${f.length} figures (${f.filter((x) => x.source === "stat").length} stats)`);
    for (const x of f) console.log(`  ${(x.fromFrame / FPS).toFixed(1)}s ${x.source} ${x.big}  — ${x.label}`);
    const l = lenderMentionsOf(reel);
    console.log(`${slug}: ${l.length} bank mentions`);
    for (const x of l) console.log(`  ${(x.startMs / 1000).toFixed(1)}s ${x.lender.name}`);
    const h = faceHiddenOf(reel, FPS);
    console.log(`${slug}: face hidden ${(h.totalMs / 1000).toFixed(1)} s in total, longest ${(h.longestMs / 1000).toFixed(1)} s (limit ${CUTAWAY_MAX_MS / 1000} s per cutaway, untuned)`);
    for (const x of h.tooLong) check(`cutaway at ${x.atMs} ms is ${(x.durMs / 1000).toFixed(1)} s, over the face limit`, false);
    for (const x of h.overNumbers) console.log(`FLAG cutaway at ${x.atMs} ms covers the spoken number ${x.big}: a figure drawn behind Daniel is hidden with him; move or shorten it`);
  }

  process.exit(failed ? 1 : 0);
}
