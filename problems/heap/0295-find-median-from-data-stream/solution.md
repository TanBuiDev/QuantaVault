# 295. Find Median from Data Stream — Solution

## 1. Core idea / Intuition
Two heaps maintain the ordered split without sorting the full stream after every insertion.

## 2. Requirement recap / Tóm tắt yêu cầu
Need fast insertion and median query for an online data stream.

## 3. Key observations / Nhận xét quan trọng
Max-heap `lower` stores the smaller half; min-heap `upper` stores the larger half. Keep `lower.size()` equal to or one larger than `upper.size()`.

## 4. Alternative approaches / Các hướng khác
A sorted list makes insertion O(n); sorting per query is worse.

## 5. Optimal approach / Hướng tối ưu
Insert into `lower`, move its max to `upper`, then move `upper` min back if lower became smaller.

## 6. Java solution overview
```java
class MedianFinder {
    private final PriorityQueue<Integer> lower = new PriorityQueue<>(Collections.reverseOrder());
    private final PriorityQueue<Integer> upper = new PriorityQueue<>();
    public void addNum(int num) {
        lower.offer(num);
        upper.offer(lower.poll());
        if (lower.size() < upper.size()) lower.offer(upper.poll());
    }
    public double findMedian() {
        if (lower.size() > upper.size()) return lower.peek();
        return ((long) lower.peek() + upper.peek()) / 2.0;
    }
}
```

## 7. Code explanation / Giải thích code
Rebalancing enforces ordering and size invariants after each insert.

## 8. Dry run / Chạy thử
After 1,2: lower=[1], upper=[2], median=1.5. After 3: lower holds two values and top is 2.

## 9. Time and space complexity
`addNum`: O(log n); `findMedian`: O(1); space O(n).

## 10. Why the algorithm is correct / Vì sao đúng
All lower values are <= all upper values, and balanced sizes place the median at one heap top or the average of both tops.

## 11. Edge cases
Single value, duplicates, negative values, even/odd counts.

## 12. Common mistakes
Integer overflow when averaging; broken heap-size invariant.

## 13. Pattern recognition / Khi nào tái sử dụng
Two-heaps is the standard online median/order-statistic pattern.

## 14. Vocabulary
**median**: trung vị; **max-heap**: heap cực đại; **rebalance**: cân bằng lại; **data stream**: luồng dữ liệu.
