# Solution / Lời giải — 19. Remove Nth Node From End of List

## 1. Core idea

Dùng fast/slow với khoảng cách cố định. Cho `fast` đi trước `n+1` cạnh từ dummy; khi `fast` chạm `null`, `slow` đứng ngay trước node thứ `n` tính từ cuối.

## 2. Optimal Java solution

```java
public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Dummy cho phép node cần xóa là head nhưng slow vẫn luôn có một predecessor.
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode fast = dummy;
        ListNode slow = dummy;

        // Tạo gap n+1 cạnh để khi fast chạm null, slow đứng NGAY TRƯỚC target
        // chứ không đứng tại target; nhờ đó deletion chỉ cần một phép rewire.
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        // Cả hai tiến cùng tốc độ nên gap n+1 được giữ bất biến tới cuối list.
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }

        slow.next = slow.next.next;
        return dummy.next;
    }
}
```

## 3. Correctness

Gap `n+1` được giữ nguyên vì hai pointer cùng tiến một bước. Khi `fast == null`, từ `slow.next` tới tail có đúng `n` node, nên `slow.next` chính là target và rewire bỏ đúng node đó.

## 4. Complexity

```text
Time: O(L)
Space: O(1)
```

## 5. Common mistakes

- Tạo gap `n` khiến slow đứng tại target thay vì predecessor.
- Không dùng dummy cho case xóa head.
- Off-by-one ở vòng advance fast.
