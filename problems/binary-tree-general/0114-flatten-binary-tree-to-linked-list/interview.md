# 114. Flatten Binary Tree to Linked List — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I flatten the tree in-place. Whenever the current node has a left subtree, I find that subtree's rightmost node, attach the original right subtree after it, move the left subtree to the right, and clear the left pointer. Then I continue along the right chain. This preserves preorder and uses `O(1)` extra space.

**VI:** Em rewiring tại chỗ: tìm rightmost của left subtree, gắn original right subtree vào sau nó, chuyển left sang right và xóa left; tiếp tục theo right chain để giữ đúng preorder với `O(1)` extra space.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why does the rightmost node of the left subtree matter?

**Q (VI):** Vì sao node ngoài cùng bên phải của left subtree quan trọng?

### Short answer (EN)

It is where the original right subtree must be attached after the left subtree is moved to the right.

### Trả lời ngắn (VI)

Đó là nơi phải nối original right subtree sau khi chuyển left subtree sang right.

### Standard answer (EN)

Preorder visits the entire left subtree before the original right subtree. After moving `current.left` to `current.right`, the original right subtree therefore must follow the last node of that moved subtree. Following right pointers from the left root reaches the attachment point created by earlier rewiring.

### Trả lời chuẩn (VI)

Preorder đi hết left subtree rồi mới tới original right; sau khi chuyển left sang right, original right phải được nối sau node cuối của subtree đã chuyển.

### Q2

**Q (EN):** Why not store preorder values and rebuild a new list?

**Q (VI):** Vì sao không lưu preorder values rồi dựng list mới?

### Short answer (EN)

The problem requires reusing the same tree nodes and the follow-up asks for constant extra space.

### Trả lời ngắn (VI)

Đề yêu cầu dùng lại chính các tree node và follow-up yêu cầu constant extra space.

### Standard answer (EN)

Rebuilding loses the in-place requirement and needs extra storage. Pointer rewiring preserves node identity and modifies only existing `left` and `right` fields.

### Trả lời chuẩn (VI)

Dựng lại sẽ mất tính in-place và tốn thêm memory; rewiring giữ nguyên identity của node và chỉ đổi pointer.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** Why does the rewiring preserve preorder?

**Q (VI):** Vì sao rewiring vẫn giữ đúng preorder?

### Short answer (EN)

It transforms `node, left subtree, right subtree` into that exact order on the right chain.

### Trả lời ngắn (VI)

Nó biến thứ tự `node, left subtree, right subtree` thành đúng thứ tự đó trên right chain.

### Standard answer (EN)

At each node, the left subtree is moved immediately after the node and the original right subtree is attached after the left subtree's final node. Internal subtree order is unchanged, so the local preorder segment is preserved. Applying this repeatedly preserves the full preorder traversal.

### Trả lời chuẩn (VI)

Tại mỗi node, left subtree được chuyển ngay sau node và original right được nối sau node cuối của left subtree; thứ tự nội bộ không đổi nên preorder được bảo toàn.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` time và `O(1)` extra space.

### Standard answer (EN)

The traversal advances through the final right chain, and predecessor searches follow tree edges only a bounded number of times across the algorithm. No collection or recursion stack proportional to the input is used.

### Trả lời chuẩn (VI)

Traversal đi qua final right chain; predecessor search theo các edge số lần hữu hạn và không dùng collection hay recursion stack theo input size.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** What should your tests verify besides the sequence of values?

**Q (VI):** Ngoài thứ tự value, test cần kiểm tra gì?

### Short answer (EN)

Every left pointer must be null and the right chain must terminate without a cycle.

### Trả lời ngắn (VI)

Mọi left pointer phải null và right chain phải kết thúc, không tạo cycle.

### Standard answer (EN)

Checking only values can hide structural bugs. A strong regression test verifies the exact preorder sequence, asserts `left == null` at every node, and ensures there are no extra nodes after the expected chain.

### Trả lời chuẩn (VI)

Chỉ check value có thể bỏ sót lỗi cấu trúc; test tốt phải kiểm tra preorder sequence, mọi `left == null`, và chain kết thúc đúng chỗ.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Dùng extra list để rebuild thay vì mutate node hiện có.
- Quên giữ original right subtree trước rewiring.
- Chỉ kiểm tra value order mà không kiểm tra left pointers.
- Gọi giải pháp iterative là `O(1)` nhưng lại dùng explicit stack.

## 7. Useful vocabulary / Từ vựng hữu ích

- **in-place rewiring** — thay đổi liên kết tại chỗ.
- **preorder traversal** — duyệt preorder.
- **rightmost predecessor** — predecessor ngoài cùng bên phải.
- **right chain** — chuỗi node nối bằng right pointer.
