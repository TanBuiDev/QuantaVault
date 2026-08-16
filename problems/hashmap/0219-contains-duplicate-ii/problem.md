# 219. Contains Duplicate II

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given an integer array nums and an integer k, return true if there are two distinct indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.
>
> **VI:** Cho mảng số nguyên `nums` và số nguyên `k`, trả về `true` nếu tồn tại hai index khác nhau `i`, `j` sao cho `nums[i] == nums[j]` và `abs(i-j) <= k`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: nums = [1,2,3,1], k = 3
Output: true
```

### Example 2 / Ví dụ 2

```text
Input: nums = [1,0,1,1], k = 1
Output: true
```

### Example 3 / Ví dụ 3

```text
Input: nums = [1,2,3,1,2,3], k = 2
Output: false
```

## Constraints / Ràng buộc

> **EN:** `1 <= nums.length <= 105`
>
> **VI:** `1 <= nums.length <= 10^5`.

> **EN:** `-109 <= nums[i] <= 109`
>
> **VI:** `-10^9 <= nums[i] <= 10^9`.

> **EN:** `0 <= k <= 105`
>
> **VI:** `0 <= k <= 10^5`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/contains-duplicate-ii/

English wording preserved from `raw/top-interview-150/Hashmap.txt` (blob `27a5727700e86d5e4e15f746cd2ae51f3d8c2e01`).
