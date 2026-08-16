# 67. Add Binary — Solution

## 1. Core idea / Intuition

Dùng hai con trỏ từ cuối chuỗi và một `carry`, mô phỏng phép cộng cơ số 2.

## 2. Requirement recap / Tóm tắt yêu cầu

Chuỗi có thể dài `10^4`, nên không được parse toàn bộ sang primitive integer.

## 3. Key observations / Nhận xét quan trọng

- Kết quả được sinh từ bit thấp lên bit cao.
- `sum & 1` là bit output; `sum >> 1` là carry.
- Cần giữ carry cuối cùng nếu còn.

## 4. Alternative approaches / Các hướng khác

BigInteger có thể làm được nhưng che mất thuật toán và không phải kỹ thuật interview mong đợi.

## 5. Optimal approach / Hướng tối ưu

Duyệt hai chuỗi từ phải sang trái; cộng bit tồn tại với carry, append bit kết quả vào `StringBuilder`, cuối cùng reverse.

## 6. Java solution overview

```java
class Solution {
    public String addBinary(String a, String b) {
        StringBuilder out = new StringBuilder();
        int i = a.length() - 1, j = b.length() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry != 0) {
            int sum = carry;
            if (i >= 0) sum += a.charAt(i--) - '0';
            if (j >= 0) sum += b.charAt(j--) - '0';
            out.append(sum & 1);
            carry = sum >> 1;
        }
        return out.reverse().toString();
    }
}
```

## 7. Code explanation / Giải thích code

Hai index tiến độc lập nên chuỗi khác độ dài vẫn được xử lý tự nhiên.

## 8. Dry run / Chạy thử

`11 + 1`: bit cuối cho `0` carry 1; bước tiếp theo cho `0` carry 1; carry cuối tạo `1`, kết quả `100`.

## 9. Time and space complexity

```text
Time:  O(max(m,n))
Space: O(max(m,n)) for output
```

## 10. Why the algorithm is correct / Vì sao đúng

Mỗi vòng áp dụng đúng quy tắc cộng cơ số 2 cho một cột và chuyển carry sang cột kế tiếp. Vì xử lý mọi cột cùng carry cuối, chuỗi đảo lại chính là tổng nhị phân.

## 11. Edge cases

- Hai chuỗi `0`.
- Khác độ dài.
- Carry chạy qua nhiều bit 1.

## 12. Common mistakes

- Quên carry cuối.
- Parse sang `int` và overflow.
- Quên reverse output.

## 13. Pattern recognition / Khi nào tái sử dụng

Carry simulation áp dụng cho cộng chuỗi số ở mọi cơ số.

## 14. Vocabulary

- **binary string**: chuỗi nhị phân
- **carry**: số nhớ
- **least significant bit**: bit thấp nhất
- **simulation**: mô phỏng
