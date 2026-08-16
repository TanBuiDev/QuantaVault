# 172. Factorial Trailing Zeroes — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** Each trailing zero needs one factor 10, or one pair of 2 and 5. Factorials contain more 2s than 5s, so I count all factors of 5 using `n/5 + n/25 + n/125 + ...`. Repeatedly dividing n by 5 computes this in O(log n) time and O(1) space.

**VI:** Tôi đếm tổng số factor 5 trong `n!` bằng các tầng `n/5, n/25, ...`.

## 2. Core approach questions

**Q (EN):** Why count only factors of 5?

**Q (VI):** Vì sao chỉ đếm factor 5?

### Short answer (EN)
Because factors of 2 are more abundant in a factorial.

### Trả lời ngắn (VI)
Vì factor 2 xuất hiện nhiều hơn factor 5.

### Standard answer (EN)
Every trailing zero consumes one 2 and one 5. Since 2 is never the limiting factor, the number of pairs equals the number of 5s.

### Trả lời chuẩn (VI)
Mỗi zero cần một 2 và một 5; factor 5 là phía giới hạn nên số zero bằng số factor 5.

## 3. Why / correctness questions

**Q (EN):** Why add `n/25` after `n/5`?

**Q (VI):** Vì sao phải cộng thêm `n/25`?

### Short answer (EN)
Multiples of 25 contain a second factor of 5.

### Trả lời ngắn (VI)
Bội của 25 chứa thêm một factor 5.

### Standard answer (EN)
`n/5` counts each multiple of 5 once. Numbers divisible by 25 need one extra count, and higher powers contribute more in the same way.

### Trả lời chuẩn (VI)
`n/5` mới đếm mỗi bội 5 một lần; bội 25, 125 cần cộng các factor 5 bổ sung.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(log_5 n) time and O(1) space.

### Trả lời ngắn (VI)
O(log₅ n) time và O(1) space.

### Standard answer (EN)
Each iteration divides n by 5, so only logarithmically many iterations are required.

### Trả lời chuẩn (VI)
Mỗi vòng chia n cho 5 nên số vòng là logarithmic.

## 5. Edge-case questions

**Q (EN):** What happens for n less than 5?

**Q (VI):** Nếu n nhỏ hơn 5 thì sao?

### Short answer (EN)
The result is zero.

### Trả lời ngắn (VI)
Kết quả là 0.

### Standard answer (EN)
No number in the factorial contributes a factor of 5, so there cannot be a trailing zero.

### Trả lời chuẩn (VI)
Không có factor 5 nào nên không thể tạo factor 10.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not compute the factorial?

**Q (VI):** Vì sao không tính factorial?

### Short answer (EN)
It overflows quickly and does unnecessary work.

### Trả lời ngắn (VI)
Nó overflow rất nhanh và làm nhiều việc không cần thiết.

### Standard answer (EN)
The answer depends only on the prime-factor count, not on the factorial's full numeric value.

### Trả lời chuẩn (VI)
Ta chỉ cần prime-factor count chứ không cần giá trị đầy đủ của factorial.

## 7. Code walkthrough questions

**Q (EN):** What does each division by 5 represent?

**Q (VI):** Mỗi lần chia 5 biểu diễn điều gì?

### Short answer (EN)
The next power-of-5 contribution.

### Trả lời ngắn (VI)
Tầng đóng góp của lũy thừa 5 tiếp theo.

### Standard answer (EN)
The first quotient counts multiples of 5, the next counts multiples of 25, then 125, and so on.

### Trả lời chuẩn (VI)
Quotient lần lượt đếm bội 5, 25, 125, ...

## 8. Follow-up variations

**Q (EN):** How would you count a prime p in n!?

**Q (VI):** Đếm prime p trong n! thế nào?

### Short answer (EN)
Sum `floor(n/p^k)` for all powers of p.

### Trả lời ngắn (VI)
Cộng `floor(n/p^k)` qua mọi lũy thừa p.

### Standard answer (EN)
The same argument generalizes directly from p=5 to any prime p.

### Trả lời chuẩn (VI)
Lập luận này tổng quát trực tiếp cho mọi prime p.

## 9. Common interviewer traps

- Counting only multiples of 5 once.
- Computing the factorial explicitly.
- Forgetting n can be zero.

## 10. Useful phrases and vocabulary

```text
count factors of five
higher powers contribute extra factors
factor 5 is the bottleneck
logarithmic number of divisions
```
