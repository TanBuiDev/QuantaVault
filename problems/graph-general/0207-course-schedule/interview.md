# 207. Course Schedule — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I model prerequisites as a directed graph and use Kahn's topological sort. Courses with indegree zero can be taken immediately; removing them may unlock more courses. If I process all courses, the graph is acyclic; otherwise a cycle blocks the remaining courses.

**VI:** Em model prerequisite thành directed graph và dùng Kahn topological sort; xử lý đủ mọi node thì không cycle, nếu không thì cycle đang block phần còn lại.

### Q1
**Q (EN):** Why does a cycle make finishing all courses impossible?

**Q (VI):** Vì sao cycle khiến không thể hoàn thành tất cả course?

### Short answer (EN)
Every course in the cycle waits on another course in the same cycle.

### Trả lời ngắn (VI)
Mỗi course trong cycle đều chờ một course khác trong chính cycle đó.

### Standard answer (EN)
No node in a directed cycle can become available before another cycle node is completed, creating a circular dependency with no valid starting point.

### Trả lời chuẩn (VI)
Không node nào trong directed cycle có thể sẵn sàng trước node khác trong cycle, nên không tồn tại starting point hợp lệ.

### Q2
**Q (EN):** What does indegree represent here?

**Q (VI):** Indegree biểu diễn gì trong bài này?

### Short answer (EN)
The number of unfinished prerequisites for a course.

### Trả lời ngắn (VI)
Số prerequisite chưa được giải phóng của course đó.

### Standard answer (EN)
With edges prerequisite-to-course, each incoming edge is one dependency. When a prerequisite is processed, removing that edge decreases the remaining dependency count.

### Trả lời chuẩn (VI)
Với edge prerequisite→course, mỗi incoming edge là một dependency; xử lý prerequisite sẽ giảm số dependency còn lại.

### Q3
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(V + E)` time and `O(V + E)` space.

### Trả lời ngắn (VI)
`O(V + E)` time và `O(V + E)` space.

### Standard answer (EN)
Each course is enqueued at most once and each prerequisite edge is examined once.

### Trả lời chuẩn (VI)
Mỗi course enqueue tối đa một lần và mỗi prerequisite edge được xét một lần.
