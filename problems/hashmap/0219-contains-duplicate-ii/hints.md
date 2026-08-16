# 219. Contains Duplicate II — Hints / Gợi ý

## Hint 1

Khi gặp lại một value tại index `i`, index nào trước đó là quan trọng nhất để biết có duplicate gần trong khoảng `k`?

## Hint 2

Chỉ cần lưu **last seen index** gần nhất của mỗi value.

## Hint 3

Nếu previous index là `j`, kiểm tra `i - j <= k`.

## Hint 4

Dù không match, vẫn update last seen thành `i`, vì index mới gần các future occurrences hơn mọi occurrence cũ.
