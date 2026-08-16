# 909. Snakes and Ladders — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I model squares as an unweighted graph and run BFS, because every edge costs one die roll. For each candidate square I convert the boustrophedon label to matrix coordinates and apply at most one snake or ladder before enqueueing the destination.

**VI:** Em model square thành unweighted graph và BFS theo số roll; mỗi candidate được map label→cell rồi áp dụng tối đa một snake/ladder.

### Q1
**Q (EN):** Why is BFS optimal here?

**Q (VI):** Vì sao BFS tối ưu cho bài này?

### Short answer (EN)
Every move costs exactly one roll.

### Trả lời ngắn (VI)
Mỗi move có cost đúng một roll.

### Standard answer (EN)
BFS explores states by increasing number of edges from square 1, so the first visit to the target is a shortest path in number of rolls.

### Trả lời chuẩn (VI)
BFS mở rộng state theo số edge tăng dần từ square 1, nên lần đầu tới target chính là số roll nhỏ nhất.

### Q2
**Q (EN):** Why must you not chain jumps?

**Q (VI):** Vì sao không được chain jump?

### Short answer (EN)
The problem explicitly allows at most one snake or ladder per die roll.

### Trả lời ngắn (VI)
Đề quy định tối đa một snake/ladder mỗi roll.

### Standard answer (EN)
The graph transition for one roll ends immediately after the destination of the first snake or ladder, even if that destination starts another jump.

### Trả lời chuẩn (VI)
Transition của một roll kết thúc ngay sau destination của jump đầu tiên, kể cả destination đó có jump khác.

### Q3
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(n^2)` time and space.

### Trả lời ngắn (VI)
`O(n^2)` time và space.

### Standard answer (EN)
Each of the `n^2` labels is processed at most once, and each generates at most six candidate transitions.

### Trả lời chuẩn (VI)
Mỗi label được xử lý tối đa một lần và sinh tối đa sáu transition.
