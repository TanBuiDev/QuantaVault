# 19. Remove Nth Node From End of List

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the `head` of a linked list, `remove` the nth node from the end of the list and return its `head`.
>
> **VI:** Cho `head` của một linked list. Hãy xóa node thứ `n` tính từ cuối list và trả về head sau khi xóa.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
```

### Example 2 / Ví dụ 2

```text
Input: head = [1], n = 1
Output: []
```

### Example 3 / Ví dụ 3

```text
Input: head = [1,2], n = 1
Output: [1]
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in the list is sz.
>
> **VI:** Gọi `sz` là số node trong list.

> **EN:** 1 <= sz <= 30
>
> **VI:** `1 <= sz <= 30`.

> **EN:** 0 <= `Node`.val <= 100
>
> **VI:** `Node.val` nằm trong `[0, 100]`.

> **EN:** 1 <= `n` <= sz
>
> **VI:** `1 <= n <= sz`.

## Follow-up / Câu hỏi mở rộng

> **EN:** Could you do this in one pass?
>
> **VI:** Bạn có thể làm việc này trong một pass không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/remove-nth-node-from-end-of-list/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
