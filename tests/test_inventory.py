from __future__ import annotations

import unittest

from tools.inventory import parse_problem_blocks


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


if __name__ == "__main__":
    unittest.main()
