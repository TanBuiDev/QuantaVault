# 45. Jump Game II — Hints / Gợi ý

## Hint 1

Bài 55 chỉ cần biết reachable hay không. Bài này cần đếm **ít nhất bao nhiêu lần mở rộng vùng reachable** để chạm đích.

## Hint 2

Sau một số jump cố định, ta có thể tới một interval các index. Hãy coi interval đó giống một **level của BFS**.

## Hint 3

Duy trì hai biên:

```text
currentEnd = biên cuối của range reachable với số jump hiện tại
farthest   = biên xa nhất của range kế tiếp
```

## Hint 4

Trong khi quét mọi index của current range, cập nhật:

```text
farthest = max(farthest, i + nums[i])
```

Khi `i == currentEnd`, ta đã xét hết level hiện tại. Phải dùng thêm một jump và chuyển:

```text
jumps++
currentEnd = farthest
```

Không cần xử lý index cuối trong vòng lặp vì khi đã tới đó thì không cần nhảy thêm.
