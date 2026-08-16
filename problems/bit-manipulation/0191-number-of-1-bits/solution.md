# 191. Number of 1 Bits — Solution

## 1. Core idea / Intuition

Dùng identity `n & (n - 1)` để xóa set bit thấp nhất. Số lần thực hiện trước khi `n` về 0 chính là số bit 1.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần đếm Hamming weight của một integer mà không cần chuyển sang chuỗi nhị phân.

## 3. Key observations / Nhận xét quan trọng

- Mỗi vòng xóa đúng một bit 1.
- Bit 0 không tạo thêm iteration.
- Số vòng bằng chính số set bits `k`.

## 4. Alternative approaches / Các hướng khác

Có thể kiểm tra 32 bit bằng shift và mask; cách đó luôn 32 bước. Kernighan chỉ chạy theo số set bits.

## 5. Optimal approach / Hướng tối ưu

Trong khi `n != 0`, gán `n &= n - 1` và tăng counter.

## 6. Java solution overview

```java
class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;
            count++;
        }
        return count;
    }
}
```

## 7. Code explanation / Giải thích code

`n - 1` làm set bit thấp nhất của `n` thành 0 và làm các bit thấp hơn thành 1; AND với `n` giữ mọi bit cao hơn và xóa set bit đó.

## 8. Dry run / Chạy thử

`11 = 1011`: `1011 -> 1010 -> 1000 -> 0000`, tổng cộng 3 bước.

## 9. Time and space complexity

```text
Time:  O(k), k = number of set bits
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mỗi iteration xóa đúng một set bit và không thay đổi các set bit cao hơn. Vì vậy sau đúng `k` iteration mọi set bit đã bị xóa và counter bằng Hamming weight ban đầu.

## 11. Edge cases

- Chỉ một set bit.
- Nhiều set bit liên tiếp.
- Giá trị lớn gần `Integer.MAX_VALUE`.

## 12. Common mistakes

- Dùng signed right shift trong một vòng phụ thuộc `n > 0` cho dữ liệu tổng quát 32-bit.
- Nhầm `n & (n - 1)` với phép trừ đơn thuần.

## 13. Pattern recognition / Khi nào tái sử dụng

`x & (x - 1)` là bit trick chuẩn để đếm hoặc xóa set bits từng cái.

## 14. Vocabulary

- **set bit**: bit có giá trị 1
- **Hamming weight**: số lượng set bits
- **least significant set bit**: set bit thấp nhất
- **bit mask**: mặt nạ bit
