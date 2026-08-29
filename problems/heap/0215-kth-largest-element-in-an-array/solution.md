# Solution / Lời giải — 215. Kth Largest Element in an Array

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Kth largest không cần sort toàn array nếu chỉ quan tâm k elements lớn nhất. Min-heap size k giữ đúng top-k hiện tại; heap root là phần tử nhỏ nhất trong top-k, tức kth largest sau khi scan hết.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Sort O(n log n) đúng. Heap size k cho O(n log k), hoặc quickselect average O(n). Heap dễ reasoning và ổn định: offer value, nếu size>k thì poll smallest.

**State / invariant / data structure cần hiểu trước code.** Invariant sau khi xử lý prefix: heap chứa k giá trị lớn nhất của prefix (hoặc tất cả nếu chưa đủ k). Vì root là nhỏ nhất trong heap, khi prefix hoàn chỉnh root chính là kth largest.

**Dry run mental theo implementation.** Dry run [3,2,1,5,6,4], k=2: heap giữ [2,3], gặp1 bị poll1; gặp5 poll2 -> [3,5]; gặp6 poll3 -> [5,6]; gặp4 bị poll4, root5.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dùng max-heap size k rồi root là largest chứ không kth. Khi nào dùng: streaming top-k thường là heap đối nghịch kích thước k để root đại diện boundary top-k.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Maintain a min-heap containing the `k` largest values seen so far. Whenever its size exceeds `k`, remove the smallest candidate.

## 2. Optimal Java solution

```java
import java.util.PriorityQueue;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Keep exactly the k largest values seen so far. A min-heap makes the
        // weakest member of that top-k set available at the root for eviction.
        PriorityQueue<Integer> heap = new PriorityQueue<>();

        for (int num : nums) {
            heap.offer(num);
            if (heap.size() > k) {
                // Removing the smallest of k+1 candidates leaves the k largest
                // values from the processed prefix, preserving the invariant.
                heap.poll();
            }
        }

        // The smallest value among the final k largest values is exactly kth largest.
        return heap.peek();
    }
}
```

## 3. Correctness

After every prefix the heap contains exactly its `k` largest values (or all values if fewer than `k`). Thus after the full array, the heap root is the smallest member of the global top `k`, i.e. the kth largest.

## 4. Complexity

`O(n log k)` time, `O(k)` space.
