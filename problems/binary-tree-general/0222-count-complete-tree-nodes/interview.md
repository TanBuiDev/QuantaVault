# 222. Count Complete Tree Nodes — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I exploit completeness instead of visiting every node. I compare the leftmost heights of the two child subtrees. Equal heights mean the left subtree is perfect; otherwise the right subtree is perfect. I count that perfect side with a power of two and recurse only into the incomplete side, giving `O(log^2 n)` time.

**VI:** Em tận dụng complete-tree property: so sánh leftmost height hai subtree, tính side perfect bằng lũy thừa hai rồi chỉ recurse side còn lại.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why do equal child heights imply the left subtree is perfect?

**Q (VI):** Vì sao hai child height bằng nhau thì left subtree perfect?

### Short answer (EN)

Because a complete tree fills the last level from left to right.

### Trả lời ngắn (VI)

Vì complete tree lấp level cuối từ trái sang phải.

### Standard answer (EN)

If the right subtree reaches the same leftmost depth as the left subtree, then all positions in the left subtree at that depth must already be filled before any right-subtree node can exist there. Therefore the left subtree is perfect.

### Trả lời chuẩn (VI)

Nếu right subtree đạt cùng depth, toàn bộ vị trí tương ứng ở left subtree đã phải được lấp trước, nên left subtree là perfect.

### Q2

**Q (EN):** Why is this faster than a normal DFS count?

**Q (VI):** Vì sao cách này nhanh hơn DFS đếm bình thường?

### Short answer (EN)

Each step skips one entire perfect subtree and recurses down only one side.

### Trả lời ngắn (VI)

Mỗi bước bỏ qua toàn bộ một perfect subtree và chỉ recurse một side.

### Standard answer (EN)

There are only `O(log n)` recursive levels in a complete tree, and computing a leftmost height costs `O(log n)`, so the product is `O(log^2 n)` rather than `O(n)`.

### Trả lời chuẩn (VI)

Complete tree có `O(log n)` recursive level; mỗi lần đo height tốn `O(log n)`, tổng là `O(log² n)`.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What exactly does `(1 << h)` count in the equal-height case?

**Q (VI):** `(1 << h)` đếm gì khi hai height bằng nhau?

### Short answer (EN)

It counts the current root plus all `2^h - 1` nodes of the perfect left subtree.

### Trả lời ngắn (VI)

Nó đếm current root cộng `2^h - 1` node của perfect left subtree.

### Standard answer (EN)

A perfect subtree with node-height `h` has `2^h - 1` nodes. Adding the current root gives exactly `2^h`, which is `(1 << h)`.

### Trả lời chuẩn (VI)

Perfect subtree height `h` có `2^h - 1` node; cộng current root thành `2^h`.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(log^2 n)` time and `O(log n)` recursion space.

### Trả lời ngắn (VI)

`O(log² n)` time và `O(log n)` recursion space.

### Standard answer (EN)

The complete tree has logarithmic height. We recurse through at most that many levels, and every level performs a logarithmic-height scan.

### Trả lời chuẩn (VI)

Tree có logarithmic height; recurse tối đa từng đó level và mỗi level scan height logarithmic.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** What do empty and single-node trees return?

**Q (VI):** Empty tree và single-node tree trả gì?

### Short answer (EN)

`0` and `1` respectively.

### Trả lời ngắn (VI)

Lần lượt là `0` và `1`.

### Standard answer (EN)

The null base case returns zero. For a single node both child heights are zero, so `(1 << 0) + 0 = 1`.

### Trả lời chuẩn (VI)

Null trả zero; single node có hai child height bằng zero nên công thức cho `1`.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Không tận dụng guarantee complete tree.
- Nhầm edge-height với node-height trong power-of-two formula.
- Nói complexity `O(log n)` dù mỗi recursion còn phải scan height.

## 7. Useful vocabulary / Từ vựng hữu ích

- **complete binary tree** — cây nhị phân hoàn chỉnh.
- **perfect subtree** — subtree hoàn hảo.
- **leftmost height** — chiều cao theo nhánh trái nhất.
- **sublinear counting** — đếm với thời gian dưới tuyến tính.
