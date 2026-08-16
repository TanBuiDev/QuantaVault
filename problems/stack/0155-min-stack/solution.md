# 155. Min Stack — Solution

## 1. Core idea / Intuition

Nếu chỉ dùng một stack value, `getMin()` phải scan toàn bộ stack và thành `O(n)`. Để mọi operation đều `O(1)`, ta lưu thêm **minimum-so-far ở mỗi depth**.

Cách dễ hiểu nhất là dùng hai stack đồng bộ:

- `values`: lưu giá trị thật;
- `mins`: tại mỗi depth lưu minimum của `values` từ đáy tới depth đó.

Khi push `value`, push vào `values`, đồng thời push `min(value, mins.peek())` vào `mins`. Khi pop, pop cả hai. Vì hai stack luôn cùng size, `mins.peek()` luôn là minimum của stack hiện tại.

## 2. Requirement recap / Tóm tắt yêu cầu

Class phải hỗ trợ:

```text
push(value) -> O(1)
pop()       -> O(1)
top()       -> O(1)
getMin()    -> O(1)
```

Không được tìm minimum bằng cách duyệt lại stack ở mỗi lần gọi.

## 3. Key observations / Nhận xét quan trọng

### Observation 1: Minimum changes only on push/pop

Ta không cần data structure phức tạp nếu ghi lại minimum tại đúng thời điểm stack thay đổi.

### Observation 2: Duplicate minimum values matter

Nếu push hai lần cùng minimum rồi pop một lần, minimum vẫn phải còn. Lưu minimum ở **mọi depth** xử lý duplicate tự nhiên.

### Observation 3: Synchronization gives constant-time rollback

Khi pop value ở depth hiện tại, pop luôn minimum snapshot cùng depth. `mins.peek()` tự động quay về minimum của trạng thái trước đó.

## 4. Alternative approaches / Hướng khác

### Scan on `getMin()`

`push/pop/top` đơn giản nhưng `getMin()` là `O(n)`, vi phạm yêu cầu.

### Store `(value, minSoFar)` pairs in one stack

Cũng rất tốt: mỗi node/item lưu value và minimum-so-far. Logic tương đương hai stack, nhưng Java cần pair object/array hoặc custom class.

### Min stack only stores new minima

Có thể chỉ push vào min stack khi `value <= currentMin`, rồi khi pop value bằng min thì pop min. Cách này tiết kiệm một ít space thực tế nhưng logic duplicate cần cẩn thận hơn. Hai stack đồng bộ dễ chứng minh và ít lỗi hơn.

## 5. Optimal approach

### Constructor

Khởi tạo hai `ArrayDeque<Integer>`.

### `push(value)`

```java
values.push(value);
mins.push(mins.isEmpty() ? value : Math.min(value, mins.peek()));
```

### `pop()`

```java
values.pop();
mins.pop();
```

### `top()`

```java
return values.peek();
```

### `getMin()`

```java
return mins.peek();
```

## 6. Java solution overview

```java
class MinStack {
    private final Deque<Integer> values = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();

    public void push(int val) {
        values.push(val);
        mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
    }

    public void pop() {
        values.pop();
        mins.pop();
    }

    public int top() {
        return values.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}
```

## 7. Code explanation / Giải thích code

`mins` không chỉ chứa các minimum độc nhất; nó chứa **snapshot minimum cho từng stack depth**. Vì vậy:

```text
values: [-3, 0, -2]   (top bên trái nếu dùng push)
mins:   [-3, -2, -2]
```

Mỗi pop luôn rollback cả value và minimum snapshot cùng lúc.

`ArrayDeque` được dùng thay cho legacy `Stack` class. Constraint đảm bảo `pop`, `top`, `getMin` chỉ gọi trên stack không rỗng.

## 8. Dry run

Operations:

```text
push(-2)
push(0)
push(-3)
getMin()
pop()
top()
getMin()
```

Sau `push(-2)`:

```text
values = [-2]
mins   = [-2]
```

Sau `push(0)`:

```text
values = [0,-2]
mins   = [-2,-2]
```

Sau `push(-3)`:

```text
values = [-3,0,-2]
mins   = [-3,-2,-2]
```

`getMin()` -> `-3`.

Pop cả hai:

```text
values = [0,-2]
mins   = [-2,-2]
```

`top()` -> `0`, `getMin()` -> `-2`.

## 9. Time and space complexity

Mỗi operation:

```text
push:   O(1)
pop:    O(1)
top:    O(1)
getMin: O(1)
```

Space:

```text
O(n)
```

Hai stack lưu tối đa một entry cho mỗi phần tử/depth, nên vẫn tuyến tính.

## 10. Why the algorithm is correct / Vì sao đúng

Invariant:

> Sau mỗi operation, `values` và `mins` có cùng size; tại mỗi depth `d`, entry tương ứng trong `mins` là minimum của tất cả values từ đáy đến depth `d`.

Khi push `value`, minimum mới chính xác là `min(value, previousMinimum)`, nên invariant giữ đúng ở depth mới.

Khi pop, xóa cả value và snapshot minimum của cùng depth; trạng thái top mới chính là trạng thái đã tồn tại trước lần push tương ứng, nên invariant vẫn đúng.

Do đó `values.peek()` luôn là top hiện tại và `mins.peek()` luôn là minimum hiện tại.

## 11. Edge cases

- Một phần tử duy nhất.
- Push giá trị nhỏ dần liên tục.
- Push giá trị lớn dần.
- Duplicate minimum: `2, 1, 1` rồi pop một `1`.
- Giá trị âm.
- `Integer.MIN_VALUE` và `Integer.MAX_VALUE`.

## 12. Common mistakes / Lỗi thường gặp

- `getMin()` scan `values` -> `O(n)`.
- Chỉ lưu một biến `min` mà không có cách rollback khi pop minimum.
- Min stack chỉ lưu strict-smaller (`<`) rồi sai với duplicate minimum.
- Pop `values` nhưng quên pop `mins`.
- Hai stack lệch size.
- Dùng arithmetic encoding nhưng không xử lý overflow hoặc giải thích phức tạp không cần thiết.

## 13. Pattern recognition / Khi nào tái sử dụng

Pattern **auxiliary stack / state snapshot per depth** dùng khi cần stack hỗ trợ thêm aggregate `O(1)` như:

- minimum;
- maximum;
- gcd/aggregate có thể cập nhật từ state trước;
- rollback state;
- undo operations với metadata đi kèm.

Ý tưởng: mỗi push không chỉ lưu value mà còn lưu đủ metadata để trả lời query ngay tại depth đó.

## 14. Vocabulary and algorithmic terminology

- **minimum-so-far**: minimum tính đến trạng thái hiện tại.
- **auxiliary stack**: stack phụ.
- **synchronized stacks**: hai stack cập nhật đồng bộ.
- **snapshot**: trạng thái chụp/lưu tại một thời điểm.
- **rollback**: quay lại trạng thái trước.
- **constant time**: thời gian hằng số `O(1)`.
- **duplicate minimum**: giá trị minimum xuất hiện nhiều lần.
