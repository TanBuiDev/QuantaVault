# 167. Two Sum II - Input Array Is Sorted — Hints / Gợi ý

## Hint 1

Mảng đã sorted. Nếu đang xét hai đầu, tổng hiện tại cho biết cần tăng hay giảm giá trị nào.

## Hint 2

Dùng:

```text
left = 0
right = n - 1
```

Tính:

```text
sum = numbers[left] + numbers[right]
```

## Hint 3

Nếu `sum < target`, giữ `right` và giảm `left` có giúp tổng tăng không? Không — `left` đã là giá trị nhỏ nhất trong range hiện tại. Vì vậy cần `left++`.

Nếu `sum > target`, cần `right--` để giảm tổng.

## Hint 4

Khi `sum == target`, nhớ đề yêu cầu index **1-based**:

```text
[left + 1, right + 1]
```
