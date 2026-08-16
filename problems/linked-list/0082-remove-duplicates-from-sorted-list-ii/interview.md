# 82. Remove Duplicates from Sorted List II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** Because the list is sorted, duplicates appear as contiguous runs. I keep `prev` at the last confirmed distinct node and scan with `current`. If `current` starts a duplicate run, I skip every node with that value and connect `prev.next` to the first different node. Otherwise I advance both pointers. A dummy node handles duplicate runs at the head. The solution is `O(n)` time and `O(1)` space.

**VI:** Vì list sorted, duplicate tạo thành run liên tiếp. Em giữ `prev` ở node distinct cuối, nếu gặp duplicate thì skip cả run và nối bỏ qua; dummy xử lý duplicate ở đầu list.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why does sorted order make this problem easier?

**Q (VI):** Vì sao sorted order giúp bài này dễ hơn?

### Short answer (EN)

All occurrences of the same value are adjacent, so one scan can identify and remove an entire duplicate run.

### Trả lời ngắn (VI)

Mọi occurrence cùng value nằm cạnh nhau nên một lượt duyệt có thể phát hiện và bỏ cả run.

### Standard answer (EN)

In a sorted list, once we leave a value, that value cannot appear again later. Therefore checking adjacent nodes is enough to determine whether the current value is duplicated, and skipping until the value changes removes every occurrence of that duplicated value.

### Trả lời chuẩn (VI)

Trong list sorted, khi đã rời một value thì value đó không xuất hiện lại. Vì vậy kiểm tra neighbor và skip tới khi value đổi sẽ xử lý trọn vẹn duplicate run.

### Q2

**Q (EN):** Why does `prev` not advance when you find duplicates?

**Q (VI):** Vì sao `prev` không tiến khi gặp duplicate?

### Short answer (EN)

`prev` must remain the last node that is definitely kept so it can bypass the entire duplicate run.

### Trả lời ngắn (VI)

`prev` phải ở node chắc chắn được giữ để nối bỏ qua toàn bộ duplicate run.

### Standard answer (EN)

No node in a duplicate run belongs in the output. If `prev` entered that run, it would point to a node that must later be deleted. Keeping `prev` fixed at the last distinct node lets one assignment reconnect the valid prefix to the first node after the run.

### Trả lời chuẩn (VI)

Không node nào trong duplicate run được giữ. Vì vậy `prev` phải đứng nguyên ở node distinct trước run để reconnect prefix hợp lệ tới node sau run.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** How do you know a node is safe to keep when the adjacent value is different?

**Q (VI):** Vì sao neighbor khác value thì node hiện tại được giữ an toàn?

### Short answer (EN)

Any earlier equal value would have been adjacent in a sorted list, and any later equal value would also have to be adjacent before the value increases.

### Trả lời ngắn (VI)

Trong sorted list, nếu value lặp thì occurrence phải nằm liền nhau; neighbor khác nghĩa run hiện tại chỉ dài một.

### Standard answer (EN)

The scan always begins at the first unprocessed node of a value run. If its next node has a different value or is null, that run has length one. Sorted order guarantees the same value cannot reappear later, so the node is globally distinct and may be kept.

### Trả lời chuẩn (VI)

`current` luôn bắt đầu ở đầu một run chưa xử lý. Nếu `next` khác value hoặc null thì run dài đúng một; sorted order đảm bảo value đó không quay lại sau này.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** Why is the nested while loop still `O(n)` overall?

**Q (VI):** Vì sao có loop lồng nhau mà tổng vẫn `O(n)`?

### Short answer (EN)

The inner loop advances `current` over nodes that the outer loop will never visit again.

### Trả lời ngắn (VI)

Inner loop đi qua các node mà outer loop sẽ không quay lại.

### Standard answer (EN)

Although the loops are nested syntactically, `current` only moves forward. Across the entire execution it passes each list node at most once, so the total number of iterations is linear rather than quadratic.

### Trả lời chuẩn (VI)

Dù syntax là nested loop, `current` chỉ tiến về trước và mỗi node bị đi qua tối đa một lần, nên tổng work là `O(n)`.

### Q5

**Q (EN):** What are the space requirements?

**Q (VI):** Space complexity là bao nhiêu?

### Short answer (EN)

`O(1)` extra space.

### Trả lời ngắn (VI)

`O(1)` extra space.

### Standard answer (EN)

The algorithm rewires the existing list and stores only a dummy node, two node pointers, and one duplicate value. No auxiliary collection grows with input size.

### Trả lời chuẩn (VI)

Ta reuse list và chỉ lưu dummy, vài pointer cùng một value nên auxiliary space là hằng số.

---

## 5. Edge cases / Câu hỏi edge case

### Q6

**Q (EN):** What if the duplicate run starts at the head?

**Q (VI):** Nếu duplicate run bắt đầu ngay head thì sao?

### Short answer (EN)

The dummy node stays as `prev`, so `dummy.next` is redirected past the entire run.

### Trả lời ngắn (VI)

`prev` vẫn ở dummy và `dummy.next` được nối bỏ qua cả run.

### Standard answer (EN)

This is the main reason for using a dummy predecessor. The algorithm does not need to replace the head explicitly; after the run is skipped, returning `dummy.next` naturally returns the first surviving node or null.

### Trả lời chuẩn (VI)

Dummy loại bỏ special case thay head; skip xong chỉ cần return `dummy.next`.

---

## 6. Alternative interpretation trap / Bẫy hiểu đề

### Q7

**Q (EN):** How is this different from keeping one copy of each repeated value?

**Q (VI):** Bài này khác việc giữ lại một bản sao của duplicate như thế nào?

### Short answer (EN)

Here every occurrence of a duplicated value must be deleted.

### Trả lời ngắn (VI)

Ở bài này value nào bị lặp thì mọi occurrence của value đó đều phải xóa.

### Standard answer (EN)

For input `[1,1,2]`, the answer is `[2]`, not `[1,2]`. This distinction determines why we skip an entire duplicate run rather than merely collapsing it to one node.

### Trả lời chuẩn (VI)

Ví dụ `[1,1,2]` phải ra `[2]`, không phải `[1,2]`; vì thế ta loại bỏ toàn bộ run chứ không deduplicate còn một node.

---

## 7. Common interviewer traps / Bẫy thường gặp

- Giữ lại một node từ duplicate run.
- Advance `prev` vào run phải xóa.
- Không xử lý duplicate ở head.
- Chỉ skip hai node thay vì cả run dài.
- Nghĩ nested loops tự động thành `O(n^2)`.

## 8. Useful vocabulary / Từ vựng hữu ích

- **duplicate run** — đoạn các giá trị lặp liên tiếp.
- **distinct value** — giá trị xuất hiện duy nhất.
- **bypass a run** — nối bỏ qua cả đoạn.
- **confirmed survivor** — node đã xác nhận sẽ được giữ.
- **sorted invariant** — tính chất thứ tự đã sắp xếp.
