# 155. Min Stack — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I keep two synchronized stacks. The first stores the actual values, and the second stores the minimum-so-far at the same depth. On push, I push the value and `min(value, currentMin)`. On pop, I pop both stacks. Then `top()` reads the value stack and `getMin()` reads the min stack, so every operation is `O(1)` with `O(n)` space.

**VI:** Em dùng hai stack đồng bộ: một stack value và một stack minimum-so-far ở cùng depth. Push thì push value và minimum mới, pop thì pop cả hai. Vì vậy `top()` và `getMin()` chỉ cần peek, mọi operation đều `O(1)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1 — Core practice question

**Q (EN):** Why is one normal stack not enough if `getMin()` must be `O(1)`?

**Q (VI):** Vì sao một stack thường chưa đủ nếu `getMin()` phải `O(1)`?

### Short answer (EN)

A normal stack does not remember the minimum, so finding it after arbitrary pushes and pops would require scanning.

### Trả lời ngắn (VI)

Stack thường không lưu minimum, nên muốn tìm min sau nhiều push/pop phải scan.

### Standard answer (EN)

The top operation only exposes one element. Without extra metadata, the minimum could be anywhere below the top, which makes `getMin()` `O(n)`. I store the minimum-so-far at every depth so the answer is always available at the auxiliary stack top.

### Trả lời chuẩn (VI)

Top chỉ cho biết một phần tử, còn minimum có thể ở bất kỳ vị trí nào. Vì vậy em lưu minimum-so-far cho mỗi depth để `getMin()` luôn lấy được ở top của stack phụ.

### Q2 — Core practice question

**Q (EN):** What exactly do you store in the second stack?

**Q (VI):** Stack thứ hai lưu chính xác gì?

### Short answer (EN)

At each depth it stores the minimum of all values up to that depth.

### Trả lời ngắn (VI)

Ở mỗi depth, nó lưu minimum của toàn bộ value từ đáy tới depth đó.

### Standard answer (EN)

When I push a new value, I compare it with the previous minimum and push the smaller one. Therefore each entry is a snapshot of the stack minimum at that exact depth. Popping both stacks restores the previous snapshot automatically.

### Trả lời chuẩn (VI)

Khi push value mới, em so với previous minimum và push giá trị nhỏ hơn. Mỗi entry là snapshot minimum tại đúng depth đó; pop cả hai sẽ rollback về snapshot trước.

---

## 3. Why / correctness questions / Câu hỏi vì sao đúng

### Q3 — Common reasoning check

**Q (EN):** Why does popping both stacks restore the correct previous minimum?

**Q (VI):** Vì sao pop cả hai stack sẽ khôi phục đúng minimum trước đó?

### Short answer (EN)

Because the min stack stores one minimum snapshot for every value-stack depth.

### Trả lời ngắn (VI)

Vì min stack có đúng một snapshot minimum cho mỗi depth của value stack.

### Standard answer (EN)

Before the latest push, the previous min stack top already represented the minimum of the previous state. The push adds one value and one new minimum snapshot. Removing both entries returns both stacks to exactly that earlier state, so the exposed minimum is correct.

### Trả lời chuẩn (VI)

Trước lần push cuối, top của min stack đã là minimum đúng của trạng thái cũ. Push thêm một value và một snapshot; pop cả hai trả hệ thống về đúng trạng thái đó.

### Q4 — Common reasoning check

**Q (EN):** How do duplicate minimum values affect your design?

**Q (VI):** Duplicate minimum ảnh hưởng thiết kế thế nào?

### Short answer (EN)

They are handled naturally because the same minimum is stored at each relevant depth.

### Trả lời ngắn (VI)

Không cần special case vì cùng minimum được lưu lại ở từng depth tương ứng.

### Standard answer (EN)

If the current minimum is `1` and I push another `1`, the new min snapshot is also `1`. Popping one of them removes only one snapshot, and the previous snapshot remains `1`, so the minimum stays correct.

### Trả lời chuẩn (VI)

Nếu min hiện tại là `1` rồi push thêm `1`, snapshot mới vẫn là `1`. Pop một phần tử chỉ bỏ một snapshot, snapshot trước vẫn là `1`, nên min không bị thay đổi sai.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5 — Core practice question

**Q (EN):** What are the complexities of all operations?

**Q (VI):** Complexity của từng operation là gì?

### Short answer (EN)

`push`, `pop`, `top`, and `getMin` are all `O(1)`; total space is `O(n)`.

### Trả lời ngắn (VI)

Tất cả operation đều `O(1)`; space tổng là `O(n)`.

### Standard answer (EN)

Each operation performs only a constant number of deque operations and comparisons. The two stacks together store at most two entries per pushed value, so memory grows linearly with the number of elements.

### Trả lời chuẩn (VI)

Mỗi operation chỉ có số lượng cố định thao tác deque/comparison. Hai stack lưu tối đa hai entry cho mỗi value nên memory là tuyến tính.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q6 — Likely follow-up

**Q (EN):** What happens when the minimum element is popped?

**Q (VI):** Điều gì xảy ra khi pop phần tử minimum?

### Short answer (EN)

The matching min snapshot is popped too, exposing the previous minimum immediately.

### Trả lời ngắn (VI)

Snapshot min cùng depth cũng bị pop, nên previous minimum xuất hiện ngay ở top.

### Standard answer (EN)

There is no need to search for a replacement minimum. The auxiliary stack already contains the minimum of the state below the popped element, so after the synchronized pop `getMin()` remains constant time.

### Trả lời chuẩn (VI)

Không cần tìm replacement min. Min stack đã lưu sẵn minimum của trạng thái bên dưới, nên sau pop đồng bộ `getMin()` vẫn `O(1)`.

### Q7 — Likely follow-up

**Q (EN):** Could integer boundary values break this solution?

**Q (VI):** Giá trị biên integer có làm solution lỗi không?

### Short answer (EN)

No, because the solution only compares integers and does not use arithmetic encoding.

### Trả lời ngắn (VI)

Không, vì solution chỉ compare integer chứ không encode bằng phép cộng/trừ có nguy cơ overflow.

### Standard answer (EN)

`Math.min` and direct storage work for the full signed `int` range. This is one advantage over clever one-stack arithmetic encodings, which require extra overflow care.

### Trả lời chuẩn (VI)

`Math.min` và lưu trực tiếp hoạt động trên toàn miền `int`. Đây là ưu điểm so với arithmetic encoding một stack, vốn cần xử lý overflow cẩn thận.

---

## 6. Alternative-approach and trade-off questions / Hướng khác và trade-off

### Q8 — Likely follow-up

**Q (EN):** Could you store the value and minimum together in one stack?

**Q (VI):** Có thể lưu value và min cùng nhau trong một stack không?

### Short answer (EN)

Yes. Each stack item can store `(value, minSoFar)`; it has the same asymptotic complexity.

### Trả lời ngắn (VI)

Có. Mỗi item có thể lưu `(value, minSoFar)` và complexity không đổi.

### Standard answer (EN)

A pair-per-node stack is conceptually equivalent to the two-stack design. It may improve encapsulation, but in Java it usually needs a custom pair type or small array/object. Two synchronized deques make the invariant very explicit and easy to test.

### Trả lời chuẩn (VI)

Stack pair-per-node tương đương về logic. Trong Java thường cần custom pair/object, còn hai deque làm invariant rõ và code đơn giản hơn.

---

## 7. Code walkthrough questions / Câu hỏi walkthrough code

### Q9 — Code walkthrough

**Q (EN):** Why does `push` store `Math.min(value, mins.peek())`?

**Q (VI):** Vì sao `push` lưu `Math.min(value, mins.peek())`?

### Short answer (EN)

The new stack minimum is either the new value or the previous minimum.

### Trả lời ngắn (VI)

Minimum mới chỉ có thể là value mới hoặc previous minimum.

### Standard answer (EN)

All previous values are summarized by `mins.peek()`. Adding one new value changes the minimum only if that value is smaller. Therefore the exact new minimum is the minimum of those two numbers.

### Trả lời chuẩn (VI)

`mins.peek()` đã tóm tắt min của toàn bộ old values. Thêm một value chỉ thay min nếu value nhỏ hơn, nên min mới chính xác là `min(value, previousMin)`.

---

## 8. Follow-up variations / Biến thể follow-up

- Có thể thiết kế `MaxStack` bằng cùng ý tưởng với maximum-so-far.
- Có thể lưu `(value,min)` trong một stack thay vì hai stack.
- Nếu muốn min stack chỉ lưu khi min thay đổi, phải xử lý duplicate minima bằng `<=` hoặc count.
- Nếu cần persistent stack/rollback nhiều version, snapshot metadata theo node vẫn là ý tưởng cốt lõi.
- Arithmetic encoding có thể giảm số structure nhưng tăng độ phức tạp và risk overflow.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Scan toàn stack trong `getMin()`.
- Chỉ giữ một biến `min` rồi không biết phục hồi khi pop.
- Quên duplicate minima.
- Pop hai stack không đồng bộ.
- Dùng strict `<` trong optimized min-stack variant và làm mất duplicate minimum.
- Đưa ra arithmetic trick nhưng không giải thích overflow.

---

## 10. Useful phrases and vocabulary / Cụm từ hữu ích

- **"I store a minimum snapshot at every depth."** — Em lưu snapshot minimum ở mỗi depth.
- **"The two stacks are updated in lockstep."** — Hai stack được cập nhật đồng bộ.
- **"Popping restores the previous minimum automatically."** — Pop tự động khôi phục previous minimum.
- **"This handles duplicate minima naturally."** — Cách này xử lý duplicate minimum tự nhiên.
- **"Every operation performs a constant number of stack operations."** — Mỗi operation chỉ thực hiện số cố định thao tác stack.
- **auxiliary stack** — stack phụ.
- **minimum snapshot** — snapshot giá trị minimum.
- **lockstep / synchronized** — đồng bộ từng bước.
