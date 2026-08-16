# 13. Roman to Integer — Hints / Gợi ý

## Hint 1

Mỗi ký hiệu có một giá trị cố định. Khó khăn duy nhất là phân biệt lúc nào cộng và lúc nào trừ.

## Hint 2

Trong một số La Mã hợp lệ, nếu giá trị hiện tại nhỏ hơn giá trị ngay sau nó thì current symbol thuộc một subtractive pair.

## Hint 3

Vì vậy tại index `i`:

```text
if value(s[i]) < value(s[i+1])
    subtract current
else
    add current
```

Ký hiệu cuối luôn được cộng.
