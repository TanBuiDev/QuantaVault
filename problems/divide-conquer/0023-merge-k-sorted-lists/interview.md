# 23. Merge k Sorted Lists — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I put the current head of each non-empty sorted list into a min-heap. I repeatedly pop the smallest node, append it to the result, and push that node's successor. The heap never exceeds k nodes, so merging N total nodes costs O(N log k).

**VI:** Tôi giữ head frontier của mỗi list trong min-heap và mở successor sau mỗi poll.

## 2. Core approach questions
**Q (EN):** Why are only current heads needed?

**Q (VI):** Vì sao chỉ cần các head hiện tại?

### Short answer (EN)
Each sorted list's smallest remaining value is its head.

### Trả lời ngắn (VI)
Phần tử nhỏ nhất còn lại của mỗi list chính là head.

### Standard answer (EN)
Any deeper node cannot precede its own head, so it cannot be the global minimum until that head is removed.

### Trả lời chuẩn (VI)
Node sâu hơn chưa thể là minimum toàn cục trước khi head của nó được lấy.

## 3. Why / correctness questions
**Q (EN):** Why does each poll produce the next merged node?

**Q (VI):** Vì sao mỗi poll cho node kế tiếp đúng?

### Short answer (EN)
The heap contains every list's smallest remaining candidate.

### Trả lời ngắn (VI)
Heap chứa candidate nhỏ nhất của mọi list.

### Standard answer (EN)
The minimum among those frontiers is therefore the minimum among all unmerged nodes.

### Trả lời chuẩn (VI)
Minimum frontier cũng là minimum của toàn bộ node chưa merge.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(N log k) time and O(k) extra space.

### Trả lời ngắn (VI)
O(N log k), O(k).

### Standard answer (EN)
Each of N nodes has one heap insertion and removal on a heap of size at most k.

### Trả lời chuẩn (VI)
Mỗi node có một offer/poll trên heap size tối đa k.

## 5. Edge-case questions
**Q (EN):** What if `lists` is empty?

**Q (VI):** Nếu không có list?

### Short answer (EN)
Return null.

### Trả lời ngắn (VI)
Trả `null`.

### Standard answer (EN)
The heap remains empty and dummy.next is null.

### Trả lời chuẩn (VI)
Không có candidate nên output rỗng.

## 6. Alternative-approach and trade-off questions
**Q (EN):** What divide-and-conquer alternative exists?

**Q (VI):** Cách divide-and-conquer khác là gì?

### Short answer (EN)
Pairwise merge lists in rounds.

### Trả lời ngắn (VI)
Merge từng cặp list theo các vòng.

### Standard answer (EN)
Balanced pairwise merging also costs O(N log k) and avoids a heap, but heap k-way merge is straightforward.

### Trả lời chuẩn (VI)
Pairwise merge có cùng asymptotic và không cần heap.

## 7. Code walkthrough questions
**Q (EN):** Why use a dummy head?

**Q (VI):** Vì sao dùng dummy head?

### Short answer (EN)
It removes special handling for the first output node.

### Trả lời ngắn (VI)
Không cần special-case node đầu.

### Standard answer (EN)
Every appended node is handled uniformly through `tail.next`.

### Trả lời chuẩn (VI)
Mọi node đều nối bằng cùng một thao tác.

## 8. Follow-up variations
**Q (EN):** What if the lists arrive as streams?

**Q (VI):** Nếu list là stream?

### Short answer (EN)
The same frontier heap works if each stream can yield its next item.

### Trả lời ngắn (VI)
Frontier heap vẫn dùng được nếu stream trả next item.

### Standard answer (EN)
K-way merge only requires one current candidate per source.

### Trả lời chuẩn (VI)
Chỉ cần một candidate hiện tại từ mỗi nguồn.

## 9. Common interviewer traps
Heap all nodes instead of heads; null handling; comparator overflow.

## 10. Useful phrases and vocabulary
`k-way merge`, `frontier node`, `dummy head`, `sorted linked lists`.
