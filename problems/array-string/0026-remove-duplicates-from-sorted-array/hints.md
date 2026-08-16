# 26. Remove Duplicates from Sorted Array — Hints / Gợi ý

## Hint 1

Mảng đã sort, vì vậy các giá trị bằng nhau nằm cạnh nhau. Bạn không cần `HashSet` để biết một giá trị đã xuất hiện chưa.

## Hint 2

Giữ một con trỏ `write` đại diện cho số lượng giá trị unique đã đặt vào đầu mảng.

Giá trị unique cuối cùng đã ghi là:

```text
nums[write - 1]
```

## Hint 3

Duyệt từ phần tử thứ hai. Nếu giá trị hiện tại khác `nums[write - 1]`, đó là một giá trị unique mới và cần được ghi vào `nums[write]`.

## Hint 4

Do `nums.length >= 1`, bạn có thể khởi tạo:

```text
write = 1
```

vì phần tử đầu tiên luôn là giá trị unique đầu tiên.
