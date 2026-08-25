# 188. Best Time to Buy and Sell Stock IV

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** You are given an integer array `prices` where `prices[i]` is the price of a given stock on the `i`th day, and an integer `k`.
>
> **VI:** Bạn được cho mảng số nguyên `prices`, trong đó `prices[i]` là giá cổ phiếu ở ngày thứ `i`, cùng một số nguyên `k`.

> **EN:** Find the maximum profit you can achieve. You may complete at most `k` transactions: i.e. you may buy at most `k` times and sell at most `k` times.
>
> **VI:** Hãy tìm lợi nhuận lớn nhất có thể đạt được. Bạn được hoàn thành nhiều nhất `k` giao dịch, tức mua nhiều nhất `k` lần và bán nhiều nhất `k` lần.

> **EN:** Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).
>
> **VI:** Lưu ý: Không được thực hiện nhiều giao dịch đồng thời; phải bán cổ phiếu đang giữ trước khi mua lại.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: k = 2, prices = [2,4,1]
Output: 2
```

> **EN:** Explanation: Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2.
>
> **VI:** Mua ngày 1 giá `2`, bán ngày 2 giá `4`, lợi nhuận bằng `2`.

### Example 2 / Ví dụ 2

```text
Input: k = 2, prices = [3,2,6,5,0,3]
Output: 7
```

> **EN:** Explanation: Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4. Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.
>
> **VI:** Giao dịch thứ nhất lời `4`, giao dịch thứ hai lời `3`, tổng lợi nhuận là `7`.

## Constraints / Ràng buộc

> **EN:** `1 <= `k` <= 100`
>
> **VI:** `k` nằm trong khoảng từ `1` đến `100`.

> **EN:** `1 <= `prices`.length <= 1000`
>
> **VI:** Độ dài `prices` từ `1` đến `1000`.

> **EN:** `0 <= `prices[i]` <= 1000`
>
> **VI:** Mỗi giá nằm trong khoảng từ `0` đến `1000`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/

English wording preserved from `raw/top-interview-150/Multidimensional DP.txt` (blob `0c0e6aa2f7812aa5c83065c7d856912aa0ed8b8f`).
