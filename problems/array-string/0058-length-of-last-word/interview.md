# 58. Length of Last Word — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I scan the string from right to left. First I skip trailing spaces, then I count consecutive non-space characters until I reach another space or the beginning of the string. That segment is exactly the last word, so the count is the answer. This avoids allocating arrays or substrings and runs in `O(n)` time with `O(1)` extra space.

**VI:** Em quét chuỗi từ phải sang trái. Đầu tiên bỏ trailing spaces, sau đó đếm liên tục các ký tự non-space cho tới khi gặp space hoặc đầu chuỗi. Đoạn đó chính là last word. Cách này không tạo array/substring phụ, chạy `O(n)` time và `O(1)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why do you skip spaces before counting?

**Q (VI):** Vì sao phải skip space trước khi đếm?

### Short answer (EN)

The input may end with spaces, and those spaces are not part of the last word.

### Trả lời ngắn (VI)

Input có thể kết thúc bằng space và chúng không thuộc last word.

### Standard answer (EN)

The problem defines a word as a maximal non-space substring. Trailing spaces lie outside every word, so the first phase moves the pointer to the final character of the actual last word before counting begins.

### Trả lời chuẩn (VI)

Word là maximal non-space substring. Trailing spaces nằm ngoài mọi word, nên phase đầu đưa pointer tới ký tự cuối thật sự của last word trước khi đếm.

---

### Q2

**Q (EN):** Why not use `trim()` and `split()`?

**Q (VI):** Vì sao không dùng `trim()` và `split()`?

### Short answer (EN)

They work, but they allocate extra objects and process more of the string than necessary.

### Trả lời ngắn (VI)

Chúng vẫn đúng nhưng tạo object phụ và xử lý nhiều hơn mức cần thiết.

### Standard answer (EN)

A reverse scan needs only an index and a counter. `trim()` can create a new string and `split()` builds an array of words, so the direct scan is simpler from a space-complexity perspective.

### Trả lời chuẩn (VI)

Reverse scan chỉ cần index và counter. `trim()` có thể tạo string mới, `split()` tạo array words, nên direct scan tốt hơn về auxiliary space.

---

### Q3

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

In the worst case I may scan all characters once, and I store only two integers.

### Trả lời chuẩn (VI)

Worst case em quét toàn chuỗi một lần và chỉ giữ hai số nguyên.

---

### Q4

**Q (EN):** What if the string contains only one word?

**Q (VI):** Nếu chuỗi chỉ có một từ thì sao?

### Short answer (EN)

The second loop reaches index `-1`, and the accumulated count is the full string's word length.

### Trả lời ngắn (VI)

Loop thứ hai chạy tới index `-1` và count chính là độ dài từ duy nhất.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I initialize the pointer at the last character. The first while-loop consumes trailing spaces. The second while-loop increments a length counter for each non-space character in the final word. As soon as it encounters the separator, I return the counter.

**VI:** Em đặt pointer ở ký tự cuối. While đầu bỏ trailing spaces. While thứ hai tăng counter cho mỗi non-space character của từ cuối. Khi gặp separator thì count đã là đáp án.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Bắt đầu đếm ngay từ cuối mà quên trailing spaces.
- Dùng regex split không cần thiết.
- Không guard index khi last word kéo tới đầu string.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- trailing spaces — khoảng trắng cuối chuỗi
- maximal substring — substring cực đại
- reverse scan — quét ngược
- separator — ký tự phân tách
- allocation — cấp phát bộ nhớ
