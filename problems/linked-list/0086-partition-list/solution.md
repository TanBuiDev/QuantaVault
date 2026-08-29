# Solution / Lời giải — 86. Partition List

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Partition list cần mọi node < x đứng trước nodes >= x nhưng phải giữ relative order trong mỗi nhóm. Ta có thể stream mỗi node vào một trong hai lists rồi nối chúng.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Swap values/nodes tại chỗ dễ phá stability và pointer. Quan sát hai dummy heads small/large biến bài thành stable partition: append node theo original order vào đúng tail.

**State / invariant / data structure cần hiểu trước code.** beforeTail và afterTail là đuôi của hai lists đã phân loại. Invariant mỗi list giữ đúng relative order của nodes đã thấy thuộc nhóm đó; cuối phải set afterTail.next=null rồi nối beforeTail.next=afterDummy.next.

**Dry run mental theo implementation.** Dry run 1->4->3->2->5->2, x=3: before nhận 1,2,2; after nhận4,3,5; nối thành 1->2->2->4->3->5, thứ tự nội bộ được giữ.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là quên terminate after list tạo cycle qua next cũ. Khi nào dùng: stable partition của linked list thường dùng nhiều dummy-tail buckets rồi concatenate.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Tạo hai stable lists: `< x` và `>= x`. Duyệt input theo thứ tự và append mỗi node vào tail đúng partition; cuối cùng nối hai lists.

## 2. Optimal Java solution

```java
public class Solution {
    public ListNode partition(ListNode head, int x) {
        ListNode lessDummy = new ListNode(0);
        ListNode greaterDummy = new ListNode(0);
        ListNode lessTail = lessDummy;
        ListNode greaterTail = greaterDummy;

        ListNode current = head;
        while (current != null) {
            // Append vào tail thay vì insert ở head để giữ relative order ổn định
            // của các node trong từng partition như đề yêu cầu.
            if (current.val < x) {
                lessTail.next = current;
                lessTail = current;
            } else {
                greaterTail.next = current;
                greaterTail = current;
            }
            current = current.next;
        }

        // Node cuối greater có thể vẫn trỏ theo edge cũ sang một node đã chuyển
        // sang less; cắt null trước khi nối hai list để tránh cycle/cross-link cũ.
        greaterTail.next = null;
        lessTail.next = greaterDummy.next;
        return lessDummy.next;
    }
}
```

## 3. Correctness

Mỗi node đi vào đúng một partition. Append theo traversal order giữ relative order trong từng nhóm. Cắt tail của greater xóa edge cũ, rồi nối less trước greater tạo đúng partition stable.

## 4. Complexity

```text
Time: O(n)
Space: O(1)
```

## 5. Common mistakes

- Sort list và phá stable order.
- Insert ở head làm đảo thứ tự.
- Quên `greaterTail.next = null`.
- Dùng `<= x` sai partition.
