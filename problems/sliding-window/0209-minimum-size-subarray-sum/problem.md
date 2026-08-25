# 209. Minimum Size Subarray Sum

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return 0 instead.
>
> **VI:** Cho mảng số nguyên dương `nums` và số nguyên dương `target`, hãy trả về độ dài nhỏ nhất của một subarray có tổng lớn hơn hoặc bằng `target`. Nếu không tồn tại subarray như vậy, trả về `0`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: target = 7, nums = [2,3,1,2,4,3]
Output: 2
```

> **EN:** Explanation: The subarray [4,3] has the minimal length under the problem constraint.
>
> **VI:** Subarray `[4,3]` có độ dài nhỏ nhất thỏa điều kiện.

### Example 2 / Ví dụ 2

```text
Input: target = 4, nums = [1,4,4]
Output: 1
```

### Example 3 / Ví dụ 3

```text
Input: target = 11, nums = [1,1,1,1,1,1,1,1]
Output: 0
```

## Constraints / Ràng buộc

> **EN:** `1 <= `target` <= 10^9`
>
> **VI:** `1 <= target <= 10^9`.

> **EN:** `1 <= `nums`.length <= 10^5`
>
> **VI:** `1 <= nums.length <= 10^5`.

> **EN:** `1 <= `nums[i]` <= 10^4`
>
> **VI:** `1 <= nums[i] <= 10^4`.

## Follow-up / Câu hỏi mở rộng

> **EN:** Follow up: If you have figured out the O(n) solution, try coding another solution of which the time complexity is O(n log(n)).
>
> **VI:** Nếu đã có lời giải `O(n)`, hãy thử viết thêm một lời giải `O(n log n)`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/minimum-size-subarray-sum/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Sliding Window.txt
blob SHA: bb49634444716591f3f66b2bbff18e581b5e106c
```
