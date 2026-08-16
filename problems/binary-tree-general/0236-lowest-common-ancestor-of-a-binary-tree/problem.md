# 236. Lowest Common Ancestor of a Binary Tree

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given a binary tree, find the lowest common ancestor (LCA) of two given nodes `p` and `q`. The LCA is the lowest node that has both `p` and `q` as descendants, where a node may be a descendant of itself.
>
> **VI:** Cho một binary tree, hãy tìm lowest common ancestor (LCA) của hai node `p` và `q`. LCA là node thấp nhất có cả `p` và `q` là descendants, và một node được phép là descendant của chính nó.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
```

### Example 2 / Ví dụ 2

```text
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
```

Here `p` itself is an ancestor of `q`.

### Example 3 / Ví dụ 3

```text
Input: root = [1,2], p = 1, q = 2
Output: 1
```

## Constraints / Ràng buộc

> **EN:** The tree contains `[2, 10^5]` nodes, all node values are unique, `p != q`, and both nodes exist in the tree.
>
> **VI:** Tree có `[2, 10^5]` node, mọi value là duy nhất, `p != q`, và cả hai node chắc chắn tồn tại trong tree.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
