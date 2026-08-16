# Hints / Gợi ý — 141. Linked List Cycle

## Hint 1

**EN:** If you store every visited node in a set, seeing the same node twice proves there is a cycle. Can you detect repetition without storing all visited nodes?

**VI:** Nếu lưu mọi node đã gặp vào một set, gặp lại cùng node sẽ chứng minh có cycle. Có cách nào phát hiện việc lặp lại mà không cần lưu toàn bộ node đã đi qua không?

## Hint 2

**EN:** Use two pointers that move through the list at different speeds: one advances by one node and the other by two nodes.

**VI:** Dùng hai pointer chạy với tốc độ khác nhau: `slow` đi một node mỗi bước, `fast` đi hai node mỗi bước.

## Hint 3

**EN:** If the list has no cycle, the fast pointer eventually reaches `null`. If a cycle exists, both pointers are trapped inside the cycle and the faster pointer must eventually catch the slower one.

**VI:** Nếu không có cycle, `fast` cuối cùng sẽ chạm `null`. Nếu có cycle, cả hai pointer sẽ bị giữ trong vòng và pointer nhanh chắc chắn sẽ bắt kịp pointer chậm.

## Key observation / Quan sát then chốt

Không so sánh `Node.val`. Hai node khác nhau có thể có cùng value. Ta phải kiểm tra **reference identity**: `slow == fast`.
