# 427. Construct Quad Tree — Solution

## 1. Core idea / Intuition
Dùng 2D prefix sum để biết số lượng bit 1 trong bất kỳ square region. Nếu count bằng 0 hoặc area, region đồng nhất; nếu không, chia bốn.

## 2. Requirement recap / Tóm tắt yêu cầu
Mỗi internal node phải có đúng bốn children, còn leaf không cần children.

## 3. Key observations / Nhận xét quan trọng
Uniformity chỉ phụ thuộc `ones == 0` hoặc `ones == size*size`; prefix sum giúp query O(1).

## 4. Alternative approaches / Các hướng khác
Scan từng region trực tiếp đơn giản hơn nhưng lặp lại công việc qua nhiều level.

## 5. Optimal approach / Hướng tối ưu
Build prefix O(n²), sau đó recursively query region sum and split midpoint until uniform.

## 6. Java solution overview
`build(row,col,size)` query sum, trả leaf nếu uniform; nếu không gọi bốn quadrant size/2 và trả internal node.

## 7. Code explanation / Giải thích code
Helper `sum(r,c,size)` dùng inclusion-exclusion trên prefix matrix.

## 8. Dry run / Chạy thử
`[[0,1],[1,0]]` có sum 2 trên area 4 nên root internal; mỗi size-1 child tự động là leaf.

## 9. Time and space complexity
O(n²) build/query-tree work and O(n²) prefix extra space; output tree itself can also be O(n²).

## 10. Why the algorithm is correct / Vì sao đúng
Uniform regions được nhận diện chính xác bằng count ones. Non-uniform square được partition thành bốn disjoint quadrants phủ đúng toàn vùng; induction trên `size` cho thấy mỗi child biểu diễn đúng quadrant và root biểu diễn đúng grid.

## 11. Edge cases
`n=1`, all zero, all one, checkerboard.

## 12. Common mistakes
Không tạo đủ bốn children cho internal node; chia sai quadrant; nhầm prefix boundaries.

## 13. Pattern recognition / Khi nào tái sử dụng
Recursive spatial decomposition xuất hiện ở quad trees, image compression và region queries.

## 14. Vocabulary
**Quad-Tree**: cây tứ phân; **quadrant**: góc phần tư; **leaf**: nút lá; **prefix sum**: tổng tiền tố.
