# Solution / Lời giải — 61. Rotate List

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
