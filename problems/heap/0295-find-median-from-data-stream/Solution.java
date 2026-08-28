import java.util.Collections;
import java.util.PriorityQueue;

class MedianFinder {
    // lower is a max-heap for the smaller half; upper is a min-heap for the larger half.
    // Invariant: every lower value <= every upper value, and lower has equal size or +1.
    private final PriorityQueue<Integer> lower;
    private final PriorityQueue<Integer> upper;

    public MedianFinder() {
        lower = new PriorityQueue<>(Collections.reverseOrder());
        upper = new PriorityQueue<>();
    }

    public void addNum(int num) {
        // Insert into lower first, then move its maximum to upper. This guarantees
        // the cross-heap ordering even when num belongs in the upper half.
        lower.offer(num);
        upper.offer(lower.poll());

        // Keep lower as the heap allowed to own the one extra element for odd count.
        if (lower.size() < upper.size()) {
            lower.offer(upper.poll());
        }
    }

    public double findMedian() {
        if (lower.size() > upper.size()) {
            // Odd count: the extra lower element is the middle order statistic.
            return lower.peek();
        }

        // Even count: the two heap roots are the two middle values. Cast before
        // addition to prevent overflow for large signed ints.
        return ((long) lower.peek() + upper.peek()) / 2.0;
    }
}
