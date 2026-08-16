# 162. Find Peak Element — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I compare mid with its right neighbor. An uphill slope guarantees a peak to the right; a downhill slope guarantees one at mid or to the left. I keep that half until one index remains, giving O(log n) time and O(1) space.

**VI:** Tôi binary search theo slope để giữ nửa chắc chắn có peak.

## 2. Core approach questions
**Q (EN):** Why does an uphill slope guarantee a peak to the right?

**Q (VI):** Vì sao slope tăng bảo đảm có peak bên phải?

### Short answer (EN)
The sequence cannot rise forever past the `-∞` boundary.

### Trả lời ngắn (VI)
Chuỗi không thể tăng mãi qua boundary `-∞`.

### Standard answer (EN)
Starting from a rising edge, either values eventually fall, creating a peak, or the rise reaches the last element, which is a peak versus the outside boundary.

### Trả lời chuẩn (VI)
Hoặc slope đổi sang giảm và tạo peak, hoặc tăng đến cuối mảng và phần tử cuối là peak.

## 3. Why / correctness questions
**Q (EN):** Why set right to mid on a downhill slope?

**Q (VI):** Vì sao `right = mid`?

### Short answer (EN)
Mid itself may be the peak.

### Trả lời ngắn (VI)
Mid có thể chính là peak.

### Standard answer (EN)
A downhill edge ensures a peak exists no farther right than mid, so mid must remain a candidate.

### Trả lời chuẩn (VI)
Peak tồn tại tại mid hoặc phía trái nên không được bỏ mid.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(log n) time, O(1) space.

### Trả lời ngắn (VI)
O(log n), O(1).

### Standard answer (EN)
Each step halves the candidate interval.

### Trả lời chuẩn (VI)
Mỗi vòng giảm khoảng một nửa interval.

## 5. Edge-case questions
**Q (EN):** Does one element work?

**Q (VI):** Mảng một phần tử thì sao?

### Short answer (EN)
Yes; the loop is skipped and index zero is returned.

### Trả lời ngắn (VI)
Có; trả index 0.

### Standard answer (EN)
The virtual neighbors are both `-∞`, so the sole element is a peak.

### Trả lời chuẩn (VI)
Hai hàng xóm ảo đều `-∞`.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not scan?

**Q (VI):** Vì sao không scan?

### Short answer (EN)
Scan is O(n).

### Trả lời ngắn (VI)
Scan là O(n).

### Standard answer (EN)
The directional existence argument lets binary search meet the logarithmic requirement.

### Trả lời chuẩn (VI)
Lập luận slope cho phép loại nửa mảng mỗi bước.

## 7. Code walkthrough questions
**Q (EN):** Why is `mid+1` always valid?

**Q (VI):** Vì sao `mid+1` luôn hợp lệ?

### Short answer (EN)
The loop runs only while left < right.

### Trả lời ngắn (VI)
Vì loop chỉ chạy khi còn ít nhất hai candidate.

### Standard answer (EN)
With floor midpoint under `left < right`, mid is strictly less than right.

### Trả lời chuẩn (VI)
Mid luôn nhỏ hơn right nên `mid+1` nằm trong mảng.

## 8. Follow-up variations
**Q (EN):** What if adjacent values could be equal?

**Q (VI):** Nếu adjacent có thể bằng nhau?

### Short answer (EN)
The strict slope signal becomes ambiguous.

### Trả lời ngắn (VI)
Slope strict bị mất tín hiệu.

### Standard answer (EN)
Additional handling would be required because equality does not identify a side guaranteed to contain a strict peak.

### Trả lời chuẩn (VI)
Cần logic bổ sung vì equality không chỉ rõ nửa nào có strict peak.

## 9. Common interviewer traps
Discarding mid on the descending side; accessing mid+1 with an inclusive equality loop; expecting a unique peak.

## 10. Useful phrases and vocabulary
`slope binary search`, `local maximum`, `virtual negative infinity`, `peak existence invariant`.
