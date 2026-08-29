# Solution / Lời giải — 502. IPO

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Mỗi project có capital requirement và profit. Ở current capital w, chỉ projects requirement<=w là feasible; trong số feasible, chọn profit lớn nhất tăng capital nhiều nhất và không làm giảm lựa chọn tương lai.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Mỗi round scan toàn projects O(k*n). Sort projects theo capital rồi dùng max-heap profits: pointer đưa tất cả newly feasible projects vào heap một lần, mỗi round poll best profit.

**State / invariant / data structure cần hiểu trước code.** Pointer i phân chia sorted projects: trước i đã trở thành feasible/được heap xử lý; maxHeap chứa profits của feasible chưa chọn. Invariant heap top là project tốt nhất có thể chọn ngay với current capital.

**Dry run mental theo implementation.** k=2,w=0, capital[0,1,1], profits[1,2,3]: add project0 profit1, choose->w1; now add profits2,3, choose3 ->w4, final4.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là push infeasible profits hoặc chọn lowest capital thay highest profit. Khi nào dùng: repeated choose-best-among-items-that-become-feasible = sort by eligibility + heap by reward.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Use a min-heap to reveal newly affordable projects by required capital and a max-heap to choose the highest profit among all currently affordable projects.

## 2. Optimal Java solution

```java
import java.util.PriorityQueue;

class Solution {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        // byCapital stores projects not yet affordable; byProfit stores every project
        // currently affordable, ordered by the profit we would gain immediately.
        PriorityQueue<int[]> byCapital = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> byProfit = new PriorityQueue<>((a, b) -> Integer.compare(b, a));

        for (int i = 0; i < profits.length; i++) {
            byCapital.offer(new int[]{capital[i], profits[i]});
        }

        for (int round = 0; round < k; round++) {
            // Capital only increases, so once a project becomes affordable it stays
            // affordable and can move permanently into the profit candidate heap.
            while (!byCapital.isEmpty() && byCapital.peek()[0] <= w) {
                byProfit.offer(byCapital.poll()[1]);
            }

            if (byProfit.isEmpty()) {
                // No currently feasible project means no future round can increase w.
                break;
            }

            // Among feasible projects, taking maximum profit is greedily safe: it
            // produces at least as much next capital as any other choice and therefore
            // cannot make the future feasible-project set smaller.
            w += byProfit.poll();
        }
        return w;
    }
}
```

## 3. Correctness

At each round `byProfit` contains exactly all affordable unchosen projects. Choosing its maximum profit yields capital at least as high as any alternative feasible choice, so it cannot reduce future options; applying this exchange argument each round gives maximum final capital.

## 4. Complexity

`O(n log n + k log n)` time and `O(n)` heap space.
