# 124. Binary Tree Maximum Path Sum — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use postorder tree DP. Each node returns the best one-branch downward gain that can be extended by its parent. Separately, I use both non-negative child gains to form the best path whose highest node is the current node and update a global maximum. This visits every node once: `O(n)` time and `O(h)` stack space.

**VI:** Em dùng postorder tree-DP: mỗi node trả một nhánh gain tốt nhất lên parent, còn global answer được cập nhật bằng candidate có thể dùng cả hai child.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why can the returned gain use only one child?

**Q (VI):** Vì sao gain trả lên chỉ được dùng một child?

### Short answer (EN)

Because adding the parent is another edge, so using both children would create a branch instead of a simple path.

### Trả lời ngắn (VI)

Vì khi nối thêm parent, dùng cả hai child sẽ tạo nhánh thay vì một simple path.

### Standard answer (EN)

A value returned upward represents a path segment that the parent may extend. A simple path has degree at most two inside the chosen sequence. At the current node, one edge is reserved for the parent, leaving room for at most one child edge.

### Trả lời chuẩn (VI)

Gain truyền lên là segment để parent nối tiếp; khi một edge dành cho parent thì current node chỉ còn có thể chọn tối đa một child trong simple path.

### Q2

**Q (EN):** Why clamp negative child gains to zero?

**Q (VI):** Vì sao clamp negative gain về zero?

### Short answer (EN)

A negative extension can only reduce the path sum, and taking no child is allowed.

### Trả lời ngắn (VI)

Nhánh âm chỉ làm tổng nhỏ đi và ta được phép không chọn child đó.

### Standard answer (EN)

The path may start or end at the current node, so including a child is optional. If a child contributes negatively, excluding that branch always gives a sum at least as large.

### Trả lời chuẩn (VI)

Path có thể bắt đầu/kết thúc tại current node nên child là optional; contribution âm luôn nên bỏ.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** How does the global update cover paths that do not pass through the root?

**Q (VI):** Global update bao phủ path không đi qua root như thế nào?

### Short answer (EN)

Every path has a highest node, and the DFS evaluates the best path whose highest node is each node.

### Trả lời ngắn (VI)

Mỗi path có một node cao nhất và DFS xét candidate tốt nhất cho từng node như vậy.

### Standard answer (EN)

Take any valid path and identify its node closest to the tree root. The path enters at most one branch on each side of that node. When DFS processes it, the left/right gains capture the best such branches, so the global candidate is at least that path's sum.

### Trả lời chuẩn (VI)

Với mọi path, chọn node gần root nhất trên path; khi DFS xử lý node đó, two gains đại diện các nhánh tốt nhất có thể, nên candidate bao phủ path đó.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(h)` recursion space.

### Trả lời ngắn (VI)

`O(n)` time và `O(h)` recursion space.

### Standard answer (EN)

Each node is visited once and does constant work after its children return. The call stack follows a single root-to-current chain whose maximum length is the height.

### Trả lời chuẩn (VI)

Mỗi node được thăm một lần với constant work; call stack tối đa bằng height.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** Why initialize the global answer to `Integer.MIN_VALUE`?

**Q (VI):** Vì sao global answer phải bắt đầu bằng `Integer.MIN_VALUE`?

### Short answer (EN)

The tree may contain only negative values, and the path must be non-empty.

### Trả lời ngắn (VI)

Tree có thể toàn số âm và path bắt buộc không rỗng.

### Standard answer (EN)

Starting from zero would incorrectly allow an empty path to beat every negative node. Initializing to the smallest integer ensures the best real node/path replaces it.

### Trả lời chuẩn (VI)

Khởi tạo zero vô tình cho phép empty path thắng mọi node âm; minimum integer bảo đảm một path thật sẽ được chọn.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Nhầm downward gain với complete path candidate.
- Cho phép empty path bằng cách initialize answer bằng zero.
- Không bỏ negative gain.
- Chỉ xét path qua root.

## 7. Useful vocabulary / Từ vựng hữu ích

- **downward gain** — gain của một nhánh đi xuống.
- **global optimum** — tối ưu toàn cục.
- **highest node of a path** — node cao nhất trên path.
- **tree DP** — dynamic programming trên tree.
