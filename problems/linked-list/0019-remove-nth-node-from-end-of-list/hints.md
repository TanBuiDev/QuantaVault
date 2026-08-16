# Hints / Gợi ý — 19. Remove Nth Node From End of List

## Hint 1

**EN:** If two pointers are separated by exactly `n` nodes, then when the front pointer reaches the end, the back pointer is positioned relative to the target node.

**VI:** Nếu hai pointer được giữ cách nhau đúng `n` node, khi pointer trước đi tới cuối thì pointer sau sẽ nằm đúng vị trí tương đối với node cần xóa.

## Hint 2

**EN:** Add a dummy node before `head`. Start both pointers at the dummy and move `fast` exactly `n + 1` steps ahead.

**VI:** Thêm dummy trước `head`. Cho cả hai pointer bắt đầu ở dummy rồi đưa `fast` đi trước đúng `n + 1` bước.

## Hint 3

**EN:** Move both pointers together until `fast` becomes null. Then `slow.next` is the node to remove.

**VI:** Cho cả hai cùng tiến cho tới khi `fast == null`. Khi đó `slow.next` chính là node cần xóa.

## Key observation / Quan sát then chốt

Dummy node giúp việc xóa head (`n == list length`) dùng cùng một phép gán `slow.next = slow.next.next` như mọi trường hợp khác.
