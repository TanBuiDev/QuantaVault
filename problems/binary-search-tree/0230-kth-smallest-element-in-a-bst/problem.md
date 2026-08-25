# 230. Kth Smallest Element in a BST

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the `root` of a binary search tree and an integer `k`, return the `k`th smallest value (1-indexed) among all node values.
>
> **VI:** Cho root của một BST và integer `k`, trả về value nhỏ thứ `k` (đánh số từ 1) trong toàn bộ node.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: root = [3,1,4,null,2], k = 1
Output: 1
```

### Example 2 / Ví dụ 2
```text
Input: root = [5,3,6,2,4,null,null,1], k = 3
Output: 3
```

## Constraints / Ràng buộc

> **EN:** `1 <= `k` <= n <= 10^4` and `0 <= `Node`.val <= 10^4`.
>
> **VI:** `1 <= k <= n <= 10^4` và `0 <= Node.val <= 10^4`.

## Follow-up / Câu hỏi thêm

> **EN:** If the BST changes frequently and `k`th-smallest queries are frequent, how would you optimize?
>
> **VI:** Nếu BST thường xuyên insert/delete và query kth-smallest nhiều lần, bạn sẽ tối ưu thế nào?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/kth-smallest-element-in-a-bst/

English wording preserved from `raw/top-interview-150/Binary Search Tree.txt` (blob `34c3c1fd4b55556ae34c7a48aba752c6c7f46d19`).
