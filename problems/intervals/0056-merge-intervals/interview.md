# 56. Merge Intervals — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I sort the intervals by start time, then scan once while maintaining the current merged interval. If the next interval starts before or at the current end, I extend the current end to the maximum end. Otherwise, I append the current interval and start a new one. Sorting costs `O(n log n)` and the scan is linear.

**VI:** Em sort các interval theo start rồi scan một lần. Nếu interval kế tiếp bắt đầu trước hoặc tại current end thì merge bằng cách lấy end lớn nhất; nếu không overlap thì đưa current interval vào kết quả và bắt đầu interval mới. Tổng thời gian là `O(n log n)` do bước sort.

---

## 2. Core approach questions / Câu hỏi về hướng giải chính

### Q1 — Core practice question

**Q (EN):** Why do you sort the intervals first?

**Q (VI):** Vì sao cần sort các interval trước?

### Short answer (EN)

Sorting by start makes every possible continuation of the current merged interval appear in scan order, so overlap decisions become local.

### Trả lời ngắn (VI)

Sort theo start giúp các interval có khả năng nối với current group xuất hiện liên tiếp, nên chỉ cần scan tuần tự.

### Standard answer (EN)

Without sorting, an interval that overlaps the current one may appear anywhere later in the input. After sorting by start, once I see an interval whose start is greater than the current merged end, every later interval starts even farther to the right. That means the current merged interval is final and can be safely emitted.

### Trả lời chuẩn (VI)

Nếu không sort, interval overlap có thể nằm ở bất kỳ vị trí nào. Sau khi sort theo start, khi gặp `nextStart > currentEnd`, mọi interval phía sau cũng có start không nhỏ hơn `nextStart`, nên current group chắc chắn không thể mở rộng thêm.

### Q2 — Core practice question

**Q (EN):** What condition tells you that two intervals overlap?

**Q (VI):** Điều kiện nào cho biết hai interval overlap?

### Short answer (EN)

After sorting, they overlap when `nextStart <= currentEnd`.

### Trả lời ngắn (VI)

Sau khi sort, overlap khi `nextStart <= currentEnd`.

### Standard answer (EN)

The current merged interval covers every point up to `currentEnd`. If the next interval starts at or before that endpoint, they share at least one point. Equality must count because the problem considers `[1,4]` and `[4,5]` overlapping.

### Trả lời chuẩn (VI)

Current interval bao phủ tới `currentEnd`. Nếu interval mới bắt đầu trước hoặc đúng tại điểm đó thì hai khoảng có điểm chung. Dấu bằng bắt buộc vì `[1,4]` và `[4,5]` cũng phải merge.

---

## 3. Why / correctness questions / Câu hỏi vì sao đúng

### Q3 — Common reasoning check

**Q (EN):** Why is it safe to output the current interval when `nextStart > currentEnd`?

**Q (VI):** Vì sao có thể chốt current interval khi `nextStart > currentEnd`?

### Short answer (EN)

Because the array is sorted by start, every later interval starts at least as late as `nextStart`, so none can overlap the current interval.

### Trả lời ngắn (VI)

Vì đã sort theo start, mọi interval phía sau bắt đầu không sớm hơn `nextStart`, nên không thể overlap current interval.

### Standard answer (EN)

At that moment there is a strict gap between the current end and the next start. Since starts are nondecreasing, all remaining starts are also beyond the current end. Therefore the union represented by the current interval cannot change anymore, so emitting it preserves correctness.

### Trả lời chuẩn (VI)

Lúc đó đã xuất hiện một gap thật sự. Do start các interval còn lại chỉ tăng hoặc giữ nguyên, không interval tương lai nào có thể quay lại nối với current group, nên current group đã final.

### Q4 — Common reasoning check

**Q (EN):** Why do you use `max(currentEnd, nextEnd)` when intervals overlap?

**Q (VI):** Vì sao khi overlap phải dùng `max(currentEnd, nextEnd)`?

### Short answer (EN)

The next interval may be fully contained inside the current one, so its end can be smaller.

### Trả lời ngắn (VI)

Interval mới có thể nằm hoàn toàn bên trong current interval nên end của nó có thể nhỏ hơn.

### Standard answer (EN)

Merging means taking the union. The union starts at the current start and ends at the farther of the two right endpoints. Assigning `nextEnd` directly would incorrectly shrink cases such as `[1,10]` followed by `[2,3]`.

### Trả lời chuẩn (VI)

Merge là lấy union, nên điểm kết thúc phải là endpoint xa nhất. Nếu gán thẳng `nextEnd`, trường hợp `[1,10]` rồi `[2,3]` sẽ làm current interval bị thu nhỏ sai.

---

## 4. Complexity questions / Câu hỏi độ phức tạp

