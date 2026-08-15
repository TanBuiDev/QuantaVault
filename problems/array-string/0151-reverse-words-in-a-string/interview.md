# 151. Reverse Words in a String — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I scan the input from right to left because the last input word must become the first output word. I skip spaces, identify one word boundary, append that word to a `StringBuilder`, and insert exactly one space only between output words. This naturally removes leading, trailing, and repeated spaces. In Java the input `String` is immutable, so the builder is the practical linear-time solution; the in-place follow-up applies to mutable character buffers.

**VI:** Em scan từ phải sang trái vì word cuối input phải thành word đầu output. Em skip spaces, xác định boundary một word, append word vào `StringBuilder`, và chỉ thêm đúng một space giữa các output words. Cách này tự loại leading/trailing/repeated spaces. Trong Java `String` immutable nên builder là lựa chọn thực tế; follow-up in-place phù hợp mutable char buffer.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** How do you guarantee exactly one space between words?

**Q (VI):** Làm sao đảm bảo đúng một space giữa các word?

### Short answer (EN)

I ignore all input spaces and add one separator only before each output word after the first.

### Trả lời ngắn (VI)

Em bỏ qua toàn bộ input spaces và chỉ thêm một separator trước mỗi output word sau word đầu.

### Standard answer (EN)

Spaces are treated only as delimiters, never copied. The builder owns output formatting, so `result.length() > 0` is the only condition for adding one space before the next word. That simultaneously prevents leading and trailing spaces.

### Trả lời chuẩn (VI)

Spaces chỉ được dùng làm delimiter, không copy. Builder tự định dạng output; chỉ khi đã có word trước đó mới thêm một space trước word kế tiếp. Điều đó cũng tránh leading/trailing spaces.

### Deep answer (EN)

Separating parsing from formatting is the key invariant: input delimiter multiplicity has no effect on output delimiter multiplicity. We extract semantic tokens and reconstruct the canonical spacing independently.

### Trả lời sâu (VI)

Điểm cốt lõi là tách parsing khỏi formatting: số lượng delimiter trong input không ảnh hưởng số delimiter output. Ta lấy semantic tokens rồi dựng spacing canonical độc lập.

---

### Q2

**Q (EN):** Why not use `split`?

**Q (VI):** Vì sao không dùng `split`?

### Short answer (EN)

It works, but creates an array and often regex/intermediate allocations that are unnecessary.

### Trả lời ngắn (VI)

Nó đúng nhưng tạo array và nhiều allocation trung gian không cần thiết.

### Standard answer (EN)

A reverse scan already visits the words in output order and needs no temporary collection of all tokens. It also makes the spacing rule explicit instead of relying on regex cleanup.

### Trả lời chuẩn (VI)

Reverse scan gặp words đúng theo output order nên không cần collection tạm. Nó cũng làm spacing rule rõ ràng thay vì phụ thuộc regex cleanup.

---

### Q3

**Q (EN):** Can you meet the in-place follow-up in Java?

**Q (VI):** Có thể đạt follow-up in-place trong Java không?

### Short answer (EN)

Not on an immutable `String`; with a mutable `char[]`, yes.

### Trả lời ngắn (VI)

Không trực tiếp trên immutable `String`; với mutable `char[]` thì có.

### Standard answer (EN)

For a mutable buffer I would first compact spaces, reverse the entire normalized buffer, and then reverse each word to restore its character order. That uses constant extra working memory.

### Trả lời chuẩn (VI)

Với mutable buffer em sẽ compact spaces, reverse toàn buffer đã normalize, rồi reverse từng word để khôi phục character order. Working memory là constant.

---

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(n)` space for the required output; `O(1)` additional working state beyond it.

### Trả lời ngắn (VI)

`O(n)` time, `O(n)` cho output; working state ngoài output là `O(1)`.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I place an index at the end of the string. I skip spaces, mark the end of a word, move left until the word starts, append a separator if needed, and append exactly that word range. I repeat until the index passes the beginning.

**VI:** Em đặt index ở cuối string, skip spaces, đánh dấu end của word, đi trái tới đầu word, thêm separator nếu cần rồi append đúng range đó. Lặp tới khi qua đầu chuỗi.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Nhầm reverse word order với reverse characters.
- Không normalize repeated spaces.
- Claim `O(1)` total space trong Java dù phải tạo returned String.
- Không phân biệt immutable `String` với mutable buffer follow-up.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- reverse word order — đảo thứ tự từ
- leading/trailing spaces — khoảng trắng đầu/cuối
- collapse spaces — rút nhiều space thành một
- token boundary — biên token
- immutable string — chuỗi bất biến
- mutable buffer — bộ đệm có thể sửa
