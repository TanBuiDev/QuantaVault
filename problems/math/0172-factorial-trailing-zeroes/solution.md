# 172. Factorial Trailing Zeroes — Solution

## 1. Core idea / Intuition

Mỗi trailing zero cần một factor `10 = 2 * 5`. Trong `n!`, factor 2 dư thừa, nên số zero đúng bằng tổng số factor 5 trong các số từ 1 đến n.

## 2. Requirement recap / Tóm tắt yêu cầu

Không cần tính `n!`; chỉ cần đếm số lần 5 xuất hiện trong prime factorization của `n!`.

## 3. Key observations / Nhận xét quan trọng

- `floor(n/5)` đếm mỗi bội của 5 một lần.
- `floor(n/25)` cộng factor 5 thứ hai từ bội của 25.
- Tiếp tục với 125, 625, ...

## 4. Alternative approaches / Các hướng khác

Tính factorial trực tiếp vừa dễ overflow vừa chậm và hoàn toàn không cần thiết.

## 5. Optimal approach / Hướng tối ưu

Lặp: chia `n` cho 5, cộng quotient vào đáp án, tiếp tục trên quotient cho tới khi bằng 0.

## 6. Java solution overview

```java
class Solution {
    public int trailingZeroes(int n) {
        int count = 0;
        while (n > 0) {
            n /= 5;
            count += n;
        }
        return count;
    }
}
```

## 7. Code explanation / Giải thích code

Mỗi lần chia 5 chuyển sang tầng factor 5 tiếp theo: bội của 5, 25, 125, ...

## 8. Dry run / Chạy thử

`n = 30`: `30/5 = 6`, `6/5 = 1`, rồi 0. Tổng `6 + 1 = 7` trailing zeroes.

## 9. Time and space complexity

```text
Time:  O(log_5 n)
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mỗi số chia hết cho `5^k` đóng góp ít nhất một factor 5 ở tầng k. `floor(n/5^k)` đếm chính xác số phần tử như vậy. Cộng qua mọi k vì vậy đếm đúng tổng multiplicity của factor 5 trong `n!`, cũng chính là số cặp `(2,5)` và số trailing zeroes.

## 11. Edge cases

- `n = 0`
- `n < 5`
- `n = 5`
- các mốc 25, 125

## 12. Common mistakes

- Chỉ dùng `n/5` và quên factor 5 bổ sung từ 25, 125.
- Tính factorial trực tiếp.

## 13. Pattern recognition / Khi nào tái sử dụng

Đếm multiplicity của một prime trong factorial thường dùng tổng `floor(n/p^k)`.

## 14. Vocabulary

- **factorial**: giai thừa
- **trailing zero**: số 0 ở cuối
- **prime factor**: thừa số nguyên tố
- **multiplicity**: số lần xuất hiện
