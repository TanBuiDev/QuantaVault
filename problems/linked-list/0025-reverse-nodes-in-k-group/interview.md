# 25. Reverse Nodes in k-Group — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I process the list group by group with a dummy predecessor. Before modifying a group, I locate its `k`th node; if it does not exist, the remaining suffix stays unchanged. Otherwise I reverse exactly that group in place, reconnect it to the prefix and suffix, and continue from the old group head, which becomes the new tail. This is `O(n)` time and `O(1)` extra space.

**VI:** Em xử lý từng nhóm `k`, luôn kiểm tra đủ `k` node trước. Nếu đủ thì reverse in-place và reconnect; nếu thiếu thì giữ nguyên suffix. Complexity `O(n)` time, `O(1)` space.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why must you find the `k`th node before reversing a group?

**Q (VI):** Vì sao phải tìm node thứ `k` trước khi reverse?

### Short answer (EN)

Because a final group with fewer than `k` nodes must remain unchanged.

### Trả lời ngắn (VI)

Vì nhóm cuối thiếu `k` node phải giữ nguyên.

### Standard answer (EN)

If we start rewiring before knowing the group is complete, we may partially reverse the leftover suffix and then need to undo it. Verifying the `k`th node first guarantees every modified group is valid and the remainder is untouched.

### Trả lời chuẩn (VI)

Nếu reverse trước khi biết đủ node, ta có thể làm thay đổi phần dư rồi phải hoàn tác. Xác nhận node thứ `k` trước đảm bảo chỉ group hợp lệ mới bị sửa.

### Q2

**Q (EN):** Why initialize `prev` to `groupNext` during reversal?

**Q (VI):** Vì sao khi reverse lại đặt `prev = groupNext`?

### Short answer (EN)

It makes the old group head, which becomes the tail, automatically point to the untouched suffix.

### Trả lời ngắn (VI)

Nó giúp head cũ sau khi thành tail tự động nối tới suffix chưa xử lý.

### Standard answer (EN)

The standard reversal assigns each node's `next` to `prev`. For the first node reversed—the old group head—the correct final `next` is exactly `groupNext`. Starting `prev` there establishes that boundary connection as part of the same loop.

### Trả lời chuẩn (VI)

Trong reverse chuẩn, node đầu cũ sẽ nhận `next = prev`. Sau reverse, `next` đúng của node đó chính là `groupNext`, nên khởi tạo `prev` bằng boundary này giúp reconnect tự nhiên.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What invariant do you maintain between groups?

**Q (VI):** Invariant giữa các group là gì?

### Short answer (EN)

Everything before `groupPrev` is already final, and `groupPrev.next` starts the next unprocessed group.

### Trả lời ngắn (VI)

Mọi thứ trước `groupPrev` đã hoàn tất, còn `groupPrev.next` là đầu group chưa xử lý kế tiếp.

### Standard answer (EN)

At the start of each iteration, the prefix through `groupPrev` has exactly the required final ordering. After confirming and reversing the next `k` nodes, we connect the prefix to the new group head and move `groupPrev` to the new group tail. Thus the finalized prefix grows by exactly `k` nodes while the remaining suffix stays valid.

### Trả lời chuẩn (VI)

Đầu mỗi vòng, prefix tới `groupPrev` đã đúng hoàn toàn. Reverse nhóm kế tiếp rồi nối lại làm prefix hoàn tất dài thêm đúng `k` node, còn suffix chưa xử lý vẫn hợp lệ.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** Why is the time complexity still `O(n)` if every group is scanned and then reversed?

**Q (VI):** Vì sao vừa scan group vừa reverse mà vẫn là `O(n)`?

### Short answer (EN)

Each node participates in only a constant number of pointer visits, so the total is a constant multiple of `n`.

### Trả lời ngắn (VI)

Mỗi node chỉ được đi qua số lần hằng số nên tổng vẫn tuyến tính.

### Standard answer (EN)

For each complete group we traverse up to `k` nodes to find the boundary and another `k` nodes to reverse. Across all groups this is at most about `2n` node visits, which is `O(n)`.

### Trả lời chuẩn (VI)

Mỗi group tối đa scan `k` node rồi reverse `k` node. Tổng trên toàn list xấp xỉ tối đa `2n` lượt, vẫn là `O(n)`.

### Q5

**Q (EN):** Does the iterative solution satisfy the `O(1)` extra-space follow-up?

**Q (VI):** Iterative solution có đạt `O(1)` extra space không?

### Short answer (EN)

Yes. It stores only a fixed number of node references.

### Trả lời ngắn (VI)

Có. Chỉ dùng số lượng pointer cố định.

### Standard answer (EN)

The algorithm allocates only one dummy node and keeps boundary/reversal pointers. No array, stack, map, or recursion depth grows with `n`, so auxiliary memory is constant.

### Trả lời chuẩn (VI)

Ngoài dummy và vài pointer, không có cấu trúc phụ hay call stack tăng theo `n`, nên auxiliary space là `O(1)`.

---

## 5. Edge cases / Câu hỏi edge case

### Q6

**Q (EN):** What happens when `k = 1`?

**Q (VI):** Khi `k = 1` thì sao?

### Short answer (EN)

Each one-node group reverses to itself, so the list remains unchanged.

### Trả lời ngắn (VI)

Mỗi group một node tự reverse thành chính nó nên list không đổi.

### Standard answer (EN)

The boundary finder returns the current first node, and the reversal loop processes exactly that one node while preserving all links. Repeating this for every node yields the original order.

### Trả lời chuẩn (VI)

Mỗi group chỉ có một node nên thao tác reverse không thay đổi thứ tự, dù thuật toán vẫn chạy đúng logic chung.

---

## 6. Alternative approach / Hướng khác

### Q7

**Q (EN):** What is the trade-off of a recursive solution?

**Q (VI):** Recursive solution có trade-off gì?

### Short answer (EN)

It can be elegant, but it uses call-stack space proportional to the number of groups.

### Trả lời ngắn (VI)

Code có thể đẹp hơn nhưng dùng call stack theo số group.

### Standard answer (EN)

Recursion can reverse the first `k` nodes and recursively process the suffix, but the recursion depth is roughly `n/k`. That violates the strict `O(1)` auxiliary-space follow-up, so the iterative version is preferable here.

### Trả lời chuẩn (VI)

Recursion depth khoảng `n/k`, vì vậy không đạt strict `O(1)` auxiliary space như iterative solution.

---

## 7. Common interviewer traps / Bẫy thường gặp

- Reverse phần dư có ít hơn `k` node.
- Quên lưu `groupNext`.
- Reconnect sai new head/new tail của group.
- Thay `Node.val` thay vì đổi pointer.
- Nói recursion dùng `O(1)` space.

## 8. Useful vocabulary / Từ vựng hữu ích

- **group boundary** — biên của nhóm.
- **leftover suffix** — suffix còn dư.
- **reverse in place** — đảo tại chỗ.
- **old head / new tail** — head cũ / tail mới.
- **rewire links** — nối lại liên kết.
