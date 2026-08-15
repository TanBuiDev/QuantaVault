# 12. Integer to Roman — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I create a descending table of Roman values and symbols, including the six subtractive forms such as `900 -> CM` and `4 -> IV`. Then I greedily append the largest symbol whose value does not exceed the remaining number and subtract that value. Because the table contains every canonical Roman building block in descending order, the greedy decomposition directly produces the standard representation.

**VI:** Em tạo bảng value/symbol giảm dần, bao gồm cả sáu subtractive forms như `900 -> CM`, `4 -> IV`. Sau đó em greedy append symbol lớn nhất không vượt phần số còn lại và trừ value đó. Vì bảng chứa mọi building block canonical theo thứ tự giảm dần, decomposition tạo trực tiếp Roman representation chuẩn.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1
**Q (EN):** Why does greedy work here?

**Q (VI):** Vì sao greedy đúng?

### Short answer (EN)
The ordered table contains every legal canonical token, so taking the largest usable token matches Roman numeral construction from highest place values to lowest.

### Trả lời ngắn (VI)
Bảng chứa mọi canonical token hợp lệ nên lấy token lớn nhất tương ứng đúng cách xây Roman từ giá trị cao xuống thấp.

### Standard answer (EN)
Roman notation for this range is defined by descending decimal-place contributions, with special subtractive tokens for values beginning with 4 or 9. Once those tokens are explicitly present, no smaller token can give a better canonical prefix than the largest usable token.

### Trả lời chuẩn (VI)
Roman notation trong range này được tạo bởi các contribution giảm dần, với subtractive token cho trường hợp 4/9. Khi các token đó đã có trong bảng, không token nhỏ hơn nào tạo prefix canonical tốt hơn token lớn nhất đang dùng được.

### Deep answer (EN)
The important detail is not generic coin-change greediness; it is that this specific token system was chosen to encode the Roman numeral grammar. Greedy would be wrong with only the seven base symbols because `4` would become `IIII`.

### Trả lời sâu (VI)
Điểm quan trọng không phải mọi coin system đều greedy được; chính token set này đã encode Roman grammar. Nếu chỉ có bảy base symbol, greedy sẽ sai canonical vì `4` thành `IIII`.

---

### Q2
**Q (EN):** Why include `CM`, `CD`, `XC`, `XL`, `IX`, and `IV` directly?

**Q (VI):** Vì sao đưa các subtractive pair trực tiếp vào bảng?

### Short answer (EN)
They turn special grammar cases into ordinary greedy tokens.

### Trả lời ngắn (VI)
Chúng biến các grammar case đặc biệt thành token greedy bình thường.

### Standard answer (EN)
Without them I would need separate logic for every decimal place that starts with 4 or 9. Including them makes the main loop uniform and less error-prone.

### Trả lời chuẩn (VI)
Nếu không có chúng phải viết logic riêng cho 4/9 ở mỗi decimal place. Đưa vào bảng giúp main loop đồng nhất và ít bug.

---

### Q3
**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
Under the fixed `1..3999` constraint, time and auxiliary space are both `O(1)` excluding output.

### Trả lời ngắn (VI)
Với range cố định `1..3999`, time và auxiliary space đều `O(1)` ngoài output.

### Standard answer (EN)
The lookup table has 13 entries and the maximum output length is bounded by the input range. More generally the work is proportional to the output length.

### Trả lời chuẩn (VI)
Bảng có 13 entry và output length bị bound bởi range. Tổng quát hơn work tỷ lệ với output length.

---

### Q4
**Q (EN):** What alternative would you consider?

**Q (VI):** Có hướng nào khác?

### Short answer (EN)
Use four lookup arrays for thousands, hundreds, tens, and ones.

### Trả lời ngắn (VI)
Dùng lookup theo hàng nghìn, trăm, chục và đơn vị.

### Standard answer (EN)
A place-value lookup solution is arguably even more explicit for the bounded range. The greedy table is attractive because one ordered representation handles all places with one loop.

### Trả lời chuẩn (VI)
Lookup theo place value rất rõ cho range cố định; greedy table có ưu điểm một bảng và một loop xử lý toàn bộ.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I scan 13 value-symbol pairs from largest to smallest. While the current value fits into the remaining number, I append its symbol and subtract the value. When the remainder reaches zero the builder is the answer.

**VI:** Em duyệt 13 cặp value-symbol từ lớn xuống nhỏ. Khi value hiện tại còn fit trong remainder, em append symbol và trừ value. Khi remainder về zero thì builder là đáp án.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Nói “greedy always works” mà không giải thích token set Roman đặc biệt.
- Quên một subtractive pair.
- Đặt token không theo descending order.
- Báo `O(n)` mà không nói rõ `n` là gì trong input scalar bị bounded.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- subtractive form — dạng trừ
- ordered lookup table — bảng tra có thứ tự
- greedy decomposition — phân rã tham lam
- canonical representation — biểu diễn chuẩn
- remainder — phần còn lại
