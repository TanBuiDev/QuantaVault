# 149. Max Points on a Line — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I fix each point as an anchor and count slopes to every later point. I represent a slope as a reduced integer pair `(dy, dx)` using GCD instead of floating point, and I canonicalize signs plus vertical and horizontal cases. The largest slope count for an anchor plus one gives the largest line through it. This is O(n^2) time and O(n) extra space.

**VI:** Tôi cố định anchor, normalize slope bằng GCD và đếm bằng HashMap.

## 2. Core approach questions

**Q (EN):** Why use one anchor at a time?

**Q (VI):** Vì sao cố định từng anchor?

### Short answer (EN)
Every line through an anchor can be identified by its slope.

### Trả lời ngắn (VI)
Mỗi line qua anchor được nhận diện bởi slope.

### Standard answer (EN)
For a fixed anchor, points on the same line produce the same direction ratio. Counting those ratios reduces the global geometry problem to a hash-map frequency problem.

### Trả lời chuẩn (VI)
Với anchor cố định, các điểm cùng line có cùng direction ratio nên bài toán trở thành đếm frequency.

## 3. Why / correctness questions

**Q (EN):** Why not use a `double` slope?

**Q (VI):** Vì sao không dùng `double`?

### Short answer (EN)
Floating-point values can make mathematically equal ratios compare incorrectly.

### Trả lời ngắn (VI)
Sai số floating point có thể làm hai ratio bằng nhau bị so khác nhau.

### Standard answer (EN)
Reducing integer `(dy, dx)` by their GCD gives an exact canonical representation, so equal slopes always share the same key.

### Trả lời chuẩn (VI)
Rút gọn cặp nguyên bằng GCD cho representation chính xác và canonical.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(n^2) time and O(n) extra space.

### Trả lời ngắn (VI)
O(n²) time và O(n) space.

### Standard answer (EN)
Each ordered anchor processes the points after it once, giving a quadratic number of pairs. The slope map for one anchor stores at most O(n) entries.

### Trả lời chuẩn (VI)
Tổng số cặp anchor-point là O(n²), map của một anchor tối đa O(n).

## 5. Edge-case questions

**Q (EN):** How do you represent vertical lines?

**Q (VI):** Biểu diễn vertical line thế nào?

### Short answer (EN)
I canonicalize every vertical slope to `(1,0)`.

### Trả lời ngắn (VI)
Tôi chuẩn hóa mọi vertical slope thành `(1,0)`.

### Standard answer (EN)
For vertical lines `dx` is zero, so a numeric fraction would be undefined. A fixed pair key groups all vertical directions correctly.

### Trả lời chuẩn (VI)
Vertical line có `dx=0`, nên dùng key cố định để nhóm chính xác.

## 6. Alternative-approach and trade-off questions

**Q (EN):** What is the simpler brute-force approach?

**Q (VI):** Brute force đơn giản hơn là gì?

### Short answer (EN)
Choose every pair of points as a line and scan all other points for collinearity.

### Trả lời ngắn (VI)
Chọn mọi cặp điểm làm line rồi scan toàn bộ điểm còn lại.

### Standard answer (EN)
That takes O(n^3). The anchor method reuses one endpoint and counts all candidate lines through it in one O(n) pass.

### Trả lời chuẩn (VI)
Cách đó O(n³); anchor method gom toàn bộ line qua một điểm trong một pass O(n).

## 7. Code walkthrough questions

**Q (EN):** Why do you divide both `dy` and `dx` by the GCD?

**Q (VI):** Vì sao chia cả `dy` và `dx` cho GCD?

### Short answer (EN)
To make proportional direction vectors identical.

### Trả lời ngắn (VI)
Để các vector tỷ lệ có representation giống nhau.

### Standard answer (EN)
For example `(2,4)` and `(1,2)` describe the same slope. Dividing by the GCD maps both to `(1,2)`.

### Trả lời chuẩn (VI)
Ví dụ `(2,4)` và `(1,2)` cùng slope; GCD đưa cả hai về `(1,2)`.

## 8. Follow-up variations

**Q (EN):** What changes if duplicate points are allowed?

**Q (VI):** Nếu cho phép duplicate points thì sao?

### Short answer (EN)
Track a duplicate count separately for each anchor and add it to every slope total.

### Trả lời ngắn (VI)
Cần đếm duplicate riêng cho anchor rồi cộng vào slope total.

### Standard answer (EN)
A duplicate has `dx=dy=0`, so it belongs to every line through the anchor and cannot be assigned one normal slope key.

### Trả lời chuẩn (VI)
Duplicate có vector `(0,0)` và thuộc mọi line qua anchor nên phải xử lý riêng.

## 9. Common interviewer traps

- Floating-point slope keys.
- Sign-normalization bugs.
- Mishandling vertical lines.
- Forgetting the anchor in the count.

## 10. Useful phrases and vocabulary

```text
fix one point as an anchor
normalized integer slope
reduce by the GCD
canonical sign convention
points are collinear
```
