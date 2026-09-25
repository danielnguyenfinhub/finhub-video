// Gap-scene visuals for faceless videos (scripts/voice-video.mjs). Elements
// explain; these only fill the scenes in between (Daniel's rule).
//
//   stockClips(term, need, dir): portrait-first stock clips, Pixabay then
//     Pexels, whichever has a key in .env.local (PIXABAY_API_KEY,
//     PEXELS_API_KEY).
//   aiClip(prompt, seconds, dir, seed): a fal.ai FLUX still (FAL_KEY) turned
//     into a slow-zoom clip, for when stock has nothing that fits.
//
// Ideas from OpenMontage (danielnguyenfinhub/OpenMontage): download at once
// (Pixabay and fal links expire), cache files so re-runs reuse them, never mix
// stock and AI in one scene, one style anchor + one seed so AI stills match.
// Every search and file is cached in `dir`; functions throw plain errors.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MIN_CLIP_S = 3; // skip stock clips shorter than this
const MIN_WIDTH = 720; // cropped to 1080x1920 later; below this looks soft
const FPS = 30;
// Appended to every AI prompt so stills share one look (on-brand, no text,
// nobody identifiable: nothing that could pass for a real client).
const AI_STYLE =
  "photorealistic editorial photo, soft natural light, cool navy and warm amber tones, shallow depth of field, vertical 9:16 composition, no text, no logos, no watermark, people seen from behind or out of focus";
const AI_MODEL = "fal-ai/flux/dev"; // ~US$0.03 per image (OpenMontage's estimate)

const hash = (s) => createHash("sha1").update(s).digest("hex").slice(0, 12);

// Both APIs return popular clips even for nonsense searches, so "found
// something" says nothing. A clip counts only if its own words (Pixabay tags,
// the title in a Pexels link) share a word with the search; the first 5
// letters are compared, so "bills"/"bill" and "documents"/"document" match.
// ponytail: word overlap, not meaning; add a CLIP score (as OpenMontage does)
// if relevant-looking but wrong clips keep getting through.
const STOP = new Set(["and", "the", "with", "for", "from", "of", "in", "on", "at", "a", "an"]);
const stems = (text) =>
  new Set(
    text
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length >= 3 && !STOP.has(w))
      .map((w) => w.slice(0, 5)),
  );
// How many search words the clip's own words share; a multi-word search
// needs two ("couple reviewing documents" must not pass on "couple" alone).
const overlap = (term, text) => {
  const have = stems(text);
  return [...stems(term)].filter((s) => have.has(s)).length;
};
const relevant = (term, text) => overlap(term, text) >= Math.min(2, stems(term).size);

const download = async (url, path) => {
  if (existsSync(path)) return true;
  const res = await fetch(url);
  if (!res.ok) return false; // one dead link shouldn't sink the video
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
  return true;
};

const cachedJson = async (file, get) => {
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  const data = await get();
  writeFileSync(file, JSON.stringify(data));
  return data;
};

// Pixabay has no orientation filter for videos: portrait hits are tried
// first, landscape ones after (they get centre-cropped). Searches must be
// cached for 24 h by its terms; ours are cached for good.
const pixabay = async (term, need, key, dir) => {
  const hits = await cachedJson(join(dir, `pixabay-${hash(term)}.json`), async () => {
    const q = new URLSearchParams({ key, q: term.slice(0, 100), per_page: "30", safesearch: "true", video_type: "film" });
    const res = await fetch(`https://pixabay.com/api/videos/?${q}`);
    if (!res.ok) throw new Error(`Pixabay search "${term}": HTTP ${res.status}`);
    return (await res.json()).hits ?? [];
  });
  const files = hits
    .filter((h) => (h.duration ?? 0) >= MIN_CLIP_S && relevant(term, h.tags ?? ""))
    .map((h) => {
      // Smallest file that is still >= 1080 wide (Pixabay's "large" is often
      // 4K, ~25 MB), else the best one above MIN_WIDTH.
      const sizes = ["small", "medium", "large"].map((k) => h.videos?.[k]).filter((v) => v?.url);
      const f = sizes.find((v) => v.width >= 1080) ?? [...sizes].reverse().find((v) => v.width >= MIN_WIDTH);
      return f
        ? { id: `pixabay-${h.id}`, url: f.url, portrait: f.height > f.width, score: overlap(term, h.tags ?? "") }
        : null;
    })
    .filter(Boolean)
    // Best word match first, portrait before landscape at the same score.
    .sort((a, b) => b.score - a.score || Number(b.portrait) - Number(a.portrait));
  const picks = [];
  for (const f of files) {
    if (picks.length >= need) break;
    const path = join(dir, `${f.id}.mp4`);
    if (await download(f.url, path)) picks.push(path);
  }
  return picks;
};

