# 205. Isomorphic Strings — Hints / Gợi ý

## Hint 1

Mapping phải là **bijection**: một source character chỉ map tới một target character, và một target character cũng không được nhận từ hai source character khác nhau.

## Hint 2

Một cách trực tiếp là duy trì hai mapping `s -> t` và `t -> s`.

## Hint 3

Có một cách gọn hơn: hai ký tự ở cùng vị trí phải có cùng **lịch sử xuất hiện gần nhất**. Lưu last-seen position cho từng ASCII character ở cả hai chuỗi.

## Hint 4

Dùng `i + 1` thay vì `i` để giá trị `0` có nghĩa là “chưa từng xuất hiện”. Nếu last-seen signature ở hai phía khác nhau tại bất kỳ index nào, trả `false`.
