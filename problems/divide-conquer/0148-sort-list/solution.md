# 148. Sort List — Solution

## 1. Core idea / Intuition
Dùng bottom-up merge sort để tránh recursion stack: merge các run độ dài 1, rồi 2, 4, 8 cho đến khi run size phủ toàn list.

## 2. Requirement recap / Tóm tắt yêu cầu
Cần sort linked list tăng dần trong `O(n log n)` time và `O(1)` auxiliary memory.

## 3. Key observations / Nhận xét quan trọng
Linked list cho phép split và merge bằng pointer; không cần buffer phụ. Mỗi level merge đi qua toàn bộ `n` node.

## 4. Alternative approaches / Các hướng khác
Top-down merge sort dễ viết nhưng dùng `O(log n)` stack. Copy sang array rồi sort cần `O(n)` memory.

## 5. Optimal approach / Hướng tối ưu
Đếm `n`, dùng dummy head. Với mỗi `size`, tách `left`, `right`, `next`, merge hai run và nối tail trở lại.

## 6. Java solution overview
```java
for (int size = 1; size < n; size <<= 1) {
    ListNode prev = dummy, curr = dummy.next;
    while (curr != null) {
        ListNode left = curr;
        ListNode right = split(left, size);
        curr = split(right, size);
        prev = merge(left, right, prev);
    }
}
```

## 7. Code explanation / Giải thích code
`split` cắt một run sau tối đa `size` node. `merge` nối hai sorted runs vào `prev` và trả tail mới.

## 8. Dry run / Chạy thử
`[4,2,1,3]`: size 1 tạo `[2,4]` và `[1,3]`; size 2 merge thành `[1,2,3,4]`.

## 9. Time and space complexity
`O(n log n)` time, `O(1)` auxiliary space.

## 10. Why the algorithm is correct / Vì sao đúng
Sau pass với run size `s`, mỗi block tối đa `2s` node là kết quả merge đúng của hai sorted run size `s`; induction theo các pass cho thấy khi `s >= n/2`, toàn list sorted. Mọi thao tác chỉ rewires pointers.

## 11. Edge cases
Empty list, one node, duplicates, already sorted, reverse sorted.

## 12. Common mistakes
Làm mất pointer tới run kế tiếp; không trả đúng merged tail; dùng recursion dù yêu cầu `O(1)` memory.

## 13. Pattern recognition / Khi nào tái sử dụng
Bottom-up merge sort là lựa chọn mạnh cho linked list khi cần worst-case `O(n log n)` và constant auxiliary memory.

## 14. Vocabulary
**run**: đoạn đã sort; **rewire pointers**: nối lại con trỏ; **bottom-up merge sort**: merge sort từ dưới lên; **auxiliary memory**: bộ nhớ phụ.
