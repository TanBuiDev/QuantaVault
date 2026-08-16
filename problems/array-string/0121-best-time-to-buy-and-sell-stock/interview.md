# Interview Preparation / Chuẩn bị phỏng vấn

## 121. Best Time to Buy and Sell Stock

File này dùng để luyện **cách nghe câu hỏi, hiểu ý và trả lời bằng tiếng Anh** sau khi đã hiểu thuật toán trong `solution.md`.

Các câu hỏi dưới đây là **practice questions** được xây dựng từ thuật toán, invariant, complexity, edge cases và các biến thể tự nhiên của bài. Chúng không được trình bày như số liệu thống kê về tần suất phỏng vấn.

---

## 1. 30-second solution pitch / Cách trình bày lời giải trong khoảng 30 giây

### Pitch (EN)

> I scan the prices from left to right and keep track of the minimum price seen so far. For each day, I treat the current price as the selling price and calculate the profit using that minimum buying price. I update the maximum profit whenever I find a better one. Because the minimum price only comes from the current or previous days, the buy always happens before the sell. This takes O(n) time and O(1) extra space.

### Pitch (VI)

> Tôi duyệt mảng giá từ trái sang phải và duy trì giá nhỏ nhất đã thấy cho đến hiện tại. Với mỗi ngày, tôi coi giá hiện tại là giá bán và tính lợi nhuận dựa trên giá mua nhỏ nhất đó. Nếu tìm được lợi nhuận tốt hơn, tôi cập nhật lợi nhuận lớn nhất. Vì giá mua nhỏ nhất chỉ đến từ ngày hiện tại hoặc các ngày trước đó nên ngày mua luôn đứng trước ngày bán. Thuật toán chạy trong O(n) thời gian và dùng O(1) bộ nhớ phụ.

### Key phrases to remember

```text
scan from left to right
minimum price seen so far
current price as the selling price
best profit so far
buy before sell
O(n) time
O(1) extra space
```

---

## 2. Core practice question — Explain your approach

**Q (EN):** Can you explain your approach?

**Q (VI):** Bạn có thể giải thích cách tiếp cận của mình không?

### Short answer (EN)

> I scan the array once, keep the minimum price seen so far, and use it to compute the best profit for each possible selling day.

### Trả lời ngắn (VI)

> Tôi duyệt mảng một lần, giữ giá nhỏ nhất đã thấy và dùng nó để tính lợi nhuận tốt nhất cho mỗi ngày bán có thể xảy ra.

### Standard answer (EN)

> I iterate through the prices from left to right. I maintain `minPrice`, which is the minimum price seen so far. For each current price, I calculate `price - minPrice` as the profit if I sell today. Then I update `maxProfit` if that profit is better than the previous best. This gives O(n) time and O(1) extra space.

### Trả lời chuẩn (VI)

> Tôi duyệt các mức giá từ trái sang phải. Tôi duy trì `minPrice`, là giá nhỏ nhất đã thấy cho đến hiện tại. Với mỗi giá hiện tại, tôi tính `price - minPrice` như lợi nhuận nếu bán hôm nay. Sau đó tôi cập nhật `maxProfit` nếu lợi nhuận này tốt hơn kết quả trước đó. Cách này đạt O(n) thời gian và O(1) bộ nhớ phụ.

---

## 3. Common reasoning check — Why not use max minus min?

**Q (EN):** Why can't you simply return the maximum price minus the minimum price?

**Q (VI):** Tại sao không thể chỉ lấy giá lớn nhất trừ giá nhỏ nhất?

### Short answer (EN)

> Because the maximum price may appear before the minimum price, which would violate the rule that we must buy before we sell.

### Trả lời ngắn (VI)

> Vì giá lớn nhất có thể xuất hiện trước giá nhỏ nhất, điều này vi phạm yêu cầu phải mua trước rồi mới bán.

### Standard answer (EN)

> The array represents time order. A valid transaction requires the buying day to come before the selling day. If I independently take the global maximum and minimum, I can accidentally choose a minimum that occurs after the maximum. For example, with `[10, 1]`, `10 - 1` gives 9, but that transaction is impossible. The correct answer is 0.

### Trả lời chuẩn (VI)

> Mảng biểu diễn thứ tự thời gian. Một giao dịch hợp lệ yêu cầu ngày mua đứng trước ngày bán. Nếu tôi lấy riêng giá lớn nhất và nhỏ nhất toàn mảng, tôi có thể vô tình chọn giá nhỏ nhất xuất hiện sau giá lớn nhất. Ví dụ với `[10, 1]`, phép tính `10 - 1` cho 9 nhưng giao dịch đó không thể xảy ra. Đáp án đúng là 0.

