public class Solution {
    public ListNode partition(ListNode head, int x) {
        ListNode lessDummy = new ListNode(0);
        ListNode greaterDummy = new ListNode(0);
        ListNode lessTail = lessDummy;
        ListNode greaterTail = greaterDummy;

        ListNode current = head;
        while (current != null) {
            // Append vào tail thay vì insert ở head để giữ relative order ổn định
            // của các node trong từng partition như đề yêu cầu.
            if (current.val < x) {
                lessTail.next = current;
                lessTail = current;
            } else {
                greaterTail.next = current;
                greaterTail = current;
            }
            current = current.next;
        }

        // Node cuối greater có thể vẫn trỏ theo edge cũ sang một node đã chuyển
        // sang less; cắt null trước khi nối hai list để tránh cycle/cross-link cũ.
        greaterTail.next = null;
        lessTail.next = greaterDummy.next;
        return lessDummy.next;
    }
}
