# 188. Best Time to Buy and Sell Stock IV — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I model each transaction with a buy state and a sell state. For transaction `t`, `buy[t]` is the best balance after buying and `sell[t]` is the best profit after selling. For every price I update `buy[t]` from `sell[t-1] - price`, then update `sell[t]` from `buy[t] + price`. This gives O(nk) time and O(k) extra space.

**VI:** Tôi mô hình mỗi giao dịch bằng state mua và bán; update best balance theo từng giá nên đạt O(nk) time và O(k) space.

## 2. Core approach questions

**Q (EN):** What does `buy[t]` represent?

**Q (VI):** `buy[t]` biểu diễn gì?

### Short answer (EN)

It is the best balance after buying the stock for transaction `t`.

### Trả lời ngắn (VI)

Đó là số dư tốt nhất sau khi mua cho giao dịch thứ `t`.

### Standard answer (EN)

It represents the maximum cash balance among all valid histories that have completed at most `t-1` sells and are currently holding the stock for transaction `t`.

### Trả lời chuẩn (VI)

Nó là số dư lớn nhất trong mọi lịch sử hợp lệ đã hoàn thành tối đa `t-1` lần bán và đang giữ cổ phiếu cho giao dịch thứ `t`.

## 3. Why / correctness questions

**Q (EN):** Why does buying use `sell[t - 1]`?

**Q (VI):** Vì sao bước mua dùng `sell[t - 1]`?

### Short answer (EN)

Because the previous transaction must be sold before a new one can start.

### Trả lời ngắn (VI)

Vì giao dịch trước phải bán xong trước khi bắt đầu giao dịch mới.

### Standard answer (EN)

A valid transaction sequence cannot hold two positions at once. `sell[t-1]` is exactly the best state where the previous transaction is finished and no stock is held, so subtracting the current price creates a valid `buy[t]` state.

### Trả lời chuẩn (VI)

`Sell[t-1]` là state tốt nhất đã hoàn tất giao dịch trước và không giữ cổ phiếu, nên trừ giá hiện tại tạo ra state mua hợp lệ.

## 4. Complexity questions

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(nk) time and O(k) extra space.

### Trả lời ngắn (VI)

O(nk) time và O(k) bộ nhớ phụ.

### Standard answer (EN)

For each of `n` prices I update `k` transaction layers, and I store only two arrays of length `k + 1`.

### Trả lời chuẩn (VI)

Mỗi trong `n` ngày update `k` lớp giao dịch và chỉ lưu hai mảng dài `k + 1`.

## 5. Edge-case questions

**Q (EN):** What happens when prices only decrease?

**Q (VI):** Nếu giá chỉ giảm thì sao?

### Short answer (EN)

All sell states stay at zero, so the answer is zero.

### Trả lời ngắn (VI)

Mọi sell state giữ `0`, nên đáp án bằng `0`.

### Standard answer (EN)

Buying may create negative balances, but no later sell improves the initial zero profit. Since doing no transaction is allowed, every `sell[t]` remains at least zero.

### Trả lời chuẩn (VI)

Buy state có thể âm nhưng không lần bán nào cải thiện lợi nhuận `0`; vì được phép không giao dịch nên sell state không âm.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not use a full day-by-transaction DP table?

**Q (VI):** Vì sao không dùng bảng DP đầy đủ theo ngày và giao dịch?

### Short answer (EN)

It is correct but uses O(nk) space that is unnecessary.

### Trả lời ngắn (VI)

Cách đó đúng nhưng tốn O(nk) space không cần thiết.

### Standard answer (EN)

The transition only needs best states from the processed prefix, so keeping one best value per transaction state is enough and reduces space to O(k).

### Trả lời chuẩn (VI)

Transition chỉ cần best state của prefix đã xử lý nên một giá trị cho mỗi transaction state là đủ.

## 7. Code walkthrough questions

**Q (EN):** Why initialize `buy` with a very negative value?

**Q (VI):** Vì sao khởi tạo `buy` bằng số âm rất nhỏ?

### Short answer (EN)

To mark holding states as invalid before any purchase happens.

### Trả lời ngắn (VI)

Để đánh dấu holding state chưa hợp lệ trước khi có lần mua nào.

### Standard answer (EN)

Starting `buy[t]` at zero would pretend we already own a stock for free. A negative sentinel prevents invalid states from creating fake profit.

### Trả lời chuẩn (VI)

Nếu khởi tạo bằng `0` thì giống như có cổ phiếu miễn phí; sentinel âm ngăn lợi nhuận giả.

## 8. Follow-up variations

**Q (EN):** What optimization is possible when `k` is very large?

**Q (VI):** Có tối ưu gì khi `k` rất lớn?

### Short answer (EN)

When `k >= n / 2`, the problem becomes unlimited transactions.

### Trả lời ngắn (VI)

Khi `k >= n/2`, bài toán tương đương không giới hạn giao dịch.

### Standard answer (EN)

At most `floor(n/2)` profitable non-overlapping transactions can be completed, so a larger `k` is not binding. Then we can sum every positive adjacent increase in O(n) time.

### Trả lời chuẩn (VI)

Tối đa chỉ có `floor(n/2)` giao dịch không chồng lấn, nên `k` lớn hơn không còn ràng buộc và có thể cộng mọi tăng giá dương liên tiếp.

## 9. Common interviewer traps

- Confusing buys/sells with completed transactions.
- Allowing simultaneous positions.
- Using invalid zero-initialized buy states.
- Returning a holding state instead of a sell state.

## 10. Useful phrases and vocabulary

```text
transaction layer
holding state
best balance after buying
best profit after selling
state compression
at most k transactions
O(nk) time
O(k) extra space
```
