# Solution / Lời giải — 373. Find K Pairs with Smallest Sums

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Hai arrays sorted; với mỗi nums1[i], pairs (nums1[i],nums2[0]), (..nums2[1])... có sums tăng dần. Ta cần merge k sorted 'pair streams' theo sum.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Sinh mọi m*n pairs rồi sort quá lớn. Min-heap khởi tạo pair đầu của một số rows i; khi poll (i,j), chỉ successor (i,j+1) cùng row stream cần được offer.

**State / invariant / data structure cần hiểu trước code.** Heap chứa frontier nhỏ nhất chưa dùng của mỗi active nums1 row. Invariant heap root là pair có sum nhỏ nhất toàn cục chưa output vì mọi stream riêng sorted theo j.

**Dry run mental theo implementation.** nums1=[1,7,11], nums2=[2,4,6]: heap (1,2),(7,2),(11,2); poll(1,2) offer(1,4); poll(1,4) offer(1,6); rồi candidates tiếp quyết định top k.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là push toàn Cartesian product hoặc offer j+1 vượt bounds. Khi nào dùng: k smallest combinations từ sorted dimensions thường coi mỗi fixed-dimension slice là sorted stream và heap-merge frontiers.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

For each `nums1[i]`, increasing `j` creates a sorted stream of pair sums. Put the first pair of relevant streams in a min-heap and perform a k-way merge.

## 2. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        List<List<Integer>> result = new ArrayList<>();

        // For each fixed i, pairs (i,0),(i,1),... form a sorted stream of sums
        // because nums2 is sorted. The heap performs a k-way merge of these streams.
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) ->
            Long.compare((long) nums1[a[0]] + nums2[a[1]],
                         (long) nums1[b[0]] + nums2[b[1]]));

        // At most the first k rows can contribute to the global first k pairs:
        // for row i >= k, k earlier rows already have (row,0) sums no larger.
        for (int i = 0; i < Math.min(nums1.length, k); i++) {
            heap.offer(new int[]{i, 0});
        }

        while (k-- > 0 && !heap.isEmpty()) {
            int[] state = heap.poll();
            int i = state[0], j = state[1];
            result.add(List.of(nums1[i], nums2[j]));

            // After consuming the smallest remaining pair from row i, only its
            // next pair can newly become that row's frontier candidate.
            if (j + 1 < nums2.length) {
                heap.offer(new int[]{i, j + 1});
            }
        }
        return result;
    }
}
```

## 3. Correctness

The heap contains the smallest unconsumed pair from every active row-stream, so its root is the globally smallest unconsumed pair. Advancing only that stream restores the invariant; repeating yields the first `k` sums in order.

## 4. Complexity

Let `r = min(nums1.length, k)`: `O(r + k log r)` time and `O(r)` heap space, excluding output.
