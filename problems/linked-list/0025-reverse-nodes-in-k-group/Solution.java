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
