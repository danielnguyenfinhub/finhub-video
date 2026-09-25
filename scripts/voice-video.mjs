// Faceless video: voice an approved script with ElevenLabs and lay down the
// files MortgageReel reads, so the whole talking-head pipeline (cuts, RG 234,
// captions, auto charts, bank logos, outro, render-video.py) runs unchanged.
//
//   node scripts/voice-video.mjs <slug> [--dry-run]
//
// Reads public/videos/<slug>/script.json:
//   { "title": "...", "voice": "<optional voice id>",
//     "scenes": [ { "vi": "Vietnamese narration", "en": "English line",
//                   "footage": "optional 2-5 word English stock search",
//                   "ai": "optional image description: paid fal.ai fallback,
//                          used only if the free stock search finds nothing" } ],
//     "post": { "title": "...", "caption": "...", "hashtags": ["#..."] } }
// How to write one: .claude/skills/vietnamese-finance-video-editor/references/faceless-script.md
// --dry-run: RG 234 check + character count (ElevenLabs bills per character),
// no API call. Show this to Daniel for approval before a real run.
//
// Writes to public/videos/<slug>/:
//   voice/<hash>.mp3|.json  one cached take per scene (same text + voice =
//                           no new credits on a re-run)
//   source.mp4              navy frame + the narration (the core's audio)
//   foreground.webm         fully transparent, same frames (no one on screen)
//   words.json              word timings from ElevenLabs' character alignment
//   edit.json               a starter if missing (design "faceless"); if it
//                           exists, only its `subtitles` are refreshed
//
// The API key is read here only (see AGENTS.md "Third-party API keys").
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { aiClip, stockClips } from "./visuals.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MODEL_ID = "eleven_v3"; // speaks Vietnamese; eleven_multilingual_v2 doesn't
const FPS = 30;
const GAP_MS = 400; // silence between scenes
const BACKDROP = "0x0B1F3D"; // brand navy; never seen, the design draws its own
const CLIP_MAX_S = 5; // longest a single stock clip stays on screen

const fail = (msg) => {
  console.error(`voice-video: ${msg}`);
  process.exit(1);
};

const run = (cmd, args, what) => {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    fail(`${what} failed: ${(err.stderr || err.message).toString().slice(-600)}`);
  }
};

const [slug, flag] = process.argv.slice(2);
if (!slug) fail("usage: node scripts/voice-video.mjs <slug> [--dry-run]");
const dryRun = flag === "--dry-run";
const dir = join(ROOT, "public", "videos", slug);
const scriptPath = join(dir, "script.json");
if (!existsSync(scriptPath)) fail(`public/videos/${slug}/script.json not found.`);

let script;
try {
  script = JSON.parse(readFileSync(scriptPath, "utf8"));
} catch (err) {
  fail(`script.json is not valid JSON: ${err.message}`);
}
if (typeof script.title !== "string" || !script.title.trim()) fail('script.json needs a "title".');
if (!Array.isArray(script.scenes) || script.scenes.length === 0) fail('script.json needs "scenes".');
const scenes = script.scenes.map((s, i) => {
  if (typeof s?.vi !== "string" || !s.vi.trim()) fail(`scenes[${i}].vi is empty.`);
  if (typeof s?.en !== "string" || !s.en.trim()) fail(`scenes[${i}].en is empty.`);
  for (const field of ["footage", "ai"])
    if (s[field] !== undefined && (typeof s[field] !== "string" || !s[field].trim()))
      fail(`scenes[${i}].${field} must be non-empty English text.`);
  // Free before paid (Daniel's rule): "ai" is only a fallback for when the
  // free stock search finds nothing, so it needs a "footage" phrase to try
  // first. A scene still shows one or the other, never both (OpenMontage).
  if (s.ai && !s.footage)
    fail(`scenes[${i}] has "ai" without "footage": try free stock first (add a footage phrase; "ai" is the paid fallback).`);
  return {
    vi: s.vi.trim().normalize("NFC"),
    en: s.en.trim().normalize("NFC"),
    footage: s.footage?.trim() ?? "",
    ai: s.ai?.trim() ?? "",
  };
});
// Daniel's rule: elements (charts, comparisons, key points) explain; stock or
// AI visuals only fill the gaps. A scene with neither gets the plain navy
// frame, and its edit.json element holds the stage.
const withFootage = scenes.some((s) => s.footage || s.ai);
// Optional post copy for the upload (title, caption ending in a call to
// action, hashtags); it reaches clients too, so RG 234 scans it below.
const post = script.post ?? null;

