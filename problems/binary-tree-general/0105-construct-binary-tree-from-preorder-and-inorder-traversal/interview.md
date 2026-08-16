# 105. Construct Binary Tree from Preorder and Inorder Traversal — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** Preorder tells me the next subtree root, while inorder tells me how that root splits left and right descendants. I build an inorder value-to-index map, consume preorder with one pointer, and recursively construct the inorder interval on the left before the interval on the right. Each node is processed once, so the solution is `O(n)` time and `O(n)` auxiliary space for the map plus recursion.

**VI:** Preorder cho root kế tiếp, inorder cho split left/right. Em dùng map inorder index và một preorder pointer, dựng left trước right, đạt `O(n)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why does preorder identify the root of each recursive subtree?

**Q (VI):** Vì sao preorder xác định root của mỗi subtree?

### Short answer (EN)

Preorder visits a node before all of its descendants.

### Trả lời ngắn (VI)

Preorder thăm node trước toàn bộ descendants của nó.

### Standard answer (EN)

Once earlier subtrees have consumed their preorder values, the next unconsumed preorder value must be the root of the next subtree being constructed. Its inorder position then determines that subtree's child ranges.

### Trả lời chuẩn (VI)

Sau khi các subtree trước đã consume đúng số value, value preorder chưa dùng đầu tiên chính là root subtree hiện tại; vị trí inorder của nó xác định hai child ranges.

### Q2

**Q (EN):** Why is an inorder index map important?

**Q (VI):** Vì sao inorder index map quan trọng?

### Short answer (EN)

It makes every root split lookup `O(1)` average instead of scanning an interval.

### Trả lời ngắn (VI)

Nó biến mỗi lần tìm split từ scan tuyến tính thành lookup `O(1)` average.

### Standard answer (EN)

Without the map, a skewed tree can make us scan nearly the whole remaining inorder range at every level, producing quadratic time. Unique values allow one global map to locate each root immediately.

### Trả lời chuẩn (VI)

Không có map, skewed tree có thể scan gần hết inorder ở mỗi level và thành `O(n^2)`. Unique values cho phép map global dùng an toàn.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** Why must you build the left subtree before the right subtree?

**Q (VI):** Vì sao phải dựng left trước right?

### Short answer (EN)

After the root, preorder lists every left-subtree node before any right-subtree node.

### Trả lời ngắn (VI)

Sau root, preorder liệt kê toàn bộ left subtree trước right subtree.

### Standard answer (EN)

The shared preorder pointer advances globally. The recursive left call must consume exactly the preorder block belonging to the inorder left range before the pointer can reach the first right-subtree root. Reversing the call order would consume the wrong root values.

### Trả lời chuẩn (VI)

Preorder pointer dùng chung; left call phải consume hết block left trước khi pointer tới root đầu của right subtree. Đảo thứ tự recursion sẽ consume sai value.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(n)` auxiliary space overall.

### Trả lời ngắn (VI)

`O(n)` time và `O(n)` auxiliary space overall.

### Standard answer (EN)

The map is built once in linear time. Each node is created once and each inorder lookup is average constant time. The map stores `n` entries; recursion additionally uses `O(h)` frames, so the total auxiliary bound is `O(n)`.

### Trả lời chuẩn (VI)

Map build tuyến tính, mỗi node tạo một lần. Map chiếm `O(n)`, recursion `O(h)`, nên overall auxiliary `O(n)`.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** How does the algorithm handle a completely skewed tree?

**Q (VI):** Skewed tree được xử lý thế nào?

### Short answer (EN)

One inorder side is empty at every recursive split; correctness remains unchanged.

### Trả lời ngắn (VI)

Mỗi split có một side rỗng; logic vẫn đúng.

### Standard answer (EN)

The boundaries immediately make one recursive call return null and continue down the non-empty side. Time remains `O(n)` with the index map, though recursion depth becomes `O(n)`.

### Trả lời chuẩn (VI)

Boundary làm một child return null ngay; map vẫn giữ time `O(n)`, nhưng recursion depth worst case là `O(n)`.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Dựng right trước left.
- Không dùng boundaries.
- Quên uniqueness assumption khi dùng value-index map.
- Nói recursion stack luôn `O(log n)`.
- Dùng scan mỗi call rồi vẫn tuyên bố `O(n)`.

## 7. Useful vocabulary / Từ vựng hữu ích

- **preorder / inorder traversal** — duyệt preorder / inorder.
- **split index** — index chia subtree.
- **reconstruct a tree** — dựng lại cây.
- **inorder boundary** — biên của đoạn inorder.
