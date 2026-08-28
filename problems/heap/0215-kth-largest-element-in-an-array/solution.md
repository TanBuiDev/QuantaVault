# Solution / Lời giải — 215. Kth Largest Element in an Array

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
