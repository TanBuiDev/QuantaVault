# 4. Median of Two Sorted Arrays — Solution

## 1. Median thực sự cần điều gì?

Nếu ghép và sort hai mảng, median chỉ phụ thuộc vào **điểm chia giữa nửa trái và nửa phải**.

Ví dụ:

```text
A = [1, 3]
B = [2]

merged = [1, 2, 3]
              ^ median
```

Cách dễ nhất là merge hai mảng rồi lấy giữa, nhưng sẽ tốn `O(m+n)` time/space. Constraint của bài yêu cầu `O(log(m+n))`, nên ta không được đi qua toàn bộ dữ liệu.

Hai mảng đã sorted. Thay vì tìm từng phần tử của merged array, ta tìm **hai vạch cắt** sao cho:

```text
mọi phần tử ở combined-left <= mọi phần tử ở combined-right
```

và combined-left chứa đúng số phần tử cần nằm trước median.

Khi hai điều đó đúng, median nằm ngay tại biên partition; không cần merge.

---

## 2. Hai partition phải phối hợp với nhau

Giả sử cắt `nums1` sau `i` phần tử và `nums2` sau `j` phần tử:

```text
nums1: [ ... leftA | rightA ... ]
                  i^
nums2: [ ... leftB | rightB ... ]
                  j^
```

Ta muốn kích thước combined-left cố định:

```text
i + j = half
```

nên khi chọn `i`, `j` không còn tự do:

```text
j = half - i
```

Đó là insight biến bài toán “hai vạch cắt” thành **một search variable `i`**.

Ta binary-search `i` trên mảng ngắn hơn để range nhỏ nhất và để `j` luôn nằm trong bounds hợp lệ.

---

## 3. Khi nào partition đúng?

Vì từng mảng riêng đã sorted, bên trong mỗi mảng ta đã có:

```text
leftA <= rightA
leftB <= rightB
```

Chỉ còn cần kiểm tra hai cặp “chéo”:

```text
leftA <= rightB
leftB <= rightA
```

Nếu cả hai đúng, mọi phần tử combined-left đều <= mọi phần tử combined-right.

### Nếu `leftA > rightB`

Ta đã lấy quá nhiều phần tử từ A sang bên trái. Cần giảm `i`:

```text
right = i - 1
```

### Nếu `leftB > rightA`

Ta lấy quá ít từ A, tức quá nhiều từ B. Cần tăng `i`:

```text
left = i + 1
```

Đây chính là monotonic property để binary search hoạt động: dấu hiệu vi phạm cho biết chắc chắn phải dịch partition A sang trái hay phải.

---

## 4. Boundary partitions và sentinel

Partition có thể nằm trước phần tử đầu hoặc sau phần tử cuối.

Ví dụ `i = 0` nghĩa là bên trái A rỗng. Ta muốn phép so sánh vẫn dùng cùng công thức, nên coi:

```text
leftA = -∞
```

Nếu `i = m`, bên phải A rỗng:

```text
rightA = +∞
```

Trong Java dùng:

```java
Integer.MIN_VALUE
Integer.MAX_VALUE
```

làm sentinel. Nhờ đó không cần viết bốn nhánh special-case riêng cho boundary.

---

## 5. Vì sao `half = (m+n+1)/2`?

Ta cố ý để combined-left nhận thêm một phần tử khi tổng độ dài lẻ.

Ví dụ total = 5:

```text
left side  = 3 elements
right side = 2 elements
```

Khi partition đúng, median lẻ chính là:

```text
max(leftA, leftB)
```

Nếu total chẵn, median là trung bình của hai boundary gần giữa nhất:

```text
(max left + min right) / 2
```

---

## 6. Optimal Java solution

