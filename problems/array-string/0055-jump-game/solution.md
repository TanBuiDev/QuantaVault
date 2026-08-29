# 55. Jump Game — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Với [2,3,1,1,4], từ index 0 ta có thể tới 1 hoặc 2; điều quan trọng không phải chọn path cụ thể mà là theo dõi ranh giới xa nhất reachable sau khi quét các index đã tới được.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DFS/BFS thử nhiều path tạo bottleneck lặp state. Quan sát nếu i đã nằm trong vùng reachable, mọi reach i+nums[i] có thể mở rộng cùng một boundary farthest; nếu i vượt boundary thì không path nào tới i được.

**State / invariant / data structure cần hiểu trước code.** farthest là index lớn nhất reachable từ mọi vị trí đã xử lý. Invariant: trước khi xử lý i, nếu i <= farthest thì i thật sự reachable; sau update farthest bao phủ mọi jump từ prefix reachable.

**Dry run mental theo implementation.** Dry run [3,2,1,0,4]: farthest lần lượt 3,3,3,3; tới i=4 thì 4>3 nên thất bại. Với [2,3,1,1,4], tại i=1 farthest mở tới 4 và đủ tới đích.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là greedy chọn index có nums[i] lớn nhất thay vì theo reach i+nums[i]. Khi nào dùng: reachability một chiều với các interval mở rộng liên tục thường nén được thành một farthest boundary.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
        // Vị trí chỉ số xa nhất có thể tiếp cận được tính từ tất cả các điểm xuất phát hợp lệ đã duyệt.
        int farthest = 0;

        for (int i = 0; i < nums.length; i++) {
            // Nếu chỉ số hiện tại i vượt quá tầm với xa nhất, nghĩa là ta không thể bước tới điểm này (bị kẹt).
            if (i > farthest) {
                return false;
            }

            // Greedy choice: Mở rộng tầm vươn xa nhất có thể đạt được từ vị trí i.
            farthest = Math.max(farthest, i + nums[i]);

            // Tối ưu sớm (Early exit): Nếu tầm với đã chạm hoặc vượt qua điểm cuối cùng, chắc chắn thành công.
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
