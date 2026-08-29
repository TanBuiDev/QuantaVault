# 6. Zigzag Conversion — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Với chuỗi PAYPALISHIRING và vài hàng, hãy tưởng tượng viết từng ký tự xuống rồi chéo lên như một cây bút chạy zigzag; output chỉ là đọc từng hàng từ trái sang phải sau khi đường đi đã hoàn tất.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Cách tự nhiên là dựng hẳn ma trận ký tự, nhưng bottleneck là rất nhiều ô trống. Quan sát rằng ta chỉ cần biết hàng hiện tại và hướng đi; mỗi ký tự được append thẳng vào StringBuilder của đúng hàng.

**State / invariant / data structure cần hiểu trước code.** State tối thiểu là row hiện tại và direction đang đi xuống hay đi lên. Các StringBuilder đại diện cho nội dung đã hoàn chỉnh của từng hàng; khi chạm hàng 0 hoặc hàng cuối, direction phải đảo.

**Dry run mental theo implementation.** Dry run với numRows=3: các row index đi theo 0,1,2,1,0,1,2,... Hãy trace vài ký tự đầu P,A,Y,P,A để thấy ký tự không di chuyển sau khi append; chỉ row và direction thay đổi.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là đảo hướng quá sớm hoặc xử lý sai numRows=1. Khi nào dùng: khi một layout 2D thực chất chỉ cần mô phỏng một con trỏ chạy theo chu kỳ, hãy nén grid thành các bucket theo hàng.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Ta không cần mô phỏng khoảng trắng của hình zigzag. Chỉ cần mô phỏng **row index** mà mỗi character đi qua.

Với `numRows = 4`, row index chạy:

```text
0,1,2,3,2,1,0,1,2,3,...
```

Append mỗi character vào `StringBuilder` của row tương ứng, rồi nối các row lại.

```text
Time:  O(n)
Space: O(n)
```

---

## 2. Edge case first

Nếu:

```text
numRows == 1
```

không có chuyển động lên/xuống. Tương tự, nếu `numRows >= s.length()`, mỗi character nhiều nhất nằm ở một row riêng và output không đổi.

Do đó trả `s` ngay.

---

## 3. Direction simulation

State:

```text
row       = row hiện tại
direction = +1 (down) hoặc -1 (up)
```

Mỗi character:

1. Append vào `rows[row]`.
2. Nếu row `0` → direction = `+1`.
3. Nếu row cuối → direction = `-1`.
4. `row += direction`.

Không cần lưu column.

---

## 4. Dry run

Với:

```text
s = "PAYPALISHIRING", numRows = 3
```

row sequence:

```text
0 1 2 1 0 1 2 1 0 1 2 1 0 1
```

Rows thu được:

```text
row 0: PAHN
row 1: APLSIIG
row 2: YIR
```

Nối lại:

```text
PAHNAPLSIIGYIR
```

---

## 5. Alternative approach — cycle math

Cycle length:

```text
cycle = 2 * numRows - 2
```

Có thể duyệt theo row và tính trực tiếp các index thuộc row đó, tránh array builders nhưng index arithmetic khó đọc hơn, đặc biệt với diagonal characters ở middle rows.

Row simulation thường dễ viết và ít bug hơn.

---

## 6. Correctness / Vì sao đúng

Zigzag construction luôn di chuyển tuần tự từ row đầu xuống row cuối rồi quay lên row đầu. Biến `direction` mô phỏng chính xác quy luật này, nên mỗi input character được append vào đúng row mà hình zigzag sẽ đặt nó.

Đọc zigzag line-by-line tương đương nối nội dung các row từ `0` đến `numRows-1`. Vì vậy chuỗi result là conversion cần tìm.

---

## 7. Complexity

Mỗi character append một lần và cuối cùng được copy một lần khi nối rows:

```text
Time: O(n)
Space: O(n)
```

---

## 8. Common mistakes

1. Không special-case `numRows == 1`, dẫn tới direction/index lỗi.
2. Đổi direction sau khi đã tăng row và vượt biên.
3. Tạo full 2D grid với rất nhiều spaces không cần thiết.
4. Nhầm zigzag order với reverse order.

---

## 9. Pattern recognition

Khi output phụ thuộc vào một chuyển động periodic qua vài states, đôi khi mô phỏng **state index + direction** đơn giản hơn dựng toàn bộ hình học.

---

## 10. Optimal Java solution

```java
class Solution {
    public String convert(String s, int numRows) {
        // Nếu numRows = 1 thì không có chuyển động lên/xuống.
        // Tương tự, numRows >= s.length() thì mỗi ký tự ở 1 hàng riêng, chuỗi không đổi.
        if (numRows == 1 || numRows >= s.length()) {
            return s;
        }

        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) {
            rows[i] = new StringBuilder();
        }

        // direction = 1 (đi xuống), -1 (đi lên)
        int row = 0;
        int direction = 1;

        for (char c : s.toCharArray()) {
            rows[row].append(c);

            // Chạm đỉnh (row == 0) thì đổi hướng đi xuống.
            // Chạm đáy (row == numRows - 1) thì đổi hướng đi lên.
            if (row == 0) {
                direction = 1;
            } else if (row == numRows - 1) {
                direction = -1;
            }

            row += direction;
        }

        StringBuilder result = new StringBuilder(s.length());
        for (StringBuilder currentRow : rows) {
            result.append(currentRow);
        }

        return result.toString();
    }
}
```
