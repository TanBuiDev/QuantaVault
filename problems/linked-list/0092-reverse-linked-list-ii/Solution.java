public class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // before là predecessor cố định của segment; dummy giúp left==1
        // vẫn có predecessor mà không cần special-case thay head.
        ListNode before = dummy;
        for (int i = 1; i < left; i++) {
            before = before.next;
        }

        // current là original left node và sẽ luôn là tail của phần đã đảo.
        ListNode current = before.next;
        for (int i = 0; i < right - left; i++) {
            // Head-insertion: lấy node ngay sau current và đưa nó lên đầu segment.
            // current không di chuyển vì sau mỗi insertion nó vẫn là tail reversed prefix.
            ListNode moving = current.next;
            current.next = moving.next;
            moving.next = before.next;
            before.next = moving;
        }

        return dummy.next;
    }
}
