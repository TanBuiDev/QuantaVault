# 88. Merge Sorted Array — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I use three pointers and merge from right to left. `i` points to the last valid element in `nums1`, `j` points to the last element in `nums2`, and `write` points to the last position of `nums1`. I repeatedly place the larger of `nums1[i]` and `nums2[j]` at `nums1[write]`. Merging backward avoids overwriting valid values in `nums1`. The algorithm runs in `O(m + n)` time and uses `O(1)` extra space.

**VI:** Em dùng ba con trỏ và merge từ phải sang trái. `i` trỏ tới phần tử hợp lệ cuối của `nums1`, `j` trỏ tới phần tử cuối của `nums2`, còn `write` trỏ tới vị trí cuối của `nums1`. Mỗi bước em đặt phần tử lớn hơn vào `nums1[write]`. Đi từ cuối giúp tránh ghi đè dữ liệu hợp lệ. Thuật toán chạy `O(m + n)` và dùng `O(1)` bộ nhớ phụ.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Can you explain your approach?

**Q (VI):** Bạn có thể giải thích cách tiếp cận không?

### Short answer (EN)

Merge from the end of both sorted arrays into the free space at the end of `nums1` using three pointers.

### Trả lời ngắn (VI)

Merge từ cuối hai mảng vào vùng trống cuối `nums1` bằng ba con trỏ.

### Standard answer (EN)

I start `i` at `m - 1`, `j` at `n - 1`, and `write` at `m + n - 1`. At each step I compare the current largest remaining values. I write the larger one to `nums1[write]` and move the corresponding pointer. I continue until every value from `nums2` has been placed.

### Trả lời chuẩn (VI)

Em đặt `i = m - 1`, `j = n - 1`, `write = m + n - 1`. Mỗi bước em so sánh hai phần tử lớn nhất còn lại, ghi phần tử lớn hơn vào `nums1[write]`, rồi giảm con trỏ tương ứng. Em tiếp tục cho tới khi `nums2` được xử lý hết.

### Deep answer (EN)

The key is that the unused capacity is at the end of `nums1`. Filling from that end means the destination is always safe to overwrite. Since both remaining prefixes are sorted, the largest remaining value is always one of the two values at `i` or `j`, so greedy placement from the back is correct.

### Trả lời sâu (VI)

Điểm mấu chốt là vùng trống nằm ở cuối `nums1`. Vì ghi từ cuối nên vị trí đích luôn an toàn để ghi đè. Hai prefix chưa xử lý đều đã sort, do đó phần tử lớn nhất còn lại luôn là một trong `nums1[i]` hoặc `nums2[j]`; chọn greedy từ cuối là đúng.

---

### Q2

**Q (EN):** Why do you merge backward instead of forward?

**Q (VI):** Tại sao merge từ cuối thay vì từ đầu?

### Short answer (EN)

Forward merging can overwrite valid values in `nums1`; backward merging writes into unused capacity.

### Trả lời ngắn (VI)

Merge từ đầu có thể ghi đè dữ liệu chưa dùng; merge từ cuối ghi vào vùng trống.

### Standard answer (EN)

The first `m` cells of `nums1` contain useful data, while the free cells are at the end. If I write a small value at the front, I may destroy a `nums1` value that I still need. From the back, every write position is either unused or already safe to replace.

### Trả lời chuẩn (VI)

`m` ô đầu của `nums1` chứa dữ liệu cần giữ, còn vùng trống ở cuối. Nếu ghi từ đầu, em có thể phá một phần tử `nums1` chưa xử lý. Khi đi từ cuối, vị trí ghi luôn thuộc vùng an toàn.

---

### Q3

**Q (EN):** Why is the loop condition only `j >= 0`?

**Q (VI):** Tại sao vòng lặp chỉ cần điều kiện `j >= 0`?

### Short answer (EN)

Because only leftover values from `nums2` need to be copied; leftover values from `nums1` are already in place.

### Trả lời ngắn (VI)

Vì chỉ phần dư của `nums2` cần chép; phần dư của `nums1` đã ở đúng vị trí.

### Standard answer (EN)

If `nums2` is exhausted, any unprocessed prefix of `nums1` is already in its final positions, so the algorithm can stop. If `nums1` is exhausted first, `j` is still non-negative and the loop naturally copies the remaining `nums2` values.

### Trả lời chuẩn (VI)

