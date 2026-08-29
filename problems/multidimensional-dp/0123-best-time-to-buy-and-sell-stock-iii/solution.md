# Solution / Lời giải — 123. Best Time to Buy and Sell Stock III

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Stock III cho tối đa hai transactions. Thay vì enumerate ngày mua/bán, ta theo dõi bốn trạng thái sau mỗi price: best cash sau buy1, sell1, buy2 và sell2.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Brute force split point và best trade hai phía có thể O(n) với arrays nhưng thêm space. State-machine DP cập nhật bốn best-so-far values trong một pass O(1) space.

**State / invariant / data structure cần hiểu trước code.** buy1=max cash khi giữ sau first buy; sell1=max cash sau first sell; buy2=max cash khi giữ sau second buy (funded by sell1); sell2=max cash sau second sell. Mỗi state chọn giữ cũ hoặc transition hôm nay.

**Dry run mental theo implementation.** Prices [3,3,5,0,0,3,1,4]: state updates cuối cùng sell2=6, tương ứng buy0 sell3 profit3 rồi buy1 sell4 profit3; transitions giữ tốt nhất dù exact days không lưu.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là update buy2 từ0-price thay vì sell1-price. Khi nào dùng: số transaction nhỏ cố định thường unroll holding/not-holding DP thành vài scalar states.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Compress the transaction DP into four states: best balance after first buy, first sell, second buy, and second sell. Each price either leaves a state unchanged or performs its next action.

## 2. Optimal Java solution

```java
class Solution {
    public int maxProfit(int[] prices) {
        // Each state is the best cash balance after a particular action count:
        // buy1 = holding after first buy, sell1 = flat after first sell, etc.
        int buy1 = Integer.MIN_VALUE / 4;
        int sell1 = 0;
        int buy2 = Integer.MIN_VALUE / 4;
        int sell2 = 0;

        for (int price : prices) {
            // Keep the best previous state or perform the corresponding action today.
            // Same-day transitions are harmless: buy then sell at one price adds zero
            // profit and simply represents using fewer than two effective transactions.
            buy1 = Math.max(buy1, -price);
            sell1 = Math.max(sell1, buy1 + price);
            buy2 = Math.max(buy2, sell1 - price);
            sell2 = Math.max(sell2, buy2 + price);
        }

        // sell2 represents the best profit after at most two completed transactions.
        return sell2;
    }
}
```

## 3. Correctness

Each state records the best possible cash after its action prefix. For every price the recurrence considers both not acting and performing the next legal action; induction over days therefore preserves the optimum for all four states, and `sell2` is the best result with at most two transactions.

## 4. Complexity

`O(n)` time, `O(1)` space.
