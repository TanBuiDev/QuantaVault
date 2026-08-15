# 123. Best Time to Buy and Sell Stock III — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I compress the DP into four states: first buy, first sell, second buy, and second sell. For each price I update the best balance for each state in that order. The dependency from `sell1` to `buy2` guarantees that the first transaction is finished before the second starts. The algorithm is O(n) time and O(1) extra space.

**VI:** Tôi nén DP thành bốn state mua/bán của hai giao dịch; update một lần trên mảng nên O(n) time và O(1) space.

## 2. Core approach questions

**Q (EN):** What do the four states represent?

**Q (VI):** Bốn state biểu diễn gì?

### Short answer (EN)

They are the best balances after first buy, first sell, second buy, and second sell.

### Trả lời ngắn (VI)

Chúng là best balance sau mua 1, bán 1, mua 2 và bán 2.

### Standard answer (EN)

Each state summarizes all valid histories that have reached that exact stage. I only keep the maximum balance for each stage because a smaller balance can never lead to a better future result.

### Trả lời chuẩn (VI)

Mỗi state tóm tắt mọi lịch sử hợp lệ đã tới đúng giai đoạn đó; chỉ cần giữ balance lớn nhất vì balance nhỏ hơn không thể cho tương lai tốt hơn.

## 3. Why / correctness questions

**Q (EN):** How do you prevent overlapping transactions?

**Q (VI):** Làm sao ngăn hai giao dịch chồng lấn?

### Short answer (EN)

The second buy can only come from the first sell state.

### Trả lời ngắn (VI)

Lần mua thứ hai chỉ được tạo từ state đã bán xong lần thứ nhất.

### Standard answer (EN)

`buy2` is updated with `sell1 - price`, so every candidate second purchase starts from a history where the first position has already been closed. Therefore the algorithm never holds two positions simultaneously.

### Trả lời chuẩn (VI)

`buy2` dùng `sell1 - price`, nên mọi lần mua thứ hai đều bắt đầu sau khi vị thế đầu đã đóng.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(n) time and O(1) extra space.

### Trả lời ngắn (VI)

O(n) time và O(1) space.

### Standard answer (EN)

I scan every price once and update four scalar states, so both the work per day and the memory usage are constant.

### Trả lời chuẩn (VI)

Mỗi ngày chỉ update bốn biến scalar nên tổng time O(n), extra space O(1).

## 5. Edge-case questions

**Q (EN):** What happens when all prices decrease?

**Q (VI):** Nếu mọi giá đều giảm thì sao?

### Short answer (EN)

Both sell states remain zero.

### Trả lời ngắn (VI)

Hai sell state đều giữ `0`.

### Standard answer (EN)

No sale improves the zero-profit option, so the algorithm naturally returns zero without needing a special case.

### Trả lời chuẩn (VI)

Không lần bán nào tốt hơn lựa chọn lợi nhuận `0`, nên thuật toán tự trả `0`.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Could you solve it with a general k-transaction DP?

**Q (VI):** Có thể dùng DP tổng quát cho `k` giao dịch không?

### Short answer (EN)

Yes, but with `k = 2` the four-state version is simpler and uses constant space.

### Trả lời ngắn (VI)

Có, nhưng vì `k = 2` cố định nên bốn state đơn giản hơn và dùng constant space.

### Standard answer (EN)

A general solution keeps `buy[t]` and `sell[t]` for every transaction count. Here there are only two layers, so expanding them into four scalars removes arrays without changing the recurrence.

### Trả lời chuẩn (VI)

DP tổng quát có `buy[t]` và `sell[t]`; với đúng hai lớp ta mở chúng thành bốn scalar.

## 7. Code walkthrough questions

**Q (EN):** Why is `buy1` initialized to a negative sentinel?

**Q (VI):** Vì sao `buy1` khởi tạo bằng sentinel âm?

### Short answer (EN)

Because holding a stock is invalid before we buy one.

### Trả lời ngắn (VI)

Vì state đang giữ chưa hợp lệ trước lần mua đầu tiên.

### Standard answer (EN)

If a buy state started at zero, the DP could act as if a stock was obtained for free and create fake profit. A negative sentinel prevents that.

### Trả lời chuẩn (VI)

Nếu buy state bắt đầu `0`, DP có thể coi như được cổ phiếu miễn phí và tạo profit giả; sentinel âm ngăn điều đó.

## 8. Follow-up variations

**Q (EN):** How would this change for at most k transactions?

**Q (VI):** Nếu đổi thành tối đa `k` giao dịch thì sao?

### Short answer (EN)

Use arrays `buy[1..k]` and `sell[1..k]`.

### Trả lời ngắn (VI)

Dùng các mảng `buy[1..k]` và `sell[1..k]`.

### Standard answer (EN)

The same recurrence generalizes directly: `buy[t]` comes from `sell[t-1] - price`, and `sell[t]` comes from `buy[t] + price`, giving O(nk) time and O(k) space.

### Trả lời chuẩn (VI)

Recurrence giữ nguyên theo `t`, cho O(nk) time và O(k) space.

## 9. Common interviewer traps

- Overlapping the two transactions.
- Returning side states before selling.
- Treating two transactions as mandatory instead of optional.
- Using four states without explaining their invariant.

## 10. Useful phrases and vocabulary

```text
four-state dynamic programming
first buy / first sell
second buy / second sell
close the first position
best balance so far
constant extra space
```
