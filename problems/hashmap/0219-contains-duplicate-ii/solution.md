# 219. Contains Duplicate II — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Ta cần hai equal values có distance <= k. Khi scan index i, chỉ cần biết occurrence gần nhất của nums[i]; occurrence cũ hơn luôn cho distance lớn hơn và không hữu ích hơn.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** So mọi pair O(n²). HashMap lastIndex nén history: nếu value từng thấy ở j và i-j<=k thì true; sau đó update lastIndex=value->i.

**State / invariant / data structure cần hiểu trước code.** Map lưu index gần nhất của mỗi value trong prefix. Invariant lastIndex[x] là occurrence lớn nhất < i, vì vậy nếu occurrence gần nhất còn quá xa thì mọi occurrence cũ cũng quá xa.

**Dry run mental theo implementation.** Dry run [1,2,3,1], k=3: khi i=3 gặp 1, map[1]=0 và distance3 đạt điều kiện. Với k=2, distance3 quá lớn rồi map[1] update thành3.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là giữ index đầu tiên thay vì gần nhất. Khi nào dùng: pair condition dựa trên distance trong stream thường chỉ cần most-recent occurrence hoặc sliding set size k.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Với mỗi value, để tìm duplicate gần nhất về phía trước, chỉ cần biết occurrence **gần nhất** đã thấy. Mọi occurrence cũ hơn luôn có khoảng cách lớn hơn.

## 2. Optimal Java solution

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> lastSeen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            Integer previous = lastSeen.get(nums[i]);

            // Chỉ latest occurrence cần giữ: nếu latest đã cách quá k thì mọi
            // occurrence cũ hơn còn xa hơn, nên không thể tạo pair hợp lệ với i.
            if (previous != null && i - previous <= k) {
                return true;
            }

            // Overwrite bằng index mới nhất để tối thiểu hóa distance cho các lần gặp sau.
            lastSeen.put(nums[i], i);
        }

        return false;
    }
}
```

## 3. Why keeping only the latest index is enough

Giả sử value `x` xuất hiện ở `p1 < p2 < i`. Nếu `i-p2 > k` thì `i-p1` còn lớn hơn, nên occurrence cũ không thể cứu được. Nếu có occurrence nào có thể thỏa khoảng cách, occurrence gần nhất là candidate tốt nhất.

Do đó ta có thể overwrite old index an toàn.

## 4. Correctness / Vì sao đúng

Khi xử lý index `i`, map chứa latest index của `nums[i]` trong prefix. Nếu distance tới latest occurrence `<=k`, ta tìm được pair hợp lệ. Nếu distance lớn hơn `k`, mọi occurrence cũ hơn còn xa hơn nên không pair nào kết thúc tại `i` hợp lệ. Update latest index bảo toàn invariant cho các index sau.

## 5. Complexity

```text
Time: O(n) average
Space: O(n)
```

## 6. Alternative sliding-window set

Có thể duy trì set chứa tối đa `k` phần tử gần nhất. Cũng `O(n)` average và `O(min(n,k))` space.

## 7. Common mistakes

- Chỉ detect duplicate mà quên distance constraint.
- Lưu first occurrence thay vì latest occurrence.
- Dùng `abs` không cần thiết khi scan trái→phải; previous luôn nhỏ hơn current.
- Quên `k=0` không thể có hai distinct indices với distance `0`.
