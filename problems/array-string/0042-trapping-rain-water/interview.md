# 42. Trapping Rain Water — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** Water above an index is bounded by the smaller of the maximum wall on its left and the maximum wall on its right. I use two pointers and running maxima to avoid storing prefix and suffix arrays. When the left bar is no higher than the right bar, the right side already provides a sufficiently high boundary, so the water at the left pointer can be finalized using `leftMax`. I handle the right side symmetrically. Each pointer moves inward once, giving `O(n)` time and `O(1)` extra space.

**VI:** Nước tại một index bị giới hạn bởi minimum của wall cao nhất bên trái và bên phải. Em dùng two pointers và running maxima để không cần hai mảng prefix/suffix. Khi cột trái không cao hơn cột phải, phía phải đã có boundary đủ cao nên nước tại pointer trái có thể finalize bằng `leftMax`. Phía phải xử lý đối xứng. `O(n)` time, `O(1)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why can you process the smaller side immediately?

**Q (VI):** Vì sao có thể xử lý ngay phía thấp hơn?

### Short answer (EN)

Because the opposite current bar guarantees a boundary at least as high, so the smaller side's own running maximum determines its water level.

### Trả lời ngắn (VI)

Vì cột hiện tại phía đối diện đảm bảo một boundary đủ cao, nên running maximum của phía thấp hơn quyết định mức nước ở vị trí đó.

### Standard answer (EN)

If `height[left] <= height[right]`, then there is already a right-side wall at least as tall as the current left bar. If the left bar is below `leftMax`, the limiting wall for this position cannot be lower than `leftMax` on the right side in a way that invalidates the amount `leftMax-height[left]`; the current right wall is sufficient to contain it. Therefore the left position is finalizable.

### Trả lời chuẩn (VI)

Nếu `height[left] <= height[right]`, ta đã biết có một wall bên phải ít nhất cao bằng cột trái hiện tại. Khi cột trái thấp hơn `leftMax`, right boundary hiện tại đủ để giữ mức nước tới `leftMax`, nên lượng `leftMax-height[left]` là final.

### Deep answer (EN)

The two-pointer method is a lazy evaluation of the prefix/suffix formula. It does not know the exact future maximum on both sides, but it only finalizes a position when one side is known not to be the limiting uncertainty. The comparison of boundary heights provides that certificate.

### Trả lời sâu (VI)

Two-pointer là cách đánh giá lazy của công thức prefix/suffix. Ta chưa biết exact future maximum hai phía, nhưng chỉ finalize một vị trí khi một phía chắc chắn không còn là uncertainty giới hạn. So sánh hai boundary hiện tại chính là chứng nhận đó.

---

### Q2

**Q (EN):** What is the direct formula for water at one index?

**Q (VI):** Công thức trực tiếp tại một index là gì?

### Short answer (EN)

`max(0, min(maxLeft, maxRight) - height[i])`.

### Trả lời ngắn (VI)

`max(0, min(maxLeft, maxRight) - height[i])`.

### Standard answer (EN)

The lower of the tallest wall on each side determines the water level; subtracting the bar height gives the water depth at that position.

### Trả lời chuẩn (VI)

Wall thấp hơn trong hai maxima quyết định mặt nước; trừ chiều cao cột hiện tại cho ra độ sâu nước.

---

### Q3

**Q (EN):** What alternatives would you discuss?

**Q (VI):** Bạn sẽ nêu những hướng khác nào?

### Short answer (EN)

Prefix/suffix maxima give `O(n)` time and `O(n)` space; a monotonic stack is also `O(n)` time; two pointers reduce space to `O(1)`.

### Trả lời ngắn (VI)

Prefix/suffix đạt `O(n)`/`O(n)`; monotonic stack cũng `O(n)` time; two pointers giảm space còn `O(1)`.

### Standard answer (EN)

I would often explain prefix/suffix maxima first because its correctness follows directly from the formula, then optimize the stored maxima away with two pointers. The stack solution is a different perspective that computes water basin by basin instead of position by position.

### Trả lời chuẩn (VI)

Em thường trình bày prefix/suffix trước vì bám trực tiếp công thức, sau đó tối ưu hai mảng maxima thành two pointers. Stack nhìn theo basin thay vì từng position.

---

### Q4

**Q (EN):** What are the complexities of the two-pointer solution?

**Q (VI):** Độ phức tạp của two-pointer là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

Each pointer moves monotonically inward, so every index is processed once; only four integer state variables plus the answer are stored.

### Trả lời chuẩn (VI)

Mỗi pointer chỉ đi vào trong, nên mỗi index xử lý một lần và chỉ cần vài scalar variables.

---

### Q5

**Q (EN):** Why is a single local valley not enough to solve the whole problem?

**Q (VI):** Vì sao không thể chỉ tìm từng valley cục bộ đơn giản?

### Short answer (EN)

A basin's water level depends on potentially distant boundaries, not just immediate neighbors.

### Trả lời ngắn (VI)

Mực nước phụ thuộc vào boundary có thể ở rất xa, không chỉ neighbor trực tiếp.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** Can you derive the prefix/suffix solution first?

**Q (VI):** Có thể derive prefix/suffix trước không?

**EN:** Yes. Build `leftMax[i]` and `rightMax[i]`, then sum `min(leftMax[i],rightMax[i])-height[i]`. That formulation makes the per-index formula explicit and is the conceptual bridge to the `O(1)`-space two-pointer version.

**VI:** Có. Xây `leftMax[i]`, `rightMax[i]`, rồi cộng `min(leftMax[i],rightMax[i])-height[i]`. Đây là bước trung gian rõ nhất trước bản two-pointer.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích implementation không?

**EN:** I start at both ends with zero running maxima. On each iteration I process whichever current bar is lower. On the left, a new high bar updates `leftMax`; otherwise the gap to `leftMax` is trapped water. The right side is symmetric. I then move only the processed pointer inward.

**VI:** Em bắt đầu ở hai đầu với running maxima bằng `0`. Mỗi vòng xử lý current bar thấp hơn. Ở trái, nếu gặp cột cao mới thì update `leftMax`; nếu không, chênh lệch tới `leftMax` là nước. Phải đối xứng. Sau đó chỉ di chuyển pointer vừa xử lý.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Thuộc code two-pointer nhưng không giải thích được vì sao chọn phía thấp hơn.
- Nhầm `min(maxLeft,maxRight)` thành max.
- Không nêu prefix/suffix solution như stepping stone khi được hỏi derivation.
- Dùng local neighbors thay cho distant boundaries.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- elevation map — bản đồ độ cao
- trapped water — nước bị giữ lại
- boundary wall — tường biên
- water level — mực nước
- running maximum — cực đại tích lũy
- bottleneck — giới hạn thắt cổ chai
- finalize a position — xác định kết quả cuối cho một vị trí
