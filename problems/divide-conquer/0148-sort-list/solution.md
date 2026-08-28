# Solution / Lời giải — 148. Sort List

## 1. Core idea

Bottom-up merge sort is ideal for linked lists: split adjacent sorted runs, merge them by rewiring pointers, and double run size each pass. It achieves `O(n log n)` without recursion.

## 2. Optimal Java solution

```java
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

        // Bottom-up merge sort avoids recursion: after the pass for 'size', every
        // run of up to 2*size nodes is sorted. Doubling eventually covers the list.
        for (int size = 1; size < n; size <<= 1) {
            ListNode prev = dummy;
            ListNode curr = dummy.next;

            while (curr != null) {
                ListNode left = curr;
                ListNode right = split(left, size);
                curr = split(right, size);

                // merge attaches the two isolated sorted runs after prev and returns
                // their new tail, so the next merged block can be connected in O(1).
                prev = merge(left, right, prev);
            }
        }
        return dummy.next;
    }

    private ListNode split(ListNode head, int size) {
        if (head == null) return null;

        // Cut after at most 'size' nodes. Returning the next node isolates the
        // current run so merge cannot accidentally consume nodes from a later run.
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
```

## 3. Correctness

Each pass merges pairs of already-sorted runs into larger sorted runs without losing nodes. Starting from one-node sorted runs and doubling their size proves by induction that the final single run is the entire list in sorted order.

## 4. Complexity

`O(n log n)` time and `O(1)` auxiliary pointer space.
