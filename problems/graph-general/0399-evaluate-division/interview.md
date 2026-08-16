# 399. Evaluate Division — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I model variables as nodes in a weighted graph. Equation `a/b=v` creates edges `a->b` with weight `v` and `b->a` with `1/v`. For each query I search a path and multiply its edge weights. Unknown variables or unreachable targets return `-1.0`.

**VI:** Em model variable thành weighted graph; mỗi equation tạo hai edge nghịch đảo, còn query là path search với tích weight.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why does multiplying weights along a path give the correct division result?

**Q (VI):** Vì sao nhân weight dọc path cho đúng kết quả phép chia?

### Short answer (EN)

Intermediate variables cancel algebraically.

### Trả lời ngắn (VI)

Các variable trung gian triệt tiêu theo đại số.

### Standard answer (EN)

For example, `(a/b) * (b/c) = a/c`. Extending the same cancellation to any path shows that the product from source to target equals the queried ratio.

### Trả lời chuẩn (VI)

Ví dụ `(a/b) * (b/c) = a/c`; cancellation tương tự đúng cho path dài bất kỳ.

### Q2

**Q (EN):** Why is `x/x` not always `1.0`?

**Q (VI):** Vì sao `x/x` không phải lúc nào cũng trả `1.0`?

### Short answer (EN)

If `x` never appears in the equations, the variable is unknown.

### Trả lời ngắn (VI)

Nếu `x` chưa từng xuất hiện trong equations thì variable đó là unknown.

### Standard answer (EN)

The query can only use information represented by the graph. A known node divided by itself is `1.0`, but an absent node has no defined value in the supplied system, so the answer is `-1.0`.

### Trả lời chuẩn (VI)

Chỉ thông tin có trong graph mới hợp lệ; known node chia chính nó là `1.0`, còn absent node phải trả `-1.0`.

### Q3

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(E)` preprocessing and worst-case `O(V+E)` per query.

### Trả lời ngắn (VI)

`O(E)` build graph và worst-case `O(V+E)` mỗi query.

### Standard answer (EN)

The graph stores two directed entries per equation. A DFS may visit every reachable node and edge once for a query, while the visited set prevents cycles.

### Trả lời chuẩn (VI)

Graph lưu hai directed entry mỗi equation; DFS một query có thể thăm toàn bộ reachable nodes/edges một lần nhờ visited set.
