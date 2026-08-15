# 383. Ransom Note — Hints / Gợi ý

## Hint 1

Hãy xem các ký tự trong `magazine` như một lượng **inventory** có giới hạn.

## Hint 2

Vì chỉ có 26 chữ cái viết thường, có thể dùng `int[26]` để đếm số lần mỗi ký tự xuất hiện trong `magazine`.

## Hint 3

Khi duyệt `ransomNote`, mỗi ký tự cần tiêu thụ một đơn vị inventory tương ứng.

## Hint 4

Nếu sau khi decrement một frequency mà nó nhỏ hơn `0`, nhu cầu đã vượt nguồn cung, nên có thể trả `false` ngay.
