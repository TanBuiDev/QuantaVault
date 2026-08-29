#!/usr/bin/env python3
"""Deterministic structural audit for the Top Interview 150 solution docs.

The audit is a prioritization aid, not a semantic pedagogy judge. It verifies that
all 150 canonical problem folders are present and scores observable teaching
signals from the newbie-first style guide. Human/Newbie-Simulator review remains
required before a problem is considered migrated.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROBLEMS = ROOT / "problems"
JSON_REPORT = ROOT / "docs/content/solution-newbie-audit.json"
MD_REPORT = ROOT / "docs/content/solution-newbie-audit.md"
EXPECTED = 150

CRITERIA = (
    "problem_framing",
    "algorithm_derivation",
    "state_and_structure_meaning",
    "java_blockers",
    "dry_run_and_correctness",
    "transfer_and_mistakes",
)

SIGNALS = {
    "problem_framing": (
        "bài toán", "hiểu đề", "problem", "input", "output", "ví dụ", "example",
        "constraint", "yêu cầu", "mục tiêu",
    ),
    "algorithm_derivation": (
        "brute force", "naive", "cách nghĩ", "ban đầu", "bottleneck", "chậm",
        "observation", "quan sát", "intuition", "vì sao", "why", "optimal",
        "tối ưu", "ý tưởng",
    ),
    "state_and_structure_meaning": (
        "invariant", "state", "trạng thái", "đại diện", "lưu", "meaning",
        "boundary", "data structure", "cấu trúc dữ liệu", "pointer", "window",
        "frontier",
    ),
    "dry_run_and_correctness": (
        "dry run", "trace", "mô phỏng", "chạy thử", "correctness", "đúng đắn",
        "tại sao đúng", "proof", "invariant",
    ),
    "transfer_and_mistakes": (
        "common mistake", "lỗi thường", "sai lầm", "pattern recognition", "nhận diện",
        "khi nào dùng", "when to use", "edge case", "pitfall", "ghi nhớ",
    ),
}

JAVA_APIS = (
    "HashMap", "Map<", "ArrayList", "List<", "Deque", "ArrayDeque",
    "PriorityQueue", "computeIfAbsent", "Comparator", "Collections.",
    "Integer.MAX_VALUE", "Integer.MIN_VALUE", "<<", ">>", "^", " & ", " | ",
)
JAVA_NOTES = (
    "java note", "java notes", "lưu ý java", "trong java", "api", "hashmap",
    "arraylist", "deque", "priorityqueue", "comparator", "generic", "lambda",
)

COMPLEX_SECTIONS = {
    "backtracking", "binary-search", "divide-conquer", "graph-bfs", "graph-general",
    "heap", "kadanes-algorithm", "multi-dimensional-dp", "trie",
}
TIER3_TITLES = {
    "Basic Calculator",
    "LRU Cache",
    "Binary Tree Maximum Path Sum",
    "Median of Two Sorted Arrays",
    "Best Time to Buy and Sell Stock IV",
    "Word Search II",
    "Text Justification",
    "Serialize and Deserialize Binary Tree",
}
GOLDEN_TITLES = {
    "Best Time to Buy and Sell Stock",
    "Jump Game II",
    "Product of Array Except Self",
    "LRU Cache",
    "Binary Tree Maximum Path Sum",
    "Basic Calculator",
    "Median of Two Sorted Arrays",
    "Best Time to Buy and Sell Stock IV",
}


@dataclass
class ProblemAudit:
    id: int
    title: str
    difficulty: str
    section: str
    path: str
    tier: int
    score: int
    classification: str
    scores: dict[str, int]
    blockers: list[str]
    recommended_action: str
    golden_set: bool


def unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def parse_meta(path: Path) -> dict[str, str]:
    """Read only the scalar fields needed by the audit; no YAML dependency needed."""
    wanted = {"id", "title", "difficulty", "primary_section"}
    result: dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        if not raw or raw[0].isspace() or ":" not in raw:
            continue
        key, value = raw.split(":", 1)
        key = key.strip()
        if key in wanted:
            result[key] = unquote(value.split(" #", 1)[0].strip())
    return result


def signal_count(text: str, signals: tuple[str, ...]) -> int:
    lower = text.lower()
    return sum(signal.lower() in lower for signal in signals)


def markdown_table(text: str) -> bool:
    return bool(re.search(r"(?m)^\s*\|.+\|\s*$\n\s*\|(?:\s*:?-+:?\s*\|)+", text))


def ordered_steps(text: str) -> bool:
    return len(re.findall(r"(?m)^\s*\d+[.)]\s+", text)) >= 2


def ascii_flow(text: str) -> bool:
    return any(token in text for token in ("->", "→", "<->", "<=>", "│", "└", "├"))


def framing(text: str) -> int:
    signals = signal_count(text, SIGNALS["problem_framing"])
    examples = len(re.findall(r"(?i)\b(example|ví dụ)\b", text))
    if signals >= 4 and examples:
        return 2
    if signals >= 2 or examples:
        return 1
    return 0


def derivation(text: str) -> int:
    signals = signal_count(text, SIGNALS["algorithm_derivation"])
    bridge = bool(re.search(
        r"(?is)(brute|naive|cách nghĩ|ban đầu).{0,900}"
        r"(nhưng|bottleneck|chậm|too slow|vấn đề).{0,1200}"
        r"(quan sát|observation|tối ưu|optimal|thay vì)",
        text,
    ))
    if signals >= 5 and bridge:
        return 2
    if signals >= 3:
        return 1
    return 0


def state_meaning(text: str) -> int:
    signals = signal_count(text, SIGNALS["state_and_structure_meaning"])
    identifiers = len(set(re.findall(r"`([A-Za-z_][A-Za-z0-9_.\[\]]*)`", text)))
    explanations = len(re.findall(
        r"(?i)`[^`]+`\s*(?:=|:|→|->|là|đại diện|lưu|means|stores|represents)", text
    ))
    if signals >= 4 and identifiers >= 3 and explanations >= 2:
        return 2
    if signals >= 2 or explanations:
        return 1
    return 0


def java_blockers(text: str, java: str) -> int:
    used = [api for api in JAVA_APIS if api in f"{text}\n{java}"]
    if not used:
        return 2
    notes = signal_count(text, JAVA_NOTES)
    mentions = sum(api.lower().replace("<", "") in text.lower() for api in used)
    if notes >= 2 and mentions >= min(2, len(used)):
        return 2
    if notes or mentions:
        return 1
    return 0


def dry_run_correctness(text: str) -> int:
    signals = signal_count(text, SIGNALS["dry_run_and_correctness"])
    trace = markdown_table(text) or ordered_steps(text) or ascii_flow(text)
    complexity = bool(re.search(r"(?i)(time|thời gian).{0,80}O\s*\(", text))
    if signals >= 3 and trace and complexity:
        return 2
    if signals >= 1 and (trace or complexity):
        return 1
    return 0


def transfer(text: str) -> int:
    signals = signal_count(text, SIGNALS["transfer_and_mistakes"])
    if signals >= 4:
        return 2
    if signals >= 2:
        return 1
    return 0


def pedagogy_tier(title: str, difficulty: str, section: str) -> int:
    if title in TIER3_TITLES or difficulty.lower() == "hard":
        return 3
    if section in COMPLEX_SECTIONS or difficulty.lower() == "medium":
        return 2
    return 1


def classify(score: int) -> str:
    if score <= 4:
        return "Critical"
    if score <= 8:
        return "Partial"
    if score <= 11:
        return "Close"
    return "Model"


def next_action(scores: dict[str, int]) -> str:
    labels = {
        "problem_framing": "add concrete framing and a hand-worked example",
        "algorithm_derivation": "derive the optimal idea from a natural approach and bottleneck",
        "state_and_structure_meaning": "explain variable/state/data-structure meaning before code",
        "java_blockers": "add focused Java API/syntax notes where comprehension blocks",
        "dry_run_and_correctness": "add an implementation-state dry run and correctness bridge",
        "transfer_and_mistakes": "add concrete pitfalls and pattern-recognition transfer cues",
    }
    minimum = min(scores.values())
    weakest = [key for key in CRITERIA if scores[key] == minimum]
    return "; ".join(labels[key] for key in weakest[:2])


def audit(meta_path: Path) -> ProblemAudit:
    folder = meta_path.parent
    solution = folder / "solution.md"
    java = folder / "Solution.java"
    if not solution.exists():
        raise FileNotFoundError(f"Missing solution.md next to {meta_path.relative_to(ROOT)}")
    if not java.exists():
        raise FileNotFoundError(f"Missing Solution.java next to {meta_path.relative_to(ROOT)}")

    meta = parse_meta(meta_path)
    required = ("id", "title", "difficulty", "primary_section")
    missing = [key for key in required if not meta.get(key)]
    if missing:
        raise ValueError(f"Missing {missing} in {meta_path.relative_to(ROOT)}")

    text = solution.read_text(encoding="utf-8")
    java_text = java.read_text(encoding="utf-8")
    scores = {
        "problem_framing": framing(text),
        "algorithm_derivation": derivation(text),
        "state_and_structure_meaning": state_meaning(text),
        "java_blockers": java_blockers(text, java_text),
        "dry_run_and_correctness": dry_run_correctness(text),
        "transfer_and_mistakes": transfer(text),
    }
    total = sum(scores.values())
    title = meta["title"]
    section = meta["primary_section"]
    difficulty = meta["difficulty"]
    return ProblemAudit(
        id=int(meta["id"]),
        title=title,
        difficulty=difficulty,
        section=section,
        path=str(folder.relative_to(ROOT)).replace("\\", "/"),
        tier=pedagogy_tier(title, difficulty, section),
        score=total,
        classification=classify(total),
        scores=scores,
        blockers=[key for key, value in scores.items() if value == 0],
        recommended_action=next_action(scores),
        golden_set=title in GOLDEN_TITLES,
    )


def discover() -> list[ProblemAudit]:
    meta_files = sorted(PROBLEMS.glob("*/*/meta.yaml"))
    if len(meta_files) != EXPECTED:
        raise RuntimeError(
            f"Expected {EXPECTED} canonical meta.yaml files, found {len(meta_files)}. "
            "Audit refuses to produce a partial baseline."
        )
    items = [audit(path) for path in meta_files]
    ids = [item.id for item in items]
    duplicates = [value for value, count in Counter(ids).items() if count > 1]
    if duplicates:
        raise RuntimeError(f"Duplicate LeetCode ids in canonical inventory: {duplicates}")
    return sorted(items, key=lambda item: (item.section, item.id))


def payload(items: list[ProblemAudit]) -> dict:
    by_class = Counter(item.classification for item in items)
    by_tier = Counter(item.tier for item in items)
    grouped: dict[str, list[ProblemAudit]] = defaultdict(list)
    for item in items:
        grouped[item.section].append(item)

    sections = {}
    for section, section_items in sorted(grouped.items()):
        sections[section] = {
            "count": len(section_items),
            "averageScore": round(sum(item.score for item in section_items) / len(section_items), 2),
            "critical": sum(item.classification == "Critical" for item in section_items),
            "partial": sum(item.classification == "Partial" for item in section_items),
            "close": sum(item.classification == "Close" for item in section_items),
            "model": sum(item.classification == "Model" for item in section_items),
        }

    return {
        "schemaVersion": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "auditMethod": "deterministic structural baseline; semantic pedagogy still requires reviewer/Newbie Simulator review",
        "expectedProblemCount": EXPECTED,
        "actualProblemCount": len(items),
        "scoreRange": [0, 12],
        "criteria": list(CRITERIA),
        "classification": {"Critical": "0-4", "Partial": "5-8", "Close": "9-11", "Model": "12"},
        "summary": {
            "classificationCounts": dict(sorted(by_class.items())),
            "tierCounts": {str(key): value for key, value in sorted(by_tier.items())},
            "averageScore": round(sum(item.score for item in items) / len(items), 2),
            "goldenSetCount": sum(item.golden_set for item in items),
        },
        "sections": sections,
        "problems": [asdict(item) for item in items],
    }


def markdown(data: dict) -> str:
    summary = data["summary"]
    lines = [
        "# Newbie-first Solution Audit — Top Interview 150",
        "",
        "> Generated by `python tools/audit_newbie_solutions.py --write`.",
        ">",
        "> This deterministic structural baseline prioritizes migration. It does not replace semantic review with the Newbie Simulator gate.",
        "",
        "## Baseline summary",
        "",
        f"- Coverage: **{data['actualProblemCount']}/{data['expectedProblemCount']}** canonical problems",
        f"- Average structural score: **{summary['averageScore']}/12**",
        f"- Golden-set matches: **{summary['goldenSetCount']}/8**",
        f"- Tier distribution: **T1 {summary['tierCounts'].get('1', 0)} · T2 {summary['tierCounts'].get('2', 0)} · T3 {summary['tierCounts'].get('3', 0)}**",
        "- Classification: " + " · ".join(
            f"**{name} {summary['classificationCounts'].get(name, 0)}**"
            for name in ("Critical", "Partial", "Close", "Model")
        ),
        "",
        "## Scoring model",
        "",
        "Six criteria are scored 0–2 (12 total): problem framing, algorithm derivation, state/data-structure meaning, Java blockers, dry run/correctness, and transfer/mistakes.",
        "",
        "Classification: **Critical 0–4**, **Partial 5–8**, **Close 9–11**, **Model 12**.",
        "",
        "## Section summary",
        "",
        "| Section | Count | Avg /12 | Critical | Partial | Close | Model |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    for section, row in data["sections"].items():
        lines.append(
            f"| `{section}` | {row['count']} | {row['averageScore']} | {row['critical']} | "
            f"{row['partial']} | {row['close']} | {row['model']} |"
        )

    lines += [
        "",
        "## 150-problem inventory",
        "",
        "| # | Section | Problem | Diff | Tier | Score | Class | Zero-score blockers | Golden |",
        "|---:|---|---|---|---:|---:|---|---|:---:|",
    ]
    for item in data["problems"]:
        blockers = ", ".join(item["blockers"]) if item["blockers"] else "—"
        title = item["title"].replace("|", "\\|")
        lines.append(
            f"| {item['id']} | `{item['section']}` | {title} | {item['difficulty']} | {item['tier']} | "
            f"{item['score']} | **{item['classification']}** | {blockers} | {'✓' if item['golden_set'] else ''} |"
        )

    lines += [
        "",
        "## Priority order",
        "",
        "1. Golden set first, regardless of current score.",
        "2. Then Critical problems, Tier 3 before Tier 2 before Tier 1.",
        "3. Then Partial problems in the execution-plan section order.",
        "4. Close/Model files still receive semantic review; structural score never auto-exempts a file.",
        "",
        "Use `docs/content/solution-newbie-audit.json` for per-criterion scores and recommended actions.",
        "",
    ]
    return "\n".join(lines)


def stable_payload(data: dict) -> dict:
    if not JSON_REPORT.exists():
        return data
    try:
        old = json.loads(JSON_REPORT.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return data
    old_without_time = {k: v for k, v in old.items() if k != "generatedAt"}
    new_without_time = {k: v for k, v in data.items() if k != "generatedAt"}
    if old_without_time == new_without_time:
        data["generatedAt"] = old.get("generatedAt", data["generatedAt"])
    return data


def write_if_changed(path: Path, content: str) -> bool:
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true", help="write JSON and Markdown reports")
    parser.add_argument("--check", action="store_true", help="fail if committed reports are missing/stale")
    args = parser.parse_args()

    items = discover()
    data = stable_payload(payload(items))
    json_text = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    md_text = markdown(data)

    if args.write:
        changed = []
        if write_if_changed(JSON_REPORT, json_text):
            changed.append(str(JSON_REPORT.relative_to(ROOT)))
        if write_if_changed(MD_REPORT, md_text):
            changed.append(str(MD_REPORT.relative_to(ROOT)))
        print(f"Audited {len(items)}/{EXPECTED} problems; avg={data['summary']['averageScore']}/12")
        print("Updated: " + (", ".join(changed) if changed else "nothing"))
        return 0

    if args.check:
        failures = []
        for path, expected_text in ((JSON_REPORT, json_text), (MD_REPORT, md_text)):
            if not path.exists():
                failures.append(f"missing {path.relative_to(ROOT)}")
            elif path.read_text(encoding="utf-8") != expected_text:
                failures.append(f"stale {path.relative_to(ROOT)}; run --write")
        if failures:
            print("Newbie audit check failed:")
            for failure in failures:
                print(f"- {failure}")
            return 1
        print(f"Newbie audit current: {len(items)}/{EXPECTED} problems")
        return 0

    print(json.dumps(data["summary"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
