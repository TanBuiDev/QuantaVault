# 189. Rotate Array — Hints / Gợi ý

## Hint 1

Nếu `k` lớn hơn độ dài mảng, nhiều vòng xoay là lặp lại. Hãy chuẩn hóa trước:

```text
k = k % n
```

## Hint 2

Một cách đơn giản là tạo mảng phụ và đưa phần tử ở index `i` sang:

```text
(i + k) % n
```

Cách đó đạt `O(n)` time nhưng dùng `O(n)` extra space.

## Hint 3

Để đạt `O(1)` extra space, thử nhìn kết quả như hai đoạn:

```text
A B  ->  B A
```

trong đó `B` là `k` phần tử cuối.

## Hint 4

Ba phép đảo ngược có thể biến:

```text
A B
```

thành:

```text
reverse(A B)
reverse(B-reversed)
reverse(A-reversed)
= B A
```

Cụ thể:

```text
reverse(0, n - 1)
reverse(0, k - 1)
reverse(k, n - 1)
```