### Q5 — Core practice question

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n log n)` time because of sorting, followed by an `O(n)` scan. The result can require `O(n)` space.

### Trả lời ngắn (VI)

`O(n log n)` time do sort, sau đó scan `O(n)`. Output có thể cần `O(n)` space.

### Standard answer (EN)

Sorting dominates the runtime at `O(n log n)`. Each interval is then processed once, so the sweep is `O(n)`. In the worst case all intervals are disjoint, so the returned array contains `n` intervals; this implementation also stores those merged intervals in a list before converting to `int[][]`.

### Trả lời chuẩn (VI)

Sort chi phối với `O(n log n)`, còn sweep chỉ `O(n)`. Nếu mọi interval đều disjoint thì output có `n` interval, nên implementation này dùng `O(n)` space tính cả output/list kết quả.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q6 — Likely follow-up

**Q (EN):** How does your solution handle intervals that only touch at one endpoint?

**Q (VI):** Solution xử lý hai interval chỉ chạm nhau tại một endpoint thế nào?

### Short answer (EN)

I use `<=`, so touching intervals are merged.

### Trả lời ngắn (VI)

Em dùng `<=`, nên touching intervals vẫn được merge.

### Standard answer (EN)

The problem explicitly treats `[1,4]` and `[4,5]` as overlapping. Therefore the merge condition must be `nextStart <= currentEnd`; using a strict `<` would incorrectly return them separately.

### Trả lời chuẩn (VI)

Đề bài nói rõ `[1,4]` và `[4,5]` overlap. Vì vậy condition phải là `<=`; nếu dùng `<` sẽ tách sai hai interval này.

### Q7 — Likely follow-up

**Q (EN):** What happens with nested intervals such as `[1,10]` and `[2,3]`?

**Q (VI):** Trường hợp nested intervals như `[1,10]` và `[2,3]` thì sao?

### Short answer (EN)

They merge to `[1,10]` because I keep the maximum end.

### Trả lời ngắn (VI)

Kết quả vẫn là `[1,10]` vì em lấy end lớn nhất.

### Standard answer (EN)

The second interval starts before the current end, so it overlaps. Its end is smaller, and `max(10,3)` keeps the current end at `10`, which correctly represents the union.

### Trả lời chuẩn (VI)

Interval thứ hai overlap nhưng nằm trong interval đầu. `max(10,3)` giữ end là `10`, đúng với union thực tế.

---

## 6. Alternative-approach and trade-off questions / Hướng khác và trade-off

### Q8 — Likely follow-up

**Q (EN):** Can you solve this without sorting?

**Q (VI):** Có thể giải mà không sort không?

### Short answer (EN)

Not efficiently for arbitrary unsorted input; repeated pairwise merging can degrade toward quadratic work.

### Trả lời ngắn (VI)

Với input bất kỳ thì khó làm hiệu quả; merge pairwise lặp lại có thể tiến gần `O(n^2)`.

### Standard answer (EN)

If the input were already sorted by start, I could skip sorting and solve it in linear time. For arbitrary order, sorting provides the structure needed for a one-pass merge. A brute-force approach can repeatedly search for overlapping pairs, but it is more complex and typically slower.

### Trả lời chuẩn (VI)

Nếu input đã sorted theo start thì chỉ cần `O(n)`. Nhưng với thứ tự bất kỳ, sorting là bước tạo cấu trúc để sweep một lần. Brute force tìm các cặp overlap lặp đi lặp lại vừa khó code vừa dễ thành quadratic.

---

## 7. Code walkthrough questions / Câu hỏi walkthrough code

### Q9 — Code walkthrough

**Q (EN):** Why do you delay adding an interval to the result until you find a gap?

**Q (VI):** Vì sao không add current interval ngay mà phải đợi gặp gap?

### Short answer (EN)

Because later overlapping intervals may still extend its end.

### Trả lời ngắn (VI)

Vì các interval overlap phía sau vẫn có thể kéo dài end của current interval.

### Standard answer (EN)

The current interval represents a group that is still open. As long as the next start is within the current end, the group's union can grow. A gap proves that the group is complete, so that is the first safe time to append it.

### Trả lời chuẩn (VI)

Current group vẫn đang mở và có thể tiếp tục mở rộng. Chỉ khi xuất hiện gap thì mới chứng minh group đã hoàn tất, lúc đó mới nên add vào result.

---

## 8. Follow-up variations / Biến thể follow-up

- Nếu input đã sorted theo start: bỏ bước sort, runtime còn `O(n)`.
- Nếu cần chỉ đếm số merged intervals: vẫn sweep tương tự nhưng chỉ tăng counter khi đóng group.
- Nếu cần tìm gaps: sau khi merge xong, scan các merged intervals liền kề.
- Nếu interval là half-open `[start,end)`, điều kiện touching có thể thay đổi tùy semantic của bài.
- Nếu dữ liệu đến theo stream nhưng đã sorted theo start, có thể merge online với một current interval.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Quên sort input chưa có thứ tự.
- Dùng `<` thay vì `<=`.
- Dùng `currentEnd = nextEnd` thay vì `max`.
- Quên append interval cuối sau vòng lặp.
- Không giải thích vì sao sau khi gặp gap thì current interval đã final.
- Nói space `O(1)` mà quên output/list trong implementation thực tế.

---

## 10. Useful phrases and vocabulary / Cụm từ và từ vựng hữu ích

- **"I sort by the start coordinate first."** — Em sort theo điểm bắt đầu trước.
- **"Then I sweep from left to right."** — Sau đó em quét từ trái sang phải.
- **"These two intervals overlap because the next start is not greater than the current end."** — Hai interval overlap vì start tiếp theo không lớn hơn end hiện tại.
- **"I extend the right endpoint to the maximum end."** — Em mở rộng endpoint bên phải tới end lớn nhất.
- **"Once I see a gap, the current merged interval is final."** — Khi gặp gap, current merged interval đã hoàn tất.
- **"Sorting dominates the runtime."** — Bước sort chi phối runtime.
- **union of intervals** — hợp của các khoảng.
- **overlapping intervals** — các khoảng chồng lấn.
- **disjoint intervals** — các khoảng rời nhau.
- **nested interval** — khoảng nằm hoàn toàn trong khoảng khác.
