# 28. Find the Index of the First Occurrence in a String — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I use KMP for worst-case linear substring search. I preprocess the needle into an LPS array describing the longest prefix that is also a suffix for each pattern prefix. During the search, after a mismatch I fall back to the next viable prefix length instead of moving the haystack pointer backwards. When the matched length reaches the needle length, I return the start index. The complexity is `O(n+m)` time and `O(m)` space.

**VI:** Em dùng KMP để substring search tuyến tính worst-case. Em preprocess `needle` thành LPS mô tả longest prefix đồng thời là suffix của từng prefix pattern. Khi mismatch, em fallback về prefix length khả thi tiếp theo thay vì lùi haystack pointer. Khi matched length bằng needle length thì trả start index. `O(n+m)` time, `O(m)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** What information does the LPS array store?

**Q (VI):** LPS lưu thông tin gì?

### Short answer (EN)

For each pattern prefix, it stores the longest proper prefix that is also a suffix.

### Trả lời ngắn (VI)

Với mỗi prefix của pattern, nó lưu longest proper prefix đồng thời là suffix.

### Standard answer (EN)

If I have already matched `j` pattern characters and then fail, `lps[j-1]` tells me the largest shorter prefix that is still consistent with the suffix of the text segment just matched. That is the next possible match state.

### Trả lời chuẩn (VI)

Nếu đã match `j` characters rồi fail, `lps[j-1]` cho prefix ngắn hơn lớn nhất vẫn khớp với suffix của text segment vừa match. Đó là state khả thi tiếp theo.

### Deep answer (EN)

LPS encodes the border lattice of the pattern. A mismatch eliminates the current border length; following LPS links walks to smaller borders without reconsidering text characters, which is why the algorithm remains linear.

### Trả lời sâu (VI)

LPS encode các border của pattern. Mismatch loại border hiện tại; đi theo LPS links chuyển tới border nhỏ hơn mà không đọc lại text characters, giúp algorithm tuyến tính.

---

### Q2

**Q (EN):** Why doesn't KMP move the haystack pointer backwards?

**Q (VI):** Vì sao KMP không lùi pointer của haystack?

### Short answer (EN)

The matched suffix information already tells us which pattern prefix could still align with the current text position.

### Trả lời ngắn (VI)

Thông tin suffix đã match cho biết pattern prefix nào vẫn có thể align, nên không cần đọc lại text.

### Standard answer (EN)

Every character before the current text position has already been incorporated into the match state. Falling back `j` changes only the interpretation of that suffix against the pattern; the text itself does not need to be revisited.

### Trả lời chuẩn (VI)

Mọi character trước current text position đã nằm trong match state. Fallback `j` chỉ đổi cách hiểu suffix đó so với pattern; text không cần được đọc lại.

---

### Q3

**Q (EN):** Is KMP necessary for this Easy problem?

**Q (VI):** KMP có bắt buộc cho bài Easy này không?

### Short answer (EN)

No. A naive scan is simpler and often acceptable; KMP gives a stronger worst-case guarantee.

### Trả lời ngắn (VI)

Không. Naive scan đơn giản hơn và thường đủ; KMP cho worst-case guarantee mạnh hơn.

### Standard answer (EN)

I would mention the straightforward `O(nm)` solution first if interview time is limited, then optimize to KMP if the interviewer asks for linear matching or wants to discuss repeated-pattern worst cases.

### Trả lời chuẩn (VI)

Nếu thời gian interview hạn chế, em sẽ nêu `O(nm)` trước rồi optimize sang KMP khi interviewer yêu cầu linear matching hoặc hỏi worst case pattern lặp.

---

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n+m)` time and `O(m)` extra space.

### Trả lời ngắn (VI)

`O(n+m)` thời gian và `O(m)` bộ nhớ phụ.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the mismatch handling?

**Q (VI):** Bạn có thể giải thích xử lý mismatch không?

**EN:** While the current text character differs and some pattern prefix is matched, I replace `j` with `lps[j-1]`. I keep doing that until the current text character can extend a smaller prefix or `j` becomes zero. Then a match increments `j`; a full pattern match returns the start index.

**VI:** Khi current text character khác và `j>0`, em đặt `j=lps[j-1]`, lặp tới khi character có thể nối một prefix nhỏ hơn hoặc `j=0`. Nếu match thì tăng `j`; khi match đủ pattern thì trả start index.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Thuộc công thức LPS nhưng không giải thích border/prefix-suffix.
- Lùi cả text pointer và pattern pointer, mất linear guarantee.
- Claim KMP `O(1)` space dù có LPS array.
- Không nêu naive solution/trade-off cho bài đơn giản.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- substring search — tìm chuỗi con
- occurrence — lần xuất hiện
- longest proper prefix — tiền tố riêng dài nhất
- suffix — hậu tố
- border — prefix đồng thời là suffix
- fallback — lùi trạng thái pattern
- failure function — hàm thất bại
