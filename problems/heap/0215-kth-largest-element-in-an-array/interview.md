# 215. Kth Largest Element in an Array — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I maintain a min-heap of at most k values. For every number I insert it and evict the minimum if size exceeds k. The heap therefore holds the k largest values seen, and its root is the kth largest at the end. This is O(n log k) time and O(k) space.

**VI:** Tôi giữ min-heap top-k; root cuối cùng là kth largest.

## 2. Core approach questions
**Q (EN):** Why a min-heap rather than max-heap?

**Q (VI):** Vì sao dùng min-heap?

### Short answer (EN)
We need to evict the smallest member of the top-k set.

### Trả lời ngắn (VI)
Ta cần loại phần tử nhỏ nhất trong top-k.

### Standard answer (EN)
The minimum is exactly the threshold that should be removed whenever a better candidate arrives.

### Trả lời chuẩn (VI)
Root là ngưỡng top-k và là phần tử cần loại khi heap quá lớn.

## 3. Why / correctness questions
**Q (EN):** Why is heap.peek() the answer?

**Q (VI):** Vì sao `peek()` là đáp án?

### Short answer (EN)
It is the smallest among the k largest elements.

### Trả lời ngắn (VI)
Nó nhỏ nhất trong k phần tử lớn nhất.

### Standard answer (EN)
That rank is precisely kth largest when duplicates count normally.

### Trả lời chuẩn (VI)
Vị trí đó chính xác là thứ k theo thứ tự giảm dần.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(n log k) time, O(k) space.

### Trả lời ngắn (VI)
O(n log k), O(k).

### Standard answer (EN)
Each element triggers at most one insertion and one removal on a size-k heap.

### Trả lời chuẩn (VI)
Mỗi phần tử có tối đa một offer và một poll trên heap size k.

## 5. Edge-case questions
**Q (EN):** Do duplicates matter?

**Q (VI):** Duplicate xử lý thế nào?

### Short answer (EN)
They are kept as separate occurrences.

### Trả lời ngắn (VI)
Mỗi lần xuất hiện được tính riêng.

### Standard answer (EN)
The problem asks for sorted-order rank, not distinct rank, so no deduplication is performed.

### Trả lời chuẩn (VI)
Đề không yêu cầu distinct nên không deduplicate.

## 6. Alternative-approach and trade-off questions
**Q (EN):** What is faster on average?

**Q (VI):** Cách nào nhanh hơn trung bình?

### Short answer (EN)
Quickselect can be O(n) average.

### Trả lời ngắn (VI)
Quickselect có O(n) average.

### Standard answer (EN)
Quickselect trades deterministic heap bounds for in-place partitioning and average linear performance.

### Trả lời chuẩn (VI)
Quickselect dùng partition in-place, trung bình tuyến tính nhưng worst-case kém hơn nếu pivot xấu.

## 7. Code walkthrough questions
**Q (EN):** Why poll only when size exceeds k?

**Q (VI):** Vì sao chỉ poll khi size > k?

### Short answer (EN)
We must retain exactly k best candidates.

### Trả lời ngắn (VI)
Cần giữ đúng k candidate tốt nhất.

### Standard answer (EN)
Before k elements exist no candidate can be discarded; after that, the minimum is disposable.

### Trả lời chuẩn (VI)
Trước khi đủ k thì chưa được bỏ; sau đó minimum là phần tử dư.

## 8. Follow-up variations
**Q (EN):** How would this work for a data stream?

**Q (VI):** Nếu dữ liệu stream thì sao?

### Short answer (EN)
Use the same bounded heap incrementally.

### Trả lời ngắn (VI)
Giữ heap và cập nhật sau mỗi phần tử mới.

### Standard answer (EN)
The invariant depends only on the processed prefix, so it naturally supports streaming updates.

### Trả lời chuẩn (VI)
Invariant top-k theo prefix nên hoạt động online tự nhiên.

## 9. Common interviewer traps
Distinct-vs-occurrence rank; choosing wrong heap orientation; sorting despite follow-up.

## 10. Useful phrases and vocabulary
`top-k invariant`, `bounded min-heap`, `streaming rank`, `evict the threshold`.