---

## 4. Common reasoning check — How do you guarantee buy before sell?

**Q (EN):** How does your algorithm guarantee that the buying day comes before the selling day?

**Q (VI):** Thuật toán của bạn đảm bảo ngày mua đứng trước ngày bán như thế nào?

### Short answer (EN)

> `minPrice` only contains prices from the current day or earlier days, so it can never come from the future.

### Trả lời ngắn (VI)

> `minPrice` chỉ chứa giá từ ngày hiện tại hoặc các ngày trước đó nên nó không bao giờ lấy giá từ tương lai.

### Standard answer (EN)

> I scan from left to right. Before evaluating a selling price, `minPrice` represents the minimum value in the prefix that I have already visited. Therefore, when I compute `price - minPrice`, the buying price belongs to the current or an earlier day. I never use a future price as the buying price.

### Trả lời chuẩn (VI)

> Tôi duyệt từ trái sang phải. Khi xét một giá bán, `minPrice` biểu diễn giá nhỏ nhất trong phần mảng đã duyệt. Vì vậy khi tính `price - minPrice`, giá mua luôn thuộc ngày hiện tại hoặc một ngày trước đó. Tôi không bao giờ dùng giá ở tương lai làm giá mua.

### Deep answer (EN)

> The invariant is that after processing index `i`, `minPrice` equals the minimum of `prices[0..i]`. The profit considered at index `i` is therefore based only on a valid prefix. Since every candidate selling day is processed in order, all candidate transactions respect the time constraint automatically.

### Trả lời sâu (VI)

> Invariant là sau khi xử lý vị trí `i`, `minPrice` bằng giá nhỏ nhất trong `prices[0..i]`. Vì vậy lợi nhuận xét tại `i` chỉ dùng dữ liệu trong prefix hợp lệ. Do mọi ngày bán được xử lý theo đúng thứ tự thời gian, tất cả giao dịch ứng viên tự động thỏa điều kiện mua trước bán.

---

## 5. Core practice question — Why is brute force slower?

**Q (EN):** What would the brute-force solution look like, and why is it slower?

**Q (VI):** Lời giải brute force sẽ như thế nào và tại sao nó chậm hơn?

### Short answer (EN)

> Brute force checks every buy-and-sell pair, so it takes O(n²) time. The one-pass solution avoids repeating work by keeping the best buying price seen so far.

### Trả lời ngắn (VI)

> Brute force thử mọi cặp ngày mua và bán nên mất O(n²). Cách one-pass tránh lặp lại công việc bằng cách duy trì giá mua tốt nhất đã thấy.

### Standard answer (EN)

> In brute force, for each buying day I try every later selling day. That creates about n² candidate pairs. But for a fixed selling day, I don't need every previous price; I only need the minimum previous price. Once I keep that value incrementally, each day can be processed in constant time, reducing the total complexity to O(n).

### Trả lời chuẩn (VI)

> Với brute force, cho mỗi ngày mua tôi thử mọi ngày bán phía sau, tạo ra khoảng n² cặp ứng viên. Nhưng với một ngày bán cố định, tôi không cần tất cả giá trước đó; tôi chỉ cần giá nhỏ nhất trong quá khứ. Khi duy trì giá trị đó liên tục, mỗi ngày chỉ tốn O(1), đưa tổng thời gian xuống O(n).

---

## 6. Core practice question — Complexity

**Q (EN):** What are the time and space complexities of your solution?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ của lời giải là bao nhiêu?

### Short answer (EN)

> O(n) time and O(1) extra space.

### Trả lời ngắn (VI)

> O(n) thời gian và O(1) bộ nhớ phụ.

### Standard answer (EN)

> I scan the array exactly once, so the time complexity is O(n). I only keep a constant number of variables such as `minPrice` and `maxProfit`, so the extra space complexity is O(1).

### Trả lời chuẩn (VI)

> Tôi chỉ duyệt mảng đúng một lần nên độ phức tạp thời gian là O(n). Tôi chỉ giữ một số lượng biến cố định như `minPrice` và `maxProfit`, vì vậy độ phức tạp bộ nhớ phụ là O(1).

---

## 7. Core practice question — What happens when prices keep decreasing?

**Q (EN):** What happens if the prices are strictly decreasing?

