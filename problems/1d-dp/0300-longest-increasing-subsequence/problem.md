# 300. Longest Increasing Subsequence

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an integer array `nums`, return the length of the longest strictly increasing subsequence.
>
> **VI:** Cho mảng số nguyên `nums`, hãy trả về độ dài của dãy con giữ nguyên thứ tự tương đối tăng nghiêm ngặt dài nhất.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
```

> **EN:** Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
>
> **VI:** Một longest increasing subsequence là `[2,3,7,101]`, nên độ dài bằng `4`.

### Example 2 / Ví dụ 2

```text
Input: nums = [0,1,0,3,2,3]
Output: 4
```

### Example 3 / Ví dụ 3

```text
Input: nums = [7,7,7,7,7,7,7]
Output: 1
```

## Constraints / Ràng buộc

> **EN:** `1 <= `nums`.length <= 2500`
>
> **VI:** Độ dài `nums` từ `1` đến `2500`.

> **EN:** `-10^4 <= `nums[i]` <= 10^4`
>
> **VI:** Mỗi phần tử nằm trong khoảng `-10^4` đến `10^4`.

> **EN:** Follow up: Can you come up with an algorithm that runs in O(n log(n)) time complexity?
>
> **VI:** Follow-up: Có thể xây dựng thuật toán chạy trong `O(n log n)` không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/longest-increasing-subsequence/

English wording preserved from `raw/top-interview-150/1D DP.txt` (blob `df3dd4badad938a311d58828af8e8062866c43fe`).
