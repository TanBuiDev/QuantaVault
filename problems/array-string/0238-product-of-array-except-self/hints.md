# 238. Product of Array Except Self — Hints / Gợi ý

## Hint 1

Với index `i`, đáp án có thể tách thành hai phần:

```text
product(nums[0 .. i-1]) * product(nums[i+1 .. n-1])
```

## Hint 2

Hãy nghĩ tới **prefix product** và **suffix product** thay vì phép chia.

## Hint 3

Trong lượt trái → phải, có thể dùng chính `answer[i]` để lưu tích của mọi phần tử bên trái `i`.

## Hint 4

Sau đó không cần tạo suffix array. Chỉ cần một biến:

```text
suffix = 1
```

Duyệt phải → trái:

```text
answer[i] *= suffix
suffix *= nums[i]
```

Như vậy extra space ngoài output chỉ là `O(1)`.
