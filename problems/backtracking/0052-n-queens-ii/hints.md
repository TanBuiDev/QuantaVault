# Hints / Gợi ý

## Hint 1
**EN:** Place queens row by row. Then each recursive level needs to choose only a column.

**VI:** Đặt hậu theo từng hàng. Mỗi mức recursion chỉ cần chọn một cột.

## Hint 2
**EN:** A position is invalid if its column, main diagonal, or anti-diagonal is already occupied.

**VI:** Một ô không hợp lệ nếu cột, đường chéo chính hoặc đường chéo phụ đã có hậu.

## Hint 3
**EN:** Track columns and diagonals with boolean arrays. Use `row - col + n - 1` and `row + col` as diagonal indices.

**VI:** Dùng các mảng boolean cho cột và hai loại đường chéo; chỉ số đường chéo có thể là `row - col + n - 1` và `row + col`.
