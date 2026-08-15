# 121. Best Time to Buy and Sell Stock — Solution

## 1. Core idea / intuition

Bài này nhìn giống một bài toán chứng khoán, nhưng cốt lõi là một bài **one-pass array** rất điển hình.

Khi đang đứng ở ngày hiện tại và giả sử hôm nay là ngày bán, ta chỉ cần biết:

> Giá mua thấp nhất đã xuất hiện **trước hoặc tại ngày hiện tại** là bao nhiêu?

Nếu giá hôm nay là `price` và giá thấp nhất đã thấy là `minPrice`, lợi nhuận nếu bán hôm nay là:

```text
profit = price - minPrice
```

Trong lúc quét mảng từ trái sang phải, ta duy trì hai giá trị:

```text
minPrice  = giá thấp nhất đã gặp
maxProfit = lợi nhuận lớn nhất đã tìm được
```

Nhờ vậy không cần thử tất cả cặp ngày mua/bán.

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Bilingual problem walkthrough

> **You are given an array prices where prices[i] is the price of a given stock on the ith day.**
>
> Bạn được cho mảng `prices`, trong đó `prices[i]` là giá cổ phiếu tại ngày thứ `i`.

Ví dụ:

```text
prices = [7, 1, 5, 3, 6, 4]
```

Có thể hình dung:

```text
Ngày:      1  2  3  4  5  6
Giá:       7  1  5  3  6  4
```

Trong Java, index vẫn là:

```text
index:     0  1  2  3  4  5
```

> **You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.**
>
> Bạn muốn tối đa hóa lợi nhuận bằng cách chọn **một ngày để mua** và một **ngày ở tương lai để bán**.

Điểm quan trọng là:

```text
buy day < sell day
```

Ta không được nhìn thấy giá thấp ở tương lai rồi giả sử đã mua ở đó để bán ở quá khứ.

> **Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.**
>
> Trả về lợi nhuận lớn nhất có thể đạt được. Nếu không thể có lợi nhuận dương thì trả về `0`.

Ví dụ mảng giảm liên tục:

```text
[7, 6, 4, 3, 1]
```

Không có ngày bán nào sau ngày mua mà giá cao hơn, nên:

```text
answer = 0
```

---

## 3. Requirement analysis

Ta chỉ được thực hiện **một transaction**:

```text
buy once
sell once
```

Không phải bài 122, nơi có thể mua bán nhiều lần.

Điều kiện hợp lệ:

```text
buy index < sell index
```

Mục tiêu:

```text
maximize prices[sell] - prices[buy]
```

với:

```text
buy < sell
```

Nếu viết trực tiếp theo định nghĩa, ta có thể thử mọi cặp `(buy, sell)`. Nhưng điều đó tạo ra rất nhiều phép so sánh không cần thiết.

---

## 4. Naive approach — thử mọi cặp ngày

Ta có thể làm:

```text
Buy day 0 → thử sell day 1, 2, 3, ...
Buy day 1 → thử sell day 2, 3, 4, ...
...
```

Java minh họa:

```java
int maxProfit = 0;

for (int buy = 0; buy < prices.length; buy++) {
    for (int sell = buy + 1; sell < prices.length; sell++) {
        maxProfit = Math.max(
            maxProfit,
            prices[sell] - prices[buy]
        );
    }
}
```

Độ phức tạp:

```text
Time:  O(n²)
Space: O(1)
```

Cách này đúng nhưng không tối ưu.

Vấn đề là khi đang xét một ngày bán, ta không thật sự cần nhớ **mọi ngày mua** trước đó. Ta chỉ cần ngày có **giá thấp nhất**.

---

## 5. Optimal approach — Running Minimum

Giả sử đang đứng tại một ngày có giá:

```text
price
```

Nếu phải bán vào hôm nay thì ngày mua tốt nhất chắc chắn là ngày trước đó có giá nhỏ nhất.

Do đó ta duy trì:

```java
int minPrice = Integer.MAX_VALUE;
int maxProfit = 0;
```

Với mỗi `price`:

### Bước 1 — cập nhật giá thấp nhất

```java
minPrice = Math.min(minPrice, price);
```

### Bước 2 — tính lợi nhuận nếu bán hôm nay

```java
price - minPrice
```

### Bước 3 — cập nhật lợi nhuận tốt nhất

```java
maxProfit = Math.max(maxProfit, price - minPrice);
```

Vì ta quét từ trái sang phải, `minPrice` chỉ đến từ ngày hiện tại hoặc quá khứ. Vì vậy không thể xảy ra chuyện mua sau khi bán.

---

## 6. Java solution

```java
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }

        return maxProfit;
    }
}
```

---

## 7. Code explanation

### `minPrice`

```java
int minPrice = Integer.MAX_VALUE;
```

Ban đầu chưa nhìn thấy giá nào, nên đặt `minPrice` thành một giá trị cực lớn. Giá đầu tiên chắc chắn sẽ nhỏ hơn nó.

Sau mỗi vòng lặp:

```text
minPrice = giá nhỏ nhất trong phần mảng đã duyệt
```

### `maxProfit`

```java
int maxProfit = 0;
```

Đáp án tối thiểu là `0`, bởi vì nếu mọi giao dịch đều lỗ thì ta không thực hiện giao dịch.

### Enhanced for loop

```java
for (int price : prices)
```

Ở bài này ta chỉ cần giá trị của từng ngày, không cần trực tiếp dùng index.

### Cập nhật minimum

```java
minPrice = Math.min(minPrice, price);
```

Sau dòng này, `minPrice` luôn là giá mua tốt nhất đã xuất hiện tính đến hôm nay.

### Kiểm tra bán hôm nay

