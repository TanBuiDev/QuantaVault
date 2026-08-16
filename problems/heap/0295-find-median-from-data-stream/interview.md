# 295. Find Median from Data Stream — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I keep the smaller half in a max-heap and the larger half in a min-heap. I rebalance so the lower heap has the same size or one extra item. Median is then its top for odd size or the average of both tops for even size. Inserts are O(log n), queries O(1).

**VI:** Tôi dùng hai heap cân bằng để hai heap top luôn là middle value(s).

## 2. Core approach questions
**Q (EN):** Why two heaps?

**Q (VI):** Vì sao dùng hai heap?

### Short answer (EN)
They expose the largest lower-half value and smallest upper-half value.

### Trả lời ngắn (VI)
Chúng cho truy cập trực tiếp hai giá trị giữa.

### Standard answer (EN)
Those two boundary values determine the median once the halves are balanced.

### Trả lời chuẩn (VI)
Khi hai nửa cân bằng, hai boundary này xác định median.

## 3. Why / correctness questions
**Q (EN):** What invariants are required?

**Q (VI):** Cần invariant nào?

### Short answer (EN)
Ordering between heaps and size difference at most one.

### Trả lời ngắn (VI)
Đúng thứ tự giữa hai heap và chênh size tối đa một.

### Standard answer (EN)
Every lower element must be <= every upper element, with lower holding equal size or one extra.

### Trả lời chuẩn (VI)
Mọi phần tử lower <= upper và lower có size bằng hoặc hơn một.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(log n) add, O(1) median, O(n) space.

### Trả lời ngắn (VI)
O(log n), O(1), O(n).

### Standard answer (EN)
Each insert causes a constant number of heap operations.

### Trả lời chuẩn (VI)
Mỗi insert chỉ có số heap operation hằng số.

## 5. Edge-case questions
**Q (EN):** How do you avoid overflow when averaging?

**Q (VI):** Tránh overflow khi lấy trung bình thế nào?

### Short answer (EN)
Promote to long before addition.

### Trả lời ngắn (VI)
Cast sang long trước phép cộng.

### Standard answer (EN)
`((long)a + b) / 2.0` prevents 32-bit overflow.

### Trả lời chuẩn (VI)
Dùng long cho tổng rồi chia 2.0.

## 6. Alternative-approach and trade-off questions
**Q (EN):** What if values are always 0..100?

**Q (VI):** Nếu giá trị luôn 0..100?

### Short answer (EN)
Use a frequency array.

### Trả lời ngắn (VI)
Dùng mảng tần suất.

### Standard answer (EN)
A 101-bucket count array supports O(1) insertion and bounded median scanning.

### Trả lời chuẩn (VI)
101 bucket cho insert O(1) và tìm median trong miền cố định.

## 7. Code walkthrough questions
**Q (EN):** Why move lower's max to upper after insertion?

**Q (VI):** Vì sao chuyển max của lower sang upper?

### Short answer (EN)
It restores the partition ordering.

### Trả lời ngắn (VI)
Để giữ đúng phân hoạch.

### Standard answer (EN)
Even if the new number belongs above the split, moving the largest lower candidate fixes the boundary.

### Trả lời chuẩn (VI)
Di chuyển boundary lớn nhất giúp phân hoạch đúng sau mọi input.

## 8. Follow-up variations
**Q (EN):** What about a sliding-window median?

**Q (VI):** Nếu median trên sliding window?

### Short answer (EN)
Use two heaps plus lazy deletion.

### Trả lời ngắn (VI)
Hai heap + lazy deletion.

### Standard answer (EN)
We additionally need efficient removal of expired elements, commonly via delayed-count maps.

### Trả lời chuẩn (VI)
Cần cơ chế xóa phần tử hết hạn bằng delayed counts.

## 9. Common interviewer traps
Broken balance, wrong even median, overflow.

## 10. Useful phrases and vocabulary
`balanced two heaps`, `online median`, `partition invariant`, `heap boundary`.