**Q (VI):** Điều gì xảy ra nếu giá giảm liên tục?

### Short answer (EN)

> Every possible profit is non-positive, so `maxProfit` stays 0.

### Trả lời ngắn (VI)

> Mọi giao dịch đều có lợi nhuận không dương nên `maxProfit` giữ nguyên bằng 0.

### Standard answer (EN)

> As I scan the array, `minPrice` keeps decreasing. The current price never produces a positive profit compared with an earlier price, so `maxProfit` is never updated above 0. This matches the problem requirement to return 0 when no profitable transaction exists.

### Trả lời chuẩn (VI)

> Khi tôi duyệt mảng, `minPrice` liên tục giảm. Giá hiện tại không bao giờ tạo lợi nhuận dương so với một giá trước đó nên `maxProfit` không được cập nhật lớn hơn 0. Điều này đúng với yêu cầu trả 0 khi không tồn tại giao dịch có lời.

---

## 8. Common reasoning check — What invariant do you maintain?

**Q (EN):** What invariant does your algorithm maintain while scanning the array?

**Q (VI):** Thuật toán duy trì invariant nào khi duyệt mảng?

### Short answer (EN)

> `minPrice` is the minimum price seen so far, and `maxProfit` is the best valid profit seen so far.

### Trả lời ngắn (VI)

> `minPrice` là giá nhỏ nhất đã thấy và `maxProfit` là lợi nhuận hợp lệ tốt nhất đã thấy cho đến hiện tại.

### Standard answer (EN)

> After processing index `i`, `minPrice` equals the minimum value in `prices[0..i]`. At the same time, `maxProfit` equals the best profit among all valid transactions whose selling day is at or before `i`. These two invariants are enough to process the next day without storing the full history.

### Trả lời chuẩn (VI)

> Sau khi xử lý vị trí `i`, `minPrice` bằng giá nhỏ nhất trong `prices[0..i]`. Đồng thời, `maxProfit` bằng lợi nhuận tốt nhất trong mọi giao dịch hợp lệ có ngày bán không vượt quá `i`. Hai invariant này đủ để xử lý ngày kế tiếp mà không cần lưu toàn bộ lịch sử.

### Deep answer (EN)

> For the next index `i + 1`, I first extend the running minimum with the new price. Then the best transaction ending at `i + 1` is determined by that minimum. Taking the maximum between this candidate and the previous `maxProfit` preserves the second invariant. This gives an inductive argument for correctness.

### Trả lời sâu (VI)

> Với vị trí kế tiếp `i + 1`, trước tiên tôi mở rộng running minimum bằng giá mới. Sau đó giao dịch tốt nhất kết thúc tại `i + 1` được xác định bởi giá nhỏ nhất đó. Lấy maximum giữa ứng viên mới và `maxProfit` cũ sẽ bảo toàn invariant thứ hai. Đây chính là lập luận quy nạp cho tính đúng của thuật toán.

---

## 9. Common reasoning check — Why is one pass sufficient?

**Q (EN):** Why is a single pass enough to find the global maximum profit?

**Q (VI):** Tại sao chỉ cần duyệt một lần vẫn tìm được lợi nhuận lớn nhất toàn cục?

### Short answer (EN)

> Every day is evaluated once as a possible selling day, and for that day I already know the best possible buying price from the prefix.

### Trả lời ngắn (VI)

> Mỗi ngày được xét đúng một lần như một ngày bán và tại ngày đó tôi đã biết giá mua tốt nhất trong phần prefix.

### Standard answer (EN)

> Any valid transaction has exactly one selling day. When my scan reaches that selling day, `minPrice` already contains the lowest valid buying price from all previous days. Therefore I evaluate the best transaction ending on every possible selling day. Taking the maximum of those candidates gives the global optimum.

### Trả lời chuẩn (VI)

> Mọi giao dịch hợp lệ đều có đúng một ngày bán. Khi vòng lặp tới ngày bán đó, `minPrice` đã chứa giá mua thấp nhất hợp lệ từ các ngày trước. Vì vậy tôi xét được giao dịch tốt nhất kết thúc tại mọi ngày bán có thể có. Lấy maximum của các ứng viên đó cho ra optimum toàn cục.

### Deep answer (EN)

> The algorithm compresses the entire prefix into one sufficient statistic: its minimum price. No other information from the prefix can improve the profit for the current selling day. Because that statistic can be updated in O(1), revisiting earlier elements is unnecessary.

### Trả lời sâu (VI)

