# 42. Trapping Rain Water — Hints / Gợi ý

## Hint 1

Nước trên index `i` phụ thuộc vào cột cao nhất bên trái và bên phải:

```text
water[i] = min(leftMax[i], rightMax[i]) - height[i]
```

nếu giá trị này dương.

## Hint 2

Có thể precompute hai mảng `leftMax` và `rightMax` để đạt `O(n)` time nhưng sẽ dùng `O(n)` space.

## Hint 3

Muốn `O(1)` space, dùng hai pointer và duy trì:

```text
leftMax
rightMax
```

Nếu `height[left] <= height[right]`, tại sao ta có thể xử lý phía `left` mà chưa biết toàn bộ phần bên phải?

## Hint 4

Khi cột trái thấp hơn hoặc bằng cột phải, đã tồn tại một right boundary cao ít nhất bằng `height[left]`. Lượng nước tại `left` lúc này chỉ còn bị giới hạn bởi `leftMax`.

Đối xứng cho phía phải.
