# 103. Binary Tree Zigzag Level Order Traversal — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I keep standard level-order BFS and alternate only how each level's values are stored. On forward levels I append values; on reverse levels I add them to the front. The queue always enqueues children left-before-right, so traversal state stays simple. This is `O(n)` time and `O(w)` auxiliary space.

**VI:** Em giữ BFS chuẩn và chỉ đổi cách ghi value của mỗi level: add cuối hoặc add đầu theo direction. Queue vẫn enqueue left trước right nên traversal không bị rối.

### Q1
**Q (EN):** Why not reverse the queue direction itself?

**Q (VI):** Vì sao không đảo direction của chính queue?

### Short answer (EN)
Because changing output order is sufficient; the BFS traversal order can remain stable.

### Trả lời ngắn (VI)
Vì chỉ cần đổi output order; BFS traversal có thể giữ ổn định.

### Standard answer (EN)
Keeping one fixed enqueue policy preserves clean level boundaries. Zigzag affects presentation of values, not which nodes belong to the next level.

### Trả lời chuẩn (VI)
Giữ một enqueue policy cố định giúp level boundary rõ ràng; zigzag chỉ ảnh hưởng cách trình bày value.

### Q2
**Q (EN):** How do you obtain reverse order without an extra reverse pass?

**Q (VI):** Làm sao có reverse order mà không cần thêm một lượt reverse?

### Short answer (EN)
Insert each value at the front of a linked deque for reverse levels.

### Trả lời ngắn (VI)
Insert từng value vào đầu deque/list ở level ngược.

### Standard answer (EN)
The nodes still arrive left-to-right from BFS. Repeated `addFirst` turns that sequence into right-to-left order in `O(1)` per insertion.

### Trả lời chuẩn (VI)
Node vẫn tới theo trái sang phải; `addFirst` liên tục biến sequence đó thành phải sang trái với `O(1)` mỗi insertion.

### Q3
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(n)` time and `O(w)` auxiliary space.

### Trả lời ngắn (VI)
`O(n)` time và `O(w)` auxiliary space.

### Standard answer (EN)
Every node is polled once and inserted into one level list once. The BFS queue is bounded by the maximum width.

### Trả lời chuẩn (VI)
Mỗi node được poll một lần và insert vào đúng một level list; queue bị chặn bởi maximum width.
