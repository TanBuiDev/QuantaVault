# 21. Merge Two Sorted Lists

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** You are given the heads of two sorted linked lists list1 and list2.
>
> **VI:** Bạn được cho head của hai linked list đã được sắp xếp là `list1` và `list2`.

> **EN:** Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.
>
> **VI:** Hãy merge hai list thành một sorted list. List kết quả phải được tạo bằng cách nối lại chính các node của hai list ban đầu.

> **EN:** Return the head of the merged linked list.
>
> **VI:** Trả về head của linked list sau khi merge.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

### Example 2 / Ví dụ 2

```text
Input: list1 = [], list2 = []
Output: []
```

### Example 3 / Ví dụ 3

```text
Input: list1 = [], list2 = [0]
Output: [0]
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in both lists is in the range [0, 50].
>
> **VI:** Tổng số node xét theo constraint của source nằm trong phạm vi `[0, 50]` cho mỗi mô tả list của bài.

> **EN:** -100 <= Node.val <= 100
>
> **VI:** Mỗi `Node.val` nằm trong `[-100, 100]`.

> **EN:** Both list1 and list2 are sorted in non-decreasing order.
>
> **VI:** Cả `list1` và `list2` đều được sắp xếp theo thứ tự không giảm.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/merge-two-sorted-lists/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
