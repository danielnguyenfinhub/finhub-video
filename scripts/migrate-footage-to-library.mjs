// Imports the per-slug voice/footage/ binaries into the source library
// (scripts/library.mjs), one copy per sha256.
//
//   node scripts/migrate-footage-to-library.mjs [--media-root <public/>] [--apply]
//
// Dry run (default): per file its hash, where it is, where it would go and its
// keywords, then the per-slug copies it would delete afterwards. Nothing is
// written. --apply copies into <media-root>/library/ through library.add
// (which dedupes by sha256 and merges keywords and usedIn), writes the meta,
// rebuilds index.json, and prints, but does not run, the deletions. Running
// it again changes nothing. Daniel runs --apply himself in the main checkout.
//
// Keywords come from the scene that produced the file: the footage phrase
// whose search cache (pixabay-/pexels-<hash>.json) lists the clip and whose
// words it passes (visuals.mjs `relevant`), or the "ai"
// prompt whose fal-<hash>.jpg it is. A file no current scene explains keeps
// its provider id and the provider's own tags, flagged keywordsUnverified.
// The search caches and the derived fal-<id>-<frames>.mp4 zoom clips stay.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { add, index, load, sha256, targetFor } from "./library.mjs";
import { AI_MODEL, aiLicence, hash, pexelsMeta, pixabayMeta, relevant } from "./visuals.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const at = argv.indexOf("--media-root");
const mediaRoot = resolve(at >= 0 ? argv[at + 1] ?? "" : join(ROOT, "public"));
const apply = argv.includes("--apply");
const lib = join(mediaRoot, "library");
const videos = join(mediaRoot, "videos");
if (!existsSync(videos)) {
  console.error(`migrate: ${videos} not found; pass --media-root <path to public/>.`);
  process.exit(1);
}

const readJson = (f) => {
  try {
    return JSON.parse(readFileSync(f, "utf8"));
  } catch {
    return null; // an unreadable cache or script only costs its keywords
  }
};
const mb = (n) => `${(n / 1e6).toFixed(1)} MB`;
const localDate = (ms) => new Date(ms).toLocaleDateString("en-CA"); // YYYY-MM-DD, this machine's zone

// What each slug's caches and script say about its files: id -> { terms, item }.
const describe = (slug, footDir) => {
  const script = readJson(join(videos, slug, "script.json"));
  const scenes = script?.scenes ?? [];
  const termByHash = new Map(scenes.filter((s) => s.footage).map((s) => [hash(s.footage.trim()), s.footage.trim()]));
  const seed = script?.title ? parseInt(createHash("sha1").update(script.title).digest("hex").slice(0, 8), 16) : null;
  const ai = new Map(
    scenes
      .filter((s) => s.ai)
      .map((s) => [hash(`${AI_MODEL}|${s.ai.trim()}|${seed}`), { prompt: s.ai.trim(), footage: s.footage?.trim(), seed }]),
  );
  const ids = new Map();
  for (const f of readdirSync(footDir)) {
    const m = f.match(/^(pixabay|pexels)-([0-9a-f]{12})\.json$/);
    if (!m) continue;
    const term = termByHash.get(m[2]);
    for (const item of readJson(join(footDir, f)) ?? []) {
      const files = m[1] === "pixabay" ? [`pixabay-${item.id}`] : (item.video_files ?? []).map((v) => `pexels-${item.id}-${v.id}`);
      for (const id of files) {
        const d = ids.get(id) ?? { terms: new Set(), provider: m[1], item };
        // Listed is not picked: count the search only if the clip passed the
        // same word test it had to pass to be downloaded.
        if (term && relevant(term, m[1] === "pixabay" ? item.tags ?? "" : item.url ?? "")) d.terms.add(term);
        ids.set(id, d);
      }
    }
  }
  return { ids, ai };
};

