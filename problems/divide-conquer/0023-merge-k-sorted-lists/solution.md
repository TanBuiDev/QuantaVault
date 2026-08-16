# 23. Merge k Sorted Lists — Solution

## 1. Core idea / Intuition
Dùng min-heap làm frontier của k sorted lists. Heap luôn chứa node nhỏ nhất chưa dùng từ mỗi list.

## 2. Requirement recap / Tóm tắt yêu cầu
Merge toàn bộ node theo thứ tự tăng mà không cần gom rồi sort lại.

## 3. Key observations / Nhận xét quan trọng
Khi poll head nhỏ nhất, candidate mới duy nhất của list đó là `node.next`.

## 4. Alternative approaches / Các hướng khác
Divide-and-conquer merge pairs cũng đạt O(N log k); heap thể hiện k-way merge trực tiếp.

## 5. Optimal approach / Hướng tối ưu
Offer mọi non-null head, liên tục poll min, nối vào output, rồi offer successor.

## 6. Java solution overview
```java
PriorityQueue<ListNode> pq = new PriorityQueue<>((a,b)->Integer.compare(a.val,b.val));
```
Dùng dummy head để nối kết quả.

## 7. Code explanation / Giải thích code
Mỗi node vào và ra heap đúng một lần; heap có tối đa k node.

## 8. Dry run / Chạy thử
Ba head ban đầu 1,1,2; poll theo thứ tự và mỗi lần mở node kế tiếp của chính list đó.

## 9. Time and space complexity
O(N log k) time, O(k) heap space ngoài output.

## 10. Why the algorithm is correct / Vì sao đúng
Vì mỗi list sorted, phần tử nhỏ nhất chưa dùng của list luôn là head frontier. Minimum toàn cục của mọi phần tử chưa dùng vì vậy là minimum của các frontier trong heap. Poll tuần tự tạo đúng merged order.

## 11. Edge cases
Không có list, mọi list rỗng, một list, duplicate values.

## 12. Common mistakes
Push toàn bộ nodes vào heap; quên null heads; comparator dùng subtraction gây overflow.

## 13. Pattern recognition / Khi nào tái sử dụng
K-way merge áp dụng cho nhiều sorted sequences.

## 14. Vocabulary
**linked list**: danh sách liên kết; **frontier**: biên ứng viên; **min-heap**: heap cực tiểu; **dummy head**: node đầu giả.
