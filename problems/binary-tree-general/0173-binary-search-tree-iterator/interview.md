# 173. Binary Search Tree Iterator — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I keep a stack containing the left spine of the unvisited portion of the BST. The top is always the next inorder node. `next()` pops it and pushes the left spine of its right subtree; `hasNext()` checks whether the stack is non-empty. Each node is pushed and popped once, so `next()` is amortized `O(1)` with `O(h)` memory.

**VI:** Em giữ left spine chưa thăm trong stack; top luôn là inorder node kế tiếp. `next()` pop rồi push left spine của right subtree, nên amortized `O(1)` và `O(h)` memory.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why is the top of the stack always the next inorder node?

**Q (VI):** Vì sao top của stack luôn là inorder node kế tiếp?

### Short answer (EN)

Because all remaining left descendants have already been pushed above their ancestors.

### Trả lời ngắn (VI)

Vì mọi left descendant chưa thăm đều được push phía trên ancestor của chúng.

### Standard answer (EN)

The helper descends as far left as possible. Therefore the top has no unvisited left descendant. Its ancestors remain below it for later, exactly matching inorder's left-root-right order.

### Trả lời chuẩn (VI)

Helper đi hết sang trái nên top không còn left descendant chưa thăm; ancestors nằm dưới chờ tới lượt, đúng thứ tự left-root-right.

### Q2

**Q (EN):** Why is `next()` amortized `O(1)` even though one call may push many nodes?

**Q (VI):** Vì sao `next()` amortized `O(1)` dù một lần có thể push nhiều node?

### Short answer (EN)

Across the whole iteration, every node is pushed and popped at most once.

### Trả lời ngắn (VI)

Trong toàn bộ iteration, mỗi node chỉ được push và pop tối đa một lần.

### Standard answer (EN)

For `n` returned elements there are at most `n` pushes and `n` pops, so the total stack work is `O(n)`. Dividing that work across `n` calls yields amortized `O(1)` per `next()`.

### Trả lời chuẩn (VI)

Với `n` phần tử có tối đa `n` push và `n` pop, tổng work `O(n)` nên amortized mỗi `next()` là `O(1)`.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What happens after returning a node that has a right subtree?

**Q (VI):** Sau khi trả một node có right subtree thì làm gì?

### Short answer (EN)

Push that right subtree's left spine so its smallest unvisited node becomes the new top.

### Trả lời ngắn (VI)

Push left spine của right subtree để node nhỏ nhất chưa thăm trở thành top mới.

### Standard answer (EN)

In inorder, after a node comes its right subtree, beginning with that subtree's leftmost node. Pushing the left spine exposes exactly that node while retaining the required ancestors below it.

### Trả lời chuẩn (VI)

Trong inorder, sau node là right subtree bắt đầu từ leftmost node; push left spine đưa đúng node đó lên top.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What memory does the iterator retain?

**Q (VI):** Iterator giữ bao nhiêu memory?

### Short answer (EN)

At most one root-to-current path, so `O(h)`.

### Trả lời ngắn (VI)

Tối đa một root-to-current path, nên `O(h)`.

### Standard answer (EN)

The stack contains ancestors along a descent path rather than all nodes. Its maximum size is bounded by the BST height `h`.

### Trả lời chuẩn (VI)

Stack chỉ chứa ancestors trên một descent path, không chứa toàn bộ node; kích thước tối đa bằng height `h`.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** Which shapes stress the stack size?

**Q (VI):** Tree shape nào làm stack lớn nhất?

### Short answer (EN)

A left-skewed BST can make the initial stack size `O(h) = O(n)`.

### Trả lời ngắn (VI)

BST lệch trái có thể khiến initial stack `O(h) = O(n)`.

### Standard answer (EN)

A balanced tree uses `O(log n)` stack space, while a degenerate left chain has height `n` and therefore needs `O(n)` stack entries. Both still satisfy the stated `O(h)` bound.

### Trả lời chuẩn (VI)

Tree balanced dùng `O(log n)`, còn left chain có height `n`, nên stack `O(n)`; cả hai đều đúng bound `O(h)`.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Nói worst-case `next()` là `O(1)` thay vì amortized.
- Precompute inorder thành list và bỏ qua `O(n)` memory.
- Quên xử lý right subtree sau khi pop.
- Nhầm BST ordering với cách iterator duy trì traversal state.

## 7. Useful vocabulary / Từ vựng hữu ích

- **inorder iterator** — iterator theo inorder.
- **left spine** — chuỗi node đi liên tục sang left.
- **amortized complexity** — độ phức tạp khấu hao.
- **traversal state** — trạng thái duyệt.
