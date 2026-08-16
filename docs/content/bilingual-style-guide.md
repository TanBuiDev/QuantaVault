# LeetCode Bilingual Content Style Guide

Date: 2026-08-15
Applies to: canonical problem packages under `problems/`

## 1. Purpose

This guide keeps English–Vietnamese LeetCode content consistent across all problem statements, solutions, hints, and interview-preparation files.

The repository is intended both for direct study and for future website ingestion, so wording should be stable, readable, and predictable.

## 2. Source-language rule

When the user has supplied the original English problem statement:

- Preserve that English wording.
- Do not silently rewrite it for style or grammar.
- Place the Vietnamese translation immediately after the corresponding English paragraph, list item, example explanation, or constraint interpretation.
- Translation may clarify meaning but must not change the requirement.
- Do not translate code identifiers, variable names, Java keywords, class names, method names, or complexity notation such as `O(n)`.

## 3. Formatting rule for `problem.md`

Use this pattern:

```markdown
> **English source sentence.**
>
> **VI:** Bản dịch tiếng Việt tương ứng.
```

For longer source paragraphs, the same EN → VI order applies without forcing every sentence into a separate quote block when that would hurt readability.

Examples use:

```text
Example 1 / Ví dụ 1
Input / Đầu vào
Output / Đầu ra
Explanation / Giải thích
```

Constraints keep the original mathematical expression and add a short Vietnamese interpretation below only when useful.

## 4. Canonical terminology

| English | Preferred Vietnamese wording |
|---|---|
| non-decreasing | không giảm |
| non-increasing | không tăng |
| in-place | tại chỗ (`in-place`) |
| array | mảng |
| subarray | mảng con liên tiếp |
| string | chuỗi |
| substring | chuỗi con liên tiếp |
| subsequence | dãy con giữ nguyên thứ tự tương đối |
| element | phần tử |
| index | chỉ số |
| pointer | con trỏ / chỉ số con trỏ, tùy ngữ cảnh |
| two pointers | kỹ thuật `two pointers` / hai con trỏ |
| sliding window | cửa sổ trượt (`sliding window`) |
| constraint | ràng buộc |
| edge case | trường hợp biên |
| brute force | vét cạn (`brute force`) |
| greedy | tham lam (`greedy`) |
| dynamic programming | quy hoạch động (`dynamic programming`) |
| backtracking | quay lui (`backtracking`) |
| binary search | tìm kiếm nhị phân (`binary search`) |
| breadth-first search | tìm kiếm theo chiều rộng (`BFS`) |
| depth-first search | tìm kiếm theo chiều sâu (`DFS`) |
| time complexity | độ phức tạp thời gian |
| space complexity | độ phức tạp bộ nhớ |
| extra space | bộ nhớ phụ |
| constant extra space | bộ nhớ phụ hằng số |
| invariant | bất biến |
| one pass | duyệt một lần (`one pass`) |
| sorted | đã sắp xếp |
| strictly increasing | tăng nghiêm ngặt |
| strictly decreasing | giảm nghiêm ngặt |
| maximum | lớn nhất / tối đa, tùy ngữ cảnh |
| minimum | nhỏ nhất / tối thiểu, tùy ngữ cảnh |
| optimal solution | lời giải tối ưu |
| trade-off | đánh đổi |
| follow-up | câu hỏi mở rộng (`follow-up`) |

## 5. Algorithm names

Common algorithm and pattern names should usually remain visible in English even when a Vietnamese explanation is given.

Preferred:

```text
kỹ thuật two pointers
cửa sổ trượt (sliding window)
quy hoạch động (dynamic programming)
thuật toán greedy / chiến lược tham lam
```

Avoid translating a standard algorithm name so aggressively that the learner no longer recognizes the English interview term.

## 6. `solution.md` language style

The main explanatory language is Vietnamese, with important algorithm vocabulary retained in English.

Good:

```text
Ta duy trì `minPrice`, tức minimum price seen so far, trong lúc quét mảng từ trái sang phải.
```

Avoid unnecessary bilingual duplication of every ordinary explanatory sentence. Full line-by-line bilingual treatment belongs in `problem.md` and structured interview Q&A belongs in `interview.md`.

## 7. `hints.md` style

Hints should become progressively more revealing:

1. conceptual direction;
2. pattern/invariant recognition;
3. near-implementation insight.

Hints should not paste the final Java solution.

When practical, each hint uses:

```text
EN: ...
VI: ...
```

## 8. Interview English style

English answers in `interview.md` should be suitable for a Java fresher interview:

- use short sentences;
- use simple grammar;
- keep technical terms correct;
- prefer language that is easy to say aloud;
- explain the invariant, complexity, and trade-offs directly;
- avoid filler such as “Basically, what I would like to do here is...”;
- avoid unnecessarily academic or advanced wording;
- do not make the answer sound memorized when a simpler natural sentence works.

Example:

```text
I scan the array from left to right and keep the minimum price seen so far.
For each day, I treat the current price as the selling price and update the best profit.
```

## 9. Interview question labeling

Unless an external source supports an empirical frequency claim, generated questions use labels such as:

```text
Core practice question
Common reasoning check
Likely follow-up
Variation practice
```

Do not label generated questions as “most frequently asked” or “commonly asked by interviewers” without evidence.

## 10. Code and identifiers

Never translate:

- Java keywords such as `class`, `return`, `for`, `if`;
- class names such as `Solution`, `TreeNode`, `ListNode`;
- method names such as `maxProfit`;
- variables such as `prices`, `minPrice`, `maxProfit`;
- complexity notation such as `O(n)` and `O(1)`.

Explain their role in Vietnamese instead.

## 11. Consistency rule

When a term already has a preferred wording in this guide, future problem packages must reuse it unless the local problem context makes that translation technically inaccurate.

If a new recurring term appears in several problems, add it to this guide before allowing multiple independent translations to spread across the repository.
