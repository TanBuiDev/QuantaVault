# 121. Best Time to Buy and Sell Stock — Solution

## 1. Core idea / Intuition

Bài này nhìn giống bài toán chứng khoán, nhưng về mặt thuật toán nó là một bài **one-pass array** rất điển hình.

Khi đang đứng ở ngày hiện tại và giả sử hôm nay là **ngày bán**, ta chỉ cần biết:

> Giá mua thấp nhất đã xuất hiện trước hoặc tại thời điểm hiện tại là bao nhiêu?

Nếu giá hôm nay là `price` và giá thấp nhất đã thấy là `minPrice`, lợi nhuận nếu bán hôm nay là:

```text
profit = price - minPrice
```

Trong lúc quét mảng từ trái sang phải, ta duy trì:

```text
minPrice  = minimum price seen so far
maxProfit = best profit seen so far
```

Mỗi phần tử chỉ cần xử lý một lần.

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

Ta có một mảng `prices` theo thứ tự thời gian.

Cần chọn đúng theo thứ tự:

```text
buy day < sell day
```

và chỉ thực hiện tối đa **một giao dịch mua–bán**.

Mục tiêu:

```text
maximize prices[sell] - prices[buy]
```

Nếu không có giao dịch nào tạo lợi nhuận dương thì trả về `0`.

Đề song ngữ đầy đủ nằm trong [`problem.md`](problem.md), nên file solution không lặp lại toàn bộ statement.

---

## 3. Key observations / Nhận xét quan trọng

### Observation 1 — Thứ tự thời gian quan trọng

Không thể chỉ lấy:

```text
max(prices) - min(prices)
```

vì giá lớn nhất có thể xuất hiện **trước** giá nhỏ nhất.

Ví dụ:

```text
prices = [10, 1]
```

Ta không được mua ở giá `1` vào ngày 2 rồi quay ngược thời gian bán ở giá `10` vào ngày 1.

Kết quả đúng là:

```text
0
```

### Observation 2 — Khi xét ngày bán hiện tại, chỉ cần giá mua tốt nhất trong quá khứ

Giả sử đang ở vị trí `i`.

Nếu `prices[i]` là giá bán thì giá mua tốt nhất phải là:

```text
min(prices[0 ... i])
```

Do đó không cần nhớ toàn bộ quá khứ; chỉ cần một biến `minPrice`.

### Observation 3 — Ta chỉ cần best-so-far

Sau khi tính lợi nhuận khi bán ở ngày hiện tại, ta chỉ cần so sánh với lợi nhuận tốt nhất trước đó:

```text
maxProfit = max(maxProfit, currentProfit)
```

Hai biến `minPrice` và `maxProfit` là đủ để tóm tắt toàn bộ trạng thái cần thiết.

---

## 4. Alternative approaches / Các hướng khác

### Approach A — Brute force

Thử mọi cặp ngày:

```text
buy = i
sell = j, với j > i
```

và tính:

```text
prices[j] - prices[i]
```

Pseudo-code:

```text
maxProfit = 0
for i = 0 .. n-1
    for j = i+1 .. n-1
        maxProfit = max(maxProfit, prices[j] - prices[i])
```

Độ phức tạp:

```text
Time:  O(n²)
Space: O(1)
```

Cách này đúng nhưng không tận dụng thông tin rằng ta chỉ cần **giá thấp nhất trong quá khứ**.

### Approach B — DP array

Có thể tạo một mảng lưu giá nhỏ nhất tới từng vị trí hoặc lợi nhuận tốt nhất tới từng ngày.

Cách này vẫn có thể đạt:

```text
Time:  O(n)
Space: O(n)
```

nhưng mảng phụ là không cần thiết vì trạng thái của ngày hiện tại chỉ phụ thuộc vào hai giá trị best-so-far.

### Approach C — One pass với running minimum

Đây là hướng tối ưu:

```text
Time:  O(n)
Space: O(1)
```

---

## 5. Optimal approach / Hướng tối ưu

Khởi tạo:

```java
int minPrice = Integer.MAX_VALUE;
int maxProfit = 0;
```

Sau đó duyệt từng `price` từ trái sang phải.

Ở mỗi bước:

```java
minPrice = Math.min(minPrice, price);
maxProfit = Math.max(maxProfit, price - minPrice);
```

Ý nghĩa:

1. `minPrice` luôn là giá nhỏ nhất đã xuất hiện trong đoạn đã duyệt.
2. `price - minPrice` là lợi nhuận tốt nhất nếu **bán tại ngày hiện tại**.
3. `maxProfit` giữ lợi nhuận lớn nhất trong mọi ngày bán đã xét.

