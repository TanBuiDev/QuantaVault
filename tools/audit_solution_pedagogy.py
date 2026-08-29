#!/usr/bin/env python3
"""Deterministic minimum-quality gate for newbie-first solution.md files.

This validator deliberately does not claim that regex can prove teaching quality.
It protects structural evidence that the migration intentionally added while
keeping subjective pedagogy heuristics as warnings.
"""

from __future__ import annotations

import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROBLEMS = ROOT / "problems"
EXPECTED_TOTAL = 150

BRIDGE_START = "<!-- NEWBIE-FIRST-BRIDGE:START -->"
BRIDGE_END = "<!-- NEWBIE-FIRST-BRIDGE:END -->"
GOLDEN_IDS = {4, 45, 121, 124, 146, 188, 224, 238, 274}

OPTIMAL_HEADING_RE = re.compile(
    r"(?im)^##\s+(?:\d+\.\s*)?Optimal Java solution[^\n]*$"
)
JAVA_BLOCK_RE = re.compile(r"```java\s*[\s\S]*?```", re.IGNORECASE)

BRIDGE_LABELS = (
    "**Tự nhìn bài toán bằng ví dụ.**",
    "**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.**",
    "**State / invariant / data structure cần hiểu trước code.**",
    "**Dry run mental theo implementation.**",
    "**Lỗi thường gặp và khi nào dùng lại ý tưởng này.**",
)

COMPLEXITY_RE = re.compile(
    r"(?i)(complexity|độ phức tạp|time\s*:\s*o\s*\(|space\s*:\s*o\s*\()"
)
CORRECTNESS_RE = re.compile(
    r"(?i)(correctness|vì sao[^\n]{0,80}đúng|tại sao[^\n]{0,80}đúng|proof|chứng minh|invariant)"
)
EXAMPLE_RE = re.compile(
    r"(?i)(dry run|worked example|ví dụ|example|mô phỏng|trace|chạy thử)"
)
TRANSFER_RE = re.compile(
    r"(?i)(common mistakes?|lỗi thường gặp|pattern recognition|cách nhận ra|khi nào dùng|pitfall|edge cases?)"
)
PLAIN_FRAMING_RE = re.compile(
    r"(?i)(bài toán|đề[^\n]{0,40}(hỏi|yêu cầu)|ta cần|mục tiêu|ví dụ|tự nhìn)"
)
PLACEHOLDER_RE = re.compile(r"(?im)\b(TODO|TBD|FIXME)\b")

JARGON = (
    "bfs", "dfs", "greedy", "dynamic programming", "dp", "prefix", "suffix",
    "heap", "trie", "sentinel", "partition", "invariant", "monotonic",
)


def parse_meta(path: Path) -> dict[str, str]:
    wanted = {"id", "title", "difficulty", "primary_section"}
    result: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        if not raw or raw[0].isspace() or ":" not in raw:
            continue
        key, value = raw.split(":", 1)
        if key in wanted:
            result[key] = value.strip().strip('"').strip("'")
    return result


