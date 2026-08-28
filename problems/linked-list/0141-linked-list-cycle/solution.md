# Solution / Lời giải — 141. Linked List Cycle

## 1. Core idea

Floyd slow/fast: slow đi 1, fast đi 2. Không cycle thì fast chạm null. Có cycle thì sau khi cả hai vào vòng, fast tăng khoảng cách tương đối 1 modulo cycle length mỗi bước nên cuối cùng gặp slow.

## 2. Optimal Java solution

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        // Guard cả fast và fast.next vì fast nhảy hai cạnh; nếu một trong hai
        // chạm null thì path hữu hạn và không thể có cycle reachable từ head.
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            // So sánh node identity, không so val: cycle là quay lại cùng object,
            // còn hai node khác nhau hoàn toàn có thể chứa cùng giá trị.
            if (slow == fast) {
                return true;
            }
        }

        return false;
    }
}
```

## 3. Correctness

Nếu acyclic, fast chắc chắn tới null. Nếu có cycle dài `C`, khi cả hai trong cycle khoảng cách tương đối thay đổi `+1 mod C`, nên trong tối đa `C` bước khoảng cách thành 0 và hai pointer gặp nhau.

## 4. Complexity

```text
Time: O(n)
Space: O(1)
```

## 5. Common mistakes

- So `val` thay vì node reference.
- Không guard `fast.next`.
- Cho fast cũng đi một bước.
