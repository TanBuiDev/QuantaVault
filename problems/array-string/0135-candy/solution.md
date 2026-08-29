# 135. Candy — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Candy phải thỏa hai hướng: nếu rating cao hơn neighbor trái thì candy cao hơn trái; nếu cao hơn neighbor phải thì candy cao hơn phải. Một pass chỉ nhìn một hướng không đủ.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Tăng candy lặp cho tới ổn định có thể O(n²). Quan sát hai constraint độc lập theo trái và phải có thể tính bằng hai pass; tại mỗi child lấy max requirement từ hai phía.

**State / invariant / data structure cần hiểu trước code.** Pass trái đảm bảo relation với left neighbor; pass phải đảm bảo relation với right neighbor. Candy tại i cuối cùng phải đủ lớn cho cả hai, nên dùng max hoặc update từ phải với requirement hiện tại.

**Dry run mental theo implementation.** Dry run ratings=[1,0,2]: left requirements [1,1,2]; từ phải, index0 phải hơn index1 nên requirement trái-side cho index0 thành 2; kết quả [2,1,2], tổng 5.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ pass trái hoặc cộng hai requirement thay vì lấy max. Khi nào dùng: local constraints phụ thuộc cả neighbor trái và phải thường tách thành directional passes rồi combine.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Mỗi child có thể bị ràng buộc từ **hai phía**:

- nếu rating cao hơn hàng xóm trái → phải nhiều candy hơn bên trái;
- nếu rating cao hơn hàng xóm phải → phải nhiều candy hơn bên phải.

Ta giải hai hệ constraint theo hai lượt:

1. Trái → phải: thỏa mọi quan hệ với hàng xóm trái.
2. Phải → trái: thỏa mọi quan hệ với hàng xóm phải, dùng `max` để không phá kết quả lượt đầu.

```text
Time:  O(n)
Space: O(n)
```

---

## 2. Why one directional pass is insufficient

Ví dụ:

```text
ratings = [1,0,2]
```

Nếu chỉ duyệt trái → phải, có thể thu được:

```text
candies = [1,1,2]
```

nhưng child đầu có rating `1 > 0` mà candy `1` không lớn hơn `1`.

Constraint xuất phát từ phía phải chưa được xử lý.

---

## 3. Left-to-right pass

Ban đầu mỗi child nhận minimum cơ bản:

```text
[1,1,...,1]
```

Nếu:

```text
ratings[i] > ratings[i-1]
```

thì amount nhỏ nhất thỏa quan hệ này là:

```text
candies[i] = candies[i-1] + 1
```

Sau lượt đầu, **mọi constraint hướng trái đã đúng**, và mỗi value là nhỏ nhất có thể với riêng các constraint đó.

---

## 4. Right-to-left pass

Nếu:

```text
ratings[i] > ratings[i+1]
```

child `i` cần ít nhất:

```text
candies[i+1] + 1
```

Nhưng `candies[i]` có thể đã cần lớn hơn vì phía trái, nên:

```java
candies[i] = Math.max(candies[i], candies[i + 1] + 1);
```

Không dùng assignment trực tiếp vì có thể phá constraint đã thỏa từ lượt đầu.

---

## 5. Why the result is minimal / Vì sao là minimum

Lượt trái tạo lower bound nhỏ nhất do các constraint với neighbor trái yêu cầu.

Lượt phải tạo lower bound do neighbor phải yêu cầu. Với mỗi child, số candy cuối phải ít nhất bằng **max của hai lower bounds**.

Thuật toán đặt chính xác giá trị đó, không tăng bất kỳ child nào vượt quá điều cần thiết. Vì vậy phân phối cuối vừa hợp lệ vừa có tổng nhỏ nhất.

---

## 6. Optimal Java solution

```java
import java.util.Arrays;

class Solution {
    public int candy(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];

        // 1 là lower bound bắt buộc cho mọi child; hai lượt sau chỉ tăng khi
        // một quan hệ với hàng xóm chứng minh cần nhiều hơn mức tối thiểu này.
        Arrays.fill(candies, 1);

        for (int i = 1; i < n; i++) {
            // Lượt trái -> phải tạo lower bound nhỏ nhất thỏa constraint với bên trái.
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
            }
        }

        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                // Constraint bên phải có thể đòi hỏi nhiều hơn, nhưng không được giảm
                // giá trị đã cần để thỏa bên trái; lấy max chính là hợp hai lower bound.
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
            }
        }

        int total = 0;
        for (int amount : candies) {
            total += amount;
        }
        return total;
    }
}
```

---

## 7. Dry run

```text
ratings = [1,3,4,5,2]
```

Khởi tạo:

```text
[1,1,1,1,1]
```

Trái → phải:

```text
[1,2,3,4,1]
```

Phải → trái:

- `5 > 2`: index 3 cần ít nhất 2, nhưng đã có 4 → giữ 4.
- Các quan hệ còn lại đã thỏa.

Kết quả:

```text
[1,2,3,4,1]
sum = 11
```

---

## 8. Alternative approaches / Các hướng khác

### Repeated relaxation

Khởi tạo 1 rồi lặp cập nhật neighbor constraints cho tới ổn định. Đúng nhưng có thể tốn nhiều lượt.

### Priority queue theo rating

Xử lý từ thấp đến cao cũng có thể xây đáp án, nhưng phức tạp và tốn `O(n log n)`.

### One-pass slope counting

Có lời giải `O(1)` extra space bằng cách đếm các đoạn tăng/giảm và peak adjustment. Tối ưu space hơn nhưng proof và implementation khó hơn. Two-pass array là lựa chọn canonical vì rõ ràng và ít bug.

---

## 9. Correctness / Vì sao đúng

Sau lượt trái, với mọi `i` có `ratings[i] > ratings[i-1]`, ta có `candies[i] > candies[i-1]`.

Sau lượt phải, với mọi `i` có `ratings[i] > ratings[i+1]`, phép `max` đảm bảo `candies[i] > candies[i+1]` nhưng không giảm bất kỳ value nào, nên constraint trái vẫn đúng.

Mọi child có ít nhất 1 candy. Do mỗi giá trị cuối là maximum của các lower bound tối thiểu từ hai phía, không thể giảm riêng một value mà vẫn giữ toàn bộ constraint. Tổng vì thế là minimum.

---

## 10. Complexity

Ba lượt tuyến tính (hai constraint pass + sum):

```text
Time: O(n)
Space: O(n)
```

---

## 11. Edge cases

- Một child → 1.
- Ratings tăng hoàn toàn → `1,2,3,...`.
- Ratings giảm hoàn toàn → reverse staircase.
- Ratings bằng nhau → không có strict inequality, không cần thêm candy.
- Valley/peak dài → hai lượt gặp nhau tại peak bằng `max`.

---

## 12. Common mistakes

1. Dùng `>=` thay vì `>` cho ratings bằng nhau.
2. Ở lượt phải gán trực tiếp `candies[i] = candies[i+1]+1` thay vì `max`.
3. Nghĩ một lượt trái → phải là đủ.
4. Quên mỗi child phải có ít nhất một candy.

---

## 13. Pattern recognition

Khi constraint cục bộ phụ thuộc vào hai hướng trái/phải, hãy thử tách thành **hai directional passes** rồi kết hợp các lower bound.
