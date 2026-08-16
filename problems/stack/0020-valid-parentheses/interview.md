# 20. Valid Parentheses — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use a stack because closing brackets must match the most recent unmatched opening bracket. For each opening bracket, I push the closing bracket I expect. For each closing bracket, I check whether it matches the stack top. Any mismatch or empty stack fails immediately, and the final stack must be empty. This is `O(n)` time and `O(n)` space.

**VI:** Em dùng stack vì closing bracket phải match opening bracket gần nhất chưa đóng. Gặp opening bracket thì em push closing bracket tương ứng cần gặp; gặp closing bracket thì so với top. Mismatch hoặc stack rỗng thì false ngay, cuối cùng stack phải rỗng.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1 — Core practice question

**Q (EN):** Why is a stack the right data structure for this problem?

**Q (VI):** Vì sao stack phù hợp với bài này?

### Short answer (EN)

Because brackets must close in reverse order of opening, which is LIFO.

### Trả lời ngắn (VI)

Vì bracket phải đóng theo thứ tự ngược với lúc mở, đúng với LIFO.

### Standard answer (EN)

The most recently opened unmatched bracket must be closed first. A stack gives constant-time access to exactly that bracket through its top element, so the data structure mirrors the nesting rule directly.

### Trả lời chuẩn (VI)

Opening bracket gần nhất chưa match phải được đóng trước. Stack cho truy cập đúng phần tử đó ở top, nên mô hình hóa nesting rule trực tiếp.

### Q2 — Core practice question

**Q (EN):** Why do you push the expected closing bracket instead of the opening bracket?

**Q (VI):** Vì sao push expected closing bracket thay vì opening bracket?

### Short answer (EN)

It makes the closing-bracket check a direct comparison with the stack top.

### Trả lời ngắn (VI)

Nó giúp kiểm tra closing bracket bằng một phép so trực tiếp với top.

### Standard answer (EN)

Both designs are correct. By pushing `')'`, `']'`, or `'}'` immediately when I see the corresponding opener, the stack stores exactly what must appear next to close each nesting level. That removes the need for a reverse mapping when a closer arrives.

### Trả lời chuẩn (VI)

Cả hai cách đều đúng. Push expected closer giúp stack lưu trực tiếp ký tự cần xuất hiện để đóng từng nesting level, nên không cần map ngược khi gặp closing bracket.

---

## 3. Why / correctness questions / Câu hỏi vì sao đúng

### Q3 — Common reasoning check

**Q (EN):** Why can you return false immediately on a mismatch?

**Q (VI):** Vì sao có thể return false ngay khi mismatch?

### Short answer (EN)

A future character cannot change the required closing bracket for the current top nesting level.

### Trả lời ngắn (VI)

Ký tự tương lai không thể sửa expected closer của nesting level hiện tại.

### Standard answer (EN)

The stack top represents the only bracket that is legally allowed to close next. If the current closer has another type, the order is already invalid. Since the offending character has already appeared, no suffix can repair that prefix.

### Trả lời chuẩn (VI)

Stack top là bracket duy nhất được phép đóng ở thời điểm đó. Nếu current closer khác type thì prefix đã sai thứ tự và suffix phía sau không thể sửa lỗi đã xảy ra.

### Q4 — Common reasoning check

**Q (EN):** Why must the stack be empty after processing the whole string?

**Q (VI):** Vì sao cuối chuỗi stack phải rỗng?

### Short answer (EN)

Any remaining stack entry represents an opening bracket that was never closed.

### Trả lời ngắn (VI)

Mỗi entry còn lại tương ứng một opening bracket chưa được đóng.

### Standard answer (EN)

During the scan, every valid closer removes exactly one expected closer from the stack. If entries remain at the end, there are unmatched opening brackets, so the string violates the requirement that every opener must be closed.

### Trả lời chuẩn (VI)

