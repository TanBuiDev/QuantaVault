# 69. Sqrt(x) — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I binary-search the integer answer. The predicate `mid * mid <= x` is monotonic, so whenever it is true I record `mid` and search to the right; otherwise I search left. I compute the square in `long` to avoid overflow. This is O(log x) time and O(1) space.

**VI:** Tôi binary search số nguyên lớn nhất có bình phương không vượt quá `x`, dùng `long` để tránh overflow.

## 2. Core approach questions

**Q (EN):** Why does binary search apply?

**Q (VI):** Vì sao dùng binary search được?

### Short answer (EN)
Because `m*m <= x` changes from true to false only once.

### Trả lời ngắn (VI)
Vì điều kiện `m*m <= x` chỉ chuyển từ đúng sang sai một lần.

### Standard answer (EN)
All integers up to floor sqrt(x) satisfy the predicate, and every larger integer fails it, which gives a monotonic search space.

### Trả lời chuẩn (VI)
Mọi số đến floor sqrt đều hợp lệ, mọi số lớn hơn đều không hợp lệ nên miền tìm kiếm monotonic.

## 3. Why / correctness questions

**Q (EN):** Why store `answer`?

**Q (VI):** Vì sao lưu `answer`?

### Short answer (EN)
It keeps the largest valid midpoint seen so far.

### Trả lời ngắn (VI)
Nó giữ midpoint hợp lệ lớn nhất đã gặp.

### Standard answer (EN)
A valid midpoint may not be the final answer, so I save it before searching for a larger valid value.

### Trả lời chuẩn (VI)
Midpoint hợp lệ có thể chưa lớn nhất, nên ta lưu lại rồi tiếp tục sang phải.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(log x) time and O(1) space.

### Trả lời ngắn (VI)
O(log x) time và O(1) space.

### Standard answer (EN)
Each iteration halves the candidate interval and uses only a few scalar variables.

### Trả lời chuẩn (VI)
Mỗi vòng giảm một nửa khoảng tìm kiếm và chỉ dùng vài biến scalar.

## 5. Edge-case questions

**Q (EN):** Why use `long` for the square?

**Q (VI):** Vì sao dùng `long` cho bình phương?

### Short answer (EN)
`mid * mid` can overflow a 32-bit integer.

### Trả lời ngắn (VI)
`mid * mid` có thể tràn `int`.

### Standard answer (EN)
Even though `x` fits in `int`, candidate midpoints can have squares larger than `Integer.MAX_VALUE`, so widening before multiplication preserves the comparison.

### Trả lời chuẩn (VI)
`x` vừa `int` nhưng bình phương midpoint có thể vượt giới hạn, nên cần cast sang `long` trước phép nhân.

## 6. Alternative-approach and trade-off questions

**Q (EN):** What alternative approach is common?

**Q (VI):** Cách khác thường gặp là gì?

### Short answer (EN)
Newton's method.

### Trả lời ngắn (VI)
Newton's method.

### Standard answer (EN)
Newton iteration converges quickly, but binary search is simpler and directly exploits the monotonic integer predicate.

### Trả lời chuẩn (VI)
Newton hội tụ nhanh, nhưng binary search đơn giản và dễ chứng minh hơn.

## 7. Code walkthrough questions

**Q (EN):** Why can the right bound be `x / 2` for `x >= 2`?

**Q (VI):** Vì sao `right = x/2` là đủ khi `x >= 2`?

### Short answer (EN)
For x >= 2, floor sqrt(x) never exceeds x/2.

### Trả lời ngắn (VI)
Với `x >= 2`, floor sqrt không vượt `x/2`.

### Standard answer (EN)
The bound is safe and merely narrows the initial interval; `[1, x]` would also be correct.

### Trả lời chuẩn (VI)
Đó là bound an toàn để thu hẹp khoảng; `[1, x]` cũng đúng.

## 8. Follow-up variations

**Q (EN):** How would you return a floating-point square root?

**Q (VI):** Nếu cần căn bậc hai dạng số thực thì sao?

### Short answer (EN)
Binary search to an epsilon or use Newton iteration.

### Trả lời ngắn (VI)
Binary search theo epsilon hoặc dùng Newton.

### Standard answer (EN)
The integer monotonic boundary becomes a precision problem, so I would iterate until the interval is smaller than the required tolerance.

### Trả lời chuẩn (VI)
Khi cần số thực, ta dừng khi khoảng tìm kiếm nhỏ hơn sai số yêu cầu.

## 9. Common interviewer traps

- Integer overflow in `mid * mid`.
- Off-by-one errors at perfect squares.
- Returning the nearest integer instead of floor.

## 10. Useful phrases and vocabulary

```text
monotonic predicate
binary search on the answer
largest valid midpoint
avoid integer overflow
floor square root
```
