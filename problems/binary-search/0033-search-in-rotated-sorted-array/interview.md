# 33. Search in Rotated Sorted Array — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** At every midpoint one side is normally sorted. I identify that side, check whether target lies inside its value interval, and keep it only if it can contain target. This preserves binary-search halving and gives O(log n).

**VI:** Tôi tìm nửa sorted rồi dùng range test để chọn nửa chứa target.

## 2. Core approach questions
**Q (EN):** How do you know which half is sorted?

**Q (VI):** Biết nửa nào sorted bằng cách nào?

### Short answer (EN)
Compare `nums[left]` with `nums[mid]`.

### Trả lời ngắn (VI)
So sánh `nums[left]` và `nums[mid]`.

### Standard answer (EN)
With distinct values, `nums[left] <= nums[mid]` means the left segment did not cross the rotation pivot; otherwise the right segment is sorted.

### Trả lời chuẩn (VI)
Vì unique, comparison endpoint cho biết segment nào không đi qua pivot.

## 3. Why / correctness questions
**Q (EN):** Why can you discard half the array?

**Q (VI):** Vì sao bỏ được một nửa?

### Short answer (EN)
The sorted half has a known value interval.

### Trả lời ngắn (VI)
Nửa sorted có range giá trị xác định.

### Standard answer (EN)
If target is outside that interval, it cannot occur there; if it is inside, the other half is unnecessary.

### Trả lời chuẩn (VI)
Range test loại một nửa chắc chắn không chứa target.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(log n) time, O(1) space.

### Trả lời ngắn (VI)
O(log n), O(1).

### Standard answer (EN)
Each iteration discards roughly half of the remaining indices.

### Trả lời chuẩn (VI)
Mỗi vòng giảm khoảng một nửa miền tìm kiếm.

## 5. Edge-case questions
**Q (EN):** What if the array has one element?

**Q (VI):** Nếu mảng chỉ có một phần tử?

### Short answer (EN)
The normal midpoint equality check handles it.

### Trả lời ngắn (VI)
Check `nums[mid] == target` xử lý trực tiếp.

### Standard answer (EN)
No special rotation handling is required because the inclusive search interval is valid for size one.

### Trả lời chuẩn (VI)
Không cần special-case rotation.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Could you find the pivot first?

**Q (VI):** Có thể tìm pivot trước không?

### Short answer (EN)
Yes, then binary-search the appropriate sorted segment.

### Trả lời ngắn (VI)
Có, tìm pivot rồi binary search segment phù hợp.

### Standard answer (EN)
That is also O(log n), but the one-pass modified binary search is simpler and avoids a second phase.

### Trả lời chuẩn (VI)
Cùng complexity nhưng one-pass gọn hơn.

## 7. Code walkthrough questions
**Q (EN):** Why are the target comparisons asymmetric around mid?

**Q (VI):** Vì sao inequality quanh mid khác nhau?

### Short answer (EN)
Mid was already checked for equality.

### Trả lời ngắn (VI)
Mid đã được kiểm tra bằng equality.

### Standard answer (EN)
The sorted-range test excludes mid on one side to ensure strict progress and avoid duplicate consideration.

### Trả lời chuẩn (VI)
Loại mid khỏi range test giúp progress chắc chắn.

## 8. Follow-up variations
**Q (EN):** What changes with duplicates?

**Q (VI):** Nếu có duplicate thì sao?

### Short answer (EN)
Endpoint equality can become ambiguous and may require shrinking bounds.

### Trả lời ngắn (VI)
Comparison endpoint có thể mơ hồ nên cần thu hẹp biên.

### Standard answer (EN)
Worst-case time can degrade to O(n) when duplicates prevent identifying a sorted half.

### Trả lời chuẩn (VI)
Duplicate có thể làm worst-case thành O(n).

## 9. Common interviewer traps
Wrong boundary inequalities, forgetting target-at-mid check, assuming a visible rotation.

## 10. Useful phrases and vocabulary
`sorted half`, `rotation pivot`, `range membership`, `modified binary search`.