```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Binary-search the shorter array so partition i always ranges over
        // [0, min(m,n)], giving O(log min(m,n)) and keeping j within valid bounds.
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.length, n = nums2.length;
        int left = 0, right = m;

        // The left partition receives one extra element when total length is odd,
        // so its maximum is directly the odd-length median.
        int half = (m + n + 1) / 2;

        while (left <= right) {
            int i = left + (right - left) / 2;
            int j = half - i;

            // Sentinels make partitions at array boundaries obey the same comparisons
            // as interior partitions without separate empty-side cases.
            int leftA = i == 0 ? Integer.MIN_VALUE : nums1[i - 1];
            int rightA = i == m ? Integer.MAX_VALUE : nums1[i];
            int leftB = j == 0 ? Integer.MIN_VALUE : nums2[j - 1];
            int rightB = j == n ? Integer.MAX_VALUE : nums2[j];

            // A partition is correct iff every value on the combined left side is
            // <= every value on the combined right side; these two cross-checks suffice.
            if (leftA <= rightB && leftB <= rightA) {
                int maxLeft = Math.max(leftA, leftB);
                if (((m + n) & 1) == 1) return maxLeft;

                int minRight = Math.min(rightA, rightB);
                // Cast before addition so two large int endpoints cannot overflow.
                return ((long) maxLeft + minRight) / 2.0;
            }

            // leftA too large means i took too many elements from A; otherwise
            // leftB > rightA means i must move right and take more from A.
            if (leftA > rightB) right = i - 1;
            else left = i + 1;
        }

        throw new IllegalArgumentException("Inputs must be sorted");
    }
}
```

Block trên được giữ exact-sync với [`Solution.java`](Solution.java).

---

## 7. Dry run: `A=[1,3]`, `B=[2]`

Code trước tiên swap để binary-search mảng ngắn:

```text
nums1 = [2]      m=1
nums2 = [1,3]    n=2
half = (1+2+1)/2 = 2
left=0, right=1
```

### Lần 1

```text
i = 0
j = 2

leftA  = -∞
rightA = 2
leftB  = 3
rightB = +∞
```

Check:

```text
leftA <= rightB   ✓
leftB <= rightA   3 <= 2 ✗
```

Ta lấy quá ít từ A, nên:

```text
left = i + 1 = 1
```

### Lần 2

```text
i = 1
j = 1

leftA  = 2
rightA = +∞
leftB  = 1
rightB = 3
```

Hai cross-check đều đúng.

Total length lẻ, nên:

```text
median = max(leftA, leftB)
       = max(2,1)
       = 2
```

---

## 8. Vì sao thuật toán đúng?

Ta luôn giữ `i + j = half`, nên chỉ cần tìm partition thỏa ordering.

Nếu `leftA > rightB`, bất kỳ `i' >= i` nào còn lấy ít nhất từng ấy phần tử từ A, nên không thể sửa vi phạm bằng cách đi phải; phải giảm `i`. Tương tự, nếu `leftB > rightA`, phải tăng `i`.

Vì vậy binary search không loại bỏ partition đúng.

Khi hai cross-check cùng đúng, toàn bộ combined-left <= combined-right và kích thước hai phía đã đúng. Median theo định nghĩa chính là maximum bên trái (odd) hoặc trung bình giữa maximum bên trái và minimum bên phải (even).

---

## 9. Complexity

Gọi `m` là độ dài mảng ngắn hơn:

```text
Time:  O(log min(m,n))
Space: O(1)
```

Recursive call đầu chỉ swap references một lần, không tạo mảng mới.

---

## 10. Lỗi thường gặp

- Binary-search mảng dài hơn rồi để `j` vượt bounds.
- Dùng `(m+n)/2` mà không xử lý cẩn thận trường hợp odd; `+1` giúp left side luôn chứa median khi odd.
- Chỉ check `leftA <= rightA` và `leftB <= rightB`; hai điều đó luôn đúng vì input sorted. Phải check **chéo**.
- Khi `leftA > rightB` lại tăng `i`; hướng move bị ngược.
- Quên boundary `i=0`, `i=m`, `j=0`, `j=n`.
- Cộng hai `int` lớn trước khi cast khi tính median chẵn; implementation cast `maxLeft` sang `long` trước phép cộng.

---

## 11. Cách nhận ra binary search kiểu này

Binary search không chỉ dùng để “tìm một số trong sorted array”. Nó dùng được khi:

1. có một **search space** có thứ tự — ở đây là số phần tử lấy từ mảng A;
2. có một **condition monotonic** cho biết candidate đang quá trái hay quá phải;
3. từ candidate ta kiểm tra được tính hợp lệ mà không duyệt toàn bộ input.

Câu hỏi nên đặt là:

> “Mình có thể chọn một partition/boundary, và khi boundary sai thì dấu hiệu sai có cho biết chắc chắn phải đi về một phía không?”