Vì `minPrice` chỉ được xây dựng từ ngày hiện tại hoặc các ngày trước đó, thuật toán không thể vô tình dùng một ngày mua nằm trong tương lai.

---

## 6. Java solution overview

Canonical implementation:

```java
class Solution {
    public int maxProfit(int[] prices) {
        // Giá mua thấp nhất ghi nhận được tính từ ngày đầu tiên cho đến ngày hiện tại (Running minimum).
        int minPrice = Integer.MAX_VALUE;

        // Lợi nhuận lớn nhất có thể thu được.
        int maxProfit = 0;

        for (int price : prices) {
            // Cập nhật giá mua thấp nhất nếu hôm nay giá rẻ hơn bất kỳ ngày nào trong quá khứ.
            minPrice = Math.min(minPrice, price);

            // Giả định nếu bán vào ngày hôm nay (với mức giá mua thấp nhất đã tìm thấy ở trên),
            // cập nhật lợi nhuận kỷ lục nếu mức lãi này cao hơn các ngày trước.
            maxProfit = Math.max(maxProfit, price - minPrice);
        }

        return maxProfit;
    }
}
```

Code trên phải luôn khớp về mặt thuật toán với [`Solution.java`](Solution.java).

---

## 7. Code explanation / Giải thích code

### `minPrice`

```java
int minPrice = Integer.MAX_VALUE;
```

Ta muốn biến này trở thành giá nhỏ nhất đã thấy.

Khởi tạo bằng giá trị rất lớn để giá đầu tiên chắc chắn thay thế nó.

Sau mỗi ngày:

```java
minPrice = Math.min(minPrice, price);
```

Invariant:

```text
sau khi xử lý ngày i,
minPrice = min(prices[0 ... i])
```

### `maxProfit`

```java
int maxProfit = 0;
```

Khởi tạo bằng `0` vì nếu không tồn tại giao dịch có lời, đáp án phải là `0`.

Ở mỗi ngày:

```java
price - minPrice
```

là lợi nhuận nếu bán ở ngày hiện tại với giá mua tốt nhất đã biết.

Sau đó:

```java
maxProfit = Math.max(maxProfit, price - minPrice);
```

Invariant:

```text
sau khi xử lý ngày i,
maxProfit = lợi nhuận tốt nhất của mọi giao dịch hợp lệ
            có ngày bán không vượt quá i
```

### Vì sao cập nhật `minPrice` trước vẫn đúng?

Ở ngày hiện tại, nếu chính `price` trở thành `minPrice` thì:

```text
price - minPrice = 0
```

Điều này tương đương chưa tạo lợi nhuận ở ngày đó.

Ta không tạo ra lợi nhuận giả và cũng không làm mất giao dịch tốt hơn từ các ngày trước.

---

## 8. Dry run

Với:

```text
prices = [7, 1, 5, 3, 6, 4]
```

Ban đầu:

```text
minPrice  = +∞
maxProfit = 0
```

| Day | price | minPrice sau cập nhật | price - minPrice | maxProfit |
|---:|---:|---:|---:|---:|
| 1 | 7 | 7 | 0 | 0 |
| 2 | 1 | 1 | 0 | 0 |
| 3 | 5 | 1 | 4 | 4 |
| 4 | 3 | 1 | 2 | 4 |
| 5 | 6 | 1 | 5 | 5 |
| 6 | 4 | 1 | 3 | 5 |

Kết quả:

```text
5
```

Giao dịch tương ứng:

```text
buy  at 1
sell at 6
profit = 5
```

---

## 9. Time and space complexity

### Time complexity

Ta duyệt mỗi phần tử đúng một lần:

```text
O(n)
```

### Space complexity

Chỉ dùng một số biến scalar, không dùng mảng phụ phụ thuộc vào `n`:

```text
O(1)
```

Đây là **constant extra space**.

---

## 10. Why the algorithm is correct / Vì sao thuật toán đúng

Ta có thể chứng minh bằng hai invariant.

### Invariant 1

Sau khi xử lý `prices[i]`:

```text
minPrice = giá nhỏ nhất trong prices[0 ... i]
```

Điều này đúng vì ở mỗi bước ta gán:

```text
min(oldMinPrice, prices[i])
```

### Invariant 2

Sau khi xử lý `prices[i]`:

```text
maxProfit = lợi nhuận lớn nhất của mọi giao dịch hợp lệ
            có ngày bán trong đoạn [0 ... i]
```

