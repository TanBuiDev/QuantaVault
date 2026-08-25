# 35. Search Insert Position

## Difficulty / Độ khó
**Easy / Dễ**

## Problem / Đề bài
> **EN:** Given a sorted array of distinct integers and a `target` value, return its index if `found`. Otherwise return the index where it would be inserted in order. The algorithm must run in `O(log n)`.
>
> **VI:** Cho mảng tăng dần gồm các số nguyên phân biệt và `target`, trả về index nếu tìm thấy; nếu không, trả về vị trí chèn để vẫn giữ thứ tự, trong `O(log n)`.

## Examples / Ví dụ
```text
nums=[1,3,5,6], target=5 -> 2
nums=[1,3,5,6], target=2 -> 1
nums=[1,3,5,6], target=7 -> 4
```

## Constraints / Ràng buộc
> **EN:** `1 <= `nums`.length <= 10^4`; `nums` contains distinct values sorted ascending.
>
> **VI:** Mảng không rỗng, unique và tăng dần.

## Source / Nguồn
LeetCode: https://leetcode.com/problems/search-insert-position/

English wording preserved from `raw/top-interview-150/Binary Search.txt` (blob `2d446f1a9dafbceb9c18cb7f8e7afcddb516a115`).
