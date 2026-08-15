# 15. 3Sum — Hints / Gợi ý

## Hint 1

Nếu fix một số `nums[i]`, bài toán còn lại trở thành tìm hai số có tổng bằng `-nums[i]`.

## Hint 2

Sort array trước. Khi đó với mỗi `i`, dùng:

```text
left = i + 1
right = n - 1
```

Nếu tổng nhỏ hơn `0` thì `left++`; nếu lớn hơn `0` thì `right--`.

## Hint 3

Duplicate là phần khó chính. Nếu `nums[i] == nums[i-1]`, bỏ qua `i` hiện tại vì nó sẽ sinh lại các triplet đã xét.

## Hint 4

Sau khi tìm được một triplet, tăng `left` và giảm `right`, rồi tiếp tục bỏ qua các giá trị giống hệt ở hai phía trước khi xét sum mới.
