# 201. Bitwise AND of Numbers Range — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** The range AND keeps only the common binary prefix of left and right. Every lower bit changes somewhere inside the continuous interval and therefore becomes zero in the AND. I right-shift both endpoints until they are equal, then shift that prefix back. This takes O(log right) time and O(1) space.

**VI:** Tôi tìm common bit prefix bằng cách dịch phải hai đầu mút cùng lúc rồi dịch trái lại.

## 2. Core approach questions

**Q (EN):** Why is the common prefix the answer?

**Q (VI):** Vì sao common prefix là đáp án?

### Short answer (EN)
All lower bits vary inside the interval, so their AND is zero.

### Trả lời ngắn (VI)
Các bit thấp thay đổi trong đoạn nên AND của chúng bằng 0.

### Standard answer (EN)
The first bit where left and right differ marks a boundary crossing; every bit below it cycles through both 0 and 1 somewhere in the range. Only the identical higher prefix stays fixed.

### Trả lời chuẩn (VI)
Bit khác nhau cao nhất đánh dấu boundary; mọi bit thấp hơn đều đổi, chỉ prefix cao hơn là ổn định.

## 3. Why / correctness questions

**Q (EN):** Why can shifting both endpoints find that prefix?

**Q (VI):** Vì sao shift hai đầu tìm được prefix?

### Short answer (EN)
Each shift removes one suffix bit until only the shared prefix remains.

### Trả lời ngắn (VI)
Mỗi shift bỏ một bit suffix cho tới khi chỉ còn prefix chung.

### Standard answer (EN)
When the shifted values become equal, all differing low-order positions have been discarded and the remaining bits are exactly the common prefix.

### Trả lời chuẩn (VI)
Khi hai giá trị bằng nhau, mọi vị trí khác nhau ở phía thấp đã bị loại.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(log right) time and O(1) space.

### Trả lời ngắn (VI)
O(log right) time và O(1) space.

### Standard answer (EN)
At most the number of bits in right are shifted, which is logarithmic in its value.

### Trả lời chuẩn (VI)
Số lần shift tối đa bằng số bit của right.

## 5. Edge-case questions

**Q (EN):** What if left equals right?

**Q (VI):** Nếu left bằng right thì sao?

### Short answer (EN)
The loop does not run and the value is returned unchanged.

### Trả lời ngắn (VI)
Vòng lặp không chạy và trả nguyên giá trị.

### Standard answer (EN)
A one-element range has no varying bits, so every bit is part of the common prefix.

### Trả lời chuẩn (VI)
Range một phần tử không có bit nào thay đổi.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not AND every integer?

**Q (VI):** Vì sao không AND từng số?

### Short answer (EN)
The interval can contain billions of numbers.

### Trả lời ngắn (VI)
Đoạn có thể chứa hàng tỷ giá trị.

### Standard answer (EN)
Sequential AND is proportional to the range width, while prefix reasoning depends only on the bit width.

### Trả lời chuẩn (VI)
Duyệt tuần tự phụ thuộc độ rộng range, còn prefix chỉ phụ thuộc số bit.

## 7. Code walkthrough questions

**Q (EN):** What does `shifts` represent?

**Q (VI):** `shifts` biểu diễn điều gì?

### Short answer (EN)
The number of discarded suffix bits.

### Trả lời ngắn (VI)
Số bit suffix đã bỏ.

### Standard answer (EN)
Those positions must all be zero in the final result, so we restore their places with a left shift after finding the prefix.

### Trả lời chuẩn (VI)
Các vị trí đó phải bằng 0 nên ta khôi phục chúng bằng left shift.

## 8. Follow-up variations

**Q (EN):** Is there another bit trick?

**Q (VI):** Có bit trick khác không?

### Short answer (EN)
Repeatedly clear the least significant set bit of right while right is greater than left.

### Trả lời ngắn (VI)
Có thể liên tục xóa set bit thấp nhất của right khi right > left.

### Standard answer (EN)
`right &= right - 1` removes unstable low bits until right no longer exceeds left; this also reaches the range's stable prefix.

### Trả lời chuẩn (VI)
`right &= right - 1` xóa dần các bit thấp không ổn định để tiến tới prefix chung.

## 9. Common interviewer traps

- Iterating through a huge interval.
- Keeping bits below the first differing prefix position.
- Forgetting to restore zero suffix positions.

## 10. Useful phrases and vocabulary

```text
common binary prefix
unstable low-order bits
continuous integer interval
shift both endpoints together
```
