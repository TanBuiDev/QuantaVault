# 322. Coin Change

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.
>
> **VI:** Bạn được cho mảng số nguyên `coins` biểu diễn các mệnh giá đồng xu khác nhau và số nguyên `amount` biểu diễn tổng tiền cần tạo.

> **EN:** Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.
>
> **VI:** Trả về số đồng xu ít nhất cần để tạo đúng `amount`. Nếu không thể tạo được, trả về `-1`.

> **EN:** You may assume that you have an infinite number of each kind of coin.
>
> **VI:** Có thể dùng vô hạn số lượng của mỗi loại đồng xu.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: coins = [1,2,5], amount = 11
Output: 3
```

> **EN:** Explanation: 11 = 5 + 5 + 1
>
> **VI:** `11 = 5 + 5 + 1`, cần `3` đồng xu.

### Example 2 / Ví dụ 2

```text
Input: coins = [2], amount = 3
Output: -1
```

### Example 3 / Ví dụ 3

```text
Input: coins = [1], amount = 0
Output: 0
```

## Constraints / Ràng buộc

> **EN:** `1 <= coins.length <= 12`
>
> **VI:** Số loại coin từ `1` đến `12`.

> **EN:** `1 <= coins[i] <= 231 - 1`
>
> **VI:** Mỗi mệnh giá dương và không vượt miền số nguyên 32-bit dương.

> **EN:** `0 <= amount <= 104`
>
> **VI:** `amount` nằm từ `0` đến `10^4`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/coin-change/

English wording preserved from `raw/top-interview-150/1D DP.txt` (blob `df3dd4badad938a311d58828af8e8062866c43fe`).
