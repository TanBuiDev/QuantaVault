# Hints / Gợi ý — 92. Reverse Linked List II

## Hint 1

**EN:** A dummy node before `head` makes the case `left = 1` behave like every other case.

**VI:** Đặt dummy node trước `head` để trường hợp `left = 1` không cần special case.

## Hint 2

**EN:** Move a pointer to the node immediately before position `left`. Keep the node at `left` as the tail of the portion currently being reversed.

**VI:** Di chuyển pointer tới node ngay trước vị trí `left`. Giữ node ban đầu ở `left` làm tail của phần đang được reverse.

## Hint 3

**EN:** Repeatedly remove the node after that tail and insert it immediately after the node before the reversed segment. Do this `right - left` times.

**VI:** Lặp lại thao tác lấy node ngay sau tail rồi chèn nó ngay sau node đứng trước đoạn reverse. Thực hiện `right - left` lần.

## Key observation / Quan sát then chốt

Head-insertion cho phép reverse sublist tại chỗ mà không cần tách list hay dùng stack/array.
