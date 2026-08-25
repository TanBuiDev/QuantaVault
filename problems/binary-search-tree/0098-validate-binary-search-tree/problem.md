# 98. Validate Binary Search Tree

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the `root` of a binary tree, determine whether it is a valid binary search tree. Every node in the `left` subtree must be strictly smaller than the node, every node in the `right` subtree strictly greater, and both subtrees must satisfy the same rule.
>
> **VI:** Cho root của một binary tree, hãy xác định tree có phải BST hợp lệ hay không. Mọi node ở left subtree phải nhỏ hơn current node, mọi node ở right subtree phải lớn hơn, và cả hai subtree cũng phải thỏa quy tắc này.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: root = [2,1,3]
Output: true
```

### Example 2 / Ví dụ 2
```text
Input: root = [5,1,4,null,null,3,6]
Output: false
```

## Constraints / Ràng buộc

> **EN:** The tree contains `[1, 10^4]` nodes and node values can be any signed 32-bit integer.
>
> **VI:** Tree có `[1, 10^4]` node và value có thể là bất kỳ signed 32-bit integer nào.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/validate-binary-search-tree/

English wording preserved from `raw/top-interview-150/Binary Search Tree.txt` (blob `34c3c1fd4b55556ae34c7a48aba752c6c7f46d19`).
