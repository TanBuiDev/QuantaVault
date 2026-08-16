# 134. Gas Station — Hints / Gợi ý

## Hint 1

Xét lượng xăng ròng tại mỗi trạm:

```text
delta[i] = gas[i] - cost[i]
```

Nếu tổng tất cả `delta` âm thì có thể hoàn thành vòng không?

## Hint 2

Giả sử đang thử candidate `start`, và running tank trở thành âm sau khi đi qua trạm `i`.

Điều này nói gì về candidate `start`?

## Hint 3

Không chỉ `start` thất bại. Mọi index từ `start` đến `i` cũng không thể là điểm xuất phát hợp lệ.

Vì một điểm nằm giữa đoạn đó bắt đầu với ít hoặc bằng lượng surplus mà candidate cũ đã có khi tới nó, nhưng candidate cũ vẫn thất bại trước hoặc tại `i`.

## Hint 4

Khi tank âm tại `i`:

```text
start = i + 1
tank = 0
```

Song song, giữ `total` của toàn bộ `gas[i] - cost[i]`.

Cuối cùng:

```text
total >= 0 ? start : -1
```
