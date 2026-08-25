# 25. Reverse Nodes in k-Group

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** Given the `head` of a linked list, `reverse` the nodes of the list `k` at a time, and return the modified list.
>
> **VI:** Cho `head` của một linked list. Hãy đảo các node theo từng nhóm `k` node và trả về list sau khi thay đổi.

> **EN:** `k` is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a `multiple` of `k` then `left`-out nodes, in the end, should remain as it is.
>
> **VI:** `k` là số nguyên dương và không lớn hơn độ dài list. Nếu số node không chia hết cho `k`, nhóm node còn dư ở cuối phải giữ nguyên thứ tự.

> **EN:** You may not alter the values in the list's nodes, only nodes themselves may be changed.
>
> **VI:** Không được sửa giá trị trong node; chỉ được thay đổi liên kết giữa các node.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: head = [1,2,3,4,5], k = 2
Output: [2,1,4,3,5]
```

### Example 2 / Ví dụ 2

```text
Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in the list is n.
>
> **VI:** Gọi `n` là số node trong list.

> **EN:** 1 <= `k` <= n <= 5000
>
> **VI:** `1 <= k <= n <= 5000`.

> **EN:** 0 <= `Node`.val <= 1000
>
> **VI:** `Node.val` nằm trong `[0, 1000]`.

## Follow-up / Câu hỏi mở rộng

> **EN:** Can you solve the problem in O(1) extra memory space?
>
> **VI:** Bạn có thể giải bài bằng `O(1)` bộ nhớ phụ không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/reverse-nodes-in-k-group/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
