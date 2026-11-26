#!/usr/bin/env python3
"""Validate the restructured QuantaVault interview question bank."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = ROOT / "data/interview-questions.json"
MIRROR = ROOT / "web/src/data/interview-questions.json"
RETIRED = ROOT / "web/src/lib/interview/retiredInterviewIds.json"
LEGACY = ROOT / "web/src/lib/interview/legacyIdMap.json"
TOPICS_TS = ROOT / "web/src/lib/interview/topics.ts"
TYPES_TS = ROOT / "web/src/lib/interview/types.ts"

VALID_DIFFICULTIES = {"fresher", "junior", "middle", "senior"}
VALID_PRIORITIES = {"p1", "p2", "p3"}
EDITORIAL_NOTE_PATTERNS = ("Có thể bỏ", "TODO", "FIXME", "<nội dung")


def parse_categories_from_types() -> set[str]:
    text = TYPES_TS.read_text(encoding="utf-8")
    match = re.search(r"export type InterviewCategory\s*=([^;]+);", text)
    if not match:
        raise AssertionError("Could not parse InterviewCategory from types.ts")
    return set(re.findall(r'"([a-z0-9-]+)"', match.group(1)))


def parse_topics_from_ts() -> set[str]:
    text = TOPICS_TS.read_text(encoding="utf-8")
    return set(re.findall(r'id:\s*"([a-z0-9-]+)"', text))


def main() -> None:
    strict_all = "--strict-all" in sys.argv
    raw_canonical = CANONICAL.read_bytes()
    raw_mirror = MIRROR.read_bytes()
    assert raw_canonical == raw_mirror, "Canonical and mirror interview-questions.json differ byte-for-byte"

    questions = json.loads(raw_canonical.decode("utf-8"))
    retired = json.loads(RETIRED.read_text(encoding="utf-8"))
    legacy = json.loads(LEGACY.read_text(encoding="utf-8"))

    valid_categories = parse_categories_from_types()
    valid_topics = parse_topics_from_ts()

    ids = [q["id"] for q in questions]
    assert len(ids) == len(set(ids)), "Duplicate canonical question IDs found"
    assert not set(ids).intersection(retired.keys()), "Retired ID found in canonical questions"

    for q in questions:
        qid = q["id"]
        assert re.fullmatch(r"q-\d{3,}", qid), f"Invalid canonical ID format: {qid}"
        assert isinstance(q.get("title"), str) and q["title"].strip(), f"{qid}: empty title"
        for pat in EDITORIAL_NOTE_PATTERNS:
            assert pat not in q["title"], f"{qid}: editorial note in title: {q['title']}"
            assert pat not in q.get("summary", ""), f"{qid}: editorial note in summary"
        assert q.get("category") in valid_categories, f"{qid}: invalid category {q.get('category')}"
        assert q.get("difficulty") in VALID_DIFFICULTIES, f"{qid}: invalid difficulty {q.get('difficulty')}"
        assert isinstance(q.get("summary"), str) and len(q["summary"].strip()) >= 20, f"{qid}: summary too short"
        ans = q.get("answerMarkdown", "")
        assert isinstance(ans, str) and len(ans.strip()) >= 50, f"{qid}: answerMarkdown too short"

        is_wave1 = q["category"] in {"java-core", "oop"}
        if strict_all or is_wave1:
            assert ans.count("```") % 2 == 0, f"{qid}: unbalanced code fences"
            assert q.get("topicId") in valid_topics, f"{qid}: missing/invalid topicId {q.get('topicId')}"
            assert q.get("priority") in VALID_PRIORITIES, f"{qid}: missing/invalid priority {q.get('priority')}"
            order = q.get("learningOrder")
            assert isinstance(order, int) and order > 0, f"{qid}: missing/invalid learningOrder {order}"
        else:
            if q.get("topicId") is not None:
                assert q["topicId"] in valid_topics, f"{qid}: invalid topicId {q['topicId']}"
            if q.get("priority") is not None:
                assert q["priority"] in VALID_PRIORITIES, f"{qid}: invalid priority {q['priority']}"

    mode = "STRICT-ALL" if strict_all else "WAVE-1"
    print(f"PASS [{mode}]: {len(questions)} canonical questions, {len(retired)} retired IDs, {len(legacy)} legacy aliases.")


if __name__ == "__main__":
    main()
