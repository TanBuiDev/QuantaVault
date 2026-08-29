# Solution / Lời giải — 19. Remove Nth Node From End of List

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Muốn xóa node thứ n từ cuối nhưng list chỉ đi xuôi. Nếu fast đi trước slow đúng n+1 bước kể từ dummy, khi fast tới null thì slow đứng ngay trước node cần xóa.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Đếm length rồi đi lần hai đúng nhưng cần hai passes. Quan sát khoảng cách cố định giữa hai pointers biến 'n từ cuối' thành một pass; dummy tạo predecessor ngay cả khi node cần xóa là head.

**State / invariant / data structure cần hiểu trước code.** fast và slow bắt đầu ở dummy; sau khi tạo gap, invariant fast luôn cách slow n+1 edges. Khi fast=null, slow.next chính là target và phép xóa chỉ là slow.next=slow.next.next.

**Dry run mental theo implementation.** Dry run 1->2->3->4->5, n=2: fast được đẩy ba edges trước slow; cùng tiến đến khi fast null, slow ở node3 nên bỏ slow.next=node4, còn 1->2->3->5.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là gap n thay vì n+1 khi muốn predecessor, hoặc không dùng dummy cho xóa head. Khi nào dùng: kth-from-end trong singly list thường là fixed-gap two pointers.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
