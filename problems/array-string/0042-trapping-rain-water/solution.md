# 42. Trapping Rain Water — Solution

## 1. Core formula / Công thức cốt lõi

Tại index `i`, mặt nước tối đa bị giới hạn bởi cột cao nhất ở hai phía:

```text
level[i] = min(maxLeft, maxRight)
water[i] = max(0, level[i] - height[i])
```

Cách trực tiếp lưu `leftMax[]` và `rightMax[]` dùng `O(n)` space. Two-pointer nén hai mảng đó thành hai running maxima.

```text
Time: O(n)
Space: O(1)
```

---

## 2. Why the smaller side can be finalized

Giả sử:

```text
height[left] <= height[right]
```

Ta biết phía phải hiện có ít nhất một boundary cao bằng `height[right]`, tức là không thấp hơn `height[left]`. Nếu `height[left]` thấp hơn `leftMax`, mức nước tại `left` chắc chắn bị giới hạn bởi `leftMax`; phía phải đã đủ cao để không trở thành bottleneck thấp hơn.

Do đó lượng nước tại `left` được quyết định hoàn toàn:

```text
leftMax - height[left]
```

nếu dương. Ta có thể tăng `left` mà không cần biết chi tiết phần chưa quét bên phải.

Đối xứng khi `height[right] < height[left]`.

---

## 3. State / Trạng thái

```text
left, right  = hai biên chưa xử lý
leftMax      = cột cao nhất đã thấy từ trái
rightMax     = cột cao nhất đã thấy từ phải
water        = tổng nước đã xác định
```

Mỗi vòng chỉ finalize một vị trí, nên tổng số bước tuyến tính.

---

## 4. Alternative approaches / Các hướng khác

### Brute force

Với mỗi `i`, quét trái và phải tìm maxima:

```text
Time: O(n²)
Space: O(1)
```

### Prefix/suffix maxima

Precompute hai mảng:

```text
Time: O(n)
Space: O(n)
```

Dễ chứng minh và là bước đệm tốt trước two pointers.

### Monotonic stack

Khi gặp cột cao hơn, pop các đáy basin và tính water theo chiều rộng/chiều cao. `O(n)` time, `O(n)` space; hữu ích khi muốn tư duy theo basin ngang.

### Two pointers

Canonical solution: `O(n)` time, `O(1)` space.

---

## Optimal Java solution

```java
class Solution {
    public int trap(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int leftMax = 0;
        int rightMax = 0;
        int water = 0;

        while (left < right) {
            // Xử lý phía có boundary hiện tại thấp hơn: phía đối diện đã có một cột
            // ít nhất cao bằng nó, nên running max của phía này đủ để chốt lượng nước tại đây.
            if (height[left] <= height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    // leftMax là bottleneck đã được xác nhận cho vị trí left;
                    // phần chưa quét bên phải không thể làm lượng nước tại left giảm xuống.
                    water += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    // Đối xứng với phía trái: rightMax quyết định mức nước cuối cùng tại right.
                    water += rightMax - height[right];
                }
                right--;
            }
        }

        return water;
    }
}
```

---

## 5. Dry run ngắn

```text
height = [4,2,0,3,2,5]
```

Ở phía trái, right boundary `5` đủ cao nên lần lượt:

```text
leftMax = 4
index 1: +2
index 2: +4
index 3: +1
index 4: +2
```

Tổng `9`.

---

## 6. Correctness / Vì sao đúng

Invariant: `leftMax` và `rightMax` là maxima của các phần đã quét từ hai đầu. Khi xử lý phía thấp hơn, phía đối diện hiện tại cung cấp một boundary đủ cao để bảo đảm bottleneck của vị trí đó nằm ở running maximum của phía đang xử lý. Vì vậy lượng nước được cộng tại vị trí đó là giá trị cuối cùng, không cần sửa về sau.

Mỗi index được finalize đúng một lần và công thức tương đương `min(maxLeft,maxRight)-height[i]`, nên tổng cuối bằng chính lượng nước bị giữ.

---

## 7. Complexity

Hai pointer chỉ di chuyển vào trong:

```text
Time: O(n)
Space: O(1)
```

---

## 8. Edge cases

- Mảng tăng hoàn toàn hoặc giảm hoàn toàn → `0`.
- Chỉ một cột → `0`.
- Hai cột → `0`.
- Basin đối xứng `[3,0,3]` → `3`.
- Nhiều basin lồng nhau vẫn được xử lý từng vị trí.

---

## 9. Common mistakes

1. Dùng `max(leftMax,rightMax)` thay vì `min` trong công thức nước.
2. Di chuyển pointer phía cao hơn mà không có invariant rõ ràng.
3. Update max sai thứ tự rồi cộng nước âm.
4. Nghĩ hai pointer chỉ dựa trên `leftMax/rightMax`; điều kiện chọn phía phải gắn với boundary hiện tại.

---

## 10. Pattern recognition

Khi giá trị tại mỗi index phụ thuộc vào extrema từ **cả hai phía**, hãy nghĩ tới prefix/suffix trước; nếu chỉ cần quyết định một phía khi boundary đối diện đủ mạnh, có thể nén thành two pointers.
