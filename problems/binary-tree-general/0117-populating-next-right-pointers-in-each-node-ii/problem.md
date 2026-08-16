# 117. Populating Next Right Pointers in Each Node II

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given a binary tree where each node contains `val`, `left`, `right`, and `next`, populate every `next` pointer so it points to the next node on the same level to the right. If there is no such node, set `next` to `NULL`.
>
> **VI:** Cho một binary tree mà mỗi node có `val`, `left`, `right` và `next`. Hãy gán mỗi con trỏ `next` tới node kế tiếp bên phải trên cùng level. Nếu không có node nào như vậy, `next` phải là `NULL`.

> **EN:** Initially, all `next` pointers are set to `NULL`.
>
> **VI:** Ban đầu, tất cả con trỏ `next` đều bằng `NULL`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: root = [1,2,3,4,5,null,7]
Output: [1,#,2,3,#,4,5,7,#]
```

The output is serialized level by level through `next`; `#` marks the end of a level.

### Example 2 / Ví dụ 2

```text
Input: root = []
Output: []
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in the tree is in the range `[0, 6000]`.
>
> **VI:** Số node của tree nằm trong khoảng `[0, 6000]`.

> **EN:** `-100 <= Node.val <= 100`
>
> **VI:** `-100 <= Node.val <= 100`.

## Follow-up / Câu hỏi thêm

> **EN:** You may only use constant extra space. The recursive approach is fine; implicit stack space does not count as extra space for this problem.
>
> **VI:** Chỉ được dùng constant extra space. Có thể dùng recursion; implicit stack space không được tính là extra space trong yêu cầu này.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
