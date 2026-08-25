# 121. Best Time to Buy and Sell Stock

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** You are given an array `prices` where `prices[i]` is the price of a given stock on the $i^{\text{th}}$ day.
>
> **VI:** Bạn được cho một mảng `prices`, trong đó `prices[i]` là giá của một cổ phiếu vào ngày thứ $i$.

> **EN:** You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
>
> **VI:** Bạn muốn tối đa hóa lợi nhuận bằng cách chọn **một ngày duy nhất để mua** cổ phiếu và chọn **một ngày khác trong tương lai để bán** cổ phiếu đó.

> **EN:** *Return the maximum profit you can achieve from this transaction.* If you cannot achieve any profit, return `0`.
>
> **VI:** Hãy *trả về lợi nhuận lớn nhất có thể đạt được từ giao dịch này*. Nếu không thể tạo ra lợi nhuận, hãy trả về `0`.


## Examples / Ví dụ

### Example 1 / Ví dụ 1

**Input / Đầu vào**

```text
prices = [7,1,5,3,6,4]
```

**Output / Đầu ra**

```text
5
```

> **EN:** Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
>
> **VI:** Giải thích: Mua vào ngày 2 (giá = 1) và bán vào ngày 5 (giá = 6), lợi nhuận = `6 - 1 = 5`.

> **EN:** Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
>
> **VI:** Lưu ý rằng mua vào ngày 2 rồi bán vào ngày 1 là không hợp lệ vì **ngày mua phải xảy ra trước ngày bán**.

### Example 2 / Ví dụ 2

**Input / Đầu vào**

```text
prices = [7,6,4,3,1]
```

**Output / Đầu ra**

```text
0
```

> **EN:** Explanation: In this case, no transactions are done and the max profit = 0.
>
> **VI:** Giải thích: Trong trường hợp này không thực hiện giao dịch nào và lợi nhuận lớn nhất bằng `0`.

## Constraints / Ràng buộc

> **EN:** `1 <= `prices`.length <= 10^5`
>
> **VI:** Độ dài của mảng `prices` nằm trong giới hạn từ `1` đến `10^5`.

> **EN:** `0 <= `prices[i]` <= 10^4`
>
> **VI:** `0 <= prices[i] <= 10^4`
## Source / Nguồn

LeetCode: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: 193928590a8e65c3882a54482bcec77f2b17e470
```

Bản tiếng Việt được thêm theo `docs/content/bilingual-style-guide.md`. Phần này chỉ trình bày và dịch đề bài, không chứa gợi ý hay lời giải thuật toán.
