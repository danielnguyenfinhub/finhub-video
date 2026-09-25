// Where OmniVoice lives, shared by setup-omnivoice, clone-voice and voice-video.
//   code      vendor/OmniVoice (git submodule)
//   Python    .omnivoice/venv in this project (npm run setup-voice), or
//             OMNIVOICE_PYTHON; the older ~/OmniVoice/.venv-cpu still works
//   voices    ~/.finhub-voice/<name>.pt: outside every repository, because a
//             profile is a reusable copy of someone's voice
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const VENDOR = join(ROOT, "vendor", "OmniVoice");
export const VENV = join(ROOT, ".omnivoice", "venv");
export const VOICES = join(homedir(), ".finhub-voice");
const bin = (venv) => (process.platform === "win32" ? join(venv, "Scripts", "python.exe") : join(venv, "bin", "python"));
export const VENV_PYTHON = bin(VENV);
// Written by setup-voice only after its last step (the models load), and
// removed when it starts: the venv's python.exe exists minutes before
// OmniVoice is installed, and a half-built venv used to break voicing.
export const READY = join(ROOT, ".omnivoice", "READY");

/** OmniVoice's Python, or null when it isn't set up. */
export const omnivoicePython = () =>
  [
    process.env.OMNIVOICE_PYTHON,
    existsSync(READY) ? VENV_PYTHON : null,
    bin(join(homedir(), "OmniVoice", ".venv-cpu")),
  ].find((p) => p && existsSync(p)) ?? null;

export const profileNames = () =>
  existsSync(VOICES) ? readdirSync(VOICES).filter((f) => f.endsWith(".pt")).map((f) => f.slice(0, -3)) : [];

/**
 * The voice profile to speak with: a name (--voice / script.json "voiceProfile"),
 * else OMNIVOICE_VOICE, else the only profile in ~/.finhub-voice.
 * Returns { path } or { error } in plain words.
 */
export const resolveProfile = (name) => {
  const names = profileNames();
  const howTo = "Clone one: npm run clone-voice -- <recording> --name <name> --consent";
  if (name) {
    const path = join(VOICES, `${name}.pt`);
    return existsSync(path) ? { path } : { error: `No voice profile "${name}". Have: ${names.join(", ") || "none"}. ${howTo}` };
  }
  if (process.env.OMNIVOICE_VOICE) {
    const path = resolve(process.env.OMNIVOICE_VOICE);
    return existsSync(path) ? { path } : { error: `OMNIVOICE_VOICE points to ${path}, which doesn't exist.` };
  }
  if (names.length === 1) return { path: join(VOICES, `${names[0]}.pt`) };
  if (names.length > 1) return { error: `Several voice profiles (${names.join(", ")}): pick one with --voice <name>.` };
  return { error: `No voice profile yet. ${howTo}` };
};
