# Solution / Lời giải — 82. Remove Duplicates from Sorted List II

## 1. Core idea / Ý tưởng chính

Vì list sorted, các node cùng value luôn đứng liền nhau. Ta duyệt từng run value và phân biệt hai trường hợp:

- run chỉ có một node → giữ node đó và advance `prev`;
- run có từ hai node trở lên → bỏ toàn bộ run bằng cách nối `prev.next` tới node đầu tiên có value khác.

Dummy head xử lý tự nhiên trường hợp duplicate run nằm ngay đầu list.

## 2. Algorithm / Thuật toán

1. Tạo `dummy.next = head`.
2. `prev = dummy`, `current = head`.
3. Trong khi `current != null`:
   - Nếu `current.next != null` và `current.val == current.next.val`, lưu `duplicateValue = current.val` và advance `current` cho tới khi value đổi; sau đó `prev.next = current`.
   - Nếu không duplicate, set `prev = current`, `current = current.next`.
4. Return `dummy.next`.

## 3. Why it works / Vì sao đúng

Do sorted order, tất cả node mang cùng một value tạo thành đúng một contiguous run. Khi phát hiện hai node liên tiếp bằng nhau, ta biết toàn bộ run của value đó phải bị xóa; loop nội bộ đi tới node đầu tiên có value khác, rồi `prev.next` bỏ qua chính xác toàn bộ run. Nếu node hiện tại không có neighbor cùng value, value đó chỉ xuất hiện một lần trong run hiện tại nên được giữ. Vì mọi run được xử lý đúng một lần, kết quả chứa chính xác các distinct values ban đầu và vẫn giữ sorted order.

## 4. Dry run / Chạy thử

```text
[1,2,3,3,4,4,5]
```

- `1`: unique → giữ.
- `2`: unique → giữ.
- run `3,3`: bỏ cả hai.
- run `4,4`: bỏ cả hai.
- `5`: unique → giữ.

Kết quả: `[1,2,5]`.

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode prev = dummy;
        ListNode current = head;

        while (current != null) {
            if (current.next != null && current.val == current.next.val) {
                int duplicateValue = current.val;
                while (current != null && current.val == duplicateValue) {
                    current = current.next;
                }
                prev.next = current;
            } else {
                prev = current;
                current = current.next;
            }
        }

        return dummy.next;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)` — mỗi node được advance qua tối đa một lần.
- **Extra space:** `O(1)`.

## 7. Edge cases / Trường hợp biên

- Empty list.
- Một node.
- Tất cả node duplicate → empty result.
- Duplicate run ở đầu.
- Duplicate run ở cuối.
- Nhiều run duplicate xen giữa distinct nodes.

## 8. Common mistakes / Lỗi thường gặp

- Chỉ xóa các bản sao thừa và giữ lại một node của value duplicate — sai yêu cầu bài II.
- Advance `prev` vào duplicate run.
- Không dùng dummy nên xử lý sai duplicate ngay head.
- Bỏ sót duplicate run kéo dài hơn hai node.
- So sánh value sau khi `current` đã thành `null`.
