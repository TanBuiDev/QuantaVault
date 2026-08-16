# 57. Insert Interval — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** Because the original intervals are already sorted and non-overlapping, I can solve this in one pass without sorting. I first copy intervals completely before the new interval, then merge every interval that overlaps it, append the merged result once, and finally copy the remaining intervals. The runtime is `O(n)`.

**VI:** Vì input đã sorted và non-overlapping, em không cần sort lại. Em copy phần nằm trước, merge toàn bộ block overlap với `newInterval`, add merged interval đúng một lần, rồi copy phần còn lại. Runtime là `O(n)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1 — Core practice question

**Q (EN):** Why can this problem be solved in linear time?

**Q (VI):** Vì sao bài này có thể giải trong `O(n)`?

### Short answer (EN)

The input is already sorted by start and the original intervals do not overlap, so one left-to-right scan is enough.

### Trả lời ngắn (VI)

Input đã sorted và non-overlapping nên chỉ cần scan từ trái sang phải một lần.

### Standard answer (EN)

The ordering guarantees that intervals completely before, overlapping, and completely after the new interval each form contiguous regions in the array. I never need to revisit an interval or search globally for another overlap.

### Trả lời chuẩn (VI)

Nhờ thứ tự sẵn có, ba nhóm before / overlap / after xuất hiện liên tiếp. Mỗi interval chỉ được xét một lần và không cần quay lại tìm overlap ở vị trí khác.

### Q2 — Core practice question

**Q (EN):** How do you divide the scan into phases?

**Q (VI):** Bạn chia quá trình scan thành các phase thế nào?

### Short answer (EN)

First intervals strictly before the new one, then the overlap block, then intervals strictly after the merged interval.

### Trả lời ngắn (VI)

Phase 1 là phần nằm hẳn trước, phase 2 là block overlap, phase 3 là phần nằm hẳn sau.

### Standard answer (EN)

I copy while `interval.end < mergedStart`, merge while `interval.start <= mergedEnd`, append the merged interval once, and then copy the rest. Those conditions preserve both sorted order and non-overlap.

### Trả lời chuẩn (VI)

Em copy khi `end < mergedStart`, merge khi `start <= mergedEnd`, add merged interval một lần rồi copy phần còn lại. Hai điều kiện này giữ đúng sorted order và non-overlap.

---

## 3. Why / correctness questions / Câu hỏi vì sao đúng

### Q3 — Common reasoning check

**Q (EN):** Why does the overlap phase form one contiguous block?

**Q (VI):** Vì sao các interval cần merge tạo thành một block liên tiếp?

### Short answer (EN)

Because the input is sorted and originally non-overlapping.

### Trả lời ngắn (VI)

Vì input đã sorted và các interval ban đầu không overlap nhau.

### Standard answer (EN)

Once the scan reaches an interval that starts after the current merged end, every later interval starts even farther right. Therefore overlap cannot resume later, so all intervals that merge with the inserted interval appear consecutively.

### Trả lời chuẩn (VI)

Khi đã gặp interval có start lớn hơn merged end, mọi interval phía sau còn bắt đầu muộn hơn nữa, nên overlap không thể xuất hiện lại. Vì vậy overlap region chỉ có một block liên tục.

### Q4 — Common reasoning check

**Q (EN):** Why do you update both the start and the end during merging?

**Q (VI):** Vì sao khi merge phải cập nhật cả start và end?

### Short answer (EN)

The new interval may start inside or after an existing overlapping interval, and it may end before or after that interval.

### Trả lời ngắn (VI)

`newInterval` có thể bắt đầu hoặc kết thúc bên trong interval cũ, nên phải lấy min start và max end.

### Standard answer (EN)

The merged interval represents the union of everything seen in the overlap block. Its left boundary must be the minimum start and its right boundary must be the maximum end of all those intervals.

### Trả lời chuẩn (VI)

Merged interval là union của toàn bộ overlap block, nên biên trái phải là start nhỏ nhất và biên phải là end lớn nhất.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5 — Core practice question

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(n)` space including the returned result.

### Trả lời ngắn (VI)

`O(n)` time và `O(n)` space tính cả output.

### Standard answer (EN)

Each original interval moves through exactly one of the three phases, so the scan is linear. The returned array can contain up to `n + 1` intervals, while the extra state excluding output is constant.

### Trả lời chuẩn (VI)

Mỗi interval chỉ đi qua đúng một phase nên scan là `O(n)`. Output tối đa có `n+1` interval; ngoài output chỉ cần vài biến nên auxiliary state là `O(1)`.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q6 — Likely follow-up

**Q (EN):** Why is phase one based on `interval.end < newStart` instead of `<=`?

**Q (VI):** Vì sao phase 1 dùng `<` thay vì `<=`?

### Short answer (EN)

Intervals that touch at one endpoint are considered overlapping.

### Trả lời ngắn (VI)

Vì touching endpoints cũng được xem là overlap.

### Standard answer (EN)

