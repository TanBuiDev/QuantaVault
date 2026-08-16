# 201. Bitwise AND of Numbers Range — Solution

## 1. Core idea / Intuition

Trong một đoạn liên tiếp, các bit thấp sẽ thay đổi khi ta đi từ `left` đến `right`, nên chúng không thể giữ giá trị 1 qua phép AND toàn đoạn. Chỉ prefix bit chung của hai đầu mút có thể tồn tại.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần AND mọi số trong đoạn mà không duyệt từng số khi khoảng có thể rất lớn.

## 3. Key observations / Nhận xét quan trọng

- Nếu `left == right`, đáp án là chính giá trị đó.
- Bit phía sau vị trí khác nhau cao nhất giữa hai đầu mút đều phải thành 0.
- Dịch phải cho đến khi hai số bằng nhau sẽ loại các suffix biến đổi.

## 4. Alternative approaches / Các hướng khác

AND tuần tự từ `left` tới `right` có thể mất O(right-left) phép toán và quá chậm.

## 5. Optimal approach / Hướng tối ưu

Dịch phải `left` và `right` đồng thời cho tới khi bằng nhau, đếm số lần dịch. Giá trị còn lại là common prefix; dịch trái lại cùng số lần để thêm các số 0 suffix.

## 6. Java solution overview

```java
class Solution {
    public int rangeBitwiseAnd(int left, int right) {
        int shifts = 0;
        while (left != right) {
            left >>= 1;
            right >>= 1;
            shifts++;
        }
        return left << shifts;
    }
}
```

## 7. Code explanation / Giải thích code

Mỗi shift bỏ một bit thấp không thuộc common prefix. Khi hai giá trị bằng nhau, mọi bit còn lại đều ổn định trên toàn đoạn.

## 8. Dry run / Chạy thử

`5 = 101`, `7 = 111`. Dịch một lần: `10` và `11`; lần nữa: `1` và `1`. Common prefix là `1`, dịch trái hai lần thành `100 = 4`.

## 9. Time and space complexity

```text
Time:  O(log right)
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mọi bit bên phải common prefix phải thay đổi ít nhất một lần trong đoạn liên tiếp, nên AND của bit đó bằng 0. Các bit của common prefix giống nhau ở cả hai đầu và không có boundary nào làm chúng đổi trong đoạn, nên được giữ nguyên. Thuật toán tìm đúng prefix này rồi khôi phục số lượng bit 0 phía sau.

## 11. Edge cases

- `left == right`
- đoạn bắt đầu từ 0
- khoảng rất rộng
- hai đầu chỉ khác ở bit thấp

## 12. Common mistakes

- Duyệt mọi số trong range.
- Nhầm common prefix với common suffix.
- Quên dịch trái prefix trở lại.

## 13. Pattern recognition / Khi nào tái sử dụng

Common-prefix bit reasoning hữu ích khi thao tác trên toàn bộ một đoạn số liên tiếp.

## 14. Vocabulary

- **bitwise AND**: phép AND bit
- **inclusive range**: đoạn bao gồm hai đầu
- **common prefix**: tiền tố chung
- **right shift**: dịch phải
