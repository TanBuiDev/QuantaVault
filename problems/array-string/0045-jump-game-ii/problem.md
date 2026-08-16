# 45. Jump Game II

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given a 0-indexed array of integers nums of length n. You are initially positioned at index 0.
>
> **VI:** Bạn được cho mảng số nguyên `nums` có độ dài `n`, đánh index từ `0`. Ban đầu bạn đứng tại index `0`.

> **EN:** Each element nums[i] represents the maximum length of a forward jump from index i. In other words, if you are at index i, you can jump to any index (i + j) where:
>
> **VI:** Mỗi `nums[i]` biểu diễn độ dài tối đa của một bước nhảy về phía trước từ index `i`. Nói cách khác, nếu đang ở `i`, bạn có thể nhảy đến `i + j` khi:

> **EN:** `0 <= j <= nums[i]` and `i + j < n`
>
> **VI:** `0 <= j <= nums[i]` và `i + j < n`.

> **EN:** Return the minimum number of jumps to reach index n - 1. The test cases are generated such that you can reach index n - 1.
>
> **VI:** Hãy trả về số bước nhảy nhỏ nhất để tới index `n - 1`. Test đảm bảo luôn có thể tới index cuối.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: nums = [2,3,1,1,4]
Output: 2
```

> **EN:** Explanation: The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.
>
> **VI:** Giải thích: Cần tối thiểu `2` bước nhảy: từ index `0` đến `1`, rồi từ `1` tới index cuối.

### Example 2 / Ví dụ 2

```text
Input: nums = [2,3,0,1,4]
Output: 2
```

## Constraints / Ràng buộc

> **EN:** `1 <= nums.length <= 104`
>
> **VI:** Độ dài `nums` từ `1` đến `10^4`.

> **EN:** `0 <= nums[i] <= 1000`
>
> **VI:** Mỗi `nums[i]` nằm trong khoảng `0` đến `1000`.

> **EN:** It's guaranteed that you can reach nums[n - 1].
>
> **VI:** Đề đảm bảo luôn có thể tới `nums[n - 1]`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/jump-game-ii/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
