# 48. Rotate Image — Hints / Gợi ý

## Hint 1

Thử tách phép xoay 90° clockwise thành hai phép biến đổi đơn giản hơn.

## Hint 2

Transpose qua main diagonal biến `matrix[r][c]` thành `matrix[c][r]`.

## Hint 3

Sau transpose, reverse từng row. Kết quả chính là rotation 90° clockwise.

## Hint 4

Khi transpose in-place, chỉ swap phía trên diagonal (`c > r`) để mỗi cặp được swap đúng một lần.
