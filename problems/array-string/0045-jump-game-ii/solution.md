# 45. Jump Game II — Solution

## 1. Core idea / Ý tưởng cốt lõi

Ta có thể nhìn bài này như **BFS trên các index**, nhưng không cần tạo queue.

- Những index reachable bằng `jumps` bước tạo thành current range.
- Khi quét hết current range, `farthest` cho biết biên của next range reachable bằng `jumps + 1` bước.
- Mỗi lần chạm `currentEnd`, ta kết thúc một BFS level và tăng `jumps`.

State:

```text
jumps      = số level đã dùng
currentEnd = biên phải của level hiện tại
farthest   = biên phải xa nhất của level kế tiếp
```

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

Không chỉ cần reachability như Jump Game I; phải tìm **minimum number of jumps**. Đề đảm bảo đích reachable, nên không cần xử lý trạng thái impossible trong canonical code.

---

## 3. Why the BFS-level view works

Từ tất cả index có thể đạt với `jumps` bước, mọi index mà chúng có thể nhảy tới tạo ra tập vị trí cho `jumps + 1` bước.

Vì jump có thể chọn bất kỳ độ dài từ `0` đến `nums[i]`, union của các khả năng này có thể tóm tắt bằng biên xa nhất `farthest`.

Ta quét lần lượt current range thay vì đưa từng index vào queue. Khi hết range, ta bắt buộc dùng thêm một jump nếu chưa tới đích.

---

## 4. Variables / Ý nghĩa biến

### `currentEnd`

Index cuối cùng reachable với số jump hiện tại.

### `farthest`

Trong khi duyệt current range:

```java
farthest = Math.max(farthest, i + nums[i]);
```

đây là index xa nhất mà **một jump nữa** có thể đưa tới.

### `jumps`

Khi:

```java
i == currentEnd
```

nghĩa là đã xét hết các lựa chọn của current level. Ta tăng `jumps` và chuyển level:

```java
jumps++;
currentEnd = farthest;
```

---

## 5. Alternative approaches / Các hướng khác

### Approach A — Dynamic programming

Có thể đặt `dp[i]` là minimum jumps tới `i` rồi thử transitions từ các vị trí trước.

Implementation trực tiếp có thể tốn `O(n²)`.

### Approach B — Explicit BFS

Xem mỗi index là node và mọi jump hợp lệ là edge. BFS tìm shortest path theo số edge, nhưng tạo/duyệt edges tường minh là dư thừa.

### Approach C — Greedy compressed BFS

Nén một BFS level thành interval và chỉ lưu hai biên. Đây là canonical solution `O(n)`/`O(1)`.

---

## 6. Optimal Java solution

```java
class Solution {
    public int jump(int[] nums) {
        int jumps = 0;

        // Ranh giới xa nhất có thể đạt được với số bước nhảy (jumps) hiện tại (tương đương BFS level hiện tại).
        int currentEnd = 0;

        // Trong khi duyệt vùng hiện tại, lưu vị trí xa nhất mà bước nhảy tiếp theo có thể vươn tới.
        int farthest = 0;

        // Chỉ duyệt đến nums.length - 2 vì nếu đã chạm đến phần tử cuối thì không cần nhảy thêm.
        for (int i = 0; i < nums.length - 1; i++) {
            // Cập nhật tầm vươn xa nhất từ bất kỳ điểm nào trong vùng hiện tại (Greedy choice).
            farthest = Math.max(farthest, i + nums[i]);

            // Khi i chạm currentEnd: đã xét hết mọi lựa chọn của bước nhảy hiện tại.
            // Bắt buộc phải thực hiện thêm 1 bước nhảy để mở rộng ranh giới sang farthest.
            if (i == currentEnd) {
                jumps++;
                currentEnd = farthest;
            }
        }

        return jumps;
    }
}
```

---

## 7. Why loop only to `n - 2`?

Index cuối là **đích**, không phải nơi ta cần khởi tạo một jump mới.

Nếu loop xử lý `i = n - 1` và `i == currentEnd`, code có thể tăng `jumps` thêm một lần sau khi đã đến đích.

Vì vậy:

```java
for (int i = 0; i < nums.length - 1; i++)
```

là biên tự nhiên.

---

## 8. Dry run

```text
nums = [2,3,1,1,4]
```

Ban đầu:

```text
jumps = 0
currentEnd = 0
farthest = 0
```

### i = 0

```text
farthest = 2
```

`i == currentEnd`, kết thúc level 0:

```text
jumps = 1
currentEnd = 2
```

### i = 1

```text
farthest = max(2, 1 + 3) = 4
```

### i = 2

Đã xét hết level hiện tại:

```text
jumps = 2
currentEnd = 4
```

Đích nằm trong range → kết quả `2`.

---

## 9. Correctness / Vì sao đúng

Mỗi current range chứa chính các index cần xét để tìm mọi vị trí có thể đạt sau **một jump bổ sung**. `farthest` là biên xa nhất của union đó.

Thuật toán chỉ tăng `jumps` sau khi đã xét tất cả index của current range, tức là chỉ chuyển sang level tiếp theo khi không còn lựa chọn nào với ít jump hơn chưa được xem xét. Đây chính là nguyên tắc shortest path của BFS.

Do đó lần đầu các range mở rộng đủ để chứa index cuối, số level đã dùng là minimum number of jumps.

---

## 10. Complexity

Mỗi index trước đích được quét đúng một lần:

```text
Time:  O(n)
Space: O(1)
```

---

## 11. Edge cases

- `n = 1`: đã ở đích, vòng lặp không chạy, trả `0`.
- Có thể tới đích trong một jump: `jumps = 1`.
- Nhiều jump độ dài 1: mỗi range chỉ mở rộng một index.
- Giá trị `0` trong mảng vẫn ổn vì đề đảm bảo toàn bộ input reachable.

---

## 12. Common mistakes

1. Tăng `jumps` ở mọi index thay vì khi hết current range.
2. Dùng `farthest` làm current range ngay sau mỗi index và mất ý nghĩa BFS level.
3. Loop tới `n - 1` rồi đếm dư một jump.
4. Chọn jump lớn nhất tại từng vị trí theo kiểu local choice; greedy đúng ở đây là chọn **farthest của toàn current range**.

---

## 13. Connection to Jump Game I

Jump Game I giữ một biên `farthest` để trả lời reachability.

Jump Game II thêm:

```text
currentEnd
jumps
```

để biết lúc nào một lớp reachable kết thúc. Đây là ví dụ rất tốt về cách một greedy reachability invariant được nâng cấp thành shortest-path-by-level.
