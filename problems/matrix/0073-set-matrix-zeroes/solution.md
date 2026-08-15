# 73. Set Matrix Zeroes — Solution

## 1. Core idea

Dùng first row và first column làm marker storage, cộng hai boolean:

```text
firstRowZero
firstColZero
```

Khi thấy `matrix[r][c] == 0` ở interior:

```text
matrix[r][0] = 0
matrix[0][c] = 0
```

## 2. Why two booleans are needed

`matrix[0][0]` nằm đồng thời trên first row và first column, nên một cell không thể lưu hai bit trạng thái độc lập. Ta ghi nhớ trạng thái ban đầu của hai vùng này trước khi dùng chúng làm marker.

## 3. Algorithm

1. Scan first row để biết có zero ban đầu không.
2. Scan first column tương tự.
3. Scan interior, ghi row/column markers.
4. Scan interior lần hai; nếu row marker hoặc column marker bằng `0`, set cell bằng `0`.
5. Nếu `firstRowZero`, zero first row.
6. Nếu `firstColZero`, zero first column.

## 4. Correctness

Sau bước marker, với mọi interior row `r`, `matrix[r][0]==0` iff row đó cần zero do có original zero trong interior; tương tự cho columns. Bước apply markers zero chính xác mọi interior cell thuộc một marked row/column. Hai boolean riêng khôi phục yêu cầu zero của first row/column mà không bị marker mutations làm mất thông tin. Vì vậy final matrix đúng với tất cả original zero và không tạo ảnh hưởng ngoài yêu cầu.

## 5. Complexity

```text
Time: O(m*n)
Extra space: O(1)
```

## 6. Common mistakes

- Zero ngay khi gặp `0`, làm zero mới lan truyền sai.
- Dùng `(0,0)` cho cả first row và first column mà không có flag riêng.
- Zero first row/column quá sớm làm hỏng marker.
- Dùng extra row/column arrays dù follow-up yêu cầu constant space.
