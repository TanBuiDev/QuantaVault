# 274. H-Index — Hints / Gợi ý

## Hint 1

Nếu có `n` bài báo thì h-index **không bao giờ lớn hơn `n`**, dù một bài có hàng triệu citation.

## Hint 2

Vì chỉ quan tâm các ngưỡng `0..n`, có thể gom mọi citation `>= n` vào cùng một bucket `n`.

## Hint 3

Tạo frequency array:

```text
count[h] = số bài có đúng h citation
```

với:

```text
bucket = min(citation, n)
```

## Hint 4

Duyệt `h` từ `n` giảm về `0`, cộng dồn số bài có **ít nhất h citation**. Giá trị `h` đầu tiên thỏa:

```text
papersAtLeastH >= h
```

là h-index lớn nhất.
