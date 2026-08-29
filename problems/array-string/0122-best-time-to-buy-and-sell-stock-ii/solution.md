# 122. Best Time to Buy and Sell Stock II — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Vì được giao dịch nhiều lần nhưng không giữ hai cổ phiếu cùng lúc, mọi đoạn tăng giá có thể được thu profit; [1,5,3,6] cho (5-1)+(6-3)=7.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DP holding/cash đúng nhưng dài hơn cần thiết. Quan sát một đợt tăng từ a lên d có d-a bằng tổng mọi chênh lệch dương từng ngày, nên chỉ cần cộng price[i]-price[i-1] khi dương.

**State / invariant / data structure cần hiểu trước code.** profit là tổng các positive deltas đã thấy. Invariant: sau ngày i, profit là lợi nhuận tối đa trên prefix vì mọi xu hướng tăng đã được chia thành các giao dịch ngày-kề-ngày tương đương.

**Dry run mental theo implementation.** Dry run [7,1,5,3,6,4]: deltas -6,+4,-2,+3,-2; chỉ cộng 4 và 3 được 7, tương đương mua 1 bán 5 rồi mua 3 bán 6.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là áp dụng logic một giao dịch của bài 121 hoặc cộng delta âm. Khi nào dùng: nếu được reset hành động không giới hạn và profit cộng được theo các bước cục bộ, thử decomposition thành positive increments.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Vì được thực hiện nhiều giao dịch, ta có thể thu **mọi đoạn tăng giá dương**.

Nếu:

```text
prices[i] > prices[i - 1]
```

thì phần tăng:

```text
prices[i] - prices[i - 1]
```

luôn có thể được biến thành lợi nhuận hợp lệ bằng cách coi như mua ở ngày `i-1` và bán ở ngày `i`.

Canonical greedy:

```text
profit = sum(max(0, prices[i] - prices[i-1]))
```

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

- Có thể mua và bán nhiều lần.
- Tại một thời điểm chỉ giữ tối đa một cổ phiếu.
- Có thể bán rồi mua lại cùng ngày.
- Mục tiêu là tối đa hóa tổng lợi nhuận.

---

## 3. Key observation — Tách một đoạn tăng thành các bước tăng nhỏ

Ví dụ:

```text
[1,2,3,4,5]
```

Mua ở `1`, bán ở `5` cho:

```text
5 - 1 = 4
```

Nhưng cộng từng bước:

```text
(2-1) + (3-2) + (4-3) + (5-4) = 4
```

Kết quả giống hệt.

Điều này rất quan trọng: ta không cần xác định valley/peak một cách tường minh. Chỉ cần thu mọi positive delta.

---

## 4. Why negative deltas should be ignored

Nếu giá giảm:

```text
5 -> 3
```

giữ cổ phiếu qua đoạn giảm chỉ làm giảm lợi nhuận. Vì được phép kết thúc giao dịch trước đoạn giảm và mua lại sau đó, không có lý do tối ưu nào bắt buộc ta phải nhận chênh lệch âm.

Do đó chỉ cộng khi:

```java
prices[i] > prices[i - 1]
```

---

## 5. Alternative approaches / Các hướng khác

### Approach A — Dynamic Programming state machine

Có thể dùng hai trạng thái:

```text
cash = lợi nhuận tốt nhất khi không giữ cổ phiếu
hold = lợi nhuận tốt nhất khi đang giữ cổ phiếu
```

Transition mỗi ngày vẫn đạt `O(n)` time và `O(1)` space. Đây là hướng tổng quát hơn, đặc biệt hữu ích khi bài có cooldown, transaction fee hoặc giới hạn số giao dịch.

### Approach B — Valley and peak

Tìm một local valley, mua; đi đến local peak, bán; lặp lại.

Cũng đạt `O(n)`, nhưng code dài hơn việc cộng positive deltas.

### Approach C — Greedy positive deltas

Ngắn nhất và tự nhiên nhất cho đúng constraints của bài này.

---

## 6. Optimal Java solution

```java
class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;

        for (int i = 1; i < prices.length; i++) {
            // Với unlimited transactions, mọi positive delta có thể thu độc lập.
            // Trên một đoạn tăng, tổng các delta này telescope thành đúng peak - valley.
            if (prices[i] > prices[i - 1]) {
                profit += prices[i] - prices[i - 1];
            }
        }

        return profit;
    }
}
```

---

## 7. Dry run

```text
prices = [7,1,5,3,6,4]
```

| i | previous | current | delta | profit |
|---|---:|---:|---:|---:|
| 1 | 7 | 1 | -6 | 0 |
| 2 | 1 | 5 | +4 | 4 |
| 3 | 5 | 3 | -2 | 4 |
| 4 | 3 | 6 | +3 | 7 |
| 5 | 6 | 4 | -2 | 7 |

Kết quả: `7`.

---

## 8. Correctness / Vì sao đúng

Chia chuỗi giá thành các maximal increasing runs.

Với một run:

```text
p[a] <= p[a+1] <= ... <= p[b]
```

lợi nhuận tốt nhất từ run đó là:

```text
p[b] - p[a]
```

Do tính chất telescope:

```text
p[b] - p[a]
= (p[a+1]-p[a]) + ... + (p[b]-p[b-1])
```

Đó chính là tổng mọi positive delta trong run. Các đoạn giảm không thể đóng góp lợi nhuận dương và ta có thể đứng ngoài thị trường ở những đoạn đó. Vì vậy tổng mọi positive delta là lợi nhuận tối đa toàn cục.

---

## 9. Complexity

```text
Time:  O(n)
Space: O(1)
```

---

## 10. Edge cases

- Một ngày: `0`.
- Giá giảm liên tục: `0`.
- Giá tăng liên tục: bằng `last - first`.
- Giá bằng nhau: delta bằng `0`, không ảnh hưởng.
- Nhiều valley/peak: greedy tự cộng tất cả các đoạn tăng.

---

## 11. Common mistakes

1. Dùng logic của bài 121 và chỉ cho phép một giao dịch.
2. Cộng cả chênh lệch âm.
3. Nghĩ rằng mua/bán từng ngày tạo nhiều giao dịch không hợp lệ; thực ra việc bán rồi mua lại cùng ngày được đề cho phép.
4. Dùng DP phức tạp hơn mức cần thiết mà không giải thích trade-off.

---

## 12. Pattern recognition

Bài này là mẫu cơ bản cho greedy trên **local gains**. Khi mọi positive local gain đều có thể được thu độc lập mà không phá constraint toàn cục, tổng các local gains có thể chính là optimum.
