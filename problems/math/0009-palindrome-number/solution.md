# 9. Palindrome Number — Solution

## 1. Core idea / Intuition

Không cần chuyển sang string và cũng không cần đảo toàn bộ số. Ta tách dần chữ số cuối của `x` để xây `reversedHalf`, dừng khi đã xử lý khoảng một nửa số chữ số.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần kiểm tra symmetry của chữ số, đồng thời follow-up yêu cầu tránh chuyển số thành chuỗi.

## 3. Key observations / Nhận xét quan trọng

- Số âm luôn false.
- Số dương kết thúc bằng 0 luôn false nếu khác 0.
- Với số chữ số chẵn: hai nửa phải bằng nhau.
- Với số chữ số lẻ: bỏ chữ số giữa bằng `reversedHalf / 10`.

## 4. Alternative approaches / Các hướng khác

Chuyển thành string rồi dùng two pointers đơn giản nhưng không đáp ứng follow-up. Đảo toàn bộ integer cũng có rủi ro overflow.

## 5. Optimal approach / Hướng tối ưu

Reverse nửa sau của số. Khi `x <= reversedHalf`, so sánh `x == reversedHalf` hoặc `x == reversedHalf / 10`.

## 6. Java solution overview

```java
class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }
        return x == reversedHalf || x == reversedHalf / 10;
    }
}
```

## 7. Code explanation / Giải thích code

Mỗi vòng chuyển một digit từ cuối `x` sang cuối `reversedHalf`. Vì chỉ reverse nửa số, giá trị đảo không vượt phạm vi nguy hiểm của full reversal.

## 8. Dry run / Chạy thử

`121`: reversedHalf lần lượt 1 rồi 12, phần còn lại là 1. So sánh `1 == 12/10`, nên true.

## 9. Time and space complexity

```text
Time:  O(log x)
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Sau mỗi vòng, `reversedHalf` chứa các chữ số đã lấy từ nửa phải theo thứ tự đảo. Khi hai phần có độ dài bằng nhau hoặc nửa phải dài hơn một digit, palindrome tồn tại chính xác khi hai phần bằng nhau sau khi bỏ digit giữa nếu cần.

## 11. Edge cases

- Số âm.
- `0`.
- Số kết thúc bằng 0.
- Số palindrome có số chữ số lẻ/chẵn.

## 12. Common mistakes

- Quên special case số kết thúc bằng 0.
- Đảo toàn bộ số và gây overflow.
- Không bỏ digit giữa trong trường hợp số chữ số lẻ.

## 13. Pattern recognition / Khi nào tái sử dụng

Digit extraction bằng `% 10` và `/ 10` hữu ích cho các bài thao tác chữ số mà không dùng string.

## 14. Vocabulary

- **palindrome**: đối xứng xuôi-ngược
- **digit**: chữ số
- **reverse half**: đảo một nửa
- **leading/trailing zero**: số 0 đầu/cuối
