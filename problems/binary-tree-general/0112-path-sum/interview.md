# 112. Path Sum — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I run DFS while carrying the remaining target. For an internal node I subtract its value and recurse into both children. At a leaf I return true only if the remaining target equals that leaf's value. Every node is visited at most once, so the solution is `O(n)` time with `O(h)` recursion space.

**VI:** Em DFS với target còn lại; tại internal node trừ value rồi recurse xuống hai child, còn tại leaf chỉ trả true nếu target còn lại bằng leaf value.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why carry the remaining target instead of a running sum?

**Q (VI):** Vì sao dùng remaining target thay vì running sum?

### Short answer (EN)

Both work; the remaining target makes the leaf condition especially direct.

### Trả lời ngắn (VI)

Cả hai đều đúng; remaining target làm leaf condition trực tiếp hơn.

### Standard answer (EN)

At each node I remove its contribution from the target. Then the child receives exactly the sum that its root-to-leaf suffix must produce. At a leaf the check becomes a simple equality with the leaf value.

### Trả lời chuẩn (VI)

Mỗi node loại contribution của mình khỏi target; child nhận đúng tổng mà suffix path cần tạo, và tại leaf chỉ cần so sánh equality.

### Q2

**Q (EN):** Why must the matching node be a leaf?

**Q (VI):** Vì sao node làm tổng đạt target phải là leaf?

### Short answer (EN)

Because the problem asks specifically for a root-to-leaf path.

### Trả lời ngắn (VI)

Vì đề yêu cầu path từ root tới leaf.

### Standard answer (EN)

A prefix ending at an internal node is not a complete candidate path, even if its sum already equals the target. The path is valid only when it terminates at a node with no children.

### Trả lời chuẩn (VI)

Prefix kết thúc ở internal node chưa phải candidate path hoàn chỉnh dù tổng đã đúng; path chỉ hợp lệ khi kết thúc tại node không có child.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** Why is checking both subtrees sufficient?

**Q (VI):** Vì sao chỉ cần kiểm tra hai subtree là đủ?

### Short answer (EN)

Every root-to-leaf path continues through exactly one of the two children.

### Trả lời ngắn (VI)

Mọi root-to-leaf path tiếp tục qua đúng một trong hai child.

### Standard answer (EN)

After accounting for the current node's value, any valid continuation must lie entirely in either the left or the right subtree. Taking the logical OR therefore covers every possible path and accepts if at least one reaches a matching leaf.

### Trả lời chuẩn (VI)

Sau khi trừ current value, continuation hợp lệ nằm hoàn toàn ở left hoặc right subtree; OR hai kết quả bao phủ mọi path có thể có.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(h)` recursion space.

### Trả lời ngắn (VI)

`O(n)` time và `O(h)` recursion space.

### Standard answer (EN)

In the worst case no early successful path exists, so each node is visited once. The recursive call stack contains at most one root-to-current path, whose length is the tree height `h`.

### Trả lời chuẩn (VI)

Worst case phải thăm mọi node một lần; call stack giữ tối đa một root-to-current path nên dùng `O(h)` space.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** Which edge case catches the most common false positive?

**Q (VI):** Edge case nào bắt false positive phổ biến nhất?

### Short answer (EN)

Use an internal node whose root-prefix sum equals the target but that node still has a child.

### Trả lời ngắn (VI)

Dùng internal node mà root-prefix sum bằng target nhưng node đó vẫn còn child.

### Standard answer (EN)

For example, root `1` with child `2` and target `1` must return false. A solution that checks the sum before checking the leaf condition will incorrectly return true at the root.

### Trả lời chuẩn (VI)

Ví dụ root `1` có child `2`, target `1` phải trả false; code check sum trước leaf condition sẽ sai ngay tại root.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Nhầm root-to-any-node với root-to-leaf.
- Dùng pruning dựa trên `sum > target` dù node có thể âm.
- Quên empty tree.
- Nói space `O(1)` nhưng dùng recursion.

## 7. Useful vocabulary / Từ vựng hữu ích

- **root-to-leaf path** — đường đi từ root tới leaf.
- **remaining target** — target còn lại.
- **leaf condition** — điều kiện leaf.
- **path prefix** — prefix của path.
