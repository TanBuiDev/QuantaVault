# 300. Longest Increasing Subsequence — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I keep a `tails` array where `tails[i]` is the smallest possible ending value of an increasing subsequence of length `i+1`. For each number, I use binary search to find the first tail that is at least the number and replace it. If no such tail exists, I extend the array. The final size is the LIS length, with O(n log n) time and O(n) space.

**VI:** Tôi giữ minimum tail cho từng length và dùng lower-bound binary search cho mỗi phần tử.

## 2. Core approach questions

**Q (EN):** What does `tails[i]` represent?

**Q (VI):** `tails[i]` biểu diễn gì?

### Short answer (EN)

The smallest ending value seen for an increasing subsequence of length `i+1`.

### Trả lời ngắn (VI)

Tail nhỏ nhất của một subsequence tăng có length `i+1`.

### Standard answer (EN)

Among all increasing subsequences of the same length, I only need the smallest tail because it leaves the most room for future values to extend it.

### Trả lời chuẩn (VI)

Trong các subsequence cùng length, tail nhỏ nhất luôn linh hoạt nhất để được phần tử tương lai mở rộng.

## 3. Why / correctness questions

**Q (EN):** Why is replacing a tail safe?

**Q (VI):** Vì sao replace tail là an toàn?

### Short answer (EN)

It preserves the subsequence length while making its ending value no larger.

### Trả lời ngắn (VI)

Nó giữ nguyên length nhưng làm ending value tốt hơn hoặc bằng.

### Standard answer (EN)

The replacement does not claim that all values in `tails` form one subsequence. It maintains existence of some subsequence for each length with the best possible tail, which is exactly the invariant needed to compute the maximum length.

### Trả lời chuẩn (VI)

`tails` không cần là một subsequence duy nhất; nó chỉ duy trì sự tồn tại của best tail cho từng length.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(n log n) time and O(n) extra space.

### Trả lời ngắn (VI)

O(n log n) time và O(n) space.

### Standard answer (EN)

Each of `n` values performs one binary search over at most `n` tails, so the total is O(n log n).

### Trả lời chuẩn (VI)

Mỗi trong `n` phần tử binary search trên tối đa `n` tail.

## 5. Edge-case questions

**Q (EN):** Why do equal values not increase the answer?

**Q (VI):** Vì sao duplicate không tăng đáp án?

### Short answer (EN)

Because the subsequence must be strictly increasing.

### Trả lời ngắn (VI)

Vì subsequence phải tăng nghiêm ngặt.

### Standard answer (EN)

Lower bound finds the first tail greater than or equal to `x`, so an equal value replaces an existing position instead of appending a new length.

### Trả lời chuẩn (VI)

Lower bound tìm vị trí đầu tiên `>= x`, nên duplicate replace chứ không append.

## 6. Alternative-approach and trade-off questions

**Q (EN):** What is the simpler DP solution?

**Q (VI):** DP đơn giản hơn là gì?

### Short answer (EN)

Use `dp[i]` as the LIS length ending at index `i`, giving O(n^2) time.

### Trả lời ngắn (VI)

Dùng `dp[i]` là LIS ending at `i`, time O(n²).

### Standard answer (EN)

The quadratic DP is easier to derive and can help reconstruct a sequence, while the tails method is needed for the O(n log n) follow-up.

### Trả lời chuẩn (VI)

DP O(n²) dễ derive hơn; tails cần cho follow-up O(n log n).

## 7. Code walkthrough questions

**Q (EN):** Why does the binary search use `tails[mid] < x`?

**Q (VI):** Vì sao điều kiện là `tails[mid] < x`?

### Short answer (EN)

It finds the first value that is greater than or equal to `x`.

### Trả lời ngắn (VI)

Để tìm lower bound đầu tiên `>= x`.

### Standard answer (EN)

That boundary is required for strict increasing order. Using an upper bound would allow duplicates to create a longer non-decreasing sequence.

### Trả lời chuẩn (VI)

Boundary này giữ strict increasing; upper bound sẽ cho duplicate tăng length.

## 8. Follow-up variations

**Q (EN):** Does this array directly reconstruct the LIS?

**Q (VI):** `tails` có reconstruct trực tiếp LIS không?

### Short answer (EN)

No. Additional predecessor/index tracking is needed.

### Trả lời ngắn (VI)

Không. Cần thêm predecessor/index tracking.

### Standard answer (EN)

The values in `tails` may come from incompatible moments in the input. To reconstruct one LIS, I would store predecessor links and the source index for each tail length.

### Trả lời chuẩn (VI)

Các tail có thể đến từ thời điểm không cùng một subsequence; reconstruct cần lưu link/index.

## 9. Common interviewer traps

- Treating `tails` as the actual LIS.
- Using upper bound for a strictly increasing requirement.
- Saying replacement loses an optimal sequence without explaining the invariant.
- Forgetting the O(n^2) baseline DP.

## 10. Useful phrases and vocabulary

```text
smallest possible tail
strictly increasing subsequence
lower-bound binary search
replace or extend the tails array
O(n log n) follow-up
```
