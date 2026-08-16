# 104. Maximum Depth of Binary Tree — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use recursive DFS. The depth of a null tree is zero, and for any non-null node the answer is one plus the larger depth of its left and right subtrees. Every node is visited once, so time is `O(n)`, while recursion uses `O(h)` stack space where `h` is the tree height.

**VI:** Em dùng DFS đệ quy: tree rỗng có depth `0`; node khác null có depth bằng `1 + max(leftDepth, rightDepth)`. Time `O(n)`, recursion stack `O(h)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** What recurrence describes the maximum depth?

**Q (VI):** Recurrence của maximum depth là gì?

### Short answer (EN)

`depth(node) = 1 + max(depth(node.left), depth(node.right))`.

### Trả lời ngắn (VI)

`depth(node) = 1 + max(depth(node.left), depth(node.right))`.

### Standard answer (EN)

Any root-to-leaf path from a node must continue through either its left child or its right child. The longest such path therefore chooses the deeper subtree and adds one for the current node.

### Trả lời chuẩn (VI)

Mọi đường node-to-leaf phải đi qua left hoặc right child; đường dài nhất chọn subtree sâu hơn rồi cộng một cho current node.

### Q2

**Q (EN):** Why is the null-tree depth zero?

**Q (VI):** Vì sao tree null có depth bằng 0?

### Short answer (EN)

It contains zero nodes on any root-to-leaf path.

### Trả lời ngắn (VI)

Tree rỗng không có node nào trên đường root-to-leaf.

### Standard answer (EN)

The problem defines depth by number of nodes. Returning zero for null makes a leaf compute `1 + max(0,0) = 1`, which matches the definition and gives a clean recursive base case.

### Trả lời chuẩn (VI)

Đề đếm depth theo số node; base null bằng `0` khiến leaf nhận `1 + max(0,0) = 1`, đúng định nghĩa.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** How would you prove the recursive solution is correct?

**Q (VI):** Chứng minh recursive solution đúng như thế nào?

### Short answer (EN)

Use structural induction on the tree.

### Trả lời ngắn (VI)

Dùng quy nạp theo cấu trúc cây.

### Standard answer (EN)

The base case for an empty tree is correct. Assume the recursive calls return correct depths for both child subtrees. Every longest path from the current node consists of the current node plus a longest path in one child, so taking one plus the maximum child depth returns the correct depth for the current tree.

### Trả lời chuẩn (VI)

Base tree rỗng đúng. Giả sử hai recursive call trả đúng depth subtree; đường dài nhất từ current node là current node cộng đường dài nhất của một child, nên recurrence trả đúng.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(h)` recursion-stack space.

### Trả lời ngắn (VI)

`O(n)` time và `O(h)` recursion stack.

### Standard answer (EN)

Each node is processed once, so time is linear. The maximum number of active recursive calls equals the tree height: `O(log n)` for a balanced tree and `O(n)` for a completely skewed tree.

### Trả lời chuẩn (VI)

Mỗi node được xử lý một lần; số frame recursion tối đa bằng chiều cao cây, từ `O(log n)` khi balanced tới `O(n)` khi skewed.

---

## 5. Alternative approach / Hướng khác

### Q5

**Q (EN):** How would a BFS solution compare?

**Q (VI):** BFS solution khác gì DFS?

### Short answer (EN)

BFS counts levels in `O(n)` time but can require `O(w)` memory for the widest level.

### Trả lời ngắn (VI)

BFS đếm level trong `O(n)` nhưng cần `O(w)` memory theo maximum width.

### Standard answer (EN)

Both are correct. BFS is useful when thinking level by level, while recursive DFS directly matches the height recurrence and often uses less memory on narrow trees. Its drawback is recursion depth on a highly skewed tree.

### Trả lời chuẩn (VI)

Cả hai đều đúng; BFS tự nhiên theo level, DFS khớp recurrence của height. DFS có rủi ro recursion depth khi cây cực lệch.

---

## 6. Edge cases / Câu hỏi edge case

### Q6

**Q (EN):** What result should a single-node tree return?

**Q (VI):** Cây một node trả bao nhiêu?

### Short answer (EN)

One.

### Trả lời ngắn (VI)

Một.

### Standard answer (EN)

Both child depths are zero, so the recurrence returns `1 + max(0,0) = 1`, matching the one-node root-to-leaf path.

### Trả lời chuẩn (VI)

Hai child null có depth 0 nên root nhận depth 1, đúng với đường chỉ gồm một node.

---

## 7. Common interviewer traps / Bẫy thường gặp

- Đếm cạnh thay vì node.
- Quên base case `null`.
- Dùng `min` thay vì `max`.
- Tuyên bố recursion dùng `O(1)` memory.
- Không phân biệt tree height `h` với node count `n`.

## 8. Useful vocabulary / Từ vựng hữu ích

- **maximum depth / tree height** — độ sâu lớn nhất / chiều cao cây.
- **root-to-leaf path** — đường từ root tới leaf.
- **skewed tree** — cây lệch.
- **recursive depth** — độ sâu đệ quy.
- **structural induction** — quy nạp theo cấu trúc.
