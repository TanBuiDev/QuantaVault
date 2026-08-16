# 106. Construct Binary Tree from Inorder and Postorder Traversal — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I map every inorder value to its index and consume postorder from the end. Each consumed value is the current root; its inorder position splits left and right ranges. Because reverse postorder is root-right-left, I recursively build the right subtree before the left. This gives `O(n)` time and `O(n)` auxiliary space overall.

**VI:** Em dùng inorder index map, consume postorder từ cuối, lấy root rồi dựng right trước left vì reverse postorder có thứ tự root-right-left.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why is the last postorder value the root?

**Q (VI):** Vì sao value cuối postorder là root?

### Short answer (EN)

Postorder visits both child subtrees before the node itself.

### Trả lời ngắn (VI)

Postorder thăm hai child subtree trước rồi mới thăm node.

### Standard answer (EN)

For any subtree, postorder has the form `left, right, root`, so its final value uniquely identifies that subtree's root. Consuming from the array end repeatedly exposes roots in reconstruction order.

### Trả lời chuẩn (VI)

Mỗi subtree có postorder `left,right,root`, nên value cuối là root duy nhất; đọc ngược sẽ lần lượt lộ các root cần dựng.

### Q2

**Q (EN):** Why must you build the right subtree first?

**Q (VI):** Vì sao phải dựng right subtree trước?

### Short answer (EN)

Reading postorder backward produces `root, right, left`.

### Trả lời ngắn (VI)

Đọc postorder ngược cho thứ tự `root,right,left`.

### Standard answer (EN)

The shared postorder pointer moves from right to left. Immediately before a subtree root in normal postorder are the values of its right subtree. Therefore the right recursive call must consume those values before the pointer reaches the left-subtree block.

### Trả lời chuẩn (VI)

Pointer postorder dùng chung đi ngược; ngay trước root là block của right subtree, nên right call phải consume block đó trước left.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** How does inorder make the reconstruction unambiguous?

**Q (VI):** Inorder làm reconstruction xác định duy nhất như thế nào?

### Short answer (EN)

Unique values let the root's inorder position uniquely divide left and right descendants.

### Trả lời ngắn (VI)

Values unique khiến vị trí root trong inorder chia duy nhất left/right descendants.

### Standard answer (EN)

Once the current root is known from postorder, all inorder values left of it within the current range belong to the left subtree and all values right of it belong to the right subtree. The uniqueness constraint makes the split position unambiguous.

### Trả lời chuẩn (VI)

Khi biết root, mọi value bên trái root trong inorder range thuộc left subtree, bên phải thuộc right subtree; uniqueness bảo đảm split duy nhất.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(n)` auxiliary space overall.

### Trả lời ngắn (VI)

`O(n)` time và `O(n)` auxiliary space overall.

### Standard answer (EN)

The map takes linear construction time and space, each node is created once, and each split lookup is average `O(1)`. Recursion adds `O(h)` frames but remains within the `O(n)` overall auxiliary bound.

### Trả lời chuẩn (VI)

Map `O(n)`, mỗi node tạo một lần, split lookup average `O(1)`; recursion `O(h)` nên overall space vẫn `O(n)`.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** What changes for a skewed tree?

**Q (VI):** Skewed tree ảnh hưởng thế nào?

### Short answer (EN)

Correctness and linear time remain, but recursion depth can become `O(n)`.

### Trả lời ngắn (VI)

Vẫn đúng và `O(n)` time, nhưng recursion depth có thể `O(n)`.

### Standard answer (EN)

One inorder range is empty at every split, so reconstruction simply follows the non-empty side. The index map prevents repeated scans, while the call stack grows with the tree height.

### Trả lời chuẩn (VI)

Mỗi split có một side rỗng; map tránh scan lặp lại, còn call stack tăng theo height.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Dựng left trước right.
- Quên uniqueness assumption.
- Không giới hạn recursion bằng inorder range.
- Scan inorder mỗi call nhưng tính sai complexity.

## 7. Useful vocabulary / Từ vựng hữu ích

- **postorder traversal** — duyệt postorder.
- **reverse postorder consumption** — consume postorder theo chiều ngược.
- **reconstruction boundary** — biên dựng subtree.
- **inorder split** — điểm chia inorder.
