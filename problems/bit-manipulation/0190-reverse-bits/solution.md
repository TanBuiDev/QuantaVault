# 190. Reverse Bits — Solution

## 1. Core idea / Intuition

Xử lý đúng 32 vị trí. Mỗi vòng dịch `result` trái một bit, chèn `n & 1`, rồi dịch `n` phải không dấu.

## 2. Requirement recap / Tóm tắt yêu cầu

Phải đảo toàn bộ width 32-bit, không chỉ các bit từ set bit cao nhất trở xuống.

## 3. Key observations / Nhận xét quan trọng

- Fixed width bắt buộc đúng 32 vòng.
- `n & 1` lấy bit nguồn kế tiếp.
- `>>>` không nhân bản sign bit.

## 4. Alternative approaches / Các hướng khác

Có thể swap bit positions hoặc dùng lookup table theo byte. Vòng lặp 32 bước là trực tiếp và constant time.

## 5. Optimal approach / Hướng tối ưu

Lặp 32 lần, xây kết quả từ trái sang phải bằng LSB của input.

## 6. Java solution overview

```java
class Solution {
    public int reverseBits(int n) {
        int result = 0;
        for (int i = 0; i < 32; i++) {
            result = (result << 1) | (n & 1);
            n >>>= 1;
        }
        return result;
    }
}
```

## 7. Code explanation / Giải thích code

Bit thứ `i` từ phải của input trở thành bit thứ `31-i` của output.

## 8. Dry run / Chạy thử

Với suffix `...1100`, các bit được lấy theo thứ tự `0,0,1,1,...` và được đẩy dần sang phía cao của result.

## 9. Time and space complexity

```text
Time:  O(1), exactly 32 iterations
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Sau k vòng, result chứa đảo thứ tự đúng k bit thấp nhất ban đầu của n ở k vị trí thấp của prefix đang xây. Sau 32 vòng, mọi bit nguồn đã được đặt vào vị trí đối xứng nên toàn bộ word được đảo chính xác.

## 11. Edge cases

- `n = 0`.
- Chỉ một vài bit thấp được set.
- Nhiều leading zeros.

## 12. Common mistakes

- Dừng khi `n == 0` và làm mất leading zeros cần đảo.
- Dùng `>>` thay vì `>>>` cho bit pattern tổng quát.

## 13. Pattern recognition / Khi nào tái sử dụng

Fixed-width bit transforms thường cần loop theo width thay vì theo numeric magnitude.

## 14. Vocabulary

- **reverse bits**: đảo bit
- **unsigned right shift**: dịch phải không dấu
- **fixed width**: độ rộng cố định
- **least significant bit**: bit thấp nhất
