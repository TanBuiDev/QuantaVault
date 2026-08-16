# Hints / Gợi ý

## Hint 1
**EN:** Build one combination from left to right and keep a starting value for the next choice.

**VI:** Xây từng tổ hợp từ trái sang phải và giữ giá trị bắt đầu cho lựa chọn tiếp theo.

## Hint 2
**EN:** After choosing `x`, only consider values greater than `x`. This avoids order-based duplicates.

**VI:** Sau khi chọn `x`, chỉ xét các giá trị lớn hơn `x` để tránh duplicate do khác thứ tự.

## Hint 3
**EN:** Prune when there are not enough remaining values to fill the combination. If `need = k - current.size()`, the largest useful start is `n - need + 1`.

**VI:** Cắt nhánh khi số giá trị còn lại không đủ để hoàn thành tổ hợp. Nếu còn cần `need` phần tử thì giá trị bắt đầu hữu ích lớn nhất là `n - need + 1`.
