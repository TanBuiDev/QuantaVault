# 224. Basic Calculator — Solution

## 1. Ta đang đọc biểu thức từ trái sang phải như thế nào?

Ví dụ đơn giản:

```text
12 - 3 + 5
```

Khi đọc từng ký tự, số có thể có nhiều chữ số nên `1` chưa phải term hoàn chỉnh; gặp `2` ta phải ghép thành `12`:

```text
number = number * 10 + digit
```

Ta chỉ “commit” `number` vào tổng khi gặp operator tiếp theo hoặc hết input.

Nếu chưa có ngoặc, ba state là đủ:

- `result`: tổng của các term đã commit trong context hiện tại.
- `number`: số đang được xây từ các digit liên tiếp.
- `sign`: dấu sẽ áp dụng cho `number` khi commit (`1` hoặc `-1`).

Ví dụ đọc `12 - 3`:

```text
đọc 1  → number = 1
đọc 2  → number = 12
đọc -  → result += +1 * 12; number = 0; sign = -1
đọc 3  → number = 3
```

Term cuối chưa gặp operator, nên phải được cộng khi kết thúc input.

---

## 2. Ngoặc tạo ra vấn đề gì?

Xét:

```text
10 - (2 + 3)
```

Khi gặp `(`, ta sắp bắt đầu một **context tính toán mới** cho biểu thức bên trong.

Nhưng sau khi tính xong `(2 + 3) = 5`, ta vẫn cần nhớ bên ngoài là:

```text
10 - (...) 
```

Nghĩa là phải lưu hai thứ trước khi reset context:

1. `outer result = 10`
2. `outer sign = -1`

Sau đó expression trong ngoặc có thể tính như một bài nhỏ độc lập với:

```text
result = 0
sign = 1
```

Khi gặp `)`, inner result trở thành **một term duy nhất** của outer context:

```text
outerResult + outerSign * innerResult
```

Với ví dụ:

```text
10 + (-1) * 5 = 5
```

Đó là lý do stack tồn tại: nó lưu context đang tạm dừng khi ta đi vào ngoặc sâu hơn.

---

## 3. Tại sao stack phải lưu cả `result` và `sign`?

Nếu chỉ lưu `result`, ta sẽ làm sai:

```text
1 - (2 - 3)
```

Dấu `-` trước ngoặc phải tác động lên **toàn bộ** giá trị trong ngoặc.

Do đó khi gặp `(`, code push:

```text
stack.push(result)
stack.push(sign)
```

Rồi khi `)` xuất hiện, pop theo thứ tự ngược lại:

```text
outerSign   = stack.pop()
outerResult = stack.pop()
```

Implementation viết trực tiếp:

```text
result *= outerSign
result += outerResult
```

### Mental model

```text
outer: result=10, sign=-1
             |
             v
          ( inner )  -> 5
             |
             v
merge: 10 + (-1 * 5)
```

---

## 4. Xử lý từng loại ký tự

### Digit

```text
number = number * 10 + digit
```

Chưa commit vì có thể còn digit tiếp theo.

### `+` hoặc `-`

Operator báo rằng `number` hiện tại đã hoàn chỉnh:

```text
result += sign * number
number = 0
sign = +1 hoặc -1 cho term kế tiếp
```

### `(`

Lưu outer context rồi reset để tính inner expression.

### `)`

Trước tiên phải commit term cuối trong ngoặc, vì có thể nó vừa kết thúc bằng digit:

```text
result += sign * number
number = 0
```

Sau đó ghép inner result vào outer context.

### Space

Không khớp branch nào nên tự nhiên bị bỏ qua.

---

## 5. Java Notes

`Deque<Integer>` được dùng như stack.

Với `ArrayDeque`:

```text
push(x) → đặt x lên đỉnh stack
pop()   → lấy và xóa phần tử trên đỉnh
```

`Character.isDigit(c)` kiểm tra `c` có phải ký tự số hay không.

Để đổi char digit sang số:

```java
c - '0'
```

Ví dụ `'7' - '0' = 7` vì các ký tự digit có code liên tiếp.

---

