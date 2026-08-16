# 4. Median of Two Sorted Arrays — Solution

## 1. Core idea / Intuition
Binary search a partition in the shorter array; the matching partition in the other array is determined by the required left-half size.

## 2. Requirement recap / Tóm tắt yêu cầu
Merging would be linear; the requested logarithmic bound requires searching partition positions.

## 3. Key observations / Nhận xét quan trọng
A valid partition has every left element <= every right element, which reduces to two boundary inequalities.

## 4. Alternative approaches / Các hướng khác
Merge/two pointers is O(m+n). Partition search is O(log min(m,n)).

## 5. Optimal approach / Hướng tối ưu
Always binary-search the shorter array. Let `i` be its partition and `j = (m+n+1)/2 - i`. Move left/right based on crossing boundaries.

## 6. Java solution overview
Use `Integer.MIN_VALUE/MAX_VALUE` as sentinels when a partition touches an endpoint; after finding a valid partition, choose the max-left and min-right values.

## 7. Code explanation / Giải thích code
Odd total length returns `max(leftA,leftB)`. Even total length averages it with `min(rightA,rightB)` using `long` for the sum.

## 8. Dry run / Chạy thử
For `[1,3]` and `[2]`, search the shorter `[2]`; valid left side ends at 2 and median is 2.

## 9. Time and space complexity
O(log min(m,n)) time, O(1) space.

## 10. Why the algorithm is correct / Vì sao đúng
The chosen partitions have the required cardinality. When both crossing inequalities hold, every element in the combined left half is <= every element in the combined right half; therefore the middle boundary value(s) are exactly the median.

## 11. Edge cases
One empty array, odd/even total length, partitions at endpoints, duplicate values.

## 12. Common mistakes
Searching the longer array; wrong left-size formula; overflow while averaging.

## 13. Pattern recognition / Khi nào tái sử dụng
Binary search on partition is useful when rank constraints split two sorted sequences.

## 14. Vocabulary
**partition**: điểm chia; **median**: trung vị; **sentinel**: giá trị biên giả; **crossing condition**: điều kiện giao biên.
