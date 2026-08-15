# 289. Game of Life — Hints / Gợi ý

## Hint 1

Khó khăn là simultaneous update: khi xử lý cell sau, bạn vẫn cần biết **old state** của các neighbor đã được mutate.

## Hint 2

Mỗi cell chỉ cần encode bốn trạng thái: dead→dead, live→live, live→dead, dead→live.

## Hint 3

Có thể dùng:

```text
-1 = live -> dead
 2 = dead -> live
```

Khi đếm old-live neighbor, `1` và `-1` đều được xem là sống ban đầu.

## Hint 4

Pass đầu ghi transitional states; pass thứ hai normalize về `0/1`. Với encoding trên, old-live có thể test bằng `abs(value) == 1`.
