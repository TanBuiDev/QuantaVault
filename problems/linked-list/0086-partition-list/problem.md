# 86. Partition List

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the `head` of a linked list and a value `x`, partition it such that `all` nodes less than `x` come before nodes greater than or equal to `x`.
>
> **VI:** Cho `head` của một linked list và giá trị `x`. Hãy partition list sao cho mọi node có value nhỏ hơn `x` đứng trước các node có value lớn hơn hoặc bằng `x`.

> **EN:** You should preserve the original relative order of the nodes in each of the two partitions.
>
> **VI:** Phải giữ nguyên thứ tự tương đối ban đầu của các node trong từng partition.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: head = [1,4,3,2,5,2], x = 3
Output: [1,2,2,4,3,5]
```

### Example 2 / Ví dụ 2

```text
Input: head = [2,1], x = 2
Output: [1,2]
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in the list is in the range [0, 200].
>
> **VI:** `The number of nodes in the list is in the range [0, 200].`

> **EN:** -100 <= `Node`.val <= 100
>
> **VI:** `Node.val` nằm trong `[-100, 100]`.

> **EN:** -200 <= `x` <= 200
>
> **VI:** `x` nằm trong `[-200, 200]`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/partition-list/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
