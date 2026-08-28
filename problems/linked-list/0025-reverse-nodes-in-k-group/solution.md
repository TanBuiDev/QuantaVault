# Solution / Lời giải — 25. Reverse Nodes in k-Group

## 1. Core idea

Xử lý từng block `k` node. Luôn tìm `kth` trước để bảo đảm group đủ `k`; nếu thiếu thì remainder giữ nguyên. Lưu `groupNext`, reverse đúng `[groupPrev.next .. kth]`, rồi reconnect prefix và suffix.

## 2. Optimal Java solution

```java
public class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode groupPrev = dummy;

        while (true) {
            // Phải xác nhận đủ k node TRƯỚC khi đảo; nếu không đủ, remainder
            // bắt buộc giữ nguyên và không được mutate một phần.
            ListNode kth = getKth(groupPrev, k);
            if (kth == null) {
                return dummy.next;
            }

            ListNode groupNext = kth.next;
            ListNode oldGroupHead = groupPrev.next;

            // Khởi tạo prev = groupNext khiến tail mới của reversed group tự nối
            // đúng vào suffix trong cùng quá trình reverse, tránh một reconnect riêng.
            ListNode prev = groupNext;
            ListNode current = oldGroupHead;

            while (current != groupNext) {
                ListNode next = current.next;
                current.next = prev;
                prev = current;
                current = next;
            }

            // kth là head mới; old head đã trở thành tail và là predecessor
            // cho group kế tiếp, nên groupPrev phải nhảy tới oldGroupHead.
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

## 3. Correctness

Mỗi iteration chỉ chạy với một group đủ `k`. Reverse loop đảo chính xác group và nhờ `prev=groupNext` tail mới đã nối suffix. `groupPrev.next=kth` nối prefix với head mới. Prefix hoàn tất không bị sửa lại; remainder thiếu `k` chưa từng bị mutate.

## 4. Complexity

```text
Time: O(n)
Space: O(1)
```

## 5. Common mistakes

- Reverse trước khi xác nhận đủ `k`.
- Quên `groupNext`.
- Quên old head trở thành tail.
- Reconnect sai suffix.
