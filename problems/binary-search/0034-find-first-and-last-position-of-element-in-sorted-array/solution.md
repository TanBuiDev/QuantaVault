# 34. Find First and Last Position of Element in Sorted Array — Solution

## 1. Core idea / Intuition
Dùng hai boundary binary searches: lower bound cho lần xuất hiện đầu và upper bound cho vị trí ngay sau lần xuất hiện cuối.

## 2. Requirement recap / Tóm tắt yêu cầu
Phải trả đúng cả hai biên trong `O(log n)`, kể cả khi có nhiều duplicate.

## 3. Key observations / Nhận xét quan trọng
`lowerBound(target)` là index đầu tiên `nums[i] >= target`; `upperBound(target)` là index đầu tiên `nums[i] > target`.

## 4. Alternative approaches / Các hướng khác
Tìm một occurrence rồi scan hai phía có thể thành O(n), nên không đạt yêu cầu.

## 5. Optimal approach / Hướng tối ưu
Tìm `first = lowerBound(target)`. Nếu first ngoài mảng hoặc khác target, trả `[-1,-1]`. Ngược lại `last = lowerBound(target + strict)` bằng helper upper-bound riêng.

## 6. Java solution overview
Hai helper binary search trên interval half-open `[left,right)` tránh off-by-one.

## 7. Code explanation / Giải thích code
Lower bound di chuyển right khi `nums[mid] >= target`; upper bound di chuyển right khi `nums[mid] > target`.

## 8. Dry run / Chạy thử
Với `[5,7,7,8,8,10]`, target 8: lower=3, upper=5, nên kết quả `[3,4]`.

## 9. Time and space complexity
Hai binary search đều O(log n); space O(1).

## 10. Why the algorithm is correct / Vì sao đúng
Lower-bound invariant loại mọi index chắc chắn nhỏ hơn target; upper-bound invariant loại mọi index không vượt target. Vì vậy hai điểm hội tụ là biên trái và biên phải độc quyền chính xác.

## 11. Edge cases
Mảng rỗng, target không có, toàn bộ phần tử bằng target, một phần tử.

## 12. Common mistakes
Scan sau binary search; nhầm `>=` và `>`; không kiểm tra target có tồn tại.

## 13. Pattern recognition / Khi nào tái sử dụng
Lower/upper bound là pattern chuẩn cho range của duplicate trong dữ liệu sorted.

## 14. Vocabulary
**lower bound**: cận dưới; **upper bound**: cận trên; **occurrence**: lần xuất hiện; **half-open interval**: khoảng nửa mở.
