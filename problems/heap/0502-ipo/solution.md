# 502. IPO — Solution

## 1. Core idea / Intuition
Tách bài toán thành “mở khóa dự án” và “chọn profit lớn nhất”: min-heap theo capital + max-heap theo profit.

## 2. Requirement recap / Tóm tắt yêu cầu
Chọn tối đa k dự án, mỗi dự án chỉ khả dụng khi vốn hiện tại đủ yêu cầu.

## 3. Key observations / Nhận xét quan trọng
Profit không âm nên lấy profit lớn nhất trong tập eligible là greedy an toàn và làm vốn tăng nhanh nhất.

## 4. Alternative approaches / Các hướng khác
Duyệt lại mọi dự án ở mỗi vòng là O(kn). Sort theo capital + max-heap cũng tương đương và rất tốt.

## 5. Optimal approach / Hướng tối ưu
Đưa toàn bộ `(capital,profit)` vào min-heap. Mỗi vòng chuyển tất cả dự án affordable sang max-heap profit; nếu max-heap rỗng thì dừng, nếu không lấy profit lớn nhất cộng vào w.

## 6. Java solution overview
```java
PriorityQueue<int[]> byCapital = new PriorityQueue<>((a,b) -> Integer.compare(a[0], b[0]));
PriorityQueue<Integer> profits = new PriorityQueue<>((a,b) -> Integer.compare(b, a));
```
Lặp tối đa k lần, promote project đủ vốn rồi chọn max profit.

## 7. Code explanation / Giải thích code
Min-heap đảm bảo mọi dự án vừa trở nên affordable được chuyển đúng lúc; max-heap giữ lựa chọn greedy tốt nhất.

## 8. Dry run / Chạy thử
`w=0`: chỉ project capital 0 vào max-heap, lấy profit 1 -> w=1; lúc này hai project còn lại mở khóa, lấy profit 3 -> w=4.

## 9. Time and space complexity
`O((n+k) log n)` time và `O(n)` space.

## 10. Why the algorithm is correct / Vì sao đúng
Ở mỗi bước, mọi project feasible đều nằm trong profit heap. Chọn profit lớn nhất tạo capital sau bước đó không nhỏ hơn bất kỳ lựa chọn feasible khác, nên tập project có thể mở khóa ở các bước sau không thể kém hơn. Lặp exchange argument cho tối đa k bước cho greedy tối ưu.

## 11. Edge cases
Không có project affordable; k lớn hơn số project hữu ích; profit bằng 0; nhiều project cùng capital.

## 12. Common mistakes
Chọn theo profit trước khi kiểm tra capital; tiếp tục khi heap profit rỗng; comparator overflow.

## 13. Pattern recognition / Khi nào tái sử dụng
Greedy với dynamic eligibility thường dùng một structure theo điều kiện mở khóa và một structure theo objective.

## 14. Vocabulary
**capital**: vốn; **profit**: lợi nhuận; **eligible/affordable**: đủ điều kiện/đủ vốn; **greedy**: tham lam.
