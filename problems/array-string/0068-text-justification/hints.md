# 68. Text Justification — Hints / Gợi ý

## Hint 1

Tách bài thành hai bước độc lập:

1. **Chọn words** cho một line bằng greedy.
2. **Format spaces** cho line đã chọn.

Đừng trộn hai việc ngay từ đầu.

## Hint 2

Giả sử line chứa words từ `i` đến `j-1`. Khi kiểm tra có thể thêm `words[j]` không, phải tính cả **ít nhất một space giữa mỗi cặp word**:

```text
sumWordLengths + numberOfGaps + nextWordLength <= maxWidth
```

## Hint 3

Với normal line có nhiều hơn một word:

```text
totalSpaces = maxWidth - sumWordLengths
gaps        = numberOfWords - 1
base        = totalSpaces / gaps
extra       = totalSpaces % gaps
```

`extra` khoảng bên trái nhận thêm một space.

## Hint 4

Hai trường hợp không dùng full justification:

```text
last line
hoặc
line chỉ có một word
```

Khi đó nối words bằng một space và pad phần còn lại ở cuối.
