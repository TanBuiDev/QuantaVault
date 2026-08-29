#!/usr/bin/env python3
"""Audit all Top Interview 150 solution.md files for newbie-first teaching signals.

This is intentionally a deterministic *structural baseline*, not a replacement for
human pedagogical review. It answers two questions cheaply and consistently:

1. Are all 150 canonical problem folders covered?
2. Which solution files are missing the teaching signals required by
   docs/content/newbie-solution-style-guide.md?

The report is designed to prioritize migration work. Low scores are not CI
failures by themselves. Missing canonical files / an unexpected problem count are.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
PROBLEMS = ROOT / "problems"
DEFAULT_JSON = ROOT / "docs/content/solution-newbie-audit.json"
DEFAULT_MD = ROOT / "docs/content/solution-newbie-audit.md"
EXPECTED_PROBLEMS = 150

CRITERIA = (
    "problem_framing",
    "algorithm_derivation",
    "state_and_structure_meaning",
    "java_blockers",
    "dry_run_and_correctness",
    "transfer_and_mistakes",
)

# Signals are deliberately bilingual because the repository mixes Vietnamese and
# English teaching terminology.
SIGNALS = {
    "problem_framing": (
        "bài toán", "hiểu đề", "problem", "input", "output", "ví dụ", "example",
        "constraint", "yêu cầu", "mục tiêu",
    ),
    "algorithm_derivation": (
        "brute force", "naive", "cách nghĩ", "bottleneck", "chậm", "observation",
        "quan sát", "intuition", "vì sao", "why", "optimal", "tối ưu", "ý tưởng",
    ),
    "state_and_structure_meaning": (
        "invariant", "state", "trạng thái", "đại diện", "lưu", "meaning", "boundary",
        "data structure", "cấu trúc dữ liệu", "pointer", "window", "frontier",
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
    "HashMap", "Map<", "ArrayList", "List<", "Deque", "ArrayDeque", "PriorityQueue",
    "computeIfAbsent", "Comparator", "Collections.", "Integer.MAX_VALUE",
    "Integer.MIN_VALUE", "<<", ">>", "^", " & ", " | ",
)

JAVA_EXPLANATION_SIGNALS = (
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


def strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def parse_meta(meta_path: Path) -> dict[str, str]:
    data: dict[str, str] = {}
    for raw_line in meta_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        if key in {"id", "title", "difficulty", "section"}:
            data[key] = strip_quotes(value.split(" #", 1)[0].strip())
    return data


def count_signals(text: str, signals: Iterable[str]) -> int:
    lower = text.lower()
    return sum(1 for signal in signals if signal.lower() in lower)


def has_markdown_table(text: str) -> bool:
    return bool(re.search(r"(?m)^\s*\|.+\|\s*$\n\s*\|(?:\s*:?-+:?\s*\|)+", text))


def has_ordered_steps(text: str) -> bool:
    return len(re.findall(r"(?m)^\s*\d+[.)]\s+", text)) >= 2


def has_ascii_flow(text: str) -> bool:
    return any(token in text for token in ("->", "→", "<->", "<=>", "│", "└", "├"))


def score_problem_framing(text: str) -> int:
    signals = count_signals(text, SIGNALS["problem_framing"])
    examples = len(re.findall(r"(?i)\b(example|ví dụ)\b", text))
    if signals >= 4 and examples >= 1:
        return 2
    if signals >= 2 or examples >= 1:
        return 1
    return 0


def score_derivation(text: str) -> int:
    signals = count_signals(text, SIGNALS["algorithm_derivation"])
    has_bridge = bool(re.search(
        r"(?is)(brute|naive|cách nghĩ|ban đầu).{0,900}(nhưng|bottleneck|chậm|too slow|vấn đề).{0,1200}(quan sát|observation|tối ưu|optimal|thay vì)",
        text,
    ))
    if signals >= 5 and has_bridge:
        return 2
    if signals >= 3:
        return 1
    return 0


def score_state_meaning(text: str) -> int:
    signals = count_signals(text, SIGNALS["state_and_structure_meaning"])
    identifiers = len(set(re.findall(r"`([A-Za-z_][A-Za-z0-9_.\[\]]*)`", text)))
    explanations = len(re.findall(
        r"(?i)`[^`]+`\s*(?:=|:|→|->|là|đại diện|lưu|means|stores|represents)", text
    ))
    if signals >= 4 and identifiers >= 3 and explanations >= 2:
        return 2
    if signals >= 2 or explanations >= 1:
        return 1
    return 0


def score_java_blockers(text: str, java_text: str) -> int:
    combined_code = f"{text}\n{java_text}"
    used = [api for api in JAVA_APIS if api in combined_code]
    if not used:
        # There is no advanced Java syntax to explain; absence is not a pedagogy gap.
        return 2
    explanation_count = count_signals(text, JAVA_EXPLANATION_SIGNALS)
    mentioned_apis = sum(1 for api in used if api.lower().replace("<", "") in text.lower())
    if explanation_count >= 2 and mentioned_apis >= min(2, len(used)):
        return 2
    if explanation_count >= 1 or mentioned_apis >= 1:
        return 1
    return 0


def score_dry_run_correctness(text: str) -> int:
    signals = count_signals(text, SIGNALS["dry_run_and_correctness"])
    trace_shape = has_markdown_table(text) or has_ordered_steps(text) or has_ascii_flow(text)
    complexity = bool(re.search(r"(?i)(time|thời gian).{0,80}O\s*\(", text))
    if signals >= 3 and trace_shape and complexity:
        return 2
    if signals >= 1 and (trace_shape or complexity):
        return 1
    return 0


def score_transfer(text: str) -> int:
    signals = count_signals(text, SIGNALS["transfer_and_mistakes"])
    if signals >= 4:
        return 2
    if signals >= 2:
        return 1
    return 0


def tier_for(title: str, difficulty: str, section: str) -> int:
    if title in TIER3_TITLES:
        return 3
    if difficulty.lower() == "hard":
        return 3
    if section in COMPLEX_SECTIONS or difficulty.lower() == "medium":
        return 2
    return 1


def classification(score: int) -> str:
    if score <= 4:
        return "Critical"
    if score <= 8:
        return "Partial"
    if score <= 11:
        return "Close"
    return "Model"


def recommended_action(scores: dict[str, int]) -> str:
    weakest = [criterion for criterion in CRITERIA if scores[criterion] == min(scores.values())]
    labels = {
        "problem_framing": "add a concrete problem framing + hand-worked example",
        "algorithm_derivation": "derive the optimal idea from a natural approach and its bottleneck",
        "state_and_structure_meaning": "explain variable/state/data-structure meaning before code",
        "java_blockers": "add focused Java API/syntax notes where they block comprehension",
        "dry_run_and_correctness": "add an implementation-state dry run and readable correctness bridge",
        "transfer_and_mistakes": "add concrete pitfalls and pattern-recognition transfer cues",
    }
    return "; ".join(labels[item] for item in weakest[:2])


def audit_problem(meta_path: Path) -> ProblemAudit:
    folder = meta_path.parent
    solution_path = folder / "solution.md"
    java_path = folder / "Solution.java"
    if not solution_path.exists():
        raise FileNotFoundError(f"Missing solution.md next to {meta_path.relative_to(ROOT)}")
    if not java_path.exists():
        raise FileNotFoundError(f"Missing Solution.java next to {meta_path.relative_to(ROOT)}")

    meta = parse_meta(meta_path)
    missing_meta = [key for key in ("id", "title") if not meta.get(key)]
    if missing_meta:
        raise ValueError(f"Missing {missing_meta} in {meta_path.relative_to(ROOT)}")

    title = meta["title"]
    section = meta.get("section") or folder.parent.name
    difficulty = meta.get("difficulty", "Unknown")
    text = solution_path.read_text(encoding="utf-8")
    java_text = java_path.read_text(encoding="utf-8")

    scores = {
        "problem_framing": score_problem_framing(text),
        "algorithm_derivation": score_derivation(text),
        "state_and_structure_meaning": score_state_meaning(text),
        "java_blockers": score_java_blockers(text, java_text),
        "dry_run_and_correctness": score_dry_run_correctness(text),
        "transfer_and_mistakes": score_transfer(text),
    }
    total = sum(scores.values())
    blockers = [criterion for criterion, value in scores.items() if value == 0]

    return ProblemAudit(
        id=int(meta["id"]),
        title=title,
        difficulty=difficulty,
        section=section,
        path=str(folder.relative_to(ROOT)).replace("\\", "/"),
        tier=tier_for(title, difficulty, section),
        score=total,
        classification=classification(total),
        scores=scores,
        blockers=blockers,
        recommended_action=recommended_action(scores),
        golden_set=title in GOLDEN_TITLES,
    )


def discover() -> list[ProblemAudit]:
    meta_files = sorted(PROBLEMS.glob("*/*/meta.yml"))
    if len(meta_files) != EXPECTED_PROBLEMS:
        raise RuntimeError(
            f"Expected {EXPECTED_PROBLEMS} canonical meta.yml files, found {len(meta_files)}. "
            "Audit refuses to produce a partial baseline."
        )
    audits = [audit_problem(path) for path in meta_files]
    ids = [item.id for item in audits]
    if len(ids) != len(set(ids)):
        duplicates = [item for item, count in Counter(ids).items() if count > 1]
        raise RuntimeError(f"Duplicate LeetCode ids in canonical inventory: {duplicates}")
    return sorted(audits, key=lambda item: (item.section, item.id))


def build_json(audits: list[ProblemAudit]) -> dict:
    classes = Counter(item.classification for item in audits)
    tiers = Counter(item.tier for item in audits)
    sections: dict[str, dict] = {}
    by_section: dict[str, list[ProblemAudit]] = defaultdict(list)
    for item in audits:
        by_section[item.section].append(item)
    for section, items in sorted(by_section.items()):
        sections[section] = {
            "count": len(items),
            "averageScore": round(sum(item.score for item in items) / len(items), 2),
            "critical": sum(item.classification == "Critical" for item in items),
            "partial": sum(item.classification == "Partial" for item in items),
            "close": sum(item.classification == "Close" for item in items),
            "model": sum(item.classification == "Model" for item in items),
        }
    return {
        "schemaVersion": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "auditMethod": "deterministic structural baseline; semantic pedagogy still requires reviewer/Newbie Simulator review",
        "expectedProblemCount": EXPECTED_PROBLEMS,
        "actualProblemCount": len(audits),
        "scoreRange": [0, 12],
        "criteria": list(CRITERIA),
        "classification": {
            "Critical": "0-4",
            "Partial": "5-8",
            "Close": "9-11",
            "Model": "12",
        },
        "summary": {
            "classificationCounts": dict(sorted(classes.items())),
            "tierCounts": {str(key): value for key, value in sorted(tiers.items())},
            "averageScore": round(sum(item.score for item in audits) / len(audits), 2),
            "goldenSetCount": sum(item.golden_set for item in audits),
        },
        "sections": sections,
        "problems": [asdict(item) for item in audits],
    }


def build_markdown(payload: dict) -> str:
    summary = payload["summary"]
    lines = [
        "# Newbie-first Solution Audit — Top Interview 150",
        "",
        "> Generated by `python tools/audit_newbie_solutions.py --write`.",
        ">",
        "> This is a deterministic structural baseline used to prioritize migration. A high score means the file contains the expected teaching signals; it does **not** replace semantic review with the Newbie Simulator gate.",
        "",
        "## Baseline summary",
        "",
        f"- Coverage: **{payload['actualProblemCount']}/{payload['expectedProblemCount']}** canonical problems",
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
        "Each criterion is scored 0–2 (12 points total):",
        "",
        "1. Problem framing / concrete example",
        "2. Algorithm derivation from a natural approach + bottleneck",
        "3. Variable, state, invariant, and data-structure meaning",
        "4. Java blocker explanation when advanced APIs/syntax are present",
        "5. Dry run / correctness bridge / complexity",
        "6. Transfer knowledge, concrete mistakes, and pattern recognition",
        "",
        "Classification: **Critical 0–4**, **Partial 5–8**, **Close 9–11**, **Model 12**.",
        "",
        "## Section summary",
        "",
        "| Section | Count | Avg /12 | Critical | Partial | Close | Model |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    for section, data in payload["sections"].items():
        lines.append(
            f"| `{section}` | {data['count']} | {data['averageScore']} | {data['critical']} | "
            f"{data['partial']} | {data['close']} | {data['model']} |"
        )

    lines.extend([
        "",
        "## 150-problem inventory",
        "",
        "| # | Section | Problem | Diff | Tier | Score | Class | Zero-score blockers | Golden |",
        "|---:|---|---|---|---:|---:|---|---|:---:|",
    ])
    for item in payload["problems"]:
        blockers = ", ".join(item["blockers"]) if item["blockers"] else "—"
        title = item["title"].replace("|", "\\|")
        lines.append(
            f"| {item['id']} | `{item['section']}` | {title} | {item['difficulty']} | "
            f"{item['tier']} | {item['score']} | **{item['classification']}** | {blockers} | "
            f"{'✓' if item['golden_set'] else ''} |"
        )

    lines.extend([
        "",
        "## Priority order",
        "",
        "Migration priority is deterministic:",
        "",
        "1. Golden set first, regardless of current score.",
        "2. Then `Critical` problems, Tier 3 before Tier 2 before Tier 1.",
        "3. Then `Partial` problems in the section order defined by the execution plan.",
        "4. `Close`/`Model` files still receive semantic review; they are not automatically exempt from rewrite.",
        "",
        "For exact per-criterion scores and the recommended next action, use `docs/content/solution-newbie-audit.json`.",
        "",
    ])
    return "\n".join(lines)


def write_if_changed(path: Path, content: str) -> bool:
    previous = path.read_text(encoding="utf-8") if path.exists() else None
    if previous == content:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true", help="Write JSON and Markdown reports")
    parser.add_argument("--check", action="store_true", help="Fail if generated reports are missing/stale")
    args = parser.parse_args()

    audits = discover()
    payload = build_json(audits)
    # generatedAt must not make --check stale on every run. Preserve the committed
    # timestamp when all semantic report data is unchanged.
    if DEFAULT_JSON.exists():
        try:
            existing = json.loads(DEFAULT_JSON.read_text(encoding="utf-8"))
            comparable_existing = {k: v for k, v in existing.items() if k != "generatedAt"}
            comparable_new = {k: v for k, v in payload.items() if k != "generatedAt"}
            if comparable_existing == comparable_new:
                payload["generatedAt"] = existing.get("generatedAt", payload["generatedAt"])
        except (json.JSONDecodeError, OSError):
            pass

    json_text = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    md_text = build_markdown(payload)

    if args.write:
        changed = []
        if write_if_changed(DEFAULT_JSON, json_text):
            changed.append(str(DEFAULT_JSON.relative_to(ROOT)))
        if write_if_changed(DEFAULT_MD, md_text):
            changed.append(str(DEFAULT_MD.relative_to(ROOT)))
        print(f"Audited {len(audits)}/{EXPECTED_PROBLEMS} problems; avg={payload['summary']['averageScore']}/12")
        print("Updated: " + (", ".join(changed) if changed else "nothing (reports already current)"))
        return 0

    if args.check:
        failures = []
        for path, expected in ((DEFAULT_JSON, json_text), (DEFAULT_MD, md_text)):
            if not path.exists():
                failures.append(f"missing {path.relative_to(ROOT)}")
            elif path.read_text(encoding="utf-8") != expected:
                failures.append(f"stale {path.relative_to(ROOT)}; run audit with --write")
        if failures:
            print("Newbie audit check failed:")
            for failure in failures:
                print(f"- {failure}")
            return 1
        print(f"Newbie audit current: {len(audits)}/{EXPECTED_PROBLEMS} problems")
        return 0

    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
