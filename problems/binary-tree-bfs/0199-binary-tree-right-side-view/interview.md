# 199. Binary Tree Right Side View — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use level-order BFS. For each level, the last node processed from left to right is the rightmost visible node. I append that value, giving `O(n)` time and `O(w)` queue space.

**VI:** Em BFS theo từng level; node cuối được xử lý là node phải nhất nhìn thấy được. Complexity `O(n)` time và `O(w)` space.

## 2. Core approach questions / Câu hỏi hướng giải

### Q1
**Q (EN):** Why is the last node of a BFS level the answer?

**Q (VI):** Vì sao node cuối của BFS level là đáp án?

### Short answer (EN)
Because the level is processed left to right.

### Trả lời ngắn (VI)
Vì level được xử lý từ trái sang phải.

### Standard answer (EN)
Nodes at one depth are processed as one batch. With left child enqueued before right child, the final node in that batch is the rightmost node at that depth.

### Trả lời chuẩn (VI)
Các node cùng depth nằm trong một batch; enqueue left trước right nên node cuối batch là node phải nhất.

### Q2
**Q (EN):** Can DFS solve it?

**Q (VI):** DFS có giải được không?

### Short answer (EN)
Yes. Traverse right before left and record the first node seen at each depth.

### Trả lời ngắn (VI)
Có. Duyệt right trước left và lưu node đầu tiên gặp ở mỗi depth.

### Standard answer (EN)
Right-first DFS reaches the visible candidate first. If `depth == result.size()`, that is the first node seen for the level.

### Trả lời chuẩn (VI)
Right-first DFS gặp candidate bên phải trước; nếu depth chưa có answer thì lưu current node.

## 3. Complexity questions / Câu hỏi complexity

### Q3
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(n)` time and `O(w)` space.

### Trả lời ngắn (VI)
`O(n)` time và `O(w)` space.

### Standard answer (EN)
Every node enters and leaves the queue once; the queue holds at most one level.

### Trả lời chuẩn (VI)
Mỗi node vào/ra queue một lần và queue lớn nhất bằng một level.

## 4. Edge cases / Câu hỏi edge case

### Q4
**Q (EN):** Can a left child appear in the right-side view?

**Q (VI):** Left child có thể xuất hiện trong right-side view không?

### Short answer (EN)
Yes, if no node lies farther right at that depth.

### Trả lời ngắn (VI)
Có, nếu ở depth đó không có node nào nằm xa hơn về bên phải.

### Standard answer (EN)
Visibility is determined by the whole level, not by whether a node is literally a right child.

### Trả lời chuẩn (VI)
Visibility phụ thuộc vị trí trong toàn level, không phụ thuộc node có phải right child hay không.
