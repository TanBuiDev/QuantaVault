# 219. Contains Duplicate II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I scan left to right and store the most recent index of every value. When I see a value again, I compare the current index with its latest previous index. If the distance is at most `k`, I return true. Keeping only the latest occurrence is sufficient because every older occurrence is even farther away from all future positions.

**VI:** Em scan trái→phải và lưu latest index của từng value. Khi gặp lại, em check `i-previous <= k`. Chỉ cần latest occurrence vì mọi occurrence cũ hơn đều xa future positions hơn.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why can you discard older indices for the same value?

**Q (VI):** Vì sao có thể bỏ các index cũ hơn của cùng value?

### Short answer (EN)

The latest occurrence always gives the smallest distance to any future index.

### Trả lời ngắn (VI)

Occurrence gần nhất luôn cho khoảng cách nhỏ nhất tới mọi future index.

### Standard answer (EN)

If the latest previous occurrence is already more than `k` positions away, every older occurrence is even farther and cannot satisfy the constraint. Therefore older indices are dominated by the latest one.

### Trả lời chuẩn (VI)

Nếu latest previous occurrence đã xa hơn `k`, mọi occurrence cũ hơn còn xa hơn nên không thể thỏa. Latest index dominates các index cũ.

### Q2

**Q (EN):** What happens when `k` is zero?

**Q (VI):** Khi `k=0` thì sao?

### Short answer (EN)

The answer is always false because distinct indices cannot have distance zero.

### Trả lời ngắn (VI)

Luôn false vì hai index khác nhau không thể có distance bằng `0`.

### Standard answer (EN)

The generic algorithm handles this automatically: for distinct current and previous indices, `i-previous` is at least one, so it can never be at most zero.

### Trả lời chuẩn (VI)

Algorithm tự xử lý: hai distinct indices luôn có `i-previous >= 1`, nên không thể `<=0`.

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(n)` expected time and `O(n)` space.

### Trả lời ngắn (VI)

Expected `O(n)` time và `O(n)` space.

### Standard answer (EN)

Each index performs one hash lookup and update. In the worst input shape, the map stores all distinct values.

### Trả lời chuẩn (VI)

Mỗi index có một hash lookup/update; worst case map lưu mọi distinct value.

### Q4

**Q (EN):** Could you use a sliding-window set?

**Q (VI):** Có thể dùng sliding-window set không?

### Short answer (EN)

Yes; keep only values from the previous `k` indices and detect whether the current value is already present.

### Trả lời ngắn (VI)

Có; giữ set của tối đa `k` index gần nhất và check current value đã tồn tại chưa.

### Standard answer (EN)

That version directly models the distance constraint and can reduce storage to `O(min(n,k))`. The last-index map is also simple and makes the dominance argument explicit.

### Trả lời chuẩn (VI)

Sliding-window set model trực tiếp distance và space `O(min(n,k))`; last-index map cũng đơn giản và proof dominance rõ.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Detect duplicate but ignore `k`.
- Keep the first occurrence rather than the latest.
- Overcomplicate the distance with absolute values during a forward scan.
- Forget the distinct-index requirement.
