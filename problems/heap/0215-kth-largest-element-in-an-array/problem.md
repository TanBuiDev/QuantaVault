# 215. Kth Largest Element in an Array

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.
>
> **VI:** Cho mảng số nguyên `nums` và số nguyên `k`, hãy trả về phần tử lớn thứ `k` trong mảng.

> **EN:** It is the `k`th largest element in sorted order, not the `k`th distinct element. Can you solve it without sorting?
>
> **VI:** Đây là phần tử thứ `k` theo thứ tự giảm dần, không phải phần tử phân biệt thứ `k`. Hãy giải mà không sort toàn bộ mảng.

## Examples / Ví dụ

```text
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
```

```text
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
```

## Constraints / Ràng buộc

> **EN:** `1 <= `k` <= `nums`.length <= 10^5`, `-10^4 <= `nums[i]` <= 10^4`.
>
> **VI:** `k` hợp lệ trong độ dài mảng; giá trị nằm trong phạm vi đề bài.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/kth-largest-element-in-an-array/

English wording preserved from `raw/top-interview-150/Heap.txt` (blob `fbb1dbdac09eda7a70bdcda5a956eee1c308b031`).
