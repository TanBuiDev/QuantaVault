public class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode before = dummy;
        for (int i = 1; i < left; i++) {
            before = before.next;
        }

        ListNode current = before.next;
        for (int i = 0; i < right - left; i++) {
            ListNode moving = current.next;
            current.next = moving.next;
            moving.next = before.next;
            before.next = moving;
        }

        return dummy.next;
    }
}
