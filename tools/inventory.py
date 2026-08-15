#!/usr/bin/env python3
"""Inventory user-supplied LeetCode problem statements from raw topic files."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

HEADER_RE = re.compile(r"(?m)^\s*(\d{1,5})\.\s+([^\r\n]+?)\s*$")
CANDIDATE_EXISTING_SOLUTIONS = {88, 27, 26, 80, 169, 189, 121}


def parse_problem_headers(text: str) -> list[dict]:
    """Return ordered records with integer id and title from raw topic text."""
    return [
        {"id": int(match.group(1)), "title": match.group(2).strip()}
        for match in HEADER_RE.finditer(text)
    ]


def section_slug(filename: str) -> str:
    stem = Path(filename).stem.lower()
    stem = stem.replace("&", "and").replace("'", "")
    stem = re.sub(r"[^a-z0-9]+", "-", stem).strip("-")
    return stem


def build_inventory(root: Path) -> dict:
    raw_dir = root / "raw" / "top-interview-150"
    problems: list[dict] = []
    seen: dict[int, list[dict]] = {}

    for path in sorted(raw_dir.glob("*.txt"), key=lambda p: p.name.lower()):
        text = path.read_text(encoding="utf-8")
        for order, item in enumerate(parse_problem_headers(text), start=1):
            problem_id = item["id"]
            record = {
                "id": problem_id,
                "title": item["title"],
                "section": section_slug(path.name),
                "raw_source_file": path.name,
                "source_order": order,
                "source_status": "available",
                "solution_status": (
                    "candidate-existing"
                    if problem_id in CANDIDATE_EXISTING_SOLUTIONS
                    else "none"
                ),
                "canonical_path": None,
            }
            problems.append(record)
            seen.setdefault(problem_id, []).append(record)

    duplicates = [
        {
            "id": problem_id,
            "occurrences": [
                {
                    "raw_source_file": record["raw_source_file"],
                    "source_order": record["source_order"],
                    "title": record["title"],
                }
                for record in records
            ],
        }
        for problem_id, records in sorted(seen.items())
        if len(records) > 1
    ]

    return {
        "source_root": "raw/top-interview-150",
        "problem_count_detected": len(problems),
        "unique_problem_count": len(seen),
        "problems": problems,
        "duplicates": duplicates,
    }


def self_test() -> None:
    sample = """Array / String
121. Best Time to Buy and Sell Stock
Easy
...
122. Best Time to Buy and Sell Stock II
Medium
"""
    expected = [
        {"id": 121, "title": "Best Time to Buy and Sell Stock"},
        {"id": 122, "title": "Best Time to Buy and Sell Stock II"},
    ]
    actual = parse_problem_headers(sample)
    if actual != expected:
        raise SystemExit(f"FAIL parse_problem_headers: {actual!r}")
    print("PASS parse_problem_headers")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--output", default="data/migration-inventory.json")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()

    if args.self_test:
        self_test()
        return

    root = Path(args.root).resolve()
    inventory = build_inventory(root)
    output = root / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(inventory, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {output}: "
        f"{inventory['unique_problem_count']} unique problems, "
        f"{len(inventory['duplicates'])} duplicate IDs"
    )


if __name__ == "__main__":
    main()
