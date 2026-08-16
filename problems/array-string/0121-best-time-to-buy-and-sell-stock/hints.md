# Hints / Gợi ý — 121. Best Time to Buy and Sell Stock

Các gợi ý được sắp xếp từ nhẹ đến mạnh. Khi luyện tập, chỉ nên mở từng hint khi thật sự cần.

## Hint 1 — Think about the past / Hãy nghĩ về dữ liệu trong quá khứ

**EN:** If the current day is the day you sell, what information from the previous days is most useful for maximizing your profit?

**VI:** Nếu coi ngày hiện tại là ngày bán, thông tin nào từ **các ngày trước đó** là hữu ích nhất để tối đa hóa lợi nhuận?

---

## Hint 2 — Maintain one useful value / Duy trì một giá trị quan trọng

**EN:** While scanning from left to right, keep track of the minimum price seen so far.

**VI:** Khi duyệt từ trái sang phải, hãy duy trì **giá nhỏ nhất đã thấy cho đến hiện tại** (`minimum price seen so far`).

Giá này luôn đến từ ngày hiện tại hoặc một ngày trước đó, nên nó không thể là một giá mua nằm trong tương lai.

---

## Hint 3 — Evaluate each day as a selling day / Xem mỗi ngày như một ngày bán

**EN:** For each current price, compute `currentPrice - minPrice` and compare it with the best profit seen so far.

**VI:** Với mỗi mức giá hiện tại, tính:

```text
currentPrice - minPrice
```

rồi so sánh kết quả với **lợi nhuận tốt nhất đã tìm được** (`best profit so far`).

Bạn chỉ cần duy trì hai thông tin chính trong lúc duyệt:

```text
minimum price seen so far
best profit so far
```

Không cần tạo thêm một mảng DP hay thử mọi cặp ngày.
