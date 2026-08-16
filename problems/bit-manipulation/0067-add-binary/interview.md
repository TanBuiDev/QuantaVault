# 67. Add Binary — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I simulate binary addition from right to left with two indices and a carry. Each column emits `sum % 2` and propagates `sum / 2`. I keep going while either input or the carry remains, then reverse the builder. This is linear in the longer string.

**VI:** Tôi mô phỏng cộng nhị phân từ phải sang trái với hai index và carry.

## 2. Core approach questions

**Q (EN):** Why scan from right to left?

**Q (VI):** Vì sao duyệt từ phải sang trái?

### Short answer (EN)
Carry flows from less significant to more significant bits.

### Trả lời ngắn (VI)
Carry truyền từ bit thấp sang bit cao.

### Standard answer (EN)
This order matches manual addition and makes each next column depend only on one scalar carry.

### Trả lời chuẩn (VI)
Chiều này đúng với phép cộng tay và chỉ cần một biến carry.

## 3. Why / correctness questions

**Q (EN):** Why is `sum & 1` the result bit?

**Q (VI):** Vì sao `sum & 1` là bit kết quả?

### Short answer (EN)
It is `sum mod 2`.

### Trả lời ngắn (VI)
Đó là `sum mod 2`.

### Standard answer (EN)
Binary digit value is the remainder modulo two; the quotient becomes carry.

### Trả lời chuẩn (VI)
Bit là phần dư chia 2, thương là carry.

## 4. Complexity questions

**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(max(m,n)) time and output space.

### Trả lời ngắn (VI)
O(max(m,n)) time và bộ nhớ cho output.

### Standard answer (EN)
Each input character is visited at most once.

### Trả lời chuẩn (VI)
Mỗi ký tự chỉ được đọc tối đa một lần.

## 5. Edge-case questions

**Q (EN):** What if a final carry remains?

**Q (VI):** Nếu còn carry cuối thì sao?

### Short answer (EN)
The loop emits one additional leading bit.

### Trả lời ngắn (VI)
Vòng lặp tạo thêm một bit 1 ở đầu.

### Standard answer (EN)
Including `carry != 0` in the loop condition preserves this most-significant bit.

### Trả lời chuẩn (VI)
Điều kiện loop giữ lại carry cuối cùng.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not parse the strings as integers?

**Q (VI):** Vì sao không parse thành integer?

### Short answer (EN)
Inputs can have ten thousand bits.

### Trả lời ngắn (VI)
Input có thể dài 10 nghìn bit.

### Standard answer (EN)
Primitive numeric types cannot represent such values, while digit simulation has no overflow risk.

### Trả lời chuẩn (VI)
Primitive type sẽ overflow; mô phỏng theo digit thì không.

## 7. Code walkthrough questions

**Q (EN):** Why append then reverse?

**Q (VI):** Vì sao append rồi reverse?

### Short answer (EN)
We discover least-significant bits first.

### Trả lời ngắn (VI)
Ta sinh bit thấp trước.

### Standard answer (EN)
Appending is efficient; reversing once avoids costly front insertions.

### Trả lời chuẩn (VI)
Append hiệu quả hơn insert đầu chuỗi, rồi chỉ reverse một lần.

## 8. Follow-up variations

**Q (EN):** How would you add base-k strings?

**Q (VI):** Nếu cộng chuỗi cơ số k thì sao?

### Short answer (EN)
Use `% k` for the digit and `/ k` for carry.

### Trả lời ngắn (VI)
Dùng `%k` và `/k`.

### Standard answer (EN)
The same column-addition invariant works for any radix.

### Trả lời chuẩn (VI)
Invariant cộng theo cột áp dụng cho mọi cơ số.

## 9. Common interviewer traps

- Forgetting final carry.
- Overflow from numeric parsing.
- Mishandling unequal lengths.

## 10. Useful phrases and vocabulary

```text
carry propagation
right-to-left simulation
emit the remainder bit
linear in the longer input
```
