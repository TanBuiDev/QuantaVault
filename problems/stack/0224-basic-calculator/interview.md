# 224. Basic Calculator — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I scan once with a running result, current number, and sign. `+` or `-` commits the current number. On `(` I save the outer result and sign on a stack and start a fresh inner expression. On `)` I finish the inner result and combine it as `outerResult + outerSign * innerResult`. This also handles unary minus such as `-(2+3)`. The solution is `O(n)` time with `O(n)` stack space for nesting.

**VI:** Em scan một lần với `result`, `number`, `sign`. Gặp `+/-` thì commit number. `(` lưu outer result/sign rồi reset inner context; `)` ghép `outerResult + outerSign * innerResult`. Cách này xử lý cả unary minus.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1 — Core practice question

**Q (EN):** Why don't you need a full operator-precedence algorithm here?

**Q (VI):** Vì sao không cần full operator-precedence algorithm?

### Short answer (EN)

The expression only contains `+` and `-`, which have the same precedence; parentheses are the only nesting concern.

### Trả lời ngắn (VI)

Expression chỉ có `+/-` cùng precedence; chỉ parentheses cần xử lý context.

### Standard answer (EN)

Outside parentheses, evaluation can proceed left to right because addition and subtraction share precedence. The stack is only needed to suspend and later restore the outer context when entering nested parentheses.

### Trả lời chuẩn (VI)

Ngoài parentheses có thể tính left-to-right vì `+/-` cùng precedence. Stack chỉ cần để lưu/restore outer context khi đi vào nested parentheses.

### Q2 — Core practice question

**Q (EN):** What state do you save when you see an opening parenthesis?

**Q (VI):** Khi gặp `(` bạn lưu state nào?

### Short answer (EN)

I save the outer running result and the sign that applies to the parenthesized expression.

### Trả lời ngắn (VI)

Em lưu outer running result và sign áp dụng cho whole parenthesized expression.

### Standard answer (EN)

The inner expression can be evaluated independently from zero, but when it finishes I need to know both what result came before it and whether the whole inner value should be added or subtracted. Those are exactly the two values stored on the stack.

### Trả lời chuẩn (VI)

Inner expression có thể evaluate độc lập từ `0`, nhưng khi kết thúc cần biết outer result trước đó và inner result được cộng hay trừ. Vì vậy cần lưu đúng hai state này.

---

## 3. Why / correctness questions / Câu hỏi vì sao đúng

### Q3 — Common reasoning check

**Q (EN):** How does your method handle unary minus before parentheses?

**Q (VI):** Cách này xử lý unary minus trước parentheses thế nào?

### Short answer (EN)

The `-` sets `sign = -1`, and that sign is saved when `(` is entered, so the complete inner result is negated when `)` closes.

### Trả lời ngắn (VI)

`-` đặt `sign=-1`; khi gặp `(` sign này được lưu, nên lúc `)` toàn inner result được nhân `-1`.

### Standard answer (EN)

For `-(2+3)`, there is no number before the opening parenthesis to commit, but the minus updates the pending sign. The parenthesis stores that `-1`. The inner expression evaluates to `5`, and closing the parenthesis combines it as `0 + (-1) * 5`.

### Trả lời chuẩn (VI)

Với `-(2+3)`, dấu `-` trở thành pending sign. `(` lưu `-1`, inner result là `5`, rồi `)` combine thành `0 + (-1)*5`.

### Q4 — Common reasoning check

**Q (EN):** What invariant do `result`, `number`, and `sign` maintain?

**Q (VI):** `result`, `number`, `sign` duy trì invariant gì?

### Short answer (EN)

`result` is the sum of committed terms in the current level, `number` is the uncommitted numeric token, and `sign` is its pending coefficient.

### Trả lời ngắn (VI)

`result` là tổng các term đã commit, `number` là number chưa commit, `sign` là hệ số đang chờ áp dụng.

### Standard answer (EN)

Every operator boundary commits exactly one pending numeric term into the current-level result. Parentheses temporarily replace the current level with a new context and then collapse the completed inner value back into one term of the outer level.

### Trả lời chuẩn (VI)