Tại ngày `i`, giao dịch tốt nhất kết thúc ở ngày này phải mua ở giá thấp nhất trong quá khứ, chính là `minPrice`.

Do đó lợi nhuận tốt nhất kết thúc tại `i` là:

```text
prices[i] - minPrice
```

Ta so sánh giá trị đó với `maxProfit` cũ, nên sau bước này `maxProfit` bao phủ cả:

- mọi giao dịch tốt nhất trước ngày `i`;
- giao dịch tốt nhất có ngày bán là `i`.

Khi vòng lặp kết thúc, mọi ngày đã từng được xét làm ngày bán, nên `maxProfit` là đáp án toàn cục.

---

## 11. Edge cases / Trường hợp biên

### Chỉ có một ngày

```text
[5]
```

Không thể mua rồi bán ở một ngày tương lai.

Kết quả:

```text
0
```

### Giá giảm liên tục

```text
[7, 6, 4, 3, 1]
```

Mọi giao dịch đều không có lợi nhuận dương.

Kết quả:

```text
0
```

### Giá tăng liên tục

```text
[1, 2, 3, 4, 5]
```

Tốt nhất là mua ở `1`, bán ở `5`.

Kết quả:

```text
4
```

### Giá nhỏ nhất nằm gần cuối

```text
[5, 4, 3, 1, 2]
```

Không được dùng giá `1` để bán cho `5` ở quá khứ.

Thuật toán chỉ có thể dùng `1` cho các ngày hiện tại hoặc tương lai, nên kết quả đúng là:

```text
1
```

### Nhiều giá bằng nhau

```text
[3, 3, 3, 3]
```

Không có lợi nhuận dương:

```text
0
```

---

## 12. Common mistakes / Lỗi thường gặp

### Mistake 1 — `max(prices) - min(prices)`

Sai vì không đảm bảo ngày mua đứng trước ngày bán.

### Mistake 2 — Dùng hai vòng lặp dù không cần

Brute force đúng nhưng tốn:

```text
O(n²)
```

Dấu hiệu để tối ưu là bài chỉ cần **best previous value** cho mỗi vị trí hiện tại.

### Mistake 3 — Nhầm với bài 122

Bài 121 cho phép tối đa:

```text
1 buy + 1 sell
```

Không được cộng lợi nhuận của nhiều đoạn tăng giá.

### Mistake 4 — Khởi tạo `maxProfit` bằng số âm

Đề yêu cầu trả `0` khi không có lợi nhuận, nên:

```java
int maxProfit = 0;
```

là phù hợp nhất.

### Mistake 5 — Theo dõi quá nhiều trạng thái

Không cần mảng prefix minimum hay DP array nếu chỉ cần đáp án cuối cùng.

Hai biến là đủ:

```text
minPrice
maxProfit
```

---

## 13. Pattern recognition / Khi nào tái sử dụng tư duy này

Pattern tổng quát của bài là:

```text
maximize currentValue - bestPreviousValue
```

Trong đó `bestPreviousValue` có thể cập nhật online khi quét dữ liệu.

Ở bài này:

```text
currentValue      = current stock price
bestPreviousValue = minimum price seen so far
```

Khi gặp bài có cấu trúc:

- dữ liệu có thứ tự thời gian;
- quyết định hiện tại phụ thuộc vào một giá trị tốt nhất trong quá khứ;
- chỉ cần best-so-far chứ không cần toàn bộ lịch sử;

hãy nghĩ tới **running minimum / running maximum + one pass**.

---

## 14. Vocabulary and algorithmic terminology

| English | Nghĩa trong bài |
|---|---|
| stock | cổ phiếu |
| stock price | giá cổ phiếu |
| buy | mua |
| sell | bán |
| profit | lợi nhuận |
| transaction | giao dịch mua–bán |
| maximize | tối đa hóa |
| minimum price seen so far | giá nhỏ nhất đã thấy cho đến hiện tại |
| best profit so far | lợi nhuận tốt nhất đã tìm được cho đến hiện tại |
| current price | giá hiện tại |
| selling price | giá bán |
| one pass | duyệt một lần |
| running minimum | giá trị nhỏ nhất được duy trì trong lúc duyệt |
| invariant | bất biến |
| brute force | vét cạn |
| time complexity | độ phức tạp thời gian |
| space complexity | độ phức tạp bộ nhớ |
| constant extra space | bộ nhớ phụ hằng số |

Phần luyện nói và câu hỏi interview được tách riêng trong [`interview.md`](interview.md) để solution tập trung hoàn toàn vào tư duy thuật toán.
