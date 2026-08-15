# 54. Spiral Matrix — Hints / Gợi ý

## Hint 1

Hãy duy trì bốn biên của vùng chưa đọc: `top`, `bottom`, `left`, `right`.

## Hint 2

Mỗi layer đi theo thứ tự: hàng trên trái→phải, cột phải trên→dưới, hàng dưới phải→trái, cột trái dưới→trên.

## Hint 3

Sau khi đọc một cạnh, co biên tương ứng vào trong.

## Hint 4

Trước khi đọc bottom row hoặc left column, kiểm tra vùng còn tồn tại (`top <= bottom`, `left <= right`) để tránh đọc trùng khi layer cuối chỉ còn một hàng hoặc một cột.
