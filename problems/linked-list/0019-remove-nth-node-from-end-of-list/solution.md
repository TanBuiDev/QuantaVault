# Solution / Lời giải — 19. Remove Nth Node From End of List

## 1. Core idea / Ý tưởng chính

Dùng hai pointer với khoảng cách cố định. Nếu `fast` đi trước `slow` đúng `n + 1` cạnh, khi `fast` chạm `null`, `slow` sẽ đứng ngay trước node thứ `n` tính từ cuối.

Dummy node làm cho việc xóa head không cần special case.

## 2. Algorithm / Thuật toán

1. Tạo `dummy.next = head`.
2. `fast = dummy`, `slow = dummy`.
3. Cho `fast` đi `n + 1` bước.
4. Trong khi `fast != null`, cho cả `fast` và `slow` cùng tiến một bước.
5. Xóa target bằng `slow.next = slow.next.next`.
6. Return `dummy.next`.

## 3. Why it works / Vì sao đúng

Sau khi đưa `fast` đi trước `n + 1` cạnh, khoảng cách giữa `fast` và `slow` được giữ nguyên vì cả hai cùng tiến một bước. Khi `fast` vừa vượt qua tail và trở thành `null`, từ `slow.next` tới tail có đúng `n` node. Vì vậy `slow.next` là node thứ `n` tính từ cuối. Bỏ qua node này bằng một phép rewiring sẽ tạo đúng result.

## 4. Dry run / Chạy thử

Với `[1,2,3,4,5]`, `n=2`, thêm dummy `D`:

```text
D -> 1 -> 2 -> 3 -> 4 -> 5
```

Đưa `fast` đi `3` bước, sau đó di chuyển cả hai cho tới khi `fast = null`. Khi đó:

```text
slow = 3
slow.next = 4  // node thứ 2 từ cuối
```

Gán `3.next = 5`, kết quả `[1,2,3,5]`.

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode fast = dummy;
        ListNode slow = dummy;

        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }

        slow.next = slow.next.next;
        return dummy.next;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(nList)` — một pass theo nghĩa mỗi pointer chỉ tiến về phía trước; tổng số bước tuyến tính.
- **Extra space:** `O(1)`.

## 7. Alternative — Two passes

Có thể pass 1 đếm length `L`, rồi pass 2 đi tới node ở vị trí `L-n` trước target. Cách đó vẫn `O(n)` nhưng follow-up muốn one-pass pointer technique, nên fixed-gap solution tốt hơn cho interview.

## 8. Edge cases / Trường hợp biên

- Xóa head: `n == length`.
- Xóa tail: `n == 1`.
- List một node → result `null`.
- List hai node, xóa một trong hai đầu.

## 9. Common mistakes / Lỗi thường gặp

- Chỉ tạo gap `n` rồi để `slow` đứng ngay target thay vì predecessor.
- Không dùng dummy và làm phức tạp case xóa head.
- Off-by-one khi advance `fast`.
- Dùng length pass dù đang được hỏi follow-up one-pass.
