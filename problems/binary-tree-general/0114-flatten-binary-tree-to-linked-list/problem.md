# 114. Flatten Binary Tree to Linked List

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the `root` of a binary tree, flatten the tree into a "linked list". The linked list must use the same `TreeNode` class: every `left` pointer is `null`, each `right` pointer `points` to the `next` node, and the order must match preorder traversal.
>
> **VI:** Cho root của một binary tree, hãy làm phẳng tree thành một "linked list" ngay trên chính các `TreeNode`: mọi `left` phải bằng `null`, `right` trỏ tới node kế tiếp, và thứ tự phải giống preorder traversal.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: root = [1,2,5,3,4,null,6]
Output: [1,null,2,null,3,null,4,null,5,null,6]
```

### Example 2 / Ví dụ 2

```text
Input: root = []
Output: []
```

### Example 3 / Ví dụ 3

```text
Input: root = [0]
Output: [0]
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in the tree is in the range `[0, 2000]`.
>
> **VI:** `The number of nodes in the tree is in the range [0, 2000].`

> **EN:** `-100 <= `Node`.val <= 100`
>
> **VI:** `-100 <= Node.val <= 100`.

## Follow-up / Câu hỏi thêm

> **EN:** Can you flatten the tree in-place with `O(1)` extra space?
>
> **VI:** Có thể flatten in-place với `O(1)` extra space không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/flatten-binary-tree-to-linked-list/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
