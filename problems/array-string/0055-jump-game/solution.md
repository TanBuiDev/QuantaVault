# 55. Jump Game — Solution

## 1. Core idea / Ý tưởng cốt lõi

Ta không cần mô phỏng một đường nhảy cụ thể. Với mọi index đã duyệt, chỉ cần giữ:

```text
farthest = index xa nhất có thể tới được
```

Nếu `i <= farthest`, index `i` reachable, nên nó có thể mở rộng vùng reachable tới:

```text
i + nums[i]
```

Nếu `i > farthest`, ta không thể đứng ở `i`; vì vậy không thể dùng `nums[i]` để mở rộng tiếp và đáp án là `false`.

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

Mỗi `nums[i]` là **maximum jump length**, nghĩa là từ `i` có thể nhảy từ `0` đến `nums[i]` bước về phía trước. Chỉ cần xác định có tồn tại một đường đi tới index cuối hay không.

---

## 3. Why greedy is enough

Tại index `i`, điều quan trọng không phải “ta đã nhảy tới `i` bằng cách nào”, mà là:

```text
có thể tới i hay không?
```

Nếu có, mọi vị trí đến `i + nums[i]` đều trở thành ứng viên reachable. Khi nhiều index mở rộng vùng reachable, ta chỉ cần giữ biên phải lớn nhất.

Thông tin về đường đi cụ thể không ảnh hưởng tới các bước sau, nên một biến `farthest` tóm tắt đủ trạng thái.

---

## 4. Alternative approaches / Các hướng khác

### Approach A — Backtracking

Thử mọi độ dài nhảy từ mỗi vị trí. Số nhánh có thể tăng rất nhanh, không phù hợp constraints.

### Approach B — Dynamic Programming

Có thể tạo `reachable[i]` và đánh dấu index nào tới được.

```text
Time:  O(n²) trong implementation trực tiếp
Space: O(n)
```

Có thể tối ưu, nhưng greedy cho insight mạnh hơn.

### Approach C — Greedy farthest reach

Duyệt một lần và giữ biên reachable xa nhất:

```text
Time:  O(n)
Space: O(1)
```

---

## 5. Optimal Java solution

```java
class Solution {
    public boolean canJump(int[] nums) {
        int farthest = 0;

        for (int i = 0; i < nums.length; i++) {
            if (i > farthest) {
                return false;
            }

            farthest = Math.max(farthest, i + nums[i]);
            if (farthest >= nums.length - 1) {
                return true;
            }
        }

        return true;
    }
}
```

---

## 6. Invariant / Bất biến

Trước khi xử lý index `i`:

```text
farthest = index lớn nhất có thể tới bằng cách sử dụng các vị trí đã xử lý trước đó
```

Nếu `i > farthest`, không có đường nào từ prefix đã xét tới `i`. Vì mọi bước nhảy chỉ đi về phía trước, không có index chưa xét nào có thể cứu `i`; ta trả `false`.

Nếu `i <= farthest`, ta có thể đứng ở `i`, nên cập nhật:

```text
farthest = max(farthest, i + nums[i])
```

Invariant tiếp tục đúng.

---

## 7. Dry run

### Reachable case

```text
nums = [2,3,1,1,4]
```

| i | nums[i] | farthest before | farthest after |
|---|---:|---:|---:|
| 0 | 2 | 0 | 2 |
| 1 | 3 | 2 | 4 |

Ngay tại `i = 1`, `farthest = 4`, bằng index cuối → `true`.

### Blocked case

```text
nums = [3,2,1,0,4]
```

Sau khi xử lý index `0..3`, `farthest = 3`. Khi `i = 4`:

```text
4 > 3
```

nên không thể tới index `4` → `false`.

---

## 8. Correctness / Vì sao đúng

Thuật toán chỉ xử lý một index khi index đó nằm trong vùng reachable. Mỗi lần xử lý, nó mở rộng `farthest` tới tất cả vị trí mới mà index đó có thể chạm tới. Vì vậy sau mỗi bước, `farthest` chính xác là biên phải xa nhất reachable từ các index đã xét.

Nếu biên này chạm index cuối, tồn tại một đường nhảy tới đích. Nếu vòng lặp gặp một index nằm ngoài biên, không index nào phía trước nó reachable để mở rộng qua khoảng trống đó. Do jump chỉ đi về phía trước, đích không thể đạt được. Thuật toán vì thế trả đúng.

---

## 9. Complexity

```text
Time:  O(n)
Space: O(1)
```

---

## 10. Edge cases

- `n = 1`: đã đứng ở đích → `true`.
- `nums[0] = 0` với `n > 1`: bị chặn ngay.
- Một jump lớn ở đầu có thể chạm đích trực tiếp.
- Nhiều số `0` không phải lúc nào cũng làm thất bại; chỉ thất bại khi `farthest` không vượt qua được chúng.

---

## 11. Common mistakes

1. Nghĩ `nums[i]` là độ dài bắt buộc thay vì tối đa.
2. Cập nhật `farthest` từ một index không reachable.
3. Chỉ kiểm tra từng `0` và kết luận sai.
4. Dùng backtracking/DP phức tạp mà bỏ qua greedy invariant.

---

## 12. Pattern recognition

Khi bài hỏi “có thể đi tới đích hay không” và mỗi vị trí mở rộng một interval về bên phải, hãy nghĩ tới **farthest reachable boundary**.
