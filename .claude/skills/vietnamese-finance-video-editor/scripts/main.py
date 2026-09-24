#!/usr/bin/env python3
"""Design log for vietnamese-finance-video-editor.

  python main.py log                 show the last entries (creates the seeded log)
  python main.py check <axes.json>   variety check for a proposed design (exit 1 = fail)
  python main.py add <entry.json>    append a rendered video's entry
  python main.py selftest            prove the variety rule

axes.json: {"axes": {<8 axes>}} or the 8 axes directly.
entry.json: {"slug", "date", "design", "direction", "axes", "reused"}.
Log path: public/videos/design-log.json in the repository this skill sits in
(override with VFVE_DESIGN_LOG).
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

AXES = ["cover", "captions", "framing", "graphics", "transitions", "texture", "sound", "cta"]
MIN_CHANGED = 4
LOOKBACK = 3
# Never repeat these from the previous video.
FRESH_AXES = ["cover", "captions"]
# scripts/ -> the skill -> .claude/skills -> .claude -> the repository root.
DEFAULT_LOG = Path(__file__).resolve().parents[4] / "public" / "videos" / "design-log.json"

CLASSIC_AXES = {
    "cover": "frozen-frame + big title",
    "captions": "karaoke pill + stroke",
    "framing": "full-frame zoom-cuts",
    "graphics": "navy cards + stat panels",
    "transitions": "light-leak flash + slide/wipe",
    "texture": "clean gradient",
    "sound": "money-rain hook sfx + whooshes",
    "cta": "white card logo + contact list",
}
SEED = [
    {"slug": "ty-do", "date": "2026-09-24", "design": "classic", "direction": "DATA-LED",
     "axes": CLASSIC_AXES, "reused": False},
    {"slug": "interest-in-advance", "date": "2026-09-24", "design": "classic",
     "direction": "EXPLAINER", "axes": CLASSIC_AXES, "reused": True},
]


def log_path() -> Path:
    return Path(os.environ.get("VFVE_DESIGN_LOG", str(DEFAULT_LOG)))


def load_log(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        save_log(path, SEED)
        return list(SEED)
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        sys.exit(f"Design log unreadable ({path}): {e}. Fix or restore it; do not overwrite.")
    if not isinstance(data, list):
        sys.exit(f"Design log {path} is not a JSON list.")
    return data


def save_log(path: Path, entries: list[dict[str, Any]]) -> None:
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    except OSError as e:
        sys.exit(f"Could not write design log {path}: {e}")


def norm(v: Any) -> str:
    return " ".join(str(v).lower().split())


def read_axes(raw: dict[str, Any]) -> dict[str, str]:
    axes = raw.get("axes", raw)
    missing = [a for a in AXES if not str(axes.get(a, "")).strip()]
    if missing:
        sys.exit(f"Axes missing a value: {', '.join(missing)}. Fill all 8: {', '.join(AXES)}.")
    return {a: str(axes[a]) for a in AXES}


def variety(axes: dict[str, str], entries: list[dict[str, Any]]) -> dict[str, Any]:
    recent = entries[-LOOKBACK:]
    report = []
    ok = True
    for e in recent:
        prev = e.get("axes", {})
        changed = [a for a in AXES if norm(axes[a]) != norm(prev.get(a, ""))]
        passed = len(changed) >= MIN_CHANGED
        ok = ok and passed
        report.append({"slug": e.get("slug"), "axes_changed": len(changed),
                       "changed": changed, "pass": passed})
    repeats = []
    if entries:
        last = entries[-1].get("axes", {})
        repeats = [a for a in FRESH_AXES if norm(axes[a]) == norm(last.get(a, ""))]
        ok = ok and not repeats
    return {"pass": ok, "vs_recent": report, "repeats_previous": repeats,
            "rule": f">= {MIN_CHANGED} of 8 axes differ from each of the last {LOOKBACK}; "
                    f"never repeat the previous {' or '.join(FRESH_AXES)}"}


def read_json(p: str) -> dict[str, Any]:
    try:
        return json.loads(Path(p).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        sys.exit(f"Could not read {p}: {e}")


def selftest() -> None:
    new = dict(CLASSIC_AXES, cover="whiteboard sketch", captions="typewriter",
               framing="cut-out over designed backdrop", graphics="hand-drawn diagrams")
    assert variety(new, SEED)["pass"], "4 changed axes incl. cover+captions must pass"
    three = dict(CLASSIC_AXES, cover="x", captions="y", framing="z")
    assert not variety(three, SEED)["pass"], "3 changed axes must fail"
    same_cover = dict(new, cover=CLASSIC_AXES["cover"], texture="paper grain")
    r = variety(same_cover, SEED)
    assert not r["pass"] and r["repeats_previous"] == ["cover"], "repeated cover must fail"
    assert variety(new, [])["pass"], "an empty log passes"
    print("selftest ok")


def main(argv: list[str]) -> None:
    if not argv or argv[0] not in {"log", "check", "add", "selftest"}:
        sys.exit(__doc__)
    cmd = argv[0]
    if cmd == "selftest":
        selftest()
        return
    path = log_path()
    entries = load_log(path)
    if cmd == "log":
        print(json.dumps(entries[-5:], ensure_ascii=False, indent=2))
    elif cmd == "check":
        if len(argv) < 2:
            sys.exit("usage: main.py check <axes.json>")
        result = variety(read_axes(read_json(argv[1])), entries)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        sys.exit(0 if result["pass"] else 1)
    elif cmd == "add":
        if len(argv) < 2:
            sys.exit("usage: main.py add <entry.json>")
        entry = read_json(argv[1])
        for k in ["slug", "date", "design", "direction"]:
            if not str(entry.get(k, "")).strip():
                sys.exit(f"Entry missing '{k}'.")
        entry["axes"] = read_axes(entry)
        entry["reused"] = bool(entry.get("reused", False))
        entries = [e for e in entries if e.get("slug") != entry["slug"]] + [entry]
        save_log(path, entries)
        print(f"Logged {entry['slug']} ({entry['design']}) in {path}")


if __name__ == "__main__":
    main(sys.argv[1:])
