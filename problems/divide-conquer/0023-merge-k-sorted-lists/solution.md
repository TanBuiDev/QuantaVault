# Solution / Lời giải — 23. Merge k Sorted Lists

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Merging k sorted lists luôn cần biết head nhỏ nhất hiện tại trong k candidates. Sau khi lấy node nhỏ nhất, chỉ head của list chứa node đó thay đổi; các lists khác giữ nguyên candidate.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Mỗi lần scan k heads cho min tốn O(Nk). Min-heap giữ đúng k heads và cho poll/offer O(log k), nên tổng O(N log k); alternative divide-and-conquer pairwise merge cũng đạt cùng bound.

**State / invariant / data structure cần hiểu trước code.** Heap chứa tối đa một next-unmerged node từ mỗi list đang còn dữ liệu. Invariant heap minimum là node nhỏ nhất toàn cục chưa merge; sau poll node x, chỉ offer x.next để đại diện phần còn lại list đó.

**Dry run mental theo implementation.** Dry run lists [1,4,5],[1,3,4],[2,6]: heap đầu 1,1,2; poll1(listA) rồi offer4; poll1(listB) offer3; poll2 offer6; output tăng dần tự nhiên.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là push toàn bộ nodes ngay từ đầu làm heap lớn N hoặc quên offer next sau poll. Khi nào dùng: merge k sorted streams thường là heap giữ một frontier item mỗi stream hoặc divide-and-conquer pair merges.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
