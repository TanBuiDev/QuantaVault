# 14. Longest Common Prefix — Hints / Gợi ý

## Hint 1

Một common prefix không thể dài hơn chuỗi đầu tiên. Hãy dùng `strs[0]` làm reference.

## Hint 2

Xét từng vị trí `i` của chuỗi đầu tiên. Character tại `i` chỉ thuộc common prefix nếu **mọi** chuỗi còn lại đều có vị trí `i` và có cùng character.

## Hint 3

Ngay khi một chuỗi:

```text
hết ký tự tại i
hoặc
strs[j].charAt(i) != strs[0].charAt(i)
```

thì longest common prefix kết thúc tại `i`.

## Hint 4

Bạn có thể trả trực tiếp:

```java
strs[0].substring(0, i)
```

khi gặp mismatch đầu tiên.
