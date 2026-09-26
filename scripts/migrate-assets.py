"""Move each recording into public/recordings/<id>/ (the asset contract, C6).

    python scripts/migrate-assets.py [--media-root <public/>] [--apply]

Dry run by default: prints, per content hash, its size, the recording id, every
current copy and the target, and writes nothing. --apply moves one copy per
hash into public/recordings/<id>/ (hashed again after the move), writes
"source": <id> into each slug's edit.json, then deletes only the duplicate
copies whose hash it checked again just before. Running it twice changes
nothing the second time. Daniel runs it in the main checkout, dry run first.

Which recording a slug edits:
- edit.json already has "source": that one (already migrated);
- else slugs with the same source.mp4 share a recording, named after the
  shortest slug of them (ty-do, not ty-do-box) or the existing recording with
  that source.mp4;
- else (no source.mp4 left) its words.json must match the recording's own copy
  byte for byte (the one in the slug named like the recording).
A slug whose recording file differs from the recording's copy, or that matches
no recording, is left as it is on the old videos/<slug>/ layout and reported.
Faceless slugs (with a script.json) always stay in their own folder.
"""

from __future__ import annotations

import argparse
import hashlib
from dataclasses import dataclass, field
from pathlib import Path

from recordings import PUBLIC, read_edit, recording_dir, set_source

FIXED_NAMES = ("source.mp4", "foreground.webm", "words.json")
# C4: files that leave version control but stay on disk.
UNTRACK = ("git rm -r --cached public/videos/faceless-test/voice "
           "public/videos/ty-do-box/matting-test.mp4 "
           "public/videos/ty-do-explainer/edit.json.bak")


@dataclass(frozen=True)
class Copy:
    path: Path
    sha: str
    size: int


@dataclass
class Move:
    recording: str
    name: str
    sha: str
    size: int
    keep: Path | None  # the copy moved to target; None when target already holds it
    target: Path
    duplicates: list[Path] = field(default_factory=list)


@dataclass
class Plan:
    moves: list[Move]
    edits: list[tuple[str, str]]  # (slug, recording id) still to write
    left: list[tuple[str, str]]  # (slug, reason)
    faceless: list[str]


def sha256(path: Path) -> str:
    try:
        with path.open("rb") as f:
            return hashlib.file_digest(f, "sha256").hexdigest()
    except OSError as err:
        raise SystemExit(f"Cannot read {path}: {err}") from err


def hashed(folder: Path) -> dict[str, Copy]:
    """The recording files in a folder, by name, with their hash and size."""
    paths = [folder / n for n in FIXED_NAMES] + sorted(folder.glob("original.*"))
    return {p.name: Copy(p, sha256(p), p.stat().st_size) for p in paths if p.is_file()}


def assign(slugs: dict[str, dict[str, Copy]], sources: dict[str, str | None],
           existing: dict[str, dict[str, Copy]]) -> tuple[dict[str, str], list[tuple[str, str]]]:
    """Recording id per slug, plus the slugs that match none (with why)."""
    ids = {s: src for s, src in sources.items() if src}
    by_source = {files["source.mp4"].sha: rid
                 for rid, files in existing.items() if "source.mp4" in files}
    groups: dict[str, list[str]] = {}
    for slug, files in slugs.items():
        if slug not in ids and "source.mp4" in files:
            groups.setdefault(files["source.mp4"].sha, []).append(slug)
    for sha, members in groups.items():
        # ponytail: shortest slug names the recording; add an override if one is ever misnamed.
        rid = by_source.get(sha) or min(members, key=lambda s: (len(s), s))
        ids.update({s: rid for s in members})

    def own_words(rid: str) -> str | None:
        copy = existing.get(rid, {}).get("words.json") or \
            (slugs.get(rid, {}).get("words.json") if ids.get(rid) == rid else None)
        return copy.sha if copy else None

    words_of = {own_words(rid): rid for rid in set(ids.values()) | set(existing)}
    words_of.pop(None, None)
    left = []
    for slug, files in slugs.items():
        if slug in ids:
            continue
        if "words.json" in files and files["words.json"].sha in words_of:
            ids[slug] = words_of[files["words.json"].sha]
        elif not files and slug in existing:
            ids[slug] = slug  # its files already moved by an interrupted --apply
        else:
            left.append((slug, "no source.mp4, and its words.json matches no recording's"))
    return ids, left


