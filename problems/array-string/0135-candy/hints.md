# 135. Candy — Hints / Gợi ý

## Hint 1

Mỗi child chịu hai constraint độc lập:

```text
so với hàng xóm trái
so với hàng xóm phải
```

Một lượt duyệt chỉ theo một hướng khó thỏa cả hai cùng lúc.

## Hint 2

Khởi tạo tất cả child với `1` candy. Duyệt trái → phải: nếu rating tăng so với bên trái thì child hiện tại phải có ít nhất:

```text
candies[i - 1] + 1
```

## Hint 3

Sau lượt trái → phải, constraint với hàng xóm phải vẫn có thể sai trên các đoạn giảm.

Duyệt phải → trái. Nếu:

```text
ratings[i] > ratings[i + 1]
```

thì cần:

```text
candies[i] = max(candies[i], candies[i + 1] + 1)
```

## Hint 4

Tại sao phải dùng `max`? Vì giá trị từ lượt thứ nhất đã là minimum cần thiết để thỏa constraint bên trái; lượt thứ hai chỉ được tăng nếu constraint bên phải yêu cầu nhiều hơn.
