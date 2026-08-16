# 74. Search a 2D Matrix

## Difficulty / Độ khó
**Medium / Trung bình**

## Problem / Đề bài
> **EN:** Given an `m x n` integer matrix where each row is sorted in non-decreasing order and the first integer of each row is greater than the last integer of the previous row, return whether `target` exists. Solve in `O(log(m*n))`.
>
> **VI:** Cho ma trận `m x n`, mỗi hàng tăng không giảm và phần tử đầu mỗi hàng lớn hơn phần tử cuối hàng trước. Hãy kiểm tra `target` trong `O(log(m*n))`.

## Examples / Ví dụ
```text
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3 -> true
same matrix, target = 13 -> false
```

## Constraints / Ràng buộc
> **EN:** Matrix dimensions are positive; matrix values follow the ordering rules above.
>
> **VI:** Ma trận không rỗng và tuân thủ thứ tự toàn cục đã nêu.

## Source / Nguồn
LeetCode: https://leetcode.com/problems/search-a-2d-matrix/

English wording preserved from `raw/top-interview-150/Binary Search.txt` (blob `2d446f1a9dafbceb9c18cb7f8e7afcddb516a115`).
