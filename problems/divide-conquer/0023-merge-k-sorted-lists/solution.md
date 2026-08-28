# Solution / Lời giải — 23. Merge k Sorted Lists

## 1. Core idea

Maintain one frontier node per non-empty sorted list in a min-heap. The minimum frontier is always the smallest value among all remaining nodes.

## 2. Optimal Java solution

```java
import java.util.PriorityQueue;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));

        // The head of each sorted list is that list's smallest remaining value.
        // Keeping exactly those frontier nodes in a min-heap exposes the global minimum.
        for (ListNode node : lists) {
            if (node != null) heap.offer(node);
        }

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (!heap.isEmpty()) {
            ListNode node = heap.poll();

            // The heap minimum cannot be beaten by any node hidden later in a list,
            // because every such node is >= its own current frontier node.
            tail.next = node;
            tail = node;

            // Once node is consumed, its successor becomes the new frontier for
            // that same list and must enter the heap to preserve the invariant.
            if (node.next != null) heap.offer(node.next);
        }
        return dummy.next;
    }
}
```

## 3. Correctness

At all times the heap contains the smallest unmerged node from every active list. Therefore `poll()` returns the globally smallest remaining value; adding its successor restores the same invariant until all nodes are emitted.

## 4. Complexity

For `N` total nodes and `k` lists: `O(N log k)` time, `O(k)` heap space.
