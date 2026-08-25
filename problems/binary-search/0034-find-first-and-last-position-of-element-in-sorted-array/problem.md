# 34. Find First and Last Position of Element in Sorted Array

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.
>
> **VI:** Cho mảng số nguyên `nums` đã sắp xếp không giảm, hãy tìm vị trí bắt đầu và kết thúc của giá trị `target`.

> **EN:** If `target` is not found in the array, return `[-1, -1]`. You must write an algorithm with `O(log n)` runtime complexity.
>
> **VI:** Nếu không tìm thấy `target`, trả về `[-1,-1]`. Thuật toán phải chạy trong `O(log n)`.

## Examples / Ví dụ

```text
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
```

```text
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
```

```text
Input: nums = [], target = 0
Output: [-1,-1]
```

## Constraints / Ràng buộc

> **EN:** `0 <= `nums`.length <= 10^5`; `nums` is non-decreasing; values and `target` are in `[-10^9,10^9]`.
>
> **VI:** Mảng có thể rỗng, đã sort không giảm, và các giá trị nằm trong phạm vi đề bài.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/

English wording preserved from `raw/top-interview-150/Binary Search.txt` (blob `2d446f1a9dafbceb9c18cb7f8e7afcddb516a115`).
