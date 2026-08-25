# 33. Search in Rotated Sorted Array

## Difficulty / Độ khó
**Medium / Trung bình**

## Problem / Đề bài
> **EN:** An ascending array of distinct integers may be rotated at an unknown index. Given the resulting array `nums` and integer `target`, return the `target` index or `-1` if absent. The algorithm must run in `O(log n)`.
>
> **VI:** Mảng tăng dần gồm các giá trị phân biệt có thể đã xoay tại một vị trí chưa biết. Hãy trả về index của `target` hoặc `-1` nếu không tồn tại, trong `O(log n)`.

## Examples / Ví dụ
```text
nums = [4,5,6,7,0,1,2], target = 0 -> 4
nums = [4,5,6,7,0,1,2], target = 3 -> -1
nums = [1], target = 0 -> -1
```

## Constraints / Ràng buộc
> **EN:** `1 <= `nums`.length <= 5000`; values are unique; `nums` is sorted ascending and possibly rotated.
>
> **VI:** Mảng không rỗng, giá trị unique, và là mảng tăng dần có thể đã xoay.

## Source / Nguồn
LeetCode: https://leetcode.com/problems/search-in-rotated-sorted-array/

English wording preserved from `raw/top-interview-150/Binary Search.txt` (blob `2d446f1a9dafbceb9c18cb7f8e7afcddb516a115`).
