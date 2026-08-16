# 209. Minimum Size Subarray Sum — Hints / Gợi ý

## Hint 1

Tất cả `nums[i]` đều **positive**. Vì vậy khi tăng `right`, window sum không giảm; khi tăng `left`, window sum không tăng.

## Hint 2

Dùng variable-size window với `left = 0` và chạy `right` từ trái sang phải. Mỗi lần thêm `nums[right]` vào `sum`.

## Hint 3

Khi `sum >= target`, current window hợp lệ. Hãy cập nhật answer rồi tiếp tục bỏ `nums[left]` để thử làm window ngắn hơn.

## Hint 4

Chỉ khi window không còn hợp lệ mới cần mở rộng `right` tiếp. Mỗi phần tử được thêm một lần và bị loại tối đa một lần.
