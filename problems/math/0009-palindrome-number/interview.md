# 9. Palindrome Number — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I avoid strings by reversing only the last half of the digits. Negative numbers and positive numbers ending in zero are immediate false cases. I move digits from x into `reversedHalf` until the two halves meet, then compare them directly, ignoring the middle digit for odd-length numbers. This is O(log x) time and O(1) space.

**VI:** Tôi reverse nửa sau của số bằng phép `%10` và `/10`, rồi so sánh hai nửa.

## 2. Core approach questions

**Q (EN):** Why reverse only half?

**Q (VI):** Vì sao chỉ reverse một nửa?

### Short answer (EN)
It is enough to compare the two halves and avoids full-reversal overflow.

### Trả lời ngắn (VI)
Chỉ cần hai nửa để so sánh và tránh overflow khi đảo toàn bộ.

### Standard answer (EN)
Once the reversed suffix has at least as many digits as the remaining prefix, all information needed for palindrome comparison is available.

### Trả lời chuẩn (VI)
Khi suffix đảo đã dài bằng prefix còn lại, ta đã có đủ thông tin để kiểm tra palindrome.

## 3. Why / correctness questions

**Q (EN):** Why reject a nonzero number ending in zero?

**Q (VI):** Vì sao loại số khác 0 nhưng kết thúc bằng 0?

### Short answer (EN)
Its mirror would need a leading zero, which integers do not have.

### Trả lời ngắn (VI)
Số đối xứng của nó phải có leading zero, điều không tồn tại trong integer representation.

### Standard answer (EN)
For example 10 would have to read as 01 in reverse, so it cannot be a numeric palindrome.

### Trả lời chuẩn (VI)
Ví dụ 10 đảo thành 01 nên không thể là palindrome số học.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(log x) time and O(1) space.

### Trả lời ngắn (VI)
O(log x) time và O(1) space.

### Standard answer (EN)
We process about half the base-10 digits, and the number of digits is logarithmic in x.

### Trả lời chuẩn (VI)
Ta xử lý khoảng nửa số chữ số, mà số chữ số là logarithmic theo x.

## 5. Edge-case questions

**Q (EN):** How do odd-length numbers work?

**Q (VI):** Số có độ dài lẻ xử lý thế nào?

### Short answer (EN)
Drop the middle digit with `reversedHalf / 10`.

### Trả lời ngắn (VI)
Bỏ digit giữa bằng `reversedHalf / 10`.

### Standard answer (EN)
The middle digit does not need a matching partner, so after reversal it can be discarded before comparing both halves.

### Trả lời chuẩn (VI)
Digit giữa không cần đối tác nên có thể bỏ trước khi so sánh.

## 6. Alternative-approach and trade-off questions

**Q (EN):** What is the simplest alternative?

**Q (VI):** Cách thay thế đơn giản nhất là gì?

### Short answer (EN)
Convert to a string and compare from both ends.

### Trả lời ngắn (VI)
Chuyển thành string và dùng two pointers.

### Standard answer (EN)
That is readable but uses extra representation and does not satisfy the follow-up asking for a numeric solution.

### Trả lời chuẩn (VI)
Cách đó dễ đọc nhưng không đáp ứng follow-up không dùng string.

## 7. Code walkthrough questions

**Q (EN):** When does the loop stop?

**Q (VI):** Vòng lặp dừng khi nào?

### Short answer (EN)
When the remaining prefix is no larger than the reversed suffix.

### Trả lời ngắn (VI)
Khi prefix còn lại không lớn hơn suffix đã đảo.

### Standard answer (EN)
At that point we have processed at least half the digits, so another iteration would cross the midpoint.

### Trả lời chuẩn (VI)
Lúc đó đã xử lý ít nhất nửa số chữ số và vòng tiếp theo sẽ vượt midpoint.

## 8. Follow-up variations

**Q (EN):** Could you test palindrome in another base?

**Q (VI):** Có thể kiểm tra palindrome ở cơ số khác không?

### Short answer (EN)
Yes, replace `%10` and `/10` with modulo and division by the base.

### Trả lời ngắn (VI)
Có, thay 10 bằng cơ số cần kiểm tra.

### Standard answer (EN)
The digit-extraction logic is base-independent; only the radix changes.

### Trả lời chuẩn (VI)
Logic tách digit không phụ thuộc cơ số, chỉ cần thay radix.

## 9. Common interviewer traps

- Negative numbers.
- Numbers ending in zero.
- Odd-length midpoint handling.
- Overflow from reversing the full integer.

## 10. Useful phrases and vocabulary

```text
reverse only half the digits
avoid full-integer overflow
ignore the middle digit
extract the last digit
```
