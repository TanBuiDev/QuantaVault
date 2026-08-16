# 55. Jump Game — Hints / Gợi ý

## Hint 1

Không cần quyết định chính xác sẽ nhảy đến index nào. Chỉ cần biết **vùng xa nhất hiện tại có thể tới được**.

## Hint 2

Nếu index hiện tại `i` đã reachable, thì từ nó ta có thể mở rộng vùng reachable đến:

```text
i + nums[i]
```

## Hint 3

Duy trì:

```text
farthest = max index reachable so far
```

Nếu gặp:

```text
i > farthest
```

thì index `i` không thể tới được, và mọi index phía sau cũng chưa thể được mở rộng từ `i`.

## Hint 4

Nếu ở bất kỳ lúc nào:

```text
farthest >= nums.length - 1
```

thì có thể trả về `true` ngay.
