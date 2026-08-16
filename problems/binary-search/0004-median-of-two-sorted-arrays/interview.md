# 4. Median of Two Sorted Arrays — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I binary-search a partition in the shorter array. The other partition is fixed so the combined left half has `(m+n+1)/2` items. A partition is valid when each left boundary is <= the opposite right boundary. Then the median is the max-left value, or its average with min-right for even length.

**VI:** Tôi binary search partition ở mảng ngắn hơn và kiểm tra hai crossing inequalities.

## 2. Core approach questions
**Q (EN):** Why search only the shorter array?

**Q (VI):** Vì sao chỉ search mảng ngắn hơn?

### Short answer (EN)
It gives O(log min(m,n)) and keeps the dependent partition valid.

### Trả lời ngắn (VI)
Để đạt log của mảng ngắn hơn và dễ giữ partition còn lại hợp lệ.

### Standard answer (EN)
The partition count in the second array is derived from the first; searching the smaller domain gives the tightest logarithmic bound.

### Trả lời chuẩn (VI)
Partition thứ hai được suy ra từ partition đầu nên search domain nhỏ nhất là tự nhiên.

## 3. Why / correctness questions
**Q (EN):** What makes a partition valid?

**Q (VI):** Partition hợp lệ khi nào?

### Short answer (EN)
`leftA <= rightB` and `leftB <= rightA`.

### Trả lời ngắn (VI)
Hai biên trái không vượt biên phải đối diện.

### Standard answer (EN)
Those inequalities guarantee all values assigned to the left half are no greater than all values assigned to the right half.

### Trả lời chuẩn (VI)
Hai điều kiện bảo đảm thứ tự toàn bộ hai nửa sau khi ghép logic.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(log min(m,n)) time, O(1) space.

### Trả lời ngắn (VI)
O(log min(m,n)), O(1).

### Standard answer (EN)
Each comparison halves the partition search interval and stores only scalar boundaries.

### Trả lời chuẩn (VI)
Mỗi bước giảm nửa miền partition và chỉ dùng biến scalar.

## 5. Edge-case questions
**Q (EN):** How are empty sides handled?

**Q (VI):** Xử lý partition ở biên thế nào?

### Short answer (EN)
Use negative/positive infinity sentinels.

### Trả lời ngắn (VI)
Dùng sentinel âm/vô cùng dương.

### Standard answer (EN)
Sentinels make the same inequalities work without separate boundary branches.

### Trả lời chuẩn (VI)
Sentinel giúp giữ một công thức thống nhất ở endpoint.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not merge?

**Q (VI):** Vì sao không merge?

### Short answer (EN)
Merge violates the logarithmic requirement.

### Trả lời ngắn (VI)
Merge là tuyến tính.

### Standard answer (EN)
Although simpler, merge uses O(m+n) time instead of exploiting sorted-order rank structure.

### Trả lời chuẩn (VI)
Merge bỏ phí cấu trúc rank của hai sorted array.

## 7. Code walkthrough questions
**Q (EN):** Why use `(m+n+1)/2`?

**Q (VI):** Vì sao cộng 1?

### Short answer (EN)
It lets the left side contain the median when total length is odd.

### Trả lời ngắn (VI)
Để nửa trái chứa median khi tổng length lẻ.

### Standard answer (EN)
The formula unifies odd and even lengths, making max-left directly the odd median.

### Trả lời chuẩn (VI)
Công thức thống nhất cả hai trường hợp.

## 8. Follow-up variations
**Q (EN):** How does this generalize to kth element?

**Q (VI):** Tổng quát kth element thế nào?

### Short answer (EN)
Set the left-side cardinality to k.

### Trả lời ngắn (VI)
Đặt số phần tử nửa trái bằng k.

### Standard answer (EN)
The same partition inequalities locate the kth-order boundary instead of the median boundary.

### Trả lời chuẩn (VI)
Vẫn dùng crossing condition nhưng thay rank mục tiêu.

## 9. Common interviewer traps
Off-by-one partition size, boundary sentinels, average overflow.

## 10. Useful phrases and vocabulary
`partition binary search`, `crossing boundaries`, `combined left half`, `order statistic`.
