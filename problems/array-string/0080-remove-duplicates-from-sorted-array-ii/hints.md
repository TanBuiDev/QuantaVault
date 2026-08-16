# 80. Remove Duplicates from Sorted Array II — Hints / Gợi ý

## Hint 1

Bài 26 giữ một giá trị khi nó khác **giá trị cuối đã giữ**. Ở bài này ta được phép giữ hai bản sao.

## Hint 2

Nếu prefix kết quả hiện có ít hơn hai phần tử, phần tử hiện tại luôn có thể được giữ.

## Hint 3

Khi đã có ít nhất hai phần tử, hãy nhìn vào:

```text
nums[write - 2]
```

Nếu `nums[read] == nums[write - 2]`, việc giữ thêm `nums[read]` sẽ tạo ra ít nhất ba bản sao liên tiếp của cùng giá trị.

## Hint 4

Rule cuối cùng có thể viết rất gọn:

```text
keep if write < 2 OR nums[read] != nums[write - 2]
```

Sau đó ghi vào `nums[write]` và tăng `write`.
