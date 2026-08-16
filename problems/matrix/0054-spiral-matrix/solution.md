# 54. Spiral Matrix — Solution

## 1. Core idea

Mô phỏng từng lớp bằng bốn boundary của phần ma trận chưa xử lý:

```text
top, bottom, left, right
```

Mỗi vòng đọc tối đa bốn cạnh rồi co boundary vào trong.

## 2. Algorithm

```java
while (top <= bottom && left <= right) {
    for (int c = left; c <= right; c++) ans.add(matrix[top][c]);
    top++;

    for (int r = top; r <= bottom; r++) ans.add(matrix[r][right]);
    right--;

    if (top <= bottom) {
        for (int c = right; c >= left; c--) ans.add(matrix[bottom][c]);
        bottom--;
    }

    if (left <= right) {
        for (int r = bottom; r >= top; r--) ans.add(matrix[r][left]);
        left++;
    }
}
```

## 3. Why the guards matter

Với single row, sau khi đọc top row thì `top > bottom`; nếu vẫn đọc bottom row sẽ duplicate. Tương tự single column cần guard trước left-column traversal.

## 4. Correctness

Invariant: trước mỗi vòng, rectangle `[top..bottom] x [left..right]` chứa chính xác các cell chưa output. Bốn traversal xuất các cell trên perimeter đúng clockwise order và boundary update loại đúng perimeter đó. Guards bảo đảm một degenerate perimeter không bị đọc hai lần. Khi rectangle rỗng, mọi cell đã xuất đúng một lần.

## 5. Complexity

Mỗi cell được đọc đúng một lần:

```text
Time: O(m*n)
Extra space: O(1) excluding output
```

## 6. Common mistakes

- Không guard bottom/left traversal.
- Update boundary sai thứ tự.
- Dùng visited matrix không cần thiết.
- Chỉ test square matrix mà quên rectangular/single-row/single-column.
