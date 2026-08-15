# 290. Word Pattern — Hints / Gợi ý

## Hint 1

Tách `s` thành các word. Nếu số word khác `pattern.length()`, chắc chắn không match.

## Hint 2

Cần đảm bảo mapping nhất quán từ `pattern char -> word`.

## Hint 3

Chỉ mapping một chiều chưa đủ: hai pattern chars khác nhau không được cùng map tới một word. Duy trì thêm `word -> char`.

## Hint 4

Ở mỗi index, kiểm tra cả hai mapping trước khi ghi cặp mới.
