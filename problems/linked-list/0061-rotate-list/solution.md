# Solution / Lời giải — 61. Rotate List

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Rotate list phải k nghĩa là lấy k node cuối đưa lên đầu. Nếu biết length n, rotate k tương đương cắt sau node thứ n-k rồi nối tail cũ vào head cũ.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Di chuyển tail lên đầu k lần là O(nk). Quan sát k có thể giảm modulo n và list có thể tạm nối thành vòng; sau đó chỉ cần tìm newTail đúng n-k steps rồi break vòng.

**State / invariant / data structure cần hiểu trước code.** tail và length được tìm trong pass đầu; sau tail.next=head tạo cycle, newTail nằm n-k-1 edges từ head và newHead=newTail.next. Invariant cycle bảo toàn mọi node trong lúc đổi điểm cắt.

**Dry run mental theo implementation.** Dry run 1->2->3->4->5, k=2: n=5, tạo 5->1; newTail là node3, newHead=4; cắt 3.next=null cho 4->5->1->2->3.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là quên k%=n, off-by-one newTail hoặc không break cycle. Khi nào dùng: list rotation thường dễ hơn nếu tạm biến list thành ring rồi chọn điểm cắt mới.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Chuẩn hóa `k %= n`, nối tail về head thành cycle tạm, tìm new tail tại vị trí `n-k`, rồi cắt cycle. Suffix dài `k` tự trở thành prefix mới mà không cần rotate từng bước.

## 2. Optimal Java solution

```java
public class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null || k == 0) {
            return head;
        }

        int length = 1;
        ListNode tail = head;
        while (tail.next != null) {
            tail = tail.next;
            length++;
        }

        // Mỗi length rotations đưa list về nguyên trạng, nên modulo loại toàn bộ
        // vòng dư và giữ thời gian phụ thuộc n thay vì phụ thuộc k có thể rất lớn.
        k %= length;
        if (k == 0) {
            return head;
        }

        // Tạo cycle tạm để rotation chỉ còn là chọn một cạnh mới để cắt.
        tail.next = head;

        // Suffix dài k sẽ thành prefix, nên new tail là node thứ length-k
        // tính 1-based, tức cần đi length-k-1 cạnh từ old head.
        int stepsToNewTail = length - k - 1;
        ListNode newTail = head;
        for (int i = 0; i < stepsToNewTail; i++) {
            newTail = newTail.next;
        }

        ListNode newHead = newTail.next;
        // Cắt cycle đúng sau new tail tạo thứ tự suffix -> old prefix.
        newTail.next = null;
        return newHead;
    }
}
```

## 3. Correctness

Rotation phải đổi `A B` thành `B A` với `|B|=k`. Cycle giữ nguyên circular order; cắt sau node cuối của `A` làm node đầu của `B` thành head và tail cũ tiếp tục nối vào old head, cho đúng `B A`.

## 4. Complexity

```text
Time: O(n)
Space: O(1)
```

## 5. Common mistakes

- Không modulo `k`.
- Off-by-one ở new tail.
- Tạo cycle nhưng quên cắt.
- Rotate từng bước thành `O(kn)`.