// RG 234 before any credits are spent: the narration and the English lines
// reach clients just like on-screen copy. compliance.ts is bundled because Node
// can't follow its extensionless TS imports.
const bundleDir = mkdtempSync(join(tmpdir(), "voice-"));
run(process.execPath, [
  join(ROOT, "node_modules/esbuild/bin/esbuild"), join(ROOT, "src/mortgage/compliance.ts"),
  "--bundle", "--format=esm", "--platform=node", "--out-extension:.js=.mjs", `--outdir=${bundleDir}`,
], "bundling compliance.ts");
const { assertCompliantCopy } = await import(
  new URL(`file:///${join(bundleDir, "compliance.mjs").replace(/\\/g, "/")}`)
);
try {
  assertCompliantCopy(
    {
      narration: scenes.map((s) => s.vi),
      subtitles: scenes.map((s) => s.en),
      title: script.title,
      post: post ? [post.title, post.caption, ...(post.hashtags ?? [])].filter(Boolean) : [],
    },
    script.exemptions ?? [],
  );
} catch (err) {
  fail(`RG 234 blocked the script, nothing was voiced.\n${err.message}`);
}

const chars = scenes.reduce((n, s) => n + s.vi.length, 0);
console.log(`${scenes.length} scenes, ${chars} characters to voice. RG 234: passed.`);
if (withFootage) {
  console.log("Visuals:");
  scenes.forEach((s, i) =>
    console.log(
      `  ${i + 1}. ${s.footage ? `free stock "${s.footage}"${s.ai ? " (paid AI fallback ready)" : ""}` : "element (edit.json, free)"}`,
    ),
  );
  const images = scenes.filter((s) => s.ai).length;
  if (images)
    console.log(`fal.ai: at most ${images} image(s), about US$${(images * 0.03).toFixed(2)}, only where stock finds nothing.`);
}
if (dryRun) process.exit(0);

for (const envFile of [".env.local", ".env"]) {
  if (existsSync(join(ROOT, envFile))) {
    process.loadEnvFile(join(ROOT, envFile));
    break;
  }
}
const apiKey = process.env.ELEVENLABS_API_KEY;
const voice = script.voice ?? process.env.ELEVENLABS_VOICE_LIBRARY;
if (!apiKey) fail("ELEVENLABS_API_KEY is not set in .env.local.");
if (!voice) fail('No voice: set ELEVENLABS_VOICE_LIBRARY in .env.local or "voice" in script.json.');

const voiceDir = join(dir, "voice");
mkdirSync(voiceDir, { recursive: true });
const takes = [];
for (const [i, s] of scenes.entries()) {
  const hash = createHash("sha1").update(`${voice}|${MODEL_ID}|${s.vi}`).digest("hex").slice(0, 12);
  const mp3 = join(voiceDir, `${hash}.mp3`);
  const align = join(voiceDir, `${hash}.json`);
  if (!existsSync(mp3) || !existsSync(align)) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps`, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ text: s.vi, model_id: MODEL_ID }),
    });
    if (!res.ok) fail(`ElevenLabs scene ${i + 1}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
    const body = await res.json();
    if (!body.audio_base64 || !body.alignment?.characters)
      fail(`ElevenLabs scene ${i + 1}: response had no audio or alignment.`);
    writeFileSync(mp3, Buffer.from(body.audio_base64, "base64"));
    writeFileSync(align, JSON.stringify(body.alignment));
    console.log(`scene ${i + 1}/${scenes.length}: voiced`);
  } else {
    console.log(`scene ${i + 1}/${scenes.length}: cached`);
  }
  const durMs =
    1000 * Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", mp3], "ffprobe").trim());
  takes.push({ mp3, alignment: JSON.parse(readFileSync(align, "utf8")), durMs });
}

