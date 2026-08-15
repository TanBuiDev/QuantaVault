# 76. Minimum Window Substring — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I use a variable-size sliding window with frequency counts. `need` stores the required multiplicity of each character, and `window` stores the current counts. I also track how many distinct required characters currently satisfy their quota. Once all quotas are satisfied, I shrink from the left as much as possible while updating the best window. Both pointers only move forward, so the algorithm is `O(m+n)`.

**VI:** Em dùng variable-size sliding window với frequency counts. `need` lưu multiplicity cần thiết, `window` lưu current counts, và em track số distinct character đã đạt quota. Khi mọi quota đều đủ, em shrink left tối đa trong lúc update best. Hai pointer chỉ tiến nên `O(m+n)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is a set not enough?

**Q (VI):** Vì sao set không đủ?

### Short answer (EN)

`t` may contain duplicates, so the window must satisfy character multiplicities, not just membership.

### Trả lời ngắn (VI)

`t` có thể có duplicate nên window phải thỏa multiplicity, không chỉ membership.

### Standard answer (EN)

For example, if `t="AABC"`, a window containing one `A`, one `B`, and one `C` has every distinct character but is still invalid. Frequency counts represent that requirement correctly.

### Trả lời chuẩn (VI)

Ví dụ `t="AABC"`, window có một `A`, một `B`, một `C` vẫn thiếu một `A`. Frequency mới biểu diễn đúng requirement.

### Q2

**Q (EN):** What does `formed` represent?

**Q (VI):** `formed` biểu diễn điều gì?

### Short answer (EN)

It is the number of distinct required characters whose current count meets the required count.

### Trả lời ngắn (VI)

Đó là số distinct required character hiện đã đạt quota.

### Deep answer (EN)

`formed` compresses an expensive full-frequency validity check into an `O(1)` condition. It changes only at threshold crossings: when a count reaches its required value or falls below it.

### Trả lời sâu (VI)

`formed` nén việc check toàn bộ frequency thành điều kiện `O(1)`. Nó chỉ đổi tại threshold: lúc count vừa đạt quota hoặc vừa tụt dưới quota.

### Q3

**Q (EN):** Why do you keep shrinking after finding a valid window?

**Q (VI):** Vì sao phải tiếp tục shrink sau khi đã valid?

**EN:** The problem asks for the minimum window. A valid window may contain unnecessary characters at the left, so I keep removing them until the next removal would violate a requirement.

**VI:** Bài cần minimum window. Valid window có thể có character thừa bên trái nên phải shrink tới sát ranh giới invalid.

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Complexity là gì?

### Short answer (EN)

`O(m+n)` time and `O(1)` extra space for the fixed English-letter alphabet.

### Trả lời ngắn (VI)

`O(m+n)` time và `O(1)` extra space với alphabet cố định.

### Standard answer (EN)

Building the requirement takes `O(n)`. During the scan, right advances `m` times and left advances at most `m` times total, so the sliding phase is `O(m)`, not quadratic.

### Trả lời chuẩn (VI)

Build requirement `O(n)`. Right đi `m` lần, left tổng cộng tối đa `m` lần nên sliding phase `O(m)`, không phải quadratic.

---

## 3. Likely follow-up / Câu hỏi mở rộng

**Q (EN):** What if the character set were arbitrary Unicode?

**Q (VI):** Nếu character set là Unicode tùy ý thì sao?

**EN:** I would replace the fixed arrays with hash maps keyed by character/code point. The algorithm remains linear in the string lengths, with space proportional to the number of distinct relevant characters.

**VI:** Em thay arrays bằng hash maps theo character/code point. Algorithm vẫn linear, space theo số distinct relevant characters.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I build the required counts from `t`, expand the right boundary, and update the count for each incoming character. When a required count is exactly met, I increment `formed`. While all requirements are satisfied, I update the best range and remove the left character; if its count falls below the requirement, I decrement `formed` and resume expanding.

**VI:** Em build `need`, expand right và update incoming count. Khi một required count vừa đạt quota thì tăng `formed`. Khi mọi requirement đủ, em update best range rồi remove left; nếu count tụt dưới quota thì giảm `formed` và quay lại expand.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Dùng distinct-character count thay cho multiplicity.
- Re-scan toàn bộ frequency table mỗi iteration.
- Nghĩ nested shrink loop là `O(m²)`.
- Quên case không có answer.
- Không lưu best start/best length riêng.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- minimum window — cửa sổ nhỏ nhất
- multiplicity — số lần xuất hiện cần thiết
- frequency requirement — yêu cầu tần suất
- satisfy a quota — đạt hạn mức
- threshold crossing — vượt/ngắt ngưỡng
- shrink the window — thu hẹp cửa sổ
