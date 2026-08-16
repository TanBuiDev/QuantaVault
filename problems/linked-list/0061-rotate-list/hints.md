# Hints / Gợi ý — 61. Rotate List

## Hint 1

**EN:** Rotating by the list length returns the same list, so reduce `k` using `k % length`.

**VI:** Xoay đúng bằng độ dài list sẽ trở về trạng thái cũ, nên hãy rút gọn `k` bằng `k % length`.

## Hint 2

**EN:** If the list has length `n` and the effective rotation is `k`, the new tail is the node at position `n - k` from the start, and the next node becomes the new head.

**VI:** Nếu list dài `n` và rotation hiệu dụng là `k`, new tail nằm ở vị trí `n-k` tính từ đầu; node kế tiếp trở thành new head.

## Hint 3

**EN:** Connect the old tail to the old head to form a temporary cycle, walk to the new tail, then break the cycle there.

**VI:** Nối tail cũ với head cũ để tạo cycle tạm thời, đi tới new tail rồi cắt cycle tại đó.

## Key observation / Quan sát then chốt

Tạo cycle tạm giúp “đưa suffix lên đầu” chỉ bằng một lần nối và một lần cắt, không cần di chuyển node từng bước `k` lần.
