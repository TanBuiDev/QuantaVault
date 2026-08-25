# 137. Single Number II

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an integer array `nums` where every element appears three times except for one, which appears exactly once. Find the `single` element and return it.
>
> **VI:** Cho mảng số nguyên `nums`, mọi phần tử xuất hiện ba lần ngoại trừ một phần tử xuất hiện đúng một lần. Hãy tìm và trả về phần tử đó.

> **EN:** You must implement a solution with a linear runtime complexity and use only constant extra space.
>
> **VI:** Lời giải phải chạy tuyến tính và chỉ dùng bộ nhớ phụ hằng số.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: nums = [2,2,3,2]
Output: 3
```

### Example 2 / Ví dụ 2
```text
Input: nums = [0,1,0,1,0,1,99]
Output: 99
```

## Constraints / Ràng buộc

> **EN:** `1 <= `nums`.length <= 3 * 10^4`
>
> **VI:** Mảng có từ 1 đến `3 * 10^4` phần tử.

> **EN:** `-2^31 <= `nums[i]` <= 2^31 - 1`
>
> **VI:** Mỗi giá trị nằm trong miền int 32-bit có dấu.

> **EN:** Each element in `nums` appears exactly three times except for one element which appears once.
>
> **VI:** Mọi phần tử xuất hiện đúng ba lần, trừ một phần tử xuất hiện một lần.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/single-number-ii/

English wording preserved from `raw/top-interview-150/Bit Manipulation.txt` (blob `f830a5d6c97e848fd7dbb66703601652e69a2db4`).
