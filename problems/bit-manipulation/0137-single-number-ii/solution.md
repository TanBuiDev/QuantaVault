# 137. Single Number II — Solution

## 1. Core idea / Intuition

Với mỗi bit, ta chỉ quan tâm số lần xuất hiện modulo 3. Hai mask `ones` và `twos` đóng vai trò state machine cho 32 bit đồng thời.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần O(n) time và O(1) extra space, nên HashMap không phù hợp với yêu cầu bộ nhớ.

## 3. Key observations / Nhận xét quan trọng

- Bit của giá trị xuất hiện ba lần phải quay về trạng thái 0.
- `ones` giữ bit đã thấy 1 lần modulo 3.
- `twos` giữ bit đã thấy 2 lần modulo 3.
- Sau toàn bộ mảng, chỉ bit của số đơn lẻ còn trong `ones`.

## 4. Alternative approaches / Các hướng khác

Có thể đếm từng trong 32 bit rồi lấy modulo 3; cách đó vẫn O(n) và O(1), nhưng state-machine masks gọn hơn.

## 5. Optimal approach / Hướng tối ưu

Với mỗi `num`, cập nhật `ones = (ones ^ num) & ~twos`, rồi `twos = (twos ^ num) & ~ones`. Trạng thái xuất hiện lần thứ ba bị xóa khỏi cả hai mask.

## 6. Java solution overview

```java
class Solution {
    public int singleNumber(int[] nums) {
        int ones = 0;
        int twos = 0;
        for (int num : nums) {
            ones = (ones ^ num) & ~twos;
            twos = (twos ^ num) & ~ones;
        }
        return ones;
    }
}
```

## 7. Code explanation / Giải thích code

Các phép toán chạy song song trên mọi bit của `int`; mỗi bit độc lập đi qua ba trạng thái count modulo 3.

## 8. Dry run / Chạy thử

Với `[2,2,3,2]`, các bit của 2 đi qua đủ ba lần và bị xóa; các bit của 3 chỉ đi qua một lần và còn lại trong `ones`.

## 9. Time and space complexity

```text
Time:  O(n)
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Xét độc lập một vị trí bit. Cặp trạng thái (`twos`,`ones`) mã hóa count modulo 3. Mỗi lần bit input bằng 1, công thức chuyển trạng thái từ 0 lần sang 1, từ 1 sang 2, và từ 2 về 0. Vì mọi số lặp đóng góp ba lần nên bị triệt tiêu; số duy nhất đóng góp một lần nên đúng các bit của nó nằm trong `ones`.

## 11. Edge cases

- Số đơn lẻ là 0.
- Số âm.
- Chỉ một phần tử.
- Bit dấu được xử lý như mọi bit khác.

## 12. Common mistakes

- Dùng Set/Map và vi phạm constant-space.
- Cập nhật `twos` bằng giá trị `ones` cũ thay vì trạng thái mới.
- Chỉ xử lý số dương.

## 13. Pattern recognition / Khi nào tái sử dụng

Bitwise state machines hữu ích khi tần suất lặp cố định và cần đếm modulo một số nhỏ bằng constant space.

## 14. Vocabulary

- **single element**: phần tử duy nhất
- **bit mask**: mặt nạ bit
- **state machine**: máy trạng thái
- **modulo three**: modulo 3
