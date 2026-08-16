# 918. Maximum Sum Circular Subarray — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** The answer is either the ordinary maximum subarray or a wrapped subarray. A wrapped subarray is the total sum minus one contiguous middle segment, so its best value is `total - minSubarray`. I compute max and min Kadane in one pass and special-case all-negative input.

**VI:** Tôi tính max/min Kadane cùng total; wrapped answer là total trừ min subarray.

## 2. Core approach questions
**Q (EN):** Why does `total - minSubarray` represent a wrapped subarray?

**Q (VI):** Vì sao `total - minSubarray` là trường hợp wrap?

### Short answer (EN)
A wrapped segment keeps a suffix and prefix, excluding one middle contiguous segment.

### Trả lời ngắn (VI)
Wrapped segment giữ suffix + prefix và bỏ một đoạn giữa liên tục.

### Standard answer (EN)
Maximizing the kept suffix-plus-prefix is equivalent to minimizing the excluded middle sum.

### Trả lời chuẩn (VI)
Tối đa phần giữ lại tương đương tối thiểu hóa đoạn bị loại.

## 3. Why / correctness questions
**Q (EN):** Why special-case all-negative arrays?

**Q (VI):** Vì sao phải special-case toàn âm?

### Short answer (EN)
The minimum subarray would be the whole array, leaving an illegal empty complement.

### Trả lời ngắn (VI)
Min subarray là toàn mảng, khiến complement rỗng.

### Standard answer (EN)
The problem requires a non-empty subarray, so ordinary Kadane's largest single negative value is the valid answer.

### Trả lời chuẩn (VI)
Subarray phải không rỗng nên lấy max Kadane thường.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(n) time, O(1) space.

### Trả lời ngắn (VI)
O(n), O(1).

### Standard answer (EN)
One pass maintains constant-size max/min Kadane state.

### Trả lời chuẩn (VI)
Một pass và vài biến scalar.

## 5. Edge-case questions
**Q (EN):** What if there is one element?

**Q (VI):** Nếu chỉ một phần tử?

### Short answer (EN)
Kadane returns that element.

### Trả lời ngắn (VI)
Kadane trả chính phần tử đó.

### Standard answer (EN)
The all-negative guard or ordinary max path handles it without duplication.

### Trả lời chuẩn (VI)
Không cần special-case riêng ngoài logic hiện có.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Could you duplicate the array?

**Q (VI):** Có thể duplicate array không?

### Short answer (EN)
Yes, but then subarray length must be capped at n.

### Trả lời ngắn (VI)
Có nhưng phải giới hạn length <= n.

### Standard answer (EN)
That approach typically needs a deque/prefix-sum technique and is more complex than the complement identity.

### Trả lời chuẩn (VI)
Cần thêm window constraint và structure phức tạp hơn.

## 7. Code walkthrough questions
**Q (EN):** Why compute min Kadane in the same loop?

**Q (VI):** Vì sao tính min Kadane cùng loop?

### Short answer (EN)
Both recurrences depend only on the previous state and current number.

### Trả lời ngắn (VI)
Hai recurrence chỉ phụ thuộc state trước và phần tử hiện tại.

### Standard answer (EN)
Their states are independent, so combining loops preserves correctness and O(1) space.

### Trả lời chuẩn (VI)
Có thể cập nhật song song mà không ảnh hưởng nhau.

## 8. Follow-up variations
**Q (EN):** How would you return indices too?

**Q (VI):** Nếu cần trả indices?

### Short answer (EN)
Track start/end indices for both max and min Kadane segments.

### Trả lời ngắn (VI)
Theo dõi start/end cho max và min Kadane.

### Standard answer (EN)
For wrapped output, the kept region is the complement of the minimum segment.

### Trả lời chuẩn (VI)
Wrapped indices là complement của min segment.

## 9. Common interviewer traps
Empty wrapped complement, missing all-negative case, using only ordinary Kadane.

## 10. Useful phrases and vocabulary
`wrapped subarray`, `minimum complement`, `all-negative guard`, `Kadane recurrence`.