```java
maxProfit = Math.max(maxProfit, price - minPrice);
```

Ta giả sử bán ở giá `price`, rồi so sánh transaction đó với transaction tốt nhất trước đây.

---

## 8. Dry run

Input:

```text
prices = [7, 1, 5, 3, 6, 4]
```

Ban đầu:

```text
minPrice  = ∞
maxProfit = 0
```

### Day 1 — price = 7

```text
minPrice  = min(∞, 7) = 7
profit    = 7 - 7 = 0
maxProfit = 0
```

### Day 2 — price = 1

```text
minPrice  = min(7, 1) = 1
profit    = 1 - 1 = 0
maxProfit = 0
```

Đây trở thành ngày mua tốt nhất hiện tại.

### Day 3 — price = 5

```text
minPrice  = 1
profit    = 5 - 1 = 4
maxProfit = 4
```

### Day 4 — price = 3

```text
minPrice  = 1
profit    = 3 - 1 = 2
maxProfit = 4
```

### Day 5 — price = 6

```text
minPrice  = 1
profit    = 6 - 1 = 5
maxProfit = 5
```

### Day 6 — price = 4

```text
minPrice  = 1
profit    = 4 - 1 = 3
maxProfit = 5
```

Kết quả:

```text
5
```

Tương ứng:

```text
Buy  = 1
Sell = 6
Profit = 6 - 1 = 5
```

---

## 9. Time and space complexity

### Time

Ta duyệt `prices` đúng một lần:

```text
O(n)
```

### Space

Chỉ dùng hai biến chính:

```text
minPrice
maxProfit
```

Do đó:

```text
O(1)
```

---

## 10. Why the algorithm is correct

Tại mỗi ngày `i`, `minPrice` là giá nhỏ nhất trong tất cả các ngày từ đầu mảng đến ngày `i`.

Nếu chọn ngày `i` làm ngày bán, không có ngày mua hợp lệ nào trước đó tốt hơn việc mua ở `minPrice`, vì mọi giá mua khác đều lớn hơn hoặc bằng `minPrice`.

Do đó:

```text
prices[i] - minPrice
```

là lợi nhuận lớn nhất của mọi transaction kết thúc ở ngày `i`.

`maxProfit` giữ giá trị lớn nhất của các lợi nhuận này sau khi xét từng ngày. Khi vòng lặp kết thúc, nó chính là lợi nhuận lớn nhất của mọi transaction hợp lệ trong toàn bộ mảng.

Nếu không transaction nào có lợi nhuận dương, `maxProfit` vẫn là `0`, đúng yêu cầu đề bài.

---

## 11. Edge cases

### Chỉ giảm

```text
[7, 6, 4, 3, 1]
```

Kết quả:

```text
0
```

### Chỉ tăng

```text
[1, 2, 3, 4, 5]
```

Mua ngày đầu, bán ngày cuối:

```text
4
```

### Giá giống nhau

```text
[5, 5, 5, 5]
```

Kết quả:

```text
0
```

### Giá nhỏ nhất nằm gần cuối

```text
[5, 4, 3, 1, 2]
```

Không được dùng `1` để bán cho giá `5` ở quá khứ. Thuật toán không mắc lỗi này vì quét theo thứ tự thời gian.

---

## 12. Common mistakes

### Mistake 1 — lấy `max(prices) - min(prices)`

Sai vì `max` có thể xuất hiện trước `min`.

Ví dụ:

```text
[10, 1]
```

Nếu tính:

```text
10 - 1 = 9
```

thì vô tình giả sử mua ngày 2 rồi bán ngày 1.

### Mistake 2 — dùng hai vòng lặp dù không cần

Brute force đúng nhưng là:

```text
O(n²)
```

Trong interview nên nhận ra invariant `minimum so far` để đưa về `O(n)`.

### Mistake 3 — nhầm với Best Time to Buy and Sell Stock II

Bài 121 chỉ có:

```text
1 buy + 1 sell
```

Không được cộng nhiều đoạn tăng giá.

### Mistake 4 — cho `maxProfit` bắt đầu bằng số âm

Đề yêu cầu trả `0` nếu không thể có lợi nhuận, nên khởi tạo:

```java
int maxProfit = 0;
```

là tự nhiên nhất.

---

## 13. How to explain it in an English interview

Một phiên bản ngắn, dễ nói:

> I scan the prices from left to right and keep track of the minimum price seen so far. For each day, I treat the current price as the selling price and compute the profit using that minimum buying price. Then I update the maximum profit. This guarantees that the buying day comes before the selling day because the minimum price only comes from the current or previous days. The algorithm runs in O(n) time and O(1) extra space.

Các ý quan trọng nên nói được:

```text
minimum price seen so far
current price as the selling price
maximum profit
scan from left to right
O(n) time
O(1) extra space
```

---

## 14. Vocabulary

| English | Nghĩa trong bài |
|---|---|
| stock | cổ phiếu |
| stock price | giá cổ phiếu |
| buy | mua |
| sell | bán |
| profit | lợi nhuận |
| transaction | giao dịch mua-bán |
| maximize | tối đa hóa |
| minimum price seen so far | giá thấp nhất đã thấy cho đến hiện tại |
| current price | giá hiện tại |
| future day | ngày ở tương lai |
| one pass | duyệt một lần |
| running minimum | giá trị nhỏ nhất được cập nhật trong lúc duyệt |
| time complexity | độ phức tạp thời gian |
| extra space | bộ nhớ phụ |

## Interview pattern to remember

Khi gặp dạng:

```text
maximize currentValue - bestPreviousValue
```

hãy nghĩ tới việc duy trì:

```text
best previous value seen so far
```

Trong bài này, `bestPreviousValue` chính là **minimum price seen so far**.