Mỗi operator boundary commit đúng một pending term. Parentheses tạm chuyển sang context mới, sau đó collapse inner result thành một term của outer level.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5 — Core practice question

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(n)` worst-case space for deeply nested parentheses.

### Trả lời ngắn (VI)

`O(n)` time và `O(n)` worst-case space do nesting stack.

### Standard answer (EN)

Each character is processed once with constant work. Every opening parenthesis pushes two integers and every closing parenthesis pops them. The maximum stack size is proportional to nesting depth, which can be linear in the input length.

### Trả lời chuẩn (VI)

Mỗi character xử lý một lần. Mỗi `(` push hai integer, mỗi `)` pop hai; nesting depth có thể tuyến tính nên worst-case space `O(n)`.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q6 — Likely follow-up

**Q (EN):** Why do you need to commit the final number after the loop?

**Q (VI):** Vì sao phải commit final number sau loop?

### Short answer (EN)

A number at the end has no following operator to trigger the normal commit step.

### Trả lời ngắn (VI)

Number cuối expression không có operator phía sau để trigger commit.

### Standard answer (EN)

Digits are accumulated lazily. If the expression ends immediately after a number, that value is still sitting in `number`, so returning `result + sign * number` performs the final required commit.

### Trả lời chuẩn (VI)

Digits được tích lũy lazy. Nếu expression kết thúc ngay sau number thì value vẫn nằm ở `number`, nên return phải cộng `sign * number` lần cuối.

### Q7 — Likely follow-up

**Q (EN):** What happens with spaces?

**Q (VI):** Space được xử lý thế nào?

### Short answer (EN)

They are ignored because they do not affect tokens or operators.

### Trả lời ngắn (VI)

Bỏ qua vì space không thay đổi token/operator semantics.

### Standard answer (EN)

The input grammar treats spaces only as formatting. Since the code has explicit branches for digits, operators, and parentheses, doing nothing for spaces preserves all parser state correctly.

### Trả lời chuẩn (VI)

Space chỉ là formatting. Không thay state cho space là đủ để parser giữ đúng semantics.

---

## 6. Alternative-approach and trade-off questions / Hướng khác và trade-off

### Q8 — Likely follow-up

**Q (EN):** Could you solve this with recursion?

**Q (VI):** Có thể giải bằng recursion không?

### Short answer (EN)

Yes. A recursive parser can evaluate one parenthesis level per call, but an explicit stack avoids recursion depth concerns.

### Trả lời ngắn (VI)

Có. Recursive parser có thể xử lý một parenthesis level mỗi call, nhưng explicit stack tránh recursion-depth issue.

### Standard answer (EN)

Recursive descent maps nicely to nested grammar and can be elegant. However, with input length up to hundreds of thousands, an iterative stack solution is safer against deep nesting and is still linear.

### Trả lời chuẩn (VI)

Recursive descent rất tự nhiên với nesting, nhưng input dài có thể gây deep call stack. Iterative stack an toàn hơn và vẫn `O(n)`.

---

## 7. Code walkthrough questions / Câu hỏi walkthrough code

### Q9 — Code walkthrough

**Q (EN):** Why do you push the previous result before the sign?

**Q (VI):** Vì sao push previous result trước sign?

### Short answer (EN)

So the sign is on top and can be popped first when closing the parenthesis, matching the combine formula.

### Trả lời ngắn (VI)

Để sign nằm trên top và được pop trước khi combine inner result.

### Standard answer (EN)

The close-parenthesis logic needs `outerSign` first to multiply the inner result, then `outerResult` to add afterward. The push order `result` then `sign` makes those values appear in exactly that pop order.

### Trả lời chuẩn (VI)

Logic `)` cần outerSign trước rồi outerResult. Push `result` rồi `sign` tạo đúng pop order đó.

---

## 8. Follow-up variations / Biến thể follow-up

- Thêm `*` và `/` sẽ cần xử lý precedence hoặc grammar nhiều tầng.
- Có thể dùng recursive descent thay explicit stack.
- Nếu expression không đảm bảo hợp lệ, cần validation parentheses/operator/number states.
- Có thể tokenize trước nhưng tốn thêm memory.
- Với Basic Calculator II không parentheses nhưng có `* /`, state design khác.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Quên unary minus.
- Quên final number commit.
- Không lưu sign trước `(`.
- Pop stack sai order.
- Không reset `number` sau commit.
- Dùng `eval` hoặc library parser trái yêu cầu.
- Dùng recursion mà không nói về deep nesting.

---

## 10. Useful phrases and vocabulary / Cụm từ hữu ích

- **"I keep a running result for the current parenthesis level."** — Em giữ running result cho current parenthesis level.
- **"The sign is a pending coefficient for the next term."** — Sign là pending coefficient cho term tiếp theo.
- **"An opening parenthesis saves the outer context."** — `(` lưu outer context.
- **"A closing parenthesis collapses the inner expression into one outer term."** — `)` collapse inner expression thành một outer term.
- **"The parser runs in one pass."** — Parser chạy one-pass.
- **unary operator** — toán tử một ngôi.
- **parser state** — trạng thái parser.
- **outer / inner context** — context ngoài / trong.
