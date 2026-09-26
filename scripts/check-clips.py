"""Check for prep-video.py --clips on two synthetic takes in a temp media root:
the joined proxy's length, the merged words.json, the joined cut-out keeping its
alpha, a missing take stopping with the prep command, and the single-recording
prep unchanged. faster-whisper is replaced by a stub, so nothing is downloaded.

    python scripts/check-clips.py      (prints "clips ok"; exit 1 on failure)
"""

from __future__ import annotations

import hashlib
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

PREP = Path(__file__).resolve().parent / "prep-video.py"
FPS = 30
STUB = '''from pathlib import Path
from types import SimpleNamespace as NS


class WhisperModel:
    def __init__(self, *args, **kwargs):
        pass

    def transcribe(self, path, **kwargs):
        rec = Path(path).parent.name
        words = [NS(word=f" {rec}-{i}", start=i * 0.5, end=i * 0.5 + 0.4, probability=1.0)
                 for i in range(10)]
        return [NS(start=0.0, end=5.0, text="stub", words=words)], NS(duration=5.0)
'''
# (recording, inMs, outMs): whole frames at 30 fps, 75 + 45 + 18 = 138 frames.
A_ROLL = [("take-a", 1000, 3500), ("take-b", 500, 2000), ("take-a", 4000, 4600)]


def sh(cmd: list[str], env: dict | None = None, ok: bool = True) -> subprocess.CompletedProcess:
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", env=env)
    if ok and result.returncode != 0:
        raise SystemExit(f"{' '.join(cmd[:3])} failed:\n{result.stdout}{result.stderr}")
    return result


def probe(path: Path, entry: str) -> str:
    return sh(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", entry,
               "-of", "default=nw=1:nk=1", str(path)]).stdout.strip()


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        public = root / "public"
        (root / "stub" / "faster_whisper").mkdir(parents=True)
        (root / "stub" / "faster_whisper" / "__init__.py").write_text(STUB, encoding="utf-8")
        env = {**os.environ, "FINHUB_PUBLIC": str(public), "PYTHONPATH": str(root / "stub")}

        # Two 5 s takes, each prepared by the unchanged single-recording path.
        for take, hz in (("take-a", 440), ("take-b", 660)):
            src = root / f"{take}.mp4"
            sh(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i",
                f"testsrc=d=5:s=320x240:r={FPS}", "-f", "lavfi", "-i", f"sine=f={hz}:d=5",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(src)])
            sh([sys.executable, str(PREP), str(src), take], env)
            rec = public / "recordings" / take
            edit = json.loads((public / "videos" / take / "edit.json").read_text(encoding="utf-8"))
            assert edit == {"source": take, "title": take, "pacing": {"mode": "auto"},
                            "chapters": [], "stats": [], "cues": [],
                            "compliance": {"illustrativeNumbers": True}}, edit
            assert probe(rec / "source.mp4", "stream=nb_frames") == "150"
            # A cut-out with alpha: left half transparent, right half opaque.
            sh(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i",
                f"testsrc=d=5:s=320x240:r={FPS},format=yuva420p,"
                "geq=lum='lum(X,Y)':cb='cb(X,Y)':cr='cr(X,Y)':a='if(lt(X,W/2),0,255)'",
                "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", str(rec / "foreground.webm")])
        before = {p: digest(p) for p in (public / "recordings").rglob("*") if p.is_file()}

        # (c) a new edit of a prepared recording writes only the skeleton, as before.
        sh([sys.executable, str(PREP), "take-a-2", "--recording", "take-a"], env)
        assert json.loads((public / "videos" / "take-a-2" / "edit.json")
                          .read_text(encoding="utf-8"))["source"] == "take-a"

        # A take that was never prepared stops with the command that prepares it.
        clips = public / "videos" / "demo" / "clips.json"
        clips.parent.mkdir(parents=True)
        clips.write_text(json.dumps([{"recording": "take-z", "inMs": 0, "outMs": 900,
                                      "role": "a-roll"}]), encoding="utf-8")
        missing = sh([sys.executable, str(PREP), "demo", "--clips", str(clips)], env, ok=False)
        assert missing.returncode != 0 and "prep-video.py" in missing.stderr \
            and "--recording take-z" in missing.stderr, missing.stderr
        assert not (public / "recordings" / "demo-assembly").exists()

        clips.write_text(json.dumps(
            [{"recording": r, "inMs": i, "outMs": o, "role": "a-roll"} for r, i, o in A_ROLL]
            + [{"recording": "my-street.mp4", "inMs": 0, "outMs": 2000, "role": "b-roll"}]),
            encoding="utf-8")
        out = sh([sys.executable, str(PREP), "demo", "--clips", str(clips)], env).stdout
        assert "b-roll, not in the assembly: my-street.mp4" in out, out
        asm = public / "recordings" / "demo-assembly"
        edit = json.loads((public / "videos" / "demo" / "edit.json").read_text(encoding="utf-8"))
        assert edit["source"] == "demo-assembly", edit

        # (a) length = the kept spans, within one frame.
        kept_s = sum(o - i for _, i, o in A_ROLL) / 1000
        dur = float(probe(asm / "source.mp4", "stream=duration"))
        assert abs(dur - kept_s) <= 1 / FPS, (dur, kept_s)
        assert probe(asm / "source.mp4", "stream=nb_frames") == str(round(kept_s * FPS))

        # (b) words in order, each on its own clip's side of every boundary.
        words = json.loads((asm / "words.json").read_text(encoding="utf-8"))
        starts = [w["startMs"] for w in words]
        assert starts == sorted(starts) and all(w["endMs"] >= w["startMs"] for w in words)
        edges, t = [], 0
        for rec, i, o in A_ROLL:
            edges.append((t, t + o - i, rec))
            t += o - i
        for w in words:
            rec = next(r for a, b, r in edges if a <= w["startMs"] < b)
            assert w["text"].startswith(f" {rec}-"), (w, rec)
        marks = [(w["startMs"], w["clipStart"]) for w in words if "clipStart" in w]
        assert [m[1] for m in marks] == [r for r, _, _ in A_ROLL], marks
        assert [m[0] for m in marks] == [0, 2500, 4000], marks  # each clip starts on a word
        assert words[0]["text"] == " take-a-2", words[0]

        # The joined cut-out: same frame count, alpha kept (left clear, right opaque).
        fg = asm / "foreground.webm"
        assert probe(fg, "stream=codec_name") == "vp9"
        assert probe(fg, "stream_tags=alpha_mode") == "1", "alpha_mode tag missing"
        frames = sh(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0",
                     "-show_entries", "stream=nb_read_frames", "-of", "default=nw=1:nk=1",
                     str(fg)]).stdout.strip()
        assert frames == str(round(kept_s * FPS)), frames
        alpha = subprocess.run(
            ["ffmpeg", "-v", "error", "-c:v", "libvpx-vp9", "-i", str(fg), "-frames:v", "1",
             "-vf", "alphaextract,scale=2:1:flags=area", "-f", "rawvideo", "-pix_fmt", "gray",
             "-"], capture_output=True, check=True).stdout
        assert alpha[0] < 16 and alpha[1] > 239, list(alpha)

        # The takes themselves are untouched.
        assert before == {p: digest(p) for p in before}
    print("clips ok")


if __name__ == "__main__":
    try:
        main()
    except AssertionError as err:
        print(f"FAIL: {err!r}", file=sys.stderr)
        sys.exit(1)
