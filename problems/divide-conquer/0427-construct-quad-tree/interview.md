# 427. Construct Quad Tree — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I precompute a 2D prefix sum. For each square, the number of ones tells me in O(1) whether the region is uniform. Uniform regions become leaves; otherwise I split into four equal quadrants and recurse. This mirrors the Quad-Tree definition directly.

**VI:** Tôi dùng prefix sum để test uniform region O(1), rồi recurse bốn quadrant khi cần.

## 2. Core approach questions
**Q (EN):** What is the recursive state?

**Q (VI):** Recursive state là gì?

### Short answer (EN)
Top-left coordinates and side length of one square.

### Trả lời ngắn (VI)
Tọa độ góc trái trên và độ dài cạnh của một square.

### Standard answer (EN)
Those three values uniquely describe a region and determine all four child regions.

### Trả lời chuẩn (VI)
Ba giá trị đủ mô tả region và suy ra bốn children.

## 3. Why / correctness questions
**Q (EN):** How do you know a region is uniform?

**Q (VI):** Biết region đồng nhất thế nào?

### Short answer (EN)
Its one-count is zero or equals its area.

### Trả lời ngắn (VI)
Số bit 1 bằng 0 hoặc bằng area.

### Standard answer (EN)
Because cells are binary, those are exactly the all-zero and all-one cases.

### Trả lời chuẩn (VI)
Grid chỉ có 0/1 nên hai điều kiện đó chính xác.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(n²) time and O(n²) prefix space.

### Trả lời ngắn (VI)
O(n²) time, O(n²) prefix space.

### Standard answer (EN)
Prefix construction visits each cell once and each produced tree node performs O(1) region work.

### Trả lời chuẩn (VI)
Build prefix tuyến tính theo số cell và mỗi node query O(1).

## 5. Edge-case questions
**Q (EN):** What happens at size one?

**Q (VI):** Khi size bằng 1?

### Short answer (EN)
It is always uniform and becomes a leaf.

### Trả lời ngắn (VI)
Luôn uniform và thành leaf.

### Standard answer (EN)
The one-count is exactly zero or one, matching the area.

### Trả lời chuẩn (VI)
Count luôn bằng 0 hoặc area=1.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Can you skip prefix sums?

**Q (VI):** Có thể không dùng prefix không?

### Short answer (EN)
Yes, scan each region for uniformity.

### Trả lời ngắn (VI)
Có, scan từng region.

### Standard answer (EN)
That uses less auxiliary memory but can rescan cells across recursive levels.

### Trả lời chuẩn (VI)
Ít memory hơn nhưng lặp scan qua các level.

## 7. Code walkthrough questions
**Q (EN):** Why can an internal node's `val` be arbitrary?

**Q (VI):** Vì sao `val` của internal node tùy ý?

### Short answer (EN)
The problem only interprets `val` for leaf nodes.

### Trả lời ngắn (VI)
Đề chỉ dùng `val` có ý nghĩa ở leaf.

### Standard answer (EN)
Its four children carry the actual regional values; the internal flag is `isLeaf=false`.

### Trả lời chuẩn (VI)
Dữ liệu thật nằm trong children khi `isLeaf=false`.

## 8. Follow-up variations
**Q (EN):** How would prefix sums help with larger grids?

**Q (VI):** Prefix sum giúp gì khi grid lớn hơn?

### Short answer (EN)
Uniformity checks stay O(1).

### Trả lời ngắn (VI)
Mỗi query region vẫn O(1).

### Standard answer (EN)
This prevents repeated scans of the same cells across tree levels.

### Trả lời chuẩn (VI)
Tránh scan lặp lại cell ở nhiều level.

## 9. Common interviewer traps
Quadrant coordinate mistakes, treating internal `val` as meaningful, repeated full scans.

## 10. Useful phrases and vocabulary
`recursive spatial partition`, `uniform region`, `four quadrants`, `2D prefix sum`.
