# Solution / Lời giải — 25. Reverse Nodes in k-Group

## 1. Core idea / Ý tưởng chính

Xử lý list từng block `k` node. Với mỗi block, trước hết tìm node thứ `k`. Nếu không tồn tại thì phần còn lại có ít hơn `k` node và phải giữ nguyên.

Khi đủ `k`, lưu `groupNext = kth.next`, rồi reverse chính xác các node từ `groupPrev.next` tới ngay trước `groupNext`. Dummy node giúp nhóm đầu tiên được xử lý giống các nhóm sau.

## 2. Algorithm / Thuật toán

1. Tạo `dummy.next = head`, `groupPrev = dummy`.
2. Tìm `kth` bằng cách đi `k` bước từ `groupPrev`.
3. Nếu `kth == null`, return `dummy.next`.
4. Lưu `groupNext = kth.next`.
5. Reverse group:
   - `prev = groupNext`
   - `current = groupPrev.next`
   - trong khi `current != groupNext`, đảo cạnh `current.next`.
6. `oldGroupHead = groupPrev.next` chính là tail sau reverse.
7. Nối `groupPrev.next = kth` và đặt `groupPrev = oldGroupHead`.
8. Lặp lại.

## 3. Why it works / Vì sao đúng

Mỗi iteration chỉ chạy khi đã xác nhận có đủ `k` node. Loop reversal đảo đúng các cạnh của group và dùng `prev = groupNext`, nên tail mới tự nối tới suffix. Node `kth` trở thành head mới của group, còn head cũ trở thành tail. Prefix trước `groupPrev` đã hoàn tất và không bị thay đổi lại. Vì vậy sau mỗi iteration thêm đúng một nhóm `k` node được reverse; khi còn ít hơn `k`, thuật toán dừng mà không đụng phần dư.

## 4. Dry run / Chạy thử

Với `[1,2,3,4,5]`, `k=2`:

```text
Group 1: [1,2] -> [2,1]
List:    [2,1,3,4,5]
Group 2: [3,4] -> [4,3]
List:    [2,1,4,3,5]
Remainder: [5] has fewer than 2 nodes -> unchanged
```

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode groupPrev = dummy;

        while (true) {
            ListNode kth = getKth(groupPrev, k);
            if (kth == null) {
                return dummy.next;
            }

            ListNode groupNext = kth.next;
            ListNode oldGroupHead = groupPrev.next;
            ListNode prev = groupNext;
            ListNode current = oldGroupHead;

            while (current != groupNext) {
                ListNode next = current.next;
                current.next = prev;
                prev = current;
                current = next;
            }

            groupPrev.next = kth;
            groupPrev = oldGroupHead;
        }
    }

    private ListNode getKth(ListNode start, int k) {
        while (start != null && k > 0) {
            start = start.next;
            k--;
        }
        return start;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)`. Mỗi group được scan để xác nhận `k` node rồi reverse; tổng vẫn tuyến tính với hệ số hằng số.
- **Extra space:** `O(1)`.

## 7. Edge cases / Trường hợp biên

- `k = 1` → list giữ nguyên.
- `k = n` → reverse toàn bộ list.
- `n` chia hết cho `k`.
- `n` không chia hết cho `k` → phần dư giữ nguyên.
- Một node với `k = 1`.

## 8. Common mistakes / Lỗi thường gặp

- Reverse group trước khi xác nhận đủ `k` node.
- Quên lưu `groupNext` trước khi thay đổi pointer.
- Quên rằng head cũ trở thành tail mới.
- Không nối tail của reversed group tới suffix.
- Dùng recursion rồi tuyên bố `O(1)` space dù call stack tăng theo số group.
