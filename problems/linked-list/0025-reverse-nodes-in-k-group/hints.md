# Hints / Gợi ý — 25. Reverse Nodes in k-Group

## Hint 1

**EN:** Before reversing a group, first verify that the group contains exactly `k` nodes. If fewer than `k` remain, stop and leave them unchanged.

**VI:** Trước khi reverse một nhóm, hãy kiểm tra trước rằng còn đủ đúng `k` node. Nếu ít hơn `k`, dừng và giữ nguyên phần dư.

## Hint 2

**EN:** Use a dummy node and keep `groupPrev` at the node immediately before the current group. Find the `k`th node, remember `groupNext = kth.next`, then reverse until reaching `groupNext`.

**VI:** Dùng dummy và giữ `groupPrev` ở node ngay trước nhóm hiện tại. Tìm node thứ `k`, lưu `groupNext = kth.next`, rồi reverse cho tới khi chạm `groupNext`.

## Hint 3

**EN:** After reversing, the old group head becomes the group tail. Connect `groupPrev.next` to the old `k`th node, then move `groupPrev` to the old head for the next iteration.

**VI:** Sau khi reverse, head cũ trở thành tail của nhóm. Nối `groupPrev.next` tới node thứ `k` cũ, rồi đưa `groupPrev` tới head cũ để xử lý nhóm tiếp theo.

## Key observation / Quan sát then chốt

Không reverse trước rồi mới phát hiện thiếu node. Phải xác nhận đủ `k` node **trước** để phần dư cuối list không bị thay đổi.
