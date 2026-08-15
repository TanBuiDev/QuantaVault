# 14. Longest Common Prefix — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I use the first string as a reference and scan character positions from left to right. For each position I compare the reference character with the same position in every other string. If a string ends or a character differs, the common prefix must stop immediately before that position, so I return the matching prefix. If the first string finishes without a mismatch, it is the common prefix. The algorithm uses constant extra state and only scans characters that can belong to the prefix.

**VI:** Em dùng string đầu làm reference và quét từng vị trí từ trái sang phải. Với mỗi vị trí, em so character reference với cùng vị trí ở mọi string khác. Nếu một string hết hoặc character khác, common prefix phải dừng ngay trước vị trí đó. Nếu reference kết thúc mà chưa mismatch, toàn bộ reference là common prefix. Thuật toán chỉ dùng constant extra state.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is the first mismatch enough to stop?

**Q (VI):** Vì sao mismatch đầu tiên là đủ để dừng?

### Short answer (EN)

A prefix must be contiguous from index zero, so once one position differs, no longer prefix can be common.

### Trả lời ngắn (VI)

Prefix phải liên tục từ index `0`, nên chỉ cần một vị trí khác là mọi prefix dài hơn đều không thể chung.

### Standard answer (EN)

All positions before `i` have already been verified across every string. If any string lacks position `i` or has a different character there, every prefix of length greater than `i` would include that invalid position. Therefore length `i` is maximal.

### Trả lời chuẩn (VI)

Mọi vị trí trước `i` đã được xác nhận chung. Nếu một string không có vị trí `i` hoặc khác character, mọi prefix dài hơn `i` đều phải chứa vị trí sai đó. Vì vậy length `i` là maximum.

### Deep answer (EN)

The predicate “all strings share the first k characters” is monotone: once it becomes false for some `k`, it stays false for every larger `k`. Vertical scanning finds the first failing boundary directly.

### Trả lời sâu (VI)

Predicate “mọi string chung `k` character đầu” là monotone: một khi false tại `k`, mọi `k` lớn hơn cũng false. Vertical scan tìm đúng boundary đầu tiên đó.

---

### Q2

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

Time is proportional to the characters compared, and extra space is `O(1)`.

### Trả lời ngắn (VI)

Time tỷ lệ với số character được so sánh và extra space là `O(1)`.

### Standard answer (EN)

In the worst case I compare each character of the shortest relevant prefix against every string, so a common notation is `O(S)` where `S` is the total number of characters examined. I store only loop variables and a reference.

### Trả lời chuẩn (VI)

Worst case em so mọi character của common prefix tiềm năng trên tất cả strings; có thể ký hiệu `O(S)` với `S` là tổng số character được kiểm tra. Chỉ dùng vài biến.

---

### Q3

**Q (EN):** What other approaches could you use?

**Q (VI):** Có những hướng nào khác?

### Short answer (EN)

Horizontal prefix shrinking, sorting and comparing the first/last strings, or a Trie.

### Trả lời ngắn (VI)

Có thể shrink prefix theo chiều ngang, sort rồi so first/last, hoặc dùng Trie.

### Standard answer (EN)

For one query I prefer vertical scanning because it avoids sorting and extra structures. A Trie becomes more attractive when the same collection is reused for many prefix-related operations.

### Trả lời chuẩn (VI)

Với một query em ưu tiên vertical scan vì không sort và không cần structure phụ. Trie đáng cân nhắc hơn khi collection được reuse cho nhiều prefix operations.

---

### Q4

**Q (EN):** Why check the string length before `charAt(i)`?

**Q (VI):** Vì sao phải kiểm tra length trước `charAt(i)`?

### Short answer (EN)

A shorter string may end before the reference, and reading past its end would be invalid; that end also terminates the common prefix.

### Trả lời ngắn (VI)

String ngắn hơn có thể hết trước reference; đọc vượt biên sẽ lỗi và chính điểm kết thúc đó cũng chấm dứt common prefix.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your implementation?

**Q (VI):** Bạn có thể giải thích implementation không?

**EN:** I iterate over positions in the first string. At each position I store the expected character and scan all other strings. If one is too short or has a different character, I return the reference substring before that position. If all positions of the first string survive, I return the first string itself.

**VI:** Em duyệt từng position của string đầu. Mỗi position lấy expected character rồi quét các string còn lại. Nếu một string quá ngắn hoặc character khác, em trả substring trước position đó. Nếu toàn bộ first string đều match, trả chính first string.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Không xử lý empty string.
- Gọi `charAt` trước length check.
- Nói sort là `O(n)`.
- Dùng Trie mà không giải thích vì sao overhead đáng giá.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- common prefix — tiền tố chung
- vertical scan — quét theo cột
- reference string — chuỗi tham chiếu
- first mismatch — vị trí khác đầu tiên
- monotone predicate — mệnh đề đơn điệu
- early exit — dừng sớm
