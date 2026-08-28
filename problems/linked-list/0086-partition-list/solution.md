# Solution / Lời giải — 86. Partition List

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
