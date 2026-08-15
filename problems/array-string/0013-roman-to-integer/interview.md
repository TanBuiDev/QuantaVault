# 13. Roman to Integer — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I map each Roman symbol to its integer value and scan left to right. If the current value is smaller than the next value, the current symbol belongs to a subtractive form, so I subtract it; otherwise I add it. The last symbol is always added. Because the input is guaranteed to be a valid Roman numeral, this local comparison fully captures the subtractive cases. The solution is `O(n)` time and `O(1)` space.

**VI:** Em map mỗi Roman symbol sang value rồi duyệt trái → phải. Nếu current nhỏ hơn next thì current thuộc subtractive form nên em trừ; ngược lại em cộng. Symbol cuối luôn cộng. Vì input được đảm bảo valid, local comparison này bao phủ đầy đủ subtractive cases. `O(n)` time, `O(1)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1
**Q (EN):** Why does comparing only adjacent symbols work?

**Q (VI):** Vì sao chỉ so sánh hai symbol kề nhau là đủ?

### Short answer (EN)
Valid Roman numerals encode subtraction by placing a smaller symbol immediately before a larger one.

### Trả lời ngắn (VI)
Roman numeral hợp lệ biểu diễn phép trừ bằng cách đặt symbol nhỏ ngay trước symbol lớn.

### Standard answer (EN)
The six subtractive forms are all local pairs such as `IV`, `IX`, `XL`, and `CM`. For any current symbol, if its value is less than the next symbol's value, its contribution is negative; otherwise it contributes positively. No longer-range context is required for valid input.

### Trả lời chuẩn (VI)
Sáu subtractive form đều là cặp cục bộ như `IV`, `IX`, `XL`, `CM`. Nếu current nhỏ hơn next thì contribution âm, ngược lại contribution dương. Valid input không cần context xa hơn.

### Deep answer (EN)
The representation can be viewed as a signed sum where only the left member of a legal subtractive pair receives a negative sign. Validity guarantees that the sign is derivable from one-symbol lookahead.

### Trả lời sâu (VI)
Có thể xem representation là signed sum, trong đó chỉ symbol bên trái của subtractive pair hợp lệ mang dấu âm. Validity đảm bảo dấu này suy ra được bằng one-symbol lookahead.

---

### Q2
**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)
`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)
I scan the string once, and the seven-symbol mapping is constant-size.

### Trả lời chuẩn (VI)
Em quét chuỗi một lần và mapping chỉ có bảy symbol cố định.

---

### Q3
**Q (EN):** Could you scan from right to left instead?

**Q (VI):** Có thể duyệt từ phải sang trái không?

### Short answer (EN)
Yes. Keep the previous value; subtract current when it is smaller than the value to its right, otherwise add it.

### Trả lời ngắn (VI)
Có. Giữ previous value; nếu current nhỏ hơn value bên phải thì trừ, ngược lại cộng.

### Standard answer (EN)
The right-to-left version removes explicit lookahead and uses the same signed-contribution idea. Both are linear and constant-space.

### Trả lời chuẩn (VI)
Bản right-to-left loại explicit lookahead nhưng dùng cùng signed-contribution idea. Cả hai đều tuyến tính và constant-space.

---

### Q4
**Q (EN):** Why don't you validate invalid forms like `IL`?

**Q (VI):** Vì sao không validate dạng sai như `IL`?

### Short answer (EN)
The problem guarantees the input is a valid Roman numeral.

### Trả lời ngắn (VI)
Vì đề đảm bảo input là Roman numeral hợp lệ.

### Standard answer (EN)
Validation is a different problem with additional grammar rules. Adding it here would increase complexity without affecting correctness under the stated contract.

### Trả lời chuẩn (VI)
Validation là bài toán khác với nhiều grammar rule hơn. Thêm vào đây chỉ tăng complexity mà không cần thiết theo contract của đề.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** For each character I convert it to a number. If a next character exists and has a larger value, I subtract the current number; otherwise I add it. A small switch maps the seven legal symbols to values.

**VI:** Với mỗi character em đổi sang number. Nếu có next character và next lớn hơn current thì em trừ current, ngược lại cộng. Một switch nhỏ map bảy symbol hợp lệ.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Không giải thích subtractive rule.
- Dùng nested replacement/string parsing phức tạp không cần thiết.
- Quên xử lý ký hiệu cuối.
- Tự thêm validation ngoài scope rồi tạo bug.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- Roman numeral — số La Mã
- subtractive form — dạng trừ
- symbol mapping — ánh xạ ký hiệu
- lookahead — nhìn trước
- signed contribution — đóng góp có dấu
