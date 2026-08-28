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
