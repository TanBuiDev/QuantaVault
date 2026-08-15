# 169. Majority Element — Hints / Gợi ý

## Hint 1

Một cách trực tiếp là đếm tần suất bằng `HashMap`. Nhưng follow-up yêu cầu `O(1)` extra space, nên hãy tìm cách không lưu toàn bộ tần suất.

## Hint 2

Phần tử majority xuất hiện **nhiều hơn một nửa** số vị trí. Hãy tưởng tượng ghép mỗi occurrence của majority với một phần tử khác nó rồi loại cả hai.

Sau mọi lần ghép có thể thực hiện, majority có biến mất hoàn toàn không?

## Hint 3

Duy trì:

```text
candidate
count
```

- Nếu `count == 0`, chọn phần tử hiện tại làm candidate mới.
- Nếu current bằng candidate, tăng `count`.
- Nếu khác, giảm `count`.

## Hint 4

Đề đảm bảo majority **luôn tồn tại**, vì vậy candidate cuối cùng có thể được trả về trực tiếp. Nếu đề không có đảm bảo này, bạn cần thêm một lượt để đếm và xác minh candidate.
