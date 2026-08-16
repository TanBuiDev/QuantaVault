# 82. Remove Duplicates from Sorted List II

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Return the linked list sorted as well.
>
> **VI:** Cho `head` của một linked list đã được sắp xếp. Hãy xóa **toàn bộ node** có giá trị xuất hiện nhiều hơn một lần, chỉ giữ lại các giá trị xuất hiện đúng một lần trong list ban đầu. Trả về linked list vẫn theo thứ tự đã sắp xếp.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: head = [1,2,3,3,4,4,5]
Output: [1,2,5]
```

### Example 2 / Ví dụ 2

```text
Input: head = [1,1,1,2,3]
Output: [2,3]
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in the list is in the range [0, 300].
>
> **VI:** Số node nằm trong `[0, 300]`.

> **EN:** -100 <= Node.val <= 100
>
> **VI:** `Node.val` nằm trong `[-100, 100]`.

> **EN:** The list is guaranteed to be sorted in ascending order.
>
> **VI:** List được đảm bảo sắp xếp theo thứ tự tăng dần.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
