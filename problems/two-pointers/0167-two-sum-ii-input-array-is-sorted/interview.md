# 167. Two Sum II - Input Array Is Sorted — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** Because the array is sorted, I place one pointer at each end. If their sum is below the target, the left value is too small to pair with any remaining value, so I move the left pointer right. If the sum is above the target, the right value is too large, so I move the right pointer left. When the sum matches, I return the one-based indices. Each step eliminates one impossible endpoint, giving `O(n)` time and `O(1)` extra space.

**VI:** Vì array sorted, em đặt pointer ở hai đầu. Nếu tổng nhỏ hơn target, left value quá nhỏ để ghép với bất kỳ value còn lại nên tăng `left`. Nếu tổng lớn hơn target, right value quá lớn nên giảm `right`. Khi bằng target, trả index 1-based. Mỗi bước loại một endpoint impossible nên đạt `O(n)`/`O(1)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why can you discard `left` when the sum is too small?

**Q (VI):** Vì sao có thể loại `left` khi tổng quá nhỏ?

### Short answer (EN)

The current right value is the largest remaining partner; if even that sum is too small, pairing `left` with any smaller partner cannot reach the target.

### Trả lời ngắn (VI)

`right` hiện là partner lớn nhất còn lại; nếu ghép với nó vẫn quá nhỏ thì mọi partner nhỏ hơn cũng không đạt target.

### Standard answer (EN)

For every `r <= right`, sorted order gives `numbers[r] <= numbers[right]`. Therefore `numbers[left] + numbers[r] <= currentSum < target`. No valid pair uses the current left endpoint, so removing it preserves the unique solution.

### Trả lời chuẩn (VI)

Với mọi `r <= right`, sorted order cho `numbers[r] <= numbers[right]`. Vì vậy `numbers[left]+numbers[r] <= currentSum < target`. Current left không thể thuộc pair hợp lệ nên loại nó an toàn.

### Deep answer (EN)

Each pointer move is a dominance elimination: one endpoint is proven incompatible with the entire remaining opposite interval, not merely with the current opposite endpoint. That monotonic dominance is what reduces a quadratic pair search to linear time.

### Trả lời sâu (VI)

Mỗi pointer move là dominance elimination: một endpoint được chứng minh không thể ghép với toàn bộ interval phía đối diện, không chỉ current endpoint. Tính monotonic này biến search cặp `O(n²)` thành tuyến tính.

---

### Q2

**Q (EN):** Why not use a hash map like regular Two Sum?

**Q (VI):** Vì sao không dùng hash map như Two Sum thường?

### Short answer (EN)

The sorted order enables `O(n)` two pointers with constant extra space, which matches the problem's space requirement.

### Trả lời ngắn (VI)

Sorted order cho two pointers `O(n)` với constant extra space, đúng yêu cầu đề.

### Standard answer (EN)

A hash map also gives linear expected time but costs linear memory. Here the sorted invariant gives us directional information, so the map is unnecessary and violates the stated constant-extra-space constraint.

### Trả lời chuẩn (VI)

Hash map cũng linear expected time nhưng tốn linear memory. Sorted invariant đã cho directional information nên map là dư thừa và không đạt space constraint.

---

### Q3

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

Each iteration moves one pointer inward and neither pointer ever moves backward, so there are at most `n-1` pointer moves.

### Trả lời chuẩn (VI)

Mỗi iteration đưa một pointer vào trong và pointer không quay lại nên tối đa `n-1` moves.

---

### Q4

**Q (EN):** Why do you return `left + 1` and `right + 1`?

**Q (VI):** Vì sao trả `left + 1` và `right + 1`?

### Short answer (EN)

The Java array is zero-indexed, but the problem asks for one-indexed positions.

### Trả lời ngắn (VI)

Java array zero-based nhưng đề yêu cầu 1-based positions.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** What if the array were not sorted?

**Q (VI):** Nếu array không sorted thì sao?

**EN:** I would usually use a hash map for `O(n)` expected time and `O(n)` space, or sort value-index pairs if mutation/order constraints allow it.

**VI:** Em thường dùng hash map `O(n)` expected time, `O(n)` space; hoặc sort value-index pairs nếu constraints cho phép.

### Follow-up 2

**Q (EN):** Could binary search solve it?

**Q (VI):** Có thể dùng binary search không?

**EN:** Yes. For each index I can binary-search the complement in the suffix, giving `O(n log n)` time and constant extra space. Two pointers is simpler and faster asymptotically.

**VI:** Có. Với mỗi index binary-search complement trong suffix, `O(n log n)` time và constant space. Two pointers đơn giản và nhanh hơn.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I start with the smallest and largest values. I calculate their sum. An exact match returns the adjusted one-based indices. If the sum is low I advance the left pointer; otherwise I decrease the right pointer. The unique-solution guarantee means the loop must find the pair.

**VI:** Em bắt đầu ở value nhỏ nhất và lớn nhất, tính sum. Nếu đúng thì trả index 1-based. Nếu sum thấp tăng left, nếu cao giảm right. Unique-solution guarantee đảm bảo loop sẽ tìm pair.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Không tận dụng sorted order.
- Không chứng minh pointer move loại cả endpoint.
- Quên 1-based output.
- Dùng extra `HashMap` trái yêu cầu.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- non-decreasing order — thứ tự không giảm
- one-indexed — đánh số từ 1
- complement — giá trị bù
- discard an endpoint — loại một đầu mút
- monotone adjustment — điều chỉnh đơn điệu
- dominance elimination — loại theo quan hệ trội
