# 637. Average of Levels in Binary Tree — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use BFS to process one level at a time, accumulate its values in a `double`, divide by the saved level size, and append the average. This is `O(n)` time and `O(w)` space.

**VI:** Em BFS theo level, cộng bằng `double`, chia cho số node của level và append average.

### Q1
**Q (EN):** Why save `queue.size()` before the loop?

**Q (VI):** Vì sao phải lưu `queue.size()` trước vòng lặp?

### Short answer (EN)
It fixes the boundary of the current level.

### Trả lời ngắn (VI)
Nó cố định ranh giới của current level.

### Standard answer (EN)
Children are enqueued while the level is processed, so the live queue size changes. The saved size ensures exactly the current level is included in the average.

### Trả lời chuẩn (VI)
Child được enqueue trong lúc xử lý nên queue size thay đổi; size đã lưu bảo đảm chỉ tính current level.

### Q2
**Q (EN):** Why use `double` for the sum?

**Q (VI):** Vì sao dùng `double` cho sum?

### Short answer (EN)
It avoids integer overflow and preserves fractional averages.

### Trả lời ngắn (VI)
Để tránh integer overflow và giữ phần thập phân.

### Standard answer (EN)
Node values can be large and many nodes may share a level. Accumulating directly as `double` prevents an intermediate 32-bit integer overflow before division.

### Trả lời chuẩn (VI)
Nhiều value lớn có thể làm tổng vượt `int`; cộng trực tiếp bằng `double` tránh overflow trung gian.

### Q3
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(n)` time and `O(w)` space.

### Trả lời ngắn (VI)
`O(n)` time và `O(w)` space.

### Standard answer (EN)
Each node is processed once and the queue holds at most one level of the tree.

### Trả lời chuẩn (VI)
Mỗi node được xử lý một lần và queue giữ tối đa một level.
