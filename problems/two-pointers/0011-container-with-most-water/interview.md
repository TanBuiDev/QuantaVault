# 11. Container With Most Water — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I use two pointers starting at both ends, so I begin with the maximum possible width. The area is limited by the shorter line. After evaluating the current pair, moving the taller line cannot help because the width decreases while the same shorter line still limits the height. Therefore I move the shorter line inward. Each step safely removes one endpoint, so the algorithm runs in `O(n)` time and `O(1)` extra space.

**VI:** Em dùng hai pointer ở hai đầu để bắt đầu với width lớn nhất. Area bị giới hạn bởi cạnh thấp hơn. Sau khi tính current pair, di chuyển cạnh cao hơn không giúp vì width giảm nhưng cạnh thấp vẫn là bottleneck. Vì vậy em đưa cạnh thấp hơn vào trong. Mỗi bước loại an toàn một endpoint nên đạt `O(n)` time và `O(1)` extra space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why do you move the shorter line?

**Q (VI):** Vì sao phải di chuyển cạnh thấp hơn?

### Short answer (EN)

The shorter line limits the current height. Keeping it while reducing width cannot produce a larger area.

### Trả lời ngắn (VI)

Cạnh thấp hơn giới hạn chiều cao. Giữ nó trong khi width giảm thì không thể tạo area lớn hơn.

### Standard answer (EN)

Suppose the left line is shorter. For any new right pointer inside the current interval, the width is smaller and the container height is at most the same left height. So every remaining pair that keeps this left endpoint is no better than the current pair, and I can safely discard it.

### Trả lời chuẩn (VI)

Giả sử cạnh trái thấp hơn. Với mọi right mới ở bên trong, width nhỏ hơn và container height tối đa vẫn bằng height trái. Vì vậy mọi pair còn lại giữ endpoint trái đều không tốt hơn current pair, nên có thể loại nó.

### Deep answer (EN)

This is a dominance argument. The current opposite endpoint gives the discarded shorter endpoint its maximum remaining width. Since that endpoint also caps the height, the current pair dominates every future pair that retains it.

### Trả lời sâu (VI)

Đây là dominance argument. Opposite endpoint hiện tại cho cạnh thấp sắp bị loại width lớn nhất còn lại. Vì chính cạnh đó cũng giới hạn height, current pair trội hơn mọi future pair vẫn giữ nó.

---

### Q2

**Q (EN):** Why not move the taller side?

**Q (VI):** Vì sao không di chuyển cạnh cao hơn?

### Short answer (EN)

That only reduces width while the shorter side still limits the height.

### Trả lời ngắn (VI)

Làm vậy chỉ giảm width trong khi cạnh thấp vẫn giới hạn height.

### Standard answer (EN)

If the shorter endpoint stays fixed, even finding another very tall line cannot raise the effective height above the shorter endpoint. Because the width becomes smaller, none of those pairs can beat the already evaluated current pair.

### Trả lời chuẩn (VI)

Nếu endpoint thấp vẫn giữ nguyên, dù tìm được một cạnh còn cao hơn thì effective height vẫn không vượt cạnh thấp. Width lại giảm nên các pair đó không thể thắng current pair đã xét.

---

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

Every iteration moves exactly one pointer inward, and neither pointer moves backward. Therefore there are at most `n-1` pointer moves.

### Trả lời chuẩn (VI)

Mỗi iteration đưa đúng một pointer vào trong và không pointer nào quay lại, nên tối đa có `n-1` moves.

---

### Q4

**Q (EN):** Why is choosing the two tallest lines not sufficient?

**Q (VI):** Vì sao chọn hai cột cao nhất chưa chắc đúng?

**EN:** Area depends on both height and width. Two slightly shorter lines that are much farther apart can produce a larger area than the two tallest lines.

**VI:** Area phụ thuộc cả height và width. Hai cột thấp hơn một chút nhưng cách xa nhau có thể tạo diện tích lớn hơn hai cột cao nhất.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** What if I ask for the actual pair of indices?

**Q (VI):** Nếu cần trả luôn cặp index thì sao?

**EN:** Whenever I update the maximum area, I also store the current `left` and `right`. Complexity remains `O(n)` time and `O(1)` extra space.

**VI:** Mỗi khi update max area, em lưu thêm current `left` và `right`. Complexity vẫn là `O(n)`/`O(1)`.

### Follow-up 2

**Q (EN):** Could sorting help?

**Q (VI):** Sort có giúp không?

**EN:** Sorting heights would destroy their original distances, and width is part of the objective. Keeping index order is essential.

**VI:** Sort heights sẽ phá khoảng cách index ban đầu, trong khi width là một phần của objective. Phải giữ original order.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I initialize pointers at the first and last positions. In each iteration I calculate width and the minimum endpoint height, update the best area, then move whichever endpoint is shorter. The proof shows that the removed endpoint cannot participate in a better future container.

**VI:** Em đặt pointers ở đầu và cuối. Mỗi iteration tính width, lấy min height, update best area, rồi đưa endpoint thấp hơn vào trong. Proof cho thấy endpoint bị loại không thể thuộc future container tốt hơn.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Nói “move shorter because it feels greedy” nhưng không chứng minh.
- Quên width trong công thức area.
- Di chuyển cạnh cao hơn.
- Sort array và làm mất index distance.
- Chỉ chọn hai height lớn nhất.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- bottleneck — yếu tố giới hạn
- endpoint — đầu mút
- container area — diện tích container
- maximum width — chiều rộng lớn nhất
- discard safely — loại bỏ an toàn
- dominance argument — lập luận trội
