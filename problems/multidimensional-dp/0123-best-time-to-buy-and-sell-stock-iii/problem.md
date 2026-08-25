# 123. Best Time to Buy and Sell Stock III

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.
>
> **VI:** Bạn được cho mảng `prices`, trong đó `prices[i]` là giá cổ phiếu ở ngày thứ `i`.

> **EN:** Find the maximum profit you can achieve. You may complete at most `two` transactions.
>
> **VI:** Hãy tìm lợi nhuận lớn nhất có thể đạt được. Bạn được hoàn thành nhiều nhất hai giao dịch.

> **EN:** Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).
>
> **VI:** Lưu ý: Không được thực hiện nhiều giao dịch đồng thời; phải bán trước khi mua lại.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: prices = [3,3,5,0,0,3,1,4]
Output: 6
```

> **EN:** Explanation: Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.
> Then buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.
>
> **VI:** Giao dịch thứ nhất lời `3`, giao dịch thứ hai lời `3`, tổng là `6`.

### Example 2 / Ví dụ 2

```text
Input: prices = [1,2,3,4,5]
Output: 4
```

> **EN:** Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
> Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.
>
> **VI:** Mua ngày 1 và bán ngày 5 lời `4`; không được giữ hai vị thế mua cùng lúc.

### Example 3 / Ví dụ 3

```text
Input: prices = [7,6,4,3,1]
Output: 0
```

> **EN:** Explanation: In this case, no transaction is done, i.e. max profit = 0.
>
> **VI:** Không có giao dịch có lời nên kết quả là `0`.

## Constraints / Ràng buộc

> **EN:** `1 <= `prices`.length <= 10^5`
>
> **VI:** Độ dài `prices` từ `1` đến `10^5`.

> **EN:** `0 <= `prices[i]` <= 10^5`
>
> **VI:** `0 <= prices[i] <= 10^5`
## Source / Nguồn

LeetCode: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/

English wording preserved from `raw/top-interview-150/Multidimensional DP.txt` (blob `0c0e6aa2f7812aa5c83065c7d856912aa0ed8b8f`).
