# 150. Evaluate Reverse Polish Notation — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use an operand stack. Numbers are pushed directly. When I see an operator, I pop the right operand first and the left operand second, evaluate `left op right`, and push the result back. RPN guarantees that the required operands are already available. Java integer division already truncates toward zero. The solution is `O(n)` time and `O(n)` space.

**VI:** Em dùng operand stack. Number thì push; operator thì pop right trước, left sau, tính `left op right` rồi push result. RPN đảm bảo operands đã có sẵn. Java integer division đúng contract truncate toward zero.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1 — Core practice question

**Q (EN):** Why does a stack fit Reverse Polish Notation evaluation?

**Q (VI):** Vì sao stack phù hợp để evaluate RPN?

### Short answer (EN)

An operator consumes the two most recent unresolved expression values.

### Trả lời ngắn (VI)

Operator luôn consume hai expression value gần nhất chưa được dùng.

### Standard answer (EN)

In postfix notation, operands appear before their operator. The most recently completed sub-expressions are exactly the next operands to consume, which is a LIFO relationship. A stack gives direct access to them.

### Trả lời chuẩn (VI)

Trong postfix, operand xuất hiện trước operator. Hai sub-expression hoàn thành gần nhất chính là operands tiếp theo, nên quan hệ LIFO phù hợp với stack.

### Q2 — Core practice question

**Q (EN):** Why do you pop the right operand before the left operand?

**Q (VI):** Vì sao pop right operand trước left operand?

### Short answer (EN)

The right operand was pushed later, so it is on top of the stack.

### Trả lời ngắn (VI)

Right operand được push sau nên nằm ở stack top.

### Standard answer (EN)

For `a b -`, the stack receives `a` and then `b`. Therefore the first pop returns `b`, the right operand, and the second returns `a`, the left operand. This order is essential for non-commutative operators such as subtraction and division.

### Trả lời chuẩn (VI)

Với `a b -`, `a` push trước, `b` push sau. Pop đầu là `b` (right), pop sau là `a` (left). Đảo order sẽ sai với `-` và `/`.

---

## 3. Why / correctness questions / Câu hỏi vì sao đúng

### Q3 — Common reasoning check

**Q (EN):** What invariant does the stack maintain?

**Q (VI):** Stack duy trì invariant gì?

### Short answer (EN)

It stores completed sub-expression values that have not yet been consumed by a later operator.

### Trả lời ngắn (VI)

Nó lưu giá trị các sub-expression đã hoàn thành nhưng chưa được operator sau consume.

### Standard answer (EN)

Every number creates a valid atomic expression, so I push it. Every operator combines the two most recent valid sub-expressions into one new valid expression and replaces them with its value. Therefore the invariant holds after every token.

### Trả lời chuẩn (VI)

Number là atomic expression nên push. Operator combine đúng hai sub-expression gần nhất thành một expression mới rồi thay chúng bằng result, nên invariant luôn giữ đúng.

### Q4 — Common reasoning check

**Q (EN):** Why is the final stack value the whole expression result?

**Q (VI):** Vì sao value cuối cùng trên stack là kết quả toàn expression?

### Short answer (EN)

The input is guaranteed to be one valid RPN expression, so all sub-expressions eventually combine into exactly one result.

### Trả lời ngắn (VI)

Input là một RPN expression hợp lệ nên cuối cùng mọi sub-expression được combine thành đúng một result.

### Standard answer (EN)

Each binary operator reduces the number of unresolved values by one. Valid RPN has exactly enough operators to combine all operands into one expression, so after processing the last token only its value remains.

### Trả lời chuẩn (VI)

