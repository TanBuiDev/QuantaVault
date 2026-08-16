# 27. Remove Element — Hints / Gợi ý

## Hint 1

Bạn không cần thật sự thay đổi độ dài của mảng. Chỉ cần đảm bảo **prefix đầu tiên** chứa đúng các phần tử cần giữ.

## Hint 2

Hãy tách hai vai trò:

```text
read  = đọc từng phần tử ban đầu
write = vị trí tiếp theo để đặt một phần tử hợp lệ
```

## Hint 3

Mỗi khi `nums[read] != val`, ghi nó vào `nums[write]` rồi tăng `write`.

Nếu `nums[read] == val`, chỉ bỏ qua nó.

## Hint 4

Sau khi quét hết mảng, `write` chính là số phần tử hợp lệ `k`.
