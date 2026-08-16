# 101. Symmetric Tree — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I compare the root's left and right subtrees as mirrors. For two mirror nodes, both null is valid, one null is invalid, and otherwise their values must match while the outer children and inner children recursively mirror each other. This is `O(n)` time and `O(h)` recursion space.

**VI:** Em so hai subtree như ảnh gương: value phải bằng nhau, outer child so với outer child phía đối diện và inner child cũng vậy. Time `O(n)`, stack `O(h)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** How is mirror comparison different from Same Tree comparison?

**Q (VI):** Mirror comparison khác Same Tree ở đâu?

### Short answer (EN)

Same Tree pairs left with left and right with right; mirror comparison crosses the directions.

### Trả lời ngắn (VI)

Same Tree so cùng hướng; mirror thì so chéo hướng.

### Standard answer (EN)

For symmetry, the left subtree's outer child must match the right subtree's outer child, so `left.left` pairs with `right.right`. Likewise, `left.right` pairs with `right.left`. That crossing is the defining difference.

### Trả lời chuẩn (VI)

Symmetry cần `left.left` khớp `right.right` và `left.right` khớp `right.left`; đây là điểm khác cốt lõi so với Same Tree.

### Q2

**Q (EN):** What are the null base cases?

**Q (VI):** Base case với null là gì?

### Short answer (EN)

Both null is true; exactly one null is false.

### Trả lời ngắn (VI)

Cả hai null → true; chỉ một null → false.

### Standard answer (EN)

A mirror position must either be absent on both sides or present on both sides. These checks validate structure before comparing values.

### Trả lời chuẩn (VI)

Vị trí mirror phải cùng vắng mặt hoặc cùng tồn tại; null checks xác nhận structure trước khi so value.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** Why are the two crossed recursive calls sufficient?

**Q (VI):** Vì sao hai recursive call chéo là đủ?

### Short answer (EN)

They cover every descendant position under the exact mirror mapping.

### Trả lời ngắn (VI)

Chúng bao phủ toàn bộ descendant theo đúng ánh xạ mirror.

### Standard answer (EN)

Once the current values match, a binary subtree pair is mirrored exactly when its outer descendants mirror and its inner descendants mirror. Applying the same condition recursively checks the entire structure and all values.

### Trả lời chuẩn (VI)

Khi current values bằng nhau, chỉ còn hai cặp outer/inner subtree cần mirror; recursion kiểm tra toàn bộ structure/value phía dưới.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(h)` recursion-stack space.

### Trả lời ngắn (VI)

`O(n)` time, `O(h)` recursion stack.

### Standard answer (EN)

Each node participates in at most one mirror comparison. Recursive depth follows a root-to-leaf path, so the stack is bounded by tree height.

### Trả lời chuẩn (VI)

Mỗi node được so tối đa một lần; stack sâu tối đa bằng height của tree.

---

## 5. Follow-up / Iterative

### Q5

**Q (EN):** How would you solve the iterative follow-up?

**Q (VI):** Giải follow-up iterative thế nào?

### Short answer (EN)

Use a queue of node pairs in mirror order.

### Trả lời ngắn (VI)

Dùng queue chứa các cặp node theo mirror order.

### Standard answer (EN)

Start with the root's two children. Pop two nodes at a time, apply the same null/value checks, then enqueue `left.left` with `right.right` and `left.right` with `right.left`. The queue explicitly replaces the recursive call stack.

### Trả lời chuẩn (VI)

Bắt đầu với hai child của root, pop theo cặp, kiểm tra null/value rồi enqueue hai cặp outer và inner. Queue thay cho recursion.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Dùng Same Tree pairing thay vì mirror pairing.
- Bỏ qua null structure.
- Chỉ check một cặp child.
- Nói recursive space là `O(1)`.

## 7. Useful vocabulary / Từ vựng hữu ích

- **mirror of itself** — ảnh gương của chính nó.
- **outer children / inner children** — các child phía ngoài / phía trong.
- **mirror pair** — cặp node đối xứng.
- **symmetric around its center** — đối xứng qua tâm.
