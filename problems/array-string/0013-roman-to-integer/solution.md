# 13. Roman to Integer — Solution

## 1. Core idea / Ý tưởng cốt lõi

Với số La Mã hợp lệ, quy tắc cộng/trừ có thể xác định bằng **một ký hiệu lookahead**:

```text
current < next  -> subtract current
otherwise       -> add current
```

Ví dụ `MCMXCIV`:

```text
M  +1000
C  -100   // C < M
M  +1000
X  -10    // X < C
C  +100
I  -1     // I < V
V  +5
= 1994
```

```text
Time: O(n)
Space: O(1)
```

---

## 2. Why the local rule works

Trong cách viết chuẩn, ký hiệu nhỏ đứng trước ký hiệu lớn chỉ xuất hiện trong subtractive form. Vì input được đảm bảo hợp lệ, ta không cần tự validate tất cả grammar La Mã; so sánh current với next đủ để nhận biết contribution âm.

Ký hiệu cuối không có next symbol nên luôn được cộng.

---

## 3. Alternative approaches

- Hard-code sáu subtractive pairs rồi parse từng token: đúng nhưng nhiều branch hơn.
- Scan từ phải sang trái, giữ `previousValue`; nếu current nhỏ hơn previous thì trừ, ngược lại cộng. Cũng `O(n)`/`O(1)`.
- HashMap cho symbol mapping dễ mở rộng; `switch` dùng constant space rõ ràng hơn cho đúng 7 symbol cố định.

---

## 4. Correctness / Vì sao đúng

Mỗi symbol của một Roman numeral hợp lệ đóng góp hoặc giá trị dương của nó, hoặc giá trị âm nếu nó đứng ngay trước một symbol lớn hơn trong subtractive pair. Thuật toán kiểm tra chính xác điều kiện đó cho từng vị trí và cộng contribution tương ứng. Tổng các contribution vì vậy bằng giá trị số nguyên của Roman numeral.

---

## 5. Complexity

Mỗi character được xử lý một lần, mapping có kích thước cố định:

```text
Time: O(n)
Space: O(1)
```

---

## 6. Common mistakes

1. Cộng tất cả symbols và quên subtractive pairs.
2. Trừ ký hiệu chỉ dựa vào danh sách `I/X/C` mà không xét symbol kế tiếp.
3. Đọc `IV` thành `1 + 5`.
4. Over-engineer validation dù đề đảm bảo input hợp lệ.

---

## 7. Pattern recognition

Đây là local parsing pattern: contribution của token hiện tại được quyết định bởi quan hệ với token kế tiếp.

---

## 8. Optimal Java solution

```java
class Solution {
    public int romanToInt(String s) {
        int total = 0;

        for (int i = 0; i < s.length(); i++) {
            int current = valueOf(s.charAt(i));

            // Nếu ký hiệu hiện tại nhỏ hơn ký hiệu đứng ngay sau nó (ví dụ IV hoặc IX), 
            // quy tắc của số La Mã là ta phải lấy giá trị sau trừ đi giá trị hiện tại.
            // Thay vì nhìn chéo sang phải, ta chỉ đơn giản trừ đi giá trị hiện tại khỏi tổng.
            if (i + 1 < s.length() && current < valueOf(s.charAt(i + 1))) {
                total -= current;
            } else {
                total += current;
            }
        }

        return total;
    }

    private int valueOf(char symbol) {
        return switch (symbol) {
            case 'I' -> 1;
            case 'V' -> 5;
            case 'X' -> 10;
            case 'L' -> 50;
            case 'C' -> 100;
            case 'D' -> 500;
            case 'M' -> 1000;
            default -> throw new IllegalArgumentException("Invalid Roman symbol");
        };
    }
}
```
