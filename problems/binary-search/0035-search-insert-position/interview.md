# 35. Search Insert Position — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** This is a lower-bound search: find the first index with value at least target. I use a half-open interval `[0,n)`, which naturally allows n as the answer when target belongs after every element. The search is O(log n) and O(1) space.

**VI:** Tôi dùng lower bound trên `[0,n)` để tìm index đầu tiên `>= target`.

## 2. Core approach questions
**Q (EN):** Why is lower bound the right abstraction?

**Q (VI):** Vì sao lower bound đúng với bài này?

### Short answer (EN)
Both an existing target and its insertion point are the first position not less than target.

### Trả lời ngắn (VI)
Cả trường hợp tìm thấy và chèn đều là vị trí đầu tiên không nhỏ hơn target.

### Standard answer (EN)
If target exists, the first value >= target is target itself; if absent, that same boundary is where target belongs.

### Trả lời chuẩn (VI)
Boundary này thống nhất hai trường hợp tồn tại và không tồn tại.

## 3. Why / correctness questions
**Q (EN):** Why can the answer be n?

**Q (VI):** Vì sao answer có thể bằng n?

### Short answer (EN)
Target may be larger than every array value.

### Trả lời ngắn (VI)
Target có thể lớn hơn toàn bộ phần tử.

### Standard answer (EN)
The valid insertion positions are 0 through n, so the search domain must preserve the virtual end position.

### Trả lời chuẩn (VI)
Có n+1 vị trí chèn, gồm cả sau phần tử cuối.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(log n) time and O(1) space.

### Trả lời ngắn (VI)
O(log n), O(1).

### Standard answer (EN)
The candidate interval is halved each iteration.

### Trả lời chuẩn (VI)
Mỗi vòng giảm nửa miền candidate.

## 5. Edge-case questions
**Q (EN):** What if target is smaller than nums[0]?

**Q (VI):** Nếu target nhỏ hơn phần tử đầu?

### Short answer (EN)
The answer is zero.

### Trả lời ngắn (VI)
Đáp án là 0.

### Standard answer (EN)
No element is strictly less than target, so lower bound stays at the beginning.

### Trả lời chuẩn (VI)
Không có phần tử nào phải đứng trước target.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not ordinary equality binary search?

**Q (VI):** Vì sao không chỉ search equality?

### Short answer (EN)
We still need a meaningful index when target is absent.

### Trả lời ngắn (VI)
Khi target vắng mặt vẫn cần insertion index.

### Standard answer (EN)
Boundary search encodes the absent case directly rather than requiring extra neighbor logic.

### Trả lời chuẩn (VI)
Lower bound xử lý absent case tự nhiên.

## 7. Code walkthrough questions
**Q (EN):** Why `right = mid` rather than `mid - 1`?

**Q (VI):** Vì sao `right=mid`?

### Short answer (EN)
Mid may be the first valid position.

### Trả lời ngắn (VI)
Mid có thể chính là answer.

### Standard answer (EN)
The half-open invariant keeps mid when its value is at least target.

### Trả lời chuẩn (VI)
Không được loại mid khi nó vẫn là candidate hợp lệ.

## 8. Follow-up variations
**Q (EN):** How would duplicates change the answer?

**Q (VI):** Nếu có duplicate thì sao?

### Short answer (EN)
The same lower bound returns the first valid insertion position.

### Trả lời ngắn (VI)
Lower bound vẫn trả vị trí đầu tiên hợp lệ.

### Standard answer (EN)
The algorithm already handles duplicates even though this problem guarantees distinct values.

### Trả lời chuẩn (VI)
Thuật toán tổng quát hơn constraint của bài.

## 9. Common interviewer traps
Forgetting position n; returning any equal index instead of the insertion boundary; interval off-by-one errors.

## 10. Useful phrases and vocabulary
`lower-bound search`, `virtual end position`, `half-open interval`, `insertion boundary`.