> Thuật toán nén toàn bộ prefix thành một thông tin đủ dùng: giá nhỏ nhất của prefix. Không có thông tin nào khác trong phần quá khứ có thể tạo lợi nhuận tốt hơn cho ngày bán hiện tại. Vì statistic này cập nhật được trong O(1), ta không cần quay lại các phần tử cũ.

---

## 10. Core practice question — Code walkthrough

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code của mình từng phần không?

### Short answer (EN)

> I initialize `minPrice` to a very large value and `maxProfit` to 0. For each price, I update the minimum price and then update the best profit using the current price. Finally, I return `maxProfit`.

### Trả lời ngắn (VI)

> Tôi khởi tạo `minPrice` bằng một giá trị rất lớn và `maxProfit` bằng 0. Với mỗi giá, tôi cập nhật giá nhỏ nhất rồi cập nhật lợi nhuận tốt nhất bằng giá hiện tại. Cuối cùng tôi trả về `maxProfit`.

### Standard answer (EN)

> `minPrice` stores the cheapest buying price available so far. `maxProfit` stores the best valid profit found so far. Inside the loop, `Math.min` updates the running minimum. Then `price - minPrice` represents the profit if I sell at the current price, and `Math.max` keeps the best result. The loop processes every price once, and the final value of `maxProfit` is the answer.

### Trả lời chuẩn (VI)

> `minPrice` lưu giá mua rẻ nhất đã có cho đến hiện tại. `maxProfit` lưu lợi nhuận hợp lệ tốt nhất đã tìm được. Trong vòng lặp, `Math.min` cập nhật running minimum. Sau đó `price - minPrice` biểu diễn lợi nhuận nếu bán ở giá hiện tại, và `Math.max` giữ kết quả tốt nhất. Vòng lặp xử lý mỗi giá một lần và giá trị cuối cùng của `maxProfit` là đáp án.

---

## 11. Likely follow-up — Return the buy and sell days

**Q (EN):** What if I also want you to return the buying day and the selling day?

**Q (VI):** Nếu tôi muốn trả về cả ngày mua và ngày bán thì sao?

### Short answer (EN)

> I would also store the index of the running minimum and save the buy/sell indices whenever `maxProfit` improves.

### Trả lời ngắn (VI)

> Tôi sẽ lưu thêm index của running minimum và ghi lại cặp index mua/bán mỗi khi `maxProfit` được cải thiện.

### Standard answer (EN)

> Along with `minPrice`, I keep `minIndex`. When the current profit becomes greater than `maxProfit`, I update `maxProfit` and store `buyIndex = minIndex` and `sellIndex = currentIndex`. The time complexity remains O(n) and the extra space remains O(1).

### Trả lời chuẩn (VI)

> Cùng với `minPrice`, tôi giữ thêm `minIndex`. Khi lợi nhuận hiện tại lớn hơn `maxProfit`, tôi cập nhật `maxProfit` và lưu `buyIndex = minIndex`, `sellIndex = currentIndex`. Độ phức tạp vẫn là O(n) thời gian và O(1) bộ nhớ phụ.

---

## 12. Variation practice — Multiple transactions

**Q (EN):** What changes if multiple transactions are allowed?

**Q (VI):** Nếu được phép thực hiện nhiều giao dịch thì điều gì thay đổi?

### Short answer (EN)

> This becomes a different problem. For the unlimited-transaction version, we can accumulate every positive increase between consecutive days.

### Trả lời ngắn (VI)

> Đây trở thành một bài khác. Với phiên bản cho phép giao dịch không giới hạn, ta có thể cộng mọi đoạn tăng dương giữa hai ngày liên tiếp.

### Standard answer (EN)

> The current algorithm is designed for exactly one buy-and-sell transaction. If multiple transactions are allowed, keeping only one global minimum is no longer the correct model. In the unlimited-transaction version, a greedy approach can add `prices[i] - prices[i-1]` whenever that difference is positive.

### Trả lời chuẩn (VI)

> Thuật toán hiện tại được thiết kế cho đúng một giao dịch mua–bán. Nếu cho phép nhiều giao dịch, chỉ giữ một global minimum không còn mô hình đúng. Trong phiên bản giao dịch không giới hạn, một greedy approach có thể cộng `prices[i] - prices[i-1]` mỗi khi hiệu đó dương.

**Interview trap:** Đừng vô tình áp dụng logic của bài nhiều giao dịch vào bài 121.

---

## 13. Variation practice — Transaction fee

