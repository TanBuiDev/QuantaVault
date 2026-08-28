# Solution / Lời giải — 82. Remove Duplicates from Sorted List II

## 1. Core idea

Sorted list gom mọi value bằng nhau thành contiguous run. Run dài 1 được giữ; run dài >=2 phải bị bỏ toàn bộ. `prev` luôn là node cuối chắc chắn được giữ.

## 2. Optimal Java solution

```java
public class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // prev luôn là node cuối cùng chắc chắn được giữ trong result prefix.
        ListNode prev = dummy;
        ListNode current = head;

        while (current != null) {
            if (current.next != null && current.val == current.next.val) {
                int duplicateValue = current.val;

                // Sorted order gom toàn bộ duplicate value thành một contiguous run;
                // nhảy qua cả run để bài II không giữ lại dù chỉ một bản sao.
                while (current != null && current.val == duplicateValue) {
                    current = current.next;
                }
                prev.next = current;
            } else {
                // Chỉ advance prev khi current được chứng minh unique; nếu đang xóa run,
                // prev phải đứng yên để có thể nối qua toàn bộ run đó.
                prev = current;
                current = current.next;
            }
        }

        return dummy.next;
    }
}
```

## 3. Correctness

Mỗi distinct value tạo đúng một run. Nếu run có duplicate, loop đi qua toàn bộ run và predecessor nối thẳng tới value kế; nếu không, node được giữ và trở thành predecessor mới. Do đó result chứa đúng các value xuất hiện một lần.

## 4. Complexity

```text
Time: O(n)
Space: O(1)
```

## 5. Common mistakes

- Giữ một bản sao của duplicate run như bài 83.
- Advance `prev` vào run cần xóa.
- Không dùng dummy cho duplicate ở head.
