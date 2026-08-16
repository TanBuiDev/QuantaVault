# 133. Clone Graph — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I DFS the graph while maintaining a map from every original node to exactly one cloned node. I create and store the clone before recursing into neighbors, which breaks cycles. Every original edge is then recreated between cloned nodes, giving a true deep copy in `O(V + E)` time.

**VI:** Em DFS với map original → clone. Clone được tạo và lưu trước khi recurse neighbor nên cycle không gây lặp vô hạn; mọi edge được dựng lại giữa các cloned node.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why is a map better than only a visited set?

**Q (VI):** Vì sao map phù hợp hơn chỉ dùng visited set?

### Short answer (EN)

We need both cycle detection and the exact cloned node to reuse for every repeated reference.

### Trả lời ngắn (VI)

Ta cần vừa detect cycle vừa lấy đúng cloned node để reuse cho mọi reference lặp lại.

### Standard answer (EN)

A visited set tells me that an original node has been seen, but not which cloned object represents it. The map provides both facts at once and preserves shared references correctly.

### Trả lời chuẩn (VI)

Visited set chỉ cho biết node đã thấy; map còn cho biết clone object nào đại diện cho node đó, nhờ vậy shared reference được giữ đúng.

### Q2

**Q (EN):** Why must the clone be inserted into the map before traversing neighbors?

**Q (VI):** Vì sao phải đưa clone vào map trước khi traverse neighbors?

### Short answer (EN)

A cycle may reach the same node again before the first recursive call returns.

### Trả lời ngắn (VI)

Cycle có thể quay lại node đó trước khi recursive call đầu tiên return.

### Standard answer (EN)

Recording the clone first establishes the mapping immediately. If a neighbor path cycles back, the recursive call finds the existing clone and stops expanding that node again.

### Trả lời chuẩn (VI)

Lưu clone trước thiết lập mapping ngay lập tức; nếu neighbor path quay lại, recursion tìm thấy clone đã có và không expand node lần nữa.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** How do you know the result is a deep copy rather than a shallow copy?

**Q (VI):** Làm sao biết kết quả là deep copy thay vì shallow copy?

### Short answer (EN)

Every graph node in the result is newly allocated, and every neighbor reference points to another clone, never an original node.

### Trả lời ngắn (VI)

Mọi node kết quả đều được cấp phát mới và mọi neighbor đều trỏ tới clone khác, không trỏ original.

### Standard answer (EN)

The map creates one new object for each reachable original node. Neighbor lists are rebuilt exclusively using recursive clone results, so there is no reference from the cloned graph back into the original graph.

### Trả lời chuẩn (VI)

Map tạo một object mới cho mỗi original node; neighbor list chỉ chứa kết quả clone nên cloned graph không giữ reference ngược về original.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(V + E)` time and `O(V)` auxiliary mapping space.

### Trả lời ngắn (VI)

`O(V + E)` time và `O(V)` space cho mapping.

### Standard answer (EN)

Each node is cloned once, and each adjacency-list entry is copied once. The map stores one entry per node; recursion can also reach `O(V)` depth in the worst case.

### Trả lời chuẩn (VI)

Mỗi node clone một lần và mỗi adjacency entry copy một lần; map có một entry mỗi node và recursion worst-case có thể sâu `O(V)`.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** What should the method return for an empty graph?

**Q (VI):** Empty graph trả gì?

### Short answer (EN)

`null`.

### Trả lời ngắn (VI)

`null`.

### Standard answer (EN)

The LeetCode representation passes `null` when no start node exists, so there is nothing to clone and the correct result is `null`.

### Trả lời chuẩn (VI)

Khi không có start node, input là `null`; không có gì để clone nên output đúng là `null`.
