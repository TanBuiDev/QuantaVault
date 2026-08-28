# Solution / Lời giải — 92. Reverse Linked List II

## 1. Core idea

Dùng dummy và head-insertion. `before` đứng ngay trước segment; `current` là original left node và giữ vai trò tail. Mỗi vòng lấy `current.next` đưa lên đầu segment.

## 2. Optimal Java solution

```java
public class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // before là predecessor cố định của segment; dummy giúp left==1
        // vẫn có predecessor mà không cần special-case thay head.
        ListNode before = dummy;
        for (int i = 1; i < left; i++) {
            before = before.next;
        }

        // current là original left node và sẽ luôn là tail của phần đã đảo.
        ListNode current = before.next;
        for (int i = 0; i < right - left; i++) {
            // Head-insertion: lấy node ngay sau current và đưa nó lên đầu segment.
            // current không di chuyển vì sau mỗi insertion nó vẫn là tail reversed prefix.
            ListNode moving = current.next;
            current.next = moving.next;
            moving.next = before.next;
            before.next = moving;
        }

        return dummy.next;
    }
}
```

## 3. Correctness

Sau mỗi iteration, phần ngay sau `before` đã đảo thêm một node, `current` vẫn là tail và `current.next` là node tiếp theo chưa xử lý. Sau `right-left` lần, toàn segment đã reverse trong khi prefix/suffix vẫn nối đúng.

## 4. Complexity

```text
Time: O(n)
Space: O(1)
```

## 5. Common mistakes

- Không dùng dummy khi `left=1`.
- Di chuyển `current` dù nó phải giữ vai trò tail.
- Lặp `right-left+1` lần.
- Mất suffix do update pointer sai thứ tự.
