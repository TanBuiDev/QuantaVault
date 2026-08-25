# 128. Longest Consecutive Sequence

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.
>
> **VI:** Cho mảng số nguyên chưa sắp xếp `nums`, hãy trả về độ dài của dãy các giá trị liên tiếp dài nhất.

> **EN:** You must write an algorithm that runs in O(n) time.
>
> **VI:** Phải viết thuật toán chạy trong `O(n)` time.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: nums = [100,4,200,1,3,2]
Output: 4
```

> **EN:** Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.
>
> **VI:** Dãy liên tiếp dài nhất là `[1,2,3,4]`, nên length bằng `4`.

### Example 2 / Ví dụ 2

```text
Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
```

### Example 3 / Ví dụ 3

```text
Input: nums = [1,0,1,2]
Output: 3
```

## Constraints / Ràng buộc

> **EN:** `0 <= `nums`.length <= 10^5`
>
> **VI:** `0 <= nums.length <= 10^5`.

> **EN:** `-10^9 <= `nums[i]` <= 10^9`
>
> **VI:** `-10^9 <= nums[i] <= 10^9`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/longest-consecutive-sequence/

English wording preserved from `raw/top-interview-150/Hashmap.txt` (blob `27a5727700e86d5e4e15f746cd2ae51f3d8c2e01`).
