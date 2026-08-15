# 68. Text Justification — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I process one line at a time. First I greedily pack the maximum number of words that fit, counting the mandatory single spaces between them. Then I format that fixed group. For a normal line, I compute the total spaces, divide by the number of gaps, and distribute the remainder one extra space at a time from the left. The last line and one-word lines are left-justified and padded at the end. This directly mirrors the specification and runs proportional to the output size.

**VI:** Em xử lý từng line. Đầu tiên greedy pack nhiều words nhất có thể, tính cả minimum single spaces. Sau khi group cố định, em format: normal line chia total spaces cho số gaps và phát remainder từ trái; last line và single-word line căn trái rồi pad cuối. Cách này bám trực tiếp specification và time tỷ lệ output size.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** How do you know whether another word fits on the current line?

**Q (VI):** Làm sao biết word tiếp theo có fit không?

### Short answer (EN)

Add its length plus the minimum number of one-space gaps required between all selected words and compare with `maxWidth`.

### Trả lời ngắn (VI)

Cộng length của word mới và số gap tối thiểu cần một space, rồi so với `maxWidth`.

### Standard answer (EN)

If the selected words currently have total character length `L` and adding the next word would create `g` gaps, the minimum line length is `L + next.length + g`. I include the word exactly when that value is at most `maxWidth`.

### Trả lời chuẩn (VI)

Nếu selected words có tổng character `L` và thêm word mới tạo `g` gaps, minimum line length là `L + next.length + g`. Chỉ khi giá trị đó `<= maxWidth` mới thêm word.

### Deep answer (EN)

Packing and justification must be separated. At packing time only the minimum one-space separator matters; extra justification spaces are flexible slack that should not prevent a word from fitting.

### Trả lời sâu (VI)

Packing phải tách khỏi justification. Khi chọn words chỉ minimum one-space separators là bắt buộc; extra justification spaces là slack linh hoạt và không được làm sai quyết định fit.

---

### Q2

**Q (EN):** How do you distribute spaces evenly?

**Q (VI):** Phân phối spaces đều như thế nào?

### Short answer (EN)

Use quotient and remainder: every gap gets `totalSpaces / gaps`, and the first `totalSpaces % gaps` gaps get one extra.

### Trả lời ngắn (VI)

Dùng quotient/remainder: mỗi gap nhận `totalSpaces/gaps`, và `totalSpaces%gaps` gap đầu nhận thêm một.

### Standard answer (EN)

Euclidean division guarantees gap sizes differ by at most one. Assigning the remainder to the earliest gaps exactly implements the rule that left gaps receive more spaces when the division is uneven.

### Trả lời chuẩn (VI)

Phép chia Euclid đảm bảo các gap chênh tối đa một. Phát remainder cho gap sớm nhất đúng rule bên trái nhận nhiều hơn khi không chia hết.

---

### Q3

**Q (EN):** Why are one-word lines special?

**Q (VI):** Vì sao line một word là case đặc biệt?

### Short answer (EN)

There are zero gaps, so all remaining spaces must be trailing padding.

### Trả lời ngắn (VI)

Không có gap nào để chia, nên mọi space còn lại phải pad ở cuối.

### Standard answer (EN)

Trying the normal distribution formula would divide by zero. Semantically, a single word is left-justified, matching the same rendering path as the last line.

### Trả lời chuẩn (VI)

Normal formula sẽ chia zero. Về semantics, single-word line được căn trái giống last line.

---

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

Time is linear in the number of output characters; temporary working space is `O(maxWidth)` per line excluding the returned list.

### Trả lời ngắn (VI)

Time tuyến tính theo số output characters; working space tạm `O(maxWidth)` mỗi line ngoài result list.

### Standard answer (EN)

Each word is consumed once, and every character or padding space written to the result must physically be produced, so `O(number of lines * maxWidth)` is output-optimal.

### Trả lời chuẩn (VI)

Mỗi word được consume một lần và mọi character/padding trong result đều bắt buộc phải tạo, nên `O(lines * maxWidth)` là output-optimal.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** What changes for right justification?

**Q (VI):** Nếu cần right-justify thì sao?

**EN:** The packing boundary stays the same; only the rendering policy changes. I would place all flexible padding before the first word while preserving required separators.

**VI:** Packing boundary không đổi, chỉ rendering policy đổi: flexible padding được đặt trước first word.

### Follow-up 2

**Q (EN):** Why not build a huge grid first?

**Q (VI):** Vì sao không dựng grid trước?

**EN:** The line boundaries and exact spaces can be emitted directly. A grid would store presentation state that is immediately flattened and would add unnecessary memory and complexity.

**VI:** Boundary và spaces có thể emit trực tiếp. Grid chỉ lưu presentation state rồi lại flatten, gây thêm memory/complexity.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through one normal line?

**Q (VI):** Bạn có thể giải thích một normal line không?

**EN:** I first find `j`, the exclusive index of the first word that does not fit. I know the sum of selected word lengths and the number of gaps. I compute the total spaces needed to reach `maxWidth`, derive base and extra spaces, append each word, and after each gap append `base` plus one if that gap is among the leftmost `extra` gaps.

**VI:** Em tìm `j` là exclusive index của word đầu tiên không fit. Em biết tổng word lengths và số gaps, tính total spaces để đạt `maxWidth`, chia thành base/extra, append từng word và sau mỗi gap thêm `base` cộng một nếu gap đó nằm trong `extra` gap bên trái.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Trộn packing với distribution và tính fit sai.
- Quên last-line rule.
- Chia spaces cho số words thay vì gaps.
- Không xử lý `gaps == 0`.
- Distribution đúng tổng nhưng remainder đặt sai phía.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- full justification — căn đều hai lề
- left-justified — căn trái
- greedy packing — xếp tham lam
- gap — khoảng giữa hai từ
- padding — phần đệm
- quotient / remainder — thương / số dư
- distribute evenly — phân bố đều
