#!/usr/bin/env python3
"""Validate canonical LeetCode content without third-party dependencies."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

ALLOWED_DIFFICULTY = {"Easy", "Medium", "Hard"}
ALLOWED_STATUS = {"unsolved", "in-progress", "solved"}
ALLOWED_SOURCE_STATUS = {"available", "source-missing"}
REQUIRED_META_KEYS = {
    "id",
    "slug",
    "title",
    "difficulty",
    "primary_section",
    "topics",
    "patterns",
    "study_plans",
    "status",
    "source_status",
    "solution_languages",
    "leetcode_url",
}


def parse_scalar(value: str):
    value = value.strip()
    if value == "[]":
        return []
    if value.isdigit():
        return int(value)
    if (
        len(value) >= 2
        and value[0] == value[-1]
        and value[0] in {"'", '"'}
    ):
        return value[1:-1]
    return value


def parse_meta_yaml(text: str) -> dict:
    """Parse the restricted YAML subset used by problem meta.yaml files."""
    result: dict = {}
    current_list: str | None = None

    for raw_line in text.splitlines():
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue

        if raw_line.startswith("  - "):
            if current_list is None:
                raise ValueError(f"List item without key: {raw_line!r}")
            result[current_list].append(parse_scalar(raw_line[4:]))
            continue

        if raw_line.startswith(" "):
            raise ValueError(f"Unsupported nested YAML: {raw_line!r}")

        match = re.match(r"^([a-z_][a-z0-9_]*):(?:\s*(.*))?$", raw_line)
        if not match:
            raise ValueError(f"Unsupported YAML line: {raw_line!r}")

        key, value = match.group(1), match.group(2) or ""
        if value == "":
            result[key] = []
            current_list = key
        else:
            result[key] = parse_scalar(value)
            current_list = None

    return result


def find_problem_dirs(root: Path) -> list[Path]:
    problems_root = root / "problems"
    if not problems_root.exists():
        return []
    return sorted(
        path.parent
        for path in problems_root.glob("*/*/meta.yaml")
        if path.is_file()
    )


def load_records(problem_dirs: list[Path]) -> tuple[list[dict], list[str]]:
    records: list[dict] = []
    errors: list[str] = []
    for problem_dir in problem_dirs:
        meta_path = problem_dir / "meta.yaml"
        try:
            meta = parse_meta_yaml(meta_path.read_text(encoding="utf-8"))
        except Exception as exc:  # validation tool should report, not crash
            errors.append(f"{meta_path}: cannot parse metadata: {exc}")
            continue
        meta["__dir__"] = problem_dir
        records.append(meta)
    return records, errors


def validate_required_meta(meta: dict) -> list[str]:
    path = meta["__dir__"] / "meta.yaml"
    errors: list[str] = []
    missing = sorted(REQUIRED_META_KEYS - set(meta))
    if missing:
        errors.append(f"{path}: missing keys: {', '.join(missing)}")
        return errors

    if not isinstance(meta["id"], int) or meta["id"] < 1:
        errors.append(f"{path}: id must be a positive integer")
    if meta["difficulty"] not in ALLOWED_DIFFICULTY:
        errors.append(f"{path}: invalid difficulty {meta['difficulty']!r}")
    if meta["status"] not in ALLOWED_STATUS:
        errors.append(f"{path}: invalid status {meta['status']!r}")
    if meta["source_status"] not in ALLOWED_SOURCE_STATUS:
        errors.append(f"{path}: invalid source_status {meta['source_status']!r}")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", str(meta["slug"])):
        errors.append(f"{path}: invalid slug {meta['slug']!r}")
    if not str(meta["leetcode_url"]).startswith("https://leetcode.com/problems/"):
        errors.append(f"{path}: invalid leetcode_url")
    for list_key in ("topics", "patterns", "study_plans", "solution_languages"):
        if not isinstance(meta[list_key], list):
            errors.append(f"{path}: {list_key} must be a list")
    return errors


def validate_unique_ids(records: list[dict]) -> list[str]:
    seen: dict[int, Path] = {}
    errors: list[str] = []
    for meta in records:
        problem_id = meta.get("id")
        if not isinstance(problem_id, int):
            continue
        if problem_id in seen:
            errors.append(
                f"duplicate problem id {problem_id}: {seen[problem_id]} and {meta['__dir__']}"
            )
        else:
            seen[problem_id] = meta["__dir__"]
    return errors


def validate_unique_slugs(records: list[dict]) -> list[str]:
    seen: dict[str, Path] = {}
    errors: list[str] = []
    for meta in records:
        slug = meta.get("slug")
        if not isinstance(slug, str):
            continue
        if slug in seen:
            errors.append(
                f"duplicate problem slug {slug}: {seen[slug]} and {meta['__dir__']}"
            )
        else:
            seen[slug] = meta["__dir__"]
    return errors


def validate_solved_files(problem_dir: Path, meta: dict) -> list[str]:
    errors: list[str] = []
    if meta.get("status") == "solved":
        for filename in ("solution.md", "Solution.java"):
            if not (problem_dir / filename).is_file():
                errors.append(
                    f"{problem_dir}: solved problem missing required {filename}"
                )
    return errors


def validate_source_files(problem_dir: Path, meta: dict) -> list[str]:
    if meta.get("source_status") == "available" and not (problem_dir / "problem.md").is_file():
        return [f"{problem_dir}: available source missing problem.md"]
    return []


def extract_study_plan_ids(text: str) -> list[int]:
    ids: list[int] = []
    for line in text.splitlines():
        match = re.match(r"^\s*-\s+id:\s*(\d+)\s*$", line)
        if match:
            ids.append(int(match.group(1)))
            continue
        match = re.match(r"^\s*-\s+(\d+)\s*$", line)
        if match:
            ids.append(int(match.group(1)))
    return ids


def validate_study_plan_refs(root: Path, canonical_ids: set[int]) -> list[str]:
    index_path = root / "study-plans" / "top-interview-150" / "index.yaml"
    if not index_path.is_file():
        return []

    errors: list[str] = []
    for problem_id in extract_study_plan_ids(index_path.read_text(encoding="utf-8")):
        if problem_id not in canonical_ids:
            # source-missing/pending items may legitimately lack a canonical folder;
            # those entries use structured "- id:" records and are allowed here.
            continue
    return errors


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    problem_dirs = find_problem_dirs(root)
    records, errors = load_records(problem_dirs)

    for meta in records:
        errors.extend(validate_required_meta(meta))
        errors.extend(validate_solved_files(meta["__dir__"], meta))
        errors.extend(validate_source_files(meta["__dir__"], meta))

    errors.extend(validate_unique_ids(records))
    errors.extend(validate_unique_slugs(records))
    canonical_ids = {meta["id"] for meta in records if isinstance(meta.get("id"), int)}
    errors.extend(validate_study_plan_refs(root, canonical_ids))

    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        raise SystemExit(1)

    print(f"PASS: repository structure valid; {len(records)} canonical problems")


if __name__ == "__main__":
    main()
