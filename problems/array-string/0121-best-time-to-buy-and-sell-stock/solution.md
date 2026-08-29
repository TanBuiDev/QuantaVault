# 121. Best Time to Buy and Sell Stock — Solution

## 1. Tự giải một ví dụ nhỏ trước

Giả sử giá theo từng ngày là:

```text
[7, 1, 5, 3, 6, 4]
```

Ta chỉ được mua một lần rồi bán một lần, và ngày mua phải đứng trước ngày bán.

Nếu đang đứng ở ngày có giá `6` và muốn biết **bán hôm nay có lời nhất bao nhiêu**, ta không cần nhớ mọi giá trước đó. Ta chỉ cần biết giá mua rẻ nhất đã xuất hiện trước hoặc tại hôm nay là `1`:

```text
profit nếu bán ở 6 = 6 - 1 = 5
```

Đó là câu hỏi cốt lõi của cả bài:

> Khi coi ngày hiện tại là ngày bán, thông tin nhỏ nhất nào từ quá khứ đủ để tính giao dịch tốt nhất kết thúc hôm nay?

Câu trả lời là **giá nhỏ nhất đã thấy**.

---

## 2. Từ cách tự nhiên đến ý tưởng tối ưu

### Cách tự nhiên: thử mọi cặp mua–bán

Ta có thể chọn mọi `buyDay`, rồi thử mọi `sellDay > buyDay`.

```text
for mỗi buyDay
    for mỗi sellDay sau buyDay
        profit = prices[sellDay] - prices[buyDay]
```

Cách này đúng nhưng phải xét gần `n²` cặp ngày:

```text
Time: O(n²)
```

### Phần việc bị lặp lại

Khi xét ngày bán `i`, brute force lại đi tìm giá nhỏ nhất trong toàn bộ đoạn trước đó.

Nhưng khi quét từ trái sang phải, ta có thể mang giá nhỏ nhất này sang ngày kế tiếp.

Ví dụ:

```text
đã thấy: [7, 1, 5, 3]
minPrice = 1

ngày tiếp theo price = 6
```

Ta không cần quét lại `[7, 1, 5, 3]`; `minPrice = 1` đã tóm tắt chính xác phần quá khứ cần dùng.

Đây là **running state**: nén cả lịch sử thành một giá trị đủ cho quyết định hiện tại.

---

## 3. Hai state cần nhớ

Trong một lần quét:

- `minPrice` = giá mua thấp nhất đã xuất hiện trong các ngày đã xử lý.
- `maxProfit` = lợi nhuận tốt nhất của mọi giao dịch hợp lệ đã xét.

Ở mỗi `price`:

```text
1. cập nhật minPrice
2. thử bán hôm nay: price - minPrice
3. cập nhật maxProfit
```

### Vì sao thứ tự này không tạo giao dịch sai?

Code cập nhật `minPrice` bằng giá hôm nay trước khi tính profit. Nếu hôm nay chính là giá thấp nhất mới, ta có:

```text
price - minPrice = 0
```

Nó chỉ tương đương “mua và chưa có lợi nhuận”, không tạo lợi nhuận giả. Những giao dịch tốt hơn từ trước vẫn được giữ trong `maxProfit`.

### Java note

`Integer.MAX_VALUE` là một giá trị `int` rất lớn. Khởi tạo `minPrice` như vậy giúp giá đầu tiên chắc chắn trở thành minimum thật đầu tiên.

Enhanced for:

```java
for (int price : prices)
```

cho `price` là **giá trị hiện tại**, không phải index.

---

## 4. Optimal Java solution

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

Block trên được giữ exact-sync với [`Solution.java`](Solution.java).

---

## 5. Dry run theo đúng state trong code

Với:

```text
prices = [7, 1, 5, 3, 6, 4]
```

| `price` | `minPrice` sau update | `price - minPrice` | `maxProfit` |
|---:|---:|---:|---:|
| 7 | 7 | 0 | 0 |
| 1 | 1 | 0 | 0 |
| 5 | 1 | 4 | 4 |
| 3 | 1 | 2 | 4 |
| 6 | 1 | 5 | 5 |
| 4 | 1 | 3 | 5 |

Khi gặp `6`, state `minPrice = 1` nói rằng ngày mua tốt nhất trong quá khứ là ngày giá `1`; vì vậy giao dịch kết thúc ở `6` lời `5`.

---

## 6. Vì sao thuật toán đúng?

Sau khi xử lý mỗi ngày có hai điều luôn đúng:

1. `minPrice` là giá nhỏ nhất trong toàn bộ prefix đã duyệt.
2. `maxProfit` là lợi nhuận tốt nhất của mọi giao dịch có ngày bán nằm trong prefix đó.

Khi tới một ngày mới, mọi giao dịch hợp lệ kết thúc hôm nay đều phải mua ở một ngày đã đi qua. Trong số đó, mua tại `minPrice` cho lợi nhuận lớn nhất khi bán hôm nay. Ta so sánh giao dịch mới này với `maxProfit` cũ, nên không bỏ mất giao dịch tốt nào.

Khi vòng lặp kết thúc, mọi ngày đã được thử làm ngày bán, do đó `maxProfit` là đáp án toàn cục.

---

## 7. Complexity

```text
Time:  O(n)  — mỗi giá được xử lý một lần
Space: O(1)  — chỉ giữ hai state scalar
```

---

## 8. Edge cases và lỗi thường gặp

- `[7,6,4,3,1]` → `0`: không có giao dịch lời; `maxProfit` khởi tạo `0` nên không trả số âm.
- `[5]` → `0`: không có ngày tương lai để bán.
- Không được dùng `max(prices) - min(prices)` độc lập vì maximum có thể xuất hiện **trước** minimum, ví dụ `[10,1]`.
- Không cộng tất cả đoạn tăng giá; đó là bài 122 với nhiều giao dịch, không phải bài này.
- Không cần mảng DP vì toàn bộ thông tin quá khứ cần thiết đã nén vào `minPrice` và `maxProfit`.

---

## 9. Cách nhận ra pattern ở bài khác

Hãy nghĩ tới **running state / best-so-far** khi:

- đang quét dữ liệu theo thứ tự;
- quyết định ở vị trí hiện tại chỉ cần một statistic nhỏ từ quá khứ như `min`, `max`, `count`, `prefix`;
- brute force lặp lại việc tìm cùng statistic đó cho nhiều vị trí.

Câu hỏi hữu ích là:

> “Ở vị trí hiện tại, mình thật sự cần nhớ toàn bộ lịch sử hay chỉ cần một giá trị tốt nhất từ lịch sử?”
