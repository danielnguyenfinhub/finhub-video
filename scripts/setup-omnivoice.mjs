// One-time setup of the voice-cloning feature (OmniVoice, runs on the CPU):
//
//   npm run setup-voice
//
// Makes .omnivoice/venv in this project (git-ignored, about 4 GB), installs
// OmniVoice from vendor/OmniVoice plus faster-whisper, then downloads the
// models (about 6 GB, once) and checks they load. Safe to re-run.
// Needs Python 3.10+ and ffmpeg on PATH, and git for the submodule.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, VENDOR, VENV, VENV_PYTHON } from "./omnivoice.mjs";

const fail = (msg) => {
  console.error(`setup-voice: ${msg}`);
  process.exit(1);
};
const step = (what, cmd, args) => {
  console.log(`\n> ${what}`);
  const res = spawnSync(cmd, args, { stdio: "inherit", cwd: ROOT, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  if (res.status !== 0) fail(`${what} failed (${res.error?.message ?? `exit ${res.status}`}). Fix the message above and re-run npm run setup-voice.`);
};

if (!existsSync(join(VENDOR, "pyproject.toml")))
  step("Fetching OmniVoice (git submodule)", "git", ["submodule", "update", "--init", "vendor/OmniVoice"]);

if (!existsSync(VENV_PYTHON)) {
  const python = ["python", "python3", "py"].find(
    (p) => spawnSync(p, ["-c", "import sys; sys.exit(sys.version_info < (3, 10))"]).status === 0,
  );
  if (!python) fail("Python 3.10 or newer not found. Install it from python.org (tick 'Add to PATH') and re-run.");
  step("Creating .omnivoice/venv", python, ["-m", "venv", VENV]);
}
const pip = (what, args) => step(what, VENV_PYTHON, ["-m", "pip", "install", "--disable-pip-version-check", ...args]);

// CPU build of PyTorch: small and runs everywhere. Apple Silicon's default
// wheel already includes its GPU (mps).
const cpuIndex = process.platform === "darwin" ? [] : ["--index-url", "https://download.pytorch.org/whl/cpu"];
pip("Installing PyTorch (CPU)", ["torch==2.8.0", "torchaudio==2.8.0", ...cpuIndex]);
// truststore: use the operating system's certificates, so downloads work
// behind antivirus HTTPS scanning (Norton, etc.).
pip("Installing OmniVoice and faster-whisper", ["-e", VENDOR, "num2words", "faster-whisper", "truststore"]);

step("Downloading the models and checking they load", VENV_PYTHON, [join(ROOT, "scripts", "omnivoice-tts.py"), "check"]);
console.log("\nDone. Next: npm run clone-voice -- <a recording of you> --name <your-name> --consent");
