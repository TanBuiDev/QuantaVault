# 100. Same Tree — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I compare the trees recursively in parallel. Two null nodes match; one null and one non-null do not; two existing nodes must have equal values and recursively equal left and right subtrees. This checks structure and values together in `O(n)` time with `O(h)` recursion stack.

**VI:** Em DFS hai cây song song: hai null thì match, chỉ một null thì false, còn lại phải cùng value và cả left/right subtree đều giống nhau.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why is comparing only traversal values insufficient?

**Q (VI):** Vì sao chỉ so traversal values là chưa đủ?

### Short answer (EN)

Different tree structures can produce the same sequence of node values if null positions are ignored.

### Trả lời ngắn (VI)

Hai cấu trúc khác nhau có thể cho cùng chuỗi value nếu bỏ qua vị trí `null`.

### Standard answer (EN)

Tree equality includes structure. A traversal that records only values may lose missing-child information. Parallel node-by-node comparison keeps null positions explicit and therefore checks both structure and values.

### Trả lời chuẩn (VI)

Equality gồm cả structure. Duyệt song song giữ rõ vị trí null nên kiểm tra đồng thời cấu trúc và value.

### Q2

**Q (EN):** What are the recursive base cases?

**Q (VI):** Base cases của recursion là gì?

### Short answer (EN)

Both null means true; exactly one null means false.

### Trả lời ngắn (VI)

Cả hai null → true; chỉ một null → false.

### Standard answer (EN)

Those cases completely decide structural equality at the current position before any value access. If both nodes exist, value equality and child recursion decide the remaining conditions.

### Trả lời chuẩn (VI)

Hai base case quyết định structural equality tại vị trí hiện tại trước khi đọc value; khi cả hai tồn tại mới so value và recurse children.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** Why does checking both child pairs prove the whole trees are equal?

**Q (VI):** Vì sao check cả hai cặp child chứng minh được toàn tree giống nhau?

### Short answer (EN)

A binary tree is fully determined by its root value, left subtree, and right subtree.

### Trả lời ngắn (VI)

Binary tree được xác định bởi root value, left subtree và right subtree.

### Standard answer (EN)

Once the current node values match, the remaining structure consists exactly of the two child subtrees. If both corresponding child subtrees are equal recursively, every descendant position and value matches, so the current trees are equal.

### Trả lời chuẩn (VI)

Khi current value bằng nhau, phần còn lại chính là left/right subtree; nếu cả hai cặp subtree giống nhau thì toàn bộ descendant structure/value đều khớp.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(h)` recursion-stack space.

### Trả lời ngắn (VI)

`O(n)` time và `O(h)` recursion stack.

### Standard answer (EN)

In the worst case the trees are identical and every node is visited once. The deepest active recursion path is the tree height `h`.

### Trả lời chuẩn (VI)

Worst case phải thăm toàn bộ node; số recursive frame tối đa bằng tree height.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** What if both roots are null?

**Q (VI):** Nếu cả hai root đều null?

### Short answer (EN)

Return true because both trees are empty and structurally identical.

### Trả lời ngắn (VI)

Return true vì cả hai đều là empty tree.

### Standard answer (EN)

Empty trees contain the same zero-node structure and no conflicting values, so they satisfy the definition of being the same tree.

### Trả lời chuẩn (VI)

Hai empty tree có cùng cấu trúc rỗng và không có value khác biệt, nên được xem là same tree.

---

## 6. Alternative approach / Hướng khác

### Q6

**Q (EN):** Can this be solved iteratively?

**Q (VI):** Có thể giải iterative không?

### Short answer (EN)

Yes, use a queue or stack of corresponding node pairs and apply the same checks.

### Trả lời ngắn (VI)

Có, dùng queue/stack chứa các cặp node tương ứng.

### Standard answer (EN)

The recursive logic can be translated directly into an explicit stack or queue. That avoids recursion depth but uses an auxiliary collection whose size depends on tree shape.

### Trả lời chuẩn (VI)

Có thể chuyển recursion thành stack/queue explicit; tránh call stack nhưng vẫn dùng memory phụ theo shape của tree.

---

## 7. Common interviewer traps / Bẫy thường gặp

- Bỏ qua null positions.
- Truy cập value trước null checks.
- Chỉ so một subtree.
- Nhầm AND thành OR.
- Nói recursion dùng `O(1)` space.

## 8. Useful vocabulary / Từ vựng hữu ích

- **structurally identical** — giống hệt cấu trúc.
- **corresponding nodes** — các node tương ứng.
- **parallel traversal** — duyệt song song.
- **structural equality** — tính bằng nhau về cấu trúc.