If an old interval ends exactly at the new interval's start, they share that endpoint and must be merged. Therefore only intervals whose end is strictly smaller can be copied as definitely-before intervals.

### Trả lời chuẩn (VI)

Nếu old end bằng new start thì hai interval có chung endpoint và phải merge. Chỉ `end < newStart` mới chứng minh interval nằm hoàn toàn trước.

### Q7 — Likely follow-up

**Q (EN):** How does the algorithm handle an empty interval array?

**Q (VI):** Nếu `intervals` rỗng thì sao?

### Short answer (EN)

Both scan loops are skipped and the result contains only `newInterval`.

### Trả lời ngắn (VI)

Hai loop đều bỏ qua và kết quả chỉ chứa `newInterval`.

### Standard answer (EN)

The merged boundaries are initialized from `newInterval`, so even with no old intervals the algorithm appends that interval once and returns correctly without any special-case branch.

### Trả lời chuẩn (VI)

Merged start/end được khởi tạo từ `newInterval`, nên khi input rỗng thuật toán vẫn add nó đúng một lần mà không cần special case riêng.

---

## 6. Alternative-approach and trade-off questions / Hướng khác và trade-off

### Q8 — Likely follow-up

**Q (EN):** Could you append the new interval and reuse Merge Intervals?

**Q (VI):** Có thể append interval mới rồi dùng lại bài Merge Intervals không?

### Short answer (EN)

Yes, but it would sort again and take `O(n log n)` instead of using the existing order for `O(n)`.

### Trả lời ngắn (VI)

Có, nhưng phải sort lại nên thành `O(n log n)` thay vì tận dụng input để đạt `O(n)`.

### Standard answer (EN)

That solution is correct and simpler to derive if Merge Intervals already exists, but it ignores an important constraint: the original intervals are already sorted and non-overlapping. A direct three-phase scan is both faster and demonstrates better use of the problem's structure.

### Trả lời chuẩn (VI)

Cách đó đúng nhưng bỏ phí constraint quan trọng của đề. Three-phase scan vừa nhanh hơn vừa thể hiện việc tận dụng cấu trúc input tốt hơn.

---

## 7. Code walkthrough questions / Câu hỏi walkthrough code

### Q9 — Code walkthrough

**Q (EN):** Why do you append the merged interval only once after the overlap loop?

**Q (VI):** Vì sao chỉ add merged interval một lần sau overlap loop?

### Short answer (EN)

All overlapping intervals belong to one union, so adding intermediate versions would create duplicates or overlapping output.

### Trả lời ngắn (VI)

Toàn bộ overlap block tạo thành một union; add từng trạng thái trung gian sẽ tạo output trùng hoặc còn overlap.

### Standard answer (EN)

During the loop the merged boundaries are still evolving. Only after the loop ends do I know the complete union. Appending once at that point guarantees one final non-overlapping interval for the entire block.

### Trả lời chuẩn (VI)

Trong loop, merged boundaries vẫn có thể mở rộng. Chỉ khi loop kết thúc mới biết union cuối cùng, nên lúc đó mới add đúng một interval final.

---

## 8. Follow-up variations / Biến thể follow-up

- Nếu input không sorted: phải sort hoặc chuyển về bài 56.
- Nếu cần insert nhiều interval mới: có thể merge batch hoặc dùng cấu trúc dữ liệu phù hợp hơn tùy workload.
- Nếu intervals là half-open ranges, touching semantics có thể khác.
- Nếu chỉ cần kiểm tra `newInterval` có overlap hay không, có thể dừng sớm khi đi qua vị trí phù hợp.
- Nếu cần in-place tối đa, có thể cân nhắc reuse array storage nhưng code phức tạp hơn và output length thay đổi.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Sort lại dù đề đã cho sorted input.
- Dùng sai dấu ở phase before/overlap.
- Chỉ merge với interval đầu tiên overlap rồi dừng quá sớm.
- Không cập nhật `mergedEnd`, làm bỏ sót chain overlap.
- Quên add `newInterval` khi input rỗng hoặc khi nó nằm giữa hai interval.
- Làm thay đổi `newInterval` không cần thiết rồi khó giải thích side effect.

---

## 10. Useful phrases and vocabulary / Cụm từ hữu ích

- **"The input is already sorted and non-overlapping."** — Input đã sorted và non-overlapping.
- **"I can preserve that invariant with one linear scan."** — Em có thể giữ invariant đó bằng một linear scan.
- **"I split the scan into before, overlap, and after phases."** — Em chia scan thành before, overlap và after.
- **"The overlap block expands the merged boundaries."** — Overlap block mở rộng merged boundaries.
- **"Once the next start is greater than the merged end, merging is finished."** — Khi next start lớn hơn merged end thì merge đã hoàn tất.
- **contiguous block** — block liên tiếp.
- **merged interval** — interval sau khi gộp.
- **preserve sorted order** — giữ thứ tự đã sort.
- **strictly before / strictly after** — nằm hoàn toàn trước / sau.
