# 226. Invert Binary Tree — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I recursively invert the left and right subtrees and swap their returned roots at every node. The null tree is the base case. Each node is processed once, so time is `O(n)` and recursion uses `O(h)` stack space.

**VI:** Em recursively invert hai subtree rồi swap left/right ở mỗi node. Time `O(n)`, recursion stack `O(h)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** What exactly changes when a tree is inverted?

**Q (VI):** Chính xác điều gì thay đổi khi invert tree?

### Short answer (EN)

Every node's left and right child references are swapped.

### Trả lời ngắn (VI)

Left và right child reference của mọi node được swap.

### Standard answer (EN)

Tree inversion mirrors the structure, not the values. For every original edge to a left child, the corresponding edge in the result goes to the right position, and vice versa, recursively through all descendants.

### Trả lời chuẩn (VI)

Invert phản chiếu structure chứ không đổi values; mọi left/right edge được đổi vị trí xuyên suốt toàn tree.

### Q2

**Q (EN):** Does it matter whether you swap before or after the recursive calls?

**Q (VI):** Swap trước hay sau recursion có khác không?

### Short answer (EN)

Both orders can work if the references are handled consistently.

### Trả lời ngắn (VI)

Cả hai đều có thể đúng nếu quản lý reference nhất quán.

### Standard answer (EN)

You may swap first and recurse into the new children, or recursively invert the original children and then swap the returned roots. The important part is not to lose either original subtree reference during reassignment.

### Trả lời chuẩn (VI)

Có thể swap trước hoặc sau; điều quan trọng là không làm mất reference của một subtree khi gán pointer.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** How do you prove the recursive transformation is correct?

**Q (VI):** Chứng minh recursion đúng như thế nào?

### Short answer (EN)

Use structural induction on the tree.

### Trả lời ngắn (VI)

Dùng structural induction.

### Standard answer (EN)

An empty tree is already correctly inverted. Assuming both child subtrees are correctly inverted, swapping those inverted subtrees produces exactly the mirror image at the current node, so the property holds for the entire subtree.

### Trả lời chuẩn (VI)

Empty tree đúng. Nếu hai child subtree đã invert đúng, swap chúng tạo mirror đúng tại current node, nên toàn subtree đúng.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(h)` recursion-stack space.

### Trả lời ngắn (VI)

`O(n)` time, `O(h)` recursion stack.

### Standard answer (EN)

Every node is visited once and performs constant pointer work. The active recursive frames follow one root-to-leaf path, so their maximum number equals the tree height.

### Trả lời chuẩn (VI)

Mỗi node làm constant pointer work một lần; số frame active tối đa bằng tree height.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** What happens for a one-node tree?

**Q (VI):** Cây một node thì sao?

### Short answer (EN)

Both children are null, so swapping them changes nothing and the same root is returned.

### Trả lời ngắn (VI)

Hai child đều null nên swap không thay đổi gì và return root đó.

### Standard answer (EN)

The recursive calls on both children return null. Assigning those results in the opposite positions leaves the leaf unchanged, which is the correct mirror of a single-node tree.

### Trả lời chuẩn (VI)

Hai recursive call trả null; swap hai null giữ leaf nguyên vẹn, đúng với mirror của tree một node.

---

## 6. Alternative approach / Hướng khác

### Q6

**Q (EN):** How would you implement this iteratively?

**Q (VI):** Implement iterative như thế nào?

### Short answer (EN)

Use a queue or stack, swap each visited node's children, and enqueue/push the non-null children.

### Trả lời ngắn (VI)

Dùng queue/stack, swap children của từng node rồi đưa non-null child vào cấu trúc duyệt.

### Standard answer (EN)

BFS and iterative DFS perform the same local swap at every node. They avoid recursion but require an explicit collection whose peak size depends on the tree shape.

### Trả lời chuẩn (VI)

BFS/iterative DFS làm cùng local swap nhưng dùng collection explicit thay cho call stack.

---

## 7. Common interviewer traps / Bẫy thường gặp

- Chỉ swap root.
- Làm mất child reference khi reassignment.
- Đổi values thay vì pointers.
- Tuyên bố recursion `O(1)` space.

## 8. Useful vocabulary / Từ vựng hữu ích

- **invert / mirror a tree** — đảo / phản chiếu cây.
- **swap child references** — hoán đổi con trỏ child.
- **recursive transformation** — phép biến đổi đệ quy.