def make_plan(public: Path) -> Plan:
    videos, recordings = public / "videos", public / "recordings"
    if not videos.is_dir():
        raise SystemExit(f"{videos} not found; pass --media-root <the public/ folder>.")
    all_slugs = sorted(d.name for d in videos.iterdir() if (d / "edit.json").is_file())
    faceless = [s for s in all_slugs if (videos / s / "script.json").exists()]
    talking = [s for s in all_slugs if s not in faceless]
    existing = {d.name: hashed(d) for d in sorted(recordings.iterdir()) if d.is_dir()} \
        if recordings.is_dir() else {}
    slugs = {s: hashed(videos / s) for s in talking}
    sources = {s: read_edit(public, s).get("source") for s in talking}
    ids, left = assign(slugs, sources, existing)

    # The copy each recording keeps: its existing one, else the slug named like
    # it, else the first slug (by name) that has the file.
    members: dict[str, list[str]] = {}
    for slug in sorted(ids):
        members.setdefault(ids[slug], []).append(slug)
    moves: dict[tuple[str, str], Move] = {}
    for rid, group in members.items():
        order = sorted(group, key=lambda s: (s != rid, s))
        chosen = dict(existing.get(rid, {}))
        for slug in order:
            for name, copy in slugs[slug].items():
                chosen.setdefault(name, copy)
        for slug in order:
            differs = [n for n, c in slugs[slug].items() if c.sha != chosen[n].sha]
            if differs and not sources[slug]:
                left.append((slug, f"its {', '.join(differs)} differs from recording {rid}'s"))
                ids.pop(slug)
                continue
            for name, copy in slugs[slug].items():
                if name in differs:
                    left.append((slug, f"already on {rid}; its own {name} differs, kept"))
                    continue
                target = recordings / rid / name
                move = moves.setdefault((rid, name), Move(
                    rid, name, copy.sha, copy.size,
                    None if name in existing.get(rid, {}) else copy.path, target))
                if copy.path != move.keep:
                    move.duplicates.append(copy.path)
    edits = [(s, ids[s]) for s in sorted(ids) if sources[s] != ids[s]]
    return Plan(list(moves.values()), edits, sorted(left), faceless)


def show(plan: Plan, public: Path) -> None:
    def rel(path: Path) -> str:
        return path.relative_to(public.parent).as_posix()

    for m in plan.moves:
        print(f"\n{m.sha[:12]}  {m.size / 1e6:9.1f} MB  recording {m.recording}")
        if m.keep:
            print(f"    from {rel(m.keep)}  (moved)")
        for d in m.duplicates:
            print(f"    from {rel(d)}  (duplicate, deleted)")
        print(f"    to   {rel(m.target)}{'  (already there)' if not m.keep else ''}")
    freed = sum(m.size * len(m.duplicates) for m in plan.moves)
    print(f"\n{len(plan.moves)} file(s) to move or dedupe, {freed / 1e6:.1f} MB of duplicates freed.")
    for slug, rid in plan.edits:
        print(f'edit.json: public/videos/{slug}/edit.json gets "source": "{rid}"')
    for slug, why in plan.left:
        print(f"left on videos/{slug}/ (Daniel decides): {why}")
    if plan.faceless:
        print(f"faceless, stay in their own folder: {', '.join(plan.faceless)}")


def apply(plan: Plan, public: Path) -> None:
    """Move, verify, write edit.json, then delete verified duplicates, in that
    order, so an interrupted run is finished by running it again."""
    for m in plan.moves:
        if m.keep is None:
            continue
        try:
            m.target.parent.mkdir(parents=True, exist_ok=True)
            m.keep.rename(m.target)  # same drive: a rename; refuses to overwrite
        except OSError as err:
            raise SystemExit(f"Cannot move {m.keep} to {m.target}: {err}. Nothing deleted.") from err
        if sha256(m.target) != m.sha:
            raise SystemExit(f"{m.target} changed during the move. Stopped; nothing deleted.")
        print(f"moved   {m.keep} -> {m.target} (hash checked)")
    for slug, rid in plan.edits:
        set_source(public / "videos" / slug / "edit.json", rid)
        print(f'wrote   "source": "{rid}" into videos/{slug}/edit.json')
    for m in plan.moves:
        for dup in m.duplicates:
            if sha256(dup) != m.sha:
                print(f"kept    {dup}: it changed since the plan, so it is not a duplicate")
                continue
            try:
                dup.unlink()
            except OSError as err:
                raise SystemExit(f"Cannot delete {dup}: {err}") from err
            print(f"deleted {dup} (same hash as {m.target})")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--media-root", type=Path, default=PUBLIC,
                        help="the public/ folder holding videos/ (default: this repo's)")
    parser.add_argument("--apply", action="store_true",
                        help="move and delete for real (default: dry run)")
    args = parser.parse_args()
    public: Path = args.media_root.resolve()
    plan = make_plan(public)
    show(plan, public)
    if not plan.moves and not plan.edits:
        print("\nNothing to do: every recording is already in public/recordings/.")
    elif args.apply:
        apply(plan, public)
        print("\nDone. Run the dry run again: it should report nothing to do.")
    else:
        print("\nDry run: nothing written. Run again with --apply to do it.")
    words = [d for m in plan.moves if m.name == "words.json" for d in [m.keep, *m.duplicates] if d]
    print("\nThen, in the main checkout (the C4 files stay on disk; they only leave git):")
    print(f"  {UNTRACK}")
    if words:
        # Transcripts stay tracked: Git records the move, not a deletion.
        paths = " ".join(p.relative_to(public.parent).as_posix() for p in words)
        print("  git add public/recordings/*/words.json")
        print(f"  git rm --cached --ignore-unmatch {paths}")


if __name__ == "__main__":
    main()