// Characters -> words. A word runs from its first character's start to its last
// character's end; punctuation stays on the word (the timeline reads "." as a
// sentence end). Leading space = a new word, as in Whisper's words.json.
const words = [];
const subtitles = [];
let offsetMs = 0;
for (const [i, t] of takes.entries()) {
  const { characters, character_start_times_seconds: st, character_end_times_seconds: en } = t.alignment;
  let cur = null;
  characters.forEach((ch, k) => {
    if (/\s/.test(ch)) {
      cur = null;
      return;
    }
    if (!cur) {
      cur = { text: " ", startMs: Math.round(offsetMs + st[k] * 1000), endMs: 0, timestampMs: null, confidence: 1 };
      words.push(cur);
    }
    cur.text += ch;
    cur.endMs = Math.round(offsetMs + en[k] * 1000);
  });
  subtitles.push({ fromMs: Math.round(offsetMs), toMs: Math.round(offsetMs + t.durMs), text: scenes[i].en });
  offsetMs += t.durMs + GAP_MS;
}
if (words.length === 0) fail("ElevenLabs returned no words.");

// Narration: every take padded with GAP_MS of silence, joined in order.
const narration = join(voiceDir, "narration.wav");
const inputs = takes.flatMap((t) => ["-i", t.mp3]);
const pads = takes.map((_, i) => `[${i}:a]aresample=48000,apad=pad_dur=${GAP_MS / 1000}[a${i}]`).join(";");
const joined = `${takes.map((_, i) => `[a${i}]`).join("")}concat=n=${takes.length}:v=0:a=1[out]`;
run("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...inputs, "-filter_complex", `${pads};${joined}`, "-map", "[out]", narration], "joining the narration");

// Gap-scene visuals (scripts/visuals.mjs): "footage" = a stock search
// (Pixabay, then Pexels), "ai" = a fal.ai still with a slow zoom. A stock
// scene longer than CLIP_MAX_S gets several clips so the picture changes at
// least that often (rule 5b). Everything is cached under voice/footage/.
let broll = null;
if (withFootage) {
  const footDir = join(voiceDir, "footage");
  mkdirSync(footDir, { recursive: true });
  // One seed per video, so its AI stills share a look (OpenMontage).
  const seed = parseInt(createHash("sha1").update(script.title).digest("hex").slice(0, 8), 16);
  const pieces = []; // { file, seconds }
  try {
    for (const [i, s] of scenes.entries()) {
      const seconds = (takes[i].durMs + GAP_MS) / 1000;
      if (s.footage) {
        // Free first (Daniel's rule): stock, and the paid AI image only when
        // stock has nothing and the scene gave an "ai" fallback prompt.
        const n = Math.max(1, Math.ceil(seconds / CLIP_MAX_S));
        let clips = null;
        try {
          clips = await stockClips(s.footage, n, footDir);
        } catch (err) {
          if (!s.ai) throw err;
          console.log(`visual ${i + 1}/${scenes.length}: stock failed (${err.message}); using the paid AI fallback`);
        }
        if (clips) {
          for (let k = 0; k < n; k++) pieces.push({ file: clips[k % clips.length], seconds: seconds / n });
          console.log(`visual ${i + 1}/${scenes.length}: "${s.footage}", ${n} free clip(s)`);
        } else {
          pieces.push({ file: await aiClip(s.ai, seconds, footDir, seed), seconds });
          console.log(`visual ${i + 1}/${scenes.length}: AI image (fal.ai, paid)`);
        }
      } else {
        pieces.push({ file: null, seconds }); // navy: an element fills this scene
      }
    }
  } catch (err) {
    fail(err.message);
  }
  const key = createHash("sha1").update(JSON.stringify(pieces)).digest("hex").slice(0, 12);
  broll = join(voiceDir, `footage-${key}.mp4`);
  if (!existsSync(broll)) {
    // Each piece: looped if the clip is short, cut to its share of the scene,
    // cropped to fill 1080x1920; then all joined in scene order.
    const inputs = pieces.flatMap((p) =>
      p.file
        ? ["-stream_loop", "-1", "-i", p.file]
        : ["-f", "lavfi", "-i", `color=c=${BACKDROP}:s=1080x1920:r=${FPS}`],
    );
    const fitted = pieces
      .map((p, k) => `[${k}:v]trim=duration=${p.seconds.toFixed(3)},setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=${FPS},setsar=1[v${k}]`)
      .join(";");
    const joinedV = `${pieces.map((_, k) => `[v${k}]`).join("")}concat=n=${pieces.length}:v=1:a=0[out]`;
    run("ffmpeg", [
      "-y", "-hide_banner", "-loglevel", "error", ...inputs, "-filter_complex", `${fitted};${joinedV}`,
      "-map", "[out]", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", broll,
    ], "joining the footage");
  }
}

// The two videos the core needs, frame for frame the same length. With
// footage, source.mp4's picture is the footage (the faceless design shows it
// behind the stage); without, a plain navy frame.
const frames = Math.ceil((offsetMs / 1000) * FPS);
const seconds = (frames / FPS).toFixed(3);
const picture = broll
  ? ["-i", broll]
  : ["-f", "lavfi", "-i", `color=c=${BACKDROP}:s=1080x1920:r=${FPS}`];
const fit = broll
  ? ["-vf", `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=${FPS},tpad=stop_mode=clone:stop_duration=10`]
  : ["-tune", "stillimage"];
run("ffmpeg", [
  "-y", "-hide_banner", "-loglevel", "error",
  ...picture, "-i", narration, "-map", "0:v", "-map", "1:a",
  "-t", seconds, "-c:v", "libx264", ...fit, "-g", "15", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "192k", "-af", "apad", join(dir, "source.mp4"),
], "writing source.mp4");
run("ffmpeg", [
  "-y", "-hide_banner", "-loglevel", "error",
  "-f", "lavfi", "-i", `color=c=black@0.0:s=1080x1920:r=${FPS},format=yuva420p`,
  "-t", seconds, "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "63",
  "-g", "15", "-auto-alt-ref", "0", join(dir, "foreground.webm"),
], "writing foreground.webm");

writeFileSync(join(dir, "words.json"), JSON.stringify(words, null, 1));
const editPath = join(dir, "edit.json");
if (existsSync(editPath)) {
  const edit = JSON.parse(readFileSync(editPath, "utf8"));
  writeFileSync(editPath, JSON.stringify({ ...edit, subtitles }, null, 2));
  console.log("edit.json exists: refreshed its subtitles only. Re-check any atMs you set by hand.");
} else {
  const edit = {
    notes: ["Faceless: voiced by scripts/voice-video.mjs from script.json."],
    design: "faceless",
    title: script.title,
    // A voiced script has no hesitations or stutters; don't cut real words.
    cut: { fillers: false, stutters: false, badWords: false },
    pacing: { mode: "off" },
    subtitles,
  };
  writeFileSync(editPath, JSON.stringify(edit, null, 2));
  console.log("edit.json written (design faceless).");
}
console.log(`${words.length} words, ${(offsetMs / 1000).toFixed(1)} s, ${frames} frames -> public/videos/${slug}/`);
