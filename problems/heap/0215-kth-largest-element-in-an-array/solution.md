# 215. Kth Largest Element in an Array — Solution

## 1. Core idea / Intuition
Duy trì min-heap chứa đúng `k` phần tử lớn nhất đã xử lý.

## 2. Requirement recap / Tóm tắt yêu cầu
Cần kth largest theo multiplicity, không cần distinct và không cần sort toàn mảng.

## 3. Key observations / Nhận xét quan trọng
Khi heap có hơn k phần tử, phần tử nhỏ nhất chắc chắn không thuộc top k cuối cùng và có thể loại.

## 4. Alternative approaches / Các hướng khác
Quickselect đạt O(n) average time và O(1) extra space; min-heap dễ triển khai và có bound O(n log k).

## 5. Optimal approach / Hướng tối ưu
Offer mọi số vào min-heap; nếu size > k thì poll. Sau cùng peek là kth largest.

## 6. Java solution overview
```java
PriorityQueue<Integer> heap = new PriorityQueue<>();
for (int num : nums) {
    heap.offer(num);
    if (heap.size() > k) heap.poll();
}
return heap.peek();
```

## 7. Code explanation / Giải thích code
Heap root luôn là ngưỡng top-k hiện tại.

## 8. Dry run / Chạy thử
Với `[3,2,1,5,6,4], k=2`, heap cuối là `[5,6]`, root 5.

## 9. Time and space complexity
O(n log k) time, O(k) space.

## 10. Why the algorithm is correct / Vì sao đúng
Invariant: sau mỗi prefix, heap chứa `min(k,prefixLength)` giá trị lớn nhất của prefix. Khi thêm giá trị mới và xóa minimum nếu cần, invariant được giữ. Cuối mảng, minimum của top-k chính là kth largest.

## 11. Edge cases
Duplicates, k=1, k=n, negative values.

## 12. Common mistakes
Tìm kth distinct; dùng max-heap rồi poll k lần với O(n) memory; comparator thừa.

## 13. Pattern recognition / Khi nào tái sử dụng
Bounded heap phù hợp với streaming top-k.

## 14. Vocabulary
**kth largest**: lớn thứ k; **bounded heap**: heap giới hạn kích thước; **top-k**: k phần tử lớn nhất.