Nếu `nums2` hết, prefix còn lại của `nums1` đã chính là phần đầu của kết quả nên có thể dừng. Nếu `nums1` hết trước, `j` vẫn chưa âm và vòng lặp tiếp tục chép phần còn lại của `nums2`.

---

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(m + n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(m + n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

Each pointer only moves left, so each input element is processed at most once. The algorithm uses only three integer indices, therefore the extra space is constant.

### Trả lời chuẩn (VI)

Mỗi con trỏ chỉ đi sang trái nên mỗi phần tử được xử lý nhiều nhất một lần. Thuật toán chỉ dùng ba biến chỉ số nên bộ nhớ phụ là hằng số.

---

### Q5

**Q (EN):** What happens when `m = 0`?

**Q (VI):** Điều gì xảy ra khi `m = 0`?

### Short answer (EN)

`i` starts at `-1`, so every value from `nums2` is copied into `nums1`.

### Trả lời ngắn (VI)

`i = -1`, nên toàn bộ `nums2` được chép vào `nums1`.

---

### Q6

**Q (EN):** What happens when `n = 0`?

**Q (VI):** Điều gì xảy ra khi `n = 0`?

### Short answer (EN)

`j` starts at `-1`; the loop never runs and `nums1` is already the answer.

### Trả lời ngắn (VI)

`j = -1`, vòng lặp không chạy và `nums1` đã là kết quả.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** Could you solve it with an auxiliary array first?

**Q (VI):** Bạn có thể giải trước bằng một mảng phụ không?

**EN:** Yes. A standard two-pointer merge into a new array takes `O(m + n)` time but also `O(m + n)` extra space. It is simpler conceptually but does not satisfy the strongest in-place target.

**VI:** Có. Merge bằng two pointers vào một mảng mới vẫn tốn `O(m + n)` thời gian nhưng cần `O(m + n)` bộ nhớ phụ. Cách đó dễ hiểu hơn nhưng không tối ưu không gian.

### Follow-up 2

**Q (EN):** Does choosing from `nums1` or `nums2` first when values are equal matter?

**Q (VI):** Khi hai giá trị bằng nhau, chọn từ `nums1` hay `nums2` trước có quan trọng không?

**EN:** Not for this problem. The required output only needs to be sorted; stability across the two source arrays is not required.

**VI:** Không. Bài chỉ yêu cầu kết quả được sort; không yêu cầu tính ổn định giữa hai mảng nguồn.

---

## 4. Code walkthrough / Giải thích code khi phỏng vấn

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code từng phần không?

**EN:** First I initialize the three indices. The loop runs while `nums2` still has values. If `nums1` still has a value and that value is larger than `nums2[j]`, I write it at `write`; otherwise I write `nums2[j]`. Every write moves `write` left. When `j` becomes `-1`, the merge is complete.

**VI:** Đầu tiên em khởi tạo ba chỉ số. Vòng lặp chạy khi `nums2` còn phần tử. Nếu `nums1` còn phần tử và `nums1[i]` lớn hơn `nums2[j]`, em ghi nó vào `write`; ngược lại em ghi `nums2[j]`. Sau mỗi lần ghi, `write` giảm một. Khi `j = -1`, quá trình merge hoàn tất.

---

## 5. Common reasoning checks / Bẫy tư duy thường gặp

- Đừng nói rằng các số `0` cuối `nums1` là dữ liệu cần sort; chúng chỉ là placeholder theo contract của đề.
- Đừng dùng `nums1.length - 1` làm con trỏ dữ liệu ban đầu; con trỏ dữ liệu là `m - 1`.
- Đừng khẳng định cần copy phần dư của cả hai mảng. Chỉ phần dư `nums2` bắt buộc phải copy.
- Khi giải thích `O(1)` space, nói rõ đó là **extra space**; kết quả được lưu trực tiếp trong input.
- Đừng nhầm `O(m + n)` với `O(max(m,n))`; hai cách có cùng bậc trong nhiều phân tích nhưng `O(m + n)` mô tả trực tiếp số phần tử xử lý hơn.

---

## 6. Useful interview phrases / Cụm từ hữu ích

| English phrase | Ý nghĩa |
|---|---|
| merge from right to left | gộp từ phải sang trái |
| unused capacity at the end | vùng trống ở cuối |
| avoid overwriting valid data | tránh ghi đè dữ liệu hợp lệ |
| largest remaining element | phần tử lớn nhất còn lại |
| move the pointer to the left | dịch con trỏ sang trái |
| in-place with constant extra space | tại chỗ với bộ nhớ phụ hằng số |
