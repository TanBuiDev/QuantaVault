# 2. Add Two Numbers

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.
>
> **VI:** Bạn được cho hai linked list không rỗng, mỗi list biểu diễn một số nguyên không âm. Các chữ số được lưu theo thứ tự đảo ngược và mỗi node chứa đúng một chữ số. Hãy cộng hai số và trả về kết quả dưới dạng linked list.

> **EN:** You may assume the two numbers do not contain any leading zero, except the number 0 itself.
>
> **VI:** Có thể giả sử hai số không có leading zero, ngoại trừ chính số `0`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

**VI:** Vì digits được lưu reverse, `[2,4,3]` biểu diễn `342` và `[5,6,4]` biểu diễn `465`. Tổng là `807`, nên kết quả reverse là `[7,0,8]`.

### Example 2 / Ví dụ 2

```text
Input: l1 = [0], l2 = [0]
Output: [0]
```

### Example 3 / Ví dụ 3

```text
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in each linked list is in the range [1, 100].
>
> **VI:** Số node của mỗi linked list nằm trong khoảng `[1, 100]`.

> **EN:** 0 <= `Node`.val <= 9
>
> **VI:** Giá trị của mỗi node là một chữ số từ `0` đến `9`.

> **EN:** It is guaranteed that the list represents a number that does not have leading zeros.
>
> **VI:** Đảm bảo linked list biểu diễn số không có leading zero.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/add-two-numbers/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
