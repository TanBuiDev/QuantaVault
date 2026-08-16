# 135. Candy — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I initialize every child with one candy. In a left-to-right pass, whenever a child's rating is higher than the left neighbor, I give it one more candy than that neighbor. Then I scan right-to-left; when a rating is higher than the right neighbor, I require at least one more candy than the right neighbor, using `max` so I do not break the left-side constraint. The two passes enforce both directional inequalities with the smallest necessary values, giving `O(n)` time and `O(n)` space.

**VI:** Em khởi tạo mỗi child 1 candy. Lượt trái → phải, nếu rating cao hơn neighbor trái thì cho nhiều hơn bên trái 1 viên. Sau đó duyệt phải → trái; nếu rating cao hơn neighbor phải thì cần ít nhất nhiều hơn bên phải 1 viên, dùng `max` để không phá constraint phía trái. Hai lượt thỏa cả hai hướng bằng lượng tối thiểu cần thiết, `O(n)` time và `O(n)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why are two passes necessary?

**Q (VI):** Vì sao cần hai lượt?

### Short answer (EN)

Each child can be constrained independently by its left and right neighbor, so one directional scan only sees one side naturally.

### Trả lời ngắn (VI)

Mỗi child có thể bị ràng buộc độc lập bởi neighbor trái và phải; một lượt theo một hướng chỉ xử lý tự nhiên một phía.

### Standard answer (EN)

The left-to-right pass computes the minimum candies required by all increasing relations from the left. Decreasing runs require information from the right, so the reverse pass adds the missing lower bounds. Combining both is necessary to satisfy all local inequalities.

### Trả lời chuẩn (VI)

Lượt trái tính minimum cần thiết cho mọi quan hệ tăng từ bên trái. Các đoạn giảm cần thông tin từ bên phải, nên lượt ngược bổ sung lower bound còn thiếu. Kết hợp hai phía mới thỏa mọi inequality.

### Deep answer (EN)

The constraints form directed inequalities between adjacent positions. Splitting them by direction turns the problem into two acyclic chains of lower-bound propagation. The final candy count at each vertex is the maximum lower bound imposed by those two chains.

### Trả lời sâu (VI)

Các constraint là directed inequalities giữa các vị trí kề nhau. Tách theo hướng biến bài thành hai chuỗi truyền lower bound không chu trình. Candy cuối tại mỗi vị trí là maximum lower bound do hai chuỗi áp đặt.

---

### Q2

**Q (EN):** Why do you use `max` in the right-to-left pass?

**Q (VI):** Vì sao dùng `max` ở lượt phải → trái?

### Short answer (EN)

Because the left pass may already require more candies; the right pass should only raise the value, never lower it.

### Trả lời ngắn (VI)

Vì lượt trái có thể đã yêu cầu nhiều candy hơn; lượt phải chỉ được tăng chứ không giảm.

### Standard answer (EN)

`candies[i+1] + 1` is the minimum imposed by the right neighbor, while `candies[i]` already represents the minimum imposed from the left. We need the maximum of both lower bounds.

### Trả lời chuẩn (VI)

`candies[i+1]+1` là minimum do neighbor phải yêu cầu, còn `candies[i]` đã là minimum từ phía trái. Ta cần maximum của hai lower bound.

---

### Q3

**Q (EN):** Why is the final distribution minimal?

**Q (VI):** Vì sao phân phối cuối là minimum?

### Short answer (EN)

Each position receives exactly the maximum of the minimum amounts required by its left and right constraints.

### Trả lời ngắn (VI)

Mỗi vị trí nhận đúng maximum của các minimum amount mà hai phía yêu cầu.

### Standard answer (EN)

The first pass never assigns more than required by left constraints. The second pass only raises a value when a right constraint requires it and raises it only to the minimum satisfying that constraint. Therefore no final candy count contains unnecessary slack.

### Trả lời chuẩn (VI)

Lượt đầu không cho nhiều hơn mức constraint trái yêu cầu. Lượt hai chỉ tăng khi constraint phải bắt buộc và tăng đúng tới mức tối thiểu cần thiết. Vì vậy kết quả không có phần dư thừa.

---

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(n)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(n)` bộ nhớ phụ.

### Standard answer (EN)

I use two linear constraint passes plus one sum pass and an auxiliary candy array of length `n`.

### Trả lời chuẩn (VI)

Em dùng hai lượt constraint tuyến tính cộng một lượt tính tổng và mảng candy dài `n`.

---

### Q5

**Q (EN):** Do equal ratings require equal candy counts?

**Q (VI):** Rating bằng nhau có bắt buộc candy bằng nhau không?

### Short answer (EN)

No. The rule applies only when one rating is strictly higher than its neighbor.

### Trả lời ngắn (VI)

Không. Rule chỉ áp dụng khi một rating **cao hơn nghiêm ngặt** neighbor.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** Can you reduce the extra space to `O(1)`?

**Q (VI):** Có thể giảm extra space xuống `O(1)` không?

**EN:** Yes, by tracking lengths of increasing and decreasing slopes and adjusting the peak contribution, but that solution is more subtle. The two-pass array version is usually easier to prove and maintain.

**VI:** Có, bằng cách đếm độ dài các slope tăng/giảm và điều chỉnh contribution tại peak, nhưng solution đó tinh tế hơn. Two-pass dễ chứng minh và ít bug hơn.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I fill the candy array with ones. On the forward pass I handle every pair where the current rating is higher than the previous rating. On the reverse pass I handle the symmetric relation with the next rating and use `max` to merge the two requirements. Finally I sum the array.

**VI:** Em fill mảng candy bằng 1. Lượt xuôi xử lý mọi cặp mà current rating cao hơn previous rating. Lượt ngược xử lý quan hệ đối xứng với next rating và dùng `max` để gộp hai requirement. Cuối cùng tính tổng.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Dùng non-strict comparison cho equal ratings.
- Quên `max` ở lượt ngược.
- Không chứng minh minimum, chỉ chứng minh valid.
- Nhầm hai pass thành hai lần greedy độc lập mà không thấy chúng là hai lower bounds.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- neighbor constraint — ràng buộc hàng xóm
- strictly higher rating — rating cao hơn nghiêm ngặt
- lower bound — cận dưới
- directional pass — lượt duyệt theo hướng
- increasing/decreasing run — đoạn tăng/giảm
- minimal distribution — phân phối tối thiểu
