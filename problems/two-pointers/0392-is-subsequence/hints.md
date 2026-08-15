# 392. Is Subsequence — Hints / Gợi ý

## Hint 1

Ta cần tìm các ký tự của `s` trong `t` theo đúng thứ tự, nhưng giữa chúng được phép bỏ qua ký tự của `t`.

## Hint 2

Dùng hai pointer:

```text
i -> ký tự tiếp theo cần match trong s
j -> ký tự hiện tại đang xét trong t
```

## Hint 3

Mỗi bước luôn tăng `j`. Chỉ tăng `i` khi:

```text
s.charAt(i) == t.charAt(j)
```

## Hint 4

Nếu cuối cùng:

```text
i == s.length()
```

thì mọi ký tự của `s` đã được match theo thứ tự.

## Hint 5 — Follow-up nhiều query

Nếu có cực nhiều `s` dùng chung `t`, scan toàn bộ `t` cho từng query sẽ tốn kém. Hãy preprocess các vị trí xuất hiện của từng character trong `t`, rồi với mỗi ký tự của `s` binary-search vị trí tiếp theo lớn hơn vị trí đã chọn trước đó.
