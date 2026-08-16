# 148. Sort List — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I use bottom-up merge sort. I first count the nodes, then merge adjacent sorted runs of size 1, 2, 4, and so on. Splitting and merging only rewires `next` pointers, so each pass is O(n), there are O(log n) passes, and auxiliary space is O(1).

**VI:** Tôi dùng bottom-up merge sort để đạt `O(n log n)` và tránh recursion stack.

## 2. Core approach questions
**Q (EN):** Why merge sort for a linked list?

**Q (VI):** Vì sao merge sort phù hợp linked list?

### Short answer (EN)
Sorted lists merge efficiently by pointer rewiring.

### Trả lời ngắn (VI)
Hai list sorted merge hiệu quả chỉ bằng pointer.

### Standard answer (EN)
Unlike array random-access algorithms, merge sort needs only sequential access and supports stable `O(n log n)` performance.

### Trả lời chuẩn (VI)
Merge sort chỉ cần sequential access và có worst-case `O(n log n)`.

## 3. Why / correctness questions
**Q (EN):** Why is each run sorted before the next pass?

**Q (VI):** Vì sao run luôn sorted trước pass kế tiếp?

### Short answer (EN)
Each run is the merge of two sorted smaller runs.

### Trả lời ngắn (VI)
Mỗi run mới là merge đúng của hai run nhỏ đã sort.

### Standard answer (EN)
The base runs of size one are sorted; induction over doubling passes preserves sortedness.

### Trả lời chuẩn (VI)
Run size 1 sorted hiển nhiên và induction giữ invariant qua mỗi lần doubling.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
`O(n log n)` time and `O(1)` auxiliary space.

### Trả lời ngắn (VI)
`O(n log n)` time, `O(1)` auxiliary space.

### Standard answer (EN)
Every merge level visits all nodes once and the run size doubles each level.

### Trả lời chuẩn (VI)
Mỗi level đi qua n node và có log n level.

## 5. Edge-case questions
**Q (EN):** What if the final run is shorter than `size`?

**Q (VI):** Nếu run cuối ngắn hơn `size`?

### Short answer (EN)
`split` simply returns null when the list ends.

### Trả lời ngắn (VI)
`split` dừng tự nhiên ở cuối list.

### Standard answer (EN)
The merge helper accepts a null second run, so incomplete tails need no special algorithm.

### Trả lời chuẩn (VI)
Merge xử lý được run thứ hai null.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not top-down recursive merge sort?

**Q (VI):** Vì sao không dùng recursive merge sort?

### Short answer (EN)
It uses `O(log n)` call-stack memory.

### Trả lời ngắn (VI)
Nó dùng `O(log n)` stack.

### Standard answer (EN)
It meets the time goal but misses the follow-up's constant-memory target.

### Trả lời chuẩn (VI)
Time đúng nhưng memory không đạt follow-up.

## 7. Code walkthrough questions
**Q (EN):** What must `merge` return?

**Q (VI):** `merge` cần trả gì?

### Short answer (EN)
The tail of the newly merged run.

### Trả lời ngắn (VI)
Tail của run vừa merge.

### Standard answer (EN)
That tail is the reconnection point for the next pair of runs in the same pass.

### Trả lời chuẩn (VI)
Tail là điểm nối cho cặp run kế tiếp.

## 8. Follow-up variations
**Q (EN):** Is the algorithm stable?

**Q (VI):** Thuật toán có stable không?

### Short answer (EN)
Yes, if ties choose the left run first.

### Trả lời ngắn (VI)
Có, nếu khi bằng nhau chọn left trước.

### Standard answer (EN)
Using `<=` in merge preserves original relative order for equal keys.

### Trả lời chuẩn (VI)
Comparison `<=` giữ thứ tự tương đối của duplicate.

## 9. Common interviewer traps
Losing the next run, recursive-space mismatch, incorrect tail reconnection.

## 10. Useful phrases and vocabulary
`bottom-up merge sort`, `sorted runs`, `pointer rewiring`, `constant auxiliary space`.
