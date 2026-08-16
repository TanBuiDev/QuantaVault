# 30. Substring with Concatenation of All Words — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** All words have the same length, so I scan the string in token-sized steps. I run one sliding window for each possible offset modulo the word length. Inside each window I track word frequencies. Unknown words reset the window; an overrepresented word makes me shrink from the left; and when the window contains exactly the required number of words with no excess frequency, I record its start index.

**VI:** Vì mọi word cùng độ dài, em scan theo token-sized steps. Em chạy một window cho mỗi offset modulo word length, track frequency. Unknown word thì reset, word vượt quota thì shrink, và khi window có đúng số word cần thiết với frequency hợp lệ thì ghi start index.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why do you need multiple offsets?

**Q (VI):** Vì sao cần nhiều offset?

### Short answer (EN)

A valid substring can start at any index, while each token scan only visits indices with one remainder modulo the word length.

### Trả lời ngắn (VI)

Valid substring có thể start ở bất kỳ index nào, còn một token scan chỉ đi qua một lớp modulo word length.

### Standard answer (EN)

If word length is three, a scan from zero only sees token boundaries `0,3,6,...`; it cannot represent a candidate starting at `1` or `2`. Running offsets `0,1,2` partitions all possible starts without overlap in token alignment.

### Trả lời chuẩn (VI)

Nếu word length bằng `3`, scan từ `0` chỉ thấy `0,3,6,...`, không thể biểu diễn candidate start ở `1` hay `2`. Chạy đủ offsets phủ toàn bộ starts.

### Q2

**Q (EN):** Why is a set not enough?

**Q (VI):** Vì sao set không đủ?

**EN:** The input may contain duplicate words. I need exact multiplicities, so both the required data and the current window must use frequency maps.

**VI:** Input có thể có duplicate word. Cần exact multiplicity nên phải dùng frequency map.

### Q3

**Q (EN):** Why does `count == words.length` imply an exact match?

**Q (VI):** Vì sao `count == words.length` nghĩa là match chính xác?

### Standard answer (EN)

Before checking count, I guarantee every window token belongs to `need` and no token frequency exceeds its required frequency. If the total token count also equals the total required count, every frequency must match; otherwise some missing frequency would force another frequency to exceed its quota.

### Trả lời chuẩn (VI)

Trước khi check count, mọi token đều thuộc `need` và không frequency nào vượt quota. Nếu total token count bằng total required count thì mọi frequency buộc phải khớp; nếu thiếu một loại thì phải có loại khác vượt quota, trái invariant.

### Q4

**Q (EN):** What is the complexity?

**Q (VI):** Complexity là gì?

**EN:** Each token enters and leaves a window at most once per alignment. Counting token operations is linear in the string length; in Java, substring creation costs up to `O(wordLength)`, so a conservative bound is `O(n * wordLength)` time and `O(distinct words)` map space.

**VI:** Mỗi token vào/ra window tối đa một lần trong alignment. Nếu tính Java substring copy thì bound bảo thủ là `O(n * wordLength)`, space `O(distinct words)`.

---

## 3. Likely follow-up / Câu hỏi mở rộng

**Q (EN):** Could you avoid creating many substring objects?

**Q (VI):** Có thể tránh tạo nhiều substring object không?

**EN:** Yes, with rolling hashes or encoded word IDs and direct character comparisons. That reduces allocation pressure but increases implementation complexity; I would first present the frequency-map solution unless profiling requires the optimization.

**VI:** Có thể dùng rolling hash hoặc encode word thành ID để giảm allocation, nhưng code phức tạp hơn. Interview thường nên bắt đầu bằng frequency-map solution rõ ràng.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Quên duplicate words.
- Quên offsets khác `0`.
- Reset frequency nhưng quên reset token count.
- Shrink theo character thay vì theo `wordLength`.
- Nói complexity `O(n)` tuyệt đối mà không nhắc chi phí substring trong Java khi interviewer hỏi sâu.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- concatenation — phép nối chuỗi
- permutation — hoán vị
- token alignment — căn chỉnh theo token
- frequency quota — hạn mức tần suất
- overrepresented — xuất hiện quá số lần cần
- reset the window — đặt lại cửa sổ
