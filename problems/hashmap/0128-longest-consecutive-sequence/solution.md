# 128. Longest Consecutive Sequence — Solution

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