Mỗi closer hợp lệ pop đúng một expected closer. Nếu cuối cùng vẫn còn phần tử, tồn tại opening bracket chưa match nên chuỗi không hợp lệ.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5 — Core practice question

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(n)` space in the worst case.

### Trả lời ngắn (VI)

`O(n)` time và `O(n)` space ở worst case.

### Standard answer (EN)

Each character is processed once, and each bracket is pushed and popped at most once, so runtime is linear. If the string begins with many opening brackets, the stack can grow to `n`, giving linear worst-case space.

### Trả lời chuẩn (VI)

Mỗi character được xử lý một lần, mỗi bracket push/pop tối đa một lần. Nếu có nhiều opening bracket liên tiếp thì stack có thể tăng tới `n` phần tử.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q6 — Likely follow-up

**Q (EN):** What happens if the first character is a closing bracket?

**Q (VI):** Nếu ký tự đầu tiên là closing bracket thì sao?

### Short answer (EN)

The stack is empty, so the string is immediately invalid.

### Trả lời ngắn (VI)

Stack đang rỗng nên chuỗi invalid ngay.

### Standard answer (EN)

A closing bracket needs a corresponding earlier opener. At position zero there cannot be one, and the empty-stack check catches that without attempting an invalid pop.

### Trả lời chuẩn (VI)

Closing bracket cần opener xuất hiện trước. Ở vị trí đầu tiên điều đó bất khả thi; empty-stack check phát hiện lỗi và tránh pop trên stack rỗng.

### Q7 — Likely follow-up

**Q (EN):** Why is counting each bracket type not enough?

**Q (VI):** Vì sao chỉ đếm số lượng từng loại bracket là chưa đủ?

### Short answer (EN)

Counts do not capture nesting order.

### Trả lời ngắn (VI)

Count không thể hiện thứ tự nesting.

### Standard answer (EN)

For example, `([)]` has matching counts for each bracket type, but the order is invalid because `)` tries to close `(` while `[` is still the most recent unmatched opener. A stack captures this structural constraint.

### Trả lời chuẩn (VI)

Ví dụ `([)]` có count các loại cân bằng nhưng thứ tự sai: `)` xuất hiện khi `[` vẫn là opener gần nhất chưa đóng. Stack mới kiểm tra được constraint cấu trúc này.

---

## 6. Alternative-approach and trade-off questions / Hướng khác và trade-off

### Q8 — Likely follow-up

**Q (EN):** Could you repeatedly remove `()`, `[]`, and `{}` from the string?

**Q (VI):** Có thể liên tục xóa `()`, `[]`, `{}` khỏi chuỗi không?

### Short answer (EN)

Yes, but repeated string rebuilding can make it quadratic, while the stack solution is linear.

### Trả lời ngắn (VI)

Có, nhưng repeated replacement có thể thành `O(n^2)`, trong khi stack là `O(n)`.

### Standard answer (EN)

That method eventually reduces a valid string to empty, but each replacement may scan or rebuild much of the string. It is less efficient and less explicit about the nesting invariant than the one-pass stack approach.

### Trả lời chuẩn (VI)

Cách đó đúng về ý tưởng nhưng mỗi lần replace có thể scan/rebuild chuỗi lớn, vừa kém hiệu quả vừa khó diễn đạt invariant hơn stack one-pass.

---

## 7. Code walkthrough questions / Câu hỏi walkthrough code

### Q9 — Code walkthrough

**Q (EN):** Why do you check `stack.isEmpty()` before calling `pop()`?

**Q (VI):** Vì sao phải check `stack.isEmpty()` trước `pop()`?

### Short answer (EN)

An unmatched closing bracket would otherwise cause an exception.

### Trả lời ngắn (VI)

Closing bracket thừa sẽ khiến `pop()` trên stack rỗng gây exception.

### Standard answer (EN)

An empty stack means there is no unmatched opener available for the current closer, which is logically invalid. Checking first both expresses that condition and prevents `NoSuchElementException` from `ArrayDeque.pop()`.

### Trả lời chuẩn (VI)

Stack rỗng đồng nghĩa không có opener để match current closer. Check trước vừa phản ánh đúng logic vừa tránh exception từ `ArrayDeque.pop()`.

---

## 8. Follow-up variations / Biến thể follow-up

- Nếu string có ký tự khác bracket, quyết định bỏ qua hay reject tùy contract mới.
- Nếu cần trả về index lỗi đầu tiên, return vị trí khi mismatch hoặc lưu vị trí opener trong stack.
- Nếu cần validate tag names như HTML, stack có thể lưu string/tag thay vì `char`.
- Nếu chỉ có một loại bracket `()`, counter có thể đủ; với nhiều loại và nesting thì stack cần thiết.
- Nếu cần streaming validation, thuật toán stack vẫn hoạt động theo từng character chunk.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Chỉ so count mà bỏ qua nesting order.
- Pop stack trước khi check empty.
- Quên final empty-stack check.
- Dùng FIFO queue.
- Viết mapping opener/closer rườm rà và dễ đảo chiều.
- Nói space `O(1)` dù stack có thể chứa toàn bộ prefix opening brackets.

---

## 10. Useful phrases and vocabulary / Cụm từ hữu ích

- **"The nesting rule is naturally LIFO."** — Quy tắc nesting tự nhiên là LIFO.
- **"The stack top represents the most recent unmatched opening bracket."** — Stack top đại diện opening bracket gần nhất chưa match.
- **"I push the closing bracket I expect to see later."** — Em push closing bracket mà em mong đợi gặp sau đó.
- **"A mismatch makes the current prefix irreparably invalid."** — Mismatch làm prefix hiện tại sai và không thể sửa bằng suffix.
- **"The stack must be empty at the end."** — Stack phải rỗng ở cuối.
- **delimiter matching** — ghép cặp dấu phân cách.
- **balanced brackets** — dấu ngoặc cân bằng.
- **unmatched opener / closer** — ngoặc mở / đóng chưa ghép cặp.
