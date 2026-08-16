# 70. Climbing Stairs

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** You are climbing a staircase. It takes n steps to reach the top.
>
> **VI:** Bạn đang leo một cầu thang gồm `n` bậc để lên tới đỉnh.

> **EN:** Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
>
> **VI:** Mỗi lần bạn có thể leo `1` hoặc `2` bậc. Có bao nhiêu cách khác nhau để lên tới đỉnh?

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: n = 2
Output: 2
```

> **EN:** Explanation: There are two ways to climb to the top.
> 1. 1 step + 1 step
> 2. 2 steps
>
> **VI:** Có hai cách: `1+1` hoặc `2`.

### Example 2 / Ví dụ 2

```text
Input: n = 3
Output: 3
```

> **EN:** Explanation: There are three ways to climb to the top.
> 1. 1 step + 1 step + 1 step
> 2. 1 step + 2 steps
> 3. 2 steps + 1 step
>
> **VI:** Có ba cách: `1+1+1`, `1+2`, hoặc `2+1`.

## Constraints / Ràng buộc

> **EN:** `1 <= n <= 45`
>
> **VI:** `n` nằm trong khoảng từ `1` đến `45`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/climbing-stairs/

English wording preserved from `raw/top-interview-150/1D DP.txt` (blob `df3dd4badad938a311d58828af8e8062866c43fe`).
