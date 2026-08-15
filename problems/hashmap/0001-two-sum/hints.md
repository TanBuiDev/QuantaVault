# 1. Two Sum — Hints / Gợi ý

## Hint 1

Với current value `x`, số còn thiếu là:

```text
complement = target - x
```

## Hint 2

Nếu đã biết index của các value trước đó, có thể kiểm tra complement trong `O(1)` average time bằng hash map.

## Hint 3

Hãy lookup complement **trước khi** insert current value. Điều này tự nhiên bảo đảm current element không ghép với chính nó.

## Hint 4

Map nên lưu `value -> index`. Khi complement đã tồn tại, trả index cũ và current index.
