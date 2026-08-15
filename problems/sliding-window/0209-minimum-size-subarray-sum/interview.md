# 209. Minimum Size Subarray Sum — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** Because every number is positive, the window sum changes monotonically: expanding right increases the sum and shrinking left decreases it. I expand until the sum reaches the target, then shrink from the left as much as possible while updating the minimum length. Each element enters and leaves the window at most once, so the solution is `O(n)` time and `O(1)` extra space.

**VI:** Vì mọi số đều dương, window sum thay đổi monotonic: mở rộng right làm sum tăng và shrink left làm sum giảm. Em mở rộng tới khi đạt target, rồi shrink tối đa trong khi cập nhật minimum length. Mỗi phần tử vào và ra window tối đa một lần nên `O(n)` time, `O(1)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is sliding window valid here?

**Q (VI):** Vì sao sliding window đúng cho bài này?

### Short answer (EN)

All numbers are positive, so expanding can only increase the sum and shrinking can only decrease it.

### Trả lời ngắn (VI)

Tất cả số đều dương nên expand chỉ làm sum tăng và shrink chỉ làm sum giảm.

### Standard answer (EN)

That monotonicity tells me exactly which direction to move. If the sum is below target I must expand. Once it reaches target, I can safely shrink to search for a shorter valid window until removing another left value makes it invalid.

### Trả lời chuẩn (VI)

Monotonicity cho direction rõ ràng. Sum thấp thì phải expand; đạt target thì shrink an toàn để tìm window ngắn hơn cho tới khi window invalid.

### Deep answer (EN)

The two pointers form a monotone frontier over all subarrays. For each right endpoint, the left pointer advances to the first position after the shortest valid window. Since left never moves backward, the total search is linear rather than quadratic.

### Trả lời sâu (VI)

Hai pointer tạo monotone frontier trên toàn bộ subarray. Với mỗi right, left tiến tới ngay sau shortest valid window. Vì left không quay lại nên tổng search tuyến tính thay vì quadratic.

---

### Q2

**Q (EN):** Why do you use a `while` loop when the sum reaches the target?

**Q (VI):** Vì sao dùng `while` khi sum đạt target?

**EN:** One valid window is not enough because removing several leading values may keep the sum valid and produce a much shorter window. The loop explores all valid left positions for the current right endpoint.

**VI:** Một valid window chưa đủ vì có thể bỏ nhiều phần tử đầu mà sum vẫn hợp lệ và window ngắn hơn. `while` xét mọi left hợp lệ cho current right.

---

### Q3

**Q (EN):** What breaks if negative numbers are allowed?

**Q (VI):** Nếu có số âm thì điều gì bị phá vỡ?

**EN:** The monotonic relationship disappears. Removing a negative value can increase the sum, so an invalid window might become valid by shrinking, and the simple two-pointer rule is no longer complete.

**VI:** Monotonicity biến mất. Bỏ một số âm có thể làm sum tăng, nên simple two-pointer rule không còn đầy đủ.

---

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Complexity là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` time và `O(1)` extra space.

### Standard answer (EN)

Although there is a nested `while`, the left pointer advances at most `n` times total and right advances exactly `n` times, so the work is linear.

### Trả lời chuẩn (VI)

Dù có nested `while`, left tổng cộng chỉ tăng tối đa `n` lần và right đi `n` lần, nên tổng work là linear.

---

## 3. Likely follow-up / Câu hỏi mở rộng

**Q (EN):** How would you get `O(n log n)`?

**Q (VI):** Làm sao giải `O(n log n)`?

**EN:** Build a strictly increasing prefix-sum array. For each start index, binary-search the first prefix value at least `prefix[start] + target`. The index difference is the candidate length.

**VI:** Tạo prefix sum tăng strictly. Với mỗi start, binary-search prefix đầu tiên >= `prefix[start] + target`; chênh lệch index là candidate length.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I add each right value to the running sum. While the sum is at least target, I update the best length and subtract the current left value before advancing left. At the end, I return zero if no valid window was ever found.

**VI:** Em cộng mỗi right value vào running sum. Khi sum >= target, em update best length, trừ current left rồi tăng left. Cuối cùng nếu chưa từng có valid window thì trả `0`.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Nghĩ nested `while` làm complexity thành `O(n²)`.
- Không nhắc positivity là invariant quan trọng.
- Chỉ shrink một lần bằng `if`.
- Quên no-solution case.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- minimal length — độ dài nhỏ nhất
- variable-size window — cửa sổ kích thước thay đổi
- monotonic sum — tổng đơn điệu
- shrink while valid — thu hẹp khi còn hợp lệ
- running sum — tổng đang duy trì
- prefix sum — tổng tiền tố
