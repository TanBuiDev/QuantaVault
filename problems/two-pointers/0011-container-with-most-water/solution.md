# 11. Container With Most Water — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Diện tích giữa hai line là width * min(height[left],height[right]); chiều cao nhỏ hơn là bottleneck. Khi thu hẹp width, chỉ có thay line thấp hơn mới có cơ hội bù lại bằng height lớn hơn.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Thử mọi cặp là O(n²). Quan sát nếu left line thấp hơn, giữ left và move right vào chỉ giảm width trong khi min height vẫn không thể vượt left; các cặp đó không thể tốt hơn current, nên loại cả loạt bằng một move.

**State / invariant / data structure cần hiểu trước code.** left/right bao search interval chưa bị chứng minh vô ích. Mỗi bước cập nhật maxArea rồi move pointer của side thấp hơn; invariant là mọi cặp bị bỏ qua có upper bound không vượt candidate đã xét với bottleneck đó.

**Dry run mental theo implementation.** Dry run heights=[1,8,6,2,5,4,8,3,7]: cặp đầu bị height1 giới hạn nên move left; tại left=1,right=8 area=min(8,7)*7=49, một candidate lớn hình thành.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là move side cao hơn hoặc tối đa hóa height thay vì min height. Khi nào dùng: objective giữa hai boundary có width giảm dần và bị side yếu hơn giới hạn thường cho elimination two-pointer proof.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Với hai cạnh tại `left` và `right`:

```text
area = (right - left) * min(height[left], height[right])
```

Width giảm mỗi khi đưa một pointer vào trong. Vì vậy để có cơ hội bù lại việc mất width, ta phải cố tăng bottleneck height.

Nếu cạnh trái thấp hơn, mọi container vẫn dùng cạnh trái nhưng có `right` mới nằm bên trong đều có:

```text
newWidth < oldWidth
newHeight <= height[left]
```

nên không thể tốt hơn current area. Vì vậy ta loại cạnh thấp hơn.

---

## 2. Optimal Java solution

```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int best = 0;

        while (left < right) {
            int width = right - left;
            int containerHeight = Math.min(height[left], height[right]);
            best = Math.max(best, width * containerHeight);

            // Width chắc chắn giảm ở bước kế tiếp. Nếu giữ cạnh thấp hơn thì
            // bottleneck không thể tăng, nên mọi cặp còn lại dùng cạnh đó đều bị dominated.
            // Chỉ bỏ cạnh thấp hơn mới còn cơ hội tìm một bottleneck cao hơn.
            if (height[left] <= height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return best;
    }
}
```

Mỗi iteration loại đúng một endpoint không còn khả năng tạo area tốt hơn với các partner còn lại.

---

## 3. Why moving the shorter side is safe

Giả sử:

```text
height[left] <= height[right]
```

Current area là:

```text
A = (right-left) * height[left]
```

Nếu giữ `left` và chọn bất kỳ `r < right`:

```text
min(height[left], height[r]) <= height[left]
(r-left) < (right-left)
```

Do đó:

```text
newArea < = A
```

Tức là sau khi đã đánh giá cặp hiện tại, không cần xét thêm bất kỳ cặp nào vẫn dùng `left`. Ta có thể `left++` mà không bỏ qua optimum chưa xét.

Lập luận đối xứng khi cạnh phải thấp hơn.

---

## 4. Dry run

```text
height = [1,8,6,2,5,4,8,3,7]
```

Ban đầu:

```text
left=0 (1), right=8 (7)
area=8*1=8
```

Cạnh trái thấp hơn → `left++`.

```text
left=1 (8), right=8 (7)
area=7*7=49
```

Cạnh phải thấp hơn → `right--`.

Các bước sau không vượt `49`, nên đáp án là `49`.

---

## 5. Brute force

Thử mọi cặp `(i,j)`:

```text
for i
  for j > i
    area = (j-i) * min(height[i], height[j])
```

Có `O(n²)` cặp, không phù hợp khi `n` lên tới `10^5`.

---

## 6. Correctness / Vì sao đúng

Invariant: trước mỗi iteration, ít nhất một optimal pair chưa bị loại khỏi interval `[left,right]`, hoặc giá trị optimum đã được ghi vào `best`.

Sau khi đánh giá current pair, nếu `height[left] <= height[right]`, mọi pair khác dùng current `left` có width nhỏ hơn và height bị chặn bởi `height[left]`, nên area không thể lớn hơn current area đã ghi vào `best`. Loại `left` vì thế an toàn. Trường hợp còn lại đối xứng.

Khi pointers gặp nhau, mọi candidate cần thiết đã được đánh giá hoặc bị loại bằng lập luận an toàn, nên `best` là maximum area.

---

## 7. Complexity

Hai pointer chỉ đi vào trong và tổng cộng di chuyển tối đa `n-1` lần:

```text
Time: O(n)
Extra space: O(1)
```

---

## 8. Edge cases

- Chỉ có hai cột.
- Tất cả cột bằng nhau.
- Có cột cao `0`.
- Heights tăng hoặc giảm đơn điệu.
- Hai cột tạo optimum nằm xa nhau chứ không nhất thiết là hai cột cao nhất.

---

## 9. Common mistakes

1. Di chuyển cạnh cao hơn thay vì cạnh thấp hơn.
2. Chỉ tìm hai height lớn nhất và bỏ qua width.
3. Dùng brute force `O(n²)`.
4. Nhầm area thành tổng hai chiều cao.

---

## 10. Pattern recognition

Khi objective phụ thuộc vào khoảng cách giữa hai endpoint và một endpoint yếu hơn giới hạn kết quả, two pointers thường cho phép loại endpoint yếu hơn bằng dominance argument.