## 6. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int calculate(String s) {
        int result = 0;
        int number = 0;
        int sign = 1;
        Deque<Integer> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                // Build multi-digit number incrementally; chưa commit cho tới khi
                // gặp operator/closing parenthesis hoặc hết input.
                number = number * 10 + (c - '0');
            } else if (c == '+') {
                result += sign * number;
                number = 0;
                sign = 1;
            } else if (c == '-') {
                result += sign * number;
                number = 0;
                sign = -1;
            } else if (c == '(') {
                // Parenthesis mở một context độc lập. Phải lưu cả outer result lẫn
                // sign trước '(' để xử lý đúng dạng -(...) khi inner expression kết thúc.
                stack.push(result);
                stack.push(sign);
                result = 0;
                sign = 1;
            } else if (c == ')') {
                // Commit term cuối của inner context trước khi ghép inner result
                // thành một term duy nhất của outer context.
                result += sign * number;
                number = 0;

                // Push order là result rồi sign, nên pop sign trước; phép ghép chính là
                // outerResult + outerSign * innerResult.
                result *= stack.pop();
                result += stack.pop();
            }
        }

        // Input có thể kết thúc bằng digit nên term cuối chưa gặp operator để commit.
        return result + sign * number;
    }
}
```

Block trên được giữ exact-sync với [`Solution.java`](Solution.java).

---

## 7. Dry run: `1 - (2 - 3)`

Ban đầu:

```text
result=0, number=0, sign=1, stack=[]
```

### Đọc `1`

```text
number=1
```

### Đọc `-`

Commit `+1`:

```text
result=1
number=0
sign=-1
```

### Đọc `(`

Lưu outer context:

```text
push result 1
push sign -1
stack=[-1, 1]   // top ở bên trái trong minh họa này
```

Reset:

```text
result=0, sign=1
```

### Đọc `2 - 3`

Sau `-`:

```text
result=2
sign=-1
number=3 khi đọc xong digit 3
```

### Đọc `)`

Commit term cuối:

```text
inner result = 2 + (-1 * 3) = -1
```

Khôi phục sign trước ngoặc:

```text
result *= -1  → 1
```

Khôi phục outer result:

```text
result += 1   → 2
```

Đáp án là `2`.

---

## 8. Vì sao thuật toán đúng?

Trong mỗi context không có ngoặc chưa đóng, invariant là:

- `result` chứa tổng của mọi term đã hoàn chỉnh.
- `number` chứa đúng số đang đọc nhưng chưa commit.
- `sign` là dấu của `number` khi nó được commit.

Khi gặp `(`, outer context được lưu đầy đủ bởi `(result, sign)`, rồi inner context bắt đầu từ trạng thái sạch. Khi gặp `)`, inner expression đã được rút thành một số; công thức:

```text
outerResult + outerSign * innerResult
```

chính xác tái tạo biểu thức bên ngoài.

Ngoặc lồng nhau hoạt động vì stack lưu nhiều context theo LIFO: context mở gần nhất phải được đóng trước.

---

## 9. Complexity

```text
Time:  O(n) — mỗi ký tự được đọc một lần
Space: O(d) — d là độ sâu ngoặc lồng nhau
```

Mỗi cặp ngoặc lưu hai integer trên stack.

---

## 10. Lỗi thường gặp

- Quên commit `number` trước khi xử lý `+`, `-`, `)` hoặc khi hết chuỗi.
- Chỉ push outer `result` mà quên sign trước `(`; dạng `-(...)` sẽ sai.
- Pop sai thứ tự. Vì push `result` rồi `sign`, phải lấy sign ra trước.
- Reset `number`/`sign` sai thời điểm khiến term cũ bị cộng hai lần.
- Parse mỗi digit thành một số riêng, làm `123` thành `1 + 2 + 3` thay vì một operand.
- Dùng recursion/substring cho từng ngoặc mà không quản lý index/context rõ ràng; có thể đúng nhưng dễ tạo parsing phức tạp hơn cần thiết.

---

## 11. Cách nhận ra pattern ở bài khác

Khi đang scan một chuỗi và gặp token mở làm **tạm dừng context hiện tại** để xử lý context con, stack là tín hiệu mạnh.

Đừng chỉ hỏi “có ngoặc nên dùng stack”. Hãy hỏi chính xác:

> “Khi đi vào context con, mình cần lưu tối thiểu state nào để sau này quay ra tiếp tục đúng?”

Ở bài này câu trả lời là outer `result` và outer `sign`.
