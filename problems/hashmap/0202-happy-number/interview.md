# 202. Happy Number — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I model the digit-square transformation as a deterministic next function. The sequence either reaches the fixed point one or eventually enters another cycle. Instead of storing visited values, I use Floyd's slow and fast pointers. They must meet inside the eventual cycle; if the meeting value is one, the number is happy, otherwise it is not. This uses constant extra space.

**VI:** Em xem digit-square transform như deterministic next function. Sequence hoặc tới fixed point `1`, hoặc vào cycle khác. Thay vì lưu visited set, em dùng Floyd slow/fast pointers; khi chúng gặp nhau, nếu meeting value là `1` thì happy, ngược lại không happy. Extra space `O(1)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why must a non-happy sequence eventually cycle?

**Q (VI):** Vì sao sequence không happy cuối cùng phải cycle?

### Short answer (EN)

After one transformation, integer inputs fall into a small finite range, so an infinite sequence must repeat a state.

### Trả lời ngắn (VI)

Sau một transformation, giá trị rơi vào tập hữu hạn nhỏ; sequence vô hạn bắt buộc lặp state.

### Standard answer (EN)

A 32-bit integer has at most ten digits, so the next value is at most `10*81=810`. From then on, only finitely many states are possible. If one is never reached, some other state repeats and deterministic transitions create a cycle.

### Trả lời chuẩn (VI)

32-bit integer có tối đa 10 chữ số nên next value tối đa `810`. Từ đó chỉ còn hữu hạn states; nếu không tới `1`, một state khác phải lặp và deterministic transition tạo cycle.

### Q2

**Q (EN):** Why use Floyd instead of a hash set?

**Q (VI):** Vì sao dùng Floyd thay vì HashSet?

### Short answer (EN)

Both detect repetition, but Floyd uses `O(1)` extra space.

### Trả lời ngắn (VI)

Cả hai đều detect repeat, nhưng Floyd dùng `O(1)` extra space.

### Standard answer (EN)

A visited set is simpler conceptually but stores every state seen. Floyd exploits the deterministic successor relation: once the sequence enters a cycle, a pointer moving twice as fast must eventually meet the slower one inside it.

### Trả lời chuẩn (VI)

Visited set lưu mọi state. Floyd tận dụng successor deterministic: khi vào cycle, fast pointer cuối cùng sẽ bắt kịp slow pointer trong cycle.

### Q3

**Q (EN):** Why does meeting at one prove happiness?

**Q (VI):** Vì sao gặp ở `1` chứng minh happy?

### Short answer (EN)

One is a fixed point because its next value is also one.

### Trả lời ngắn (VI)

`1` là fixed point vì `next(1)=1`.

### Standard answer (EN)

If the sequence reaches one, every later state remains one. Therefore the eventual cycle is exactly the one-node cycle `{1}`, and Floyd's meeting value is one.

### Trả lời chuẩn (VI)

Khi sequence tới `1`, mọi state sau vẫn `1`; eventual cycle chính là `{1}` nên Floyd gặp tại `1`.

### Q4

**Q (EN):** What are the space and time costs?

**Q (VI):** Chi phí time/space là gì?

### Short answer (EN)

Constant extra space; time is proportional to the number of transformations times the digits processed per transformation.

### Trả lời ngắn (VI)

Extra space constant; time theo số transformations nhân số digits cần xử lý mỗi bước.

### Standard answer (EN)

For 32-bit input, transformed values quickly become bounded below 811, so the number of possible states is bounded as well. Each transformation scans the current digits.

### Trả lời chuẩn (VI)

Với 32-bit input, transformed value nhanh chóng bị bounded dưới 811 nên số state khả dĩ cũng bounded; mỗi transform scan digits hiện tại.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Forget cycle detection.
- Claim every sequence simply decreases; it does not.
- Compute `(sum of digits)^2` instead of `sum of digit squares`.
- Use a set but claim `O(1)` space.
