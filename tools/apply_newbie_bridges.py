#!/usr/bin/env python3
"""Apply curated newbie-first reasoning bridges without touching canonical Java blocks.

The bridge is intentionally a supplement, not a replacement template. Existing
solution material (including the exact-synced Optimal Java solution) stays intact.
Each catalog entry is problem-specific and is reviewed as content, while this tool
only performs deterministic insertion/replacement.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "docs/content/newbie-bridges"
PROBLEMS = ROOT / "problems"
START = "<!-- NEWBIE-FIRST-BRIDGE:START -->"
END = "<!-- NEWBIE-FIRST-BRIDGE:END -->"
EXPECTED_TOTAL = 150
# Eight plan golden problems + LRU Cache as the additional pointer/data-structure reference.
GOLDEN_IDS = {4, 45, 121, 124, 146, 188, 224, 238, 274}
REQUIRED_FIELDS = ("framing", "derive", "state", "trace", "transfer")


def scalar_meta(path: Path) -> dict[str, str]:
    wanted = {"id", "title", "primary_section"}
    result: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        if not raw or raw[0].isspace() or ":" not in raw:
            continue
        key, value = raw.split(":", 1)
        if key in wanted:
            result[key] = value.strip().strip('"').strip("'")
    return result


def load_catalog() -> tuple[dict[int, dict[str, str]], dict[int, str]]:
    entries: dict[int, dict[str, str]] = {}
    groups: dict[int, str] = {}
    for path in sorted(CATALOG_DIR.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        group = data.get("group", path.stem)
        problems = data.get("problems")
        if not isinstance(problems, dict):
            raise ValueError(f"{path}: problems must be an object")
        for raw_id, entry in problems.items():
            problem_id = int(raw_id)
            # A problem promoted to the manually reviewed golden set may still have
            # a historical catalog entry. Ignore it so future bridge runs never
            # overwrite the full golden rewrite.
            if problem_id in GOLDEN_IDS:
                continue
            if problem_id in entries:
                raise ValueError(f"duplicate catalog id {problem_id}")
            if not isinstance(entry, dict):
                raise ValueError(f"{path}: id {problem_id} entry must be an object")
            missing = [field for field in REQUIRED_FIELDS if not str(entry.get(field, "")).strip()]
            if missing:
                raise ValueError(f"{path}: id {problem_id} missing {missing}")
            for field in REQUIRED_FIELDS:
                value = str(entry[field]).strip()
                if len(value) < 60:
                    raise ValueError(f"{path}: id {problem_id} field {field} is too thin ({len(value)} chars)")
                if "TODO" in value or "TBD" in value:
                    raise ValueError(f"{path}: id {problem_id} contains placeholder text")
            entries[problem_id] = {field: str(entry[field]).strip() for field in REQUIRED_FIELDS}
            groups[problem_id] = group
    return entries, groups


def inventory() -> dict[int, tuple[Path, dict[str, str]]]:
    meta_files = sorted(PROBLEMS.glob("*/*/meta.yaml"))
    if len(meta_files) != EXPECTED_TOTAL:
        raise RuntimeError(f"expected {EXPECTED_TOTAL} meta.yaml files, found {len(meta_files)}")
    result = {}
    for meta_path in meta_files:
        meta = scalar_meta(meta_path)
        problem_id = int(meta["id"])
        result[problem_id] = (meta_path.parent, meta)
    return result


def render(entry: dict[str, str]) -> str:
    return f"""{START}
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** {entry['framing']}

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** {entry['derive']}

**State / invariant / data structure cần hiểu trước code.** {entry['state']}

**Dry run mental theo implementation.** {entry['trace']}

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** {entry['transfer']}
{END}"""


def replace_or_insert(text: str, block: str) -> str:
    if START in text or END in text:
        pattern = re.compile(re.escape(START) + r"[\s\S]*?" + re.escape(END))
        matches = list(pattern.finditer(text))
        if len(matches) != 1:
            raise ValueError("bridge markers are malformed or duplicated")
        return pattern.sub(block, text, count=1)

    lines = text.splitlines()
    if not lines or not lines[0].startswith("# "):
        raise ValueError("solution.md must start with an H1 title")
    rest = "\n".join(lines[1:]).lstrip("\n")
    return f"{lines[0]}\n\n{block}\n\n---\n\n{rest}".rstrip() + "\n"


def apply(selected_group: str | None, check: bool) -> int:
    catalog, groups = load_catalog()
    inv = inventory()

    expected_ids = set(inv) - GOLDEN_IDS
    catalog_ids = set(catalog)
    if catalog_ids != expected_ids:
        missing = sorted(expected_ids - catalog_ids)
        extra = sorted(catalog_ids - expected_ids)
        raise RuntimeError(f"catalog coverage mismatch: missing={missing}, extra={extra}")

    changed: list[str] = []
    checked = 0
    for problem_id in sorted(catalog):
        if selected_group and groups[problem_id] != selected_group:
            continue
        folder, meta = inv[problem_id]
        solution = folder / "solution.md"
        if not solution.exists():
            raise FileNotFoundError(solution)
        old = solution.read_text(encoding="utf-8")
        new = replace_or_insert(old, render(catalog[problem_id]))
        checked += 1
        if new != old:
            if check:
                changed.append(str(solution.relative_to(ROOT)))
            else:
                solution.write_text(new, encoding="utf-8")
                changed.append(str(solution.relative_to(ROOT)))

    mode = "check" if check else "apply"
    print(f"Newbie bridge {mode}: group={selected_group or 'all'}, problems={checked}, changed={len(changed)}")
    if changed:
        for path in changed[:30]:
            print(f"- {path}")
        if len(changed) > 30:
            print(f"- ... and {len(changed) - 30} more")
    return 1 if check and changed else 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--group", help="apply only one catalog group")
    parser.add_argument("--check", action="store_true", help="fail if selected files need bridge updates")
    args = parser.parse_args()
    return apply(args.group, args.check)


if __name__ == "__main__":
    raise SystemExit(main())
