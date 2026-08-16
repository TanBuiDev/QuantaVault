# 373. Find K Pairs with Smallest Sums — Solution

## 1. Core idea / Intuition
Mỗi `i` tạo một sorted stream các cặp theo `j`; ta k-way merge những stream này bằng min-heap.

## 2. Requirement recap / Tóm tắt yêu cầu
Không thể tạo mọi cặp vì tích kích thước có thể rất lớn; chỉ cần `k` cặp đầu.

## 3. Key observations / Nhận xét quan trọng
Trong mỗi hàng, cặp kế tiếp sau `(i,j)` là `(i,j+1)`. Heap chỉ cần frontier nhỏ nhất của mỗi hàng.

## 4. Alternative approaches / Các hướng khác
Sinh toàn bộ cặp rồi sort tốn O(mn) memory/time. Heap frontier tránh việc đó.

## 5. Optimal approach / Hướng tối ưu
Seed `(i,0)` cho `i < min(m,k)`. Poll nhỏ nhất, append vào output, rồi push successor cùng hàng.

## 6. Java solution overview
```java
PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) ->
    Long.compare((long) nums1[a[0]] + nums2[a[1]],
                 (long) nums1[b[0]] + nums2[b[1]]));
```
Dùng heap index pairs và mở rộng mỗi hàng tuần tự.

## 7. Code explanation / Giải thích code
Comparator dùng `long` để tránh overflow khi cộng.

## 8. Dry run / Chạy thử
Với `[1,7,11]` và `[2,4,6]`, heap bắt đầu `[1,2],[7,2],[11,2]`; ba poll đầu thuộc hàng `1`.

## 9. Time and space complexity
`O(k log min(k,m))` time; `O(min(k,m))` heap, ngoài output.

## 10. Why the algorithm is correct / Vì sao đúng
Heap luôn chứa phần tử chưa dùng nhỏ nhất của mỗi hàng được seed. Phần tử nhỏ nhất toàn cục chưa xuất hiện phải là một frontier như vậy, nên mỗi poll cho đúng cặp kế tiếp theo thứ tự tổng.

## 11. Edge cases
Duplicates, negative values, `k=1`, một mảng rất ngắn.

## 12. Common mistakes
Seed mọi hàng dù `k` nhỏ; overflow comparator; push duplicate states.

## 13. Pattern recognition / Khi nào tái sử dụng
K-way merge cho nhiều sorted lists/rows và top-k Cartesian combinations.

## 14. Vocabulary
**frontier**: biên ứng viên; **k-way merge**: trộn k dãy; **pair sum**: tổng cặp; **min-heap**: heap cực tiểu.
