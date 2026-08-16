# 236. Lowest Common Ancestor of a Binary Tree — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use postorder DFS. If the current node is `p` or `q`, I return it. Otherwise I search both subtrees. If both return non-null, the current node is the split point and therefore the LCA; if only one returns non-null, I propagate that candidate upward. The solution is `O(n)` time with `O(h)` stack space.

**VI:** Em dùng postorder DFS; current node là target thì trả nó, còn nếu left và right đều non-null thì current node là split point/LCA, ngược lại truyền candidate non-null lên.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** What does a non-null recursive result mean?

**Q (VI):** Một recursive result non-null có ý nghĩa gì?

### Short answer (EN)

That subtree contains a target or already contains the LCA.

### Trả lời ngắn (VI)

Subtree đó chứa một target hoặc đã chứa LCA.

### Standard answer (EN)

The returned node summarizes all useful information from the subtree: either it is `p`/`q`, or it is the node where both targets were already found below. That is enough for the parent to decide whether a split occurs.

### Trả lời chuẩn (VI)

Node trả về tóm tắt evidence cần thiết: target hoặc LCA đã tìm thấy; parent chỉ cần biết candidate có xuất hiện ở mỗi side hay không.

### Q2

**Q (EN):** Why return immediately when `root == p || root == q`?

**Q (VI):** Vì sao trả ngay khi `root == p || root == q`?

### Short answer (EN)

A target may itself be the LCA because a node can be its own descendant.

### Trả lời ngắn (VI)

Target có thể chính là LCA vì node được phép là descendant của chính nó.

### Standard answer (EN)

If one target is an ancestor of the other, returning that target immediately preserves it as the candidate while the search unwinds. This matches the problem's LCA definition.

### Trả lời chuẩn (VI)

Nếu một target là ancestor của target kia, trả target ngay sẽ giữ nó làm candidate khi recursion unwind, đúng định nghĩa LCA.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** Why does two non-null child results make the current node the lowest common ancestor?

**Q (VI):** Vì sao hai child result non-null khiến current node là LCA thấp nhất?

### Short answer (EN)

The targets are represented on different sides, and no lower single child can contain both.

### Trả lời ngắn (VI)

Hai target được đại diện ở hai side khác nhau nên không child thấp hơn nào chứa cả hai.

### Standard answer (EN)

If both sides return candidates, each side contains evidence for a different target. Therefore the current node is a common ancestor. Because the evidence is split across its children, neither child alone can be a common ancestor of both, making the current node the lowest such ancestor.

### Trả lời chuẩn (VI)

Khi evidence tách sang hai child, current node là common ancestor và không child nào riêng lẻ chứa cả hai, nên current node là lowest common ancestor.

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

In the worst case the DFS visits every node once. The recursion stack follows one root-to-current path, bounded by tree height `h`.

### Trả lời chuẩn (VI)

Worst case DFS thăm mỗi node một lần; stack giữ một root-to-current path nên bị chặn bởi height `h`.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** Which case verifies the self-descendant rule?

**Q (VI):** Case nào kiểm tra rule node được xem là descendant của chính nó?

### Short answer (EN)

Choose one target that is an ancestor of the other, such as `p = 5`, `q = 4`.

### Trả lời ngắn (VI)

Chọn một target là ancestor của target còn lại, ví dụ `p = 5`, `q = 4`.

### Standard answer (EN)

The expected LCA must be the ancestor target itself. A solution that only looks for a strict split below both children may fail this case.

### Trả lời chuẩn (VI)

Expected LCA phải là target ancestor; cách chỉ tìm strict split ở hai child có thể fail case này.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Quên target có thể là LCA.
- Dùng equality theo value thay vì node reference.
- Không hiểu ý nghĩa của non-null result khi recursion unwind.
- Dùng binary lifting cho chỉ một query dù không cần preprocessing.

## 7. Useful vocabulary / Từ vựng hữu ích

- **lowest common ancestor** — tổ tiên chung thấp nhất.
- **split point** — điểm tách hai target sang hai nhánh.
- **propagate a candidate** — truyền candidate lên trên.
- **node identity** — danh tính/reference của node.
