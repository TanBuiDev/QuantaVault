# 92. Reverse Linked List II

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the head of a singly linked list and two integers left and right where left <= right, reverse the nodes of the list from position left to position right, and return the reversed list.
>
> **VI:** Cho `head` của một singly linked list cùng hai số nguyên `left` và `right` với `left <= right`. Hãy đảo ngược các node từ vị trí `left` tới `right` và trả về linked list sau khi thay đổi.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]
```

### Example 2 / Ví dụ 2

```text
Input: head = [5], left = 1, right = 1
Output: [5]
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in the list is n.
>
> **VI:** Gọi `n` là số node trong list.

> **EN:** 1 <= n <= 500
>
> **VI:** `1 <= n <= 500`.

> **EN:** -500 <= Node.val <= 500
>
> **VI:** `Node.val` nằm trong `[-500, 500]`.

> **EN:** 1 <= left <= right <= n
>
> **VI:** `1 <= left <= right <= n`.

## Follow-up / Câu hỏi mở rộng

> **EN:** Could you do it in one pass?
>
> **VI:** Bạn có thể thực hiện trong một pass không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/reverse-linked-list-ii/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
