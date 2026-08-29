# 238. Product of Array Except Self — Solution

## 1. Bắt đầu từ đúng một vị trí

Với:

```text
nums = [2, 3, 4, 5]
```

Ở `i = 2`, ta phải tạo kết quả bằng tích của mọi phần tử **trừ `nums[2] = 4`**:

```text
answer[2] = 2 × 3 × 5
```

Thay vì nghĩ “làm sao nhân tất cả rồi chia cho `4`?”, hãy nhóm những phần tử hợp lệ thành hai phía:

```text
bên trái i : 2 × 3
bên phải i : 5

answer[2] = leftProduct × rightProduct
```

Ý tưởng này hoạt động cho mọi index:

```text
answer[i]
= product(nums[0 ... i-1])
× product(nums[i+1 ... n-1])
```

Đây là nguồn gốc của `prefix` và `suffix`; không cần học thuộc tên pattern trước.

---

## 2. Vì sao không dùng những cách dễ nghĩ đầu tiên?

### Thử nhân lại cho từng index

Với mỗi `i`, duyệt cả mảng và bỏ qua `i`:

```text
Time: O(n²)
```

Ta đang tính lại rất nhiều tích giống nhau.

### Tích toàn bộ rồi chia

Nếu không có `0`, ta có thể nghĩ:

```text
totalProduct / nums[i]
```

Nhưng đề không cho dùng phép chia, và số `0` còn làm cách nghĩ này rắc rối hơn.

### Lưu hai mảng prefix/suffix

Ta có thể lưu:

```text
left[i]  = tích bên trái i
right[i] = tích bên phải i
```

Cách này đạt `O(n)` time nhưng dùng `O(n)` extra space ngoài output.

Ta có thể tốt hơn vì chính `answer` có thể tạm giữ prefix products.

---

## 3. Pass trái: `answer[i]` tạm lưu tích bên trái

Ban đầu:

```text
prefix = 1
```

Tại index `i`, **trước khi nhân `nums[i]`**, `prefix` chỉ chứa các phần tử nằm bên trái `i`.

Do đó thứ tự phải là:

```text
answer[i] = prefix
prefix *= nums[i]
```

Ví dụ với `[2,3,4,5]`:

| `i` | `prefix` trước gán | `answer[i]` | `prefix` sau nhân |
|---:|---:|---:|---:|
| 0 | 1 | 1 | 2 |
| 1 | 2 | 2 | 6 |
| 2 | 6 | 6 | 24 |
| 3 | 24 | 24 | 120 |

Sau pass đầu:

```text
answer = [1, 2, 6, 24]
```

Mỗi ô đang chứa đúng tích của các số nằm bên trái nó.

---

## 4. Pass phải: nhân thêm tích bên phải

Ta đi ngược lại với:

```text
suffix = 1
```

Tại `i`, trước khi nhân `nums[i]`, `suffix` chỉ chứa các phần tử nằm bên phải `i`.

Vì `answer[i]` đã chứa left product:

```text
answer[i] *= suffix
```

sẽ tạo:

```text
left product × right product
```

rồi mới cập nhật:

```text
suffix *= nums[i]
```

Điểm khó nhất của bài chính là **update order**: cả `prefix` lẫn `suffix` phải được dùng trước khi đưa `nums[i]` vào state, vì phần tử tại `i` phải bị loại khỏi kết quả của chính nó.

---

## 5. Optimal Java solution

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        int prefix = 1;
        for (int i = 0; i < n; i++) {
            // Gán trước khi nhân nums[i] để answer[i] chỉ chứa tích bên trái,
            // tuyệt đối không vô tình đưa chính phần tử i vào kết quả của nó.
            answer[i] = prefix;
            prefix *= nums[i];
        }

        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            // suffix lúc này chỉ chứa các phần tử bên phải i; nhân nó với prefix
            // đã lưu trong answer[i] tạo đúng tích của mọi phần tử trừ nums[i].
            answer[i] *= suffix;
            suffix *= nums[i];
        }

        return answer;
    }
}
```

Block trên được giữ exact-sync với [`Solution.java`](Solution.java).

---

## 6. Dry run hoàn chỉnh

Tiếp tục với:

```text
nums   = [2, 3, 4, 5]
answer = [1, 2, 6, 24]   // sau prefix pass
```

Suffix pass:

| `i` | `suffix` trước nhân | `answer[i]` trước | `answer[i]` sau `*= suffix` | `suffix` sau `*= nums[i]` |
|---:|---:|---:|---:|---:|
| 3 | 1 | 24 | 24 | 5 |
| 2 | 5 | 6 | 30 | 20 |
| 1 | 20 | 2 | 40 | 60 |
| 0 | 60 | 1 | 60 | 120 |

Kết quả:

```text
[60, 40, 30, 24]
```

Ví dụ có `0` cũng tự nhiên hoạt động. Với `[1,2,0,4]`, prefix/suffix chỉ nhân những phần tử ở hai phía; không có phép chia nên không cần special case cho zero.

---

## 7. Vì sao thuật toán đúng?

Sau pass trái, invariant là:

```text
answer[i] = product của nums[0 ... i-1]
```

Trong pass phải, ngay trước khi xử lý `i`:

```text
suffix = product của nums[i+1 ... n-1]
```

Vì vậy dòng:

```text
answer[i] *= suffix
```

biến `answer[i]` thành:

```text
product(left of i) × product(right of i)
```

chính xác là tích của mọi phần tử ngoại trừ `nums[i]`.

Sau đó mới nhân `nums[i]` vào `suffix` để chuẩn bị cho index bên trái kế tiếp. Hai invariant giữ đúng ở mọi bước, nên mọi ô output đều đúng.

---

## 8. Complexity

```text
Time:  O(n) — hai pass tuyến tính
Space: O(1) — nếu không tính mảng output theo quy ước của đề
```

`answer` là output bắt buộc; ngoài nó chỉ có `prefix`, `suffix`, `n`, `i`.

---

## 9. Lỗi thường gặp

- Viết `prefix *= nums[i]` **trước** `answer[i] = prefix`: lúc đó kết quả tại `i` đã chứa chính `nums[i]`.
- Tương tự, update `suffix` trước khi nhân vào `answer[i]` cũng đưa `nums[i]` vào kết quả.
- Dùng division rồi cố patch riêng trường hợp zero; vừa trái constraint vừa phức tạp không cần thiết.
- Tạo cả `left[]` và `right[]` dù output array có thể tái sử dụng để lưu prefix.
- Hiểu `prefix` là “tích đến i”. Trong thời điểm được gán cho `answer[i]`, nó phải có nghĩa chính xác là “tích **trước i**”.

---

## 10. Cách nhận ra pattern ở bài khác

Khi output tại `i` phụ thuộc vào “mọi thứ trước `i`” và “mọi thứ sau `i`”, hãy thử tách thành:

```text
left contribution ×/+/combine right contribution
```

Sau đó hỏi tiếp:

> Có cần lưu toàn bộ prefix/suffix arrays, hay một phía có thể ghi thẳng vào output và phía còn lại được giữ bằng một running variable?

Đó là cách suy ra prefix/suffix optimization thay vì học thuộc công thức.
