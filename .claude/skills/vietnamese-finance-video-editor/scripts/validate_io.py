#!/usr/bin/env python3
"""
Genius-Tier IO Contract Validator for mutual-finhub-skill-creator.

Checks that a skill directory meets Tier 4 (Genius) requirements:
- Required folder structure
- SKILL.md content requirements
- Output contract presence
- Command language (no suggestions)
- Self-correction loop
- Memory management instructions
- Decision trees
- Anti-pattern table

Usage: python scripts/validate_io.py /home/claude/<skill-name>
Returns: JSON with errors (blockers) and warnings (advisory)
"""

import json
import sys
import re
from pathlib import Path


REQUIRED_FILES = [
    "SKILL.md",
    "README.md",
    "templates/output.md",
    "templates/error-report.md",
    "examples/example-input.md",
    "examples/example-output.md",
    "memory/.gitkeep",
]

REQUIRED_SKILL_SECTIONS = [
    ("Output Contract", "ERROR"),
    ("Self-Correction Loop", "ERROR"),
    ("Memory Management", "ERROR"),
    ("Error Handling", "ERROR"),
    ("Anti-Pattern", "WARNING"),
    ("Decision Tree", "WARNING"),
]

SUGGESTION_PHRASES = [
    "you might want to",
    "consider ",
    "it may be helpful",
    "you could try",
    "feel free to",
    "perhaps ",
]

MAX_SKILL_MD_LINES = 500
MAX_DESCRIPTION_CHARS = 1024


def validate_structure(skill_path: Path) -> tuple[list, list]:
    errors = []
    warnings = []

    for f in REQUIRED_FILES:
        if not (skill_path / f).exists():
            errors.append(f"MISSING REQUIRED FILE: {f}")

    # Check scripts exist
    if not (skill_path / "scripts" / "main.py").exists():
        warnings.append("scripts/main.py not found — entry point missing")
    if not (skill_path / "scripts" / "validate_io.py").exists():
        warnings.append("scripts/validate_io.py not found — IO validator missing")

    return errors, warnings


def validate_skill_md(skill_path: Path) -> tuple[list, list]:
    errors = []
    warnings = []

    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        errors.append("SKILL.md not found")
        return errors, warnings

    content = skill_md.read_text(encoding="utf-8")
    lines = content.splitlines()
    line_count = len(lines)

    # Line count
    if line_count > MAX_SKILL_MD_LINES:
        errors.append(f"SKILL.md too long: {line_count} lines (max {MAX_SKILL_MD_LINES})")

    # Frontmatter
    if not content.startswith("---"):
        errors.append("SKILL.md missing YAML frontmatter (must start with ---)")

    # Description checks
    desc_match = re.search(r'(?m)^description:\s*(.+)', content)
    if desc_match:
        desc = desc_match.group(1).strip()
        if len(desc) > MAX_DESCRIPTION_CHARS:
            errors.append(f"description too long: {len(desc)} chars (max {MAX_DESCRIPTION_CHARS})")
        if "I can" in desc or "You can" in desc:
            errors.append("description must be third person — remove 'I can' / 'You can'")
        if not any(t in desc for t in ["ALWAYS use when", "Use when", "use when"]):
            warnings.append("description missing trigger guidance ('ALWAYS use when Daniel says:')")
        if not any(t in desc for t in ["NOT for", "Do NOT", "not for"]):
            warnings.append("description missing NOT-routing guidance")
    else:
        errors.append("description field not found in frontmatter")

    # Name checks
    name_match = re.search(r'(?m)^name:\s*(.+)', content)
    if name_match:
        name = name_match.group(1).strip()
        if len(name) > 64:
            errors.append(f"name too long: {len(name)} chars (max 64)")
        if not all(c.isalnum() or c == '-' for c in name):
            errors.append(f"name must be lowercase/numbers/hyphens only: {name}")
        if name != name.lower():
            errors.append(f"name must be lowercase: {name}")
        for banned in ["anthropic", "claude"]:
            if banned in name:
                errors.append(f"name must not contain '{banned}'")

    # Required sections
    for section, level in REQUIRED_SKILL_SECTIONS:
        if section not in content:
            if level == "ERROR":
                errors.append(f"Missing required section: ## {section}")
            else:
                warnings.append(f"Missing recommended section: ## {section}")

    # Suggestion language (anti-pattern)
    for phrase in SUGGESTION_PHRASES:
        if phrase.lower() in content.lower():
            warnings.append(f"Suggestion language: '{phrase}' — replace with command language")

    # Output contract check — must have a typed schema
    if '"status":' not in content and "status:" not in content:
        warnings.append("Output Contract may be missing typed schema — add status/result/metadata fields")

    # Bail-out clause
    if "STOP" not in content or "stake my reputation" not in content:
        warnings.append("Missing bail-out clause — add: 'If confidence drops below... STOP.'")

    # IRON RULE check
    if "IRON RULE" not in content:
        warnings.append("No IRON RULEs found — add at least one if skill writes data or calls external APIs")

    # Path separators
    if "\\" in content:
        warnings.append("Backslash path separators found — use forward slashes")

    return errors, warnings


def validate_examples(skill_path: Path) -> tuple[list, list]:
    errors = []
    warnings = []

    for f in ["examples/example-input.md", "examples/example-output.md"]:
        p = skill_path / f
        if p.exists():
            content = p.read_text(encoding="utf-8")
            if len(content.strip()) < 100:
                warnings.append(f"{f} is very short — ensure it shows a complete worked example")
        # Missing already caught by structure check

    return errors, warnings


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "Usage: validate_io.py <skill-path>"}))
        sys.exit(1)

    skill_path = Path(sys.argv[1])
    if not skill_path.exists():
        print(json.dumps({"status": "error", "message": f"Path not found: {skill_path}"}))
        sys.exit(1)

    all_errors = []
    all_warnings = []

    struct_e, struct_w = validate_structure(skill_path)
    md_e, md_w = validate_skill_md(skill_path)
    ex_e, ex_w = validate_examples(skill_path)

    all_errors = struct_e + md_e + ex_e
    all_warnings = struct_w + md_w + ex_w

    status = "PASS" if not all_errors else "FAIL"
    genius_tier = not all_errors and len(all_warnings) <= 2

    output = {
        "status": status,
        "genius_tier": genius_tier,
        "skill_path": str(skill_path),
        "errors": all_errors,
        "warnings": all_warnings,
        "summary": {
            "error_count": len(all_errors),
            "warning_count": len(all_warnings),
            "verdict": "GENIUS TIER ✅" if genius_tier else ("FAIL — fix errors before packaging ❌" if all_errors else "PASS with warnings ⚠️")
        }
    }

    print(json.dumps(output, indent=2))
    sys.exit(0 if status == "PASS" else 1)


if __name__ == "__main__":
    main()
