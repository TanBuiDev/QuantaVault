# 103. Binary Tree Zigzag Level Order Traversal

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the `root` of a binary tree, return the zigzag level-order traversal of its nodes' values: `left`-to-`right` for one level, `right`-to-`left` for the `next`, alternating thereafter.
>
> **VI:** Cho root của một binary tree, hãy trả về zigzag level-order traversal: level đầu từ trái sang phải, level kế từ phải sang trái rồi tiếp tục xen kẽ.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[20,9],[15,7]]
```

### Example 2 / Ví dụ 2
```text
Input: root = [1]
Output: [[1]]
```

### Example 3 / Ví dụ 3
```text
Input: root = []
Output: []
```

## Constraints / Ràng buộc

> **EN:** The number of nodes is in `[0, 2000]` and `-100 <= `Node`.val <= 100`.
>
> **VI:** Số node nằm trong `[0, 2000]` và `-100 <= Node.val <= 100`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/

English wording preserved from `raw/top-interview-150/Binary Tree BFS.txt` (blob `20ce0899e516b4822ae7954e35b781e840be2b73`).
