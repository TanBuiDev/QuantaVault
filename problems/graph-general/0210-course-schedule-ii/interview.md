# 210. Course Schedule II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use Kahn's topological sort. Every zero-indegree course is currently available, so I append it to the order and remove its outgoing edges. If I output all courses, the sequence respects every prerequisite; otherwise a cycle prevents a complete ordering.

**VI:** Em dùng Kahn: course indegree zero được đưa vào order, remove outgoing edges; đủ mọi course thì order hợp lệ, thiếu node nghĩa là có cycle.

### Q1
**Q (EN):** Why can there be multiple correct answers?

**Q (VI):** Vì sao có thể có nhiều đáp án đúng?

### Short answer (EN)
Several courses may have indegree zero at the same time.

### Trả lời ngắn (VI)
Có thể có nhiều course cùng indegree zero tại một thời điểm.

### Standard answer (EN)
Independent prerequisites impose only a partial order. Any sequence that respects every directed edge is a valid topological ordering.

### Trả lời chuẩn (VI)
Prerequisite chỉ tạo partial order; mọi sequence tôn trọng toàn bộ directed edge đều hợp lệ.

### Q2
**Q (EN):** How do you detect that no valid order exists?

**Q (VI):** Phát hiện không có valid order thế nào?

### Short answer (EN)
The processed count is smaller than `numCourses`.

### Trả lời ngắn (VI)
Số course processed nhỏ hơn `numCourses`.

### Standard answer (EN)
A directed cycle leaves its nodes with positive indegree after all removable nodes are processed, so Kahn stops before producing a full ordering.

### Trả lời chuẩn (VI)
Cycle giữ positive indegree cho các node của nó nên Kahn dừng trước khi tạo đủ order.

### Q3
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(V + E)` time and space.

### Trả lời ngắn (VI)
`O(V + E)` time và space.

### Standard answer (EN)
Each node is enqueued at most once and each prerequisite edge is processed once.

### Trả lời chuẩn (VI)
Mỗi node enqueue tối đa một lần và mỗi edge xử lý một lần.