// Library meta for one binary, from the provider's cached answer.
const metaFor = (name, size, info, ai) => {
  const fal = name.match(/^fal-([0-9a-f]{12})\.jpg$/);
  if (fal) {
    const a = ai.get(fal[1]);
    return {
      kind: "ai-image",
      provider: "fal",
      model: AI_MODEL,
      prompt: a?.prompt ?? null,
      seed: a?.seed ?? null,
      licence: aiLicence(AI_MODEL),
      width: 864,
      height: 1536,
      keywords: a?.footage ? { en: [a.footage] } : { synonyms: [`fal-${fal[1]}`] },
      ...(a?.footage ? {} : { keywordsUnverified: true }),
    };
  }
  const id = name.replace(/\.mp4$/, "");
  const [provider] = id.split("-");
  const it = info?.item;
  let base = { provider };
  if (it && provider === "pixabay") {
    const f = Object.values(it.videos ?? {}).find((v) => v?.size === size);
    base = pixabayMeta(it, f);
  } else if (it && provider === "pexels") {
    base = pexelsMeta(it, (it.video_files ?? []).find((v) => id.endsWith(`-${v.id}`)));
  }
  const terms = [...(info?.terms ?? [])];
  if (terms.length) return { ...base, kind: "stock-video", keywords: { en: terms } };
  // No current scene explains the clip: keep what the provider says it shows.
  const own = provider === "pixabay"
    ? (it?.tags ?? "").split(",").map((t) => t.trim())
    : [(it?.url ?? "").replace(/\/+$/, "").split("/").pop()?.replace(/-\d+$/, "").replace(/-/g, " ") ?? ""];
  return { ...base, kind: "stock-video", keywords: { synonyms: [id, ...own] }, keywordsUnverified: true };
};

const groups = new Map(); // sha256 -> { copies: [{ path, slug }], meta, size, ext }
let files = 0;
let bytes = 0;
const derived = [];
for (const slug of readdirSync(videos).sort()) {
  const footDir = join(videos, slug, "voice", "footage");
  if (!existsSync(footDir)) continue;
  const { ids, ai } = describe(slug, footDir);
  for (const name of readdirSync(footDir).sort()) {
    if (/^fal-[0-9a-f]{12}-\d+\.mp4$/.test(name)) {
      derived.push(join(footDir, name));
      continue;
    }
    if (!/^(pixabay-\d+|pexels-\d+-\d+)\.mp4$|^fal-[0-9a-f]{12}\.jpg$/.test(name)) continue;
    const path = join(footDir, name);
    const size = statSync(path).size;
    const sha = sha256(path);
    files++;
    bytes += size;
    const meta = metaFor(name, size, ids.get(name.replace(/\.mp4$/, "")), ai);
    const g = groups.get(sha);
    if (!g) {
      groups.set(sha, { copies: [{ path, slug }], meta: { ...meta, date: localDate(statSync(path).mtimeMs), usedIn: [slug] }, size, ext: extname(name) });
      continue;
    }
    g.copies.push({ path, slug });
    g.meta.usedIn.push(slug);
    const k = g.meta.keywords;
    const en = [...new Set([...(k.en ?? []), ...(meta.keywords.en ?? [])])];
    if (en.length) {
      g.meta.keywords = { ...k, en };
      delete g.meta.keywordsUnverified;
    }
  }
}

const existing = new Map(load(lib).map((e) => [e.meta.sha256, e.file]));
let unique = 0;
let dupes = 0;
let saved = 0;
for (const [sha, g] of groups) {
  unique += g.size;
  if (g.copies.length > 1) {
    dupes++;
    saved += g.size * (g.copies.length - 1);
  }
  const to = existing.get(sha) ?? targetFor({ ...g.meta, sha256: sha }, g.ext, lib);
  const k = g.meta.keywords;
  console.log(`${sha.slice(0, 8)}  ${mb(g.size)}${g.copies.length > 1 ? `  x${g.copies.length} (dedupe)` : ""}`);
  g.copies.forEach((c) => console.log(`  from ${c.path}`));
  console.log(`  to   ${to}${existing.has(sha) ? " (already in library)" : ""}`);
  console.log(`  keywords ${JSON.stringify([...(k.en ?? []), ...(k.synonyms ?? [])])}${g.meta.keywordsUnverified ? "  keywordsUnverified: CHECK" : ""}`);
}
const unverified = [...groups.values()].filter((g) => g.meta.keywordsUnverified).length;
console.log(
  `\n${files} file(s), ${mb(bytes)} in the slug caches -> ${groups.size} unique, ${mb(unique)} in the library; ` +
    `${dupes} deduped (${mb(saved)} saved); ${unverified} with unverified keywords; ${derived.length} derived zoom clip(s) left in place.`,
);

if (apply) {
  for (const [sha, g] of groups) {
    const r = add(g.copies[0].path, g.meta, { lib });
    if (sha256(r.path) !== sha) throw new Error(`hash check failed for ${r.path}; nothing should be deleted.`);
  }
  console.log(`library: ${index(lib).length} entries in ${join(lib, "index.json")}`);
}
console.log(apply ? "\nNext, delete the per-slug copies (not run; every hash above is verified in the library):" : "\nAfter --apply, these per-slug copies can be deleted:");
for (const g of groups.values()) g.copies.forEach((c) => console.log(`  rm "${c.path.replace(/\\/g, "/")}"`));
