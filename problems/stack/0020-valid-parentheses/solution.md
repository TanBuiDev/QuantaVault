# 20. Valid Parentheses — Solution

## 1. Core idea / Intuition

Đây là bài **matching delimiters** điển hình. Khi đọc từ trái sang phải, một closing bracket phải đóng đúng opening bracket gần nhất chưa được đóng. Đây chính xác là quan hệ **LIFO**, nên stack là cấu trúc phù hợp.

Một cách code rất gọn là không push opening bracket, mà push **closing bracket được mong đợi**:

- gặp `(` -> push `)`;
- gặp `[` -> push `]`;
- gặp `{` -> push `}`.

Khi gặp closing bracket, chỉ cần kiểm tra nó có bằng stack top hay không.

## 2. Requirement recap / Tóm tắt yêu cầu

Chuỗi hợp lệ khi:

- bracket đóng đúng type;
- bracket đóng đúng thứ tự nesting;
- không có closing bracket thừa;
- cuối cùng không còn opening bracket chưa đóng.

## 3. Key observations / Nhận xét quan trọng

### Observation 1: Correct order means LIFO

Ví dụ:

```text
([{}])
```

Opening bracket gần nhất luôn phải được đóng trước. Stack tự nhiên mô hình hóa thứ tự này.

### Observation 2: Early failure is safe

Nếu gặp closing bracket mà stack rỗng, không thể có opening bracket tương ứng ở tương lai vì opening bracket phải xuất hiện trước closing bracket.

Nếu top không khớp type, nesting đã sai và cũng không thể sửa bằng các ký tự phía sau.

### Observation 3: Empty stack at the end is mandatory

Chuỗi `"((("` không có mismatch trong lúc scan, nhưng vẫn invalid vì còn opening brackets chưa được đóng.

## 4. Alternative approaches / Hướng khác

### Repeated string replacement

Có thể liên tục replace `()`, `[]`, `{}` bằng empty string cho tới khi không thay đổi nữa. Cách này đơn giản để nghĩ nhưng có thể tốn `O(n^2)` do tạo chuỗi mới nhiều lần.

### Stack of opening brackets

Đây là hướng chuẩn khác: push opening bracket rồi khi gặp closing bracket thì map ngược để kiểm tra. Đúng nhưng cần thêm logic mapping.

### Stack of expected closers

Push closing bracket mong đợi giúp branch kiểm tra gọn hơn và dễ giải thích.

## 5. Optimal approach

1. Tạo `Deque<Character>` làm stack.
2. Scan từng `char c`:
   - opening bracket -> push expected closer;
   - closing bracket -> nếu stack rỗng hoặc `stack.pop() != c`, return `false`.
3. Sau loop, return `stack.isEmpty()`.

## 6. Java solution overview

```java
Deque<Character> stack = new ArrayDeque<>();

for (char c : s.toCharArray()) {
    if (c == '(') {
        stack.push(')');
    } else if (c == '[') {
        stack.push(']');
    } else if (c == '{') {
        stack.push('}');
    } else if (stack.isEmpty() || stack.pop() != c) {
        return false;
    }
}

return stack.isEmpty();
```

## 7. Code explanation / Giải thích code

### Why `ArrayDeque`?

Trong Java, `ArrayDeque` thường là lựa chọn tốt cho stack thay vì legacy `Stack` class. Ta dùng:

```java
push()
pop()
isEmpty()
```

### Why push expected closers?

Nếu stack chứa expected closer, khi gặp closing bracket chỉ cần:

```java
stack.pop() != c
```

Không cần switch ngược từ `)` về `(`.

## 8. Dry run

Input:

```text
s = "([])"
```

Đọc `(`:

```text
stack = [')']
```

Đọc `[`:

```text
stack = [']', ')']
```

Đọc `]`:

```text
pop ']' -> match
stack = [')']
```

Đọc `)`:

```text
pop ')' -> match
stack = []
```

Cuối cùng stack rỗng -> `true`.

Với:

```text
s = "([)]"
```

Sau `(` và `[`:

```text
stack top = ']'
```

Nhưng ký tự tiếp theo là `)` -> mismatch -> `false` ngay.

## 9. Time and space complexity

```text
Time: O(n)
Space: O(n)
```

Mỗi ký tự được push/pop tối đa một lần. Trường hợp toàn opening brackets, stack có thể chứa `n` phần tử.

## 10. Why the algorithm is correct / Vì sao đúng

Invariant sau mỗi prefix đã xử lý:

> Stack từ top xuống lưu chính xác thứ tự các closing bracket cần xuất hiện để đóng tất cả opening bracket chưa được match trong prefix.

Khi gặp opening bracket, push closing bracket tương ứng nên invariant được mở rộng đúng.

Khi gặp closing bracket, nó phải bằng expected closer ở top vì top đại diện opening bracket gần nhất chưa đóng. Nếu khác hoặc stack rỗng, prefix đã vi phạm quy tắc và toàn chuỗi không thể hợp lệ.

Sau khi scan hết, stack rỗng khi và chỉ khi mọi opening bracket đều đã được đóng. Vì vậy thuật toán trả `true` chính xác cho các chuỗi hợp lệ.

## 11. Edge cases

- Một cặp đơn: `()`.
- Nhiều loại nối tiếp: `()[]{}`.
- Nested: `([])`.
- Sai type: `(]`.
- Sai nesting: `([)]`.
- Closing bracket xuất hiện đầu tiên: `]`.
- Còn opening bracket cuối chuỗi: `((`.

## 12. Common mistakes / Lỗi thường gặp

- Chỉ đếm số lượng opening/closing mà không kiểm tra thứ tự.
- Pop khi stack rỗng và gây exception.
- Chỉ kiểm tra type nhưng không đảm bảo LIFO nesting.
- Quên `stack.isEmpty()` ở cuối.
- Dùng queue thay vì stack.
- Dùng `Stack<Character>` dù `ArrayDeque` là lựa chọn hiện đại hơn trong Java.

## 13. Pattern recognition / Khi nào tái sử dụng

Stack matching pattern xuất hiện trong:

- bracket validation;
- parsing nested expressions;
- HTML/XML-like tag matching;
- expression evaluation;
- monotonic/structural parsing nơi phần tử gần nhất chưa xử lý cần được giải quyết trước.

Dấu hiệu: **"most recent unmatched"** hoặc nesting.

## 14. Vocabulary and algorithmic terminology

- **opening bracket**: dấu ngoặc mở.
- **closing bracket**: dấu ngoặc đóng.
- **matching pair**: cặp tương ứng.
- **nesting order**: thứ tự lồng nhau.
- **LIFO (Last In, First Out)**: vào sau ra trước.
- **stack top**: phần tử trên cùng của stack.
- **unmatched bracket**: dấu ngoặc chưa được ghép cặp.
- **expected closing bracket**: dấu ngoặc đóng đang được mong đợi.
