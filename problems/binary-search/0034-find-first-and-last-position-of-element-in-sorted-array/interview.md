# 34. Find First and Last Position of Element in Sorted Array — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I run two boundary binary searches. The first finds the first value at least target; if it is not target, the answer is absent. The second finds the first value greater than target, so subtracting one gives the last occurrence. Both searches are logarithmic.

**VI:** Tôi dùng lower bound và upper bound để lấy hai biên trong O(log n).

## 2. Core approach questions
**Q (EN):** Why two binary searches?

**Q (VI):** Vì sao cần hai binary search?

### Short answer (EN)
The left and right boundaries satisfy different monotonic predicates.

### Trả lời ngắn (VI)
Hai biên dùng hai predicate monotonic khác nhau.

### Standard answer (EN)
The first boundary is where values stop being less than target; the second is where values become greater than target.

### Trả lời chuẩn (VI)
Biên trái là nơi kết thúc vùng `< target`, biên phải độc quyền là nơi bắt đầu vùng `> target`.

## 3. Why / correctness questions
**Q (EN):** Why subtract one from upper bound?

**Q (VI):** Vì sao upper bound trừ 1?

### Short answer (EN)
Upper bound points just after the last target.

### Trả lời ngắn (VI)
Upper bound nằm ngay sau target cuối.

### Standard answer (EN)
By definition it is the first index with a value strictly greater than target, so the preceding index is the last possible target.

### Trả lời chuẩn (VI)
Theo định nghĩa, index trước cận trên là lần xuất hiện cuối.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(log n) time and O(1) space.

### Trả lời ngắn (VI)
O(log n), O(1).

### Standard answer (EN)
Two logarithmic searches remain O(log n), using only scalar indices.

### Trả lời chuẩn (VI)
Hai lần O(log n) vẫn là O(log n).

## 5. Edge-case questions
**Q (EN):** What if the target is absent?

**Q (VI):** Nếu target không tồn tại?

### Short answer (EN)
Validate the lower-bound index before computing the range.

### Trả lời ngắn (VI)
Kiểm tra lower bound có đúng target không.

### Standard answer (EN)
The lower bound can be a legal insertion point for a missing target, so existence must be checked explicitly.

### Trả lời chuẩn (VI)
Lower bound vẫn tồn tại như insertion point dù target vắng mặt.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not scan outward after finding target?

**Q (VI):** Vì sao không scan hai bên?

### Short answer (EN)
A long duplicate run makes that O(n).

### Trả lời ngắn (VI)
Nhiều duplicate có thể làm thành O(n).

### Standard answer (EN)
Boundary searches preserve the required logarithmic worst-case guarantee.

### Trả lời chuẩn (VI)
Binary search biên giữ worst-case logarithmic.

## 7. Code walkthrough questions
**Q (EN):** Why use a half-open interval?

**Q (VI):** Vì sao dùng `[left,right)`?

### Short answer (EN)
It makes insertion position n a natural result.

### Trả lời ngắn (VI)
Nó cho phép kết quả bằng `n` tự nhiên.

### Standard answer (EN)
The invariant includes the virtual position after the array and simplifies boundary updates.

### Trả lời chuẩn (VI)
Khoảng nửa mở giúp xử lý cận cuối mà không special-case.

## 8. Follow-up variations
**Q (EN):** How would you count target occurrences?

**Q (VI):** Đếm số lần target xuất hiện thế nào?

### Short answer (EN)
`upperBound - lowerBound`.

### Trả lời ngắn (VI)
Lấy cận trên trừ cận dưới.

### Standard answer (EN)
The half-open target range has exactly that length.

### Trả lời chuẩn (VI)
Độ dài range nửa mở chính là số lần xuất hiện.

## 9. Common interviewer traps
Returning an insertion point as a hit; mixing inclusive and half-open intervals; linear scanning duplicates.

## 10. Useful phrases and vocabulary
`lower bound`, `upper bound`, `first greater element`, `half-open interval`.
