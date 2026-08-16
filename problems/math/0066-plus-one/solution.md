# 66. Plus One — Solution

## 1. Core idea / Intuition

Cộng 1 giống phép cộng tay: bắt đầu từ chữ số cuối. Nếu chữ số nhỏ hơn 9, chỉ cần tăng nó và kết thúc. Nếu là 9, biến thành 0 và carry tiếp tục sang trái.

## 2. Requirement recap / Tóm tắt yêu cầu

Mảng biểu diễn một số nguyên lớn nên không thể phụ thuộc vào kiểu số nguyên primitive để parse toàn bộ giá trị.

## 3. Key observations / Nhận xét quan trọng

- Chỉ suffix gồm các số 9 bị thay đổi bởi carry.
- Gặp chữ số `< 9` là có thể trả ngay.
- Nếu mọi chữ số đều là 9, kết quả có độ dài `n+1` và bắt đầu bằng 1.

## 4. Alternative approaches / Các hướng khác

Chuyển toàn bộ mảng thành số nguyên có thể overflow và không cần thiết.

## 5. Optimal approach / Hướng tối ưu

Duyệt từ phải sang trái. Với mỗi digit: nếu `<9`, tăng và return; nếu bằng 9, gán 0. Nếu hết vòng lặp, tạo mảng mới dài hơn một và đặt phần tử đầu bằng 1.

## 6. Java solution overview

```java
class Solution {
    public int[] plusOne(int[] digits) {
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        int[] result = new int[digits.length + 1];
        result[0] = 1;
        return result;
    }
}
```

## 7. Code explanation / Giải thích code

Mỗi số 9 hấp thụ carry và trở thành 0. Phần tử đầu tiên nhỏ hơn 9 kết thúc propagation.

## 8. Dry run / Chạy thử

`[1,9,9]`: 9 cuối -> 0, 9 tiếp theo -> 0, 1 -> 2, trả `[2,0,0]`.

## 9. Time and space complexity

```text
Time:  O(n)
Space: O(1) excluding the returned array
```

## 10. Why the algorithm is correct / Vì sao đúng

Duyệt từ hàng thấp nhất mô phỏng chính xác phép cộng 1. Carry chỉ tiếp tục khi chữ số hiện tại là 9; khi gặp chữ số nhỏ hơn 9, tăng nó tạo đúng kết quả và mọi chữ số bên trái không đổi. Nếu carry vượt qua chữ số đầu, số ban đầu toàn 9 và mảng `1` theo sau các số 0 là kết quả duy nhất đúng.

## 11. Edge cases

- Một chữ số không phải 9.
- Một chữ số 9.
- Nhiều số 9 liên tiếp ở cuối.
- Toàn bộ mảng là 9.

## 12. Common mistakes

- Parse mảng thành `int` hoặc `long`.
- Quên carry xuyên qua nhiều số 9.
- Không tăng kích thước output khi toàn bộ digits là 9.

## 13. Pattern recognition / Khi nào tái sử dụng

Carry propagation từ phải sang trái xuất hiện trong các bài cộng chuỗi, cộng mảng digit và arithmetic simulation.

## 14. Vocabulary

- **most significant digit**: chữ số hàng cao nhất
- **least significant digit**: chữ số hàng thấp nhất
- **carry**: số nhớ
- **increment**: tăng thêm một
