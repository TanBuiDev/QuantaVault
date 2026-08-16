# 122. Best Time to Buy and Sell Stock II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** Because multiple transactions are allowed, I take every positive price increase between consecutive days. For any increasing run, the sum of the daily increases equals the profit from buying at the run's start and selling at its end. Negative differences are skipped because I can sell before a drop and buy again later. Therefore summing all positive deltas gives the global optimum in `O(n)` time and `O(1)` extra space.

**VI:** Vì được phép nhiều giao dịch, em lấy mọi mức tăng dương giữa hai ngày liên tiếp. Trên một đoạn tăng, tổng các mức tăng từng ngày bằng đúng lợi nhuận mua ở đầu đoạn và bán ở cuối đoạn. Chênh lệch âm được bỏ qua vì có thể bán trước khi giá giảm rồi mua lại sau. Vì vậy tổng mọi positive delta là tối ưu toàn cục với `O(n)` time và `O(1)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is it valid to sum every positive consecutive difference?

**Q (VI):** Vì sao cộng mọi chênh lệch dương giữa hai ngày liên tiếp là đúng?

### Short answer (EN)

On every increasing run, the positive daily differences telescope to exactly the valley-to-peak profit.

### Trả lời ngắn (VI)

Trên mỗi đoạn tăng, tổng các chênh lệch dương từng ngày telescope thành đúng lợi nhuận từ đáy đến đỉnh.

### Standard answer (EN)

Suppose prices rise from `a` to `b` through intermediate values. The sum of each consecutive increase is `p[b] - p[a]`, so splitting one long transaction into daily profitable transactions does not change profit. Since we are allowed unlimited transactions and can sell and buy on the same day, collecting all positive deltas is feasible.

### Trả lời chuẩn (VI)

Giả sử giá tăng từ ngày `a` đến `b`. Tổng các mức tăng liên tiếp bằng `p[b] - p[a]`, nên tách một giao dịch dài thành các giao dịch nhỏ không đổi lợi nhuận. Vì đề cho phép nhiều giao dịch và có thể bán rồi mua cùng ngày, việc thu mọi positive delta là hợp lệ.

### Deep answer (EN)

Any strategy can be decomposed into holding intervals. Within an interval, including a negative edge can never help when transaction count is unlimited: we can close before that edge and reopen after it without reducing profit. Therefore an optimal strategy contains exactly the positive edges, and summing them is an exchange-argument characterization of the optimum.

### Trả lời sâu (VI)

Mọi chiến lược có thể phân rã thành các khoảng đang giữ cổ phiếu. Khi số giao dịch không giới hạn, giữ qua một cạnh giảm không bao giờ có lợi: ta có thể đóng vị thế trước cạnh giảm và mở lại sau đó mà không giảm lợi nhuận. Vì vậy chiến lược tối ưu chỉ cần giữ các cạnh tăng dương; tổng chúng chính là optimum.

---

### Q2

**Q (EN):** How is this different from problem 121?

**Q (VI):** Bài này khác bài 121 như thế nào?

### Short answer (EN)

Problem 121 allows only one transaction; this problem allows unlimited transactions.

### Trả lời ngắn (VI)

Bài 121 chỉ cho một giao dịch; bài này cho nhiều giao dịch.

### Standard answer (EN)

In problem 121 I must choose one buy and one later sell, so I track the minimum price and best single profit. Here I can realize profit on every separate rising segment, so local positive differences can all be accumulated.

### Trả lời chuẩn (VI)

Ở bài 121 em phải chọn đúng một lần mua và một lần bán sau đó, nên theo dõi minimum price và best single profit. Ở đây em có thể thu lợi nhuận trên mọi đoạn tăng riêng biệt, nên cộng tất cả positive differences.

---

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

I scan adjacent pairs once and maintain only one accumulator for total profit.

### Trả lời chuẩn (VI)

Em duyệt các cặp ngày kề nhau một lần và chỉ giữ một biến tích lũy lợi nhuận.

---

### Q4

**Q (EN):** Why don't you need to explicitly identify valleys and peaks?

**Q (VI):** Vì sao không cần tìm valley và peak một cách tường minh?

### Short answer (EN)

Summing the positive edges of an increasing run automatically gives the same valley-to-peak profit.

### Trả lời ngắn (VI)

Cộng các cạnh tăng dương trong một đoạn tăng tự động cho cùng lợi nhuận valley-to-peak.

---

### Q5

**Q (EN):** Could dynamic programming solve this?

**Q (VI):** Có thể dùng dynamic programming không?

### Short answer (EN)

Yes. Track the best profit while holding and not holding a stock, but greedy is simpler for this exact version.

### Trả lời ngắn (VI)

Có. Có thể theo dõi trạng thái đang giữ và không giữ cổ phiếu, nhưng greedy đơn giản hơn cho phiên bản này.

### Standard answer (EN)

A two-state DP with `hold` and `cash` also runs in `O(n)` time and `O(1)` space. I would prefer that formulation when the problem adds fees, cooldowns, or transaction limits; without those constraints, the greedy positive-delta rule is the simplest characterization.

### Trả lời chuẩn (VI)

DP hai trạng thái `hold` và `cash` cũng chạy `O(n)`/`O(1)`. Em ưu tiên cách đó khi có fee, cooldown hoặc giới hạn số giao dịch; còn phiên bản hiện tại thì greedy positive-delta đơn giản nhất.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** What changes if each transaction has a fee?

**Q (VI):** Nếu mỗi giao dịch có phí thì sao?

**EN:** Then taking every small positive edge can overpay fees. I would use a DP/state-machine approach or an equivalent greedy formulation that incorporates the fee.

**VI:** Khi đó lấy mọi cạnh tăng nhỏ có thể trả phí quá nhiều lần. Em sẽ dùng DP/state machine hoặc greedy tương đương có tính transaction fee.

### Follow-up 2

**Q (EN):** What if only `k` transactions are allowed?

**Q (VI):** Nếu chỉ được tối đa `k` giao dịch thì sao?

**EN:** The independent-positive-edge property no longer directly solves the problem. I would use DP indexed by day, transaction count, and holding state, then optimize the memory if needed.

**VI:** Khi đó không thể đơn giản thu mọi positive edge. Em sẽ dùng DP theo ngày, số giao dịch và trạng thái giữ cổ phiếu, sau đó tối ưu bộ nhớ nếu cần.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your implementation?

**Q (VI):** Bạn có thể giải thích implementation không?

**EN:** I initialize `profit` to zero and scan from day one. Whenever today's price is higher than yesterday's, I add that positive difference. I ignore flat or negative differences. At the end, the accumulator equals the sum of all profitable upward edges.

**VI:** Em khởi tạo `profit = 0` và duyệt từ ngày thứ hai. Nếu giá hôm nay cao hơn hôm qua, em cộng chênh lệch dương đó. Các chênh lệch bằng `0` hoặc âm được bỏ qua. Cuối cùng accumulator là tổng tất cả cạnh tăng có lợi.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Dùng solution một giao dịch của bài 121.
- Không giải thích được vì sao local greedy tạo global optimum.
- Nói phải mua/bán thực sự mỗi ngày; đây chỉ là cách phân rã lợi nhuận tương đương.
- Không nhận ra DP state machine là hướng tổng quát cho các biến thể stock.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- consecutive difference — chênh lệch liên tiếp
- positive delta — mức tăng dương
- increasing run — đoạn tăng liên tục
- valley / peak — đáy / đỉnh
- unlimited transactions — số giao dịch không giới hạn
- holding state — trạng thái đang giữ cổ phiếu
- telescope / telescoping sum — tổng rút gọn liên tiếp
