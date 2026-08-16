# 50. Pow(x, n) — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I use binary exponentiation. I convert the exponent to `long`, invert the base if the exponent is negative, and then process one exponent bit at a time. For each set bit I multiply the answer by the current base, then square the base and halve the exponent. This is O(log |n|) time and O(1) space.

**VI:** Tôi dùng binary exponentiation và `long` để xử lý an toàn số mũ âm cực biên.

## 2. Core approach questions

**Q (EN):** Why does exponentiation by squaring work?

**Q (VI):** Vì sao exponentiation by squaring đúng?

### Short answer (EN)
It decomposes the exponent into powers of two.

### Trả lời ngắn (VI)
Nó phân rã exponent theo các lũy thừa của `2`.

### Standard answer (EN)
Repeated squaring generates `x^1, x^2, x^4, ...`; multiplying the factors for the set bits reconstructs exactly `x^n`.

### Trả lời chuẩn (VI)
Các bit `1` chọn đúng những factor power-of-two cần để tạo `x^n`.

## 3. Why / correctness questions

**Q (EN):** Why convert `n` to `long`?

**Q (VI):** Vì sao đổi `n` sang `long`?

### Short answer (EN)
`-Integer.MIN_VALUE` overflows an `int`.

### Trả lời ngắn (VI)
Đổi dấu `Integer.MIN_VALUE` trong `int` sẽ overflow.

### Standard answer (EN)
The positive magnitude `2147483648` does not fit in signed `int`, but it fits in `long`, so conversion must happen before negation.

### Trả lời chuẩn (VI)
Độ lớn dương đó không vừa `int` nhưng vừa `long`.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(log |n|) time and O(1) space.

### Trả lời ngắn (VI)
O(log |n|) time, O(1) space.

### Standard answer (EN)
The exponent is halved every iteration, and only scalar variables are stored.

### Trả lời chuẩn (VI)
Exponent giảm một nửa mỗi vòng và chỉ dùng biến scalar.

## 5. Edge-case questions

**Q (EN):** What happens when `n` is zero?

**Q (VI):** Khi `n=0` thì sao?

### Short answer (EN)
The loop does not run and the answer remains `1.0`.

### Trả lời ngắn (VI)
Loop không chạy và kết quả giữ `1.0`.

### Standard answer (EN)
This matches the identity `x^0 = 1` for the valid inputs in this problem.

### Trả lời chuẩn (VI)
Đúng với đồng nhất thức `x^0=1`.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not multiply `x` exactly `n` times?

**Q (VI):** Vì sao không nhân lặp?

### Short answer (EN)
That is O(|n|), too slow for large exponents.

### Trả lời ngắn (VI)
Cách đó O(|n|), chậm hơn nhiều.

### Standard answer (EN)
Squaring reuses powers and reduces the number of multiplications logarithmically.

### Trả lời chuẩn (VI)
Squaring tái sử dụng power và giảm số phép nhân xuống logarithmic.

## 7. Code walkthrough questions

**Q (EN):** What does the low-bit test mean?

**Q (VI):** Kiểm tra bit thấp nhất có ý nghĩa gì?

### Short answer (EN)
It tells whether the current power-of-two factor belongs in the result.

### Trả lời ngắn (VI)
Nó cho biết factor hiện tại có cần nhân vào answer không.

### Standard answer (EN)
If the exponent is odd, its binary low bit is one, so one copy of the current base factor must be consumed before halving.

### Trả lời chuẩn (VI)
Exponent lẻ nghĩa là bit thấp nhất bằng `1`, nên phải dùng factor hiện tại.

## 8. Follow-up variations

**Q (EN):** Can the same idea compute matrix powers?

**Q (VI):** Có thể dùng cho matrix power không?

### Short answer (EN)
Yes, if multiplication is replaced by associative matrix multiplication.

### Trả lời ngắn (VI)
Có, thay multiplication bằng matrix multiplication có tính kết hợp.

### Standard answer (EN)
Binary exponentiation only requires an associative operation and an identity element.

### Trả lời chuẩn (VI)
Kỹ thuật chỉ cần phép toán kết hợp và identity.

## 9. Common interviewer traps

- Integer overflow when negating `n`.
- Forgetting negative exponents.
- Claiming O(n) after using halving.

## 10. Useful phrases and vocabulary

```text
binary exponentiation
process one exponent bit
invert the base
square and halve
avoid Integer.MIN_VALUE overflow
```
