# 153. Find Minimum in Rotated Sorted Array — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I binary-search the pivot using the right endpoint as a reference. If `nums[mid] > nums[right]`, the minimum must be after mid; otherwise it is at mid or left of it. I keep shrinking until left equals right, which is the minimum index.

**VI:** Tôi dùng `nums[right]` để xác định mid thuộc đoạn cao hay đoạn chứa pivot.

## 2. Core approach questions
**Q (EN):** Why compare with the right endpoint?

**Q (VI):** Vì sao so với right?

### Short answer (EN)
It distinguishes whether mid is in the high rotated segment.

### Trả lời ngắn (VI)
Nó cho biết mid nằm ở đoạn cao trước pivot hay không.

### Standard answer (EN)
With unique values, `nums[mid] > nums[right]` guarantees the rotation drop lies after mid; otherwise the minimum is no farther right than mid.

### Trả lời chuẩn (VI)
Vì giá trị unique, comparison này xác định chắc chắn nửa chứa pivot.

## 3. Why / correctness questions
**Q (EN):** Why keep mid in the else branch?

**Q (VI):** Vì sao giữ mid ở nhánh else?

### Short answer (EN)
Mid may be the minimum.

### Trả lời ngắn (VI)
Mid có thể chính là minimum.

### Standard answer (EN)
When mid is <= right, the pivot is at mid or earlier, so discarding mid would be unsafe.

### Trả lời chuẩn (VI)
Khi mid <= right, pivot có thể đúng tại mid.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(log n) time, O(1) space.

### Trả lời ngắn (VI)
O(log n), O(1).

### Standard answer (EN)
Every iteration discards about half the remaining indices.

### Trả lời chuẩn (VI)
Mỗi vòng bỏ khoảng một nửa miền tìm kiếm.

## 5. Edge-case questions
**Q (EN):** What if the array is effectively unrotated?

**Q (VI):** Nếu mảng không xoay rõ ràng?

### Short answer (EN)
The same logic converges to index 0.

### Trả lời ngắn (VI)
Thuật toán vẫn hội tụ về index 0.

### Standard answer (EN)
All mid values are <= the right endpoint along the relevant path, so right moves left to zero.

### Trả lời chuẩn (VI)
Nhánh `right=mid` liên tục giữ minimum ở đầu.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not scan for the drop?

**Q (VI):** Vì sao không scan?

### Short answer (EN)
That is O(n), violating the requirement.

### Trả lời ngắn (VI)
Scan là O(n).

### Standard answer (EN)
Binary search exploits the monotonic segment structure created by rotation.

### Trả lời chuẩn (VI)
Binary search tận dụng cấu trúc hai sorted segment.

## 7. Code walkthrough questions
**Q (EN):** Why use `left < right`?

**Q (VI):** Vì sao dùng `left < right`?

### Short answer (EN)
We seek a single converged candidate.

### Trả lời ngắn (VI)
Ta muốn hội tụ còn đúng một candidate.

### Standard answer (EN)
Both updates preserve at least one candidate and strictly shrink the inclusive interval.

### Trả lời chuẩn (VI)
Hai update đều giữ minimum và thu nhỏ interval.

## 8. Follow-up variations
**Q (EN):** What changes with duplicates?

**Q (VI):** Nếu có duplicate thì sao?

### Short answer (EN)
When mid equals right, decrement right because the side is ambiguous.

### Trả lời ngắn (VI)
Khi bằng nhau có thể giảm right để phá ambiguity.

### Standard answer (EN)
Duplicates can destroy strict segment identification and degrade worst-case time to O(n).

### Trả lời chuẩn (VI)
Duplicate làm mất tín hiệu strict nên worst-case có thể tuyến tính.

## 9. Common interviewer traps
Wrong inclusive update; assuming the array must visibly rotate; duplicate logic leakage.

## 10. Useful phrases and vocabulary
`rotation pivot`, `inclusive invariant`, `right-endpoint reference`, `two sorted segments`.
