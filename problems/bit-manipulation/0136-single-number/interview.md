# 136. Single Number — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I XOR all values. Because `x ^ x = 0`, every duplicated number cancels with its pair. XOR is associative and commutative, so positions do not matter, and the unique number remains. This is O(n) time and O(1) extra space.

**VI:** Tôi XOR toàn bộ mảng; mọi cặp giống nhau triệt tiêu và chỉ còn số duy nhất.

## 2. Core approach questions

**Q (EN):** Why does XOR solve this?

**Q (VI):** Vì sao XOR giải được bài này?

### Short answer (EN)
Equal values cancel under XOR.

### Trả lời ngắn (VI)
Hai giá trị bằng nhau XOR thành 0.

### Standard answer (EN)
Since every repeated value occurs exactly twice, all pairs reduce to zero, leaving the one unpaired value.

### Trả lời chuẩn (VI)
Mọi giá trị lặp tạo đúng một cặp và về 0, còn phần tử không có cặp được giữ lại.

## 3. Why / correctness questions

**Q (EN):** Why does array order not matter?

**Q (VI):** Vì sao thứ tự mảng không quan trọng?

### Short answer (EN)
XOR is associative and commutative.

### Trả lời ngắn (VI)
XOR có tính kết hợp và giao hoán.

### Standard answer (EN)
We can conceptually reorder the expression to place equal values together without changing the result.

### Trả lời chuẩn (VI)
Có thể nhóm các giá trị bằng nhau cạnh nhau trong biểu thức XOR mà kết quả không đổi.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(n) time and O(1) space.

### Trả lời ngắn (VI)
O(n) time và O(1) space.

### Standard answer (EN)
We make one pass and maintain one integer accumulator.

### Trả lời chuẩn (VI)
Chỉ duyệt một lần và giữ một accumulator.

## 5. Edge-case questions

**Q (EN):** Does XOR work with negative integers?

**Q (VI):** XOR có đúng với số âm không?

### Short answer (EN)
Yes, identical two's-complement bit patterns still cancel.

### Trả lời ngắn (VI)
Có, hai biểu diễn two's-complement giống nhau vẫn triệt tiêu.

### Standard answer (EN)
The XOR identities apply bitwise regardless of sign interpretation.

### Trả lời chuẩn (VI)
Các tính chất XOR đúng ở mức bit, không phụ thuộc cách diễn giải dấu.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not use a set?

**Q (VI):** Vì sao không dùng Set?

### Short answer (EN)
It needs O(n) extra space.

### Trả lời ngắn (VI)
Nó cần O(n) bộ nhớ phụ.

### Standard answer (EN)
A set is straightforward but violates the constant-space requirement, while XOR satisfies both constraints.

### Trả lời chuẩn (VI)
Set dễ hiểu nhưng vi phạm constant-space; XOR đáp ứng cả time và space.

## 7. Code walkthrough questions

**Q (EN):** Why initialize the accumulator to zero?

**Q (VI):** Vì sao khởi tạo accumulator bằng 0?

### Short answer (EN)
Zero is the identity element for XOR.

### Trả lời ngắn (VI)
0 là phần tử đơn vị của XOR.

### Standard answer (EN)
`0 ^ x = x`, so starting from zero introduces no extra bits into the result.

### Trả lời chuẩn (VI)
`0 ^ x = x`, nên giá trị khởi tạo không làm thay đổi kết quả.

## 8. Follow-up variations

**Q (EN):** What if duplicates appear three times?

**Q (VI):** Nếu phần tử lặp xuất hiện ba lần thì sao?

### Short answer (EN)
Plain XOR no longer works; count bits modulo three or use a bitwise state machine.

### Trả lời ngắn (VI)
XOR đơn giản không còn đủ; cần đếm bit modulo 3 hoặc state machine.

### Standard answer (EN)
XOR cancels pairs, so an odd repetition count leaves residual bits; the frequency rule must match the repetition count.

### Trả lời chuẩn (VI)
XOR chỉ triệt tiêu theo cặp, nên repetition lẻ cần kỹ thuật modulo phù hợp.

## 9. Common interviewer traps

- Using extra hash storage.
- Confusing XOR with OR.
- Forgetting the exact twice-except-one guarantee.

## 10. Useful phrases and vocabulary

```text
XOR cancellation
identity element zero
associative and commutative
one-pass constant-space solution
```
