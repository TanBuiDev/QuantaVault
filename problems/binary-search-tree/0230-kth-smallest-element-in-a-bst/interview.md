# 230. Kth Smallest Element in a BST — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** Inorder traversal of a BST is sorted. I simulate inorder with a stack and count popped nodes; the kth popped node is the answer, so I can stop early. This uses `O(h)` space and avoids materializing all values.

**VI:** Em dùng iterative inorder; node được pop thứ `k` chính là kth-smallest, nên có thể early stop với `O(h)` space.

### Q1
**Q (EN):** Why does inorder solve the ranking problem?

**Q (VI):** Vì sao inorder giải được bài ranking này?

### Short answer (EN)
BST inorder visits values in ascending order.

### Trả lời ngắn (VI)
BST inorder thăm value theo thứ tự tăng dần.

### Standard answer (EN)
Every left-subtree value is smaller than the node and every right-subtree value is larger, so left-root-right recursively produces globally sorted order.

### Trả lời chuẩn (VI)
Left subtree nhỏ hơn node và right subtree lớn hơn node; left-root-right vì vậy tạo sorted order toàn cục.

### Q2
**Q (EN):** Why is an iterative stack useful here?

**Q (VI):** Vì sao iterative stack hữu ích?

### Short answer (EN)
It exposes nodes one at a time and supports immediate early termination.

### Trả lời ngắn (VI)
Nó đưa node ra từng cái và dừng ngay khi đủ `k`.

### Standard answer (EN)
The stack stores only traversal state along a root-to-current path. Once the kth node is popped, no remaining node can be smaller, so the method returns immediately.

### Trả lời chuẩn (VI)
Stack chỉ giữ traversal state; khi pop node thứ `k`, mọi node còn lại đều lớn hơn nên có thể return ngay.

### Q3
**Q (EN):** How would you optimize repeated kth queries with updates?

**Q (VI):** Tối ưu repeated kth query khi có update thế nào?

### Short answer (EN)
Store subtree sizes in each BST node.

### Trả lời ngắn (VI)
Lưu subtree size tại mỗi node.

### Standard answer (EN)
With `leftSize`, compare `k` against `leftSize + 1` to choose the node or recurse into one side; insert/delete updates sizes along their search path.

### Trả lời chuẩn (VI)
Dùng `leftSize` để quyết định chọn current/left/right, còn insert/delete cập nhật size dọc search path.