// Same request as MoneyPrinterTurbo's search_videos_pexels.
const pexels = async (term, need, key, dir) => {
  const videos = await cachedJson(join(dir, `pexels-${hash(term)}.json`), async () => {
    const q = new URLSearchParams({ query: term, orientation: "portrait", per_page: "15" });
    const res = await fetch(`https://api.pexels.com/v1/videos/search?${q}`, { headers: { Authorization: key } });
    if (!res.ok) throw new Error(`Pexels search "${term}": HTTP ${res.status}`);
    return (await res.json()).videos ?? [];
  });
  const picks = [];
  for (const v of videos) {
    if (picks.length >= need) break;
    if ((v.duration ?? 0) < MIN_CLIP_S || !relevant(term, v.url ?? "")) continue;
    const file = (v.video_files ?? [])
      .filter((f) => f.height > f.width && f.width >= 1080)
      .sort((a, b) => a.width - b.width)[0];
    if (!file) continue;
    const path = join(dir, `pexels-${v.id}-${file.id}.mp4`);
    if (await download(file.link, path)) picks.push(path);
  }
  return picks;
};

export const stockClips = async (term, need, dir) => {
  const providers = [
    [pixabay, process.env.PIXABAY_API_KEY],
    [pexels, process.env.PEXELS_API_KEY],
  ].filter(([, key]) => key);
  if (providers.length === 0)
    throw new Error(
      "A scene asks for stock footage but neither PIXABAY_API_KEY nor PEXELS_API_KEY is set in .env.local.",
    );
  for (const [provider, key] of providers) {
    const picks = await provider(term, need, key, dir);
    if (picks.length > 0) return picks;
  }
  throw new Error(`No stock clip found for "${term}"; try a broader 2-5 word phrase, or an "ai" prompt.`);
};

// fal.ai: synchronous POST to fal.run (images return in seconds), then a slow
// centre zoom so the still reads as footage. Cached by prompt + seed.
export const aiClip = async (prompt, seconds, dir, seed) => {
  const key = process.env.FAL_KEY ?? process.env.FAL_AI_API_KEY;
  if (!key) throw new Error("A scene asks for an AI image but FAL_KEY is not set in .env.local.");
  const id = hash(`${AI_MODEL}|${prompt}|${seed}`);
  const still = join(dir, `fal-${id}.jpg`);
  if (!existsSync(still)) {
    const res = await fetch(`https://fal.run/${AI_MODEL}`, {
      method: "POST",
      headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${prompt}. ${AI_STYLE}`,
        image_size: { width: 864, height: 1536 }, // exact 9:16, multiples of 16
        num_images: 1,
        seed,
        enable_safety_checker: true,
      }),
    });
    if (!res.ok) throw new Error(`fal.ai image: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
    const url = (await res.json()).images?.[0]?.url;
    if (!url || !(await download(url, still))) throw new Error("fal.ai returned no image.");
  }
  const frames = Math.max(1, Math.round(seconds * FPS));
  const clip = join(dir, `fal-${id}-${frames}.mp4`);
  if (!existsSync(clip)) {
    // Upscale first so zoompan's integer steps don't jitter; zoom 1 -> 1.12.
    execFileSync("ffmpeg", [
      "-y", "-hide_banner", "-loglevel", "error", "-i", still,
      "-vf", `scale=2160:3840,zoompan=z='1+0.12*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=${FPS}`,
      "-frames:v", String(frames), "-c:v", "libx264", "-pix_fmt", "yuv420p", clip,
    ]);
  }
  return clip;
};