**Q (EN):** What if every transaction has a fee?

**Q (VI):** Nếu mỗi giao dịch có một khoản phí thì sao?

### Short answer (EN)

> If only one transaction is still allowed, I can subtract the fee from the candidate profit. If multiple transactions are allowed, the state model changes and I would use a different greedy or DP formulation.

### Trả lời ngắn (VI)

> Nếu vẫn chỉ cho một giao dịch, tôi có thể trừ phí khỏi lợi nhuận ứng viên. Nếu cho phép nhiều giao dịch, mô hình trạng thái thay đổi và tôi sẽ dùng greedy hoặc DP khác.

### Standard answer (EN)

> For a single transaction, the structure is almost unchanged: the candidate profit becomes `price - minPrice - fee`. But if the interviewer also allows repeated transactions, I would stop and redefine the states because the one-running-minimum solution is no longer sufficient.

### Trả lời chuẩn (VI)

> Với một giao dịch duy nhất, cấu trúc gần như không đổi: lợi nhuận ứng viên trở thành `price - minPrice - fee`. Nhưng nếu interviewer đồng thời cho phép nhiều giao dịch, tôi sẽ dừng lại và định nghĩa lại state vì một running minimum không còn đủ.

---

## 14. Common interviewer traps / Những bẫy tư duy cần tránh

### Trap 1 — Confusing problem 121 with problem 122

**Sai:** cộng tất cả đoạn tăng giá dương.

**Đúng cho bài 121:** chỉ được chọn một lần mua và một lần bán.

Useful sentence:

> This problem allows only one transaction, so I cannot accumulate profits from multiple price increases.

### Trap 2 — Using a future minimum

Nếu chỉ lấy global min và global max, có thể vô tình dùng một giá mua ở tương lai.

Useful sentence:

> I only use a minimum price from the prefix I have already scanned.

### Trap 3 — Overcomplicating with a DP array

DP array không sai, nhưng không cần thiết nếu chỉ cần đáp án cuối cùng.

Useful sentence:

> The previous state can be compressed into two scalar values, so an O(n) DP array would be unnecessary.

### Trap 4 — Saying O(1) space without explaining “extra” space

Nên nói:

> The extra space is O(1) because I only maintain a constant number of variables.

### Trap 5 — Giving code before explaining the invariant

Trong interview, tốt hơn nên nói tư duy trước:

```text
minimum price seen so far
→ candidate profit today
→ best profit so far
```

rồi mới viết code.

---

## 15. Useful phrases / Cụm từ nên luyện nói

| English phrase | Cách hiểu |
|---|---|
| scan from left to right | duyệt từ trái sang phải |
| minimum price seen so far | giá nhỏ nhất đã thấy cho đến hiện tại |
| current price as the selling price | coi giá hiện tại là giá bán |
| best profit so far | lợi nhuận tốt nhất đã thấy |
| valid transaction | giao dịch hợp lệ |
| the buying day comes before the selling day | ngày mua đứng trước ngày bán |
| maintain an invariant | duy trì một invariant |
| running minimum | giá trị minimum được cập nhật trong lúc duyệt |
| process each element once | xử lý mỗi phần tử một lần |
| constant extra space | bộ nhớ phụ hằng số |
| avoid repeated work | tránh lặp lại công việc |
| global optimum | nghiệm tối ưu toàn cục |
| candidate profit | lợi nhuận ứng viên |
| prefix of the array | phần prefix của mảng |

---

## 16. Self-practice checklist / Checklist tự luyện

Trước khi coi là đã nắm bài này, hãy thử nói mà không nhìn tài liệu:

- [ ] Tôi có thể giải thích đề trong 20–30 giây.
- [ ] Tôi có thể nói vì sao `max - min` có thể sai.
- [ ] Tôi có thể giải thích `minPrice` bằng tiếng Anh.
- [ ] Tôi có thể nói invariant của `minPrice` và `maxProfit`.
- [ ] Tôi có thể giải thích vì sao mua luôn xảy ra trước bán.
- [ ] Tôi có thể nói `O(n)` time và `O(1)` extra space kèm lý do.
- [ ] Tôi có thể walkthrough code mà không đọc từng dòng như máy.
- [ ] Tôi biết cách trả lời biến thể trả về buy/sell indices.
- [ ] Tôi không nhầm bài một giao dịch với bài nhiều giao dịch.

Nếu làm được các mục trên, bạn không chỉ nhớ code mà đã có thể **trình bày reasoning trong interview**.
