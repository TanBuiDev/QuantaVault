# 102. Binary Tree Level Order Traversal — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use BFS with a queue. Before each level I save the queue size, process exactly that many nodes into one list, enqueue their children, and append the list to the result. Every node is processed once, so the solution is `O(n)` time with `O(w)` queue space.

**VI:** Em BFS bằng queue, lưu size của level, xử lý đúng số node đó thành một list rồi enqueue children. Complexity `O(n)` time và `O(w)` space.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why do you save the queue size before processing a level?

**Q (VI):** Vì sao phải lưu queue size trước khi xử lý level?

### Short answer (EN)

It fixes the boundary between the current level and children added for the next level.

### Trả lời ngắn (VI)

Nó cố định ranh giới giữa current level và children của next level.

### Standard answer (EN)

The queue grows while children are enqueued. Saving the initial size lets me consume exactly the nodes that already belonged to the current depth, so the output grouping stays correct.

### Trả lời chuẩn (VI)

Queue tăng khi enqueue child; size ban đầu giúp em consume đúng các node thuộc current depth và giữ grouping chính xác.

### Q2

**Q (EN):** Why does BFS preserve left-to-right order inside each level?

**Q (VI):** Vì sao BFS giữ thứ tự trái sang phải trong mỗi level?

### Short answer (EN)

Because parents are processed left-to-right and each parent enqueues left before right.

### Trả lời ngắn (VI)

Vì parent được xử lý trái sang phải và mỗi parent enqueue left trước right.

### Standard answer (EN)

FIFO ordering preserves the sequence in which children are inserted. Since the current level is already left-to-right and each parent inserts its left child before its right child, the next level is also left-to-right.

### Trả lời chuẩn (VI)

FIFO giữ thứ tự insert; current level đã trái sang phải và mỗi parent thêm left trước right nên next level cũng đúng thứ tự.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What invariant does the queue maintain?

**Q (VI):** Queue duy trì invariant gì?

### Short answer (EN)

At the start of a level, its first `size` entries are exactly all nodes at that depth.

### Trả lời ngắn (VI)

Đầu mỗi level, `size` phần tử đầu queue chính xác là toàn bộ node ở depth đó.

### Standard answer (EN)

The previous iteration enqueued children only after all earlier parents in order. Therefore all nodes of the next depth are contiguous in the queue, and saving the queue size captures exactly that batch.

### Trả lời chuẩn (VI)

Iteration trước enqueue children theo thứ tự parent, nên toàn bộ node của next depth nằm liên tiếp trong queue; size chụp đúng batch đó.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(w)` auxiliary queue space.

### Trả lời ngắn (VI)

`O(n)` time và `O(w)` queue space.

### Standard answer (EN)

Every node is enqueued and dequeued exactly once. The queue can hold at most about one level at a time, bounded by maximum tree width `w`.

### Trả lời chuẩn (VI)

Mỗi node vào/ra queue đúng một lần; queue lớn nhất xấp xỉ một level, bị chặn bởi maximum width `w`.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** What should an empty tree return?

**Q (VI):** Empty tree trả gì?

### Short answer (EN)

An empty outer list.

### Trả lời ngắn (VI)

Một outer list rỗng.

### Standard answer (EN)

There are no levels to report, so the method returns an empty result without entering BFS.

### Trả lời chuẩn (VI)

Không có level nào để report nên trả result rỗng ngay.
