# 137. Single Number II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I track each bit's occurrence count modulo three with two integer masks, `ones` and `twos`. Each incoming number updates all 32 bit states in parallel. Bits seen three times return to zero, while bits of the unique number remain in `ones`. The result is O(n) time and O(1) extra space.

**VI:** Tôi dùng hai bit mask để đếm mỗi bit modulo 3, nên các phần tử lặp ba lần tự triệt tiêu.

## 2. Core approach questions

**Q (EN):** What do `ones` and `twos` mean?

**Q (VI):** `ones` và `twos` có ý nghĩa gì?

### Short answer (EN)
They store bits seen once and twice modulo three.

### Trả lời ngắn (VI)
Chúng lưu các bit đã xuất hiện một và hai lần modulo 3.

### Standard answer (EN)
For every bit position, the two masks encode one of three valid count states: zero, one, or two occurrences modulo 3.

### Trả lời chuẩn (VI)
Ở mỗi vị trí bit, hai mask mã hóa count 0, 1 hoặc 2 modulo 3.

## 3. Why / correctness questions

**Q (EN):** Why do triplicated values disappear?

**Q (VI):** Vì sao giá trị lặp ba lần biến mất?

### Short answer (EN)
Their bit counts are zero modulo three.

### Trả lời ngắn (VI)
Count bit của chúng bằng 0 modulo 3.

### Standard answer (EN)
Every set bit contributed by a repeated value enters the state machine three times and cycles back to state zero.

### Trả lời chuẩn (VI)
Mỗi set bit đi qua ba transition và quay lại trạng thái 0.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(n) time and O(1) space.

### Trả lời ngắn (VI)
O(n) time và O(1) space.

### Standard answer (EN)
Each array element performs a constant number of integer bit operations and only two masks are stored.

### Trả lời chuẩn (VI)
Mỗi phần tử dùng số phép bit hằng số và chỉ lưu hai mask.

## 5. Edge-case questions

**Q (EN):** Does this work for negative integers?

**Q (VI):** Cách này có đúng với số âm không?

### Short answer (EN)
Yes; the sign bit is processed like every other bit.

### Trả lời ngắn (VI)
Có; bit dấu được xử lý giống các bit khác.

### Standard answer (EN)
Java's fixed-width two's-complement representation means the mask operations preserve the sign bit correctly.

### Trả lời chuẩn (VI)
Biểu diễn two's complement 32-bit giúp các phép mask xử lý bit dấu chính xác.

## 6. Alternative-approach and trade-off questions

**Q (EN):** What simpler constant-space approach exists?

**Q (VI):** Có cách constant-space đơn giản hơn không?

### Short answer (EN)
Count each of the 32 bit positions and take each count modulo three.

### Trả lời ngắn (VI)
Đếm từng trong 32 bit rồi lấy modulo 3.

### Standard answer (EN)
That approach is easier to derive and still O(n), while the two-mask state machine performs the same counting in parallel.

### Trả lời chuẩn (VI)
Cách 32 counter dễ suy ra hơn; state machine làm việc tương đương nhưng song song bằng bit operations.

## 7. Code walkthrough questions

**Q (EN):** Why mask `ones` with `~twos`?

**Q (VI):** Vì sao AND `ones` với `~twos`?

### Short answer (EN)
A bit cannot simultaneously belong to both count states.

### Trả lời ngắn (VI)
Một bit không thể đồng thời ở trạng thái count 1 và count 2.

### Standard answer (EN)
The mask removes bits that have advanced into the twice-seen state, keeping the state encoding mutually exclusive.

### Trả lời chuẩn (VI)
Mask xóa các bit đã chuyển sang trạng thái thấy hai lần để state không chồng lấp.

## 8. Follow-up variations

**Q (EN):** What if every repeated value appeared k times?

**Q (VI):** Nếu các giá trị lặp xuất hiện k lần thì sao?

### Short answer (EN)
Count each bit modulo k or design a larger state machine.

### Trả lời ngắn (VI)
Đếm từng bit modulo k hoặc thiết kế state machine lớn hơn.

### Standard answer (EN)
The general principle is frequency cancellation modulo the repetition count; the representation of the state depends on k.

### Trả lời chuẩn (VI)
Nguyên tắc tổng quát là triệt tiêu frequency theo modulo số lần lặp.

## 9. Common interviewer traps

- Using extra hash storage despite the constraint.
- Mishandling update order.
- Assuming inputs are nonnegative.

## 10. Useful phrases and vocabulary

```text
count bits modulo three
bitwise finite-state machine
constant extra space
process all bit positions in parallel
```
