#!/usr/bin/env python3
"""Inventory user-supplied Top Interview 150 source material."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

HEADER_RE = re.compile(r"^\s*(\d{1,5})\.\s+([^\r\n]+?)\s*$")
DIFFICULTIES = {"Easy", "Medium", "Hard"}
CANDIDATE_EXISTING_SOLUTIONS = {88, 27, 26, 80, 169, 189, 121}

# These six Array / String problems were already worked on in the user's prior
# study conversation before the current raw Array/String file was assembled.
# Their identities/order are known, but a complete verbatim source block is not
# present in the current raw repository, so they remain source-missing.
KNOWN_PRIOR_PROBLEMS = [
    {"id": 88, "title": "Merge Sorted Array", "difficulty": "Easy"},
    {"id": 27, "title": "Remove Element", "difficulty": "Easy"},
    {"id": 26, "title": "Remove Duplicates from Sorted Array", "difficulty": "Easy"},
    {"id": 80, "title": "Remove Duplicates from Sorted Array II", "difficulty": "Medium"},
    {"id": 169, "title": "Majority Element", "difficulty": "Easy"},
    {"id": 189, "title": "Rotate Array", "difficulty": "Medium"},
]


def find_problem_headers(text: str) -> list[dict]:
    """Find real problem headers while ignoring numbered explanation/list items."""
    lines = text.splitlines(keepends=True)
    offsets: list[int] = []
    position = 0
    for line in lines:
        offsets.append(position)
        position += len(line)

    headers: list[dict] = []
    for index, line in enumerate(lines):
        match = HEADER_RE.match(line.rstrip("\r\n"))
        if not match:
            continue

        difficulty = None
        for following in lines[index + 1 : index + 5]:
            stripped = following.strip()
            if not stripped:
                continue
            if stripped in DIFFICULTIES:
                difficulty = stripped
            break

        if difficulty is None:
            continue

        headers.append(
            {
                "id": int(match.group(1)),
                "title": match.group(2).strip(),
                "difficulty": difficulty,
                "start": offsets[index],
            }
        )
    return headers


def parse_problem_blocks(text: str) -> list[dict]:
    """Return ordered problem records and their exact raw block text."""
    headers = find_problem_headers(text)
    records: list[dict] = []
    for index, header in enumerate(headers):
        end = headers[index + 1]["start"] if index + 1 < len(headers) else len(text)
        block = text[header["start"]:end]
        has_full_statement = (
            "Constraints:" in block
            and re.search(r"(?m)^Example(?:\s+\d+)?:\s*$", block) is not None
        )
        records.append(
            {
                "id": header["id"],
                "title": header["title"],
                "difficulty": header["difficulty"],
                "source_status": "available" if has_full_statement else "source-missing",
                "raw_block": block,
            }
        )
    return records


def parse_problem_headers(text: str) -> list[dict]:
    """Compatibility helper used by the deterministic self-test."""
    return [
        {"id": item["id"], "title": item["title"]}
        for item in parse_problem_blocks(text)
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

    # Preserve the official Array / String order known from the user's prior
    # study work before appending the records that exist in Array  String.txt.
    for order, item in enumerate(KNOWN_PRIOR_PROBLEMS, start=1):
        record = {
            "id": item["id"],
            "title": item["title"],
            "difficulty": item["difficulty"],
            "section": "array-string",
            "raw_source_file": None,
            "source_order": order,
            "source_status": "source-missing",
            "solution_status": "candidate-existing",
            "canonical_path": None,
        }
        problems.append(record)
        seen.setdefault(item["id"], []).append(record)

    for path in sorted(raw_dir.glob("*.txt"), key=lambda p: p.name.lower()):
        text = path.read_text(encoding="utf-8")
        parsed = parse_problem_blocks(text)
        offset = len(KNOWN_PRIOR_PROBLEMS) if path.name == "Array  String.txt" else 0
        for order, item in enumerate(parsed, start=1 + offset):
            problem_id = item["id"]
            record = {
                "id": problem_id,
                "title": item["title"],
                "difficulty": item["difficulty"],
                "section": section_slug(path.name),
                "raw_source_file": path.name,
                "source_order": order,
                "source_status": item["source_status"],
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
        "full_source_count": sum(p["source_status"] == "available" for p in problems),
        "source_missing_count": sum(p["source_status"] == "source-missing" for p in problems),
        "problems": problems,
        "duplicates": duplicates,
    }


def self_test() -> None:
    sample = """Array / String
121. Best Time to Buy and Sell Stock
Easy
You are given prices.
Example 1:
Input: prices = [1,2]
Output: 1
Constraints:
1 <= prices.length <= 10
122. Best Time to Buy and Sell Stock II
Medium
"""
    parsed = parse_problem_blocks(sample)
    expected_headers = [
        {"id": 121, "title": "Best Time to Buy and Sell Stock"},
        {"id": 122, "title": "Best Time to Buy and Sell Stock II"},
    ]
    actual_headers = [{"id": p["id"], "title": p["title"]} for p in parsed]
    if actual_headers != expected_headers:
        raise SystemExit(f"FAIL parse_problem_headers: {actual_headers!r}")
    if parsed[0]["source_status"] != "available":
        raise SystemExit("FAIL full-source classification")
    if parsed[1]["source_status"] != "source-missing":
        raise SystemExit("FAIL identity-only classification")
    print("PASS parse_problem_blocks")


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
        f"{inventory['full_source_count']} with full source, "
        f"{inventory['source_missing_count']} source-missing, "
        f"{len(inventory['duplicates'])} duplicate IDs"
    )


if __name__ == "__main__":
    main()
