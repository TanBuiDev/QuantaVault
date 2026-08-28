# Solution / Lời giải — 21. Merge Two Sorted Lists

## 1. Core idea

Giống merge step của Merge Sort: vì hai suffix đều sorted, node nhỏ nhất chưa xử lý phải là một trong hai current heads. Reuse input nodes và append head nhỏ hơn vào result.

## 2. Optimal Java solution

```java
public class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (list1 != null && list2 != null) {
            // Vì mỗi suffix đã sorted, global minimum chưa dùng chỉ có thể là
            // một trong hai head hiện tại; chọn head nhỏ hơn giữ result sorted.
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }

        // Một list đã hết thì suffix còn lại vốn sorted và mọi node của nó
        // có thể nối nguyên khối, không cần copy hoặc tiếp tục so sánh từng node.
        tail.next = list1 != null ? list1 : list2;
        return dummy.next;
    }
}
```

## 3. Correctness

Invariant: result tới `tail` chứa chính xác các node nhỏ nhất đã chọn theo sorted order; hai input pointers trỏ vào sorted suffix chưa dùng. Chọn head nhỏ hơn là lựa chọn đúng tiếp theo. Khi một suffix hết, nối suffix còn lại vẫn giữ thứ tự.

## 4. Complexity

```text
Time: O(m+n)
Space: O(1)
```

## 5. Common mistakes

- Tạo node copy không cần thiết.
- Quên advance input pointer hoặc tail.
- Không nối suffix còn lại.
