# 191. Number of 1 Bits — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I repeatedly apply `n &= n - 1`, which clears the lowest set bit. Each iteration therefore accounts for exactly one 1-bit, so the number of iterations is the Hamming weight. The method uses O(k) time for k set bits and O(1) space.

**VI:** Tôi liên tục dùng `n &= n - 1` để xóa từng set bit và đếm số lần.

## 2. Core approach questions

**Q (EN):** What does `n & (n - 1)` do?

**Q (VI):** `n & (n - 1)` làm gì?

### Short answer (EN)
It clears the lowest set bit.

### Trả lời ngắn (VI)
Nó xóa set bit thấp nhất.

### Standard answer (EN)
Subtracting one flips the lowest 1 to 0 and lower zeros to ones; AND removes that one while preserving higher bits.

### Trả lời chuẩn (VI)
Trừ 1 làm đổi vùng bit thấp; AND giữ các bit cao và xóa đúng set bit thấp nhất.

## 3. Why / correctness questions

**Q (EN):** Why does the counter equal the answer?

**Q (VI):** Vì sao counter bằng đáp án?

### Short answer (EN)
One iteration removes exactly one set bit.

### Trả lời ngắn (VI)
Mỗi vòng xóa đúng một bit 1.

### Standard answer (EN)
The process ends only after every original set bit has been removed, so the iteration count equals their number.

### Trả lời chuẩn (VI)
Quá trình dừng khi toàn bộ set bit ban đầu đã bị xóa.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(k) time and O(1) space.

### Trả lời ngắn (VI)
O(k) time và O(1) space.

### Standard answer (EN)
The loop runs once per set bit instead of once per bit position.

### Trả lời chuẩn (VI)
Vòng lặp chạy theo số set bit, không phải số vị trí bit.

## 5. Edge-case questions

**Q (EN):** What if n is a power of two?

**Q (VI):** Nếu n là lũy thừa của 2 thì sao?

### Short answer (EN)
Exactly one iteration runs.

### Trả lời ngắn (VI)
Chỉ chạy đúng một vòng.

### Standard answer (EN)
A power of two contains exactly one set bit, and the operation immediately clears it.

### Trả lời chuẩn (VI)
Lũy thừa 2 chỉ có một set bit nên bị xóa ngay.

## 6. Alternative-approach and trade-off questions

**Q (EN):** What is the straightforward alternative?

**Q (VI):** Cách đơn giản khác là gì?

### Short answer (EN)
Inspect each bit with a mask or shift.

### Trả lời ngắn (VI)
Kiểm tra từng bit bằng mask hoặc shift.

### Standard answer (EN)
A fixed-width scan is simple and predictable, while Kernighan can do fewer iterations for sparse values.

### Trả lời chuẩn (VI)
Scan 32 bit dễ hiểu; Kernighan nhanh hơn khi số bit 1 ít.

## 7. Code walkthrough questions

**Q (EN):** Why is no extra data structure needed?

**Q (VI):** Vì sao không cần cấu trúc dữ liệu phụ?

### Short answer (EN)
The integer itself is progressively reduced.

### Trả lời ngắn (VI)
Ta thay đổi trực tiếp integer và chỉ giữ một counter.

### Standard answer (EN)
All state is represented by the current integer and a scalar count.

### Trả lời chuẩn (VI)
Toàn bộ state chỉ gồm giá trị hiện tại và counter.

## 8. Follow-up variations

**Q (EN):** How can repeated calls be optimized?

**Q (VI):** Nếu gọi nhiều lần thì tối ưu thế nào?

### Short answer (EN)
Use a lookup table for byte-sized chunks.

### Trả lời ngắn (VI)
Dùng lookup table cho từng byte.

### Standard answer (EN)
Precompute Hamming weights for 0..255 and sum four byte lookups for each 32-bit value.

### Trả lời chuẩn (VI)
Precompute popcount cho 256 byte values rồi cộng 4 lookup cho mỗi integer.

## 9. Common interviewer traps

- Confusing bit count with bit length.
- Forgetting why `n - 1` affects the lowest set bit.
- Overcomplicating with string conversion.

## 10. Useful phrases and vocabulary

```text
clear the lowest set bit
Hamming weight
Brian Kernighan's trick
one iteration per set bit
```
