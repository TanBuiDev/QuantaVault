# 122. Best Time to Buy and Sell Stock II

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an integer array `prices` where `prices[i]` is the price of a given stock on the `i`th day.
>
> **VI:** Bạn được cho mảng số nguyên `prices`, trong đó `prices[i]` là giá cổ phiếu vào ngày thứ `i`.

> **EN:** On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can sell and buy the stock multiple times on the same day, ensuring you never hold more than one share of the stock.
>
> **VI:** Mỗi ngày, bạn có thể quyết định mua và/hoặc bán cổ phiếu. Tại mọi thời điểm bạn chỉ được giữ tối đa một cổ phiếu. Tuy nhiên, bạn có thể bán rồi mua lại trong cùng một ngày, miễn là không bao giờ giữ quá một cổ phiếu.

> **EN:** Find and return the maximum profit you can achieve.
>
> **VI:** Hãy tìm và trả về lợi nhuận lớn nhất có thể đạt được.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: prices = [7,1,5,3,6,4]
Output: 7
```

> **EN:** Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4. Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3. Total profit is 4 + 3 = 7.
>
> **VI:** Giải thích: Mua ngày 2 với giá `1`, bán ngày 3 với giá `5`, lời `4`. Sau đó mua ngày 4 với giá `3`, bán ngày 5 với giá `6`, lời `3`. Tổng lợi nhuận là `7`.

### Example 2 / Ví dụ 2

```text
Input: prices = [1,2,3,4,5]
Output: 4
```

> **EN:** Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4. Total profit is 4.
>
> **VI:** Giải thích: Mua ngày 1 với giá `1` và bán ngày 5 với giá `5`, lợi nhuận bằng `4`.

### Example 3 / Ví dụ 3

```text
Input: prices = [7,6,4,3,1]
Output: 0
```

> **EN:** Explanation: There is no way to make a positive profit, so we never buy the stock to achieve the maximum profit of 0.
>
> **VI:** Giải thích: Không có cách nào tạo lợi nhuận dương, vì vậy ta không mua và lợi nhuận lớn nhất là `0`.

## Constraints / Ràng buộc

> **EN:** `1 <= `prices`.length <= 3 * 10^4`
>
> **VI:** Độ dài `prices` từ `1` đến `3 * 10^4`.

> **EN:** `0 <= `prices[i]` <= 10^4`
>
> **VI:** Mỗi `prices[i]` nằm trong khoảng `0` đến `10^4`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
