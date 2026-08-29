# Solution / Lời giải — 92. Reverse Linked List II

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Reverse list chỉ trong [left,right] cần giữ ba vùng: prefix trước left, segment đang reverse, suffix sau right. Dummy cho ta node predecessor ngay cả khi left=1.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Tách values rồi đảo không luyện pointer và dùng extra space. Quan sát head-insertion có thể giữ sublistPrev cố định rồi lần lượt kéo node sau current lên đầu segment, mỗi lần O(1).

**State / invariant / data structure cần hiểu trước code.** sublistPrev là node trước vùng reverse, current ban đầu là node left. Mỗi iteration lấy move=current.next, tháo move rồi chèn ngay sau sublistPrev; current vẫn là tail của phần đã reverse.

**Dry run mental theo implementation.** Dry run 1->2->3->4->5, left2 right4: prev=1,current=2; kéo3 trước2 ->1,3,2,4,5; kéo4 trước3 ->1,4,3,2,5.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là mất current.next khi rewiring hoặc move sublistPrev trong loop. Khi nào dùng: reverse một contiguous linked segment có thể dùng fixed predecessor + repeated head insertion.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
