# 28. Find the Index of the First Occurrence in a String — Hints / Gợi ý

## Hint 1

Brute force thử mỗi vị trí bắt đầu và so toàn bộ `needle` có thể tốn `O(nm)` trong worst case.

## Hint 2

Khi đã match một prefix dài của `needle` rồi gặp mismatch, một phần thông tin đã match có thể được tái sử dụng thay vì quay lại từ đầu.

## Hint 3

KMP precompute mảng:

```text
lps[i] = độ dài longest proper prefix của needle[0..i]
         đồng thời là suffix của đoạn đó
```

## Hint 4

Khi mismatch sau khi đã match `j` characters:

```text
j = lps[j - 1]
```

không lùi pointer của `haystack`.

Khi `j == needle.length()`, match bắt đầu tại:

```text
i - j + 1
```