def visible_text(text: str) -> str:
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.DOTALL)
    text = re.sub(r"[`*_>#|\-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def bridge_block(text: str) -> str | None:
    starts = text.count(BRIDGE_START)
    ends = text.count(BRIDGE_END)
    if starts != ends or starts > 1:
        return None
    if starts == 0:
        return ""
    return text.split(BRIDGE_START, 1)[1].split(BRIDGE_END, 1)[0]


def first_prose(text: str, limit: int = 500) -> str:
    cleaned = visible_text(text)
    return cleaned[:limit].lower()


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    metas = sorted(PROBLEMS.glob("*/*/meta.yaml"))
    failures: list[str] = []
    warnings: list[str] = []
    sections: Counter[str] = Counter()
    difficulties: Counter[str] = Counter()
    green_by_section: defaultdict[str, int] = defaultdict(int)

    if len(metas) != EXPECTED_TOTAL:
        failures.append(f"inventory: expected {EXPECTED_TOTAL} meta.yaml files, found {len(metas)}")

    seen_ids: set[int] = set()
    green = 0

    for meta_path in metas:
        meta = parse_meta(meta_path)
        rel_dir = meta_path.parent.relative_to(ROOT).as_posix()
        try:
            problem_id = int(meta["id"])
        except (KeyError, ValueError):
            failures.append(f"{rel_dir}: invalid or missing id")
            continue

        title = meta.get("title", meta_path.parent.name)
        difficulty = meta.get("difficulty", "Unknown")
        section = meta.get("primary_section", meta_path.parent.parent.name)
        sections[section] += 1
        difficulties[difficulty] += 1

        if problem_id in seen_ids:
            failures.append(f"{rel_dir}: duplicate problem id {problem_id}")
            continue
        seen_ids.add(problem_id)

        solution = meta_path.parent / "solution.md"
        if not solution.exists():
            failures.append(f"{rel_dir}: missing solution.md")
            continue

        text = solution.read_text(encoding="utf-8")
        local_failures: list[str] = []
        local_warnings: list[str] = []

        if not text.startswith("# "):
            local_failures.append("solution must start with H1")
        if PLACEHOLDER_RE.search(text):
            local_failures.append("contains TODO/TBD/FIXME placeholder")

        headings = list(OPTIMAL_HEADING_RE.finditer(text))
        if len(headings) != 1:
            local_failures.append(f"expected exactly 1 Optimal Java solution heading, found {len(headings)}")
            pre_optimal = text
        else:
            heading = headings[0]
            pre_optimal = text[:heading.start()]
            tail = text[heading.end():]
            next_h2 = re.search(r"(?m)^##\s+", tail)
            optimal_section = tail[: next_h2.start()] if next_h2 else tail
            if not JAVA_BLOCK_RE.search(optimal_section):
                local_failures.append("Optimal Java solution section has no java code block")

        explanatory_chars = len(re.sub(r"\s+", "", visible_text(pre_optimal)))
        if explanatory_chars < 450:
            local_failures.append(
                f"too little explanatory content before optimal code ({explanatory_chars} chars; need >= 450)"
            )

        block = bridge_block(text)
        if block is None:
            local_failures.append("newbie bridge markers are malformed/duplicated")
        elif problem_id in GOLDEN_IDS:
            if block:
                local_warnings.append("golden reference still contains generated bridge markers")
        else:
            if not block:
                local_failures.append("non-golden problem is missing newbie-first reasoning bridge")
            else:
                for label in BRIDGE_LABELS:
                    if block.count(label) != 1:
                        local_failures.append(f"bridge missing/duplicating label: {label}")
                parts = []
                for i, label in enumerate(BRIDGE_LABELS):
                    if label not in block:
                        continue
                    start = block.index(label) + len(label)
                    later = [block.find(other, start) for other in BRIDGE_LABELS[i + 1:]]
                    later = [pos for pos in later if pos >= 0]
                    end = min(later) if later else len(block)
                    body = visible_text(block[start:end])
                    parts.append((label, body))
                for label, body in parts:
                    if len(body) < 60:
                        local_failures.append(f"bridge section too thin ({len(body)} chars): {label}")

        if not COMPLEXITY_RE.search(text):
            local_failures.append("missing complexity evidence")
        if not CORRECTNESS_RE.search(text):
            local_failures.append("missing correctness/invariant explanation")

        if difficulty.lower() in {"medium", "hard"} and not EXAMPLE_RE.search(text):
            local_failures.append(f"{difficulty} problem missing worked example/dry run evidence")
        if difficulty.lower() in {"medium", "hard"} and not TRANSFER_RE.search(text):
            local_failures.append(f"{difficulty} problem missing mistakes/transfer evidence")

        # Heuristic only: warn when the opening is jargon-led and gives no plain framing.
        opening = first_prose(pre_optimal)
        jargon_hits = [term for term in JARGON if re.search(rf"\b{re.escape(term)}\b", opening)]
        if jargon_hits and not PLAIN_FRAMING_RE.search(opening):
            local_warnings.append("opening may lead with unexplained jargon: " + ", ".join(jargon_hits[:4]))

        if local_failures:
            failures.extend(f"{rel_dir}: {item}" for item in local_failures)
        else:
            green += 1
            green_by_section[section] += 1
        warnings.extend(f"{rel_dir}: {item}" for item in local_warnings)

    if len(seen_ids) != EXPECTED_TOTAL:
        failures.append(f"unique ids: expected {EXPECTED_TOTAL}, found {len(seen_ids)}")

    print("\n================ SOLUTION PEDAGOGY STRUCTURAL AUDIT ================")
    print(f"Coverage:                 {len(seen_ids)}/{EXPECTED_TOTAL}")
    print(f"Deterministic GREEN:      {green}/{EXPECTED_TOTAL}")
    print(f"Structural failures:      {len(failures)}")
    print(f"Heuristic warnings:       {len(warnings)}")
    print(f"Golden references:        {len(GOLDEN_IDS)}")
    print("--------------------------------------------------------------------")
    print("By difficulty: " + " · ".join(f"{k} {v}" for k, v in sorted(difficulties.items())))
    print("By section:")
    for section, total in sorted(sections.items()):
        print(f"  {section:<28} {green_by_section[section]}/{total}")

    if warnings:
        print("--------------------------------------------------------------------")
        print("WARNINGS (non-blocking heuristics):")
        for item in warnings[:40]:
            print(f"WARN {item}")
        if len(warnings) > 40:
            print(f"WARN ... and {len(warnings) - 40} more")

    if failures:
        print("--------------------------------------------------------------------")
        print("FAILURES:")
        for item in failures[:80]:
            print(f"FAIL {item}")
        if len(failures) > 80:
            print(f"FAIL ... and {len(failures) - 80} more")
        print("====================================================================")
        return 1

    print("--------------------------------------------------------------------")
    print("PASS: all 150 solutions satisfy deterministic newbie-first minimums.")
    print("====================================================================")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
