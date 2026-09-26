"""Check for migrate-assets.py on a synthetic media root in a temp folder:
dedupe, words.json matching, a mismatched slug left alone, faceless skipped,
Vietnamese edit.json text kept byte for byte, and a second run doing nothing.

    python scripts/check-migrate-assets.py      (exit 1 on failure)
"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "migrate-assets.py"
TITLE = "Tỷ Đô: con số người Úc không ngờ tới"


def write(path: Path, data: bytes | str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(data, str):
        path.write_text(data, encoding="utf-8", newline="")
    else:
        path.write_bytes(data)


def migrate(public: Path, *extra: str) -> str:
    result = subprocess.run([sys.executable, str(SCRIPT), "--media-root", str(public), *extra],
                            capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        raise SystemExit(f"migrate-assets.py failed:\n{result.stdout}{result.stderr}")
    return result.stdout


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        public = Path(tmp) / "public"
        v = public / "videos"
        edit = f'{{\r\n  "title": "{TITLE}",\r\n  "rate": 1.0\r\n}}\r\n'
        for slug in ("ty-do", "ty-do-box"):
            write(v / slug / "source.mp4", b"take one")
            write(v / slug / "words.json", "[1]")
            write(v / slug / "edit.json", edit)
        write(v / "ty-do" / "foreground.webm", b"cut-out")
        write(v / "studio-preview" / "words.json", "[1]")
        write(v / "studio-preview" / "edit.json", "{}")
        write(v / "bank-test" / "words.json", "[2]")
        write(v / "bank-test" / "edit.json", "{}")
        write(v / "faceless" / "source.mp4", b"synthetic")
        write(v / "faceless" / "script.json", "{}")
        write(v / "faceless" / "edit.json", "{}")

        dry = migrate(public)
        assert not (public / "recordings").exists(), "dry run wrote something"
        assert "left on videos/bank-test/" in dry, dry
        migrate(public, "--apply")
        rec = public / "recordings" / "ty-do"
        assert (rec / "source.mp4").read_bytes() == b"take one"
        assert (rec / "foreground.webm").read_bytes() == b"cut-out"
        assert not (v / "ty-do-box" / "source.mp4").exists()
        assert not (v / "studio-preview" / "words.json").exists()
        assert (v / "bank-test" / "words.json").exists()
        assert (v / "faceless" / "source.mp4").exists()
        for slug in ("ty-do", "ty-do-box", "studio-preview"):
            assert json.loads((v / slug / "edit.json").read_text(encoding="utf-8"))["source"] == "ty-do"
        assert "bank-test" not in (v / "bank-test" / "edit.json").read_text(encoding="utf-8")
        kept = (v / "ty-do" / "edit.json").read_bytes().decode("utf-8")
        assert kept == edit.replace("{\r\n", '{\r\n  "source": "ty-do",\r\n', 1), kept
        again = migrate(public, "--apply")
        assert "Nothing to do" in again, again
    print("migrate-assets ok")


if __name__ == "__main__":
    main()
