# 15. 3Sum — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I sort the array, then fix one value as the first element of the triplet. For each distinct anchor, the remaining task is Two Sum on a sorted suffix, so I use left and right pointers. If the sum is too small I move left; if it is too large I move right. When I find zero, I record the triplet and skip duplicate values on both sides. Sorting costs `O(n log n)`, but the nested anchor plus two-pointer scan dominates at `O(n²)`.

**VI:** Em sort array rồi fix một value làm phần tử đầu. Với mỗi anchor phân biệt, phần còn lại là Two Sum trên sorted suffix nên dùng left/right pointers. Sum nhỏ thì tăng left, sum lớn thì giảm right. Khi bằng `0`, lưu triplet và skip duplicate ở cả hai phía. Tổng complexity là `O(n²)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why does sorting help?

**Q (VI):** Vì sao sort giúp giải bài này?

### Short answer (EN)

Sorting gives monotonic direction: moving left increases the pair sum and moving right decreases it.

### Trả lời ngắn (VI)

Sort tạo monotonic direction: tăng left làm pair sum tăng, giảm right làm pair sum giảm.

### Standard answer (EN)

After fixing `nums[i]`, I need two values that sum to `-nums[i]`. In a sorted suffix, if the current sum is low, every pair using the same left value and a smaller right is also low, so left can be discarded. The high-sum case is symmetric.

### Trả lời chuẩn (VI)

Sau khi fix `nums[i]`, em cần hai value có tổng `-nums[i]`. Trong sorted suffix, nếu current sum thấp thì mọi pair giữ current left với right nhỏ hơn cũng thấp, nên loại left. Trường hợp sum cao đối xứng.

### Deep answer (EN)

Sorting converts an unordered quadratic Two Sum search for each anchor into a linear monotone frontier walk. That reduces the total from cubic brute force to quadratic.

### Trả lời sâu (VI)

Sort biến search Two Sum không có hướng cho mỗi anchor thành một monotone frontier walk tuyến tính, giảm tổng từ `O(n³)` xuống `O(n²)`.

---

### Q2

**Q (EN):** How do you prevent duplicate triplets?

**Q (VI):** Làm sao ngăn duplicate triplets?

### Short answer (EN)

I skip duplicate anchors and, after finding a triplet, skip repeated left and right values.

### Trả lời ngắn (VI)

Em skip anchor trùng và sau khi tìm triplet thì skip các value trùng ở left/right.

### Standard answer (EN)

Because the array is sorted, equal values are adjacent. I never start a new anchor with the same value as the previous anchor. After a match, I move both pointers once and then skip any values equal to the ones just used. Therefore each value-triplet is emitted once.

### Trả lời chuẩn (VI)

Do array sorted nên value bằng nhau nằm cạnh nhau. Em không dùng lại cùng anchor value; sau match em move cả hai pointers rồi bỏ mọi value giống value vừa dùng. Vì vậy mỗi value-triplet chỉ xuất hiện một lần.

---

### Q3

**Q (EN):** Why can you break when `nums[i] > 0`?

**Q (VI):** Vì sao có thể break khi `nums[i] > 0`?

**EN:** Since the array is sorted, every later value is at least `nums[i]` and therefore also positive. Three positive values cannot sum to zero.

**VI:** Vì array sorted, mọi value phía sau đều >= `nums[i]` nên cũng dương. Ba số dương không thể có tổng bằng `0`.

---

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(n²)` time; extra space is dominated by the sorting implementation, excluding output.

### Trả lời ngắn (VI)

`O(n²)` time; extra space phụ thuộc sorting implementation, không tính output.

### Standard answer (EN)

There are up to `n` anchors, and for each anchor the two pointers move across the suffix at most once, giving `O(n²)`. Sorting is only `O(n log n)`, so it does not dominate.

### Trả lời chuẩn (VI)

Có tối đa `n` anchor; với mỗi anchor, two pointers đi qua suffix tối đa một lần nên `O(n²)`. Sort `O(n log n)` nhỏ hơn và không chi phối.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** Could you solve it without sorting?

**Q (VI):** Có thể giải mà không sort không?

**EN:** Yes, for example with hash sets per anchor, but duplicate handling becomes more complex and extra memory is `O(n)`. Sorting gives a cleaner deterministic solution.

**VI:** Có thể dùng hash set cho từng anchor nhưng duplicate handling phức tạp hơn và tốn `O(n)` memory. Sort cho lời giải deterministic và sạch hơn.

### Follow-up 2

**Q (EN):** How would this generalize to 4Sum or kSum?

**Q (VI):** Mở rộng sang 4Sum hoặc kSum thế nào?

**EN:** Sort first, recursively fix one value and reduce `kSum` to `(k-1)Sum`, with Two Sum as the base case. Duplicate skipping is applied at every recursion level.

**VI:** Sort trước, đệ quy fix một value để giảm `kSum` thành `(k-1)Sum`, với Two Sum là base case. Mỗi level đều skip duplicate.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I sort the input and loop over each distinct anchor. I stop once the anchor becomes positive. For each anchor I scan the suffix with two pointers. A low sum moves left, a high sum moves right, and a zero sum is recorded before moving both pointers past duplicates.

**VI:** Em sort input, lặp qua từng distinct anchor và dừng khi anchor dương. Với mỗi anchor em scan suffix bằng two pointers. Sum thấp tăng left, sum cao giảm right; sum `0` thì lưu rồi đưa cả hai pointers qua các duplicate.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Nói `O(n²)` nhưng code thực tế dùng `contains()` tuyến tính trong result và làm complexity khó kiểm soát.
- Dùng `HashSet` output nhưng không giải thích duplicate semantics.
- Skip duplicate sai vị trí và bỏ sót valid pair.
- Quên rằng input bị sort/mutate.
- Không giải thích vì sao pointer movement an toàn.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- triplet — bộ ba
- anchor — phần tử cố định
- sorted suffix — đoạn suffix đã sắp xếp
- duplicate skipping — bỏ qua giá trị trùng
- monotonic movement — di chuyển đơn điệu
- distinct result — kết quả phân biệt
