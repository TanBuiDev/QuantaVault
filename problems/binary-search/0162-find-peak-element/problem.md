# 162. Find Peak Element

## Difficulty / Độ khó
**Medium / Trung bình**

## Problem / Đề bài
> **EN:** A peak is strictly greater than its neighbors. Given `nums`, return the index of any peak. Imagine `nums[-1] = nums[n] = -∞`. The algorithm must run in `O(log n)`.
>
> **VI:** Peak là phần tử lớn hơn nghiêm ngặt hai hàng xóm. Hãy trả về index của bất kỳ peak nào, xem phần tử ngoài biên là `-∞`, trong `O(log n)`.

## Examples / Ví dụ
```text
[1,2,3,1] -> 2
[1,2,1,3,5,6,4] -> 5 (index 1 cũng hợp lệ)
```

## Constraints / Ràng buộc
> **EN:** `1 <= nums.length <= 1000`; adjacent values are different.
>
> **VI:** Mảng không rỗng và mọi cặp phần tử kề nhau khác nhau.

## Source / Nguồn
LeetCode: https://leetcode.com/problems/find-peak-element/

English wording preserved from `raw/top-interview-150/Binary Search.txt` (blob `2d446f1a9dafbceb9c18cb7f8e7afcddb516a115`).
