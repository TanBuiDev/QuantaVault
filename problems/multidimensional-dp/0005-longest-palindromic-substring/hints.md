# 5. Longest Palindromic Substring — Hints / Gợi ý

## Hint 1

**EN:** Every palindrome has a center. The center can be one character or the gap between two characters.

**VI:** Mọi palindrome đều có tâm; tâm có thể là một ký tự hoặc khe giữa hai ký tự.

## Hint 2

**EN:** Expand two pointers outward while the characters are equal.

**VI:** Đặt hai pointer ở tâm và mở rộng ra hai phía khi ký tự còn bằng nhau.

## Hint 3

Với mỗi index `i`, thử cả:

```text
odd center:  (i, i)
even center: (i, i + 1)
```

Theo dõi đoạn dài nhất tìm được.
