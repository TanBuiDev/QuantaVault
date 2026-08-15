# 134. Gas Station — Solution

## 1. Core idea / Ý tưởng cốt lõi

Biến bài toán thành balance:

```text
balance[i] = gas[i] - cost[i]
```

Có hai câu hỏi độc lập:

1. **Toàn cục:** tổng balance có đủ không?
2. **Cục bộ:** nếu đủ, start hợp lệ nằm ở đâu?

Ta giữ:

```text
total = tổng balance toàn mảng
tank  = balance từ candidate start hiện tại tới i
start = candidate hiện tại
```

Nếu `tank < 0` tại `i`, candidate hiện tại thất bại và toàn bộ start trong đoạn `start..i` cũng có thể bị loại. Candidate mới là `i + 1`.

```text
Time: O(n)
Space: O(1)
```

---

## 2. Global feasibility

Để đi hết một vòng, tổng lượng xăng nhận được phải ít nhất bằng tổng cost:

```text
sum(gas) >= sum(cost)
```

Tương đương:

```text
sum(gas[i] - cost[i]) >= 0
```

Nếu `total < 0`, không có start nào có thể tạo thêm xăng; đáp án chắc chắn `-1`.

---

## 3. Candidate elimination

Giả sử candidate là `s` và lần đầu tank âm sau trạm `i`:

```text
sum(balance[s..i]) < 0
```

Ta biết candidate `s` không hợp lệ.

Quan trọng hơn, mọi `j` với `s < j <= i` cũng không cần thử. Trước khi thất bại tại `i`, candidate `s` đã duy trì tank không âm ở các prefix trước đó. Do đó phần surplus từ `s` đến `j-1` không âm. Bỏ surplus đó đi và bắt đầu trực tiếp tại `j` chỉ làm balance tới `i` nhỏ hơn hoặc bằng, nên cũng thất bại.

Vì vậy có thể nhảy candidate thẳng tới:

```text
start = i + 1
```

---

## 4. Canonical Java solution

```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0;
        int tank = 0;
        int start = 0;

        for (int i = 0; i < gas.length; i++) {
            int balance = gas[i] - cost[i];
            total += balance;
            tank += balance;

            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }

        return total >= 0 ? start : -1;
    }
}
```

---

## 5. Dry run

```text
gas  = [1,2,3,4,5]
cost = [3,4,5,1,2]
bal  = [-2,-2,-2,+3,+3]
```

- `i=0`: tank `-2` → reset start `1`.
- `i=1`: tank `-2` → reset start `2`.
- `i=2`: tank `-2` → reset start `3`.
- `i=3`: tank `+3`.
- `i=4`: tank `+6`.

`total = 0`, nên circuit khả thi và candidate cuối là `3`.

---

## 6. Correctness / Vì sao đúng

Mỗi khi tank âm tại `i`, lemma candidate-elimination loại chính xác toàn bộ start từ candidate cũ đến `i`; vì vậy không bỏ qua start hợp lệ nào khi đặt `start = i+1`.

Sau lượt quét, `start` là candidate duy nhất còn lại sau các đoạn đã bị loại. Nếu `total < 0`, không có lời giải. Nếu `total >= 0`, tổng surplus toàn vòng đủ bù mọi deficit; candidate còn lại không thất bại trên phần suffix đã quét và phần prefix sau khi wrap được bù bởi tổng surplus còn lại. Do đề đảm bảo uniqueness, trả `start` là đúng.

---

## 7. Complexity

Mỗi station xử lý một lần:

```text
Time: O(n)
Space: O(1)
```

---

## 8. Edge cases

- Một station đủ xăng → `0`.
- Một station thiếu xăng → `-1`.
- Tổng gas bằng tổng cost vẫn có thể có start hợp lệ.
- Candidate có thể nằm gần cuối và hoàn thành nhờ wrap về đầu.

---

## 9. Common mistakes

1. Chỉ kiểm tra `total` rồi trả một index tùy ý.
2. Reset candidate nhưng quên reset `tank = 0`.
3. Không giải thích vì sao có thể bỏ qua mọi start trong đoạn đã fail.
4. Dùng simulation từ từng station → `O(n²)`.

---

## 10. Pattern recognition

Đây là greedy **candidate elimination**: một failure tại điểm `i` chứng minh cả một interval candidate không thể đúng, cho phép bỏ qua chúng trong một lần quét.
