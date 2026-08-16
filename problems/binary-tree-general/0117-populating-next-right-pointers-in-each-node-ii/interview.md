# 117. Populating Next Right Pointers in Each Node II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I process the tree level by level without a queue. The `next` pointers of the current level let me traverse that level horizontally. While scanning it, I build the next level's chain using only two references: the first child and the current tail. Each node is processed once, so the solution is `O(n)` time and `O(1)` extra space.

**VI:** Em dùng chính `next` pointer của level hiện tại để duyệt ngang, đồng thời nối các child thành chain của level kế tiếp bằng hai reference, nên đạt `O(n)` time và `O(1)` extra space.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** How can you traverse a level without a queue?

**Q (VI):** Làm sao duyệt một level mà không dùng queue?

### Short answer (EN)

Use the `next` pointers that were built for that level.

### Trả lời ngắn (VI)

Dùng chính các `next` pointer đã được tạo cho level đó.

### Standard answer (EN)

After a level is linked, its nodes form a left-to-right singly linked list through `next`. Starting from the level's first node, I can walk across with `current = current.next`, so a BFS queue is unnecessary.

### Trả lời chuẩn (VI)

Sau khi một level được nối, các node tạo thành linked list từ trái sang phải qua `next`; chỉ cần đi bằng `current.next`, không cần BFS queue.

### Q2

**Q (EN):** How do you build the next level when the tree is sparse?

**Q (VI):** Làm sao dựng level kế tiếp khi tree bị khuyết?

### Short answer (EN)

Append every non-null child to one shared next-level chain.

### Trả lời ngắn (VI)

Append mọi child khác null vào một chain chung của level kế tiếp.

### Standard answer (EN)

I scan every parent from left to right and consider its left child before its right child. A `nextLevelStart` reference stores the first discovered child, while `nextLevelTail` appends later children. This naturally links nodes even when they come from different parents.

### Trả lời chuẩn (VI)

Em quét parent từ trái sang phải, xét left trước right; `nextLevelStart` giữ child đầu tiên và `nextLevelTail` nối các child sau, nên vẫn nối đúng qua các parent khác nhau.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** Why are next-level nodes linked in the correct order?

**Q (VI):** Vì sao các node ở level kế tiếp được nối đúng thứ tự?

### Short answer (EN)

Parents are scanned left-to-right and each parent's children are appended left-before-right.

### Trả lời ngắn (VI)

Parent được quét trái sang phải và child được append left trước right.

### Standard answer (EN)

That scan order is exactly the left-to-right level order of all children. Therefore appending each non-null child to the same tail produces the unique correct chain for the next level.

### Trả lời chuẩn (VI)

Thứ tự quét đó chính là level order từ trái sang phải của toàn bộ child, nên append vào cùng một tail tạo đúng chain duy nhất của level kế tiếp.

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

Every node is visited once as part of one level scan. The algorithm keeps only a constant number of node references and does not allocate a queue, stack, or list proportional to the input size.

### Trả lời chuẩn (VI)

Mỗi node được duyệt đúng một lần; thuật toán chỉ giữ số lượng reference cố định và không tạo queue, stack hay list tỷ lệ theo input.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** Which regression case best catches a sibling-only implementation?

**Q (VI):** Regression nào bắt được implementation chỉ nối sibling?

### Short answer (EN)

Use a sparse level where two adjacent children belong to different parents.

### Trả lời ngắn (VI)

Dùng một level thưa mà hai child kề nhau thuộc hai parent khác nhau.

### Standard answer (EN)

For example, let node `2` have only child `5` and node `3` have only child `7`. A correct solution must set `5.next = 7`; an implementation that only links siblings under the same parent will miss that connection.

### Trả lời chuẩn (VI)

Ví dụ node `2` chỉ có child `5`, node `3` chỉ có child `7`; lời giải đúng phải có `5.next = 7`, còn cách chỉ nối sibling cùng parent sẽ fail.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Dùng BFS queue dù interviewer nhấn mạnh constant extra space.
- Chỉ nối `left.next = right` trong cùng parent.
- Không nhận ra `next` pointers vừa dựng có thể dùng để traverse level sau.
- Tính sai space complexity vì bỏ qua queue.

## 7. Useful vocabulary / Từ vựng hữu ích

- **next right pointer** — con trỏ tới node kế bên phải.
- **level chain** — chain các node trên cùng level.
- **cross-parent link** — liên kết giữa node có parent khác nhau.
- **constant auxiliary space** — bộ nhớ phụ hằng số.
