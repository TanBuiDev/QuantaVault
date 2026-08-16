# 373. Find K Pairs with Smallest Sums — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I view each fixed nums1 index as a sorted row over nums2. I seed the first pair of up to k rows into a min-heap, repeatedly pop the smallest pair, and advance only that row. This is a k-way merge and avoids materializing the Cartesian product.

**VI:** Tôi xem mỗi `i` như một sorted row và dùng min-heap để k-way merge frontier.

## 2. Core approach questions
**Q (EN):** Why is each row sorted?

**Q (VI):** Vì sao mỗi row đã sort?

### Short answer (EN)
Because nums2 is sorted and nums1[i] is fixed.

### Trả lời ngắn (VI)
Vì nums2 đã sort còn nums1[i] cố định.

### Standard answer (EN)
Adding the same nums1 value preserves nums2's non-decreasing order of sums.

### Trả lời chuẩn (VI)
Cộng cùng một hằng số giữ nguyên thứ tự không giảm.

## 3. Why / correctness questions
**Q (EN):** Why can only the polled row advance?

**Q (VI):** Vì sao chỉ advance row vừa poll?

### Short answer (EN)
Other rows' smallest unused pairs are already in the heap.

### Trả lời ngắn (VI)
Frontier nhỏ nhất của các row khác vẫn nằm trong heap.

### Standard answer (EN)
Removing a row frontier exposes exactly its next candidate; no other hidden candidate can beat its own row frontier.

### Trả lời chuẩn (VI)
Chỉ row vừa lấy cần mở candidate tiếp theo của chính nó.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(k log min(k,m)) time.

### Trả lời ngắn (VI)
O(k log min(k,m)).

### Standard answer (EN)
At most k pop/push cycles occur and heap size is bounded by min(k,m).

### Trả lời chuẩn (VI)
Tối đa k chu kỳ heap, kích thước heap bị chặn bởi min(k,m).

## 5. Edge-case questions
**Q (EN):** Why use long in the comparator?

**Q (VI):** Vì sao comparator dùng long?

### Short answer (EN)
To avoid integer overflow in pair sums.

### Trả lời ngắn (VI)
Để tránh overflow tổng cặp.

### Standard answer (EN)
Input values can be large enough that int addition is unsafe for ordering.

### Trả lời chuẩn (VI)
Tổng int có thể overflow và làm comparator sai.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not generate all pairs?

**Q (VI):** Vì sao không sinh mọi cặp?

### Short answer (EN)
There can be up to m*n pairs.

### Trả lời ngắn (VI)
Có thể có m*n cặp.

### Standard answer (EN)
The heap explores only candidates needed for the first k results.

### Trả lời chuẩn (VI)
Heap chỉ mở các state cần cho top k.

## 7. Code walkthrough questions
**Q (EN):** Why seed at most k rows?

**Q (VI):** Vì sao seed tối đa k row?

### Short answer (EN)
No more than k results can use distinct first-row starters.

### Trả lời ngắn (VI)
Ta chỉ cần k kết quả nên row sau k không thể cần sớm hơn.

### Standard answer (EN)
Because nums1 is sorted, any unseeded row starts no smaller than already seeded row starts beyond the top-k need.

### Trả lời chuẩn (VI)
Thứ tự nums1 cho phép giới hạn frontier ban đầu ở k row.

## 8. Follow-up variations
**Q (EN):** What if inputs were not sorted?

**Q (VI):** Nếu input chưa sort?

### Short answer (EN)
Sort first or use a different top-k strategy.

### Trả lời ngắn (VI)
Sort trước hoặc đổi chiến lược top-k.

### Standard answer (EN)
The row-monotonic invariant depends directly on sorted arrays.

### Trả lời chuẩn (VI)
Invariant row sorted phụ thuộc vào input sorted.

## 9. Common interviewer traps
Cartesian explosion, comparator overflow, duplicate state generation.

## 10. Useful phrases and vocabulary
`k-way merge`, `heap frontier`, `sorted row`, `Cartesian product`.
