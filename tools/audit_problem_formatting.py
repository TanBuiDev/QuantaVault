#!/usr/bin/env python3
"""Audit semantic formatting issues in canonical LeetCode problem.md files.

Scans all problems under problems/*/*/problem.md and identifies:
- P0: Collapsed exponent (105, 104, 109, 231, etc.), signed power corruption (-231, -104, etc.),
      fraction corruption (1/22), variable exponents (xn), and integer bounds (-231 <= n <= 231-1).
- P1: Identifier formatting mismatch between EN and VI (e.g. `prices[i]` in VI but plain text in EN).
- P2: Minor consistency or presentation formatting issues.

Outputs report to JSON and Markdown format.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, List, Optional

# Patterns for P0 issues
COLLAPSED_EXPONENT_PATTERNS = [
    # (Regex pattern, description, suggestion generator)
    (r"\b105\b", "10^5 collapsed as 105", lambda m: "10^5"),
    (r"\b104\b", "10^4 collapsed as 104", lambda m: "10^4"),
    (r"\b109\b", "10^9 collapsed as 109", lambda m: "10^9"),
    (r"\b106\b", "10^6 collapsed as 106", lambda m: "10^6"),
    (r"\b231-1\b", "2^31 - 1 collapsed as 231-1", lambda m: "2^31 - 1"),
    (r"\b231\b", "2^31 collapsed as 231", lambda m: "2^31"),
    (r"-231\b", "-2^31 collapsed as -231", lambda m: "-2^31"),
    (r"-104\b", "-10^4 collapsed as -104", lambda m: "-10^4"),
    (r"-105\b", "-10^5 collapsed as -105", lambda m: "-10^5"),
    (r"-109\b", "-10^9 collapsed as -109", lambda m: "-10^9"),
    (r"\b1/22\b", "1 / 2^2 collapsed as 1/22", lambda m: "1 / 2^2"),
    (r"\b2-2\b", "2^-2 collapsed as 2-2", lambda m: "2^-2"),
    (r"\bxn\b", "x^n collapsed as xn", lambda m: "x^n"),
]

# Generic identifier extraction from VI inline code
CODE_IDENTIFIER_PATTERN = re.compile(r"`([a-zA-Z_][a-zA-Z0-9_\.\[\]]*(?:\(\))?)`")

COMMON_IDENTIFIERS = [
    "prices", "prices[i]", "nums", "nums[i]", "nums[j]", "matrix", "matrix[i][j]",
    "root", "head", "left", "right", "TreeNode", "ListNode", "intervals", "grid",
    "word", "words", "haystack", "needle", "s", "t", "p", "s[i]", "t[i]",
    "nums.length", "prices.length", "s.length", "matrix.length", "points",
    "board", "board[i][j]", "k", "n", "m", "i", "j"
]


@dataclass
class Issue:
    type: str
    severity: str  # P0, P1, P2
    line: int
    context: str
    english: str
    vietnamese: Optional[str]
    suggestion: str
    confidence: float
    action: str  # auto-repair, needs-review, manual


@dataclass
class ProblemAuditResult:
    problem_id: int
    slug: str
    file: str
    issues: List[Issue]


def parse_problem_md(filepath: Path) -> tuple[int, str, List[tuple[int, str, str]]]:
    """Parse problem.md into bilingual EN/VI block pairs with line numbers."""
    content = filepath.read_text(encoding="utf-8")
    lines = content.splitlines()
    
    # Extract problem ID & slug
    # header line: # 121. Best Time to Buy and Sell Stock
    problem_id = 0
    slug = filepath.parent.name
    id_match = re.match(r"^#\s+(\d+)\.", lines[0] if lines else "")
    if id_match:
        problem_id = int(id_match.group(1))

    pairs = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("> **EN:**"):
            en_line_num = i + 1
            en_text = line[len("> **EN:**"):].strip()
            vi_text = ""
            # Find matching VI
            j = i + 1
            while j < len(lines) and not lines[j].startswith("> **EN:**") and not lines[j].startswith("##") and not lines[j].startswith("###"):
                if lines[j].startswith("> **VI:**"):
                    vi_text = lines[j][len("> **VI:**"):].strip()
                    break
                j += 1
            pairs.append((en_line_num, en_text, vi_text))
        i += 1

    return problem_id, slug, pairs


def audit_problem(filepath: Path) -> ProblemAuditResult:
    problem_id, slug, pairs = parse_problem_md(filepath)
    issues: List[Issue] = []

    content = filepath.read_text(encoding="utf-8")
    lines = content.splitlines()

    for line_idx, line in enumerate(lines):
        line_num = line_idx + 1

        # Check for unclosed math delimiters $
        dollar_count = line.count("$")
        if dollar_count % 2 != 0:
            issues.append(
                Issue(
                    type="unclosed-math-delimiter",
                    severity="P0",
                    line=line_num,
                    context=line,
                    english=line,
                    vietnamese=None,
                    suggestion="Fix mismatched $ delimiters",
                    confidence=0.99,
                    action="needs-review",
                )
            )

    for en_line_num, en_text, vi_text in pairs:
        # 1. P0 Audits: Exponent & Bound Collapses
        for pattern, desc, sug_fn in COLLAPSED_EXPONENT_PATTERNS:
            # Look for matches in EN text
            for match in re.finditer(pattern, en_text):
                matched_token = match.group(0)
                
                # Check for false positives:
                # E.g. in Sqrt(x), 2^31 - 1 is already formatted properly
                # If matched_token is part of 10^5 or 2^31, ignore
                start, end = match.span()
                # Check surrounding context
                prefix = en_text[max(0, start - 2):start]
                suffix = en_text[end:min(len(en_text), end + 2)]
                if "^" in prefix or "^" in suffix:
                    continue
                
                # If token is 'xn', ensure it's not part of a bigger English word
                if matched_token == "xn":
                    pass

                # Calculate confidence
                # If VI mentions 10^5 / 10^4 / 2^31 / x^n or math, confidence is very high
                confidence = 0.85
                action = "needs-review"

                if "10^" in vi_text or "2^31" in vi_text or "^" in vi_text or "$" in vi_text:
                    confidence = 0.99
                    action = "auto-repair"
                elif matched_token in ["105", "104", "109", "106", "231-1", "-231", "1/22", "2-2", "xn"]:
                    # In constraint context (e.g. <= or length), highly likely collapsed power
                    if "<=" in en_text or "<" in en_text or ">=" in en_text or "length" in en_text or "pow" in en_text.lower():
                        confidence = 0.95
                        action = "auto-repair"

                issues.append(
                    Issue(
                        type="collapsed-exponent",
                        severity="P0",
                        line=en_line_num,
                        context=en_text,
                        english=en_text,
                        vietnamese=vi_text,
                        suggestion=sug_fn(match),
                        confidence=confidence,
                        action=action,
                    )
                )

        # 2. P1 Audits: Identifier Mismatch
        # If VI has `identifier` but EN has plain identifier without backticks
        vi_code_tokens = set(CODE_IDENTIFIER_PATTERN.findall(vi_text))
        for token in vi_code_tokens:
            # Check if token is a standard identifier (skip single pure numbers)
            if token.isdigit():
                continue
            if len(token) <= 1 and token not in ["i", "j", "k", "n", "m", "s", "t", "p", "x"]:
                continue
            # If EN contains plain token but not `token`
            en_code_tokens = set(CODE_IDENTIFIER_PATTERN.findall(en_text))
            if token not in en_code_tokens:
                # Check if plain token is in EN text as word
                escaped_token = re.escape(token)
                if re.search(r"(?<!`)\b" + escaped_token + r"\b(?!`)", en_text):
                    issues.append(
                        Issue(
                            type="identifier-format-mismatch",
                            severity="P1",
                            line=en_line_num,
                            context=f"Token `{token}` code-formatted in VI but plain in EN",
                            english=en_text,
                            vietnamese=vi_text,
                            suggestion=f"Format `{token}` as inline code in EN",
                            confidence=0.90,
                            action="auto-repair" if token in COMMON_IDENTIFIERS else "needs-review",
                        )
                    )

    return ProblemAuditResult(
        problem_id=problem_id,
        slug=slug,
        file=str(filepath.as_posix()),
        issues=issues,
    )


def main():
    parser = argparse.ArgumentParser(description="Audit LeetCode bilingual problem statements.")
    parser.add_argument("--root", default="problems", help="Path to problems directory")
    parser.add_argument("--out-json", default="reports/problem-format-audit.json", help="Output JSON path")
    parser.add_argument("--out-md", default="reports/problem-format-audit.md", help="Output Markdown report path")
    parser.add_argument("--ci", action="store_true", help="Fail if any P0 issues are found")
    args = parser.parse_args()

    root_path = Path(args.root)
    problem_files = sorted(root_path.glob("*/*/problem.md"))

    print(f"Auditing {len(problem_files)} problem.md files under {root_path}...")

    results: List[ProblemAuditResult] = []
    total_p0 = 0
    total_p1 = 0
    total_p2 = 0

    for file in problem_files:
        res = audit_problem(file)
        if res.issues:
            results.append(res)
            for iss in res.issues:
                if iss.severity == "P0":
                    total_p0 += 1
                elif iss.severity == "P1":
                    total_p1 += 1
                else:
                    total_p2 += 1

    # Ensure output dir
    Path(args.out_json).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out_md).parent.mkdir(parents=True, exist_ok=True)

    # Write JSON report
    json_data = {
        "summary": {
            "total_files_scanned": len(problem_files),
            "files_with_issues": len(results),
            "p0_count": total_p0,
            "p1_count": total_p1,
            "p2_count": total_p2,
        },
        "results": [
            {
                "problem_id": r.problem_id,
                "slug": r.slug,
                "file": r.file,
                "issues": [asdict(i) for i in r.issues],
            }
            for r in results
        ],
    }

    with open(args.out_json, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=2, ensure_ascii=False)

    # Write Markdown report
    with open(args.out_md, "w", encoding="utf-8") as f:
        f.write("# LeetCode Bilingual Problem Formatting Audit Report\n\n")
        f.write("## Summary\n\n")
        f.write(f"- **Total files scanned:** {len(problem_files)}\n")
        f.write(f"- **Files with issues:** {len(results)}\n")
        f.write(f"- **P0 Issues (Semantic / Exponent corruption):** {total_p0}\n")
        f.write(f"- **P1 Issues (Identifier formatting mismatch):** {total_p1}\n")
        f.write(f"- **P2 Issues (Other formatting):** {total_p2}\n\n")

        if total_p0 > 0:
            f.write("## ⚠️ P0 Issues (Critical Semantic Corruption)\n\n")
            for r in results:
                p0_issues = [i for i in r.issues if i.severity == "P0"]
                if p0_issues:
                    f.write(f"### #{r.problem_id} `{r.slug}` ({len(p0_issues)} issues)\n")
                    f.write(f"File: [{r.file}]({r.file})\n\n")
                    for iss in p0_issues:
                        f.write(f"- **Line {iss.line}** [{iss.type} - {iss.action}]: `{iss.context}`\n")
                        f.write(f"  - Suggestion: `{iss.suggestion}` (Confidence: {iss.confidence})\n")
                        if iss.vietnamese:
                            f.write(f"  - VI reference: `{iss.vietnamese}`\n")
                    f.write("\n")

        if total_p1 > 0:
            f.write("## ℹ️ P1 Issues (Identifier Formatting Mismatch)\n\n")
            for r in results:
                p1_issues = [i for i in r.issues if i.severity == "P1"]
                if p1_issues:
                    f.write(f"### #{r.problem_id} `{r.slug}` ({len(p1_issues)} issues)\n")
                    f.write(f"File: [{r.file}]({r.file})\n\n")
                    for iss in p1_issues:
                        f.write(f"- **Line {iss.line}**: {iss.context}\n")
                        f.write(f"  - Suggestion: {iss.suggestion}\n")
                    f.write("\n")

    print(f"Audit completed: {len(problem_files)} scanned, {len(results)} files with issues.")
    print(f"Summary: P0 = {total_p0}, P1 = {total_p1}, P2 = {total_p2}")
    print(f"Reports saved to {args.out_json} and {args.out_md}")

    if args.ci and total_p0 > 0:
        print(f"CI Check failed: Found {total_p0} P0 issues!")
        sys.exit(1)


if __name__ == "__main__":
    main()
