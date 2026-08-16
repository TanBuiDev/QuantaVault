# 427. Construct Quad Tree — Hints / Gợi ý

## Hint 1
**EN:** Each recursive call represents one square region.

**VI:** Mỗi recursive call đại diện một vùng vuông.

## Hint 2
**EN:** Determine whether a region is all zero or all one; if so, stop and create a leaf.

**VI:** Kiểm tra vùng có toàn 0 hoặc toàn 1; nếu đúng thì tạo leaf và dừng.

## Hint 3
A 2D prefix sum can test region uniformity in O(1), after which non-uniform regions split into four equal squares.
