# 221. Maximal Square — Hints / Gợi ý

Các gợi ý được sắp xếp từ nhẹ đến mạnh. Khi luyện tập, nên mở từng hint một.

## Hint 1 — Define a local state / Định nghĩa trạng thái cục bộ

**EN:** Instead of asking for the largest square anywhere in the matrix, ask: what is the largest all-1 square whose bottom-right corner is the current cell?

**VI:** Thay vì hỏi hình vuông lớn nhất trong toàn ma trận, hãy hỏi: hình vuông toàn `1` lớn nhất có **góc dưới-phải** tại ô hiện tại có cạnh bao nhiêu?

## Hint 2 — Look at three neighbors / Nhìn ba ô lân cận

**EN:** If the current cell is `1`, a larger square can only be formed when the squares ending above, to the left, and diagonally up-left are all large enough.

**VI:** Nếu ô hiện tại là `1`, kích thước hình vuông mới phụ thuộc vào ba trạng thái: **trên**, **trái**, và **chéo trên-trái**.

## Hint 3 — Recurrence / Công thức chuyển trạng thái

**EN:** For a `1` cell, the side length is one plus the minimum of those three neighboring side lengths. For a `0` cell, the side length is zero.

**VI:** Với ô `1`:

```text
dp = 1 + min(top, left, diagonal)
```

Với ô `0`, trạng thái bằng `0`.

## Hint 4 — Compress the DP row / Nén hàng DP

**EN:** You only need the previous row and the current row. With one array, save the old `dp[j]` before overwriting it so it can serve as the diagonal value for the next column.

**VI:** Chỉ cần trạng thái của hàng trước và phần hàng hiện tại đã tính. Có thể dùng một mảng `dp` và một biến `diagonal` để đạt `O(n)` bộ nhớ phụ.
