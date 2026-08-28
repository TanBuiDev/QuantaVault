# 12. Integer to Roman — Solution

## 1. Core idea / Ý tưởng cốt lõi

Đưa cả các subtractive form vào một bảng giá trị giảm dần:

```text
1000 M, 900 CM, 500 D, 400 CD,
100 C, 90 XC, 50 L, 40 XL,
10 X, 9 IX, 5 V, 4 IV, 1 I
```

Sau đó greedy: luôn lấy symbol có giá trị lớn nhất không vượt quá phần `num` còn lại.

---

## 2. Why adding subtractive tokens simplifies the problem

Nếu `900` được xem như một token `CM`, ta không phải tự phát hiện chữ số 9 ở hàng trăm. Tương tự cho `400,90,40,9,4`.

Bảng đã mã hóa toàn bộ grammar cần thiết cho range `[1,3999]`, nên conversion trở thành coin-like decomposition với một canonical ordered set.

---

## 3. Algorithm

Với từng pair `(value, symbol)` từ lớn xuống nhỏ:

```text
while num >= value:
    append symbol
    num -= value
```

Ví dụ `1994`:

```text
1000 -> M, remain 994
900  -> CM, remain 94
90   -> XC, remain 4
4    -> IV, remain 0
```

Kết quả `MCMXCIV`.

---

## 4. Correctness / Vì sao đúng

Roman numeral canonical được xây từ các decimal-place forms hợp lệ theo thứ tự giảm dần. Bảng token chứa chính xác mọi atomic canonical form, kể cả subtractive pairs. Chọn token lớn nhất còn dùng được tạo prefix lớn nhất hợp lệ; trừ token đó để lại một remainder nhỏ hơn được biểu diễn theo cùng quy tắc. Lặp tới zero cho representation đúng và canonical.

---

## 5. Complexity

Input bị chặn ở `3999`, bảng có 13 entries và output dài bị chặn bởi hằng số. Theo constraints:

```text
Time: O(1)
Extra space: O(1) excluding output
```

Nếu tổng quát hóa theo độ dài output `L`, có thể mô tả là `O(L)`.

---

## 6. Alternative approaches

- Tách riêng thousands/hundreds/tens/ones bằng lookup arrays: cũng rất tốt và constant-time.
- Hard-code nhiều `if` theo decimal digit: dễ sai và khó mở rộng.

---

## 7. Common mistakes

1. Quên subtractive tokens như `900/400`.
2. Sinh `IIII` thay vì `IV`.
3. Sắp bảng sai thứ tự, ví dụ đặt `500` trước `900`.
4. Dùng greedy với bảng chỉ có 7 base symbols — khi đó greedy không tạo canonical Roman numeral.

---

## 8. Optimal Java solution

```java
class Solution {
    // Khởi tạo các mốc giá trị từ lớn đến nhỏ. Bằng cách duyệt từ lớn nhất, 
    // ta đảm bảo tính chất Greedy: luôn dùng ký hiệu lớn nhất có thể trước tiên.
    private static final int[] VALUES = {
        1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1
    };

    private static final String[] SYMBOLS = {
        "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"
    };

    public String intToRoman(int num) {
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < VALUES.length; i++) {
            // Chừng nào số còn lớn hơn mốc giá trị hiện tại, ta cứ nhặt mốc này.
            // Điều này đúng vì các mốc đã được xếp giảm dần.
            while (num >= VALUES[i]) {
                result.append(SYMBOLS[i]);
                num -= VALUES[i];
            }
        }

        return result.toString();
    }
}
```
