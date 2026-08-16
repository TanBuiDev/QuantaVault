# 66. Plus One — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I scan the digits from right to left. If a digit is below 9, I increment it and return because no further carry exists. A 9 becomes 0 and propagates the carry. If every digit was 9, I return a new array of length n+1 with a leading 1. This is O(n) time and O(1) extra space excluding output.

**VI:** Tôi mô phỏng carry từ phải sang trái; chỉ trường hợp toàn 9 mới cần mảng dài hơn.

## 2. Core approach questions

**Q (EN):** Why scan from right to left?

**Q (VI):** Vì sao duyệt từ phải sang trái?

### Short answer (EN)
Because adding one starts at the least significant digit.

### Trả lời ngắn (VI)
Vì cộng 1 bắt đầu ở chữ số hàng thấp nhất.

### Standard answer (EN)
Carry can only move toward more significant digits, so right-to-left traversal follows the exact dependency direction.

### Trả lời chuẩn (VI)
Carry chỉ truyền sang các hàng cao hơn nên chiều phải-sang-trái đúng với phụ thuộc của phép cộng.

## 3. Why / correctness questions

**Q (EN):** Why can you return as soon as a digit is below 9?

**Q (VI):** Vì sao có thể return ngay khi digit nhỏ hơn 9?

### Short answer (EN)
Incrementing it consumes the carry completely.

### Trả lời ngắn (VI)
Tăng digit đó sẽ kết thúc carry.

### Standard answer (EN)
All less-significant trailing 9s have already become zero, and a digit below 9 can absorb the +1 without producing another carry.

### Trả lời chuẩn (VI)
Các số 9 phía sau đã thành 0, còn digit nhỏ hơn 9 nhận +1 mà không tạo carry mới.

## 4. Complexity questions

**Q (EN):** What is the worst-case complexity?

**Q (VI):** Độ phức tạp worst-case là gì?

### Short answer (EN)
O(n) time.

### Trả lời ngắn (VI)
O(n) time.

### Standard answer (EN)
The all-9 case touches every digit once; otherwise the scan often exits earlier.

### Trả lời chuẩn (VI)
Trường hợp toàn 9 phải chạm mọi digit đúng một lần.

## 5. Edge-case questions

**Q (EN):** When do you need a new array?

**Q (VI):** Khi nào cần mảng mới?

### Short answer (EN)
Only when all input digits are 9.

### Trả lời ngắn (VI)
Chỉ khi mọi digit đều là 9.

### Standard answer (EN)
Only then does adding one increase the number of digits, for example 999 -> 1000.

### Trả lời chuẩn (VI)
Chỉ khi đó số chữ số mới tăng, ví dụ 999 -> 1000.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not convert the array to an integer?

**Q (VI):** Vì sao không chuyển mảng thành integer?

### Short answer (EN)
The represented value can be far larger than primitive integer types.

### Trả lời ngắn (VI)
Giá trị có thể lớn hơn rất nhiều giới hạn kiểu integer.

### Standard answer (EN)
The representation exists specifically to support arbitrarily large values, so digit-wise arithmetic is the safe approach.

### Trả lời chuẩn (VI)
Biểu diễn mảng dùng cho số lớn, vì vậy arithmetic theo digit là cách an toàn.

## 7. Code walkthrough questions

**Q (EN):** Why set a 9 to zero?

**Q (VI):** Vì sao gán 9 thành 0?

### Short answer (EN)
Because 9 + 1 produces digit 0 and carry 1.

### Trả lời ngắn (VI)
Vì 9 + 1 cho digit 0 và carry 1.

### Standard answer (EN)
That is exactly the base-10 carry rule and lets the loop continue to the next more significant position.

### Trả lời chuẩn (VI)
Đó là quy tắc carry cơ số 10 và vòng lặp tiếp tục sang vị trí bên trái.

## 8. Follow-up variations

**Q (EN):** How would you add an arbitrary integer k represented as digits?

**Q (VI):** Nếu cộng một số k bất kỳ thì sao?

### Short answer (EN)
Propagate `carry = k` from right to left using modulo and division by 10.

### Trả lời ngắn (VI)
Truyền `carry = k` từ phải sang trái bằng modulo và chia 10.

### Standard answer (EN)
At each digit, compute sum = digit + carry, write sum % 10, and update carry = sum / 10 until both input positions and carry are exhausted.

### Trả lời chuẩn (VI)
Mỗi bước tính tổng, ghi `%10` và cập nhật carry bằng `/10`.

## 9. Common interviewer traps

- Overflow from numeric conversion.
- Forgetting a chain of trailing 9s.
- Forgetting the output can grow by one digit.

## 10. Useful phrases and vocabulary

```text
propagate the carry
scan from the least significant digit
all-nine edge case
in-place update
```
