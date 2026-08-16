# 198. House Robber — Solution

## 1. Core idea / Intuition

Đây là mẫu DP **take or skip**. Với mỗi nhà, lời giải tối ưu trên prefix có hai khả năng:

```text
skip current -> best đến nhà trước
rob current  -> best đến hai nhà trước + nums[i]
```

Do đó recurrence:

```text
current = max(prevOne, prevTwo + money)
```

Trong đó `prevOne` là best của prefix trước và `prevTwo` là best của prefix cách hai vị trí.

## 2. Requirement recap / Tóm tắt yêu cầu

Không được chọn hai phần tử kề nhau. Cần tối đa hóa tổng giá trị các phần tử được chọn.

## 3. Key observations / Nhận xét quan trọng

- Nếu rob current house thì previous house bắt buộc bị skip.
- Nếu skip current thì giữ nguyên best prefix trước.
- Recurrence chỉ phụ thuộc hai state trước nên không cần mảng DP.
- Giá trị không âm, nhưng recurrence vẫn xử lý tự nhiên cả số `0`.

## 4. Alternative approaches / Các hướng khác

Brute-force recursion thử rob/skip tạo `O(2^n)` nhánh. Memoization hoặc DP array giảm xuống `O(n)` time nhưng dùng `O(n)` memory. Hai scalar giữ cùng recurrence với `O(1)` memory.

## 5. Optimal approach / Hướng tối ưu

Khởi tạo `prevTwo = 0`, `prevOne = 0`. Với mỗi `money`:

```text
current = max(prevOne, prevTwo + money)
prevTwo = prevOne
prevOne = current
```

## 6. Java solution overview

```java
class Solution {
    public int rob(int[] nums) {
        int prevTwo = 0;
        int prevOne = 0;
        for (int money : nums) {
            int current = Math.max(prevOne, prevTwo + money);
            prevTwo = prevOne;
            prevOne = current;
        }
        return prevOne;
    }
}
```

## 7. Code explanation / Giải thích code

`prevTwo + money` đại diện cho việc rob current mà vẫn tôn trọng constraint không kề nhau. `prevOne` đại diện cho skip current. Sau update, hai biến dịch lên cho iteration kế tiếp.

## 8. Dry run / Chạy thử

Với `[2,7,9,3,1]`, best prefix lần lượt là `2,7,11,11,12`. Kết quả `12`.

## 9. Time and space complexity

```text
Time:  O(n)
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mọi tập nhà hợp lệ trên prefix kết thúc ở `i` hoặc không chứa nhà `i`, khi đó giá trị tối đa là best prefix `i-1`; hoặc chứa nhà `i`, khi đó không thể chứa `i-1` và phần còn lại tối ưu là prefix `i-2`. Recurrence lấy maximum đúng hai trường hợp đầy đủ và rời nhau, nên theo quy nạp cho đáp án tối ưu.

## 11. Edge cases

- Một nhà.
- Hai nhà.
- Nhiều giá trị `0`.
- Nhà lớn nhất ở giữa hai nhà nhỏ.
- Chọn xen kẽ nhiều nhà.

## 12. Common mistakes

- Cộng current vào `prevOne`, gây chọn hai nhà kề nhau.
- Greedy chọn mọi local maximum mà không xét cấu trúc toàn cục.
- Update `prevTwo` sau khi đã mất giá trị `prevOne` cũ.

## 13. Pattern recognition / Khi nào tái sử dụng

Mẫu take-or-skip xuất hiện khi chọn phần tử có conflict cục bộ với phần tử kề: independent set trên path, maximum non-adjacent sum, scheduling tuyến tính.

## 14. Vocabulary

- **adjacent houses**: các nhà kề nhau
- **take or skip**: chọn hoặc bỏ qua
- **non-adjacent**: không kề nhau
- **prefix optimum**: optimum trên prefix
- **constant-state DP**: DP nén còn số state hằng số
