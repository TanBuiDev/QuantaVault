class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        int n = 0;
        for (ListNode p = head; p != null; p = p.next) n++;

        ListNode dummy = new ListNode(0, head);
        for (int size = 1; size < n; size <<= 1) {
            ListNode prev = dummy;
            ListNode curr = dummy.next;
            while (curr != null) {
                ListNode left = curr;
                ListNode right = split(left, size);
                curr = split(right, size);
                prev = merge(left, right, prev);
            }
        }
        return dummy.next;
    }

    private ListNode split(ListNode head, int size) {
        if (head == null) return null;
        for (int i = 1; i < size && head.next != null; i++) head = head.next;
        ListNode second = head.next;
        head.next = null;
        return second;
    }

    private ListNode merge(ListNode a, ListNode b, ListNode tail) {
        ListNode cur = tail;
        while (a != null && b != null) {
            if (a.val <= b.val) { cur.next = a; a = a.next; }
            else { cur.next = b; b = b.next; }
            cur = cur.next;
        }
        cur.next = a != null ? a : b;
        while (cur.next != null) cur = cur.next;
        return cur;
    }
}
