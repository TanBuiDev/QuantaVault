from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.inventory import build_inventory, parse_problem_blocks


class InventoryParserTests(unittest.TestCase):
    def test_ignores_numbered_explanation_steps(self) -> None:
        text = """1D DP
70. Climbing Stairs
Easy
You are climbing stairs.
Example 1:
Input: n = 2
Output: 2
Explanation:
1. 1 step + 1 step
2. 2 steps
Example 2:
Input: n = 3
Output: 3
Constraints:
1 <= n <= 45

198. House Robber
Medium
Given nums.
Example 1:
Input: nums = [1,2]
Output: 2
Constraints:
1 <= nums.length <= 100
"""
        parsed = parse_problem_blocks(text)
        self.assertEqual([item["id"] for item in parsed], [70, 198])
        self.assertTrue(all(item["source_status"] == "available" for item in parsed))

    def test_unnumbered_example_counts_as_full_source(self) -> None:
        text = """Trie
211. Design Add and Search Words Data Structure
Medium
Design a data structure.
Example:
Input
["WordDictionary"]
Output
[null]
Constraints:
1 <= word.length <= 25
"""
        parsed = parse_problem_blocks(text)
        self.assertEqual(len(parsed), 1)
        self.assertEqual(parsed[0]["id"], 211)
        self.assertEqual(parsed[0]["source_status"], "available")

    def test_problem_header_accepts_status_line_before_difficulty(self) -> None:
        text = """Array / String
88. Merge Sorted Array
Solved
Easy
Given arrays.
Example 1:
Input: nums1 = [1], nums2 = []
Output: [1]
Constraints:
1 <= nums1.length <= 200

189. Rotate Array
Attempted
Medium
Rotate the array.
Example 1:
Input: nums = [1], k = 0
Output: [1]
Constraints:
1 <= nums.length <= 100000
"""
        parsed = parse_problem_blocks(text)
        self.assertEqual([item["id"] for item in parsed], [88, 189])
        self.assertEqual([item["difficulty"] for item in parsed], ["Easy", "Medium"])
        self.assertTrue(all(item["source_status"] == "available" for item in parsed))

    def test_duplicate_stack_source_keeps_unique_155_and_placeholder_150(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            raw = root / "raw" / "top-interview-150"
            raw.mkdir(parents=True)
            (raw / "Stack.txt").write_text(
                """Stack
155. Min Stack
Medium
Design stack.
Example 1:
Input: []
Output: []
Constraints:
1 <= calls <= 10

155. Min Stack
Medium
Design stack duplicated.
Example 1:
Input: []
Output: []
Constraints:
1 <= calls <= 10

224. Basic Calculator
Hard
Calculate expression.
Example 1:
Input: s = \"1+1\"
Output: 2
Constraints:
1 <= s.length <= 10
""",
                encoding="utf-8",
            )

            inventory = build_inventory(root)
            ids = [item["id"] for item in inventory["problems"]]
            self.assertEqual(ids.count(155), 1)
            self.assertIn(150, ids)
            pending = next(item for item in inventory["problems"] if item["id"] == 150)
            self.assertEqual(pending["source_status"], "source-missing")
            self.assertEqual(pending["raw_source_file"], "Stack.txt")
            self.assertEqual(pending["source_order"], 4)
            self.assertEqual([item["id"] for item in inventory["duplicates"]], [155])

    def test_array_string_source_with_prior_problems_uses_real_source_order(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            raw = root / "raw" / "top-interview-150"
            raw.mkdir(parents=True)
            (raw / "Array  String.txt").write_text(
                """Array / String
88. Merge Sorted Array
Easy
27. Remove Element
Easy
26. Remove Duplicates from Sorted Array
Easy
80. Remove Duplicates from Sorted Array II
Medium
169. Majority Element
Easy
189. Rotate Array
Medium
121. Best Time to Buy and Sell Stock
Easy
""",
                encoding="utf-8",
            )

            inventory = build_inventory(root)
            array_items = [
                item for item in inventory["problems"] if item["section"] == "array-string"
            ]
            self.assertEqual(
                [item["id"] for item in array_items[:7]],
                [88, 27, 26, 80, 169, 189, 121],
            )
            self.assertEqual(
                [item["source_order"] for item in array_items[:7]],
                [1, 2, 3, 4, 5, 6, 7],
            )
            self.assertTrue(
                all(item["raw_source_file"] == "Array  String.txt" for item in array_items[:7])
            )


if __name__ == "__main__":
    unittest.main()
