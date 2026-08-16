# 88. Merge Sorted Array — Hints / Gợi ý

> Mở từng gợi ý theo thứ tự. Mục tiêu là giúp bạn tự tìm ra lời giải trước khi xem `solution.md`.

## Hint 1

`nums1` có sẵn `n` ô trống ở cuối. Hãy suy nghĩ xem vùng trống đó có thể giúp bạn tránh tạo một mảng phụ như thế nào.

## Hint 2

Nếu merge từ **đầu mảng**, bạn có nguy cơ ghi đè lên các phần tử hợp lệ của `nums1` chưa được xử lý.

Nếu merge từ **cuối mảng**, vị trí ghi hiện tại ban đầu chính là:

```text
m + n - 1
```

## Hint 3

Dùng ba con trỏ:

```text
i = m - 1       // phần tử cuối hợp lệ của nums1
j = n - 1       // phần tử cuối của nums2
k = m + n - 1   // vị trí cần ghi trong nums1
```

Ở mỗi bước, so sánh `nums1[i]` và `nums2[j]`, rồi đặt **phần tử lớn hơn** vào `nums1[k]`.

## Hint 4

Khi `nums2` vẫn còn phần tử, chúng bắt buộc phải được chép vào `nums1`.

Ngược lại, nếu `nums1` còn phần tử nhưng `nums2` đã hết, bạn không cần chép lại chúng vì chúng đã nằm đúng vị trí tương đối trong `nums1`.
