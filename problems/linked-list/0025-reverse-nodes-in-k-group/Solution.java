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
