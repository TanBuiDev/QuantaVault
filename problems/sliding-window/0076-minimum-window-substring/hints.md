# 76. Minimum Window Substring — Hints / Gợi ý

## Hint 1

Không chỉ cần biết một character có xuất hiện hay không; phải track **frequency** vì `t` có thể chứa duplicate.

## Hint 2

Dùng `need[c]` cho số lần character `c` cần xuất hiện và `window[c]` cho số lần đang có trong current window.

## Hint 3

Thay vì mỗi lần kiểm tra toàn bộ bảng frequency, track `formed`: số distinct character hiện đã đạt đúng hoặc vượt quota cần thiết. Window valid khi:

```text
formed == required
```

## Hint 4

Khi window valid, cập nhật best rồi tăng `left` liên tục để thu hẹp. Nếu việc bỏ `s[left]` làm một required character tụt dưới quota, window trở thành invalid và cần mở rộng `right` tiếp.
