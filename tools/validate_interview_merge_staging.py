#!/usr/bin/env python3
"""Check the staged QuantaVault interview-question merges without modifying data."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / "docs/audits/2026-11-12-interview-dedup"


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    canonical = load(ROOT / "data/interview-questions.json")
    web = load(ROOT / "web/src/data/interview-questions.json")
    check(canonical == web, "Canonical JSON and web JSON differ")
    check(len(canonical) in (526, 504), "Unexpected canonical question count")
    check(len({item["id"] for item in canonical}) == len(canonical), "Duplicate canonical ID")

    staged_a = load(AUDIT / "phase1-group-A.json")
    staged_b = load(AUDIT / "phase1-group-B.json")
    check(len(staged_a["groups"]) == 11, "Expected 11 A groups")
    check(len(staged_b["groups"]) == 10, "Expected 10 B groups")
    groups = staged_a["groups"] + staged_b["groups"]
    check([group["group"] for group in groups] == [
        *(f"A{i:02d}" for i in range(1, 12)),
        *(f"B{i:02d}" for i in range(1, 11)),
    ], "Unexpected group order")
    kept = [group["keptId"] for group in groups]
    retired = [old for group in groups for old in group["mergedIds"]]
    check(len(kept) == len(set(kept)) == 21, "Duplicate kept ID")
    check(len(retired) == len(set(retired)) == 22, "Duplicate retired ID")
    check(not set(kept).intersection(retired), "An ID is both kept and retired")

    archive = load(AUDIT / "original-43-questions.json")
    originals = archive["questions"]
    check(archive["originalCount"] == len(originals) == 43, "Invalid original archive")
    orig_by_id = {question["id"]: question for question in originals}
    check(set(orig_by_id) == set(kept) | set(retired), "Archive ID set differs")
    current_by_id = {question["id"]: question for question in canonical}

    proposed = load(AUDIT / "phase2-id-map.proposed.json")
    check(proposed["status"].startswith("PROPOSAL_ONLY"), "Mapping must not be activated")
    expected_map = {
        old: group["keptId"]
        for group in groups
        for old in group["mergedIds"]
    }
    check(proposed["retiredToCanonical"] == expected_map, "22-ID map inconsistent")

    for group in groups:
        keep = group["keptId"]
        q = group["question"]
        source = orig_by_id[keep]
        check(q["id"] == keep, f"{keep}: canonical ID changed")
        for field in ("category", "difficulty", "companies", "relatedProblems"):
            check(q.get(field) == source.get(field), f"{keep}: {field} changed")
        for field in ("title", "summary", "answerMarkdown"):
            check(isinstance(q.get(field), str) and q[field].strip(), f"{keep}: empty {field}")
        check(len(q["summary"]) >= 150, f"{keep}: summary too brief")
        answer = q["answerMarkdown"]
        check(len(answer) >= 900, f"{keep}: answer too brief")
        check(answer.count("```") % 2 == 0, f"{keep}: unbalanced code fences")
        check("##" in answer, f"{keep}: missing section headings")
        linked_ids = set(re.findall(r"(?<![a-zA-Z0-9])q-[0-9]{3}(?![0-9])", answer))
        check(not linked_ids.intersection(retired), f"{keep}: links to retired ID")
        if len(canonical) == 526:
            check(current_by_id[keep] == source, f"{keep}: source mutated in stage 1")
        else:
            check(keep in current_by_id, f"{keep}: kept ID not published")
            for field in ("title", "summary", "answerMarkdown"):
                check(current_by_id[keep][field] == q[field], f"{keep}: staged field mismatch")

    if len(canonical) == 526:
        check(all(id in current_by_id for id in retired), "A source disappeared in stage 1")
        check(all(current_by_id[id] == orig_by_id[id] for id in retired), "A retired source changed early")
    else:
        check(not set(retired).intersection(current_by_id), "Retired questions still in canonical 504")

    a06 = next(group for group in groups if group["group"] == "A06")
    check("name.length() > 3" in a06["question"]["answerMarkdown"], "Stream filter expected >3")
    check("System.out.println(result); // [BINH]" in a06["question"]["answerMarkdown"], "Stream result mismatch")
    b08 = next(group for group in groups if group["group"] == "B08")
    check("```mermaid" in b08["question"]["answerMarkdown"], "Missing layered architecture diagram")
    legacy = load(ROOT / "web/src/lib/interview/legacyIdMap.json")
    for old, destination in expected_map.items():
        if old in legacy and legacy[old] != old:
            check(legacy[old] != destination, "Historical mapping accidentally overwritten")
    print(
        f"PASS: {len(groups)} reviewed groups, {len(originals)} archived sources, "
        f"{len(retired)} proposed retired IDs; canonical count {len(canonical)}."
    )


if __name__ == "__main__":
    main()
