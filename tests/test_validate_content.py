from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = REPO_ROOT / "tools" / "validate_content.py"

VALID_META = """schema_version: 2
id: 121
slug: best-time-to-buy-and-sell-stock
title: Best Time to Buy and Sell Stock
difficulty: Easy
primary_section: array-string
content_status:
  source: full-source
  translation: complete
  hints: complete
  solution: complete
  interview: complete
  cases: complete
  problem_media: none
  solution_media: none
source:
  provider: leetcode
  raw_file: \"Array  String.txt\"
  raw_blob_sha: \"193928590a8e65c3882a54482bcec77f2b17e470\"
study_plans:
  - top-interview-150
topics:
  - Array
  - Dynamic Programming
patterns:
  - Running Minimum
  - One Pass
solution_languages:
  - java
time_complexity: O(n)
space_complexity: O(1)
leetcode_url: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
"""

PROBLEM_MD = """# 121. Best Time to Buy and Sell Stock

## Difficulty / Độ khó
Easy

## Problem / Đề bài

You are given an array prices.

Bạn được cho một mảng prices.

## Examples / Ví dụ

Example 1 / Ví dụ 1

## Constraints / Ràng buộc

`1 <= prices.length <= 10^5`

Độ dài mảng nằm trong giới hạn trên.
"""

INTERVIEW_MD = """# Interview Preparation / Chuẩn bị phỏng vấn

Q (EN): Can you explain your approach?
Q (VI): Bạn có thể giải thích cách tiếp cận không?

Short answer (EN): I keep the minimum price seen so far.
Trả lời ngắn (VI): Tôi giữ giá nhỏ nhất đã thấy.

Standard answer (EN): I scan from left to right and update the best profit.
Trả lời chuẩn (VI): Tôi duyệt từ trái sang phải và cập nhật lợi nhuận tốt nhất.
"""

CASES_YAML = """schema_version: 1
problem_id: 121
contract_type: method
language_contract:
  class: Solution
  method: maxProfit
  parameters:
    - name: prices
      type: int[]
  return_type: int
cases:
  - name: example-1
    source: problem-example
    input:
      prices: [7, 1, 5, 3, 6, 4]
    expected: 5
"""


def write_valid_problem(root: Path) -> Path:
    problem_dir = root / "problems" / "array-string" / "0121-best-time-to-buy-and-sell-stock"
    problem_dir.mkdir(parents=True)
    (problem_dir / "meta.yaml").write_text(VALID_META, encoding="utf-8")
    (problem_dir / "problem.md").write_text(PROBLEM_MD, encoding="utf-8")
    (problem_dir / "hints.md").write_text("# Hints / Gợi ý\n", encoding="utf-8")
    (problem_dir / "solution.md").write_text("# Solution\n", encoding="utf-8")
    (problem_dir / "interview.md").write_text(INTERVIEW_MD, encoding="utf-8")
    (problem_dir / "Solution.java").write_text("class Solution {}\n", encoding="utf-8")
    (problem_dir / "cases.yaml").write_text(CASES_YAML, encoding="utf-8")
    return problem_dir


def run_validator(root: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VALIDATOR), "--root", str(root)],
        text=True,
        capture_output=True,
        check=False,
    )


class ValidateContentV2Tests(unittest.TestCase):
    def assert_validation_failure(self, root: Path, message: str) -> None:
        result = run_validator(root)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn(message, result.stdout)

    def test_complete_v2_problem_passes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            write_valid_problem(root)
            result = run_validator(root)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn("PASS", result.stdout)

    def test_complete_translation_requires_bilingual_problem(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            problem_dir = write_valid_problem(root)
            (problem_dir / "problem.md").write_text(
                "# Problem\n\n## Problem\nEnglish only.\n",
                encoding="utf-8",
            )
            self.assert_validation_failure(root, "translation marked complete but problem.md is not bilingual")

    def test_complete_interview_requires_bilingual_qa(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            problem_dir = write_valid_problem(root)
            (problem_dir / "interview.md").write_text(
                "# Interview\n\nQ (EN): Explain it.\n\nShort answer (EN): One pass.\n",
                encoding="utf-8",
            )
            self.assert_validation_failure(root, "interview marked complete but bilingual Q&A markers are missing")

    def test_interview_accepts_markdown_heading_answer_labels(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            problem_dir = write_valid_problem(root)
            (problem_dir / "interview.md").write_text(
                """# Interview Preparation / Chuẩn bị phỏng vấn

**Q (EN):** Can you explain your approach?

**Q (VI):** Bạn có thể giải thích cách tiếp cận không?

### Short answer (EN)

One pass.

### Trả lời ngắn (VI)

Duyệt một lần.

### Standard answer (EN)

I keep the minimum price seen so far.

### Trả lời chuẩn (VI)

Tôi giữ giá nhỏ nhất đã thấy.
""",
                encoding="utf-8",
            )
            result = run_validator(root)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_complete_cases_requires_cases_yaml(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            problem_dir = write_valid_problem(root)
            (problem_dir / "cases.yaml").unlink()
            self.assert_validation_failure(root, "cases marked complete but cases.yaml is missing")

    def test_full_source_requires_provenance(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            problem_dir = write_valid_problem(root)
            meta = VALID_META.replace(
                '  raw_blob_sha: "193928590a8e65c3882a54482bcec77f2b17e470"\n',
                "",
            )
            (problem_dir / "meta.yaml").write_text(meta, encoding="utf-8")
            self.assert_validation_failure(root, "full-source metadata requires source.raw_file and source.raw_blob_sha")

    def test_media_scope_must_match_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            problem_dir = write_valid_problem(root)
            asset = problem_dir / "assets" / "solution" / "example-1.png"
            asset.parent.mkdir(parents=True)
            asset.write_bytes(b"not-a-real-image-but-path-exists")
            meta = VALID_META + """media:
  - id: example-1
    path: assets/solution/example-1.png
    scope: problem
    role: example
    origin: project-created
    alt_en: Example visual
    alt_vi: Hình minh họa ví dụ
"""
            (problem_dir / "meta.yaml").write_text(meta, encoding="utf-8")
            self.assert_validation_failure(root, "media scope/path mismatch")

    def test_solution_complete_requires_solution_and_java(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            problem_dir = write_valid_problem(root)
            (problem_dir / "solution.md").unlink()
            self.assert_validation_failure(root, "solution marked complete but solution.md is missing")

    def test_hints_complete_requires_hints_file(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            problem_dir = write_valid_problem(root)
            (problem_dir / "hints.md").unlink()
            self.assert_validation_failure(root, "hints marked complete but hints.md is missing")

    def test_extract_study_plan_ids_supports_inline_problem_lists(self) -> None:
        from tools.validate_content import extract_study_plan_ids

        text = """sections:
  - name: A
    problems: [88, 27, 121]
  - name: B
    problems: [122, 55]
"""
        self.assertEqual(extract_study_plan_ids(text), [88, 27, 121, 122, 55])


if __name__ == "__main__":
    unittest.main()
