# 502. IPO — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I use a min-heap by required capital to discover all currently affordable projects and a max-heap by profit to choose the best one. At each of up to k rounds I move every affordable project into the profit heap, stop if none is available, otherwise take the maximum profit and increase capital. Nonnegative profits make this greedy choice safe.

**VI:** Tôi dùng min-heap để mở khóa và max-heap để chọn profit lớn nhất mỗi vòng.

## 2. Core approach questions
**Q (EN):** Why two heaps?

**Q (VI):** Vì sao hai heap?

### Short answer (EN)
One manages eligibility; one maximizes profit among eligible projects.

### Trả lời ngắn (VI)
Một heap quản lý điều kiện vốn, một heap chọn profit lớn nhất.

### Standard answer (EN)
The two orderings are different and both must be queried efficiently as capital changes.

### Trả lời chuẩn (VI)
Ta cần hai thứ tự khác nhau khi vốn thay đổi.

## 3. Why / correctness questions
**Q (EN):** Why is max profit greedy safe?

**Q (VI):** Vì sao greedy max profit đúng?

### Short answer (EN)
It maximizes current capital and cannot reduce future eligibility.

### Trả lời ngắn (VI)
Nó tạo vốn lớn nhất và không giảm lựa chọn tương lai.

### Standard answer (EN)
With nonnegative profits, replacing any feasible choice by a larger feasible profit leaves at least as much capital for every later step.

### Trả lời chuẩn (VI)
Exchange sang profit lớn hơn luôn để lại vốn không nhỏ hơn cho các bước sau.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O((n+k) log n) time, O(n) space.

### Trả lời ngắn (VI)
O((n+k) log n), O(n).

### Standard answer (EN)
Each project moves through the heaps at most once, plus at most k max-heap polls.

### Trả lời chuẩn (VI)
Mỗi project chỉ được chuyển một lần và poll tối đa k lần.

## 5. Edge-case questions
**Q (EN):** When can we stop early?

**Q (VI):** Khi nào dừng sớm?

### Short answer (EN)
When no affordable project exists.

### Trả lời ngắn (VI)
Khi profit heap rỗng sau khi mở khóa.

### Standard answer (EN)
If no project meets current capital, no action can increase capital, so no future project can become feasible.

### Trả lời chuẩn (VI)
Không có action khả thi thì vốn không tăng và không thể mở khóa thêm.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Can we sort instead of using the capital heap?

**Q (VI):** Có thể sort thay capital heap không?

### Short answer (EN)
Yes, sort projects by capital and scan with a pointer.

### Trả lời ngắn (VI)
Có, sort theo capital rồi dùng pointer.

### Standard answer (EN)
Sorting once plus a max-heap is equally standard and has the same asymptotic complexity.

### Trả lời chuẩn (VI)
Sort một lần + max-heap có complexity tương đương.

## 7. Code walkthrough questions
**Q (EN):** Why move all affordable projects before choosing?

**Q (VI):** Vì sao phải chuyển tất cả project affordable trước khi chọn?

### Short answer (EN)
The true maximum profit might be among any of them.

### Trả lời ngắn (VI)
Max profit có thể thuộc bất kỳ project vừa đủ vốn nào.

### Standard answer (EN)
Greedy correctness assumes the max over the complete feasible set, not a partial set.

### Trả lời chuẩn (VI)
Greedy cần xét toàn bộ feasible set.

## 8. Follow-up variations
**Q (EN):** What if profits could be negative?

**Q (VI):** Nếu profit có thể âm?

### Short answer (EN)
Because selection is “at most k”, stop instead of taking a nonpositive harmful project.

### Trả lời ngắn (VI)
Vì chỉ cần tối đa k, có thể dừng thay vì chọn project làm giảm vốn.

### Standard answer (EN)
The nonnegative-profit exchange argument would need adjustment; early stopping becomes essential.

### Trả lời chuẩn (VI)
Proof greedy phải thay đổi và điều kiện dừng trở nên quan trọng.

## 9. Common interviewer traps
Ignoring feasibility, not stopping when no project is available, confusing at-most-k with exactly-k.

## 10. Useful phrases and vocabulary
`dynamic eligibility`, `maximize feasible profit`, `unlock projects`, `exchange argument`.
