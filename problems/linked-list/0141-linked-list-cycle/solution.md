# Solution / Lời giải — 141. Linked List Cycle

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Nếu linked list có cycle, slow đi 1 bước và fast đi 2 bước sẽ cuối cùng cùng nằm trong vòng; fast không thể mãi cách slow một khoảng khác vì khoảng cách modulo cycle length thay đổi mỗi bước.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** HashSet visited phát hiện repeat O(n) space. Quan sát Floyd cycle detection chỉ cần hai pointers; nếu không cycle thì fast chạm null, nếu có cycle thì fast 'đuổi kịp' slow trong ring.

**State / invariant / data structure cần hiểu trước code.** slow=slow.next, fast=fast.next.next. Invariant cả hai đi theo cùng next relation; sau khi cùng vào cycle, relative distance giảm/tăng modulo L một đơn vị mỗi iteration nên chắc chắn có lúc bằng0.

**Dry run mental theo implementation.** Dry run 3->2->0->-4 rồi -4.next=2: slow/fast tiến với tốc độ1/2; sau vài bước cả hai gặp nhau tại một node trong cycle, trả true mà không cần biết cycle bắt đầu đâu.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dereference fast.next.next khi fast/fast.next null. Khi nào dùng: repeated deterministic next-pointer state có thể dùng slow/fast để detect cycle O(1) space.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
