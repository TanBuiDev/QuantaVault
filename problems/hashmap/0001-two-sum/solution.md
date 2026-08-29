# 1. Two Sum — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Với nums=[2,7,11,15], target=9, khi đang nhìn số 7 ta chỉ cần biết số còn thiếu là 2 đã xuất hiện ở index nào trước đó; không cần thử lại mọi cặp.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Hai vòng lặp là cách tự nhiên nhưng bottleneck O(n²). Quan sát mỗi value x xác định duy nhất complement target-x; HashMap cho phép hỏi complement đã thấy chưa trong average O(1).

**State / invariant / data structure cần hiểu trước code.** Map lưu value -> index của phần tử đã quét. Invariant: trước khi xử lý nums[i], map chỉ chứa indices < i, nên khi tìm complement ta luôn tạo hai index khác nhau và đúng thứ tự quét.

**Dry run mental theo implementation.** Dry run [2,7,11,15]: i=0 complement=7 chưa có, lưu 2->0; i=1 complement=2 có index0 nên trả [0,1]. Việc lookup trước put tránh dùng cùng phần tử hai lần khi target=2*x.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là put trước rồi match chính nums[i], hoặc lưu complement/value lẫn lộn. Khi nào dùng: bài tìm pair theo phương trình a+b=target thường đổi thành lookup một complement trong set/map.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Brute force thử mọi pair tốn `O(n²)`. Ta đổi bài toán từ “tìm hai số” thành “với current number, complement cần thiết đã xuất hiện chưa?”.

```text
complement = target - nums[i]
```

Hash map lưu các value đã thấy cùng index của chúng.

---

## 2. Optimal Java solution

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            // Lookup trước insert để map chỉ chứa các index < i; nhờ đó nếu tìm thấy
            // complement thì hai phần tử chắc chắn khác index, kể cả khi nums[i] == complement.
            Integer partnerIndex = seen.get(complement);
            if (partnerIndex != null) {
                return new int[]{partnerIndex, i};
            }

            // Current value chỉ trở thành candidate cho các phần tử phía sau.
            // Overwrite duplicate là an toàn vì đề chỉ cần một pair và index mới vẫn hợp lệ.
            seen.put(nums[i], i);
        }

        throw new IllegalStateException("No solution");
    }
}
```

---

## 3. Why lookup before insert matters

Ví dụ current value là `3` và target là `6`. Nếu insert current `3` trước rồi lookup complement `3`, code có thể tìm chính current index và vi phạm “may not use the same element twice”.

Lookup trước chỉ nhìn thấy các index **strictly trước `i`**, nên hai index luôn khác nhau.

Case `[3,3]` vẫn hoạt động: `3` đầu tiên được insert; khi tới `3` thứ hai, complement `3` đã có ở index `0`.

---

## 4. Correctness / Vì sao đúng

Invariant: trước iteration `i`, map chứa một index cho mỗi value đã xuất hiện trong prefix `0..i-1`.

Nếu complement của `nums[i]` nằm trong map, pair đó có hai index khác nhau và tổng đúng target nên là lời giải. Nếu chưa có, current value được thêm để phục vụ các phần tử tương lai. Với lời giải duy nhất `(j,i)` và `j<i`, khi scan tới `i`, `nums[j]` đã nằm trong map nên pair chắc chắn được tìm thấy.

---

## 5. Complexity

```text
Time: O(n) average
Space: O(n)
```

Mỗi element có một lookup và một insert hash-map trung bình `O(1)`.

---

## 6. Common mistakes

- Brute force `O(n²)` khi follow-up muốn nhanh hơn.
- Insert current value trước lookup và vô tình dùng cùng index hai lần.
- Lưu complement sai chiều hoặc trả values thay vì indices.
- Quên duplicate values vẫn có thể là đáp án.
