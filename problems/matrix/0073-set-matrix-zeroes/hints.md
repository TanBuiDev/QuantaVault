# 73. Set Matrix Zeroes — Hints / Gợi ý

## Hint 1

Ta cần nhớ row nào và column nào phải zero. Có thể tận dụng chính matrix làm nơi lưu marker.

## Hint 2

Dùng `matrix[r][0]` làm marker cho row `r`, và `matrix[0][c]` làm marker cho column `c`.

## Hint 3

Cell `(0,0)` không thể đồng thời biểu diễn độc lập trạng thái của first row và first column, nên cần hai boolean riêng cho chúng.

## Hint 4

Thứ tự quan trọng: ghi marker từ interior trước, sau đó zero interior theo marker, cuối cùng mới xử lý first row/first column.
