# 11. Container With Most Water — Hints / Gợi ý

## Hint 1

Diện tích của một cặp `(left, right)` là:

```text
width * min(height[left], height[right])
```

Hãy để ý rằng chiều cao nhỏ hơn là bottleneck.

## Hint 2

Bắt đầu ở hai đầu để width lớn nhất:

```text
left = 0
right = n - 1
```

Sau khi tính area, ta buộc phải giảm width ở bước kế tiếp.

## Hint 3

Nếu `height[left] < height[right]`, giữ `left` và chỉ giảm `right` không thể làm bottleneck cao hơn `height[left]`, trong khi width lại nhỏ đi.

Vì vậy current `left` có thể bị loại.

## Hint 4

Mỗi bước hãy di chuyển pointer có chiều cao nhỏ hơn vào trong. Pointer còn lại được giữ vì nó vẫn có cơ hội kết hợp với một cạnh cao hơn.
