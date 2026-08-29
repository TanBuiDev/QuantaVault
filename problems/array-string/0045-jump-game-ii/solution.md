# 45. Jump Game II — Solution

## 1. Đừng bắt đầu bằng tên pattern: hãy nhìn “vùng có thể tới”

Với:

```text
nums = [2, 3, 1, 1, 4]
```

Từ index `0`, ta nhảy tối đa `2` bước, nên sau **1 jump** ta có thể đứng ở vùng:

```text
index 1 .. 2
```

Bây giờ chưa cần quyết định ngay “nhảy từ index 1 hay index 2”. Hãy hỏi câu khác:

> Trong toàn bộ những vị trí có thể tới bằng cùng số jump hiện tại, vị trí nào giúp lần nhảy kế tiếp vươn xa nhất?

- từ index `1`: tới tối đa `1 + nums[1] = 4`
- từ index `2`: tới tối đa `2 + nums[2] = 3`

Vì vậy sau jump tiếp theo ta có thể mở vùng reachable tới index `4`, tức đích.

Ta chỉ cần **2 jumps**.

---

## 2. Cách tự nhiên và bottleneck

Có thể coi mỗi index là một node; từ `i` có edge tới mọi index từ `i + 1` tới `i + nums[i]`. Vì mỗi edge là một jump, BFS sẽ tìm số edge ít nhất.

BFS đúng, nhưng nếu tạo mọi edge và dùng queue thì ta đang lưu nhiều thông tin hơn cần thiết.

Quan sát quan trọng là các index reachable với cùng số jump tạo thành một **vùng liên tiếp**. Khi đang quét hết vùng này, ta chỉ cần biết ranh giới xa nhất mà jump tiếp theo có thể mở ra.

Từ đó sinh ra ba state:

- `jumps`: số jump đã commit.
- `currentEnd`: index cuối cùng reachable với `jumps` hiện tại.
- `farthest`: xa nhất mà **bất kỳ index nào đã quét trong vùng hiện tại** có thể đưa ta tới ở jump tiếp theo.

Cách nhìn này tương đương quét từng level BFS, nhưng nén cả level thành hai boundary nên không cần queue.

---

## 3. Khi nào phải tăng `jumps`?

Trong khi `i < currentEnd`, ta vẫn đang xem các lựa chọn thuộc cùng một số jump hiện tại. Ta chưa cần commit jump mới; chỉ cập nhật:

```text
farthest = max(farthest, i + nums[i])
```

Khi:

```text
i == currentEnd
```

ta đã quét **hết mọi vị trí** reachable với số jump hiện tại. Muốn đi tiếp thì bắt buộc phải dùng thêm một jump:

```text
jumps++
currentEnd = farthest
```

Đây chính là greedy choice: không chọn một điểm nhảy cụ thể quá sớm; ta quét toàn bộ vùng hiện tại rồi giữ ranh giới tốt nhất mà vùng đó mở ra.

### Vì sao loop dừng ở `nums.length - 2`?

Index cuối là đích. Nếu đã tới được nó thì không cần đứng tại đích rồi “nhảy thêm”. Vì vậy code chỉ cần xét các index trước phần tử cuối.

---

## 4. Optimal Java solution

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

Block trên được giữ exact-sync với [`Solution.java`](Solution.java).

---

## 5. Dry run: `[2,3,1,1,4]`

Ban đầu:

```text
jumps = 0
currentEnd = 0
farthest = 0
```

| `i` | `nums[i]` | `farthest` sau update | `i == currentEnd`? | state sau bước |
|---:|---:|---:|:---:|---|
| 0 | 2 | 2 | ✓ | `jumps=1`, `currentEnd=2` |
| 1 | 3 | 4 | ✗ | vẫn đang quét vùng của jump 1 |
| 2 | 1 | 4 | ✓ | `jumps=2`, `currentEnd=4` |
| 3 | 1 | 4 | ✗ | loop kết thúc sau index này |

Hai lần chạm boundary tương ứng hai lần phải mở sang một vùng mới, nên đáp án là `2`.

Một cách hình dung:

```text
jump 0: [0]
         |
jump 1:    [1, 2]
              \____ farthest = 4
jump 2:              [3, 4]
```

---

## 6. Vì sao greedy này đúng?

Sau khi quét xong vùng `[... currentEnd]`, mọi index có thể đạt bằng `jumps` hiện tại đã được xét. Bất kỳ phương án nào dùng thêm một jump từ vùng đó cũng không thể vượt quá:

```text
max(i + nums[i]) = farthest
```

Do đó đặt boundary mới thành `farthest` không bỏ mất phương án nào tốt hơn: nó chính là union xa nhất của mọi lựa chọn thuộc level hiện tại.

Mỗi lần tăng `jumps` chỉ xảy ra khi đã xét hết level hiện tại, nên ta không dùng jump mới sớm hơn cần thiết. Vì các level được mở theo thứ tự số jump tăng dần, lần đầu boundary bao phủ đích chính là số jump tối thiểu.

---

## 7. Complexity

```text
Time:  O(n)
Space: O(1)
```

Mỗi index được quét một lần; ta không tạo graph hay queue.

---

## 8. Lỗi thường gặp

- Tăng `jumps` ở **mọi index**. Jump chỉ được commit khi `i == currentEnd`.
- Gán `currentEnd = i + nums[i]`. Ta phải dùng `farthest` của **toàn bộ vùng**, không chỉ reach của index cuối vùng.
- Duyệt tới index cuối rồi tăng thêm một jump không cần thiết.
- Chọn ngay index có `nums[i]` lớn nhất. Điều cần tối đa hóa là `i + nums[i]`, và còn quan trọng hơn là ta không cần commit một index cụ thể; chỉ cần boundary xa nhất.
- Nhầm với Jump Game I: bài 55 hỏi “có tới được không?”, bài này hỏi “ít jump nhất”.

---

## 9. Cách nhận ra pattern ở bài khác

Khi bài hỏi số bước ít nhất, mỗi bước có cùng cost và một bước mở ra nhiều trạng thái kế tiếp, hãy thử nghĩ theo **layers**.

Nếu các trạng thái trong cùng layer có thể được nén thành một interval/boundary liên tiếp, có thể ta không cần queue BFS thật. Hãy hỏi:

> “Tất cả lựa chọn của level hiện tại có thể được tóm tắt bằng ranh giới xa nhất nào?”

Sau khi mental model đó rõ, tên pattern mới là: **greedy theo BFS-level boundary**.