Mỗi binary operator giảm số unresolved values đi một. RPN hợp lệ có đủ operators để combine toàn bộ operands thành một expression, nên cuối cùng còn đúng một value.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5 — Core practice question

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(n)` worst-case stack space.

### Trả lời ngắn (VI)

`O(n)` time và `O(n)` stack space ở worst case.

### Standard answer (EN)

Each token causes a constant amount of parsing, stack work, and arithmetic. The stack may temporarily hold a linear number of operands, so the worst-case memory usage is linear.

### Trả lời chuẩn (VI)

Mỗi token chỉ có constant work; stack có thể tạm giữ nhiều operands tuyến tính theo input nên worst-case space là `O(n)`.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q6 — Likely follow-up

**Q (EN):** How do you handle negative numbers such as `"-11"`?

**Q (VI):** Xử lý negative token như `"-11"` thế nào?

### Short answer (EN)

Only the exact string `"-"` is an operator; `"-11"` is parsed as an integer.

### Trả lời ngắn (VI)

Chỉ token chính xác `"-"` là operator; `"-11"` được parse thành integer.

### Standard answer (EN)

I switch on the four exact operator strings. Anything else goes through `Integer.parseInt`, so signed numeric tokens are handled correctly without special cases.

### Trả lời chuẩn (VI)

Em switch đúng bốn operator strings. Các token khác dùng `Integer.parseInt`, vì vậy signed numbers được xử lý tự nhiên.

### Q7 — Likely follow-up

**Q (EN):** Does Java division satisfy the truncation rule?

**Q (VI):** Java division có đúng rule truncation của đề không?

### Short answer (EN)

Yes. Integer division in Java truncates toward zero.

### Trả lời ngắn (VI)

Có. Integer division trong Java truncate toward zero.

### Standard answer (EN)

For example, `6 / -132` evaluates to `0`, and `-7 / 3` evaluates to `-2`. That matches the required semantics, so no floating-point conversion is needed.

### Trả lời chuẩn (VI)

Ví dụ `6 / -132 = 0`, `-7 / 3 = -2`, đúng contract. Không cần convert sang floating point.

---

## 6. Alternative-approach and trade-off questions / Hướng khác và trade-off

### Q8 — Likely follow-up

**Q (EN):** Could you use an integer array instead of `Deque<Integer>`?

**Q (VI):** Có thể dùng `int[]` thay `Deque<Integer>` không?

### Short answer (EN)

Yes. A manual array stack avoids boxing and can be slightly more efficient while keeping the same complexity.

### Trả lời ngắn (VI)

Có. Manual `int[]` stack tránh boxing và có thể nhanh hơn một chút, complexity không đổi.

### Standard answer (EN)

Since the maximum stack size is bounded by `tokens.length`, I could allocate an `int[]` and maintain a top index. In interview code, `ArrayDeque<Integer>` is usually clearer unless optimization is specifically requested.

### Trả lời chuẩn (VI)

Có thể allocate `int[tokens.length]` và giữ top index. Nhưng trong interview, `ArrayDeque<Integer>` thường rõ hơn nếu không yêu cầu micro-optimization.

---

## 7. Code walkthrough questions / Câu hỏi walkthrough code

### Q9 — Code walkthrough

**Q (EN):** What happens to the stack size when processing a binary operator?

**Q (VI):** Stack size thay đổi thế nào khi xử lý binary operator?

### Short answer (EN)

It decreases by one overall: two values are popped and one result is pushed.

### Trả lời ngắn (VI)

Giảm ròng một phần tử: pop hai rồi push một result.

### Standard answer (EN)

That mirrors expression reduction: two operand sub-expressions become one larger sub-expression. It is also why a valid RPN expression eventually leaves one value.

### Trả lời chuẩn (VI)

Điều này phản ánh expression reduction: hai sub-expression trở thành một sub-expression lớn hơn, và cuối cùng expression hợp lệ còn một result.

---

## 8. Follow-up variations / Biến thể follow-up

- Hỗ trợ unary operators cần biết arity của từng operator.
- Hỗ trợ exponentiation chỉ cần thêm operator nhưng phải giữ đúng operand order.
- Nếu input không đảm bảo hợp lệ, cần check stack size trước operator và final size.
- Có thể evaluate prefix notation bằng scan từ phải sang trái với stack.
- Manual primitive stack tránh boxing nếu performance quan trọng.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Đảo operands với subtraction/division.
- Nhầm signed number thành operator.
- Dùng floating-point division không cần thiết.
- Quên push intermediate result.
- Không biết Java integer division truncate toward zero.
- Dùng recursive parser phức tạp hơn yêu cầu.

---

## 10. Useful phrases and vocabulary / Cụm từ hữu ích

- **"RPN places each operator after its operands."** — RPN đặt operator sau operands.
- **"I keep unresolved expression values on a stack."** — Em giữ các expression values chưa được consume trên stack.
- **"The first pop is the right operand."** — Pop đầu tiên là right operand.
- **"I reduce two operands to one intermediate result."** — Em reduce hai operands thành một intermediate result.
- **"Java integer division truncates toward zero."** — Java integer division truncate toward zero.
- **postfix notation** — ký pháp hậu tố.
- **binary operator** — toán tử hai ngôi.
- **expression reduction** — rút gọn biểu thức.
