# 15. 3Sum — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** 3Sum có thể cố định một số a rồi biến phần còn lại thành bài two-sum target=-a. Sorting giúp vừa dùng two pointers vừa bỏ duplicate có hệ thống.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Ba vòng lặp O(n³) là bottleneck. Sau sort, với mỗi i, sum của left/right thay đổi monotonic: sum nhỏ thì tăng left, lớn thì giảm right, đưa xuống O(n²).

**State / invariant / data structure cần hiểu trước code.** i cố định phần tử đầu; left/right tìm cặp trên suffix. Invariant theo sort: tăng left không làm sum giảm và giảm right không làm sum tăng. Sau khi tìm triplet, skip các value duplicate để output unique.

**Dry run mental theo implementation.** Dry run [-1,0,1,2,-1,-4] sort -> [-4,-1,-1,0,1,2]. Với i=-1, left=-1,right=2 cho sum0 -> [-1,-1,2], rồi skip duplicate; tiếp [ -1,0,1 ].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là không sort/skip duplicate hoặc reuse i trong pair. Khi nào dùng: k-sum thường giảm một dimension bằng cách fix một phần tử; 3Sum sau sort trở thành 2Sum two-pointers.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Brute force thử mọi bộ ba là `O(n³)`. Ta giảm một chiều bằng cách sort và fix phần tử đầu tiên.

Sau khi sort:

```text
nums[i] <= nums[left] <= nums[right]
```

Với mỗi `i`, cần tìm:

```text
nums[left] + nums[right] = -nums[i]
```

Đây chính là Two Sum trên một sorted suffix, nên dùng two pointers.

---

## 2. Algorithm

1. Sort `nums`.
2. Lặp `i` từ `0` tới `n-3`.
3. Nếu `i > 0` và `nums[i] == nums[i-1]`, skip duplicate anchor.
4. Nếu `nums[i] > 0`, break vì các phần tử sau đều không âm và không thể tạo tổng `0`.
5. Đặt `left=i+1`, `right=n-1`.
6. Tính sum:
   - `< 0` → `left++`.
   - `> 0` → `right--`.
   - `== 0` → lưu triplet, di chuyển cả hai pointer và skip duplicate values.

---

## 3. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Sorting tạo monotonic order để mỗi lần dịch left/right có thể loại
        // cả một vùng pair candidate thay vì thử mọi bộ ba O(n^3).
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            // Cùng một anchor value sẽ sinh lại cùng các value-triplet đã xét.
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            // Sau sort, nếu anchor đã dương thì cả hai số phía sau đều >= anchor,
            // nên tổng không thể quay về 0; có thể dừng toàn bộ search.
            if (nums[i] > 0) {
                break;
            }

            int left = i + 1;
            int right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];

                // Tổng quá nhỏ: giảm right chỉ làm tổng nhỏ hơn nữa;
                // chỉ tăng left mới có thể tiến gần 0.
                if (sum < 0) {
                    left++;
                } else if (sum > 0) {
                    // Đối xứng, tổng quá lớn thì phải giảm right.
                    right--;
                } else {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    left++;
                    right--;

                    // Sau khi đã lưu một triplet, các giá trị trùng liên tiếp ở hai đầu
                    // chỉ tạo lại đúng value-triplet đó nên có thể bỏ qua an toàn.
                    while (left < right && nums[left] == nums[left - 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right + 1]) {
                        right--;
                    }
                }
            }
        }

        return result;
    }
}
```

---

## 4. Why pointer movement is correct

Array đã sorted. Với fixed `i`:

- Nếu sum `< 0`, giảm `right` chỉ làm tổng nhỏ hơn hoặc bằng; muốn tăng tổng phải tăng `left`.
- Nếu sum `> 0`, tăng `left` chỉ làm tổng lớn hơn hoặc bằng; muốn giảm tổng phải giảm `right`.

Vì vậy mỗi move loại một vùng pair không thể tạo `0`.

---

## 5. Duplicate handling

Có hai tầng duplicate:

### Duplicate anchor

Nếu cùng một value được dùng lại làm `nums[i]`, toàn bộ search space phía sau tương đương hoặc nhỏ hơn search đã thực hiện với anchor trước đó. Skip nó để tránh sinh lại triplet.

### Duplicate pair values

Sau khi tìm một triplet, nếu next `left` có cùng value với previous `left`, hoặc next `right` giống previous `right`, kết quả value-triplet sẽ lặp. Ta bỏ qua các bản sao liên tiếp.

---

## 6. Dry run

```text
nums = [-1,0,1,2,-1,-4]
```

Sau sort:

```text
[-4,-1,-1,0,1,2]
```

- `i=0`, anchor `-4`: không có pair tạo `4`.
- `i=1`, anchor `-1`:
  - `left=-1`, `right=2` → sum `0` → `[-1,-1,2]`.
  - tiếp tục → `left=0`, `right=1` → sum `0` → `[-1,0,1]`.
- `i=2` cũng là `-1` → skip duplicate anchor.
- `i=3` là `0`; phần còn lại dương nên không có thêm triplet.

---

## 7. Correctness / Vì sao đúng

Với mỗi distinct anchor `nums[i]`, two pointers duyệt đầy đủ mọi pair candidate trong sorted suffix bằng monotonic elimination: khi tổng thấp, mọi pair dùng current left với right nhỏ hơn cũng quá thấp; khi tổng cao, mọi pair dùng current right với left lớn hơn cũng quá cao. Vì thế không bỏ sót pair tạo `-nums[i]`.

Mọi triplet hợp lệ có một phần tử nhỏ nhất; khi vòng lặp đến distinct value đó làm anchor, pair còn lại nằm trong suffix và sẽ được tìm thấy. Duplicate skipping chỉ bỏ các anchor/pair có cùng giá trị đã tạo cùng value-triplet, nên không xóa triplet phân biệt.

---

## 8. Complexity

Sort:

```text
O(n log n)
```

Mỗi anchor chạy two pointers `O(n)`, tổng:

```text
Time: O(n²)
```

Auxiliary space phụ thuộc implementation sort; không tính output list.

---

## 9. Edge cases

- `[0,0,0]` → chỉ một triplet.
- Tất cả số dương → empty.
- Tất cả số âm → empty.
- Nhiều duplicate như `[-2,0,0,2,2]`.
- Có nhiều triplet dùng cùng anchor value nhưng pair khác nhau.

---

## 10. Common mistakes

1. Dùng `Set<List<Integer>>` để chữa duplicate thay vì kiểm soát duplicate trong traversal.
2. Quên skip duplicate `i`.
3. Sau khi tìm triplet chỉ move một pointer.
4. Skip duplicate trước khi move pointer, dễ truy cập sai vị trí.
5. Quên sort trước khi áp dụng directional pointer movement.
