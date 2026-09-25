// Clone a voice from a recording, for faceless videos:
//
//   npm run clone-voice -- <recording> --name <name> --consent
//
// <recording>: any video or audio of the person talking (10 s or more of clear
// speech). The clearest 6-10 s sentence is picked, transcribed and cloned.
// Saves ~/.finhub-voice/<name>.pt (the profile), <name>.wav (the clip it
// learned from) and <name>-sample.wav (listen to this). Profiles live outside
// every repository: each one is a reusable copy of someone's voice.
//
// --consent confirms the voice is yours, or you have the speaker's written
// permission to clone it. Without it nothing is cloned.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { ROOT, VOICES, omnivoicePython } from "./omnivoice.mjs";

const fail = (msg) => {
  console.error(`clone-voice: ${msg}`);
  process.exit(1);
};
const USAGE = "usage: npm run clone-voice -- <recording> --name <name> --consent";
const argv = process.argv.slice(2);
const opt = (flag) => (argv.includes(flag) ? argv[argv.indexOf(flag) + 1] : undefined);
const recording = argv.find((a, k) => !a.startsWith("--") && argv[k - 1] !== "--name");
const name = opt("--name");

if (!recording) fail(USAGE);
if (!existsSync(recording)) fail(`recording not found: ${recording}`);
if (!name || !/^[a-z0-9][a-z0-9-]{0,39}$/.test(name))
  fail(`--name must be lowercase letters, digits or dashes (e.g. --name daniel). ${USAGE}`);
if (!argv.includes("--consent"))
  fail(
    "Voice cloning needs consent. Only clone your own voice, or a voice whose owner gave you written permission.\n" +
      "If that's the case, re-run with --consent. Say in the post that the voice is AI-generated.",
  );
const python = omnivoicePython();
if (!python) fail("OmniVoice isn't set up yet: run npm run setup-voice first.");

const out = join(VOICES, `${name}.pt`);
if (existsSync(out)) console.log(`Replacing the existing "${name}" profile (videos already voiced keep their audio).`);
const res = spawnSync(python, [join(ROOT, "scripts", "omnivoice-tts.py"), "clone-from", resolve(recording), out], {
  stdio: "inherit",
  env: { ...process.env, PYTHONIOENCODING: "utf-8" },
});
if (res.status !== 0) fail("cloning stopped; see the message above.");
console.log(`\nVoice "${name}" ready. Faceless videos use it with: node scripts/voice-video.mjs <slug> --voice ${name}`);
