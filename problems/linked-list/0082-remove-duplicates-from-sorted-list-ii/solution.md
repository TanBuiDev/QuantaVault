# Solution / Lời giải — 82. Remove Duplicates from Sorted List II

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Khác bài remove duplicates giữ một copy, bài này phải xóa toàn bộ value xuất hiện nhiều lần. Sorted order giúp nhận một run duplicate liên tiếp và bỏ cả run.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Đếm frequency bằng map rồi rebuild dùng extra space. Quan sát chỉ cần prev trước run và current scan run; dummy rất quan trọng vì run duplicate có thể bắt đầu ngay ở head.

**State / invariant / data structure cần hiểu trước code.** prev trỏ node cuối chắc chắn giữ; current trỏ run đang xét. Nếu current.next cùng value, advance tới cuối run rồi set prev.next sau run; nếu unique, prev tiến một node.

**Dry run mental theo implementation.** Dry run 1->2->3->3->4->4->5: giữ1,2; tại3 detect duplicate, skip cả hai3; tại4 skip cả run4; giữ5, output 1->2->5.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ xóa duplicate thứ hai và giữ một copy, hoặc không có dummy khi head duplicate. Khi nào dùng: sorted list run filtering thường cần predecessor ổn định + scan tới end of run.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
