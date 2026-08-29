# Solution / Lời giải — 21. Merge Two Sorted Lists

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Hai lists đã sorted, nên head nhỏ hơn chắc chắn là node nhỏ nhất còn lại của merged list. Chọn node đó rồi chỉ tiến pointer của list vừa chọn giống merge step trong merge sort.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Copy mọi value rồi sort lại bỏ phí sorted order và tạo extra work. Quan sát local smallest head là globally safe; dummy node giúp append đầu tiên và mọi node sau bằng cùng một công thức.

**State / invariant / data structure cần hiểu trước code.** p1,p2 là suffix chưa merge; tail là node cuối output. Invariant list từ dummy.next tới tail đã chứa đúng các phần tử nhỏ nhất đã tiêu thụ theo sorted order.

**Dry run mental theo implementation.** Dry run 1->2->4 và 1->3->4: chọn 1(list1),1(list2),2,3,4 rồi nối suffix 4 còn lại. Không cần tạo node mới nếu implementation relink nodes.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là quên nối phần list còn lại hoặc làm mất next khi relink. Khi nào dùng: merge hai sorted streams là classic two pointers với dummy tail.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
