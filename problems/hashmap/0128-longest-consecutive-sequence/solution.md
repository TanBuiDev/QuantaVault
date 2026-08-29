# 128. Longest Consecutive Sequence — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Với [100,4,200,1,3,2], sequence 1,2,3,4 dài 4. Nếu mỗi số đều thử mở rộng cả trái/phải, cùng sequence bị đếm lại nhiều lần; chỉ bắt đầu ở số không có predecessor x-1.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Sort cho O(n log n). HashSet cho membership O(1), nhưng để đạt O(n) cần observation start-of-run: chỉ x với x-1 không tồn tại mới scan x,x+1,...; mỗi element thuộc đúng một scan dài.

**State / invariant / data structure cần hiểu trước code.** Set chứa toàn bộ values; current bắt đầu tại run head và length tăng khi current+1 tồn tại. Invariant mỗi sequence chỉ được enumerated từ minimum của nó nên tổng số membership steps tuyến tính.

**Dry run mental theo implementation.** Dry run set {100,4,200,1,3,2}: 4 bị skip vì 3 tồn tại; 1 không có 0 nên scan 1,2,3,4 length4; 100 và 200 tạo runs length1.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là scan từ mọi number dẫn worst-case O(n²). Khi nào dùng: HashSet + consecutive chains thường cần nhận ra một điều kiện xác định duy nhất head của mỗi chain.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Dùng `HashSet` để biết một value có tồn tại hay không trong average `O(1)`. Quan trọng nhất: **chỉ bắt đầu đếm ở đầu sequence**.

`x` là sequence start iff `x - 1` không nằm trong set. Sau đó mở rộng `x, x+1, x+2, ...`.

---

## 2. Optimal Java solution

```java
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> values = new HashSet<>();
        for (int value : nums) {
            values.add(value);
        }

        int best = 0;
        for (int value : values) {
            // Chỉ value không có predecessor mới là đầu một maximal sequence.
            // Nếu expand từ mọi value, một dãy dài sẽ bị quét lặp và thành O(n^2).
            if (!values.contains(value - 1)) {
                int current = value;
                int length = 1;

                // Vì mỗi sequence chỉ được mở rộng từ đầu duy nhất của nó,
                // mỗi distinct value tham gia một expansion tối đa một lần amortized.
                while (values.contains(current + 1)) {
                    current++;
                    length++;
                }

                best = Math.max(best, length);
            }
        }

        return best;
    }
}
```

Empty input trả `0` tự nhiên vì loop không chạy.

---

## 3. Why start detection makes it linear

Nếu mở rộng từ mọi number, array `[1,2,3,...,n]` sẽ scan gần toàn sequence từ từng position và thành `O(n²)`.

Khi chỉ mở rộng từ value không có predecessor, mỗi actual sequence được scan đúng **một lần từ đầu tới cuối**. Mỗi distinct value thuộc đúng một such expansion.

---

## 4. Dry run

```text
[100,4,200,1,3,2]
```

- `100`: `99` absent → sequence length `1`.
- `4`: `3` exists → không start.
- `200`: `199` absent → length `1`.
- `1`: `0` absent → expand `1,2,3,4` → length `4`.

Best = `4`.

---

## 5. Correctness / Vì sao đúng

Mỗi maximal consecutive sequence có duy nhất một phần tử nhỏ nhất `start`, và `start-1` không tồn tại trong set. Vì vậy outer loop chắc chắn nhận diện đúng một start cho mỗi maximal sequence.

Từ start đó, while loop tiến liên tục cho đến value đầu tiên không tồn tại, nên đếm chính xác toàn bộ sequence. Lấy maximum trên tất cả sequence starts cho longest consecutive length.

---

## 6. Complexity

Build set tốn `O(n)` average. Outer loop đi qua distinct values. Dù có nested while, mỗi value chỉ được đi qua trong expansion của sequence start duy nhất.

```text
Time: O(n) average
Space: O(n)
```

---

## 7. Common mistakes

- Sort và vi phạm explicit `O(n)` requirement.
- Expand từ mọi value và vô tình tạo `O(n²)`.
- Không deduplicate input.
- Nghĩ nested while tự động đồng nghĩa quadratic mà không amortized analysis.
