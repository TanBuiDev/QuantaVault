# 53. Maximum Subarray — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I use Kadane's algorithm. `current` is the best sum of a subarray ending at the current position, so I either extend the previous state or start at the current number. `best` tracks the largest state seen. This gives O(n) time and O(1) space.

**VI:** Tôi dùng state “best ending here” và global best trong một pass.

## 2. Core approach questions
**Q (EN):** Why can a negative prefix be discarded?

**Q (VI):** Vì sao có thể bỏ prefix xấu?

### Short answer (EN)
Starting fresh produces a larger sum than extending a harmful prefix.

### Trả lời ngắn (VI)
Nếu prefix làm giảm tổng thì bắt đầu mới tốt hơn.

### Standard answer (EN)
The recurrence explicitly compares extending with the current value alone, so any non-beneficial prefix is excluded automatically.

### Trả lời chuẩn (VI)
Recurrence so sánh hai lựa chọn và tự loại prefix không có lợi.

## 3. Why / correctness questions
**Q (EN):** What exactly does `current` represent?

**Q (VI):** `current` đại diện gì?

### Short answer (EN)
The maximum sum of a non-empty subarray ending at this index.

### Trả lời ngắn (VI)
Tổng lớn nhất của subarray không rỗng kết thúc tại index hiện tại.

### Standard answer (EN)
That invariant makes the two-choice recurrence exhaustive: start here or extend the best previous ending.

### Trả lời chuẩn (VI)
Invariant này khiến recurrence bao phủ mọi subarray kết thúc tại i.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(n) time and O(1) space.

### Trả lời ngắn (VI)
O(n), O(1).

### Standard answer (EN)
One scan keeps two scalar DP values.

### Trả lời chuẩn (VI)
Một pass và hai state scalar.

## 5. Edge-case questions
**Q (EN):** How do all-negative arrays work?

**Q (VI):** Toàn số âm thì sao?

### Short answer (EN)
Initialize from the first element rather than zero.

### Trả lời ngắn (VI)
Khởi tạo từ phần tử đầu thay vì 0.

### Standard answer (EN)
Then the recurrence selects the least-negative single element when every extension is worse.

### Trả lời chuẩn (VI)
Thuật toán sẽ chọn phần tử âm lớn nhất.

## 6. Alternative-approach and trade-off questions
**Q (EN):** What is the divide-and-conquer alternative?

**Q (VI):** Divide-and-conquer làm thế nào?

### Short answer (EN)
Combine best left, best right, and best crossing subarray.

### Trả lời ngắn (VI)
Kết hợp best trái, phải và crossing.

### Standard answer (EN)
It runs in O(n log n) and is useful conceptually, but Kadane is simpler and faster here.

### Trả lời chuẩn (VI)
O(n log n), hữu ích cho follow-up nhưng không tối ưu bằng Kadane.

## 7. Code walkthrough questions
**Q (EN):** Why update best after current?

**Q (VI):** Vì sao update best sau current?

### Short answer (EN)
Best must consider the optimal subarray ending at the current index.

### Trả lời ngắn (VI)
Best cần xét state mới của index hiện tại.

### Standard answer (EN)
Updating in this order preserves the meaning of both states for each iteration.

### Trả lời chuẩn (VI)
Thứ tự update giữ đúng invariant của hai state.

## 8. Follow-up variations
**Q (EN):** How would you return the subarray indices?

**Q (VI):** Nếu cần trả indices?

### Short answer (EN)
Track the candidate start whenever starting fresh, and save endpoints whenever best improves.

### Trả lời ngắn (VI)
Theo dõi start mới và lưu endpoints khi best tăng.

### Standard answer (EN)
The same recurrence works; only provenance of the selected state is added.

### Trả lời chuẩn (VI)
Giữ nguyên recurrence và bổ sung index provenance.

## 9. Common interviewer traps
Allowing empty subarray, mishandling all-negative input, confusing best-ending with global best.

## 10. Useful phrases and vocabulary
`best ending here`, `global optimum`, `Kadane recurrence`, `restart the subarray`.
