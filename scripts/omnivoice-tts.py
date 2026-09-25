"""Local Vietnamese voice for faceless videos: OmniVoice cloning of Daniel's own
voice, with caption timings from faster-whisper. Called by voice-video.mjs.

Runs in OmniVoice's own Python (C:/Users/Daniel/OmniVoice/.venv-cpu), not the
project's: that venv holds torch (CPU), omnivoice and faster-whisper.

  python omnivoice-tts.py clone <ref.wav> "<exact transcript>" <voice.pt>
  python omnivoice-tts.py speak <jobs.json> <voice.pt> [num_step]

jobs.json: [{"text": "...", "wav": "<out .wav>", "align": "<out .json>"}]
Each align file matches ElevenLabs' with-timestamps alignment
({characters, character_start_times_seconds, character_end_times_seconds}),
so voice-video.mjs turns it into words.json exactly as before.

The voice profile is a reusable copy of Daniel's voice: keep it outside this
public repository (voice-video.mjs refuses one inside it).
"""
from __future__ import annotations

import json
import re
import sys
import time
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

try:  # Norton re-signs HTTPS on Daniel's PC; trust the Windows store it's in.
    import truststore

    truststore.inject_into_ssl()
except ImportError:
    pass

SAMPLE_RATE = 24000
MIN_MATCH = 0.6  # below this share of words recognised, timings are guessed


def fail(msg: str) -> None:
    print(f"omnivoice-tts: {msg}", file=sys.stderr)
    sys.exit(1)


def load_model():
    import torch
    from omnivoice import OmniVoice

    return OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)


def norm(word: str) -> str:
    """Compare words ignoring case, punctuation and Unicode form."""
    return re.sub(r"[^\w]", "", unicodedata.normalize("NFC", word).lower())


def word_times(script_words: list[str], heard: list[tuple[str, float, float]], total: float):
    """Give every script word a (start, end): matched from what Whisper heard,
    the rest spread by length between their matched neighbours. Returns the
    times and the share of script words matched."""
    times: list[tuple[float, float] | None] = [None] * len(script_words)
    matcher = SequenceMatcher(a=[norm(w) for w in script_words], b=[norm(w) for w, _, _ in heard], autojunk=False)
    for block in matcher.get_matching_blocks():
        for k in range(block.size):
            _, start, end = heard[block.b + k]
            times[block.a + k] = (start, end)
    matched = sum(t is not None for t in times) / max(1, len(script_words))

    i = 0
    while i < len(times):
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < len(times) and times[j] is None:
            j += 1
        lo = times[i - 1][1] if i > 0 else 0.0
        hi = times[j][0] if j < len(times) else total
        hi = max(hi, lo)
        weights = [max(1, len(w)) for w in script_words[i:j]]
        cursor = lo
        for k, weight in zip(range(i, j), weights):
            span = (hi - lo) * weight / sum(weights)
            times[k] = (cursor, cursor + span)
            cursor += span
        i = j
    return times, matched


def char_alignment(text: str, times: list[tuple[float, float]]) -> dict:
    """ElevenLabs-shaped alignment: each word's characters share its span."""
    characters, starts, ends = [], [], []
    w = 0
    last_end = 0.0
    for token in re.split(r"(\s+)", text):
        if not token:
            continue
        if token.isspace():
            for ch in token:
                characters.append(ch)
                starts.append(last_end)
                ends.append(last_end)
            continue
        start, end = times[w]
        step = (end - start) / len(token)
        for k, ch in enumerate(token):
            characters.append(ch)
            starts.append(round(start + k * step, 3))
            ends.append(round(start + (k + 1) * step, 3))
        last_end = end
        w += 1
    return {
        "characters": characters,
        "character_start_times_seconds": starts,
        "character_end_times_seconds": ends,
    }


def clone(ref_audio: str, ref_text: str, out: str) -> None:
    if not Path(ref_audio).is_file():
        fail(f"reference audio not found: {ref_audio}")
    model = load_model()
    prompt = model.create_voice_clone_prompt(ref_audio=ref_audio, ref_text=ref_text)
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    prompt.save(out)
    print(f"voice profile saved: {out}")


def speak(jobs_path: str, voice_path: str, num_step: int) -> None:
    import soundfile as sf
    from faster_whisper import WhisperModel
    from omnivoice import VoiceClonePrompt

    jobs = json.loads(Path(jobs_path).read_text(encoding="utf-8"))
    if not Path(voice_path).is_file():
        fail(f"voice profile not found: {voice_path}. Make one with the clone command.")
    model = load_model()
    prompt = VoiceClonePrompt.load(voice_path)
    whisper = WhisperModel("large-v3", device="cpu", compute_type="int8")

    for n, job in enumerate(jobs, 1):
        t0 = time.perf_counter()
        audio = model.generate(text=job["text"], voice_clone_prompt=prompt, language="vi", num_step=num_step)[0]
        total = len(audio) / SAMPLE_RATE
        sf.write(job["wav"], audio, SAMPLE_RATE)

        segments, _ = whisper.transcribe(job["wav"], language="vi", word_timestamps=True)
        heard = [(w.word.strip(), w.start, w.end) for s in segments for w in (s.words or [])]
        times, matched = word_times(job["text"].split(), heard, total)
        Path(job["align"]).write_text(json.dumps(char_alignment(job["text"], times)), encoding="utf-8")
        note = "" if matched >= MIN_MATCH else f" WARNING: only {matched:.0%} of words recognised, caption timing is approximate"
        print(f"{n}/{len(jobs)}: {total:.1f}s voiced in {time.perf_counter() - t0:.0f}s, {matched:.0%} words timed{note}", flush=True)


def selftest() -> None:
    """Timing logic only (no model): matched words keep Whisper's times, missed
    ones share the gap by length, and alignment has one entry per character."""
    text = "Lãi suất 6,2 phần trăm, ANZ."
    heard = [("Lãi", 0.0, 0.3), ("suất", 0.3, 0.6), ("6,2%", 0.6, 1.2), ("ANZ.", 1.5, 2.0)]
    times, matched = word_times(text.split(), heard, 2.0)
    assert times[0] == (0.0, 0.3) and times[1] == (0.3, 0.6), times
    assert times[5] == (1.5, 2.0), times  # "ANZ." matched despite punctuation
    assert times[2] == (0.6, 1.2), times  # "6,2" matches "6,2%" once punctuation is ignored
    assert times[3][0] >= 1.2 and times[4][1] <= 1.5, times  # "phần trăm," fill the gap
    assert all(a <= b for a, b in times), times
    assert matched == 4 / 6, matched
    al = char_alignment(text, times)
    assert len(al["characters"]) == len(text) == len(al["character_start_times_seconds"])
    print("selftest ok")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args == ["selftest"]:
        selftest()
    elif len(args) == 4 and args[0] == "clone":
        clone(args[1], args[2], args[3])
    elif len(args) in (3, 4) and args[0] == "speak":
        speak(args[1], args[2], int(args[3]) if len(args) == 4 else 32)
    else:
        fail(__doc__.split("\n\n")[1])
