# Solution / Lời giải — 92. Reverse Linked List II

## 1. Ý tưởng chính

Chỉ cần đảo đoạn `[left, right]`. Dùng một `dummy` trước `head`, đưa `before` tới node ngay trước `left`, rồi dùng kỹ thuật head-insertion trong đoạn cần đảo.

`current = before.next` là node ban đầu tại `left`. Trong quá trình, `current` giữ vai trò tail của phần đã đảo. Mỗi vòng lấy node `current.next` và đưa node đó lên ngay sau `before`.

## 2. Thuật toán

1. `dummy.next = head`.
2. Đi `left - 1` bước để tìm `before`.
3. `current = before.next`.
4. Lặp `right - left` lần:
   - `moving = current.next`.
   - `current.next = moving.next`.
   - `moving.next = before.next`.
   - `before.next = moving`.
5. Trả `dummy.next`.

## 3. Vì sao đúng

Sau mỗi iteration, đoạn ngay sau `before` chứa thêm một node được đưa về đầu theo thứ tự đảo, còn `current` vẫn là tail của đoạn đó. `current.next` luôn là node tiếp theo chưa xử lý. Sau đúng `right-left` lần, toàn bộ `right-left+1` node trong range đã đảo thứ tự, trong khi prefix và suffix vẫn được nối đúng.

## 4. Dry run

Với `[1,2,3,4,5]`, `left=2`, `right=4`:

```text
1 -> 2 -> 3 -> 4 -> 5
1 -> 3 -> 2 -> 4 -> 5
1 -> 4 -> 3 -> 2 -> 5
```

Kết quả là `[1,4,3,2,5]`.

## 5. Java tối ưu

```java
public class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode before = dummy;
        for (int i = 1; i < left; i++) {
            before = before.next;
        }

        ListNode current = before.next;
        for (int i = 0; i < right - left; i++) {
            ListNode moving = current.next;
            current.next = moving.next;
            moving.next = before.next;
            before.next = moving;
        }

        return dummy.next;
    }
}
```

## 6. Complexity

- Time: `O(n)` worst case.
- Extra space: `O(1)`.

## 7. Hướng khác

Có thể reverse cục bộ bằng `prev/current/next` rồi reconnect ba phần prefix, reversed segment và suffix. Complexity vẫn `O(n)` / `O(1)`, nhưng phải quản lý nhiều boundary pointer hơn.

## 8. Edge cases

- `left == right`.
- `left == 1`.
- `right == n`.
- Reverse toàn bộ list.
- List một node.

## 9. Lỗi thường gặp

- Không dùng dummy nên sai khi `left = 1`.
- Di chuyển `current` trong head-insertion dù nó phải giữ vai trò tail.
- Lặp sai số lần (`right-left`, không phải `right-left+1`).
- Làm mất suffix do cập nhật pointer sai thứ tự.
